"""Production-friendly logging: write the backend's logs to a user-accessible
file under the Cuddy data dir (``%LOCALAPPDATA%\\Cuddy\\logs\\backend.log``) so a
packaged user can troubleshoot startup, missing DLLs/models, port conflicts, DB
or ML init failures without opening a terminal.
"""

from __future__ import annotations

import logging
import sys
from logging.handlers import RotatingFileHandler

from .config import settings


def setup_logging(level: int = logging.INFO) -> "Path | None":  # type: ignore[name-defined]
    """Attach a rotating file handler (and keep console output). Returns the log
    path, or None if the file handler could not be created."""
    settings.ensure_dirs()
    fmt = logging.Formatter(
        "%(asctime)s %(levelname)-5s [%(name)s] %(message)s", "%Y-%m-%d %H:%M:%S"
    )
    root = logging.getLogger()
    root.setLevel(level)

    # Console (captured by the parent process in dev).
    if not any(isinstance(h, logging.StreamHandler) for h in root.handlers):
        console = logging.StreamHandler(sys.stderr)
        console.setFormatter(fmt)
        root.addHandler(console)

    log_path = settings.logs_dir / "backend.log"
    try:
        fileh = RotatingFileHandler(
            log_path, maxBytes=2_000_000, backupCount=3, encoding="utf-8"
        )
        fileh.setFormatter(fmt)
        root.addHandler(fileh)
    except Exception as exc:  # noqa: BLE001 - never let logging setup crash startup
        root.warning("Could not open log file %s: %s", log_path, exc)
        return None

    # Route uvicorn's loggers through the same handlers.
    for name in ("uvicorn", "uvicorn.error", "uvicorn.access"):
        lg = logging.getLogger(name)
        lg.handlers = []
        lg.propagate = True

    root.info("Cuddy backend logging to %s", log_path)
    return log_path
