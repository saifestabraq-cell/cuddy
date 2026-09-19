"""Analysis cancel + retry (§15): cooperative cancellation keeps partial work.

These drive the pipeline runner directly with fake stages, so no CV stack is
needed. They prove: cancel between stages, cancel mid-stage (via progress),
partial results preserved, retry resumes from the last completed stage, and the
cancel endpoint. Main's stage functions take (video, progress).
"""

from __future__ import annotations

from sqlmodel import Session

from app import pipeline
from app.db import engine
from app.models import AnalysisRun


def _new_run(video_id: int) -> int:
    with Session(engine) as s:
        run = AnalysisRun(video_id=video_id, status="pending")
        s.add(run)
        s.commit()
        s.refresh(run)
        return run.id


def _get(run_id: int) -> AnalysisRun:
    with Session(engine) as s:
        return s.get(AnalysisRun, run_id)


def test_cancel_between_stages_keeps_nothing_completed(client, video, monkeypatch):
    run_id = _new_run(video)
    monkeypatch.setitem(pipeline.STAGE_FNS, "triage", lambda v, p: p(1.0, "ok"))
    # Cancel is requested before the runner starts -> it stops at the first
    # between-stage check, before any stage runs.
    pipeline.request_cancel(run_id)
    pipeline._run_pipeline(run_id)

    run = _get(run_id)
    assert run.status == "cancelled"
    assert run.completed_stages == []
    # Registry cleaned up so a later retry isn't cancelled instantly.
    assert pipeline._is_cancel_requested(run_id) is False


def test_cancel_mid_stage_preserves_prior_stage(client, video, monkeypatch):
    run_id = _new_run(video)

    def fake_triage(v, progress):
        progress(1.0, "triaged")

    def fake_events(v, progress):
        progress(0.1, "detecting")
        pipeline.request_cancel(run_id)  # cancel arrives during the stage
        progress(0.2, "detecting more")  # next progress tick raises _Cancelled
        progress(0.9, "unreachable")

    monkeypatch.setitem(pipeline.STAGE_FNS, "triage", fake_triage)
    monkeypatch.setitem(pipeline.STAGE_FNS, "events", fake_events)

    pipeline._run_pipeline(run_id)

    run = _get(run_id)
    assert run.status == "cancelled"
    assert "triage" in run.completed_stages  # finished stage kept
    assert "events" not in run.completed_stages  # interrupted stage not marked
    assert "events" in run.message


def test_retry_resumes_from_completed_stages(client, video, monkeypatch):
    # Simulate a cancelled run that finished triage.
    with Session(engine) as s:
        run = AnalysisRun(
            video_id=video, status="cancelled", completed_stages=["triage"]
        )
        s.add(run)
        s.commit()
        s.refresh(run)
        run_id = run.id

    # Don't actually launch the worker thread in the test.
    monkeypatch.setattr(pipeline, "_launch", lambda rid: None)
    with Session(engine) as s:
        resumed = pipeline.start_analysis(s, video)

    assert resumed.id == run_id  # same run reused, not a new one
    assert resumed.status == "pending"
    assert resumed.completed_stages == ["triage"]  # partial work preserved
    assert pipeline._is_cancel_requested(run_id) is False


def test_cancel_endpoint_marks_intent(client, video):
    run_id = _new_run(video)
    with Session(engine) as s:
        run = s.get(AnalysisRun, run_id)
        run.status = "running"
        s.add(run)
        s.commit()

    r = client.post(f"/jobs/{run_id}/cancel")
    assert r.status_code == 200, r.text
    assert pipeline._is_cancel_requested(run_id) is True
    # Clean up the registry so it can't affect other tests.
    pipeline._clear_cancel(run_id)


def test_cancel_endpoint_unknown_job_404(client):
    assert client.post("/jobs/999999/cancel").status_code == 404
