"""Run Alembic migrations at startup.

Adopts an existing pre-Alembic database (created by the old ``create_all``) by
stamping it at the baseline before upgrading, so a populated user DB is never
recreated or lost. A fresh DB is built from migrations.
"""

from __future__ import annotations

import sqlite3
from pathlib import Path

from alembic import command
from alembic.config import Config

from .config import settings


def _alembic_config() -> Config:
    backend_dir = Path(__file__).resolve().parent.parent  # .../backend
    cfg = Config(str(backend_dir / "alembic.ini"))
    cfg.set_main_option("script_location", str(backend_dir / "alembic"))
    cfg.set_main_option("sqlalchemy.url", f"sqlite:///{settings.db_path}")
    return cfg


def _table_exists(db_path: str, name: str) -> bool:
    if not Path(db_path).exists():
        return False
    con = sqlite3.connect(db_path)
    try:
        row = con.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name=?", (name,)
        ).fetchone()
        return row is not None
    finally:
        con.close()


def run_migrations() -> None:
    settings.ensure_dirs()
    cfg = _alembic_config()
    db_path = str(settings.db_path)

    has_alembic = _table_exists(db_path, "alembic_version")
    has_schema = _table_exists(db_path, "project")

    # Existing pre-Alembic DB with data: adopt at baseline instead of recreating.
    if not has_alembic and has_schema:
        command.stamp(cfg, "0001_baseline")

    command.upgrade(cfg, "head")
