"""Launch the sidecar.

Used both by `python -m app` in development and by the PyInstaller-frozen
executable in the packaged app. The app object is passed directly (not as an
import string) so it resolves correctly inside a frozen build.
"""

from __future__ import annotations

import uvicorn

from .config import settings
from .main import app

if __name__ == "__main__":
    uvicorn.run(
        app,
        host=settings.host,
        port=settings.port,
        reload=False,
        log_level="info",
    )
