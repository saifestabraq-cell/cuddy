"""PyInstaller entry point for the packaged Cuddy backend (cuddy-backend.exe).

Uses absolute imports (relative imports don't resolve in a frozen __main__).
Sets up file logging first so any startup failure (missing DLL/model, port
conflict, DB or ML init error) is recorded to %LOCALAPPDATA%\\Cuddy\\logs\\ where
the user can find it without a terminal.

Host/port default to 127.0.0.1:8765 and can be overridden with CUDDY_HOST /
CUDDY_PORT (or the FA_HOST / FA_PORT settings the app already reads).
"""

import logging
import os
import sys
import traceback

from app.logging_setup import setup_logging

log_path = setup_logging()
log = logging.getLogger("cuddy.entry")


def main() -> int:
    import uvicorn

    from app.config import settings
    from app.main import app

    host = os.getenv("CUDDY_HOST", settings.host)
    port = int(os.getenv("CUDDY_PORT", str(settings.port)))
    log.info("Starting Cuddy backend on http://%s:%s", host, port)
    uvicorn.run(app, host=host, port=port, log_level="info")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except SystemExit:
        raise
    except Exception:  # noqa: BLE001 - record the traceback before exiting
        log.critical("Cuddy backend failed to start:\n%s", traceback.format_exc())
        sys.exit(1)
