"""Durable, staged, resumable analysis pipeline.

Stages run in order: ``triage`` -> ``events`` -> ``spatial``. Each stage writes
its output to disk under the video's data dir and records completion in the
``AnalysisRun`` row. A run interrupted by a crash resumes from the last completed
stage (stages already in ``completed_stages`` are skipped), and any run left
``running``/``pending`` is re-launched on startup by :func:`resume_incomplete`.

Stage status today:
  - triage : minimal placeholder (whole video = one main-camera segment).
             Phase 2 replaces it with real shot-boundary/main-camera detection.
  - events : real YOLO detection + ByteTrack + team clustering (writes tracks).
  - spatial: skipped placeholder. Phase 7 adds per-frame homography here.
"""

from __future__ import annotations

import json
import threading
import time
from pathlib import Path
from typing import Callable

from sqlmodel import Session, select

from .config import settings
from .db import engine
from .models import AnalysisRun, Video

STAGES = ["triage", "events", "spatial"]

# Overall-progress slice each stage occupies in [0, 1].
STAGE_SPAN = {"triage": (0.0, 0.05), "events": (0.05, 0.95), "spatial": (0.95, 1.0)}

StageProgress = Callable[[float, str], None]  # (fraction-within-stage, message)


def tracks_path(video_id: int) -> Path:
    return settings.tracks_dir / f"{video_id}.json"


def segments_path(video_id: int) -> Path:
    return settings.tracks_dir / f"{video_id}_segments.json"


# --------------------------------------------------------------------------- #
# Persistence helpers
# --------------------------------------------------------------------------- #

def _touch(run: AnalysisRun, session: Session) -> None:
    from datetime import datetime, timezone

    run.updated_at = datetime.now(timezone.utc)
    session.add(run)
    session.commit()


def run_as_dict(run: AnalysisRun) -> dict:
    """Job-compatible shape for the frontend poller, plus stage detail."""
    return {
        "id": str(run.id),
        "kind": run.kind,
        "status": run.status,
        "stage": run.stage,
        "completed_stages": run.completed_stages,
        "stages": STAGES,
        "progress": round(run.progress, 3),
        "message": run.message,
        "error": run.error,
        "result": None,
        "meta": {"video_id": run.video_id},
    }


# --------------------------------------------------------------------------- #
# Stage implementations
# --------------------------------------------------------------------------- #

def _stage_triage(video: Video, progress: StageProgress) -> None:
    """Placeholder: treat the whole clip as one main-camera segment.

    Marked ``placeholder`` so the UI can label it honestly until Phase 2 ships
    real shot-boundary + main-camera classification.
    """
    progress(0.5, "Segmenting footage")
    dur = video.duration_ms or 0
    data = {
        "video_id": video.id,
        "placeholder": True,
        "segments": [{"start_ms": 0, "end_ms": dur, "class": "main", "confidence": None}],
    }
    p = segments_path(video.id)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(data))
    progress(1.0, "Footage segmented")


def _stage_events(video: Video, progress: StageProgress) -> None:
    """Real detection + tracking + team clustering (writes the tracks JSON)."""
    if not Path(video.path).is_file():
        raise FileNotFoundError(
            f"Source file missing: {video.path}. Relink the video and re-run."
        )
    from .cv.pipeline import analyze_video  # heavy import, kept lazy

    analyze_video(
        video.path,
        str(tracks_path(video.id)),
        target_fps=5.0,
        progress=lambda p, m: progress(p, m),
    )


def _stage_spatial(video: Video, progress: StageProgress) -> None:
    """Placeholder: spatial registration is Phase 7. Skipped for now."""
    progress(1.0, "Spatial layer skipped (Phase 7)")


STAGE_FNS: dict[str, Callable[[Video, StageProgress], None]] = {
    "triage": _stage_triage,
    "events": _stage_events,
    "spatial": _stage_spatial,
}


# --------------------------------------------------------------------------- #
# Runner
# --------------------------------------------------------------------------- #

def _run_pipeline(run_id: int) -> None:
    with Session(engine) as session:
        run = session.get(AnalysisRun, run_id)
        if not run:
            return
        video = session.get(Video, run.video_id)
        if not video:
            run.status = "error"
            run.error = "Video not found"
            _touch(run, session)
            return

        run.status = "running"
        run.error = None
        _touch(run, session)
        completed = set(run.completed_stages or [])
        last_write = 0.0

        for stage in STAGES:
            if stage in completed:
                continue
            run.stage = stage
            lo, hi = STAGE_SPAN[stage]

            def progress(frac: float, msg: str, _lo=lo, _hi=hi) -> None:
                nonlocal last_write
                run.progress = _lo + (_hi - _lo) * max(0.0, min(1.0, frac))
                run.message = msg
                now = time.time()
                if now - last_write > 1.0:  # throttle DB writes
                    last_write = now
                    _touch(run, session)

            try:
                STAGE_FNS[stage](video, progress)
            except Exception as exc:  # noqa: BLE001 - surface stage failure to client
                run.status = "error"
                run.error = f"{type(exc).__name__}: {exc}"
                _touch(run, session)
                return

            completed.add(stage)
            run.completed_stages = sorted(completed, key=STAGES.index)
            run.progress = hi
            _touch(run, session)

        run.status = "done"
        run.stage = ""
        run.progress = 1.0
        run.message = "Analysis complete"
        _touch(run, session)


def _launch(run_id: int) -> None:
    threading.Thread(target=_run_pipeline, args=(run_id,), daemon=True).start()


def start_analysis(session: Session, video_id: int) -> AnalysisRun:
    """Create or resume a run for the video, then launch it on a worker thread."""
    existing = session.exec(
        select(AnalysisRun)
        .where(AnalysisRun.video_id == video_id)
        .order_by(AnalysisRun.id.desc())  # type: ignore[attr-defined]
    ).first()

    if existing and existing.status in ("pending", "running", "error"):
        run = existing  # resume from completed_stages
        run.status = "pending"
        run.error = None
    else:
        run = AnalysisRun(video_id=video_id, status="pending")
        session.add(run)
    session.commit()
    session.refresh(run)
    _launch(run.id)
    return run


def get_run(session: Session, run_id: int) -> AnalysisRun | None:
    return session.get(AnalysisRun, run_id)


def resume_incomplete() -> None:
    """On startup, re-launch any run left running/pending by a crash."""
    with Session(engine) as session:
        stuck = session.exec(
            select(AnalysisRun).where(AnalysisRun.status.in_(["running", "pending"]))  # type: ignore[attr-defined]
        ).all()
        for run in stuck:
            _launch(run.id)
