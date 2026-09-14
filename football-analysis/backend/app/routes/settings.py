"""User settings: the Anthropic API key and model for AI chat.

The key is never returned to the client — only whether one is configured — so
it is not echoed back into the UI or logs.
"""

from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

from .. import user_settings

router = APIRouter(prefix="/settings", tags=["settings"])


class SettingsStatus(BaseModel):
    anthropic_api_key_set: bool
    model: str
    key_source: str  # "env" | "stored" | "none"


class SettingsUpdate(BaseModel):
    anthropic_api_key: str | None = None
    model: str | None = None


def _status() -> SettingsStatus:
    import os

    if os.environ.get("ANTHROPIC_API_KEY"):
        source = "env"
    elif user_settings.load().get("anthropic_api_key"):
        source = "stored"
    else:
        source = "none"
    return SettingsStatus(
        anthropic_api_key_set=user_settings.has_key(),
        model=user_settings.get_model(),
        key_source=source,
    )


@router.get("", response_model=SettingsStatus)
def get_settings() -> SettingsStatus:
    return _status()


@router.post("", response_model=SettingsStatus)
def update_settings(payload: SettingsUpdate) -> SettingsStatus:
    user_settings.set_values(
        anthropic_api_key=payload.anthropic_api_key,
        model=payload.model,
    )
    return _status()
