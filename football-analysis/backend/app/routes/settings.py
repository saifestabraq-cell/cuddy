"""User settings: the AI provider/key (Groq or Anthropic) and API-Football key.

Keys are never returned to the client — only whether each is configured — so
they are not echoed back into the UI or logs.
"""

from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

from .. import user_settings

router = APIRouter(prefix="/settings", tags=["settings"])


class SettingsStatus(BaseModel):
    anthropic_api_key_set: bool
    groq_api_key_set: bool
    provider: str  # "groq" | "anthropic"
    model: str
    key_source: str  # active provider's key: "env" | "stored" | "none"
    apifootball_key_set: bool


class SettingsUpdate(BaseModel):
    anthropic_api_key: str | None = None
    groq_api_key: str | None = None
    provider: str | None = None
    model: str | None = None
    apifootball_key: str | None = None


def _key_source() -> str:
    """Where the active provider's key comes from."""
    import os

    provider = user_settings.get_provider()
    env_var = "GROQ_API_KEY" if provider == "groq" else "ANTHROPIC_API_KEY"
    stored_field = "groq_api_key" if provider == "groq" else "anthropic_api_key"
    if os.environ.get(env_var):
        return "env"
    if user_settings.load().get(stored_field):
        return "stored"
    return "none"


def _status() -> SettingsStatus:
    return SettingsStatus(
        anthropic_api_key_set=user_settings.has_anthropic_key(),
        groq_api_key_set=user_settings.has_groq_key(),
        provider=user_settings.get_provider(),
        model=user_settings.get_model(),
        key_source=_key_source(),
        apifootball_key_set=user_settings.has_apifootball_key(),
    )


@router.get("", response_model=SettingsStatus)
def get_settings() -> SettingsStatus:
    return _status()


@router.post("", response_model=SettingsStatus)
def update_settings(payload: SettingsUpdate) -> SettingsStatus:
    user_settings.set_values(
        anthropic_api_key=payload.anthropic_api_key,
        groq_api_key=payload.groq_api_key,
        provider=payload.provider,
        model=payload.model,
        apifootball_key=payload.apifootball_key,
    )
    return _status()
