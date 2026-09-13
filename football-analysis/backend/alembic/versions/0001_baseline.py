"""Baseline schema (Phases 0-3): project, video, descriptor groups/descriptors,
category, event.

Revision ID: 0001_baseline
Revises:
Create Date: 2026-09-13
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0001_baseline"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "project",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("description", sa.String, nullable=False),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )
    op.create_table(
        "video",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("project_id", sa.Integer, sa.ForeignKey("project.id"), nullable=False),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("path", sa.String, nullable=False),
        sa.Column("duration_ms", sa.Integer, nullable=True),
        sa.Column("fps", sa.Float, nullable=True),
        sa.Column("width", sa.Integer, nullable=True),
        sa.Column("height", sa.Integer, nullable=True),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )
    op.create_index("ix_video_project_id", "video", ["project_id"])

    op.create_table(
        "descriptorgroup",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("project_id", sa.Integer, sa.ForeignKey("project.id"), nullable=False),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("sort_order", sa.Integer, nullable=False),
    )
    op.create_index("ix_descriptorgroup_project_id", "descriptorgroup", ["project_id"])

    op.create_table(
        "descriptor",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("group_id", sa.Integer, sa.ForeignKey("descriptorgroup.id"), nullable=False),
        sa.Column("label", sa.String, nullable=False),
        sa.Column("color", sa.String, nullable=True),
        sa.Column("sort_order", sa.Integer, nullable=False),
    )
    op.create_index("ix_descriptor_group_id", "descriptor", ["group_id"])

    op.create_table(
        "category",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("project_id", sa.Integer, sa.ForeignKey("project.id"), nullable=False),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("color", sa.String, nullable=False),
        sa.Column("hotkey", sa.String, nullable=True),
        sa.Column("lead_ms", sa.Integer, nullable=False),
        sa.Column("lag_ms", sa.Integer, nullable=False),
        sa.Column("sort_order", sa.Integer, nullable=False),
    )
    op.create_index("ix_category_project_id", "category", ["project_id"])

    op.create_table(
        "event",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("video_id", sa.Integer, sa.ForeignKey("video.id"), nullable=False),
        sa.Column("category_id", sa.Integer, sa.ForeignKey("category.id"), nullable=True),
        sa.Column("label", sa.String, nullable=False),
        sa.Column("start_ms", sa.Integer, nullable=False),
        sa.Column("end_ms", sa.Integer, nullable=False),
        sa.Column("notes", sa.String, nullable=False),
        sa.Column("descriptors", sa.JSON, nullable=True),
        sa.Column("source", sa.String, nullable=False),
        sa.Column("confidence", sa.Float, nullable=True),
        sa.Column("reviewed", sa.Boolean, nullable=False),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )
    op.create_index("ix_event_video_id", "event", ["video_id"])
    op.create_index("ix_event_category_id", "event", ["category_id"])


def downgrade() -> None:
    op.drop_table("event")
    op.drop_table("category")
    op.drop_table("descriptor")
    op.drop_table("descriptorgroup")
    op.drop_table("video")
    op.drop_table("project")
