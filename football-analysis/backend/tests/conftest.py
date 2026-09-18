"""Test fixtures.

Point the app at a throwaway data dir BEFORE any app module imports, so the
SQLite engine (created at import time from settings.db_path) uses an isolated
DB and the real user DB under %LOCALAPPDATA%\\Cuddy is never touched.
"""

from __future__ import annotations

import os
import tempfile
from pathlib import Path

# Must run before `app.config`/`app.db` are imported anywhere.
_TMP = Path(tempfile.mkdtemp(prefix="cuddy-test-"))
os.environ["FA_DATA_DIR"] = str(_TMP)

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402


@pytest.fixture()
def client():
    """A TestClient that runs the app lifespan (which calls init_db/migrations)."""
    from app.main import app

    with TestClient(app) as c:
        yield c


@pytest.fixture()
def video(client):
    """A project + video to hang events off of. Returns the video id.

    The video route validates that the path is a real file, so point it at a
    throwaway one.
    """
    fake = _TMP / "match.mp4"
    fake.write_bytes(b"\x00")
    p = client.post("/projects", json={"name": "Test"}).json()
    v = client.post(
        "/videos",
        json={"project_id": p["id"], "name": "match", "path": str(fake)},
    ).json()
    return v["id"]
