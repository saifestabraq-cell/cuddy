"""Natural-language query over a match's data via the Anthropic API (Phase 3c).

Reads ANTHROPIC_API_KEY from the environment. The model defaults to
``claude-opus-5`` and can be overridden with FA_LLM_MODEL.
"""

from __future__ import annotations

import os

SYSTEM = (
    "You are a football (soccer) match-analysis assistant. Answer the user's "
    "question using ONLY the provided match data (a JSON object of coded events, "
    "possession, passing, distances, shots, xG, and selected-player context when provided). Be concise and specific, and "
    "cite the numbers you used. If the data does not contain the answer, say so "
    "plainly — never invent statistics."
)


def answer_question(question: str, context_json: str) -> str:
    """Ask Claude the question grounded in the match data JSON."""
    from anthropic import Anthropic

    client = Anthropic()  # picks up ANTHROPIC_API_KEY
    model = os.environ.get("FA_LLM_MODEL", "claude-opus-5")
    message = client.messages.create(
        model=model,
        max_tokens=1024,
        system=SYSTEM,
        messages=[
            {
                "role": "user",
                "content": f"Match data (JSON):\n{context_json}\n\nQuestion: {question}",
            }
        ],
    )
    return "".join(
        block.text for block in message.content if getattr(block, "type", None) == "text"
    ).strip()


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


def query_clips(question: str, events_json: str) -> dict:
    """Translate a natural-language query into a selection of event clips + a
    one-line grounded summary. Context is the structured event record only."""
    import json as _json

    from anthropic import Anthropic

    client = Anthropic()
    model = os.environ.get("FA_LLM_MODEL", "claude-opus-5")
    message = client.messages.create(
        model=model,
        max_tokens=1500,
        system=QUERY_SYSTEM,
        messages=[
            {
                "role": "user",
                "content": (
                    f"Events (JSON):\n{events_json}\n\nQuestion: {question}\n\n"
                    "Return only the JSON object."
                ),
            }
        ],
    )
    text = "".join(
        b.text for b in message.content if getattr(b, "type", None) == "text"
    ).strip()
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
