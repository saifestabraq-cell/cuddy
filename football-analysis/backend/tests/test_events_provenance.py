"""Provenance, review actions, and relations on the unified Event model."""

from __future__ import annotations


def _make_ai_event(client, video_id, **over):
    body = {
        "video_id": video_id,
        "label": "shot",
        "start_ms": 1000,
        "end_ms": 4000,
        "source": "ai",
        "confidence": 0.42,
    }
    body.update(over)
    r = client.post("/events", json=body)
    assert r.status_code == 201, r.text
    return r.json()


def test_edit_records_revision(client, video):
    ev = _make_ai_event(client, video)
    # No history yet.
    assert client.get(f"/events/{ev['id']}/revisions").json() == []

    r = client.patch(f"/events/{ev['id']}", json={"label": "header", "end_ms": 5000})
    assert r.status_code == 200
    assert r.json()["label"] == "header"

    revs = client.get(f"/events/{ev['id']}/revisions").json()
    assert len(revs) == 1
    rev = revs[0]
    assert rev["previous_values"] == {"label": "shot", "end_ms": 4000}
    assert rev["new_values"] == {"label": "header", "end_ms": 5000}
    assert rev["actor_type"] == "manual"
    assert rev["reason"] == "edit"


def test_no_op_edit_records_no_revision(client, video):
    ev = _make_ai_event(client, video)
    client.patch(f"/events/{ev['id']}", json={"label": "shot"})  # same value
    assert client.get(f"/events/{ev['id']}/revisions").json() == []


def test_accept_marks_reviewed_and_keeps_event(client, video):
    ev = _make_ai_event(client, video)
    assert ev["reviewed"] is False
    r = client.post(f"/events/{ev['id']}/accept")
    assert r.status_code == 200
    assert r.json()["reviewed"] is True
    # Event survives and carries an accept revision.
    revs = client.get(f"/events/{ev['id']}/revisions").json()
    assert revs[0]["reason"] == "accept"


def test_reject_removes_event(client, video):
    ev = _make_ai_event(client, video)
    r = client.post(f"/events/{ev['id']}/reject")
    assert r.status_code == 204
    assert client.get("/events", params={"video_id": video}).json() == []


def test_relations_link_events(client, video):
    a = _make_ai_event(client, video, label="recovery", start_ms=0, end_ms=2000)
    b = _make_ai_event(client, video, label="shot", start_ms=8000, end_ms=11000)
    r = client.post(
        "/events/relations",
        json={
            "from_event_id": a["id"],
            "to_event_id": b["id"],
            "relation_type": "same_sequence",
        },
    )
    assert r.status_code == 201
    rels = client.get(f"/events/{a['id']}/relations").json()
    assert len(rels) == 1
    assert rels[0]["relation_type"] == "same_sequence"
    # Visible from the other end too.
    assert len(client.get(f"/events/{b['id']}/relations").json()) == 1


def test_relation_requires_existing_events(client, video):
    a = _make_ai_event(client, video)
    r = client.post(
        "/events/relations",
        json={"from_event_id": a["id"], "to_event_id": 99999, "relation_type": "follows"},
    )
    assert r.status_code == 404
