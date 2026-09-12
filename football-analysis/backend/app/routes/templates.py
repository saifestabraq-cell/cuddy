"""Coding templates — export a project's category + descriptor setup as portable
JSON, and apply such a template to another project.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models import Category, Descriptor, DescriptorGroup, Project
from ..schemas import (
    CodingTemplate,
    TemplateCategory,
    TemplateDescriptorGroup,
)

router = APIRouter(prefix="/projects/{project_id}", tags=["templates"])


@router.get("/coding-template", response_model=CodingTemplate)
def get_template(project_id: int, session: Session = Depends(get_session)):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(404, "Project not found")

    categories = session.exec(
        select(Category).where(Category.project_id == project_id)
        .order_by(Category.sort_order, Category.id)
    ).all()
    groups = session.exec(
        select(DescriptorGroup).where(DescriptorGroup.project_id == project_id)
        .order_by(DescriptorGroup.sort_order, DescriptorGroup.id)
    ).all()

    tmpl_groups = []
    for g in groups:
        labels = session.exec(
            select(Descriptor).where(Descriptor.group_id == g.id)
            .order_by(Descriptor.sort_order, Descriptor.id)
        ).all()
        tmpl_groups.append(
            TemplateDescriptorGroup(name=g.name, descriptors=[d.label for d in labels])
        )

    return CodingTemplate(
        name=f"{project.name} template",
        categories=[
            TemplateCategory(
                name=c.name, color=c.color, hotkey=c.hotkey,
                lead_ms=c.lead_ms, lag_ms=c.lag_ms,
            )
            for c in categories
        ],
        descriptor_groups=tmpl_groups,
    )


@router.post("/apply-template", status_code=201)
def apply_template(
    project_id: int, template: CodingTemplate, session: Session = Depends(get_session)
):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(404, "Project not found")

    existing_cats = len(
        session.exec(select(Category).where(Category.project_id == project_id)).all()
    )
    for i, c in enumerate(template.categories):
        session.add(
            Category(
                project_id=project_id, name=c.name, color=c.color, hotkey=c.hotkey,
                lead_ms=c.lead_ms, lag_ms=c.lag_ms, sort_order=existing_cats + i,
            )
        )

    existing_groups = len(
        session.exec(
            select(DescriptorGroup).where(DescriptorGroup.project_id == project_id)
        ).all()
    )
    for gi, g in enumerate(template.descriptor_groups):
        group = DescriptorGroup(
            project_id=project_id, name=g.name, sort_order=existing_groups + gi
        )
        session.add(group)
        session.commit()
        session.refresh(group)
        for di, label in enumerate(g.descriptors):
            session.add(Descriptor(group_id=group.id, label=label, sort_order=di))

    session.commit()
    return {"applied": True, "categories": len(template.categories),
            "descriptor_groups": len(template.descriptor_groups)}
