"""Integration: the /investigate endpoint returns real evidence offline.

No AI key is configured in the test env, so this proves the deterministic path
works without an LLM (spec acceptance F: manual/query workflow with no LLM key).
"""

from __future__ import annotations


def _ai_turnover(client, video_id, start_ms, descriptors):
    return client.post(
        "/events",
        json={
            "video_id": video_id,
            "label": "Turnover",
            "start_ms": start_ms,
            "end_ms": start_ms + 3000,
            "source": "ai",
            "confidence": 0.5,
            "descriptors": descriptors,
        },
    ).json()


def test_investigate_returns_grounded_clips_without_llm(client, video):
    # First half, middle third -> should match.
    a = _ai_turnover(client, video, 10_000, ["middle third"])
    # Second half, final third -> should NOT match a first-half middle-third query.
    _ai_turnover(client, video, 50 * 60_000, ["final third"])

    r = client.post(
        f"/videos/{video}/investigate",
        json={"question": "Show me every turnover in the middle third in the first half"},
    )
    assert r.status_code == 200, r.text
    body = r.json()

    assert body["events"] == [a["id"]]
    assert len(body["clips"]) == 1
    clip = body["clips"][0]
    assert clip["event_id"] == a["id"]
    assert clip["start_ms"] == 10_000
    # Deterministic summary present; no LLM configured so explanation is null.
    assert body["summary"]
    assert body["explanation"] is None
    # The structured query is echoed back for transparency.
    assert body["query"]["period"] == 1
    assert "middle_third" in body["query"]["zones"]


def test_investigate_cache_hit_then_invalidation(client, video):
    _ai_turnover(client, video, 10_000, ["middle third"])
    q = {"question": "Show me turnovers in the middle third"}

    first = client.post(f"/videos/{video}/investigate", json=q).json()
    assert first["cached"] is False
    second = client.post(f"/videos/{video}/investigate", json=q).json()
    assert second["cached"] is True
    assert second["events"] == first["events"]

    # Adding an event changes the data signature -> cache is bypassed.
    _ai_turnover(client, video, 20_000, ["middle third"])
    third = client.post(f"/videos/{video}/investigate", json=q).json()
    assert third["cached"] is False
    assert len(third["events"]) == 2


def test_investigate_no_match_is_honest(client, video):
    r = client.post(
        f"/videos/{video}/investigate",
        json={"question": "Show me every corner"},
    )
    assert r.status_code == 200
    body = r.json()
    assert body["clips"] == []
    assert "No matching evidence" in body["summary"]
