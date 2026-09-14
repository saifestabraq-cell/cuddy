"""Development entry point: `python -m app` (or `.venv/Scripts/python -m app`).

Reuses the single FastAPI app object from `app.main` — never construct a
second app. Host/port default to settings (127.0.0.1:8765) and can be
overridden with CUDDY_HOST / CUDDY_PORT (same override the production
executable, `sidecar_entry.py`, honors), so both entry points behave the same
way for local port conflicts.

NOTE: the packaged/frozen executable does NOT use this file. A frozen
PyInstaller build can't resolve this module's relative imports (`from .config`)
when run as `__main__`, so `sidecar_entry.py` (absolute imports) is the actual
production entry point — see cuddy-backend.spec.
"""

from __future__ import annotations

import os

import uvicorn

from .config import settings
from .main import app

if __name__ == "__main__":
    host = os.getenv("CUDDY_HOST", settings.host)
    port = int(os.getenv("CUDDY_PORT", str(settings.port)))
    uvicorn.run(
        app,
        host=host,
        port=port,
        reload=False,
        log_level="info",
    )
