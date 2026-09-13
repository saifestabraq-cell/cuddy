# Cuddy

**Cuddy** is an AI-assisted football (soccer) match-analysis desktop app — the
kind of video-coding workflow a Nacsport Elite license provides, with
computer-vision automation layered on top.

- **Manual coding** you can trust: customizable tag buttons, a linked timeline,
  dashboards, and SportsCode-compatible XML / CSV export.
- **AI automation** (later phases): player + ball tracking, team detection,
  positional heatmaps, and auto-suggested event tags that land on the *same*
  timeline you hand-correct.

## Stack

| Layer | Tech |
|-------|------|
| Desktop shell | Tauri 2 (Rust) |
| UI | React 18 + TypeScript + Vite + Tailwind + framer-motion |
| Backend (sidecar) | Python 3.12 + FastAPI + SQLModel (SQLite) |
| CV/ML (Phase 2+) | PyTorch + Ultralytics YOLO + supervision + OpenCV |

## Project layout

```
football-analysis/
├─ src/            React frontend (components, store, API client, theme)
├─ src-tauri/      Rust desktop shell + config + icons
├─ backend/        Python FastAPI sidecar (app/, requirements.txt, .venv/)
├─ docs/           setup.md, architecture.md
└─ data/           local media + SQLite (gitignored)
```

## Getting started

Prerequisites (see [docs/setup.md](docs/setup.md) for details): Node 18+,
Python 3.12, Rust (stable) + MSVC C++ build tools.

```bash
# 1. Install frontend deps
npm install
node node_modules/esbuild/install.js   # if the esbuild binary is blocked

# 2. Create the Python backend env
cd backend
py -3.12 -m venv .venv
.venv/Scripts/python -m pip install -r requirements.txt
cd ..
```

### Run in the browser (fastest dev loop)

```bash
npm run dev      # starts the Python API + Vite together
```

Open http://localhost:5173.

### Run as the desktop app

```bash
npm run app      # tauri dev — compiles the Rust shell and opens the window
```

The first `npm run app` compiles the Rust dependencies and can take several
minutes; subsequent runs are fast.

## Status

- **Phase 0 complete** — scaffold, design system, data model, video
  import/playback, tag pad + timeline, dashboards, XML/CSV export.
- **Phase 1 complete** — event edit panel (drag/numeric boundaries, notes,
  reviewed), structured descriptors (groups + buttons), combined filtering,
  highlight playlists (play reel + selection export), and portable coding
  templates (save/apply).

- **Phase 2a complete** — CV analysis: YOLO detection + ByteTrack tracking +
  k-means team classification, run as a background job with progress, and a
  live detection overlay (player boxes tinted by team, ball marker) drawn over
  the video. GPU-accelerated (verified on the RTX 3050 Ti).
- **Phase 2b complete** — manual 4-point pitch calibration → homography →
  per-team position heatmaps + distances, and heuristic auto-tagging (ball in
  a final third) as reviewable AI events on the timeline.

- **Phase 3a complete** — possession & passing analytics: nearest-player ball
  assignment → team possession %, pass network, turnovers, with turnovers
  taggable as reviewable AI events.

Phase 3b (shots + simple xG) and 3c (natural-language query via the Claude API)
are described in [docs/architecture.md](docs/architecture.md).

> The CV stack is a separate install — see [docs/setup.md](docs/setup.md#cv--ml-dependencies-phase-2).
