"""Possession & passing analytics derived from tracking data.

Heuristic and dependent on tracking quality (especially the ball): each frame
the ball is assigned to the nearest player within a control radius; the ordered
sequence of ball-holders yields possession %, passes (same-team holder change),
turnovers (cross-team change) and a pass network.
"""

from __future__ import annotations

import math

PERSON = 0
BALL = 32


def _center(d: dict) -> tuple[float, float]:
    return d["x"] + d["w"] / 2, d["y"] + d["h"] / 2


def compute_analytics(
    tracks: dict, control_frac: float = 0.08, min_hold_frames: int = 2
) -> dict:
    frame_w = tracks.get("width", 1) or 1
    radius = control_frac * frame_w

    # 1) nearest-player possession per frame
    seq: list[tuple[int, int | None, int]] = []  # (t_ms, holder_id|None, team)
    for f in tracks.get("frames", []):
        ball = None
        players = []
        for d in f["dets"]:
            if d["cls"] == BALL:
                ball = d
            elif d["cls"] == PERSON:
                players.append(d)
        holder, team = None, -1
        if ball and players:
            bx, by = _center(ball)
            best, best_d = None, 1e18
            for p in players:
                px, py = _center(p)
                dd = math.hypot(px - bx, py - by)
                if dd < best_d:
                    best_d, best = dd, p
            if best is not None and best_d <= radius:
                holder, team = best["id"], best.get("team", -1)
        seq.append((f["t_ms"], holder, team))

    # 2) collapse into runs of identical holder (None allowed)
    runs: list[dict] = []
    for t, h, team in seq:
        if runs and runs[-1]["h"] == h:
            runs[-1]["end"] = t
            runs[-1]["n"] += 1
        else:
            runs.append({"h": h, "team": team, "start": t, "end": t, "n": 1})

    # possession share (all held frames)
    held = {0: 0, 1: 0}
    for r in runs:
        if r["h"] is not None and r["team"] in (0, 1):
            held[r["team"]] += r["n"]
    total_held = held[0] + held[1]
    possession_pct = {
        "0": round(100 * held[0] / total_held, 1) if total_held else 0.0,
        "1": round(100 * held[1] / total_held, 1) if total_held else 0.0,
    }

    # 3) touches = holder runs meeting the min-hold threshold
    touches = [
        (r["h"], r["team"], r["start"])
        for r in runs
        if r["h"] is not None and r["n"] >= min_hold_frames
    ]

    passes = {0: 0, 1: 0}
    turnovers = 0
    pass_edges: dict[tuple[int, int, int], int] = {}
    pass_events: list[dict] = []
    turnover_events: list[dict] = []
    for (a_id, a_team, _t0), (b_id, b_team, t1) in zip(touches, touches[1:]):
        if a_team in (0, 1) and a_team == b_team and a_id != b_id:
            passes[a_team] += 1
            key = (a_team, a_id, b_id)
            pass_edges[key] = pass_edges.get(key, 0) + 1
            pass_events.append({"t_ms": t1, "team": a_team, "from": a_id, "to": b_id})
        elif a_team in (0, 1) and b_team in (0, 1) and a_team != b_team:
            turnovers += 1
            turnover_events.append({"t_ms": t1, "from_team": a_team, "to_team": b_team})

    edges = [
        {"team": t, "from": a, "to": b, "count": c}
        for (t, a, b), c in sorted(pass_edges.items(), key=lambda kv: -kv[1])
    ]

    return {
        "possession_pct": possession_pct,
        "held_frames": {"0": held[0], "1": held[1]},
        "passes": {"0": passes[0], "1": passes[1]},
        "turnovers": turnovers,
        "pass_edges": edges,
        "pass_events": pass_events,
        "turnover_events": turnover_events,
        "n_touches": len(touches),
    }
