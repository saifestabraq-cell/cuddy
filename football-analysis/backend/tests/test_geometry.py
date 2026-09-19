"""Event pitch geometry (§22): coordinate helpers, backfill, manual placement.

The pure helpers (ball_xy_at / locate_events) need no CV stack. The endpoint
tests write a pitch file directly so they exercise the backfill/override logic
without running calibration (which needs numpy/cv2).
"""

from __future__ import annotations

import json

from app.config import settings
from app.cv.pitch import ball_xy_at, locate_events


# --- Pure helpers ----------------------------------------------------------


def _pitch():
    return {
        "length": 105.0,
        "width": 68.0,
        "ball_positions": [
            [10_000, 95.0, 10.0],
            [12_000, 52.0, 34.0],
            [30_000, 20.0, 60.0],
        ],
    }


def test_ball_xy_at_picks_nearest_sample():
    assert ball_xy_at(_pitch(), 10_200) == (95.0, 10.0)
    assert ball_xy_at(_pitch(), 11_900) == (52.0, 34.0)


def test_ball_xy_at_returns_none_when_no_sample_in_window():
    # Nearest sample is >2s away -> unknown, never (0, 0).
    assert ball_xy_at(_pitch(), 100_000) is None
    assert ball_xy_at({"ball_positions": []}, 10_000) is None


def test_locate_events_maps_only_events_with_nearby_ball():
    events = [(1, 10_000), (2, 12_000), (3, 500_000)]  # 3 has no nearby sample
    located = locate_events(events, _pitch())
    assert located == {1: (95.0, 10.0), 2: (52.0, 34.0)}


# --- Endpoints -------------------------------------------------------------


def _write_pitch(video_id: int):
    path = settings.tracks_dir / f"{video_id}_pitch.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(_pitch()))


def _make_event(client, video_id, start_ms, **extra):
    body = {
        "video_id": video_id,
        "label": "Pass",
        "start_ms": start_ms,
        "end_ms": start_ms + 1000,
    }
    body.update(extra)
    return client.post("/events", json=body).json()


def test_locate_events_stamps_cv_coords(client, video):
    e1 = _make_event(client, video, 10_000)
    assert e1["pitch_x"] is None and e1["coord_source"] is None
    _write_pitch(video)

    r = client.post(f"/videos/{video}/locate-events")
    assert r.status_code == 200, r.text
    assert r.json()["located"] == 1

    got = client.get(f"/events?video_id={video}").json()[0]
    assert got["pitch_x"] == 95.0
    assert got["pitch_y"] == 10.0
    assert got["coord_source"] == "cv"


def test_locate_events_preserves_manual_placement(client, video):
    manual = _make_event(
        client, video, 10_000, pitch_x=1.0, pitch_y=2.0, coord_source="manual"
    )
    _write_pitch(video)

    client.post(f"/videos/{video}/locate-events")

    got = client.get(f"/events?video_id={video}").json()[0]
    assert got["id"] == manual["id"]
    assert got["pitch_x"] == 1.0  # untouched by the CV backfill
    assert got["coord_source"] == "manual"


def test_manual_patch_defaults_coord_source(client, video):
    e = _make_event(client, video, 10_000)
    patched = client.patch(
        f"/events/{e['id']}", json={"pitch_x": 30.0, "pitch_y": 40.0}
    ).json()
    assert patched["pitch_x"] == 30.0
    assert patched["coord_source"] == "manual"  # defaulted by the route


def test_locate_events_requires_calibration(client, video):
    r = client.post(f"/videos/{video}/locate-events")
    assert r.status_code == 400
