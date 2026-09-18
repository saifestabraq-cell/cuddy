"""Deterministic query planner + evidence engine.

The architecture the spec mandates:

    question -> QUERY PLANNER -> STRUCTURED QUERY -> DETERMINISTIC ANALYTICS
             -> EVIDENCE PACKAGE -> (optional) LLM EXPLANATION

The LLM is NOT the analytics engine. `plan_query` turns a natural-language
question into a constrained `StructuredQuery` using rules (no network, no key),
and `resolve_query` answers it from the actual coded events + computed
analytics, returning events, metrics and clips that are all real. The LLM, when
configured, only writes prose over this evidence — it can never invent a clip.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal, Optional

from pydantic import BaseModel

from . import football

Intent = Literal[
    "metric_comparison",
    "event_lookup",
    "event_count",
    "event_filter",
    "sequence_lookup",
    "shot_analysis",
    "possession_analysis",
    "pass_analysis",
    "turnover_analysis",
    "zone_analysis",
    "player_analysis",
    "time_range_analysis",
    "clip_lookup",
]


class StructuredQuery(BaseModel):
    intent: Intent = "event_filter"
    team: Optional[Literal["home", "away", "both"]] = None
    period: Optional[int] = None  # 1 or 2
    zones: list[str] = []
    event_types: list[str] = []  # football families: pass/shot/turnover/...
    source: Optional[Literal["manual", "ai"]] = None
    reviewed: Optional[bool] = None
    time_range_ms: Optional[tuple[int, int]] = None
    metric: Optional[str] = None  # xg / possession / shots / passes / turnovers
    wants_clips: bool = False
    limit: int = 50


class Metric(BaseModel):
    label: str
    value: float | int | str
    source: str  # e.g. "cuddy_video_analysis", "heuristic", "approximate_cv"


class Clip(BaseModel):
    event_id: int
    start_ms: int
    end_ms: int
    label: str
    reason: str = ""


class EvidencePackage(BaseModel):
    question: str
    query: StructuredQuery
    summary: str
    metrics: list[Metric] = []
    events: list[int] = []  # matched event ids
    clips: list[Clip] = []
    warnings: list[str] = []


# --- Planner ---------------------------------------------------------------

# First half is conventionally 0..45' + stoppage; use 45:00 as the split when a
# real period boundary is unknown. (Kept explicit rather than a magic number.)
FIRST_HALF_END_MS = 45 * 60 * 1000

_INTENT_KEYWORDS: list[tuple[str, Intent]] = [
    ("sequence", "sequence_lookup"),
    ("leading to", "sequence_lookup"),
    ("ending in", "sequence_lookup"),
    ("build up to", "sequence_lookup"),
    ("build-up to", "sequence_lookup"),
    ("possession ending", "sequence_lookup"),
    ("turnover", "turnover_analysis"),
    ("lost the ball", "turnover_analysis"),
    ("lose the ball", "turnover_analysis"),
    ("giveaway", "turnover_analysis"),
    ("recovery", "event_filter"),
    ("possession", "possession_analysis"),
    ("pass network", "pass_analysis"),
    ("passing", "pass_analysis"),
    ("passes", "pass_analysis"),
    ("xg", "metric_comparison"),
    ("expected goals", "metric_comparison"),
    ("shot", "shot_analysis"),
    ("how many", "event_count"),
    ("how often", "event_count"),
]


def _detect_team(q: str) -> Optional[str]:
    if any(w in q for w in football.AWAY_WORDS):
        return "away"
    if any(w in q for w in football.HOME_WORDS):
        return "home"
    return None


def _detect_zones(q: str) -> list[str]:
    zones: list[str] = []
    for phrase, zone in football.ZONE_PHRASES.items():
        if phrase in q and zone not in zones:
            zones.append(zone)
    return zones


def _detect_period(q: str) -> Optional[int]:
    if "first half" in q or "1st half" in q:
        return 1
    if "second half" in q or "2nd half" in q:
        return 2
    return None


def _detect_families(q: str) -> list[str]:
    fams: list[str] = []
    for family, needles in football.EVENT_FAMILIES.items():
        if any(n in q for n in needles) and family not in fams:
            fams.append(family)
    return fams


def plan_query(question: str) -> StructuredQuery:
    """Rule-based NL -> StructuredQuery. Deterministic; no LLM."""
    q = (question or "").lower().strip()

    intent: Intent = "event_filter"
    for needle, mapped in _INTENT_KEYWORDS:
        if needle in q:
            intent = mapped
            break

    wants_clips = q.startswith("show me") or "show me" in q or "clips" in q

    metric = None
    if intent == "metric_comparison" or "xg" in q or "expected goals" in q:
        metric = "xg"
    elif "possession" in q:
        metric = "possession"

    zones = _detect_zones(q)
    families = _detect_families(q)
    period = _detect_period(q)
    team = _detect_team(q)

    # A "show me ... shots/turnovers" reads as a clip lookup filtered by family.
    if wants_clips and intent in ("event_filter", "event_count"):
        intent = "clip_lookup"

    source: Optional[str] = None
    if "ai" in q.split() or "suggested" in q or "detector" in q:
        source = "ai"
    elif "manual" in q:
        source = "manual"

    reviewed: Optional[bool] = None
    if "unreviewed" in q or "not reviewed" in q:
        reviewed = False
    elif "reviewed" in q or "accepted" in q:
        reviewed = True

    return StructuredQuery(
        intent=intent,
        team=team,
        period=period,
        zones=zones,
        event_types=families,
        source=source,  # type: ignore[arg-type]
        reviewed=reviewed,
        metric=metric,
        wants_clips=wants_clips,
    )


# --- Engine ----------------------------------------------------------------


@dataclass
class EventLite:
    """The minimum an event needs to be filtered/clipped. Decoupled from the ORM
    so the engine is unit-testable without a database."""

    id: int
    code: str
    start_ms: int
    end_ms: int
    source: str = "manual"
    reviewed: bool = False
    descriptors: list[str] = field(default_factory=list)


@dataclass
class QueryContext:
    """Everything the engine may read. Analytics/shots are optional (may be
    None when the video has not been analysed yet). `relations` are (from, to)
    event-id pairs powering sequence lookups."""

    events: list[EventLite]
    analytics: Optional[dict] = None
    shots: Optional[dict] = None
    relations: list[tuple[int, int]] = field(default_factory=list)


def _text_of(ev: EventLite) -> str:
    return " ".join([ev.code or ""] + list(ev.descriptors or [])).lower()


def _matches(ev: EventLite, q: StructuredQuery) -> bool:
    if q.source and ev.source != q.source:
        return False
    if q.reviewed is not None and ev.reviewed != q.reviewed:
        return False
    if q.period == 1 and ev.start_ms >= FIRST_HALF_END_MS:
        return False
    if q.period == 2 and ev.start_ms < FIRST_HALF_END_MS:
        return False
    if q.time_range_ms:
        lo, hi = q.time_range_ms
        if ev.end_ms < lo or ev.start_ms > hi:
            return False
    if q.event_types:
        fam = football.family_of(ev.code)
        text = _text_of(ev)
        if fam not in q.event_types and not any(f in text for f in q.event_types):
            return False
    if q.zones:
        text = _text_of(ev)
        # Zone match is descriptor-text based (events carry no coordinates);
        # only shots have true positions and are handled in shot_analysis.
        if not any(z.replace("_", " ") in text or z in text for z in q.zones):
            return False
    return True


def _clip(ev: EventLite, reason: str = "") -> Clip:
    return Clip(
        event_id=ev.id,
        start_ms=ev.start_ms,
        end_ms=ev.end_ms,
        label=ev.code or "Event",
        reason=reason,
    )


def _resolve_sequences(
    question: str, q: StructuredQuery, ctx: QueryContext
) -> EvidencePackage:
    """Reconstruct event chains from relations. If the query names a family
    (e.g. "ending in a shot"), keep only sequences that contain it."""
    pkg = EvidencePackage(question=question, query=q, summary="")
    by_id = {e.id: e for e in ctx.events}
    if not ctx.relations:
        pkg.summary = "No event sequences recorded. Link related events first."
        return pkg

    # Follow from->to chains. Nodes that are a `to` but never a `from` start no
    # chain; walk forward from each chain head (a `from` never seen as a `to`).
    succ: dict[int, list[int]] = {}
    tos: set[int] = set()
    for a, b in ctx.relations:
        succ.setdefault(a, []).append(b)
        tos.add(b)
    heads = [a for a in succ if a not in tos] or list(succ)

    sequences: list[list[int]] = []
    for head in heads:
        chain: list[int] = [head]
        cur = head
        seen = {head}
        while cur in succ:
            nxt = succ[cur][0]
            if nxt in seen:
                break
            chain.append(nxt)
            seen.add(nxt)
            cur = nxt
        sequences.append(chain)

    def contains_family(chain: list[int]) -> bool:
        if not q.event_types:
            return True
        for eid in chain:
            e = by_id.get(eid)
            if e and football.family_of(e.code) in q.event_types:
                return True
        return False

    kept = [c for c in sequences if contains_family(c)]
    # Flatten to clips (deduped, time-ordered) for playback.
    ids: list[int] = []
    for c in kept:
        for eid in c:
            if eid not in ids and eid in by_id:
                ids.append(eid)
    events = sorted((by_id[i] for i in ids), key=lambda e: e.start_ms)
    pkg.events = [e.id for e in events]
    pkg.clips = [_clip(e, "sequence") for e in events]
    label = (" ending in " + ", ".join(q.event_types)) if q.event_types else ""
    pkg.summary = (
        f"{len(kept)} sequence(s){label}." if kept else "No matching sequences found."
    )
    return pkg


def resolve_query(question: str, q: StructuredQuery, ctx: QueryContext) -> EvidencePackage:
    """Answer a structured query deterministically from real data."""
    warnings: list[str] = []
    matched = [e for e in ctx.events if _matches(e, q)]
    matched.sort(key=lambda e: e.start_ms)
    if q.limit:
        matched = matched[: q.limit]

    metrics: list[Metric] = []
    pkg = EvidencePackage(question=question, query=q, summary="")

    if q.intent == "sequence_lookup":
        return _resolve_sequences(question, q, ctx)

    if q.intent == "metric_comparison" and q.metric == "xg":
        if ctx.shots and ctx.shots.get("team_xg"):
            txg = ctx.shots["team_xg"]
            a, b = float(txg.get("0", 0)), float(txg.get("1", 0))
            metrics.append(Metric(label="xG — Team A", value=round(a, 2), source="cuddy_video_analysis"))
            metrics.append(Metric(label="xG — Team B", value=round(b, 2), source="cuddy_video_analysis"))
            lead = "Team A" if a > b else "Team B" if b > a else "Neither team"
            pkg.summary = f"{lead} created more xG ({round(a,2)} vs {round(b,2)}), by Cuddy's distance/angle model."
        else:
            warnings.append("No shot/xG data — run shot analysis first.")
            pkg.summary = "No xG data available yet."

    elif q.intent == "possession_analysis":
        if ctx.analytics and ctx.analytics.get("possession_pct"):
            pp = ctx.analytics["possession_pct"]
            a, b = float(pp.get("0", 0)), float(pp.get("1", 0))
            metrics.append(Metric(label="Possession — Team A", value=f"{round(a)}%", source="heuristic"))
            metrics.append(Metric(label="Possession — Team B", value=f"{round(b)}%", source="heuristic"))
            pkg.summary = f"Possession {round(a)}% / {round(b)}% (heuristic: nearest-player ball assignment)."
        else:
            warnings.append("No possession data — run analytics first.")
            pkg.summary = "No possession data available yet."

    elif q.intent == "shot_analysis":
        shot_events = matched or [e for e in ctx.events if football.family_of(e.code) == "shot"]
        pkg.clips = [_clip(e, "shot") for e in shot_events][: q.limit]
        pkg.events = [e.id for e in shot_events][: q.limit]
        if ctx.shots:
            metrics.append(Metric(label="Shots", value=len(ctx.shots.get("shots", [])), source="cuddy_video_analysis"))
        pkg.summary = f"{len(pkg.clips)} shot event(s)." if pkg.clips else "No shot events found."

    else:
        # event_count / event_filter / clip_lookup / turnover_analysis / etc.
        pkg.events = [e.id for e in matched]
        if q.wants_clips or q.intent in ("clip_lookup", "turnover_analysis", "event_filter", "sequence_lookup"):
            pkg.clips = [_clip(e, q.intent) for e in matched]
        label = ", ".join(q.event_types) if q.event_types else "matching"
        if matched:
            pkg.summary = f"{len(matched)} {label} event(s)" + (
                f" in {', '.join(z.replace('_', ' ') for z in q.zones)}" if q.zones else ""
            ) + "."
        else:
            pkg.summary = "No matching evidence found."

    pkg.metrics = metrics
    pkg.warnings = warnings
    return pkg
