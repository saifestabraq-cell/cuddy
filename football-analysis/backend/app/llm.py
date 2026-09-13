"""Natural-language query over a match's data via the Anthropic API (Phase 3c).

Reads ANTHROPIC_API_KEY from the environment. The model defaults to
``claude-opus-5`` and can be overridden with FA_LLM_MODEL.
"""

from __future__ import annotations

import os

SYSTEM = (
    "You are a football (soccer) match-analysis assistant. Answer the user's "
    "question using ONLY the provided match data (a JSON object of coded events, "
    "possession, passing, distances, shots and xG). Be concise and specific, and "
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
