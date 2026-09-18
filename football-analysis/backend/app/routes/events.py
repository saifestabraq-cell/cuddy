"""Event (timeline tag) CRUD + provenance and review actions.

Manual and AI events share this endpoint set — one canonical Event model — so
filtering by `source` is how the AI-suggested tags are reviewed separately.

Edits append an immutable EventRevision (before/after values) so an AI
suggestion is never silently overwritten; accept/reject drive the review
workflow; EventRelation links events into sequences.
"""

from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models import Event, EventRelation, EventRevision
from ..schemas import EventCreate, EventRelationCreate, EventUpdate

router = APIRouter(prefix="/events", tags=["events"])

# Event fields whose changes are worth recording in the provenance trail.
_TRACKED_FIELDS = (
    "category_id",
    "label",
    "start_ms",
    "end_ms",
    "notes",
    "descriptors",
    "reviewed",
)


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _record_revision(
    session: Session,
    event: Event,
    changes: dict,
    *,
    actor_type: str = "manual",
    reason: str = "",
) -> None:
    """Append a revision capturing only the fields that actually changed.

    Call BEFORE mutating `event`, passing the incoming changes; no-op writes
    (same value) are skipped so the history stays meaningful.
    """
    previous: dict = {}
    new: dict = {}
    for key, value in changes.items():
        if key not in _TRACKED_FIELDS:
            continue
        current = getattr(event, key, None)
        if current != value:
            previous[key] = current
            new[key] = value
    if not new:
        return
    session.add(
        EventRevision(
            event_id=event.id,
            previous_values=previous,
            new_values=new,
            actor_type=actor_type,
            reason=reason,
        )
    )


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
    _record_revision(session, event, changes, reason="edit")
    for key, value in changes.items():
        setattr(event, key, value)
    event.updated_at = _utcnow()
    session.add(event)
    session.commit()
    session.refresh(event)
    return event


@router.post("/{event_id}/accept", response_model=Event)
def accept_event(event_id: int, session: Session = Depends(get_session)):
    """Mark an AI suggestion as reviewed/accepted (keeps it on the timeline)."""
    event = session.get(Event, event_id)
    if not event:
        raise HTTPException(404, "Event not found")
    _record_revision(
        session, event, {"reviewed": True}, actor_type="manual", reason="accept"
    )
    event.reviewed = True
    event.updated_at = _utcnow()
    session.add(event)
    session.commit()
    session.refresh(event)
    return event


@router.post("/{event_id}/reject", status_code=204)
def reject_event(event_id: int, session: Session = Depends(get_session)):
    """Reject a suggestion: removes the event (and its revision trail) from the
    timeline. The analyst has judged it wrong."""
    event = session.get(Event, event_id)
    if not event:
        raise HTTPException(404, "Event not found")
    session.delete(event)
    session.commit()


@router.get("/{event_id}/revisions", response_model=list[EventRevision])
def list_revisions(event_id: int, session: Session = Depends(get_session)):
    """Provenance trail for an event, newest first."""
    stmt = (
        select(EventRevision)
        .where(EventRevision.event_id == event_id)
        .order_by(EventRevision.created_at.desc())
    )
    return session.exec(stmt).all()


@router.delete("/{event_id}", status_code=204)
def delete_event(event_id: int, session: Session = Depends(get_session)):
    event = session.get(Event, event_id)
    if not event:
        raise HTTPException(404, "Event not found")
    session.delete(event)
    session.commit()


# --- Relations (event sequences) ---


@router.get("/{event_id}/relations", response_model=list[EventRelation])
def list_relations(event_id: int, session: Session = Depends(get_session)):
    stmt = select(EventRelation).where(
        (EventRelation.from_event_id == event_id)
        | (EventRelation.to_event_id == event_id)
    )
    return session.exec(stmt).all()


@router.post("/relations", response_model=EventRelation, status_code=201)
def create_relation(
    payload: EventRelationCreate, session: Session = Depends(get_session)
):
    for eid in (payload.from_event_id, payload.to_event_id):
        if not session.get(Event, eid):
            raise HTTPException(404, f"Event {eid} not found")
    relation = EventRelation(**payload.model_dump())
    session.add(relation)
    session.commit()
    session.refresh(relation)
    return relation


@router.delete("/relations/{relation_id}", status_code=204)
def delete_relation(relation_id: int, session: Session = Depends(get_session)):
    relation = session.get(EventRelation, relation_id)
    if not relation:
        raise HTTPException(404, "Relation not found")
    session.delete(relation)
    session.commit()
