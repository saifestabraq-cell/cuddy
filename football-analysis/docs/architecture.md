# Architecture

## Shape

```
┌─────────────────────────────────────────────┐
│ Tauri shell (Rust)                           │
│  ┌────────────────────────────────────────┐  │
│  │ WebView — React + TS UI                 │  │
│  │  timeline · tag pad · dashboards        │  │
│  └───────────────┬────────────────────────┘  │
│                  │ HTTP (127.0.0.1:8765)      │
│  ┌───────────────▼────────────────────────┐  │
│  │ Python sidecar — FastAPI                │  │
│  │  events · videos · export · (CV later)  │  │
│  │  SQLite (SQLModel)                       │  │
│  └───────────────┬────────────────────────┘  │
│                  │  GPU (Phase 2+)             │
│            YOLO · tracking · homography        │
└─────────────────────────────────────────────┘
```

The UI never touches the ML libraries directly — it speaks HTTP to the Python
sidecar. This keeps the heavy Python/CV world isolated behind a clean API and
lets the same backend be exercised from tests or a browser during development.

## Data model

- **Project** — a body of analysis work.
- **Video** — an imported clip (referenced by absolute path in Phase 0).
- **Category** — a coding button (name, colour, hotkey, lead/lag capture
  window).
- **Event** — a tagged moment: `start_ms`, `end_ms`, category, free-form
  `descriptors`, plus `source` (`manual` | `ai`) and `confidence`.

The **`source` field is the hinge** between the manual and AI workflows: a CV
model inserts events with `source="ai"` and a confidence score; the analyst
reviews and corrects them on the exact same timeline as manually coded events.

## Manual ↔ AI unification

Both paths write `Event` rows through the same endpoints. The UI tints AI events
(dashed, accent colour) and exposes a review flow, but there is no separate
"AI data" — corrected AI events are just events. This is what delivers the
"reliable manual coding *and* AI automation" requirement without a fork.

## Roadmap

### Phase 0 — Foundation ✅
Scaffold, design system, data model, video import + range-streamed playback,
manual tag pad, timeline, dashboards, XML/CSV export. Wired end-to-end.

### Phase 1 — Manual coding depth ✅
Event edit panel (numeric + drag boundaries, label, notes, reviewed flag),
structured descriptor groups + buttons attached to events, combined filtering
(category · descriptor · source · text), highlight playlists (back-to-back
presentation playback + selection export), and portable coding templates
(save as JSON / apply to another project).

### Phase 2a — CV detection layer ✅
- Player + ball detection & tracking (Ultralytics YOLO + ByteTrack).
- Team classification by kit-colour k-means clustering.
- Background job system (`POST /videos/{id}/analyze` → `GET /jobs/{id}`), results
  written to `tracks/<video_id>.json`.
- Live detection overlay: a canvas over the video draws per-frame boxes tinted
  by team (+ ball marker), synced to playback, toggleable.

Scoped to the 4 GB GPU: `yolov8n`, 5 fps sampling, offline batch. Verified GPU
inference on the RTX 3050 Ti.

### Phase 2b — positional layer ✅
- Manual 4-point pitch calibration (click the corners on the video) →
  homography (`cv2.getPerspectiveTransform`) → pitch metres.
- Per-team position heatmaps rendered on a top-down pitch, plus per-team
  distance covered (with a speed filter to reject tracking jumps).
- Heuristic auto-tagging (ball in a final third) written as `source="ai"`
  events on the shared timeline for review.

Endpoints: `POST /videos/{id}/calibrate`, `GET /videos/{id}/pitch`,
`POST /videos/{id}/autotag`.

### Phase 3a — Possession & passing ✅
- Nearest-player ball assignment per frame → possession %, pass network
  (who→whom), turnovers. Heuristic; quality depends on ball tracking.
- Turnovers can be tagged as `source="ai"` events for review.
- Endpoints: `POST/GET /videos/{id}/analytics`, `POST /videos/{id}/tag-turnovers`.

### Phase 3b — Shots & simple xG ✅
Heuristic shot detection (fast ball toward a goal) → transparent distance/angle
logistic xG estimate → shot map (markers sized by xG) + per-team xG/shot totals.
Endpoints: `POST/GET /videos/{id}/shots`, `POST /videos/{id}/tag-shots`.

### Phase 3c — Natural-language query ✅ (Claude API)
Ask plain-English questions over the match's events/stats; the backend builds a
compact JSON context and calls the Anthropic API (`app/llm.py`, model
`claude-opus-5`, override with `FA_LLM_MODEL`). Needs `ANTHROPIC_API_KEY` in the
backend environment; without it the endpoint returns a clear 400.
Endpoint: `POST /videos/{id}/ask`.

## Production backend packaging

### Development architecture
```
React (Vite :5173)  →  Tauri window  →  local Python FastAPI (npm run dev:api)
```
`npm run dev` runs the API and Vite together; `npm run app` (`tauri dev`) opens
the desktop window against that same local backend. Developers never need
PyInstaller — `src-tauri/src/lib.rs` only spawns the sidecar in **release**
builds (`#[cfg(not(debug_assertions))]`).

### Production architecture
```
React  →  Tauri  →  bundled cuddy-backend.exe  →  FastAPI  →  CV/ML + SQLite
```
The Python backend is frozen into a single executable (`cuddy-backend.exe`,
via PyInstaller + `backend/cuddy-backend.spec`) and shipped as a **Tauri
external binary** (`sidecar`). On startup, `lib.rs` spawns it and tracks the
child process so it can be terminated when the window closes (no orphaned
`cuddy-backend.exe` after quitting). The frontend polls `GET /health` and
shows a staged readiness UI: *Starting Cuddy Engine…* → *Connecting to
Analysis Engine…* → *Engine ready*, or *Analysis Engine failed to start* with
Retry / a pointer to the log file after ~20s of failed attempts.

### Building the production installer

```bash
npm run build:windows   # full: backend .exe -> sidecar -> Tauri installer
npm run build:backend   # backend .exe only (-BackendOnly), for iterating
```

Equivalent to running `scripts/build-windows.ps1` directly. It: verifies
Python/Node/Rust, builds `backend/.venv-cpu` (CPU PyTorch + the full CV stack —
CPU, not CUDA, so the resulting binary runs on any Windows PC), runs
PyInstaller against `cuddy-backend.spec`, copies the result to
`src-tauri/binaries/cuddy-backend-x86_64-pc-windows-msvc.exe`, then runs
`npm run app:build`. Installer output:
`src-tauri/target/release/bundle/nsis/Cuddy_<version>_x64-setup.exe`.

`cuddy-backend.spec` `collect_all`s the native/plugin-heavy packages (torch,
torchvision, ultralytics, cv2, supervision, sklearn, numpy, scipy, pandas,
matplotlib) and bundles `alembic.ini` + `alembic/` as data (the frozen
`app/migrations.py` resolves their path from `__file__`, which PyInstaller
points at the extraction root — this must stay bundled at the executable's
root, not nested).

### Logging & troubleshooting

The backend logs to `%LOCALAPPDATA%\Cuddy\logs\backend.log` (rotating, no
terminal required) from the moment `sidecar_entry.py` starts, before any other
import — so a crash during heavy CV imports, a missing model/DLL, or a DB init
failure is still recorded.

| Symptom | Likely cause | Check |
|---|---|---|
| Stuck "Starting Cuddy Engine…" past ~20s, then "failed to start" | Backend crashed on startup | `backend.log` for the traceback |
| "port conflict" / nothing on 8765 | Another process holds 8765 | The backend binds `127.0.0.1:8765` only; free the port or check for a leftover `cuddy-backend.exe` in Task Manager |
| Missing DLL / import error in the log | A native dependency wasn't collected | Add the package to `COLLECT_ALL` in `cuddy-backend.spec` and rebuild |
| YOLO model fails to load offline | `yolov8n.pt` auto-downloads from Ultralytics on first analysis | Requires network on first run; not bundled (kept small + always current) |
| Installer built but app won't launch on a clean machine | Missing WebView2 runtime (rare on modern Windows) | NSIS installer pulls WebView2 if absent; verify with a clean-VM install |

### Security notes
The backend binds to `127.0.0.1` only (never `0.0.0.0`) and is never exposed
externally. No API key is embedded in the executable — `ANTHROPIC_API_KEY` is
read from the environment at runtime, same as in development. The Tauri shell
capability grants sidecar execution scoped specifically to
`binaries/cuddy-backend` (`shell:allow-execute` with a `sidecar: true` scope
entry) rather than the broader `shell:default`/arbitrary-command permissions.

## Design system

Tokens live in `tailwind.config.js` and `src/index.css`:
- Deep charcoal surfaces (`ink.900`–`ink.500`), never pure black.
- Muted desaturated accents — teal (`#6EE7D6`) primary, violet (`#B7A6F0`) for
  AI.
- Gentle motion via framer-motion with a `cubic-bezier(0.22, 1, 0.36, 1)`
  ease — no bounce.
