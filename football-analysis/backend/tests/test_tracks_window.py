"""Windowed track access returns only the frames in range (spec §18)."""

from __future__ import annotations

import json


def _write_tracks(video_id: int):
    from app.config import settings

    settings.ensure_dirs()
    path = settings.tracks_dir / f"{video_id}.json"
    frames = [{"t_ms": t, "dets": []} for t in range(0, 10001, 1000)]  # 0..10s
    path.write_text(json.dumps({
        "video": "x", "src_fps": 25, "stride": 5, "width": 1280, "height": 720,
        "target_fps": 5, "n_tracks": 3, "teams": 2, "frames": frames,
    }))


def test_window_returns_only_frames_in_range(client, video):
    _write_tracks(video)
    r = client.get(f"/videos/{video}/tracks/window", params={"start_ms": 3000, "end_ms": 6000})
    assert r.status_code == 200
    body = r.json()
    ts = [f["t_ms"] for f in body["frames"]]
    assert ts == [3000, 4000, 5000, 6000]
    assert body["n_total"] == 11  # full track has 11 frames
    assert body["window"] == [3000, 6000]
    assert body["n_tracks"] == 3  # metadata preserved
    assert "frames" not in {k for k in body if k == "framez"}  # sanity


def test_window_rejects_inverted_range(client, video):
    _write_tracks(video)
    r = client.get(f"/videos/{video}/tracks/window", params={"start_ms": 6000, "end_ms": 3000})
    assert r.status_code == 422


def test_window_404_without_analysis(client, video):
    r = client.get(f"/videos/{video}/tracks/window", params={"start_ms": 0, "end_ms": 1000})
    assert r.status_code == 404
