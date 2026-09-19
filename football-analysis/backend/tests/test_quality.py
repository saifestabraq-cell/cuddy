"""Runtime tracking-quality diagnostics (§6). Pure function + endpoint."""

from __future__ import annotations

import json

from app.config import settings
from app.cv.quality import assess_quality

PERSON, BALL = 0, 32


def _det(id, team, x, y, conf=0.9, cls=PERSON, w=4, h=8):
    return {"id": id, "cls": cls, "team": team, "conf": conf, "x": x, "y": y, "w": w, "h": h}


def _tracks():
    # 4 frames. Player 1 present in all 4 (continuous), player 2 in frames 0 and 3
    # (a gap in its span). Ball present in 3/4 frames. Frame 3 has two overlapping
    # players (crowding). Player 9 is unassigned (team -1) in one frame.
    return {
        "width": 100,
        "height": 100,
        "frames": [
            {"t_ms": 0, "dets": [_det(1, 0, 10, 10), _det(2, 1, 80, 80), {"cls": BALL, "x": 50, "y": 50, "w": 1, "h": 1}]},
            {"t_ms": 200, "dets": [_det(1, 0, 12, 10), _det(9, -1, 40, 40)]},
            {"t_ms": 400, "dets": [_det(1, 0, 14, 10), {"cls": BALL, "x": 52, "y": 50, "w": 1, "h": 1}]},
            {"t_ms": 600, "dets": [_det(1, 0, 16, 10), _det(2, 1, 16, 11), {"cls": BALL, "x": 54, "y": 50, "w": 1, "h": 1}]},
        ],
    }


def test_assess_quality_shapes_and_ranges():
    q = assess_quality(_tracks())
    assert q["assessable"] is True
    assert q["n_frames"] == 4
    keys = {m["key"] for m in q["metrics"]}
    assert keys == {
        "track_continuity", "ball_coverage", "team_classification",
        "detection_confidence", "gap_rate", "occlusion_proxy",
    }
    for m in q["metrics"]:
        assert 0.0 <= m["value"] <= 1.0
    assert q["overall"]["band"] in ("good", "fair", "poor")


def test_ball_coverage_is_three_of_four():
    q = assess_quality(_tracks())
    bc = next(m["value"] for m in q["metrics"] if m["key"] == "ball_coverage")
    assert bc == 0.75


def test_gap_rate_reflects_track_2_gap():
    # Player 2 spans frames 0..3 but appears only in 0 and 3 -> presence 2/4.
    # Player 1 is continuous (4/4). Player 9 appears once (span 1 -> presence 1).
    q = assess_quality(_tracks())
    gap = next(m["value"] for m in q["metrics"] if m["key"] == "gap_rate")
    assert gap > 0.0  # the gap in track 2 must register


def test_team_classification_excludes_unassigned():
    q = assess_quality(_tracks())
    tr = next(m["value"] for m in q["metrics"] if m["key"] == "team_classification")
    # 7 player dets total, 6 assigned (player 9 is team -1) -> 6/7.
    assert round(tr, 3) == round(6 / 7, 3)


def test_empty_tracks_not_assessable():
    q = assess_quality({"frames": []})
    assert q["assessable"] is False
    assert q["metrics"] == []


def test_quality_endpoint(client, video):
    # No analysis yet -> 404.
    assert client.get(f"/videos/{video}/quality").status_code == 404
    # Write a tracks artifact and read the report.
    path = settings.tracks_dir / f"{video}.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(_tracks()))
    r = client.get(f"/videos/{video}/quality")
    assert r.status_code == 200, r.text
    assert r.json()["assessable"] is True
