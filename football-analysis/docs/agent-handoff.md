# Cuddy — Agent Handoff

Everything a new agent needs to pick up this project. Written 2026-09-18.

Cuddy is an AI-assisted football (soccer) match-analysis desktop app. See
[CLAUDE.md](../../CLAUDE.md) for the governing rules and conventions, and
[docs/architecture.md](architecture.md) for the pipeline. This file is the
current-state map: what was built recently, how it runs, how it's packaged, and
what's left.

---

## 1. Current state at a glance

- **Active branch:** `feat/analyst-workstation` (pushed to GitHub, fully synced).
- **PR:** https://github.com/saifestabraq-cell/cuddy/pull/9 — targets
  `feat/production-packaging` (its parent), so the diff is exactly the
  analyst-workstation work. `feat/production-packaging` in turn has PR #8 → `main`.
- **Branch stack:** `main` → `feat/production-packaging` (PR #8) →
  `feat/analyst-workstation` (PR #9, 19 commits, HEAD `522e153`).
- **Tests:** 29 backend tests pass — `cd backend && .venv/Scripts/python -m pytest tests/`.
  Frontend type-checks clean — `npx tsc --noEmit`.
- **Packaging:** the Windows installer builds and the packaged app runs with the
  new backend verified live (see §5).
- **`FEATURES.md`** is intentionally **untracked** — do not commit it (project rule).

### What this session added (analyst workstation)
The evidence → review → findings → reporting half of the product, plus timeline,
provenance, source labels, and packaging fixes. Commits, newest first:

| Commit | What |
|--------|------|
| `522e153` | Fix build-script em-dash encoding (was breaking `build:backend`) + Timeline memoization |
| `635b727` | §49 — add new modules to the PyInstaller spec (findings was missing) |
| `4ac1c6a` | §45 — cache deterministic query results (invalidation-aware) |
| `e200e89` | §26/§29 — `sequence_lookup` query intent over EventRelation |
| `1e3b5dc` | §24/§25 — shot map + pass network click → seek video |
| `5863a08` | §19 — video overlay modes (off/players/ball/both/analysis) |
| `9c6e4c6` | §18 — windowed track access endpoint |
| `71a43e6` | §35/§39/§53 — reduced-motion preference (global MotionConfig) |
| `887269a` | §56 — structured report export (findings + evidence) |
| `b56917d` | §64 — docs updated (CLAUDE.md + README) |
| `fb4b790` | §55 — Findings (observations linked to evidence) |
| `7f59f59` | §42 — export event provenance (CSV cols + XML labels) |
| `be81ee8` | Phase F — honest data-source labelling (Official / Cuddy CV / Heuristic) |
| `a78d349` | Phase D — timeline as the interaction spine (lanes, zoom, scrub) |
| `91d14b0` | Phase C/9 — Event Inspector (confidence, detector, History) |
| `d83fd46` | Phase E — AI Review Queue (keyboard flow + provenance) |
| `93d5686` | Phase H (UI) — AI panel runs the grounded /investigate engine |
| `0c052f4` | Phase H (core) — deterministic query planner + evidence engine |
| `4e3097d` | Phase B — event provenance, relations, review actions |

---

## 2. Domain model & migrations (backend)

One canonical `Event` (source `"manual"` | `"ai"`) is still the unification
point. Added this session (`backend/app/models.py`):

- **`EventRevision`** — immutable before/after trail; every edit/accept appends
  one, so an AI suggestion is never silently overwritten.
- **`EventRelation`** — typed links (`follows`, `assist_for`, `same_sequence`, …)
  powering sequence queries.
- **`Finding`** — analyst observation that *references* events (never copies).
- `Event` gained `updated_at` and `analysis_run_id`.

**Migrations** (`backend/alembic/versions/`) — head is **`0005_finding`**:
- `0004_event_provenance` — updated_at + analysis_run_id, eventrevision,
  eventrelation. Backfills `updated_at := created_at`. Verified on fresh **and**
  legacy(0003) DBs, no data loss.
- `0005_finding` — the finding table. Verified on fresh and legacy(0004) DBs.
- **Rules:** never edit 0001–0003 (or any applied migration); add new ones;
  keep them idempotent and non-destructive.

---

## 3. Evidence-first query engine (the "Show me" loop)

The spec's core promise. **The LLM is not the analytics engine.**

```
question → plan_query → StructuredQuery → resolve_query (deterministic)
        → EvidencePackage (real clips + metrics) → LLM only explains
```

- `backend/app/football.py` — shared semantics (zones/thirds/channels, phases,
  event families, team/period vocabulary). One source of truth for strings.
- `backend/app/query.py` — `plan_query` (rule-based NL → StructuredQuery, 13
  intents incl. `sequence_lookup`, no network) and `resolve_query` (answers from
  real events/analytics/shots/relations). `EventLite`/`QueryContext` decouple it
  from the ORM so it's unit-testable.
- `POST /videos/{id}/investigate` — returns `{summary, metrics, events, clips,
  warnings, query, explanation, cached}`. **Works with no AI key** (explanation
  omitted). LLM prose via `llm.explain_evidence`, grounded strictly in the
  evidence. Results cached by (video, question, data-signature); the signature
  hashes events+relations+analytics/shots mtimes so changes invalidate it.

Frontend consumes it in `AIPanel.tsx` (unified Ask / Show me). Clips are real
events; clicking one seeks the video.

---

## 4. Key endpoints added

```
# Review / provenance
POST /events/{id}/accept            # mark reviewed, record revision
POST /events/{id}/reject            # remove suggestion
GET  /events/{id}/revisions         # provenance trail
GET  /events/{id}/relations         # sequence links
POST /events/relations              # create a relation
# Query
POST /videos/{id}/investigate       # grounded evidence + clips (+ cache)
# Findings & reporting
GET/POST /videos/{id}/findings
DELETE   /findings/{id}
GET  /videos/{id}/report            # structured report payload
# Tracks
GET  /videos/{id}/tracks/window?start_ms&end_ms   # windowed loading (§18)
```

Legacy `/ask` and `/query` are intact for backward compatibility.

---

## 5. Running & building

All commands from `football-analysis/`. Full setup:
[docs/running-on-a-new-machine.md](running-on-a-new-machine.md).

### Dev
```bash
npm run dev          # Python API (:8765) + Vite (:5173) together
# On THIS machine the combined script's api leg can fail (`.venv/Scripts/python`
# not found by cmd). Workaround — run the backend directly:
cd backend && ./.venv/Scripts/python.exe -m app     # then `npm run dev:web` for Vite
```
Backend tests: `cd backend && .venv/Scripts/python -m pytest tests/`
(install once: `pip install -r requirements-dev.txt`).

### Production (Windows) — verified working this session
```bash
npm run build:windows   # backend .exe → sidecar → installer (full)
npm run build:backend   # freeze the sidecar only
```
- The freeze uses a **separate** venv `backend/.venv-cpu` (CPU torch + full CV
  stack + PyInstaller). Output: `backend/dist/cuddy-backend.exe` (~431 MB),
  copied to `src-tauri/binaries/cuddy-backend-x86_64-pc-windows-msvc.exe`.
- Installer output: `src-tauri/target/release/bundle/nsis/Cuddy_0.1.0_x64-setup.exe`.
- Packaged app exe: `src-tauri/target/release/football-analysis.exe` (launches
  the bundled sidecar on :8765 against `%LOCALAPPDATA%\Cuddy`).
- **Verified end-to-end:** froze the sidecar, ran it standalone (all new
  endpoints work, migration 0005 applies), built the installer, launched the app
  — sidecar reached readiness and served `/findings` etc. against the real DB.

### Packaging gotchas fixed this session (important)
1. `backend/cuddy-backend.spec` lists app modules in `hiddenimports` **explicitly**.
   New modules must be added there or they won't ship. Now includes
   `app.routes.findings`, `app.query`, `app.football`. Migrations ship as data
   (the whole `alembic/` dir), so new migration files need no spec change.
2. `scripts/build-windows.ps1` must stay **ASCII** — em-dash (—) characters
   crashed PowerShell 5.1's parser under a non-UTF-8 codepage, so `build:backend`
   failed before PyInstaller ran. Keep it ASCII.
3. Editing `backend/app/` alone does **not** change an installed app — you must
   rebuild the sidecar (`build:backend`) for backend changes to reach it.

---

## 6. Frontend map (what changed)

- `src/store.ts` — Zustand store. Added `findings`, `reducedMotion`,
  `overlayMode` (replaced the `overlay` boolean), and `acceptEvent`/`rejectEvent`.
- `src/lib/api.ts`, `src/lib/types.ts` — kept in sync with every new endpoint/model.
- `src/components/`:
  - `AIPanel.tsx` — grounded /investigate; `SourceBadge.tsx` (shared).
  - `ReviewQueue.tsx` — keyboard-driven AI review.
  - `EventEditPanel.tsx` — inspector w/ confidence + History (`lib/confidence.ts`).
  - `Timeline.tsx` — Manual/AI lanes, zoom, scrub, memoized.
  - `StatsDashboard.tsx` — Official vs "Cuddy Video Analysis" source labels.
  - `FindingsPanel.tsx` — create findings + Export report.
  - `AnalyzePanel.tsx` — overlay-mode selector; `VideoPlayer.tsx` honours modes.
  - `ShotMap.tsx`, `AnalyticsPanel.tsx` — click-to-seek cross-links.

---

## 7. Verification approach (and its limits)

- Backend: pytest (deterministic, no footage needed).
- Frontend: `tsc --noEmit` + driving the running dev app in a browser (DOM
  checks / clicks).
- **This dev environment has no playable video loaded**, so CV-dependent visual
  surfaces (overlay draw, interactive pitch, pass-network, heatmaps, windowed
  overlay consumption) are **code/tsc-verified, not footage-verified**. A new
  agent with a real match video should confirm these visually.
- Two recurring dev-loop quirks: (a) Vite HMR can go stale after rapid multi-file
  edits — open a **fresh browser tab** to clear it; (b) the app gates `<main>` on
  a backend health poll, so give it a few seconds after a reload.

---

## 8. What's left (deferred)

Genuinely footage-gated or larger refactors, not yet done:
- **§22 interactive pitch zone/player click → filter** — events carry no pitch
  coordinates (only shots do), so zone-filtering events isn't well supported by
  the current data model. Needs a design decision or richer event geometry.
- **§15 analysis cancel/retry** — the pipeline runs stages in a background thread
  with no cooperative cancellation. Adding it needs a cancel flag checked between
  stages; verifying it needs footage. (Start/progress/resume/failure already work.)
- **§54 workflow presets** — would overlap the existing FilterBar; needs a
  team-on-event concept to be meaningful (opposition scout, etc.).
- Full **workspace-shell refactor** (§3–4 Inspector-context model) — the current
  panel layout already delivers most of the intent; a big refactor is high-risk.
- Deeper **performance/virtualization** (§35) beyond the reduced-motion +
  memoization already done — only worth it with profiling on real matches.

---

## 9. Ground rules for the next agent

- `CLAUDE.md` requires: ask ≥3 clarifying questions before a complex task, present
  a plan first, keep outputs concise, don't assume when info is missing.
- Keep the LLM provider swappable (`backend/app/llm.py`, Groq default). Never send
  raw video to the LLM. Never present approximate CV as measured data.
- Don't introduce a second SQLite writer during a pipeline run; preserve WAL +
  busy_timeout; don't edit applied migrations.
- Lowercase, hyphenated file names.
- Verify in the running app, not just via compilation. Clean up any seeded test
  data; restore the user's DB to baseline.
