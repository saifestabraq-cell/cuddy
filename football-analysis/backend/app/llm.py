"""Natural-language query over a match's data (Phase 3c).

Provider-swappable behind a single ``_chat`` helper: Groq (free,
OpenAI-compatible) by default, or Anthropic. The active provider, key and model
come from the user settings store (or ``FA_LLM_PROVIDER`` / ``GROQ_API_KEY`` /
``ANTHROPIC_API_KEY`` / ``FA_LLM_MODEL`` in the environment).
"""

from __future__ import annotations

from . import user_settings

_GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"


class MissingApiKey(RuntimeError):
    """Raised when the active provider has no API key configured."""


def _client():
    """Anthropic client (only used when the provider is ``anthropic``)."""
    from anthropic import Anthropic

    key = user_settings.get_anthropic_key()
    if not key:
        raise MissingApiKey(
            "No Anthropic API key configured. Add one in Settings to use AI chat."
        )
    return Anthropic(api_key=key)


def _chat_groq(system: str, user: str, max_tokens: int) -> str:
    import httpx

    key = user_settings.get_groq_key()
    if not key:
        raise MissingApiKey(
            "No Groq API key configured. Add a free key in Settings to use AI chat."
        )
    model = user_settings.get_model()
    resp = httpx.post(
        _GROQ_URL,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        json={
            "model": model,
            "max_tokens": max_tokens,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
        },
        timeout=60.0,
    )
    if resp.status_code >= 400:
        # Surface Groq's own message (e.g. a decommissioned model) so it's actionable.
        detail = resp.text
        try:
            detail = resp.json().get("error", {}).get("message", detail)
        except Exception:  # noqa: BLE001
            pass
        raise RuntimeError(f"Groq ({model}): {detail}")
    data = resp.json()
    return (data["choices"][0]["message"].get("content") or "").strip()


def _chat_anthropic(system: str, user: str, max_tokens: int) -> str:
    client = _client()
    message = client.messages.create(
        model=user_settings.get_model(),
        max_tokens=max_tokens,
        system=system,
        messages=[{"role": "user", "content": user}],
    )
    return "".join(
        block.text for block in message.content if getattr(block, "type", None) == "text"
    ).strip()


def _chat(system: str, user: str, max_tokens: int) -> str:
    """Single grounded turn against the active provider; returns the reply text."""
    if user_settings.get_provider() == "anthropic":
        return _chat_anthropic(system, user, max_tokens)
    return _chat_groq(system, user, max_tokens)


SYSTEM = (
    "You are a football (soccer) match-analysis assistant. Answer the user's "
    "question using ONLY the provided match data (a JSON object of coded events, "
    "possession, passing, distances, shots and xG). Be concise and specific, and "
    "cite the numbers you used. If the data does not contain the answer, say so "
    "plainly — never invent statistics."
)


def answer_question(question: str, context_json: str) -> str:
    """Answer the question grounded in the match data JSON."""
    return _chat(
        SYSTEM,
        f"Match data (JSON):\n{context_json}\n\nQuestion: {question}",
        1024,
    )


QUERY_SYSTEM = (
    "You are a football (soccer) match-analysis assistant. You are given a JSON "
    "list of coded events (each with an id, code, start_s, end_s, source and "
    "descriptors) and a question. Select ONLY the events that answer the question "
    "and write a single-line summary (not prose). "
    'Respond with ONLY a JSON object: '
    '{"summary": "<one line>", "clips": [{"event_id": <id>, "reason": "<short why>"}]}. '
    "Use only event ids present in the data. If nothing matches, return an empty "
    "clips list and say so in the summary. Do not invent events or statistics."
)


EXPLAIN_SYSTEM = (
    "You are a football (soccer) match-analysis assistant. You are given a "
    "question and an EVIDENCE package that was computed deterministically from "
    "coded events and video analytics (summary, metrics with sources, matched "
    "event count and clips). Write a short, plain explanation grounded ONLY in "
    "this evidence. Do NOT invent numbers, events or clips beyond what is given. "
    "If a metric is labelled heuristic or approximate, reflect that uncertainty. "
    "Two or three sentences maximum."
)


def explain_evidence(question: str, evidence_json: str) -> str:
    """Write prose over an already-computed evidence package. The analytics are
    done; the LLM only explains. Never the source of the numbers."""
    return _chat(
        EXPLAIN_SYSTEM,
        f"Question: {question}\n\nEvidence (JSON):\n{evidence_json}",
        400,
    )


def query_clips(question: str, events_json: str) -> dict:
    """Translate a natural-language query into a selection of event clips + a
    one-line grounded summary. Context is the structured event record only."""
    import json as _json

    text = _chat(
        QUERY_SYSTEM,
        f"Events (JSON):\n{events_json}\n\nQuestion: {question}\n\n"
        "Return only the JSON object.",
        1500,
    )
    # tolerate ```json fences
    if text.startswith("```"):
        text = text.strip("`")
        text = text[text.find("{") : text.rfind("}") + 1]
    try:
        data = _json.loads(text)
    except Exception:  # noqa: BLE001 - fall back to a plain summary
        return {"summary": (text[:200] or "No structured answer."), "clips": []}
    clips = data.get("clips", [])
    return {
        "summary": str(data.get("summary", "")),
        "clips": clips if isinstance(clips, list) else [],
    }
