"""User-writable app settings (persisted outside the source tree).

Holds runtime configuration the user supplies at runtime — the AI provider and
its API key (Groq by default, Anthropic optional), an optional model, and the
API-Football key — in a small JSON file under the data directory. This lets the
packaged app be configured without environment variables. Matching environment
variables still win, so existing dev workflows keep working.
"""

from __future__ import annotations

import json
import os

from .config import settings

_FILENAME = "settings.json"

# Default AI provider. Groq is free (OpenAI-compatible); Anthropic is optional.
_DEFAULT_PROVIDER = "groq"
_DEFAULT_MODELS = {
    "groq": "llama-3.3-70b-versatile",
    "anthropic": "claude-opus-5",
}


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


def get_groq_key() -> str | None:
    """The Groq key (free, OpenAI-compatible), preferring the environment."""
    env = os.environ.get("GROQ_API_KEY")
    if env:
        return env
    key = load().get("groq_api_key")
    return key or None


def get_provider() -> str:
    """Active AI provider: ``"groq"`` (default) or ``"anthropic"``."""
    p = (os.environ.get("FA_LLM_PROVIDER") or load().get("provider") or _DEFAULT_PROVIDER)
    p = str(p).strip().lower()
    return p if p in _DEFAULT_MODELS else _DEFAULT_PROVIDER


def get_model() -> str:
    """Model id for the active provider.

    A model stored under the provider's own key wins; ``FA_LLM_MODEL`` overrides
    both. The legacy ``model`` key applies only to Anthropic so switching to Groq
    never sends a Claude model id to the Groq endpoint.
    """
    env = os.environ.get("FA_LLM_MODEL")
    if env:
        return env
    data = load()
    provider = get_provider()
    if provider == "groq":
        return data.get("groq_model") or _DEFAULT_MODELS["groq"]
    return data.get("model") or _DEFAULT_MODELS["anthropic"]


def get_apifootball_key() -> str | None:
    """API-Football (api-sports.io) key for real match data."""
    env = os.environ.get("APIFOOTBALL_KEY")
    if env:
        return env
    key = load().get("apifootball_key")
    return key or None


def _set_key(data: dict, field: str, value: str | None) -> None:
    if value is None:
        return
    stripped = value.strip()
    if stripped:
        data[field] = stripped
    else:
        data.pop(field, None)


def set_values(
    *,
    anthropic_api_key: str | None = None,
    groq_api_key: str | None = None,
    provider: str | None = None,
    model: str | None = None,
    apifootball_key: str | None = None,
) -> None:
    data = load()
    _set_key(data, "anthropic_api_key", anthropic_api_key)
    _set_key(data, "groq_api_key", groq_api_key)
    if provider is not None:
        p = provider.strip().lower()
        if p in _DEFAULT_MODELS:
            data["provider"] = p
    _set_key(data, "model", model)
    _set_key(data, "apifootball_key", apifootball_key)
    save(data)


def has_anthropic_key() -> bool:
    return bool(get_anthropic_key())


def has_groq_key() -> bool:
    return bool(get_groq_key())


# Backwards-compatible alias (was Anthropic-only).
def has_key() -> bool:
    return has_anthropic_key()


def has_llm_key() -> bool:
    """Whether the active provider has a usable key."""
    return has_groq_key() if get_provider() == "groq" else has_anthropic_key()


def has_apifootball_key() -> bool:
    return bool(get_apifootball_key())
