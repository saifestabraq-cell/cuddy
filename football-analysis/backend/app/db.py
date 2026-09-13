"""Database engine and session management (SQLite via SQLModel)."""

from __future__ import annotations

from collections.abc import Iterator

from sqlmodel import Session, SQLModel, create_engine

from .config import settings

settings.ensure_dirs()

# check_same_thread=False lets the engine be shared across FastAPI's threadpool.
engine = create_engine(
    f"sqlite:///{settings.db_path}",
    echo=False,
    connect_args={"check_same_thread": False},
)


def init_db() -> None:
    """Bring the schema up to date via Alembic migrations.

    Adopts an existing pre-Alembic DB at the baseline, then upgrades. Falls back
    to ``create_all`` only if migrations cannot run (e.g. Alembic files missing
    in a stripped build) so the app still starts.
    """
    from . import models  # noqa: F401  (registers table metadata)

    try:
        from .migrations import run_migrations

        run_migrations()
    except Exception as exc:  # noqa: BLE001 - never block startup on migration setup
        print(f"[db] migration run failed ({exc}); falling back to create_all")
        SQLModel.metadata.create_all(engine)


def get_session() -> Iterator[Session]:
    """FastAPI dependency yielding a scoped DB session."""
    with Session(engine) as session:
        yield session
