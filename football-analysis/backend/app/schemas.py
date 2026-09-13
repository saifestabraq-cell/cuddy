"""Request/response payloads (kept separate from table models)."""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel


class ProjectCreate(BaseModel):
    name: str
    description: str = ""


class VideoCreate(BaseModel):
    project_id: int
    name: str
    path: str
    duration_ms: Optional[int] = None
    fps: Optional[float] = None
    width: Optional[int] = None
    height: Optional[int] = None


class VideoMetaUpdate(BaseModel):
    duration_ms: Optional[int] = None
    fps: Optional[float] = None
    width: Optional[int] = None
    height: Optional[int] = None


class RelinkRequest(BaseModel):
    path: str


class CategoryCreate(BaseModel):
    project_id: int
    name: str
    color: str = "#6EE7D6"
    hotkey: Optional[str] = None
    lead_ms: int = 5000
    lag_ms: int = 3000
    sort_order: int = 0


class EventCreate(BaseModel):
    video_id: int
    category_id: Optional[int] = None
    label: str = ""
    start_ms: int
    end_ms: int
    notes: str = ""
    descriptors: list[str] = []
    source: str = "manual"
    confidence: Optional[float] = None


class DescriptorGroupCreate(BaseModel):
    project_id: int
    name: str
    sort_order: int = 0


class DescriptorCreate(BaseModel):
    group_id: int
    label: str
    color: Optional[str] = None
    sort_order: int = 0


class DescriptorRead(BaseModel):
    id: int
    group_id: int
    label: str
    color: Optional[str] = None
    sort_order: int = 0


class DescriptorGroupRead(BaseModel):
    id: int
    project_id: int
    name: str
    sort_order: int = 0
    descriptors: list[DescriptorRead] = []


# --- Coding templates (portable category + descriptor setup) ---

class TemplateDescriptorGroup(BaseModel):
    name: str
    descriptors: list[str] = []


class TemplateCategory(BaseModel):
    name: str
    color: str = "#6EE7D6"
    hotkey: Optional[str] = None
    lead_ms: int = 5000
    lag_ms: int = 3000


class CodingTemplate(BaseModel):
    name: str = "Coding template"
    categories: list[TemplateCategory] = []
    descriptor_groups: list[TemplateDescriptorGroup] = []


class SelectionExport(BaseModel):
    video_id: int
    event_ids: list[int]


class CalibrateRequest(BaseModel):
    # Four image points in pixel coords, ordered TL, TR, BR, BL.
    img_points: list[list[float]]
    length: float = 105.0
    width: float = 68.0


class AskRequest(BaseModel):
    question: str


class EventUpdate(BaseModel):
    category_id: Optional[int] = None
    label: Optional[str] = None
    start_ms: Optional[int] = None
    end_ms: Optional[int] = None
    notes: Optional[str] = None
    descriptors: Optional[list[str]] = None
    reviewed: Optional[bool] = None
