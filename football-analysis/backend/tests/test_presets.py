"""Workspace presets (§3): project-scoped saved Filter snapshots."""

from __future__ import annotations


def _project(client) -> int:
    return client.post("/projects", json={"name": "P"}).json()["id"]


def test_create_list_delete_preset(client):
    pid = _project(client)
    flt = {"source": "ai", "zones": ["final_third", "left"], "categoryIds": []}
    created = client.post(
        f"/projects/{pid}/presets",
        json={"name": "Left-side AI", "filter": flt},
    )
    assert created.status_code == 201, created.text
    preset = created.json()
    assert preset["name"] == "Left-side AI"
    assert preset["filter"]["zones"] == ["final_third", "left"]

    listed = client.get(f"/projects/{pid}/presets").json()
    assert [p["id"] for p in listed] == [preset["id"]]

    assert client.delete(f"/presets/{preset['id']}").status_code == 204
    assert client.get(f"/projects/{pid}/presets").json() == []


def test_preset_requires_name(client):
    pid = _project(client)
    r = client.post(f"/projects/{pid}/presets", json={"name": "  ", "filter": {}})
    assert r.status_code == 422


def test_preset_unknown_project_404(client):
    r = client.post("/projects/99999/presets", json={"name": "x", "filter": {}})
    assert r.status_code == 404


def test_presets_scoped_to_project(client):
    a, b = _project(client), _project(client)
    client.post(f"/projects/{a}/presets", json={"name": "A-only", "filter": {}})
    assert len(client.get(f"/projects/{a}/presets").json()) == 1
    assert client.get(f"/projects/{b}/presets").json() == []
