"""Video registration and range-capable streaming.

Phase 0 registers a clip by its absolute path (the desktop file picker in the
Tauri shell yields a real path) and streams it back with HTTP range support so
the <video> element can seek smoothly.
"""

from __future__ import annotations

import mimetypes
import re
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import FileResponse, StreamingResponse
from sqlmodel import Session, select

from ..db import get_session
from ..models import Video
from ..schemas import RelinkRequest, VideoCreate, VideoMetaUpdate

router = APIRouter(prefix="/videos", tags=["videos"])

_RANGE_RE = re.compile(r"bytes=(\d+)-(\d*)")
_CHUNK = 1024 * 1024  # 1 MiB


@router.get("", response_model=list[Video])
def list_videos(project_id: int | None = None, session: Session = Depends(get_session)):
    stmt = select(Video)
    if project_id is not None:
        stmt = stmt.where(Video.project_id == project_id)
    return session.exec(stmt.order_by(Video.created_at)).all()


@router.post("", response_model=Video, status_code=201)
def register_video(payload: VideoCreate, session: Session = Depends(get_session)):
    if not Path(payload.path).is_file():
        raise HTTPException(400, f"File not found: {payload.path}")
    video = Video(**payload.model_dump())
    session.add(video)
    session.commit()
    session.refresh(video)
    return video


@router.get("/{video_id}", response_model=Video)
def get_video(video_id: int, session: Session = Depends(get_session)):
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(404, "Video not found")
    return video


@router.patch("/{video_id}", response_model=Video)
def update_video_meta(
    video_id: int, payload: VideoMetaUpdate, session: Session = Depends(get_session)
):
    """The frontend reports duration/dimensions once the <video> loads."""
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(404, "Video not found")
    for key, value in payload.model_dump(exclude_none=True).items():
        setattr(video, key, value)
    session.add(video)
    session.commit()
    session.refresh(video)
    return video


@router.get("/{video_id}/status")
def video_status(video_id: int, session: Session = Depends(get_session)):
    """Whether the source file is still present at its recorded path.

    Derived artifacts (tracks, pitch, analytics, shots, segments) are keyed by
    video id, so they stay associated even when the source file moves — only
    playback/analysis need the file, which the relink flow restores.
    """
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(404, "Video not found")
    return {"exists": Path(video.path).is_file(), "path": video.path}


@router.post("/{video_id}/relink", response_model=Video)
def relink_video(
    video_id: int, payload: RelinkRequest, session: Session = Depends(get_session)
):
    """Point the video at a moved/renamed source file without losing its data."""
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(404, "Video not found")
    if not Path(payload.path).is_file():
        raise HTTPException(400, f"File not found: {payload.path}")
    video.path = payload.path
    session.add(video)
    session.commit()
    session.refresh(video)
    return video


@router.delete("/{video_id}", status_code=204)
def delete_video(video_id: int, session: Session = Depends(get_session)):
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(404, "Video not found")
    session.delete(video)
    session.commit()


@router.get("/{video_id}/stream")
def stream_video(video_id: int, request: Request, session: Session = Depends(get_session)):
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(404, "Video not found")
    path = Path(video.path)
    if not path.is_file():
        raise HTTPException(410, "Underlying file is missing")

    file_size = path.stat().st_size
    content_type = mimetypes.guess_type(str(path))[0] or "application/octet-stream"
    range_header = request.headers.get("range")

    # No range -> return the whole file (still advertise range support).
    if not range_header:
        return FileResponse(
            path, media_type=content_type, headers={"Accept-Ranges": "bytes"}
        )

    match = _RANGE_RE.match(range_header)
    if not match:
        raise HTTPException(416, "Invalid range header")
    start = int(match.group(1))
    end = int(match.group(2)) if match.group(2) else file_size - 1
    end = min(end, file_size - 1)
    if start > end:
        raise HTTPException(416, "Range not satisfiable")

    length = end - start + 1

    def iter_file():
        with open(path, "rb") as fh:
            fh.seek(start)
            remaining = length
            while remaining > 0:
                chunk = fh.read(min(_CHUNK, remaining))
                if not chunk:
                    break
                remaining -= len(chunk)
                yield chunk

    headers = {
        "Content-Range": f"bytes {start}-{end}/{file_size}",
        "Accept-Ranges": "bytes",
        "Content-Length": str(length),
        "Content-Type": content_type,
    }
    return StreamingResponse(iter_file(), status_code=206, headers=headers)
