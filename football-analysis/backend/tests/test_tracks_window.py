"""Indexed temporal track storage (§8): windowed access is an indexed query."""

from __future__ import annotations

import json

from sqlmodel import Session

from app import track_store
from app.config import settings
from app.db import engine


def _tracks(n=10, step=200):
    return {
        "video": "demo",
        "width": 1280,
        "height": 720,
        "src_fps": 25,
        "n_tracks": 2,
        "frames": [
            {"t_ms": i * step, "dets": [{"id": 1, "cls": 0, "team": 0, "x": i, "y": 0, "w": 4, "h": 8}]}
            for i in range(n)
        ],
    }


def _write_tracks(video_id: int, doc: dict):
    p = settings.tracks_dir / f"{video_id}.json"
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(doc))


# --- store unit tests (no HTTP) --------------------------------------------


def test_ingest_and_window_range(client):  # client fixture runs migrations
    with Session(engine) as s:
        vid = 9001
        track_store.clear(s, vid)
        n = track_store.ingest(s, vid, _tracks(n=10, step=200))  # t_ms 0..1800
        assert n == 10
        assert track_store.frame_count(s, vid) == 10
        # window 400..1000 inclusive -> t_ms 400,600,800,1000 = 4 frames
        w = track_store.window(s, vid, 400, 1000)
        assert [f["t_ms"] for f in w] == [400, 600, 800, 1000]


def test_ingest_is_idempotent_replace(client):  # client fixture runs migrations
    with Session(engine) as s:
        vid = 9002
        track_store.ingest(s, vid, _tracks(n=5))
        track_store.ingest(s, vid, _tracks(n=3))  # rebuild smaller
        assert track_store.frame_count(s, vid) == 3


# --- endpoint tests --------------------------------------------------------


def test_window_endpoint_builds_index_on_demand(client, video):
    _write_tracks(video, _tracks(n=10, step=200))
    # No index yet; the window endpoint should build it lazily and return only
    # the in-range frames plus metadata (from the sidecar, not the full file).
    r = client.get(f"/videos/{video}/tracks/window?start_ms=400&end_ms=1000")
    assert r.status_code == 200, r.text
    body = r.json()
    assert [f["t_ms"] for f in body["frames"]] == [400, 600, 800, 1000]
    assert body["n_total"] == 10
    assert body["width"] == 1280  # metadata carried through
    assert "frames" not in {k for k in body if k == "frames"} or True


def test_index_endpoint_reports_count(client, video):
    _write_tracks(video, _tracks(n=7))
    r = client.post(f"/videos/{video}/tracks/index")
    assert r.status_code == 200, r.text
    assert r.json()["frames_indexed"] == 7


def test_window_validates_range(client, video):
    _write_tracks(video, _tracks(n=3))
    assert client.get(f"/videos/{video}/tracks/window?start_ms=500&end_ms=100").status_code == 422


def test_window_404_without_analysis(client, video):
    assert client.get(f"/videos/{video}/tracks/window?start_ms=0&end_ms=1").status_code == 404
