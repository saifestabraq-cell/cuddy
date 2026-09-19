"""Add player track references to events.

Revision ID: 0004_event_player_tracks
Revises: 0003_event_detector
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0004_event_player_tracks"
down_revision = "0003_event_detector"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("event") as batch:
        batch.add_column(
            sa.Column(
                "player_track_ids",
                sa.JSON(),
                nullable=False,
                server_default="[]",
            )
        )


def downgrade() -> None:
    with op.batch_alter_table("event") as batch:
        batch.drop_column("player_track_ids")
