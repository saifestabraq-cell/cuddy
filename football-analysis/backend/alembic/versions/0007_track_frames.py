"""Add the trackframe table (indexed temporal track storage).

Revision ID: 0007_track_frames
Revises: 0006_workflow_preset
Create Date: 2026-09-19

Additive: a derived cache table mirroring the tracks JSON one row per frame,
with a composite (video_id, t_ms) index so windowed reads are an indexed query
instead of a whole-file scan. Rebuilt from the JSON on demand; existing data
untouched.
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0007_track_frames"
down_revision = "0006_workflow_preset"
branch_labels = None
depends_on = None


def upgrade() -> None:
    insp = sa.inspect(op.get_bind())
    tables = set(insp.get_table_names())
    if "trackframe" not in tables:
        op.create_table(
            "trackframe",
            sa.Column("id", sa.Integer, primary_key=True),
            sa.Column(
                "video_id",
                sa.Integer,
                sa.ForeignKey("video.id"),
                nullable=False,
                index=True,
            ),
            sa.Column("t_ms", sa.Integer, nullable=False, index=True),
            sa.Column("data", sa.JSON, nullable=False),
        )
        # Composite index makes (video_id, t_ms BETWEEN ..) a range scan.
        op.create_index(
            "ix_trackframe_video_t", "trackframe", ["video_id", "t_ms"], unique=False
        )


def downgrade() -> None:
    insp = sa.inspect(op.get_bind())
    if "trackframe" in set(insp.get_table_names()):
        indexes = {ix["name"] for ix in insp.get_indexes("trackframe")}
        if "ix_trackframe_video_t" in indexes:
            op.drop_index("ix_trackframe_video_t", table_name="trackframe")
        op.drop_table("trackframe")
