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

## Production sidecar packaging (deferred)

In development the sidecar runs from the venv (`npm run dev:api`). For a
distributable build, the Python backend is frozen into a single executable and
bundled as a Tauri **external binary**:

1. `pip install pyinstaller`
2. `pyinstaller --onefile --name fa-sidecar backend/app/__main__.py`
3. Copy the exe to `src-tauri/binaries/fa-sidecar-<target-triple>.exe`.
4. Add to `tauri.conf.json`:
   ```json
   "bundle": { "externalBin": ["binaries/fa-sidecar"] }
   ```
5. `src-tauri/src/lib.rs` already spawns `fa-sidecar` on startup in release
   builds via the shell plugin.

Until then, release builds open the window and report "Engine offline" until a
backend is reachable — the app degrades gracefully rather than crashing.

## Design system

Tokens live in `tailwind.config.js` and `src/index.css`:
- Deep charcoal surfaces (`ink.900`–`ink.500`), never pure black.
- Muted desaturated accents — teal (`#6EE7D6`) primary, violet (`#B7A6F0`) for
  AI.
- Gentle motion via framer-motion with a `cubic-bezier(0.22, 1, 0.36, 1)`
  ease — no bounce.
