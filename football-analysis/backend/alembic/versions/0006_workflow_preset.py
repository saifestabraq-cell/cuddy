"""Add the preset table (saved workspace filter snapshots).

Revision ID: 0006_workflow_preset
Revises: 0005_event_geometry
Create Date: 2026-09-19

Additive: creates one new table only, if absent. Existing data untouched.
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0006_workflow_preset"
down_revision = "0005_event_geometry"
branch_labels = None
depends_on = None


def upgrade() -> None:
    insp = sa.inspect(op.get_bind())
    if "preset" not in set(insp.get_table_names()):
        op.create_table(
            "preset",
            sa.Column("id", sa.Integer, primary_key=True),
            sa.Column(
                "project_id",
                sa.Integer,
                sa.ForeignKey("project.id"),
                nullable=False,
                index=True,
            ),
            sa.Column("name", sa.String, nullable=False),
            sa.Column("filter", sa.JSON, nullable=False),
            sa.Column("created_at", sa.DateTime, nullable=False),
        )


def downgrade() -> None:
    insp = sa.inspect(op.get_bind())
    if "preset" in set(insp.get_table_names()):
        op.drop_table("preset")
