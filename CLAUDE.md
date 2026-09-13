# CLAUDE.md

This file gives Claude context and instructions for working in this project.

## Overview

Cuddy is an AI-assisted football (soccer) match-analysis desktop app. It combines
Nacsport-style manual video coding with a CV + LLM layer that suggests events,
maps the pitch, and answers questions over the user's own footage. The app lives
in `football-analysis/`.

**Governing principle:** AI-assisted, not fully automated. Every machine output
is a reviewable suggestion rendered with visible confidence, on the same timeline
the analyst hand-corrects. Spatial CV is an *approximate* visual layer, always
labelled approximate — never presented as measured data. The tool only reads
footage the user selected from their own disk; it never fetches, hosts, or
redistributes media.

## Conventions

- **Stack:** Tauri 2 (Rust shell) + React 18 / TypeScript / Vite / Tailwind /
  Zustand frontend + Python 3.12 FastAPI sidecar (SQLModel over SQLite) + a CV
  stack (Ultralytics YOLO, ByteTrack, OpenCV, scikit-learn) + Anthropic LLM.
- **`Event.source`** (`"manual"` | `"ai"`) is the single unification point —
  manual and AI events are the same rows through the same endpoints. Do not fork
  AI data into a separate store.
- Heavy CV imports (`torch`, `cv2`, `ultralytics`) stay lazy inside functions so
  the API starts fast.
- AI-origin data is visually distinct in the UI (violet accent) and carries
  confidence. Design tokens live in `tailwind.config.js`.
- Keep the LLM provider swappable behind `backend/app/llm.py`; send compact,
  anonymized (numeric-ID) context, never raw video.
- Schema changes ship as Alembic migrations (see `backend/alembic/`).

## Commands

Run from `football-analysis/`:

- `npm run dev` — Python API + Vite together (browser dev at localhost:5173)
- `npm run app` — Tauri desktop app (dev)
- `npm run app:build` — packaged Windows installer
- `cd backend && .venv/Scripts/python -m app` — backend only
- `cd backend && .venv/Scripts/alembic upgrade head` — apply DB migrations

## Notes

- Backend data (SQLite, media, tracks) lives under `%LOCALAPPDATA%\Cuddy`
  (override with `FA_DATA_DIR`).
- Natural-language query needs `ANTHROPIC_API_KEY` in the backend environment.
- The packaged sidecar is a PyInstaller onefile; new backend code needs a
  rebuild (`npm run app:build`) to reach the installed app.

## Rules

- Always ask at least three clarifying questions before starting any complex task.
- Always present a plan before execution.
- Never make assumptions when important information is missing.
- Keep outputs concise and relevant.
- Do not add filler content to increase length.
- Stay within requested word counts and formats.
- Use practical examples whenever possible.
- When multiple approaches exist, explain the tradeoffs.
- If uncertain, ask before proceeding.
- Review outputs before final delivery.

## File Naming Rules

- Use lowercase file names.
- Use hyphens instead of spaces.
- Use descriptive names.
- Avoid special characters.

Examples:

- `ai-agent-research.md`
- `youtube-script-outline.md`
- `workflow-documentation.md`
