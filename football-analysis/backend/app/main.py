"""FastAPI application entrypoint (the Python sidecar).

Run directly for development:
    uvicorn app.main:app --reload --port 8765
or via the module runner:
    python -m app
"""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import __version__
from .config import settings
from .db import init_db
from .routes import (
    analysis,
    categories,
    descriptors,
    events,
    export,
    projects,
    templates,
    videos,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title=settings.app_name, version=__version__, lifespan=lifespan)

# In dev the Vite server runs on :5173; the packaged Tauri app uses the
# tauri://localhost origin. Allow both plus localhost variants.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "tauri://localhost",
        # Windows WebView2 serves the packaged app from http://tauri.localhost;
        # macOS/Linux use https://tauri.localhost. Allow both so the desktop
        # app's requests aren't blocked by CORS.
        "http://tauri.localhost",
        "https://tauri.localhost",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["meta"])
def health():
    """Liveness probe used by the frontend to confirm the sidecar is up."""
    return {"status": "ok", "app": settings.app_name, "version": __version__}


app.include_router(projects.router)
app.include_router(videos.router)
app.include_router(categories.router)
app.include_router(descriptors.router)
app.include_router(events.router)
app.include_router(export.router)
app.include_router(templates.router)
app.include_router(analysis.router)
