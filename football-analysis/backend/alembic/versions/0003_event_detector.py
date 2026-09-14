"""Add event.detector (auto-detector subtype for Phase 3 candidate events).

Revision ID: 0003_event_detector
Revises: 0002_analysis_run
Create Date: 2026-09-13
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0003_event_detector"
down_revision = "0002_analysis_run"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Idempotent: skip if the column is already present (e.g. a DB created by the
    # old create_all whose Event model already had this field).
    insp = sa.inspect(op.get_bind())
    columns = {c["name"] for c in insp.get_columns("event")}
    if "detector" not in columns:
        with op.batch_alter_table("event") as batch:
            batch.add_column(sa.Column("detector", sa.String, nullable=True))


def downgrade() -> None:
    with op.batch_alter_table("event") as batch:
        batch.drop_column("detector")
