"""A tiny in-memory background-job registry.

Analysis runs on a worker thread so the API stays responsive; the frontend
polls ``GET /jobs/{id}`` for progress. Jobs are process-local (fine for a
single-user desktop app) and cleared on restart.
"""

from __future__ import annotations

import threading
import uuid
from dataclasses import dataclass, field
from typing import Any, Callable, Optional


@dataclass
class Job:
    id: str
    kind: str
    status: str = "pending"  # pending | running | done | error
    progress: float = 0.0
    message: str = ""
    result: Optional[dict] = None
    error: Optional[str] = None
    meta: dict = field(default_factory=dict)

    def as_dict(self) -> dict[str, Any]:
        return {
            "id": self.id, "kind": self.kind, "status": self.status,
            "progress": round(self.progress, 3), "message": self.message,
            "result": self.result, "error": self.error, "meta": self.meta,
        }


_jobs: dict[str, Job] = {}
_lock = threading.Lock()


def get_job(job_id: str) -> Optional[Job]:
    with _lock:
        return _jobs.get(job_id)


def start_job(kind: str, target: Callable[[Job], dict], meta: Optional[dict] = None) -> Job:
    """Create a job and run ``target(job)`` on a daemon thread.

    ``target`` receives the Job and may update ``job.progress`` / ``job.message``;
    its return value becomes ``job.result``.
    """
    job = Job(id=uuid.uuid4().hex[:12], kind=kind, meta=meta or {})
    with _lock:
        _jobs[job.id] = job

    def run() -> None:
        job.status = "running"
        try:
            job.result = target(job)
            job.status = "done"
            job.progress = 1.0
        except Exception as exc:  # noqa: BLE001 - surface any failure to the client
            job.status = "error"
            job.error = f"{type(exc).__name__}: {exc}"

    threading.Thread(target=run, daemon=True).start()
    return job
