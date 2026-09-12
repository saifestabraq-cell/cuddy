"""Descriptor group + descriptor CRUD.

Descriptors are Nacsport-style labels grouped into sets (Outcome, Zone, …) that
an analyst attaches to events. The group list is returned with its descriptors
nested for easy rendering.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models import Descriptor, DescriptorGroup
from ..schemas import (
    DescriptorCreate,
    DescriptorGroupCreate,
    DescriptorGroupRead,
    DescriptorRead,
)

router = APIRouter(tags=["descriptors"])


def _serialize(group: DescriptorGroup, descriptors: list[Descriptor]) -> DescriptorGroupRead:
    return DescriptorGroupRead(
        id=group.id,
        project_id=group.project_id,
        name=group.name,
        sort_order=group.sort_order,
        descriptors=[
            DescriptorRead(
                id=d.id, group_id=d.group_id, label=d.label, color=d.color,
                sort_order=d.sort_order,
            )
            for d in sorted(descriptors, key=lambda d: (d.sort_order, d.id or 0))
        ],
    )


@router.get("/descriptor-groups", response_model=list[DescriptorGroupRead])
def list_groups(project_id: int, session: Session = Depends(get_session)):
    groups = session.exec(
        select(DescriptorGroup)
        .where(DescriptorGroup.project_id == project_id)
        .order_by(DescriptorGroup.sort_order, DescriptorGroup.id)
    ).all()
    out = []
    for g in groups:
        descriptors = session.exec(
            select(Descriptor).where(Descriptor.group_id == g.id)
        ).all()
        out.append(_serialize(g, descriptors))
    return out


@router.post("/descriptor-groups", response_model=DescriptorGroupRead, status_code=201)
def create_group(payload: DescriptorGroupCreate, session: Session = Depends(get_session)):
    group = DescriptorGroup(**payload.model_dump())
    session.add(group)
    session.commit()
    session.refresh(group)
    return _serialize(group, [])


@router.delete("/descriptor-groups/{group_id}", status_code=204)
def delete_group(group_id: int, session: Session = Depends(get_session)):
    group = session.get(DescriptorGroup, group_id)
    if not group:
        raise HTTPException(404, "Group not found")
    # remove child descriptors first
    for d in session.exec(select(Descriptor).where(Descriptor.group_id == group_id)).all():
        session.delete(d)
    session.delete(group)
    session.commit()


@router.post("/descriptors", response_model=DescriptorRead, status_code=201)
def create_descriptor(payload: DescriptorCreate, session: Session = Depends(get_session)):
    if not session.get(DescriptorGroup, payload.group_id):
        raise HTTPException(400, "Group not found")
    descriptor = Descriptor(**payload.model_dump())
    session.add(descriptor)
    session.commit()
    session.refresh(descriptor)
    return DescriptorRead(
        id=descriptor.id, group_id=descriptor.group_id, label=descriptor.label,
        color=descriptor.color, sort_order=descriptor.sort_order,
    )


@router.delete("/descriptors/{descriptor_id}", status_code=204)
def delete_descriptor(descriptor_id: int, session: Session = Depends(get_session)):
    descriptor = session.get(Descriptor, descriptor_id)
    if not descriptor:
        raise HTTPException(404, "Descriptor not found")
    session.delete(descriptor)
    session.commit()
