"""Pitch geometry: homography from a manual 4-point calibration, position
transform, heatmaps, team distances, and ball-position extraction.

The user clicks four image points that correspond to a known rectangle on the
pitch — by default the four pitch corners (length x width metres). We map image
pixels -> pitch metres, project each player's foot point and the ball, and build
per-team heatmaps + distance stats.
"""

from __future__ import annotations

import math
from typing import Optional

PERSON = 0
BALL = 32

# Standard pitch, metres.
DEFAULT_LENGTH = 105.0
DEFAULT_WIDTH = 68.0

MAX_PLAYER_SPEED = 12.0  # m/s — above this a step is treated as a tracking jump


def homography_from_corners(
    img_pts: list[list[float]], length: float, width: float
):
    """Perspective transform mapping the 4 clicked image points (ordered
    TL, TR, BR, BL) to pitch-metre corners."""
    import cv2
    import numpy as np

    if len(img_pts) != 4:
        raise ValueError("Exactly 4 calibration points are required")
    src = np.array(img_pts, dtype="float32")
    dst = np.array(
        [[0, 0], [length, 0], [length, width], [0, width]], dtype="float32"
    )
    return cv2.getPerspectiveTransform(src, dst)


def _apply(H, x: float, y: float) -> tuple[float, float]:
    d = H[2][0] * x + H[2][1] * y + H[2][2]
    if abs(d) < 1e-9:
        d = 1e-9
    wx = (H[0][0] * x + H[0][1] * y + H[0][2]) / d
    wy = (H[1][0] * x + H[1][1] * y + H[1][2]) / d
    return wx, wy


def build_pitch_data(
    tracks: dict,
    img_pts: list[list[float]],
    length: float = DEFAULT_LENGTH,
    width: float = DEFAULT_WIDTH,
    bin_size: float = 2.0,
) -> dict:
    """Transform every detection to pitch coordinates and aggregate."""
    import numpy as np

    H = homography_from_corners(img_pts, length, width)
    nx = max(1, int(round(length / bin_size)))
    ny = max(1, int(round(width / bin_size)))

    heat = {0: np.zeros((ny, nx)), 1: np.zeros((ny, nx))}
    track_pos: dict[int, list[tuple[int, float, float]]] = {}
    track_team: dict[int, int] = {}
    ball_positions: list[list[float]] = []

    for frame in tracks.get("frames", []):
        t = frame["t_ms"]
        for d in frame["dets"]:
            if d["cls"] == BALL:
                bx, by = _apply(H, d["x"] + d["w"] / 2, d["y"] + d["h"] / 2)
                if 0 <= bx <= length and 0 <= by <= width:
                    ball_positions.append([t, round(bx, 2), round(by, 2)])
                continue
            # player foot point = bottom-centre of the box
            fx, fy = _apply(H, d["x"] + d["w"] / 2, d["y"] + d["h"])
            if not (0 <= fx <= length and 0 <= fy <= width):
                continue
            team = d.get("team", -1)
            track_pos.setdefault(d["id"], []).append((t, fx, fy))
            if team in (0, 1):
                track_team[d["id"]] = team
                gx = min(nx - 1, int(fx / bin_size))
                gy = min(ny - 1, int(fy / bin_size))
                heat[team][gy, gx] += 1

    # per-track distance (filtering unrealistic jumps), summed per team
    team_distance = {0: 0.0, 1: 0.0}
    track_distance: dict[int, float] = {}
    for tid, pts in track_pos.items():
        pts.sort(key=lambda p: p[0])
        dist = 0.0
        for (t0, x0, y0), (t1, x1, y1) in zip(pts, pts[1:]):
            dt = (t1 - t0) / 1000.0
            if dt <= 0:
                continue
            step = math.hypot(x1 - x0, y1 - y0)
            if step / dt <= MAX_PLAYER_SPEED:
                dist += step
        track_distance[tid] = round(dist, 1)
        team = track_team.get(tid)
        if team in (0, 1):
            team_distance[team] += dist

    def norm(grid) -> list[list[float]]:
        m = float(grid.max())
        if m <= 0:
            return grid.tolist()
        return (grid / m).round(4).tolist()

    return {
        "length": length,
        "width": width,
        "bins_x": nx,
        "bins_y": ny,
        "heatmaps": {"0": norm(heat[0]), "1": norm(heat[1])},
        "team_distance_m": {
            "0": round(team_distance[0], 1),
            "1": round(team_distance[1], 1),
        },
        "track_distance_m": {str(k): v for k, v in track_distance.items()},
        "ball_positions": ball_positions,
        "img_points": img_pts,
    }


def autotag_final_third(
    pitch_data: dict, min_ms: int = 1500, gap_ms: int = 800
) -> list[dict]:
    """Heuristic AI events: contiguous spells with the ball in a final third.

    A 'final third' is X < length/3 (one end) or X > 2*length/3 (the other).
    Returns event dicts with start/end/label ready to be inserted as
    source='ai'.
    """
    length = pitch_data["length"]
    third = length / 3.0
    ball = sorted(pitch_data.get("ball_positions", []), key=lambda p: p[0])

    def zone(x: float) -> Optional[str]:
        if x <= third:
            return "left final third"
        if x >= length - third:
            return "right final third"
        return None

    events: list[dict] = []
    run_zone: Optional[str] = None
    run_start = 0
    last_t = 0
    for t, x, _y in ball:
        z = zone(x)
        if z and z == run_zone and (t - last_t) <= gap_ms:
            last_t = t
        else:
            if run_zone and (last_t - run_start) >= min_ms:
                events.append({
                    "start_ms": run_start, "end_ms": last_t,
                    "label": f"Ball in {run_zone}",
                })
            run_zone = z
            run_start = t
            last_t = t
    if run_zone and (last_t - run_start) >= min_ms:
        events.append({
            "start_ms": run_start, "end_ms": last_t,
            "label": f"Ball in {run_zone}",
        })
    return events
