"""User-writable app settings (persisted outside the source tree).

Holds runtime configuration the user supplies at runtime — currently the
Anthropic API key and optional model — in a small JSON file under the data
directory. This lets the packaged app be configured without environment
variables. An ``ANTHROPIC_API_KEY`` in the environment still wins, so existing
dev workflows keep working.
"""

from __future__ import annotations

import json
import os

from .config import settings

_FILENAME = "settings.json"


def _path():
    return settings.data_dir / _FILENAME


def load() -> dict:
    p = _path()
    if p.exists():
        try:
            data = json.loads(p.read_text(encoding="utf-8"))
            return data if isinstance(data, dict) else {}
        except (ValueError, OSError):
            return {}
    return {}


def save(data: dict) -> None:
    settings.ensure_dirs()
    _path().write_text(json.dumps(data, indent=2), encoding="utf-8")


def get_anthropic_key() -> str | None:
    """The Anthropic key, preferring an explicit environment variable."""
    env = os.environ.get("ANTHROPIC_API_KEY")
    if env:
        return env
    key = load().get("anthropic_api_key")
    return key or None


def get_model() -> str:
    return os.environ.get("FA_LLM_MODEL") or load().get("model") or "claude-opus-5"


def set_values(*, anthropic_api_key: str | None = None, model: str | None = None) -> None:
    data = load()
    if anthropic_api_key is not None:
        stripped = anthropic_api_key.strip()
        if stripped:
            data["anthropic_api_key"] = stripped
        else:
            data.pop("anthropic_api_key", None)
    if model is not None:
        stripped = model.strip()
        if stripped:
            data["model"] = stripped
        else:
            data.pop("model", None)
    save(data)


def has_key() -> bool:
    return bool(get_anthropic_key())
