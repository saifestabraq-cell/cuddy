"""Findings: analyst observations linked to their supporting evidence.

A Finding references events (by id) plus an optional time range; it never
duplicates event data. This is the lightweight substrate for reporting.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..config import settings
from ..db import get_session
from ..models import Category, Event, Finding, Video
from ..schemas import FindingCreate

router = APIRouter(tags=["findings"])


@router.get("/videos/{video_id}/findings", response_model=list[Finding])
def list_findings(video_id: int, session: Session = Depends(get_session)):
    stmt = (
        select(Finding)
        .where(Finding.video_id == video_id)
        .order_by(Finding.created_at.desc())
    )
    return session.exec(stmt).all()


@router.post("/videos/{video_id}/findings", response_model=Finding, status_code=201)
def create_finding(
    video_id: int, payload: FindingCreate, session: Session = Depends(get_session)
):
    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    if not payload.title.strip():
        raise HTTPException(422, "A finding needs a title")
    finding = Finding(video_id=video_id, **payload.model_dump())
    session.add(finding)
    session.commit()
    session.refresh(finding)
    return finding


@router.delete("/findings/{finding_id}", status_code=204)
def delete_finding(finding_id: int, session: Session = Depends(get_session)):
    finding = session.get(Finding, finding_id)
    if not finding:
        raise HTTPException(404, "Finding not found")
    session.delete(finding)
    session.commit()


def _match_summary(video_id: int) -> dict | None:
    """Compact, validated match facts from the saved API-Football data, if any."""
    path = settings.tracks_dir / f"{video_id}_matchdata.json"
    if not path.exists():
        return None
    try:
        d = json.loads(path.read_text(encoding="utf-8"))
    except (ValueError, OSError):
        return None
    return {
        "competition": d.get("competition"),
        "date": d.get("date"),
        "score": d.get("score"),
        "home": (d.get("home") or {}).get("name"),
        "away": (d.get("away") or {}).get("name"),
        "source": "official_match_data",
    }


@router.get("/videos/{video_id}/report")
def build_report(video_id: int, session: Session = Depends(get_session)):
    """Assemble a structured report payload: match facts + findings with their
    evidence resolved to real event clips. Structured JSON first (spec §56) —
    a publishing engine can render this later."""
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(404, "Video not found")

    cats = {c.id: c.name for c in session.exec(select(Category)).all() if c.id}
    events = {
        e.id: e
        for e in session.exec(select(Event).where(Event.video_id == video_id)).all()
    }

    def code_of(e: Event) -> str:
        return (cats.get(e.category_id) if e.category_id else None) or e.label or "Event"

    findings = session.exec(
        select(Finding)
        .where(Finding.video_id == video_id)
        .order_by(Finding.created_at.desc())
    ).all()

    def clips_for(ids: list[int]) -> list[dict]:
        out = []
        for eid in ids:
            e = events.get(eid)
            if e:
                out.append({
                    "event_id": e.id,
                    "label": code_of(e),
                    "start_ms": e.start_ms,
                    "end_ms": e.end_ms,
                    "source": e.source,
                })
        return out

    return {
        "title": video.name,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "match": _match_summary(video_id),
        "findings": [
            {
                "id": f.id,
                "title": f.title,
                "description": f.description,
                "start_ms": f.start_ms,
                "end_ms": f.end_ms,
                "clips": clips_for(f.event_ids),
            }
            for f in findings
        ],
        "notes": "Cuddy-derived clips reference the analyst's coded events; "
        "CV-derived spatial metrics are approximate, not official data.",
    }
