"""Findings CRUD, linked to events by id."""

from __future__ import annotations


def test_create_list_delete_finding(client, video):
    e = client.post(
        "/events",
        json={"video_id": video, "label": "Turnover", "start_ms": 1000, "end_ms": 4000},
    ).json()

    r = client.post(
        f"/videos/{video}/findings",
        json={
            "title": "Left-side turnovers",
            "description": "Repeated losses on the left in the first phase.",
            "event_ids": [e["id"]],
            "start_ms": 0,
            "end_ms": 60000,
        },
    )
    assert r.status_code == 201, r.text
    f = r.json()
    assert f["title"] == "Left-side turnovers"
    assert f["event_ids"] == [e["id"]]

    listed = client.get(f"/videos/{video}/findings").json()
    assert len(listed) == 1

    assert client.delete(f"/findings/{f['id']}").status_code == 204
    assert client.get(f"/videos/{video}/findings").json() == []


def test_finding_requires_title(client, video):
    r = client.post(f"/videos/{video}/findings", json={"title": "   "})
    assert r.status_code == 422


def test_report_assembles_findings_with_clips(client, video):
    e = client.post(
        "/events",
        json={"video_id": video, "label": "Shot", "start_ms": 2000, "end_ms": 5000},
    ).json()
    client.post(
        f"/videos/{video}/findings",
        json={"title": "Chances created", "event_ids": [e["id"]], "start_ms": 2000, "end_ms": 5000},
    )
    r = client.get(f"/videos/{video}/report")
    assert r.status_code == 200
    report = r.json()
    assert report["title"]
    assert report["generated_at"]
    assert len(report["findings"]) == 1
    f = report["findings"][0]
    assert f["title"] == "Chances created"
    assert f["clips"][0]["event_id"] == e["id"]
    assert f["clips"][0]["label"] == "Shot"
    assert f["clips"][0]["start_ms"] == 2000
