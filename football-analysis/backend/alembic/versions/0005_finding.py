"""Add the finding table (analyst observations linked to evidence).

Revision ID: 0005_finding
Revises: 0004_event_provenance
Create Date: 2026-09-18

Additive: creates one new table only, if absent. Existing data untouched.
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0005_finding"
down_revision = "0004_event_provenance"
branch_labels = None
depends_on = None


def upgrade() -> None:
    insp = sa.inspect(op.get_bind())
    if "finding" not in set(insp.get_table_names()):
        op.create_table(
            "finding",
            sa.Column("id", sa.Integer, primary_key=True),
            sa.Column(
                "video_id",
                sa.Integer,
                sa.ForeignKey("video.id"),
                nullable=False,
                index=True,
            ),
            sa.Column("title", sa.String, nullable=False),
            sa.Column("description", sa.String, nullable=False, server_default=""),
            sa.Column("event_ids", sa.JSON, nullable=False),
            sa.Column("start_ms", sa.Integer, nullable=True),
            sa.Column("end_ms", sa.Integer, nullable=True),
            sa.Column("created_at", sa.DateTime, nullable=False),
        )


def downgrade() -> None:
    insp = sa.inspect(op.get_bind())
    if "finding" in set(insp.get_table_names()):
        op.drop_table("finding")
