"""Deterministic query planner + evidence engine (no LLM, no DB)."""

from __future__ import annotations

from app.query import (
    EventLite,
    QueryContext,
    plan_query,
    resolve_query,
)


# --- Planner ---------------------------------------------------------------


def test_plan_turnover_middle_third_first_half():
    q = plan_query("Show me every turnover in the middle third in the first half")
    assert q.intent in ("turnover_analysis", "clip_lookup")
    assert "turnover" in q.event_types
    assert "middle_third" in q.zones
    assert q.period == 1
    assert q.wants_clips is True


def test_plan_xg_comparison():
    q = plan_query("Which team had more xG?")
    assert q.intent == "metric_comparison"
    assert q.metric == "xg"


def test_plan_team_detection():
    assert plan_query("show me our attacks on the right").team == "home"
    assert plan_query("how many shots did the opponent take").team == "away"


def test_plan_possession():
    q = plan_query("What was the possession split?")
    assert q.intent == "possession_analysis"


# --- Engine ----------------------------------------------------------------


def _events():
    return [
        EventLite(1, "Turnover", 10_000, 13_000, descriptors=["middle third"]),
        EventLite(2, "Turnover", 50 * 60_000, 50 * 60_000 + 3000, descriptors=["final third"]),
        EventLite(3, "Shot", 20_000, 23_000),
        EventLite(4, "Pass", 5_000, 6_000, source="ai", reviewed=False),
    ]


def test_engine_turnover_filter_by_zone_and_half():
    q = plan_query("Show me turnovers in the middle third in the first half")
    pkg = resolve_query("q", q, QueryContext(events=_events()))
    assert pkg.events == [1]  # event 2 is final third + second half
    assert len(pkg.clips) == 1
    assert pkg.clips[0].event_id == 1
    assert pkg.clips[0].start_ms == 10_000


def test_engine_no_match_says_so():
    q = plan_query("Show me every corner")
    q.event_types = ["corner"]  # a family with no matching events
    pkg = resolve_query("q", q, QueryContext(events=_events()))
    assert pkg.clips == []
    assert "No matching evidence" in pkg.summary


def test_engine_xg_uses_real_shot_data_not_llm():
    q = plan_query("Which team created more xG?")
    ctx = QueryContext(events=_events(), shots={"team_xg": {"0": 1.4, "1": 0.6}})
    pkg = resolve_query("q", q, ctx)
    assert any(m.label == "xG — Team A" for m in pkg.metrics)
    assert "Team A" in pkg.summary


def test_engine_xg_warns_when_missing():
    q = plan_query("Which team created more xG?")
    pkg = resolve_query("q", q, QueryContext(events=_events()))
    assert pkg.warnings
    assert pkg.metrics == []


def test_plan_sequence_lookup():
    q = plan_query("Show me every sequence ending in a shot")
    assert q.intent == "sequence_lookup"
    assert "shot" in q.event_types


def test_engine_sequence_lookup_filters_by_family():
    events = [
        EventLite(1, "Recovery", 0, 1000),
        EventLite(2, "Pass", 2000, 3000),
        EventLite(3, "Shot", 4000, 5000),
        EventLite(4, "Recovery", 20000, 21000),
        EventLite(5, "Pass", 22000, 23000),  # sequence with no shot
    ]
    relations = [(1, 2), (2, 3), (4, 5)]
    q = plan_query("Show me sequences ending in a shot")
    pkg = resolve_query("q", q, QueryContext(events=events, relations=relations))
    assert pkg.events == [1, 2, 3]  # only the chain containing a shot
    assert "1 sequence" in pkg.summary


def test_engine_sequence_lookup_no_relations():
    q = plan_query("Show me every sequence")
    pkg = resolve_query("q", q, QueryContext(events=[EventLite(1, "Pass", 0, 1000)]))
    assert pkg.clips == []
    assert "No event sequences" in pkg.summary


def test_engine_source_filter():
    q = plan_query("show me ai suggested passes")
    pkg = resolve_query("q", q, QueryContext(events=_events()))
    # only event 4 is source=ai
    assert pkg.events == [4]
