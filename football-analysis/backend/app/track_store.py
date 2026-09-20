"""Indexed temporal track storage.

A derived cache over the per-video tracks JSON: rows in ``trackframe`` mirror the
sampled frames, so a time window is an indexed ``(video_id, t_ms)`` query instead
of reading and parsing the whole file. The JSON remains the source of truth; this
cache is rebuilt from it on demand and can be dropped at any time.
"""

from __future__ import annotations

from sqlalchemy import func
from sqlmodel import Session, delete, select

from .models import TrackFrame


def frame_count(session: Session, video_id: int) -> int:
    return int(
        session.exec(
            select(func.count()).select_from(TrackFrame).where(
                TrackFrame.video_id == video_id
            )
        ).one()
    )


def clear(session: Session, video_id: int) -> None:
    session.exec(delete(TrackFrame).where(TrackFrame.video_id == video_id))
    session.commit()


def ingest(session: Session, video_id: int, tracks: dict) -> int:
    """(Re)build the index for one video from its tracks dict. Idempotent:
    replaces any existing rows. Returns the number of frames indexed."""
    clear(session, video_id)
    frames = tracks.get("frames", []) or []
    rows = [
        TrackFrame(video_id=video_id, t_ms=int(f.get("t_ms", 0)), data=f)
        for f in frames
    ]
    if rows:
        session.add_all(rows)
        session.commit()
    return len(rows)


def window(
    session: Session, video_id: int, start_ms: int, end_ms: int, limit: int | None = None
) -> list[dict]:
    """Frames with ``start_ms <= t_ms <= end_ms``, ordered by time — an indexed
    range scan, never a full-file read."""
    stmt = (
        select(TrackFrame)
        .where(
            TrackFrame.video_id == video_id,
            TrackFrame.t_ms >= start_ms,
            TrackFrame.t_ms <= end_ms,
        )
        .order_by(TrackFrame.t_ms)
    )
    if limit:
        stmt = stmt.limit(limit)
    return [r.data for r in session.exec(stmt).all()]
