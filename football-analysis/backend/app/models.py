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
    # Stable tracking IDs associated with this event within the analyzed video.
    player_track_ids: list[int] = Field(default_factory=list, sa_column=Column(JSON))

    # Pitch position (metres) for spatial filtering / the interactive pitch.
    # `coord_source` records how it was obtained so the UI stays honest:
    #   "cv"     -> derived from the tracked ball at the event time (APPROXIMATE,
    #               needs calibration); shown with the Approx. CV badge.
    #   "manual" -> the analyst placed it on the pitch (authoritative). A manual
    #               coord is never overwritten by the CV backfill.
    # None on both axes means the event has no location yet.
    pitch_x: Optional[float] = None
    pitch_y: Optional[float] = None
    coord_source: Optional[str] = None  # "cv" | "manual" | None

    created_at: datetime = Field(default_factory=_utcnow)

    video: Optional[Video] = Relationship(back_populates="events")
    category: Optional[Category] = Relationship(back_populates="events")


class Preset(SQLModel, table=True):
    """A saved workspace preset: a named Filter snapshot that snaps the whole
    workspace (timeline, event list, pitch) into an analysis task — e.g.
    "Final-third entries", "AI suggestions to review".

    ``filter`` holds the UI Filter shape (source, categoryIds, descriptors,
    zones, playerTrackId, text) as JSON and is applied client-side, so the
    backend stays agnostic to the exact filter fields.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(foreign_key="project.id", index=True)
    name: str
    filter: dict = Field(default_factory=dict, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=_utcnow)


class TrackFrame(SQLModel, table=True):
    """One sampled frame of tracking data, indexed for windowed access.

    The per-video tracks JSON stays the source of truth for whole-match work;
    this table mirrors it one row per frame so a time window is an indexed query
    on ``(video_id, t_ms)`` instead of reading and parsing the entire file. It is
    a derived cache — rebuilt from the JSON on demand — so it never becomes a
    second source of truth. ``data`` holds the frame dict (``{t_ms, dets}``).
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    video_id: int = Field(foreign_key="video.id", index=True)
    t_ms: int = Field(index=True)
    data: dict = Field(default_factory=dict, sa_column=Column(JSON))


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
