"""Phase 3 candidate-event detection from tracking data (image space, no pitch).

Produces reviewable ``source="ai"`` events from on-screen action without needing
precise spatial positions. Every detection carries a low, honest confidence and
a ``detector`` subtype; the analyst confirms or rejects each one. We deliberately
only emit the detectors we can defensibly ground in the tracks (turnover, shot
attempt, counter-attack) and abstain from ones that need pitch geometry or extra
signal (corner, goal, big chance) rather than guess.
"""

from __future__ import annotations

import math

from .analytics import compute_analytics

PERSON = 0
BALL = 32


def _ball_trajectory(frames: list[dict]) -> list[tuple[int, float, float]]:
    """(t_ms, cx, cy) for frames where a ball was detected, time-sorted."""
    out: list[tuple[int, float, float]] = []
    for f in frames:
        for d in f["dets"]:
            if d["cls"] == BALL:
                out.append((f["t_ms"], d["x"] + d["w"] / 2, d["y"] + d["h"] / 2))
                break
    out.sort(key=lambda p: p[0])
    return out


def detect_events(
    tracks: dict,
    window_ms: int = 2500,
    shot_speed: float = 1.2,   # frame-widths / second
    counter_dx: float = 0.55,  # fraction of frame width travelled
    counter_win_ms: int = 4000,
) -> list[dict]:
    frame_w = tracks.get("width", 1) or 1
    frames = tracks.get("frames", [])
    events: list[dict] = []

    # 1) Turnovers — cross-team possession change (nearest-player, image space).
    analytics = compute_analytics(tracks)
    for tv in analytics.get("turnover_events", []):
        t = tv["t_ms"]
        team = "A" if tv["from_team"] == 0 else "B"
        events.append({
            "detector": "turnover",
            "label": f"Turnover ({team} lost the ball)",
            "start_ms": max(0, t - window_ms),
            "end_ms": t + window_ms,
            "confidence": 0.4,
        })

    ball = _ball_trajectory(frames)

    # 2) Shot attempts — a burst of high ball speed toward a touchline edge.
    used_until = -1
    for (t0, x0, y0), (t1, x1, y1) in zip(ball, ball[1:]):
        dt = (t1 - t0) / 1000.0
        if dt <= 0:
            continue
        speed = math.hypot(x1 - x0, y1 - y0) / frame_w / dt
        toward_edge = x1 < 0.2 * frame_w or x1 > 0.8 * frame_w
        if speed >= shot_speed and toward_edge and t0 > used_until:
            side = "left" if x1 < 0.5 * frame_w else "right"
            events.append({
                "detector": "shot",
                "label": f"Shot attempt (toward {side})",
                "start_ms": max(0, t0 - 1500),
                "end_ms": t0 + 1500,
                "confidence": 0.3,
            })
            used_until = t0 + 3000

    # 3) Counter-attacks — large, sustained horizontal ball travel in a window.
    used_until = -1
    for i, (t_a, x_a, _y) in enumerate(ball):
        j = i
        while j < len(ball) and ball[j][0] - t_a < counter_win_ms:
            j += 1
        if j >= len(ball):
            break
        t_b, x_b, _ = ball[j]
        if abs(x_b - x_a) / frame_w >= counter_dx and t_a > used_until:
            events.append({
                "detector": "counter",
                "label": "Counter-attack",
                "start_ms": t_a,
                "end_ms": t_b,
                "confidence": 0.35,
            })
            used_until = t_b

    events.sort(key=lambda e: e["start_ms"])
    return events
