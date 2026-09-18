"""Export carries event provenance (source/detector/confidence/reviewed)."""

from __future__ import annotations


def _seed(client, video):
    client.post(
        "/events",
        json={
            "video_id": video,
            "label": "Shot",
            "start_ms": 2000,
            "end_ms": 5000,
            "source": "ai",
            "confidence": 0.82,
            "descriptors": ["goal"],
        },
    )
    # mark it reviewed via accept so reviewed=true and detector stays None
    ev = client.get("/events", params={"video_id": video}).json()[0]
    client.post(f"/events/{ev['id']}/accept")
    return ev["id"]


def test_csv_includes_provenance_columns(client, video):
    _seed(client, video)
    r = client.get(f"/export/videos/{video}/csv")
    assert r.status_code == 200
    text = r.text
    header = text.splitlines()[0]
    for col in ("source", "detector", "confidence", "reviewed", "category"):
        assert col in header, header
    row = text.splitlines()[1]
    assert "ai" in row
    assert "0.820" in row
    assert "true" in row  # reviewed after accept


def test_xml_includes_provenance_labels(client, video):
    _seed(client, video)
    r = client.get(f"/export/videos/{video}/xml")
    assert r.status_code == 200
    xml = r.text
    assert "<group>source</group>" in xml
    assert "<text>ai</text>" in xml
    assert "<group>confidence</group>" in xml
    assert "<group>reviewed</group>" in xml
