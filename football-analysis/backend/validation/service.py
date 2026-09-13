"""Bridge the harness to the app's data: score a video's AI events against its
manually-coded events (the reference), plus xG calibration when shots carry
outcomes.
"""

from __future__ import annotations

import json
from pathlib import Path

from sqlmodel import Session, select

from app.config import settings
from app.models import Category, Event

from .harness import format_report, score_events, score_xg


def _code(ev: Event, cats: dict[int, str]) -> str:
    return (cats.get(ev.category_id) if ev.category_id else None) or ev.label or "Event"


def _shot_outcomes(video_id: int, events: list[Event]) -> list[dict]:
    """Pair detected shots with a labeled goal/no-goal outcome, when the analyst
    has coded a 'Goal' event overlapping the shot. No goals coded -> no labels."""
    shots_path = settings.tracks_dir / f"{video_id}_shots.json"
    if not shots_path.is_file():
        return []
    shots = json.loads(shots_path.read_text()).get("shots", [])
    goals = [
        e for e in events
        if "goal" in (e.label or "").lower() and e.source == "manual"
    ]
    out = []
    for s in shots:
        t = s["t_ms"]
        is_goal = any(g.start_ms - 3000 <= t <= g.end_ms + 3000 for g in goals)
        if goals:  # only label outcomes if the analyst coded goals
            out.append({"xg": s["xg"], "goal": is_goal})
    return out


def build_validation(video_id: int, session: Session) -> dict:
    cats = {c.id: c.name for c in session.exec(select(Category)).all() if c.id}
    events = session.exec(select(Event).where(Event.video_id == video_id)).all()

    ref = [
        {"code": _code(e, cats), "start_ms": e.start_ms, "end_ms": e.end_ms}
        for e in events if e.source == "manual"
    ]
    pred = [
        {"code": _code(e, cats), "start_ms": e.start_ms, "end_ms": e.end_ms}
        for e in events if e.source == "ai"
    ]

    event_scores = score_events(ref, pred)
    xg_scores = score_xg(_shot_outcomes(video_id, events))
    return {
        "video_id": video_id,
        "events": event_scores,
        "xg": xg_scores,
        "report": format_report(event_scores, xg_scores),
    }


def write_report(result: dict) -> Path:
    """Persist a run's report so parameter/model changes can be compared over time."""
    runs_dir = settings.data_dir / "validation"
    runs_dir.mkdir(parents=True, exist_ok=True)
    from datetime import datetime, timezone

    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    path = runs_dir / f"video{result['video_id']}_{stamp}.json"
    path.write_text(json.dumps(result, indent=2))
    return path
