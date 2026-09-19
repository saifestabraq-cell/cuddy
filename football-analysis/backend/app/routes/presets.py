"""Workspace presets: named Filter snapshots scoped to a project.

A preset stores the UI Filter shape verbatim and is applied client-side, so the
backend never needs to know the exact filter fields.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models import Preset, Project
from ..schemas import PresetCreate

router = APIRouter(tags=["presets"])


@router.get("/projects/{project_id}/presets", response_model=list[Preset])
def list_presets(project_id: int, session: Session = Depends(get_session)):
    stmt = (
        select(Preset)
        .where(Preset.project_id == project_id)
        .order_by(Preset.created_at.desc())
    )
    return session.exec(stmt).all()


@router.post("/projects/{project_id}/presets", response_model=Preset, status_code=201)
def create_preset(
    project_id: int, payload: PresetCreate, session: Session = Depends(get_session)
):
    if not session.get(Project, project_id):
        raise HTTPException(404, "Project not found")
    if not payload.name.strip():
        raise HTTPException(422, "A preset needs a name")
    preset = Preset(project_id=project_id, name=payload.name.strip(), filter=payload.filter)
    session.add(preset)
    session.commit()
    session.refresh(preset)
    return preset


@router.delete("/presets/{preset_id}", status_code=204)
def delete_preset(preset_id: int, session: Session = Depends(get_session)):
    preset = session.get(Preset, preset_id)
    if not preset:
        raise HTTPException(404, "Preset not found")
    session.delete(preset)
    session.commit()
