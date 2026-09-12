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
from ..cv.pipeline import analyze_video
from ..db import get_session
from ..jobs import Job, get_job, start_job
from ..models import Video

router = APIRouter(tags=["analysis"])


def _tracks_path(video_id: int) -> Path:
    return settings.tracks_dir / f"{video_id}.json"


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
