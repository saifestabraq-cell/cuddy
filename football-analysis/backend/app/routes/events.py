"""Event (timeline tag) CRUD.

Manual and AI events share this endpoint set; filter by `source` to review the
AI-suggested tags separately.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models import Event
from ..schemas import EventCreate, EventUpdate

router = APIRouter(prefix="/events", tags=["events"])


@router.get("", response_model=list[Event])
def list_events(
    video_id: int,
    source: str | None = None,
    session: Session = Depends(get_session),
):
    stmt = select(Event).where(Event.video_id == video_id)
    if source:
        stmt = stmt.where(Event.source == source)
    return session.exec(stmt.order_by(Event.start_ms)).all()


@router.post("", response_model=Event, status_code=201)
def create_event(payload: EventCreate, session: Session = Depends(get_session)):
    event = Event(**payload.model_dump())
    session.add(event)
    session.commit()
    session.refresh(event)
    return event


@router.patch("/{event_id}", response_model=Event)
def update_event(
    event_id: int, payload: EventUpdate, session: Session = Depends(get_session)
):
    event = session.get(Event, event_id)
    if not event:
        raise HTTPException(404, "Event not found")
    changes = payload.model_dump(exclude_none=True)
    # Placing a coordinate by hand is authoritative: default coord_source to
    # "manual" so the CV backfill never overwrites the analyst's placement.
    if ("pitch_x" in changes or "pitch_y" in changes) and "coord_source" not in changes:
        changes["coord_source"] = "manual"
    for key, value in changes.items():
        setattr(event, key, value)
    session.add(event)
    session.commit()
    session.refresh(event)
    return event


@router.delete("/{event_id}", status_code=204)
def delete_event(event_id: int, session: Session = Depends(get_session)):
    event = session.get(Event, event_id)
    if not event:
        raise HTTPException(404, "Event not found")
    session.delete(event)
    session.commit()
