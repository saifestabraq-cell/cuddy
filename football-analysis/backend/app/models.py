"""Data model.

The core Nacsport-style concepts:
  Project    -- a body of analysis work (a team, a season, a set of matches)
  Video      -- an imported match/clip belonging to a project
  Category   -- a coding "button" (e.g. Shot, Pass, Corner) with colour + hotkey
  Event      -- a tagged moment on a video's timeline, linked to a Category

The Event.source field is what unifies manual and AI workflows: an AI model can
insert events with source="ai" and a confidence score, and the analyst reviews
and corrects them on the exact same timeline as manually coded events.

NOTE: `from __future__ import annotations` is intentionally NOT used here.
It would stringify the Relationship type hints in a way SQLAlchemy cannot
resolve, breaking mapper configuration.
"""

from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Column, JSON
from sqlmodel import Field, Relationship, SQLModel


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: str = ""
    created_at: datetime = Field(default_factory=_utcnow)

    videos: list["Video"] = Relationship(back_populates="project")
    categories: list["Category"] = Relationship(back_populates="project")


class Video(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(foreign_key="project.id", index=True)
    name: str
    # Absolute path on disk. Phase 0 references clips in place; a later phase may
    # copy/transcode them into the app media dir.
    path: str
    # Probed lazily; may be None until the player or ffprobe reports them.
    duration_ms: Optional[int] = None
    fps: Optional[float] = None
    width: Optional[int] = None
    height: Optional[int] = None
    created_at: datetime = Field(default_factory=_utcnow)

    project: Optional[Project] = Relationship(back_populates="videos")
    events: list["Event"] = Relationship(back_populates="video")


class DescriptorGroup(SQLModel, table=True):
    """A named group of descriptor buttons (e.g. "Outcome", "Zone", "Player")."""

    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(foreign_key="project.id", index=True)
    name: str
    sort_order: int = 0

    descriptors: list["Descriptor"] = Relationship(back_populates="group")


class Descriptor(SQLModel, table=True):
    """A single descriptor label within a group (e.g. "goal", "left wing")."""

    id: Optional[int] = Field(default=None, primary_key=True)
    group_id: int = Field(foreign_key="descriptorgroup.id", index=True)
    label: str
    color: Optional[str] = None
    sort_order: int = 0

    group: Optional[DescriptorGroup] = Relationship(back_populates="descriptors")


class Category(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(foreign_key="project.id", index=True)
    name: str
    color: str = "#6EE7D6"  # default soft teal accent
    hotkey: Optional[str] = None
    # Default seconds captured before/after the click when coding live.
    lead_ms: int = 5000
    lag_ms: int = 3000
    sort_order: int = 0

    project: Optional[Project] = Relationship(back_populates="categories")
    events: list["Event"] = Relationship(back_populates="category")


class Event(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    video_id: int = Field(foreign_key="video.id", index=True)
    category_id: Optional[int] = Field(default=None, foreign_key="category.id", index=True)

    label: str = ""
    start_ms: int
    end_ms: int
    notes: str = ""
    # Free-form descriptor tags (e.g. ["left wing", "player 9", "counter"]).
    descriptors: list[str] = Field(default_factory=list, sa_column=Column(JSON))

    # "manual" | "ai" — drives review workflow and UI treatment.
    source: str = "manual"
    # 0..1 for AI-generated events; None for manual.
    confidence: Optional[float] = None
    # Set true once an analyst has reviewed an AI event.
    reviewed: bool = False
    # Auto-detector subtype (e.g. "shot", "turnover", "counter") for events
    # produced by the Phase 3 pipeline; None for manual or hand-triggered events.
    # Lets re-analysis refresh only unreviewed auto events without touching the
    # analyst's manual or accepted ones.
    detector: Optional[str] = None
    # Which analysis run produced this event (for AI events); None for manual.
    # Lets derived outputs be traced to the run/config that generated them.
    analysis_run_id: Optional[int] = Field(
        default=None, foreign_key="analysisrun.id", index=True
    )

    created_at: datetime = Field(default_factory=_utcnow)
    updated_at: datetime = Field(default_factory=_utcnow)

    video: Optional[Video] = Relationship(back_populates="events")
    category: Optional[Category] = Relationship(back_populates="events")
    revisions: list["EventRevision"] = Relationship(
        back_populates="event",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


class EventRevision(SQLModel, table=True):
    """An immutable record of one change to an Event.

    Every edit an analyst (or the system) makes to an Event appends a revision
    holding the before/after values, so an AI suggestion is never silently
    destroyed when it is corrected — the original is recoverable from history.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    event_id: int = Field(foreign_key="event.id", index=True)
    previous_values: dict = Field(default_factory=dict, sa_column=Column(JSON))
    new_values: dict = Field(default_factory=dict, sa_column=Column(JSON))
    actor_type: str = "manual"  # "manual" | "system"
    reason: str = ""
    created_at: datetime = Field(default_factory=_utcnow)

    event: Optional[Event] = Relationship(back_populates="revisions")


class EventRelation(SQLModel, table=True):
    """A typed link between two Events (e.g. a recovery that leads to a shot).

    Powers lightweight sequence queries ("possessions ending in a shot") without
    a second analytics system — relationships are data, not LLM inference.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    from_event_id: int = Field(foreign_key="event.id", index=True)
    to_event_id: int = Field(foreign_key="event.id", index=True)
    # e.g. follows | causes | assist_for | shot_from | turnover_to |
    # possession_start | possession_end | same_sequence | related_clip
    relation_type: str
    created_at: datetime = Field(default_factory=_utcnow)


class Finding(SQLModel, table=True):
    """An analyst-saved observation linked to its evidence.

    e.g. "Repeated left-side turnovers in the first phase" tied to the events
    and time range that support it. The lightweight basis for report generation
    — it references events rather than duplicating them.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    video_id: int = Field(foreign_key="video.id", index=True)
    title: str
    description: str = ""
    event_ids: list[int] = Field(default_factory=list, sa_column=Column(JSON))
    start_ms: Optional[int] = None
    end_ms: Optional[int] = None
    created_at: datetime = Field(default_factory=_utcnow)


class AnalysisRun(SQLModel, table=True):
    """Durable state for a staged analysis pipeline (triage -> events -> spatial).

    Persisted to SQLite so a run survives a process restart: on startup any run
    still marked running/pending is re-launched and skips the stages already in
    ``completed_stages``.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    video_id: int = Field(foreign_key="video.id", index=True)
    kind: str = "analyze"
    status: str = "pending"  # pending | running | done | error
    stage: str = ""  # stage currently running (or last run)
    completed_stages: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    progress: float = 0.0
    message: str = ""
    error: Optional[str] = None
    created_at: datetime = Field(default_factory=_utcnow)
    updated_at: datetime = Field(default_factory=_utcnow)
