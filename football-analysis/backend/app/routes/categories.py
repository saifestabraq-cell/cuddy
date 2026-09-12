"""Category (coding button) CRUD."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models import Category
from ..schemas import CategoryCreate

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[Category])
def list_categories(project_id: int, session: Session = Depends(get_session)):
    stmt = (
        select(Category)
        .where(Category.project_id == project_id)
        .order_by(Category.sort_order, Category.id)
    )
    return session.exec(stmt).all()


@router.post("", response_model=Category, status_code=201)
def create_category(payload: CategoryCreate, session: Session = Depends(get_session)):
    category = Category(**payload.model_dump())
    session.add(category)
    session.commit()
    session.refresh(category)
    return category


@router.delete("/{category_id}", status_code=204)
def delete_category(category_id: int, session: Session = Depends(get_session)):
    category = session.get(Category, category_id)
    if not category:
        raise HTTPException(404, "Category not found")
    session.delete(category)
    session.commit()
