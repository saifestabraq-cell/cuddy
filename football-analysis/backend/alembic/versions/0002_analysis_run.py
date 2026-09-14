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
    # Idempotent: a database created by the pre-Alembic create_all fallback may
    # already have this table. Adopting such a DB stamps it at 0001_baseline and
    # then upgrades, so this migration must no-op on an existing table rather
    # than fail with "table already exists".
    insp = sa.inspect(op.get_bind())
    if "analysisrun" not in insp.get_table_names():
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
    existing_indexes = {ix["name"] for ix in insp.get_indexes("analysisrun")}
    if "ix_analysisrun_video_id" not in existing_indexes:
        op.create_index("ix_analysisrun_video_id", "analysisrun", ["video_id"])


def downgrade() -> None:
    op.drop_table("analysisrun")
