"""Add event provenance: updated_at + analysis_run_id, revisions, relations.

Revision ID: 0004_event_provenance
Revises: 0003_event_detector
Create Date: 2026-09-18

Additive and backwards-compatible: existing rows keep their data, older
projects still open. New Event columns are backfilled (updated_at := created_at),
and the two new tables are created only if absent.
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0004_event_provenance"
down_revision = "0003_event_detector"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    insp = sa.inspect(bind)

    event_cols = {c["name"] for c in insp.get_columns("event")}

    if "updated_at" not in event_cols:
        with op.batch_alter_table("event") as batch:
            batch.add_column(sa.Column("updated_at", sa.DateTime, nullable=True))
        # Backfill: an event that has never been edited was last "updated" when
        # it was created. Leave nothing NULL so ORM reads stay well-typed.
        op.execute("UPDATE event SET updated_at = created_at WHERE updated_at IS NULL")

    if "analysis_run_id" not in event_cols:
        with op.batch_alter_table("event") as batch:
            batch.add_column(sa.Column("analysis_run_id", sa.Integer, nullable=True))
        op.create_index(
            "ix_event_analysis_run_id", "event", ["analysis_run_id"], unique=False
        )

    existing_tables = set(insp.get_table_names())

    if "eventrevision" not in existing_tables:
        op.create_table(
            "eventrevision",
            sa.Column("id", sa.Integer, primary_key=True),
            sa.Column(
                "event_id",
                sa.Integer,
                sa.ForeignKey("event.id"),
                nullable=False,
                index=True,
            ),
            sa.Column("previous_values", sa.JSON, nullable=False),
            sa.Column("new_values", sa.JSON, nullable=False),
            sa.Column("actor_type", sa.String, nullable=False, server_default="manual"),
            sa.Column("reason", sa.String, nullable=False, server_default=""),
            sa.Column("created_at", sa.DateTime, nullable=False),
        )

    if "eventrelation" not in existing_tables:
        op.create_table(
            "eventrelation",
            sa.Column("id", sa.Integer, primary_key=True),
            sa.Column(
                "from_event_id",
                sa.Integer,
                sa.ForeignKey("event.id"),
                nullable=False,
                index=True,
            ),
            sa.Column(
                "to_event_id",
                sa.Integer,
                sa.ForeignKey("event.id"),
                nullable=False,
                index=True,
            ),
            sa.Column("relation_type", sa.String, nullable=False),
            sa.Column("created_at", sa.DateTime, nullable=False),
        )


def downgrade() -> None:
    insp = sa.inspect(op.get_bind())
    existing_tables = set(insp.get_table_names())
    if "eventrelation" in existing_tables:
        op.drop_table("eventrelation")
    if "eventrevision" in existing_tables:
        op.drop_table("eventrevision")

    event_cols = {c["name"] for c in insp.get_columns("event")}
    with op.batch_alter_table("event") as batch:
        if "analysis_run_id" in event_cols:
            batch.drop_column("analysis_run_id")
        if "updated_at" in event_cols:
            batch.drop_column("updated_at")
