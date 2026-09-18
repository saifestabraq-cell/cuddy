"""Shared football terminology + semantics.

A single source of truth for zones, phases, event families and the team/period
vocabulary, so the query planner, analytics and filters agree on the same words
instead of scattering hard-coded strings across the codebase.

Kept deliberately small and configurable — extend the maps here rather than
inventing new strings elsewhere.
"""

from __future__ import annotations

# --- Teams -----------------------------------------------------------------
# Internally teams are 0 (home / "Team A") and 1 (away / "Team B").
TEAM_HOME = 0
TEAM_AWAY = 1
TEAM_LABELS = {TEAM_HOME: "Team A", TEAM_AWAY: "Team B"}

# Words an analyst uses for each side. "we/our/us" default to the home team.
HOME_WORDS = ("home", "we", "our", "us", "ourselves", "team a")
AWAY_WORDS = ("away", "they", "their", "them", "opponent", "opposition", "team b")


# --- Zones -----------------------------------------------------------------
# Thirds run along the length of the pitch (attack direction is +x for home).
DEFENSIVE_THIRD = "defensive_third"
MIDDLE_THIRD = "middle_third"
FINAL_THIRD = "final_third"
LEFT = "left"
CENTER = "center"
RIGHT = "right"

THIRDS = (DEFENSIVE_THIRD, MIDDLE_THIRD, FINAL_THIRD)
CHANNELS = (LEFT, CENTER, RIGHT)

# Phrase -> canonical zone. Order matters: check longer phrases first.
ZONE_PHRASES: dict[str, str] = {
    "defensive third": DEFENSIVE_THIRD,
    "defending third": DEFENSIVE_THIRD,
    "own third": DEFENSIVE_THIRD,
    "middle third": MIDDLE_THIRD,
    "central third": MIDDLE_THIRD,
    "midfield": MIDDLE_THIRD,
    "final third": FINAL_THIRD,
    "attacking third": FINAL_THIRD,
    "opposition third": FINAL_THIRD,
    "left side": LEFT,
    "left wing": LEFT,
    "left flank": LEFT,
    "right side": RIGHT,
    "right wing": RIGHT,
    "right flank": RIGHT,
    "central area": CENTER,
    "centre": CENTER,
    "center": CENTER,
}


def third_of_x(x: float, length: float, attack_positive: bool = True) -> str:
    """Classify a pitch x-coordinate (metres) into a defensive/middle/final third.

    `attack_positive` = the team attacks toward +x. For the away team the pitch
    is mirrored, so the final third is the low-x end.
    """
    frac = x / length if length else 0.5
    if not attack_positive:
        frac = 1.0 - frac
    if frac < 1 / 3:
        return DEFENSIVE_THIRD
    if frac < 2 / 3:
        return MIDDLE_THIRD
    return FINAL_THIRD


def channel_of_y(y: float, width: float) -> str:
    """Classify a pitch y-coordinate (metres) into left/center/right."""
    frac = y / width if width else 0.5
    if frac < 1 / 3:
        return RIGHT  # low y = right when looking along +x
    if frac < 2 / 3:
        return CENTER
    return LEFT


# --- Phases ----------------------------------------------------------------
PHASES = (
    "possession",
    "build_up",
    "progression",
    "final_third",
    "transition",
    "defensive",
)


# --- Event families --------------------------------------------------------
# Canonical family -> the substrings that identify it in an event code/label.
EVENT_FAMILIES: dict[str, tuple[str, ...]] = {
    "pass": ("pass", "cross", "switch"),
    "shot": ("shot", "strike", "effort", "header on goal"),
    "goal": ("goal",),
    "turnover": ("turnover", "loss", "lost ball", "giveaway", "dispossess"),
    "recovery": ("recovery", "win", "regain", "interception", "tackle"),
    "entry": ("entry", "final third entry", "box entry"),
}


def family_of(code: str) -> str | None:
    """Best-effort event family from an event's code/label (case-insensitive)."""
    low = (code or "").lower()
    for family, needles in EVENT_FAMILIES.items():
        if any(n in low for n in needles):
            return family
    return None
