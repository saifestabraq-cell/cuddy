"""Video analysis endpoints (Phase 2a).

POST /videos/{id}/analyze   -> start a background detection+tracking job
GET  /jobs/{job_id}         -> poll job status/progress
GET  /videos/{id}/tracks    -> fetch the tracking result (boxes per frame)
GET  /videos/{id}/tracks/exists -> lightweight check
"""

from __future__ import annotations

import json
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlmodel import Session

from ..config import settings
from ..cv.analytics import compute_analytics
from ..cv.pipeline import analyze_video
from ..cv.pitch import autotag_final_third, build_pitch_data
from ..cv.shots import detect_shots
from ..db import get_session
from ..jobs import Job, get_job, start_job
from ..models import Event, Video
from ..schemas import CalibrateRequest

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
def start_analysis(
    video_id: int,
    target_fps: float = 5.0,
    model: str = "yolov8n.pt",
    session: Session = Depends(get_session),
):
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(404, "Video not found")
    if not Path(video.path).is_file():
        raise HTTPException(410, "Underlying file is missing")

    out_path = str(_tracks_path(video_id))
    src = video.path

    def target(job: Job) -> dict:
        def progress(p: float, msg: str) -> None:
            job.progress = p
            job.message = msg

        return analyze_video(
            src, out_path, target_fps=target_fps, model_name=model, progress=progress
        )

    job = start_job("analyze", target, meta={"video_id": video_id})
    return job.as_dict()


@router.get("/jobs/{job_id}")
def job_status(job_id: str):
    job = get_job(job_id)
    if not job:
        raise HTTPException(404, "Job not found")
    return job.as_dict()


@router.get("/videos/{video_id}/tracks/exists")
def tracks_exist(video_id: int):
    return {"exists": _tracks_path(video_id).is_file()}


@router.get("/videos/{video_id}/tracks")
def get_tracks(video_id: int):
    path = _tracks_path(video_id)
    if not path.is_file():
        raise HTTPException(404, "No analysis for this video yet")
    return FileResponse(path, media_type="application/json")


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
