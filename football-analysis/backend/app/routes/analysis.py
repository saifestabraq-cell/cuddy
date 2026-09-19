"""Video analysis endpoints (Phase 2a).

POST /videos/{id}/analyze   -> start a background detection+tracking job
GET  /jobs/{job_id}         -> poll job status/progress
GET  /videos/{id}/tracks    -> fetch the tracking result (boxes per frame)
GET  /videos/{id}/tracks/exists -> lightweight check
"""

from __future__ import annotations

import json
import os
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlmodel import Session, select

from ..config import settings
from ..cv.analytics import compute_analytics
from ..cv.pitch import autotag_final_third, build_pitch_data
from ..cv.shots import detect_shots
from ..db import get_session
from ..llm import answer_question, query_clips
from ..models import Category, Event, Video
from .players import build_player_profile
from ..pipeline import get_run, run_as_dict, start_analysis as start_analysis_pipeline
from ..schemas import AskRequest, CalibrateRequest

router = APIRouter(tags=["analysis"])


def _tracks_path(video_id: int) -> Path:
    return settings.tracks_dir / f"{video_id}.json"


def _pitch_path(video_id: int) -> Path:
    return settings.tracks_dir / f"{video_id}_pitch.json"


def _analytics_path(video_id: int) -> Path:
    return settings.tracks_dir / f"{video_id}_analytics.json"


def _shots_path(video_id: int) -> Path:
    return settings.tracks_dir / f"{video_id}_shots.json"


@router.post("/videos/{video_id}/analyze")
def start_analysis(video_id: int, session: Session = Depends(get_session)):
    """Start (or resume) the durable staged pipeline for this video."""
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(404, "Video not found")
    run = start_analysis_pipeline(session, video_id)
    return run_as_dict(run)


@router.get("/jobs/{job_id}")
def job_status(job_id: str, session: Session = Depends(get_session)):
    try:
        run_id = int(job_id)
    except ValueError:
        raise HTTPException(404, "Job not found")
    run = get_run(session, run_id)
    if not run:
        raise HTTPException(404, "Job not found")
    return run_as_dict(run)


@router.get("/videos/{video_id}/tracks/exists")
def tracks_exist(video_id: int):
    return {"exists": _tracks_path(video_id).is_file()}


@router.get("/videos/{video_id}/tracks")
def get_tracks(video_id: int):
    path = _tracks_path(video_id)
    if not path.is_file():
        raise HTTPException(404, "No analysis for this video yet")
    return FileResponse(path, media_type="application/json")


@router.get("/videos/{video_id}/segments")
def get_segments(video_id: int):
    """Triage output: the camera-run segment map (main vs other)."""
    path = settings.tracks_dir / f"{video_id}_segments.json"
    if not path.is_file():
        raise HTTPException(404, "No segmentation for this video yet")
    return json.loads(path.read_text())


@router.get("/videos/{video_id}/tracks/summary")
def tracks_summary(video_id: int):
    """Lightweight summary without the (potentially large) per-frame data."""
    path = _tracks_path(video_id)
    if not path.is_file():
        raise HTTPException(404, "No analysis for this video yet")
    data = json.loads(path.read_text())
    return {k: v for k, v in data.items() if k != "frames"} | {
        "n_frames": len(data.get("frames", []))
    }


# --- Phase 2b: pitch calibration / heatmaps / auto-tagging ---


@router.post("/videos/{video_id}/calibrate")
def calibrate(video_id: int, payload: CalibrateRequest):
    """Compute homography from 4 image points and build heatmaps + distances."""
    tracks_path = _tracks_path(video_id)
    if not tracks_path.is_file():
        raise HTTPException(400, "Analyse the video before calibrating")
    tracks = json.loads(tracks_path.read_text())
    try:
        pitch = build_pitch_data(
            tracks, payload.img_points, payload.length, payload.width
        )
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc
    _pitch_path(video_id).write_text(json.dumps(pitch))
    return pitch


@router.get("/videos/{video_id}/pitch")
def get_pitch(video_id: int):
    path = _pitch_path(video_id)
    if not path.is_file():
        raise HTTPException(404, "No calibration for this video yet")
    return json.loads(path.read_text())


@router.post("/videos/{video_id}/autotag")
def autotag(video_id: int, session: Session = Depends(get_session)):
    """Generate reviewable AI events (ball in a final third) from the pitch data."""
    path = _pitch_path(video_id)
    if not path.is_file():
        raise HTTPException(400, "Calibrate the pitch before auto-tagging")
    pitch = json.loads(path.read_text())
    suggestions = autotag_final_third(pitch)

    created = 0
    for s in suggestions:
        session.add(Event(
            video_id=video_id, category_id=None, label=s["label"],
            start_ms=s["start_ms"], end_ms=s["end_ms"],
            source="ai", confidence=0.5,
        ))
        created += 1
    session.commit()
    return {"created": created}


# --- Phase 3a: possession & passing analytics ---


@router.post("/videos/{video_id}/analytics")
def compute_video_analytics(video_id: int):
    tracks_path = _tracks_path(video_id)
    if not tracks_path.is_file():
        raise HTTPException(400, "Analyse the video before computing analytics")
    tracks = json.loads(tracks_path.read_text())
    result = compute_analytics(tracks)
    _analytics_path(video_id).write_text(json.dumps(result))
    return result


@router.get("/videos/{video_id}/analytics")
def get_video_analytics(video_id: int):
    path = _analytics_path(video_id)
    if not path.is_file():
        raise HTTPException(404, "No analytics for this video yet")
    return json.loads(path.read_text())


@router.post("/videos/{video_id}/tag-turnovers")
def tag_turnovers(
    video_id: int, window_ms: int = 2000, session: Session = Depends(get_session)
):
    path = _analytics_path(video_id)
    if not path.is_file():
        raise HTTPException(400, "Compute analytics before tagging turnovers")
    data = json.loads(path.read_text())
    created = 0
    for ev in data.get("turnover_events", []):
        t = ev["t_ms"]
        label = f"Turnover (Team {'A' if ev['from_team'] == 0 else 'B'} lost ball)"
        session.add(Event(
            video_id=video_id, category_id=None, label=label,
            start_ms=max(0, t - window_ms), end_ms=t + window_ms,
            source="ai", confidence=0.5,
        ))
        created += 1
    session.commit()
    return {"created": created}


# --- Phase 3b: shots & xG ---


@router.post("/videos/{video_id}/shots")
def compute_shots(video_id: int):
    tracks_path = _tracks_path(video_id)
    pitch_path = _pitch_path(video_id)
    if not tracks_path.is_file():
        raise HTTPException(400, "Analyse the video first")
    if not pitch_path.is_file():
        raise HTTPException(400, "Calibrate the pitch before detecting shots")
    tracks = json.loads(tracks_path.read_text())
    pitch = json.loads(pitch_path.read_text())
    result = detect_shots(tracks, pitch)
    _shots_path(video_id).write_text(json.dumps(result))
    return result


@router.get("/videos/{video_id}/shots")
def get_shots(video_id: int):
    path = _shots_path(video_id)
    if not path.is_file():
        raise HTTPException(404, "No shots computed for this video yet")
    return json.loads(path.read_text())


@router.post("/videos/{video_id}/tag-shots")
def tag_shots(
    video_id: int, window_ms: int = 2500, session: Session = Depends(get_session)
):
    path = _shots_path(video_id)
    if not path.is_file():
        raise HTTPException(400, "Detect shots before tagging them")
    data = json.loads(path.read_text())
    created = 0
    for s in data.get("shots", []):
        t = s["t_ms"]
        team = "A" if s["team"] == 0 else "B" if s["team"] == 1 else "?"
        label = f"Shot (Team {team}, xG {s['xg']:.2f})"
        session.add(Event(
            video_id=video_id, category_id=None, label=label,
            start_ms=max(0, t - window_ms), end_ms=t + window_ms,
            source="ai", confidence=round(min(0.99, 0.4 + s["xg"]), 2),
        ))
        created += 1
    session.commit()
    return {"created": created}


# --- Phase 3c: natural-language query (Claude API) ---


def _build_context(video_id: int, session: Session, selected_track_id: int | None = None) -> str:
    """Compact JSON of the match's data for grounding the LLM answer."""
    cats = {c.id: c.name for c in session.exec(select(Category)).all()}
    events = session.exec(
        select(Event).where(Event.video_id == video_id).order_by(Event.start_ms)
    ).all()
    ctx: dict = {
        "events": [
            {
                "id": e.id,
                "code": cats.get(e.category_id) or e.label or "Event",
                "start_s": round(e.start_ms / 1000, 1),
                "end_s": round(e.end_ms / 1000, 1),
                "descriptors": e.descriptors,
                "source": e.source,
                "player_track_ids": e.player_track_ids,
            }
            for e in events
        ],
        "n_events": len(events),
    }
    ap = _analytics_path(video_id)
    if ap.is_file():
        a = json.loads(ap.read_text())
        ctx["possession_pct"] = a.get("possession_pct")
        ctx["passes"] = a.get("passes")
        ctx["turnovers"] = a.get("turnovers")
    pp = _pitch_path(video_id)
    if pp.is_file():
        ctx["team_distance_m"] = json.loads(pp.read_text()).get("team_distance_m")
    sp = _shots_path(video_id)
    if sp.is_file():
        s = json.loads(sp.read_text())
        ctx["team_xg"] = s.get("team_xg")
        ctx["team_shots"] = s.get("team_shots")
    ctx["teams"] = {"0": "Team A", "1": "Team B"}
    if selected_track_id is not None:
        try:
            ctx["selected_player"] = build_player_profile(video_id, selected_track_id)
        except HTTPException:
            ctx["selected_player"] = {"track_id": selected_track_id, "available": False}
    return json.dumps(ctx)


@router.post("/videos/{video_id}/ask")
def ask(video_id: int, payload: AskRequest, session: Session = Depends(get_session)):
    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    if not os.environ.get("ANTHROPIC_API_KEY"):
        raise HTTPException(
            400,
            "ANTHROPIC_API_KEY is not set on the backend. Set it in the "
            "environment and restart the API to enable natural-language queries.",
        )
    context = _build_context(video_id, session, payload.selected_track_id)
    try:
        answer = answer_question(payload.question, context)
    except Exception as exc:  # noqa: BLE001 - surface the LLM error to the client
        raise HTTPException(502, f"LLM request failed: {type(exc).__name__}: {exc}") from exc
    return {"answer": answer, "question": payload.question}


# --- Phase 5: clip-returning natural-language query ---


@router.post("/videos/{video_id}/query")
def query_video(video_id: int, payload: AskRequest, session: Session = Depends(get_session)):
    """Return a playable reel (event clips) + a one-line grounded summary."""
    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    if not os.environ.get("ANTHROPIC_API_KEY"):
        raise HTTPException(
            400,
            "ANTHROPIC_API_KEY is not set on the backend. Set it and restart to "
            "use natural-language queries.",
        )
    cats = {c.id: c.name for c in session.exec(select(Category)).all() if c.id}
    events = session.exec(
        select(Event).where(Event.video_id == video_id).order_by(Event.start_ms)
    ).all()

    def code_of(e: Event) -> str:
        return (cats.get(e.category_id) if e.category_id else None) or e.label or "Event"

    ev_list = [
        {
            "id": e.id, "code": code_of(e),
            "start_s": round(e.start_ms / 1000, 1), "end_s": round(e.end_ms / 1000, 1),
            "source": e.source, "descriptors": e.descriptors,
            "player_track_ids": e.player_track_ids,
        }
        for e in events
    ]
    try:
        query_context = {
            "events": ev_list,
            "selected_player": (
                build_player_profile(video_id, payload.selected_track_id)
                if payload.selected_track_id is not None
                else None
            ),
        }
        result = query_clips(payload.question, json.dumps(query_context))
    except Exception as exc:  # noqa: BLE001 - surface the LLM error
        raise HTTPException(502, f"LLM request failed: {type(exc).__name__}: {exc}") from exc

    by_id = {e.id: e for e in events}
    clips = []
    for c in result.get("clips", []):
        ev = by_id.get(c.get("event_id"))
        if ev:
            clips.append({
                "event_id": ev.id, "start_ms": ev.start_ms, "end_ms": ev.end_ms,
                "label": code_of(ev), "reason": str(c.get("reason", "")),
            })
    return {"summary": result.get("summary", ""), "clips": clips, "question": payload.question}


# --- Phase 1: validation harness (score AI events vs the manual reference) ---


@router.get("/videos/{video_id}/validation")
def validate_video(video_id: int, session: Session = Depends(get_session)):
    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    from validation.service import build_validation, write_report  # sibling package

    result = build_validation(video_id, session)
    try:
        write_report(result)
    except Exception:  # noqa: BLE001 - report persistence is best-effort
        pass
    return result
