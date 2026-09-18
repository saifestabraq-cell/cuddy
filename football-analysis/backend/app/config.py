"""Runtime configuration.

Resolves a per-user data directory so the SQLite DB and any imported media
live outside the source tree (and, importantly, can be pointed outside of a
OneDrive-synced folder to avoid sync churn during development).
"""

from __future__ import annotations

import os
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


def _default_data_dir() -> Path:
    """Choose a sensible per-user data directory for app state."""
    # Allow an explicit override (used by the Tauri sidecar launcher).
    override = os.environ.get("FA_DATA_DIR")
    if override:
        return Path(override)

    if os.name == "nt":
        base = os.environ.get("LOCALAPPDATA") or str(Path.home())
        return Path(base) / "Cuddy"
    return Path.home() / ".local" / "share" / "cuddy"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="FA_", env_file=".env", extra="ignore")

    app_name: str = "Cuddy"
    host: str = "127.0.0.1"
    port: int = 8765

    data_dir: Path = _default_data_dir()

    @property
    def db_path(self) -> Path:
        return self.data_dir / "app.db"

    @property
    def media_dir(self) -> Path:
        return self.data_dir / "media"

    @property
    def tracks_dir(self) -> Path:
        return self.data_dir / "tracks"

    @property
    def logs_dir(self) -> Path:
        return self.data_dir / "logs"

    def ensure_dirs(self) -> None:
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.media_dir.mkdir(parents=True, exist_ok=True)
        self.tracks_dir.mkdir(parents=True, exist_ok=True)
        self.logs_dir.mkdir(parents=True, exist_ok=True)


settings = Settings()
