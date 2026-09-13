"""Durable analysis-run state (staged, resumable pipeline).

Revision ID: 0002_analysis_run
Revises: 0001_baseline
Create Date: 2026-09-13
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0002_analysis_run"
down_revision = "0001_baseline"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "analysisrun",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("video_id", sa.Integer, sa.ForeignKey("video.id"), nullable=False),
        sa.Column("kind", sa.String, nullable=False),
        sa.Column("status", sa.String, nullable=False),
        sa.Column("stage", sa.String, nullable=False),
        sa.Column("completed_stages", sa.JSON, nullable=True),
        sa.Column("progress", sa.Float, nullable=False),
        sa.Column("message", sa.String, nullable=False),
        sa.Column("error", sa.String, nullable=True),
        sa.Column("created_at", sa.DateTime, nullable=False),
        sa.Column("updated_at", sa.DateTime, nullable=False),
    )
    op.create_index("ix_analysisrun_video_id", "analysisrun", ["video_id"])


def downgrade() -> None:
    op.drop_table("analysisrun")
