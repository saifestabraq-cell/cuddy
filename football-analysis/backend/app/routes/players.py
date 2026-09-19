"""Player-centric derived analytics for a tracked player.

The tracker ID is the stable identity for a player within one analyzed video.
This endpoint intentionally derives the profile from persisted tracking and
analysis artifacts instead of introducing a fragile database identity before
jersey/name mapping exists.
"""

from __future__ import annotations

import json
from pathlib import Path

from fastapi import APIRouter, HTTPException

from ..config import settings

router = APIRouter(prefix="/videos", tags=["players"])


def _path(video_id: int, suffix: str = "") -> Path:
    return settings.tracks_dir / f"{video_id}{suffix}.json"


def build_player_profile(video_id: int, track_id: int) -> dict:
    tracks_path = _path(video_id)
    if not tracks_path.is_file():
        raise HTTPException(404, "No tracking analysis for this video yet")

    tracks = json.loads(tracks_path.read_text())
    samples = []
    for frame in tracks.get("frames", []):
        for det in frame.get("dets", []):
            if det.get("id") == track_id and det.get("cls") != 32:
                samples.append({
                    "t_ms": frame["t_ms"],
                    "team": det.get("team", -1),
                    "conf": det.get("conf", 0.0),
                    "x": det.get("x", 0.0),
                    "y": det.get("y", 0.0),
                    "w": det.get("w", 0.0),
                    "h": det.get("h", 0.0),
                })

    if not samples:
        raise HTTPException(404, f"Track {track_id} not found")

    span_ms = max(0, samples[-1]["t_ms"] - samples[0]["t_ms"])
    avg_conf = sum(s["conf"] for s in samples) / len(samples)
    frame_count = max(1, len(tracks.get("frames", [])))
    visibility = min(1.0, len(samples) / frame_count)

    team_counts: dict[str, int] = {}
    for sample in samples:
        key = str(sample["team"])
        team_counts[key] = team_counts.get(key, 0) + 1
    team = int(max(team_counts, key=team_counts.get))

    result = {
        "track_id": track_id,
        "team": team,
        "samples": len(samples),
        "avg_confidence": round(avg_conf, 4),
        "visibility_fraction": round(visibility, 4),
        "tracking_start_ms": samples[0]["t_ms"],
        "tracking_end_ms": samples[-1]["t_ms"],
        "duration_ms": span_ms,
        "distance_m": None,
        "passes_made": 0,
        "passes_received": 0,
        "latest": samples[-1],
    }

    pitch_path = _path(video_id, "_pitch")
    if pitch_path.is_file():
        pitch = json.loads(pitch_path.read_text())
        distance = pitch.get("track_distance_m", {}).get(str(track_id))
        if distance is not None:
            result["distance_m"] = float(distance)

    analytics_path = _path(video_id, "_analytics")
    if analytics_path.is_file():
        analytics = json.loads(analytics_path.read_text())
        pass_events = analytics.get("pass_events", [])
        result["passes_made"] = sum(
            1 for event in pass_events
            if event.get("team") == team and event.get("from") == track_id
        )
        result["passes_received"] = sum(
            1 for event in pass_events
            if event.get("team") == team and event.get("to") == track_id
        )

    result["avg_speed_mps"] = (
        round(result["distance_m"] / (span_ms / 1000.0), 2)
        if result["distance_m"] is not None and span_ms > 0
        else None
    )
    return result


@router.get("/{video_id}/players/{track_id}")
def get_player_profile(video_id: int, track_id: int):
    return build_player_profile(video_id, track_id)

