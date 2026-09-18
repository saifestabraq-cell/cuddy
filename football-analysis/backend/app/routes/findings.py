"""Findings: analyst observations linked to their supporting evidence.

A Finding references events (by id) plus an optional time range; it never
duplicates event data. This is the lightweight substrate for reporting.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models import Finding, Video
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
