"""Export a video's events.

Two formats:
  - SportsCode / Nacsport-compatible XML (ALL_INSTANCES), the lingua franca of
    performance-analysis tools, so work here can round-trip with the industry.
  - CSV for spreadsheets / quick analysis.
"""

from __future__ import annotations

import csv
import io
from xml.etree.ElementTree import Element, SubElement, tostring

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlmodel import Session, select

from ..db import get_session
from ..models import Category, Event, Video
from ..schemas import SelectionExport

router = APIRouter(prefix="/export", tags=["export"])


def _load(
    video_id: int, session: Session, event_ids: list[int] | None = None
) -> tuple[Video, list[Event], dict[int, Category]]:
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(404, "Video not found")
    stmt = select(Event).where(Event.video_id == video_id)
    if event_ids is not None:
        stmt = stmt.where(Event.id.in_(event_ids))  # type: ignore[attr-defined]
    events = session.exec(stmt.order_by(Event.start_ms)).all()
    cats = {c.id: c for c in session.exec(select(Category)).all() if c.id is not None}
    return video, events, cats


def _labelled(parent: Element, group: str, text: str) -> None:
    """A SportsCode/Nacsport <label><group/><text/></label> tag — the standard
    way extra metadata rides along an instance, so provenance round-trips."""
    label = SubElement(parent, "label")
    SubElement(label, "group").text = group
    SubElement(label, "text").text = text


def _build_xml(video: Video, events: list[Event], cats: dict[int, Category]) -> bytes:
    root = Element("file")
    instances = SubElement(root, "ALL_INSTANCES")
    for i, ev in enumerate(events, start=1):
        inst = SubElement(instances, "instance")
        SubElement(inst, "ID").text = str(i)
        SubElement(inst, "start").text = f"{ev.start_ms / 1000:.2f}"
        SubElement(inst, "end").text = f"{ev.end_ms / 1000:.2f}"
        code = cats[ev.category_id].name if ev.category_id in cats else (ev.label or "Event")
        SubElement(inst, "code").text = code
        for descriptor in ev.descriptors:
            label = SubElement(inst, "label")
            SubElement(label, "text").text = descriptor
        # Provenance rides as grouped labels so the origin of each event survives
        # the export (and is honest about being Cuddy-derived, not official).
        _labelled(inst, "source", ev.source)
        if ev.detector:
            _labelled(inst, "detector", ev.detector)
        if ev.confidence is not None:
            _labelled(inst, "confidence", f"{ev.confidence:.3f}")
        _labelled(inst, "reviewed", "true" if ev.reviewed else "false")
    return b'<?xml version="1.0" encoding="UTF-8"?>\n' + tostring(root, encoding="utf-8")


def _build_csv(events: list[Event], cats: dict[int, Category]) -> str:
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(
        ["id", "code", "category", "label", "start_s", "end_s", "duration_s",
         "descriptors", "source", "detector", "confidence", "reviewed", "notes"]
    )
    for ev in events:
        code = cats[ev.category_id].name if ev.category_id in cats else ""
        writer.writerow([
            ev.id, code, code, ev.label,
            f"{ev.start_ms / 1000:.2f}", f"{ev.end_ms / 1000:.2f}",
            f"{(ev.end_ms - ev.start_ms) / 1000:.2f}",
            "; ".join(ev.descriptors), ev.source, ev.detector or "",
            "" if ev.confidence is None else f"{ev.confidence:.3f}",
            "true" if ev.reviewed else "false", ev.notes,
        ])
    return buf.getvalue()


def _xml_response(name: str, data: bytes) -> Response:
    filename = f"{name or 'video'}.xml".replace(" ", "_")
    return Response(
        content=data, media_type="application/xml",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


def _csv_response(name: str, data: str) -> Response:
    filename = f"{name or 'video'}.csv".replace(" ", "_")
    return Response(
        content=data, media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/videos/{video_id}/xml")
def export_xml(video_id: int, session: Session = Depends(get_session)):
    video, events, cats = _load(video_id, session)
    return _xml_response(video.name, _build_xml(video, events, cats))


@router.get("/videos/{video_id}/csv")
def export_csv(video_id: int, session: Session = Depends(get_session)):
    video, events, cats = _load(video_id, session)
    return _csv_response(video.name, _build_csv(events, cats))


@router.post("/selection/xml")
def export_selection_xml(payload: SelectionExport, session: Session = Depends(get_session)):
    """Export a chosen subset of events (a highlight playlist) as XML."""
    video, events, cats = _load(payload.video_id, session, payload.event_ids)
    return _xml_response(f"{video.name}_selection", _build_xml(video, events, cats))


@router.post("/selection/csv")
def export_selection_csv(payload: SelectionExport, session: Session = Depends(get_session)):
    video, events, cats = _load(payload.video_id, session, payload.event_ids)
    return _csv_response(f"{video.name}_selection", _build_csv(events, cats))
