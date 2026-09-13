"""PyInstaller entry point for the packaged sidecar.

Uses absolute imports (relative imports don't resolve in a frozen __main__).
The heavy CV libraries (torch/ultralytics/opencv) are intentionally excluded
from the lean build; CV endpoints raise a clear error if invoked without them.
"""

import uvicorn

from app.config import settings
from app.main import app

if __name__ == "__main__":
    uvicorn.run(app, host=settings.host, port=settings.port, log_level="info")
