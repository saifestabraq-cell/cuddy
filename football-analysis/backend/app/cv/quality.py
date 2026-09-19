"""Runtime tracking-quality diagnostics.

A per-analysis quality report computed from the tracking artifact — distinct
from validation (which compares detections against a reference). This tells the
analyst how much to TRUST the derived spatial layer for THIS video, in honest,
clearly-scoped terms. Pure over the tracks dict (no CV imports), so it is fast
and unit-testable.

Every figure here is descriptive of the tracking signal, never a ground-truth
claim. The overall band is an explicitly heuristic blend.
"""

from __future__ import annotations

PERSON = 0
BALL = 32


def _iou(a: dict, b: dict) -> float:
    ax2, ay2 = a["x"] + a["w"], a["y"] + a["h"]
    bx2, by2 = b["x"] + b["w"], b["y"] + b["h"]
    ix1, iy1 = max(a["x"], b["x"]), max(a["y"], b["y"])
    ix2, iy2 = min(ax2, bx2), min(ay2, by2)
    iw, ih = max(0.0, ix2 - ix1), max(0.0, iy2 - iy1)
    inter = iw * ih
    if inter <= 0:
        return 0.0
    ua = a["w"] * a["h"] + b["w"] * b["h"] - inter
    return inter / ua if ua > 0 else 0.0


def _band(score: float) -> str:
    if score >= 0.75:
        return "good"
    if score >= 0.5:
        return "fair"
    return "poor"


def assess_quality(tracks: dict, crowd_iou: float = 0.3) -> dict:
    """Compute tracking-quality metrics for one analysed video.

    Returns a flat, JSON-friendly dict. Each metric is in [0, 1] unless noted,
    with a short honest label. ``metrics`` is a list so the UI can render tiles
    with a consistent shape (key, label, value, kind).
    """
    frames = tracks.get("frames", []) or []
    n_frames = len(frames)

    if n_frames == 0:
        return {
            "n_frames": 0,
            "assessable": False,
            "note": "No sampled frames — analyse the video to assess quality.",
            "metrics": [],
            "overall": {"score": 0.0, "band": "poor"},
        }

    # --- per-frame tallies -------------------------------------------------
    ball_frames = 0
    player_dets = 0
    team_assigned = 0
    conf_sum = 0.0
    crowd_frames = 0
    # per-track presence: track_id -> sorted list of frame indices
    track_frames: dict[int, list[int]] = {}

    for i, f in enumerate(frames):
        dets = f.get("dets", []) or []
        players = [d for d in dets if d.get("cls") != BALL]
        has_ball = any(d.get("cls") == BALL for d in dets)
        if has_ball:
            ball_frames += 1
        for d in players:
            player_dets += 1
            conf_sum += float(d.get("conf", 0.0) or 0.0)
            if d.get("team") in (0, 1):
                team_assigned += 1
            tid = d.get("id")
            if tid is not None:
                track_frames.setdefault(tid, []).append(i)
        # crowding proxy: any player pair overlapping beyond crowd_iou
        crowded = False
        for a_idx in range(len(players)):
            for b_idx in range(a_idx + 1, len(players)):
                if _iou(players[a_idx], players[b_idx]) >= crowd_iou:
                    crowded = True
                    break
            if crowded:
                break
        if crowded:
            crowd_frames += 1

    # --- track continuity + gap rate --------------------------------------
    presence_ratios: list[float] = []
    fragment_tracks = 0
    for idxs in track_frames.values():
        present = len(idxs)
        span = idxs[-1] - idxs[0] + 1
        presence_ratios.append(present / span if span > 0 else 1.0)
        if present < 3:
            fragment_tracks += 1
    n_tracks = len(track_frames)
    track_continuity = (
        sum(presence_ratios) / len(presence_ratios) if presence_ratios else 0.0
    )
    gap_rate = 1.0 - track_continuity  # slots missing within a track's active span

    ball_coverage = ball_frames / n_frames
    team_rate = team_assigned / player_dets if player_dets else 0.0
    detection_confidence = conf_sum / player_dets if player_dets else 0.0
    crowding_rate = crowd_frames / n_frames  # occlusion proxy (higher = worse)

    # --- overall (explicitly heuristic blend) ------------------------------
    score = (
        0.30 * track_continuity
        + 0.25 * ball_coverage
        + 0.20 * team_rate
        + 0.15 * detection_confidence
        + 0.10 * (1.0 - crowding_rate)
    )

    def m(key: str, label: str, value: float, kind: str = "ratio") -> dict:
        return {"key": key, "label": label, "value": round(value, 3), "kind": kind}

    return {
        "n_frames": n_frames,
        "n_tracks": n_tracks,
        "assessable": True,
        "metrics": [
            m("track_continuity", "Track continuity", track_continuity),
            m("ball_coverage", "Ball coverage", ball_coverage),
            m("team_classification", "Team classification", team_rate),
            m("detection_confidence", "Detection confidence", detection_confidence),
            m("gap_rate", "Gap rate", gap_rate),
            m("occlusion_proxy", "Occlusion (crowding proxy)", crowding_rate),
        ],
        "fragment_tracks": fragment_tracks,
        "overall": {"score": round(score, 3), "band": _band(score)},
        "note": (
            "Descriptive of the tracking signal for this video, not a ground-truth "
            "claim. Gap rate = slots a track is missing within its own active span "
            "(interpolation candidates). Occlusion is a crowding proxy (overlapping "
            "boxes). The overall band is a heuristic blend."
        ),
    }
