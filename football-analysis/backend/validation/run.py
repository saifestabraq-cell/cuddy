"""CLI: score a video's AI events against its manual reference.

    cd backend && .venv/Scripts/python -m validation.run <video_id>

Prints the report and writes a timestamped JSON under the data dir's
``validation/`` folder for run-to-run comparison.
"""

from __future__ import annotations

import sys

from sqlmodel import Session

from app.db import engine

from .service import build_validation, write_report


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: python -m validation.run <video_id>")
        return 2
    try:
        video_id = int(sys.argv[1])
    except ValueError:
        print("video_id must be an integer")
        return 2

    with Session(engine) as session:
        result = build_validation(video_id, session)

    print(result["report"])
    path = write_report(result)
    print(f"\nsaved: {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
