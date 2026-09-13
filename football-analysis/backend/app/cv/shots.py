"""Heuristic shot detection + a simple distance/angle xG estimate.

Requires pitch calibration (ball positions in metres). A "shot" is a burst of
high ball speed heading toward a goal from within range. xG is a transparent
logistic of shot distance and the goal-mouth angle — a simplified estimate, not
a trained model.
"""

from __future__ import annotations

import math

PERSON = 0
BALL = 32
GOAL_WIDTH = 7.32

# xG logistic coefficients (heuristic; give sensible values across distances).
XG_B0 = -0.4
XG_B_DIST = -0.10
XG_B_ANGLE = 2.0


def _shot_angle(x: float, y: float, goal_x: float, goal_yc: float) -> float:
    """Angle (radians) subtended by the goal mouth from the shot location."""
    ax, ay = goal_x - x, (goal_yc - GOAL_WIDTH / 2) - y
    bx, by = goal_x - x, (goal_yc + GOAL_WIDTH / 2) - y
    cross = ax * by - ay * bx
    dot = ax * bx + ay * by
    return abs(math.atan2(abs(cross), dot))


def _xg(dist: float, angle: float) -> float:
    z = XG_B0 + XG_B_DIST * dist + XG_B_ANGLE * angle
    return 1.0 / (1.0 + math.exp(-z))


def _center(d: dict) -> tuple[float, float]:
    return d["x"] + d["w"] / 2, d["y"] + d["h"] / 2


def _nearest_team(tracks: dict, t_ms: int) -> int:
    """Team of the player nearest the ball in the frame closest to t_ms."""
    frames = tracks.get("frames", [])
    if not frames:
        return -1
    frame = min(frames, key=lambda f: abs(f["t_ms"] - t_ms))
    ball = None
    players = []
    for d in frame["dets"]:
        if d["cls"] == BALL:
            ball = d
        elif d["cls"] == PERSON:
            players.append(d)
    if not ball or not players:
        return -1
    bx, by = _center(ball)
    best, best_d = None, 1e18
    for p in players:
        px, py = _center(p)
        dd = math.hypot(px - bx, py - by)
        if dd < best_d:
            best_d, best = dd, p
    return best.get("team", -1) if best else -1


def detect_shots(
    tracks: dict,
    pitch: dict,
    speed_thresh: float = 7.0,
    max_origin_dist: float = 40.0,
    merge_ms: int = 1200,
) -> dict:
    length = pitch["length"]
    width = pitch["width"]
    yc = width / 2
    ball = sorted(pitch.get("ball_positions", []), key=lambda p: p[0])

    shots: list[dict] = []
    used_until = -1
    for (t0, x0, y0), (t1, x1, y1) in zip(ball, ball[1:]):
        dt = (t1 - t0) / 1000.0
        if dt <= 0:
            continue
        speed = math.hypot(x1 - x0, y1 - y0) / dt
        if speed < speed_thresh:
            continue
        goal_x, side = (0.0, "left") if x1 < x0 else (length, "right")
        d_before = math.hypot(x0 - goal_x, y0 - yc)
        d_after = math.hypot(x1 - goal_x, y1 - yc)
        if d_after >= d_before:  # not approaching the goal
            continue
        if d_before > max_origin_dist or t0 <= used_until:
            continue
        angle = _shot_angle(x0, y0, goal_x, yc)
        shots.append({
            "t_ms": t0, "X": round(x0, 1), "Y": round(y0, 1), "goal": side,
            "team": _nearest_team(tracks, t0), "distance_m": round(d_before, 1),
            "angle_rad": round(angle, 3), "xg": round(_xg(d_before, angle), 3),
        })
        used_until = t0 + merge_ms

    team_xg = {0: 0.0, 1: 0.0}
    for s in shots:
        if s["team"] in (0, 1):
            team_xg[s["team"]] += s["xg"]

    return {
        "shots": shots,
        "team_xg": {"0": round(team_xg[0], 3), "1": round(team_xg[1], 3)},
        "team_shots": {
            "0": sum(1 for s in shots if s["team"] == 0),
            "1": sum(1 for s in shots if s["team"] == 1),
        },
        "length": length,
        "width": width,
    }
