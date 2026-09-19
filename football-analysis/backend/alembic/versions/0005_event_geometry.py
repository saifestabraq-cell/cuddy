"""Add event pitch geometry: pitch_x, pitch_y, coord_source.

Revision ID: 0005_event_geometry
Revises: 0004_event_player_tracks
Create Date: 2026-09-18

Additive and backwards-compatible: three nullable columns on ``event`` for the
interactive-pitch spatial layer. Existing rows keep their data (all three stay
NULL, i.e. "no location yet"); older projects still open. Guarded by a
column-exists check so re-running is a no-op.
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0005_event_geometry"
down_revision = "0004_event_player_tracks"
branch_labels = None
depends_on = None


def upgrade() -> None:
    insp = sa.inspect(op.get_bind())
    event_cols = {c["name"] for c in insp.get_columns("event")}

    to_add = [
        ("pitch_x", sa.Float),
        ("pitch_y", sa.Float),
        ("coord_source", sa.String),
    ]
    missing = [(name, typ) for name, typ in to_add if name not in event_cols]
    if missing:
        with op.batch_alter_table("event") as batch:
            for name, typ in missing:
                batch.add_column(sa.Column(name, typ, nullable=True))


def downgrade() -> None:
    insp = sa.inspect(op.get_bind())
    event_cols = {c["name"] for c in insp.get_columns("event")}
    with op.batch_alter_table("event") as batch:
        for name in ("coord_source", "pitch_y", "pitch_x"):
            if name in event_cols:
                batch.drop_column(name)
