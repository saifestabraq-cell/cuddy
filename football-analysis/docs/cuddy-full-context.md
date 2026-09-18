# Cuddy — full project context bundle

> Single-file dump of the entire Cuddy repository (docs + all source), generated for handing complete context to an AI model with no repo access.
> Generated: 2026-09-18T21:43:45Z · Branch: feat/analyst-workstation · Commit: 522e153
> Excludes: node_modules, .venv, build targets, binaries (models/images/fonts), and lock files (package-lock.json, Cargo.lock).

---

## File index

1. `.claude/launch.json`
2. `.gitignore`
3. `CLAUDE.md`
4. `README.md`
5. `docs/CLAUDE_HANDOFF.md`
6. `docs/index.html`
7. `football-analysis/.gitignore`
8. `football-analysis/README.md`
9. `football-analysis/backend/alembic.ini`
10. `football-analysis/backend/alembic/env.py`
11. `football-analysis/backend/alembic/versions/0001_baseline.py`
12. `football-analysis/backend/alembic/versions/0002_analysis_run.py`
13. `football-analysis/backend/alembic/versions/0003_event_detector.py`
14. `football-analysis/backend/alembic/versions/0004_event_provenance.py`
15. `football-analysis/backend/alembic/versions/0005_finding.py`
16. `football-analysis/backend/app/__init__.py`
17. `football-analysis/backend/app/__main__.py`
18. `football-analysis/backend/app/config.py`
19. `football-analysis/backend/app/cv/__init__.py`
20. `football-analysis/backend/app/cv/analytics.py`
21. `football-analysis/backend/app/cv/events.py`
22. `football-analysis/backend/app/cv/pipeline.py`
23. `football-analysis/backend/app/cv/pitch.py`
24. `football-analysis/backend/app/cv/segmentation.py`
25. `football-analysis/backend/app/cv/shots.py`
26. `football-analysis/backend/app/db.py`
27. `football-analysis/backend/app/football.py`
28. `football-analysis/backend/app/jobs.py`
29. `football-analysis/backend/app/llm.py`
30. `football-analysis/backend/app/logging_setup.py`
31. `football-analysis/backend/app/main.py`
32. `football-analysis/backend/app/migrations.py`
33. `football-analysis/backend/app/models.py`
34. `football-analysis/backend/app/pipeline.py`
35. `football-analysis/backend/app/providers/__init__.py`
36. `football-analysis/backend/app/providers/apifootball.py`
37. `football-analysis/backend/app/query.py`
38. `football-analysis/backend/app/routes/__init__.py`
39. `football-analysis/backend/app/routes/analysis.py`
40. `football-analysis/backend/app/routes/categories.py`
41. `football-analysis/backend/app/routes/descriptors.py`
42. `football-analysis/backend/app/routes/events.py`
43. `football-analysis/backend/app/routes/export.py`
44. `football-analysis/backend/app/routes/findings.py`
45. `football-analysis/backend/app/routes/projects.py`
46. `football-analysis/backend/app/routes/settings.py`
47. `football-analysis/backend/app/routes/templates.py`
48. `football-analysis/backend/app/routes/videos.py`
49. `football-analysis/backend/app/schemas.py`
50. `football-analysis/backend/app/user_settings.py`
51. `football-analysis/backend/cuddy-backend.spec`
52. `football-analysis/backend/requirements-cv.txt`
53. `football-analysis/backend/requirements-dev.txt`
54. `football-analysis/backend/requirements.txt`
55. `football-analysis/backend/sidecar_entry.py`
56. `football-analysis/backend/tests/conftest.py`
57. `football-analysis/backend/tests/test_events_provenance.py`
58. `football-analysis/backend/tests/test_export.py`
59. `football-analysis/backend/tests/test_findings.py`
60. `football-analysis/backend/tests/test_investigate_route.py`
61. `football-analysis/backend/tests/test_query.py`
62. `football-analysis/backend/tests/test_tracks_window.py`
63. `football-analysis/backend/validation/__init__.py`
64. `football-analysis/backend/validation/harness.py`
65. `football-analysis/backend/validation/run.py`
66. `football-analysis/backend/validation/service.py`
67. `football-analysis/docs/architecture.md`
68. `football-analysis/docs/running-on-a-new-machine.md`
69. `football-analysis/docs/setup.md`
70. `football-analysis/index.html`
71. `football-analysis/package.json`
72. `football-analysis/postcss.config.js`
73. `football-analysis/scripts/build-windows.ps1`
74. `football-analysis/src-tauri/Cargo.toml`
75. `football-analysis/src-tauri/build.rs`
76. `football-analysis/src-tauri/capabilities/default.json`
77. `football-analysis/src-tauri/icons/android/mipmap-anydpi-v26/ic_launcher.xml`
78. `football-analysis/src-tauri/icons/android/values/ic_launcher_background.xml`
79. `football-analysis/src-tauri/src/lib.rs`
80. `football-analysis/src-tauri/src/main.rs`
81. `football-analysis/src-tauri/tauri.conf.json`
82. `football-analysis/src/App.tsx`
83. `football-analysis/src/components/AIPanel.tsx`
84. `football-analysis/src/components/AddEventPanel.tsx`
85. `football-analysis/src/components/AnalysisTabs.tsx`
86. `football-analysis/src/components/AnalyticsPanel.tsx`
87. `football-analysis/src/components/AnalyzePanel.tsx`
88. `football-analysis/src/components/Dashboard.tsx`
89. `football-analysis/src/components/DescriptorManager.tsx`
90. `football-analysis/src/components/EventEditPanel.tsx`
91. `football-analysis/src/components/EventList.tsx`
92. `football-analysis/src/components/FilterBar.tsx`
93. `football-analysis/src/components/FindingsPanel.tsx`
94. `football-analysis/src/components/HeatmapView.tsx`
95. `football-analysis/src/components/MatchHero.tsx`
96. `football-analysis/src/components/PitchPanel.tsx`
97. `football-analysis/src/components/PlaylistBar.tsx`
98. `football-analysis/src/components/ReviewQueue.tsx`
99. `football-analysis/src/components/SectionHeader.tsx`
100. `football-analysis/src/components/SettingsPanel.tsx`
101. `football-analysis/src/components/ShotMap.tsx`
102. `football-analysis/src/components/ShotsPanel.tsx`
103. `football-analysis/src/components/Sidebar.tsx`
104. `football-analysis/src/components/SourceBadge.tsx`
105. `football-analysis/src/components/StatsDashboard.tsx`
106. `football-analysis/src/components/StudioLayer.tsx`
107. `football-analysis/src/components/StudioToolbar.tsx`
108. `football-analysis/src/components/TeamBits.tsx`
109. `football-analysis/src/components/Timeline.tsx`
110. `football-analysis/src/components/TitleBar.tsx`
111. `football-analysis/src/components/ValidationPanel.tsx`
112. `football-analysis/src/components/VideoBar.tsx`
113. `football-analysis/src/components/VideoPlayer.tsx`
114. `football-analysis/src/components/Workspace.tsx`
115. `football-analysis/src/index.css`
116. `football-analysis/src/lib/api.ts`
117. `football-analysis/src/lib/confidence.ts`
118. `football-analysis/src/lib/platform.ts`
119. `football-analysis/src/lib/time.ts`
120. `football-analysis/src/lib/tracks.ts`
121. `football-analysis/src/lib/types.ts`
122. `football-analysis/src/main.tsx`
123. `football-analysis/src/store.ts`
124. `football-analysis/src/vite-env.d.ts`
125. `football-analysis/tailwind.config.js`
126. `football-analysis/tsconfig.json`
127. `football-analysis/tsconfig.node.json`
128. `football-analysis/vite.config.ts`

Total files: 128

---


## `.claude/launch.json`

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "cuddy-web",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["--prefix", "football-analysis", "run", "dev"],
      "port": 5173
    }
  ]
}
```


## `.gitignore`

```
# OS
.DS_Store
Thumbs.db
desktop.ini

# Editors / IDEs
.vscode/
.idea/
*.swp
*~

# Environment / secrets
.env
.env.local
*.local

# Logs
*.log
logs/

# Dependencies
node_modules/
.venv/
venv/
__pycache__/
*.pyc

# Build output
dist/
build/
out/
```


## `CLAUDE.md`

```markdown
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
  stack (Ultralytics YOLO, ByteTrack, OpenCV, scikit-learn) + a swappable LLM
  (Groq by default, Anthropic optional).
- **`Event.source`** (`"manual"` | `"ai"`) is the single unification point —
  manual and AI events are the same rows through the same endpoints. Do not fork
  AI data into a separate store. Edits append an immutable **`EventRevision`**
  (before/after), so an AI suggestion is never silently overwritten; accept
  (`POST /events/{id}/accept`) / reject drive review; **`EventRelation`** links
  events into sequences. A **`Finding`** is an analyst observation that
  *references* events (never copies them).
- **Evidence-first query:** the LLM is not the analytics engine.
  `POST /videos/{id}/investigate` runs `plan_query` → `resolve_query`
  (`backend/app/query.py`, deterministic, no network) to build real
  clips/metrics from coded data, and only then asks the LLM to *explain* the
  evidence. It works fully offline (no AI key). Football terms live in
  `backend/app/football.py`.
- Heavy CV imports (`torch`, `cv2`, `ultralytics`) stay lazy inside functions so
  the API starts fast.
- AI-origin data is visually distinct in the UI (violet accent) and carries
  confidence. Every derived metric shows an honest source badge (Official /
  Cuddy CV / Approx. CV / Heuristic) via `src/components/SourceBadge.tsx`.
  Design tokens live in `tailwind.config.js`.
- Keep the LLM provider swappable behind `backend/app/llm.py`; send compact,
  anonymized (numeric-ID) context, never raw video.
- Schema changes ship as Alembic migrations (see `backend/alembic/`); head is
  `0005_finding`. Migrations must be idempotent and preserve existing rows.

## Commands

Run from `football-analysis/`:

- `npm run dev` — Python API + Vite together (browser dev at localhost:5173)
- `npm run app` — Tauri desktop app (dev; spawns nothing extra, uses the dev backend)
- `npm run app:build` — Tauri build only (expects a sidecar already in `src-tauri/binaries/`)
- `npm run build:backend` — freeze the backend to `cuddy-backend.exe` and place it as the sidecar (no Tauri build)
- `npm run build:windows` — full production build: backend .exe → sidecar → installer (`scripts/build-windows.ps1`)
- `cd backend && .venv/Scripts/python -m app` — backend only, dev venv
- `cd backend && .venv/Scripts/alembic upgrade head` — apply DB migrations

## Notes

- Backend data (SQLite, media, tracks, logs) lives under `%LOCALAPPDATA%\Cuddy`
  (override with `FA_DATA_DIR`); backend logs at
  `%LOCALAPPDATA%\Cuddy\logs\backend.log`.
- Structured query + evidence/clips (`/investigate`) work with **no** LLM key.
  A key (`GROQ_API_KEY`, or `ANTHROPIC_API_KEY` with `FA_LLM_PROVIDER=anthropic`)
  only adds a written explanation over the already-computed evidence.
- Backend tests: `cd backend && .venv/Scripts/python -m pytest tests/` (install
  dev deps once with `pip install -r requirements-dev.txt`).
- The packaged sidecar (`cuddy-backend.exe`, built from `backend/cuddy-backend.spec`)
  bundles the full CV/ML stack (CPU PyTorch) so the installed app needs no
  Python/Node/Rust. New backend code needs `npm run build:windows` (or at least
  `build:backend`) to reach the installed app — editing `backend/app/` alone
  does not affect an already-installed Cuddy.

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
```


## `README.md`

```markdown
# Cuddy

**Cuddy** is an AI-assisted football (soccer) match-analysis desktop app. It
pairs the reliability of professional video-coding software (customisable tag
buttons, a linked timeline, descriptors, XML/CSV export) with a computer-vision
and LLM layer that suggests events, maps the pitch, and answers questions in
plain English over your own footage.

The design stance is **AI-assisted, not fully automated**: every machine output
is a reviewable suggestion, rendered with visible confidence, sitting on the
same timeline you hand-correct. The tool never fetches, hosts, or redistributes
footage — it only reads files you already have on disk.

## Where the code lives

The application is in **[`football-analysis/`](football-analysis/)** — see its
[README](football-analysis/README.md) for the stack, setup, and run commands,
and [`docs/architecture.md`](football-analysis/docs/architecture.md) for how the
pipeline is built.

```
project/
├─ football-analysis/   the Cuddy app (frontend, Rust shell, Python sidecar)
├─ docs/index.html      the public landing page (served via GitHub Pages)
└─ CLAUDE.md            working rules + conventions for AI contributors
```

## Links

- **Download (Windows):** https://github.com/saifestabraq-cell/cuddy/releases/latest
- **Landing page:** https://saifestabraq-cell.github.io/cuddy/

## Roadmap

Phases 0–3 (manual coding, CV detection/tracking/teams, fixed-camera heatmaps,
possession/passing, shots/xG, natural-language query) are complete. Ongoing work
follows the implementation spec: a durable staged pipeline, a validation
harness, footage triage, an event timeline, a faster coding loop, clip-returning
interrogation, and an approximate spatial layer — each shipped incrementally.
```


## `docs/CLAUDE_HANDOFF.md`

```markdown
# Cuddy — Claude Handoff (2026-09-15)

Supersedes the earlier production-packaging handoff. This reflects the state
after a long session that (a) hardened the Windows packaging, (b) fixed several
real bugs, (c) pivoted match data from LLM guessing to **real API-Football
data**, and (d) began a **frontend redesign** ("Nocturne" direction). Trust the
actual repo over this doc, but this is the fastest way to get oriented.

---

## 1. WHAT CUDDY IS

AI-assisted football (soccer) match-analysis **desktop app**. Governing
principle in `CLAUDE.md`: AI-assisted, not fully automated; spatial CV is an
*approximate* labelled layer; the app only reads footage the user picked from
disk (never fetches/redistributes media). Note the product has drifted toward
"more automated / real data" per owner feedback — see §6.

**Stack:** Tauri 2 (Rust shell) + React 18 / TS / Vite / Tailwind / Zustand
frontend + Python 3.12 FastAPI sidecar (SQLModel/SQLite, Alembic) + CV stack
(Ultralytics YOLO, ByteTrack, OpenCV, scikit-learn, CPU PyTorch) + external
data (API-Football) + optional LLM (Anthropic).

- Repo root: `C:\Users\saiff\OneDrive\Documents\project`
- App root: `football-analysis/` (all paths below are relative to it unless noted)
- Git remote: `github.com/saifestabraq-cell/cuddy`
- **Working branch: `feat/production-packaging`** (pushed). `main` is behind — it
  only has up to the "Phase 2" merge (`53d3fc4`). All of this session's work is
  on the branch, not on `main`. No PR opened yet.

---

## 2. CURRENT STATE (as of this handoff)

- Working tree clean except **`football-analysis/FEATURES.md`** — intentionally
  **untracked, do NOT commit** (owner's standing instruction).
- Branch tip: `c296a4a`. The 12 session commits (newest first): overlay/pitch
  sharpen → Nocturne redesign → fixture browser → API-Football data → ultrareview
  fixes → DB-lock (single-session) → WAL → declutter → NameError fix → match
  score/formations+X-share → migration-adoption fix+settings/ETA → sidecar
  tree-kill → frozen-sidecar Alembic/borrow fix → WIP packaging checkpoint.
- **Latest installer built and running**:
  `src-tauri/target/release/bundle/nsis/Cuddy_0.1.0_x64-setup.exe` (~407 MB).
  The release binary at `src-tauri/target/release/football-analysis.exe` was
  launched and is healthy; both API keys are configured on this machine.

### Keys configured locally (in `%LOCALAPPDATA%\Cuddy\settings.json`)
- **API-Football (api-sports.io)** key IS set — the owner's key. Real match data
  works end-to-end.
- **Anthropic** key IS set, but the owner's API account has **no credits**, so AI
  chat/query returns a 402-style "credit balance too low". This is billing, not a
  bug. IMPORTANT distinction the owner hit: **Claude Pro ≠ Anthropic API
  credits** — the app uses the developer API, which Pro does not fund. Owner
  wants the AI chat swapped to a **free provider** (Groq/Gemini) later — NOT done.

---

## 3. BIG THINGS DONE THIS SESSION

**Packaging hardening (installed app now actually works):**
- Frozen sidecar `cuddy-backend.exe` (PyInstaller, `backend/cuddy-backend.spec`),
  CPU-only torch, bundled Alembic. Fixed: missing-alembic (migrations silently
  fell back to `create_all`), a Rust borrow error, orphaned backend on close
  (now `taskkill /F /T` the process tree — onefile spawns a child), readiness
  threshold widened to ~60s (first-launch unpack is ~15-24s), sidecar
  stdout/stderr **pipe drained** in a spawned task (else the app froze after
  minutes), and the frontend now **loads projects/settings on the first
  offline→online transition** (not only the first health check).
- `src-tauri/src/lib.rs` spawns the sidecar (release only), tracks the
  `CommandChild`, drains its events, and kills the tree on window close.

**Real bugs fixed (verified):**
- Migration adoption: made `0002`/`0003` idempotent so a legacy `create_all` DB
  (had `analysisrun`, missing `event.detector`) upgrades cleanly. The owner's
  live DB was repaired.
- **"database is locked"** during Analyse: root cause was a **second** SQLite
  connection — `_upsert_ai_events` opened its own `Session(engine)` while the
  pipeline's run session was writing progress. Fixed by threading the run's
  session through the stage functions (one writer). WAL mode + 30s busy_timeout
  added in `db.py` as complementary protection.
- `NameError` in `pipeline.run_as_dict` (datetime/timezone imported inside
  another function) — the analyze ETA path would have thrown; fixed.

**Match data pivot (LLM guess → real data):**
- `backend/app/providers/apifootball.py` — resolves a fixture from a description
  (team names + optional season) or by exact `fixture_id`; pulls lineups,
  formations, team stats, event timeline; normalizes to one bundle. Uses `httpx`
  (bundled via anthropic). Key in the settings store.
- Routes in `backend/app/routes/analysis.py`:
  `POST /videos/{id}/match-search` (candidate fixtures) and
  `GET|POST /videos/{id}/match-data` (load by `fixture_id` or free text; persisted
  as `<video_id>_matchdata.json` in the tracks dir).
- The old **LLM** match-info path still exists (`llm.match_report`,
  `/videos/{id}/match-info`, store `matchInfo`/`lookupMatchInfo`) but is **unused
  by the UI now** — dead-ish, safe to remove in a cleanup.

**Frontend features/UX:** in-app **Settings** modal (API-Football key primary,
Anthropic secondary with the Pro-vs-API note); **StatsDashboard** (real
scoreline/formations/side-by-side stat bars/Team-A-B lineup switch + fixture
browser); **Share on X**; analyze **ETA**; **Start project** button; merged AI
panel (Ask/Find-clips toggle); progressive disclosure (results panels hidden
until analysed).

**Redesign — "Nocturne" direction (from a Claude Design canvas the owner made):**
- Re-theme in `tailwind.config.js`: cooler high-contrast dark blue-grey ground,
  **blurple accent** (repurposed the `teal` token values — key name is still
  `teal` but the hexes are blurple), sharper borders, tighter radii, bolder glow.
- **Tag pad removed** → `AddEventPanel.tsx` (fields: time w/ snap-to-playhead,
  duration, category, type/label, note).
- Pitch/passing/shots consolidated into `AnalysisTabs.tsx`.
- Overlay sharpened in `VideoPlayer.tsx`: small numbered **circular** player
  markers at feet + **lit ball**; team colors blue/orange-red, ball lit-yellow.
- `HeatmapView.tsx`: green turf + mowing stripes + vignette, **red** heat bloom,
  crisper rounded markings.

---

## 4. HOW TO BUILD / RUN

From `football-analysis/`:
- Dev backend (CPU venv, real data dir):
  `FA_DATA_DIR="C:/Users/saiff/AppData/Local/Cuddy" backend/.venv-cpu/Scripts/python.exe -m app`
- Dev web: `npm run dev:web` (Vite at localhost:5173). Backend at 127.0.0.1:8765.
- Full installer: re-freeze then Tauri build (the proven manual sequence):
  1. free port 8765 / stop any running app
  2. `cd backend && .venv-cpu/Scripts/python.exe -m PyInstaller cuddy-backend.spec --noconfirm --clean`
  3. `cp backend/dist/cuddy-backend.exe src-tauri/binaries/cuddy-backend-x86_64-pc-windows-msvc.exe`
  4. `npm run app:build`
  Installer lands in `src-tauri/target/release/bundle/nsis/`. Backend changes
  need step 2; frontend-only changes need only step 4. (`npm run build:windows`
  wraps all of this but is slower; the manual path is proven.)
- The CPU venv `backend/.venv-cpu` has everything (torch CPU, cv2, ultralytics,
  alembic, anthropic, httpx, pyinstaller). If rebuilding it, see the earlier
  handoff / `scripts/build-windows.ps1` for the exact install list.

**Tauri gotcha:** `cargo check` / build needs
`src-tauri/binaries/cuddy-backend-x86_64-pc-windows-msvc.exe` to exist (gitignored).
Freeze + copy first.

---

## 5. VERIFICATION STATUS (honest)

- tsc, `npm run build`, `cargo check`, pyflakes: all clean at last check.
- Real API-Football path: verified live (search returned 25 Arsenal–Chelsea
  fixtures; loading one by id returned full score/formations/XI/stats).
- Migration fix, WAL, single-session DB fix: verified (repro test: 50 events
  upserted under concurrent reads, 0 lock errors).
- Sidecar spawn/kill/health/pipe-drain: verified on the packaged run.
- **Overlay + pitch redesign: verified by build/tsc only** — they need live
  tracks (a full CPU analysis) and a **calibrated** pitch to actually render, so
  they have NOT been eyeballed. First thing to check if they look wrong.
- **Clean-machine install** of the installer: never tested (no spare VM).

---

## 6. OWNER FEEDBACK + WHAT'S LEFT (priority order)

The owner rated the pre-redesign app 2/10 and wants it to feel automated,
data-rich, sharp — not a manual-coding tool. Direction chosen: API-Football
data, fields not tags, stats dashboard centerpiece, non-"depressing" look.

**Still not done (from the design / feedback):**
1. **Three-way Both / Home / Away stat switch** on StatsDashboard (currently a
   side-by-side "Both" table + a separate lineup A/B switch).
2. **Timeline-click → auto-fill the Add-event form** (the design showed this).
3. **AI chat on a free provider** (Groq/Gemini) instead of the paid Anthropic
   API — keep `llm.py` provider-swappable. Owner explicitly asked for this.
4. **Remove dead LLM match-info path** (see §3) to reduce clutter.
5. Deeper visual polish / density / "laggy" (heavy framer-motion) if the owner
   still isn't happy with the Nocturne pass.
6. The owner is also redesigning in an external **Claude Design** tool
   (`claude.ai/design/p/921fab7d-...`, file `Workspace.dc.html`). Its `.dc.html`
   is sandboxed/behind their login (couldn't be pulled); the Nocturne
   implementation was built from the canvas's written notes, not a pixel copy.
   If they hand over exact tokens/screens, tighten to match.

**Analyse is slow** on the installed app by design (CPU-only YOLO). Owner
accepted this ("stay with slow"). Don't "fix" it by adding a GPU build (blows the
2 GB installer limit); at most add clip/time-range scoping + a better ETA later.

---

## 7. FILES A NEW AGENT SHOULD OPEN FIRST

1. This file, then `git status` / `git log --oneline -15`.
2. `CLAUDE.md` (root) — conventions + the owner's rules (asks 3 clarifying Qs
   before complex tasks, present a plan, etc.).
3. `football-analysis/src/components/Workspace.tsx` — the one screen; composes
   everything.
4. `football-analysis/src/components/StatsDashboard.tsx` — the centerpiece +
   fixture browser.
5. `football-analysis/backend/app/providers/apifootball.py` — the data layer.
6. `football-analysis/backend/app/pipeline.py` + `db.py` — the DB-lock fix
   (single session + WAL); don't reintroduce a second connection in a stage.
7. `football-analysis/tailwind.config.js` — the Nocturne tokens (blurple lives
   under the `teal` key).
8. `football-analysis/src-tauri/src/lib.rs` — sidecar lifecycle.

**Do NOT:** commit `FEATURES.md`; edit applied migrations `0001/0002/0003`
(only add new ones); open a second SQLite connection inside the pipeline;
assume `main` has this work (it's on the branch).
```


## `docs/index.html`

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cuddy</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800;900&family=Hanken+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap">
<style>
  :root {
    color-scheme: dark;
    --ground: #0B0C10;
    --panel: #14161C;
    --raised: #1B1E27;
    --hairline: rgba(255,255,255,.08);
    --hairline-strong: rgba(255,255,255,.14);
    --text: #EAECF2;
    --muted: #868D9E;
    --faint: #5A6070;
    --teal: #6EE7D6;
    --teal-deep: #2BA593;
    --violet: #B7A6F0;
    --pink: #F0A6C0;
    --pitch: #0F2A20;
    --pitch-line: rgba(150,220,200,.28);
    --display: "Archivo", "Arial Narrow", system-ui, sans-serif;
    --body: "Hanken Grotesk", system-ui, -apple-system, sans-serif;
    --mono: "JetBrains Mono", ui-monospace, "SF Mono", monospace;
  }

  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    background: var(--ground);
    color: var(--text);
    font-family: var(--body);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
  /* ambient field: two low blooms of the two accents, painted on the ground */
  body::before {
    content: "";
    position: fixed;
    inset: 0;
    background:
      radial-gradient(60% 50% at 82% 8%, rgba(110,231,214,.10), transparent 70%),
      radial-gradient(50% 45% at 8% 92%, rgba(183,166,240,.09), transparent 70%);
    pointer-events: none;
    z-index: 0;
  }
  .wrap { position: relative; z-index: 1; max-width: 1120px; margin: 0 auto; padding: 0 28px; }

  a { color: inherit; }
  ::selection { background: rgba(110,231,214,.28); }

  /* ---- nav ---- */
  header.nav {
    position: sticky; top: 0; z-index: 20;
    backdrop-filter: blur(10px);
    background: rgba(11,12,16,.72);
    border-bottom: 1px solid var(--hairline);
  }
  .nav-inner { display: flex; align-items: center; justify-content: space-between; height: 60px; }
  .brand { display: flex; align-items: center; gap: 11px; font-family: var(--display); font-weight: 800; letter-spacing: -.01em; font-size: 19px; }
  .glyph {
    width: 26px; height: 26px; border-radius: 8px;
    background: linear-gradient(135deg, var(--teal), var(--violet));
    box-shadow: 0 0 0 1px rgba(255,255,255,.08), 0 6px 18px rgba(110,231,214,.18);
  }
  .brand small { font-family: var(--mono); font-weight: 400; font-size: 11px; color: var(--muted); letter-spacing: .04em; text-transform: lowercase; }
  .nav-links { display: flex; align-items: center; gap: 26px; font-size: 14px; color: var(--muted); }
  .nav-links a { text-decoration: none; transition: color .2s ease; }
  .nav-links a:hover { color: var(--text); }
  .nav-cta {
    font-family: var(--body); font-weight: 600; font-size: 13.5px;
    color: var(--ground); background: var(--teal);
    padding: 8px 15px; border-radius: 10px; text-decoration: none;
    transition: transform .18s ease, box-shadow .2s ease;
  }
  .nav-cta:hover { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(110,231,214,.24); }
  @media (max-width: 720px){ .nav-links a:not(.nav-cta){ display:none; } }

  /* ---- hero ---- */
  .hero { display: grid; grid-template-columns: 1.05fr .95fr; gap: 48px; align-items: center; padding: 74px 0 64px; }
  @media (max-width: 900px){ .hero { grid-template-columns: 1fr; gap: 36px; padding: 48px 0 40px; } }

  .eyebrow {
    display: inline-flex; align-items: center; gap: 9px;
    font-family: var(--mono); font-size: 12px; letter-spacing: .06em; text-transform: uppercase;
    color: var(--teal); border: 1px solid var(--hairline-strong);
    padding: 6px 12px; border-radius: 999px; margin-bottom: 22px;
  }
  .eyebrow .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--teal); box-shadow: 0 0 10px var(--teal); animation: pulse 2.4s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{ opacity: 1; } 50%{ opacity: .35; } }

  h1 {
    font-family: var(--display); font-weight: 900; font-size: clamp(40px, 6vw, 68px);
    line-height: .98; letter-spacing: -.025em; margin: 0 0 20px; text-wrap: balance;
  }
  h1 .grad { background: linear-gradient(100deg, var(--teal), var(--violet)); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .lede { font-size: clamp(16px, 1.6vw, 19px); color: var(--muted); max-width: 46ch; margin: 0 0 30px; }
  .lede b { color: var(--text); font-weight: 600; }

  .cta-row { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
  .btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: var(--body); font-weight: 600; font-size: 15px;
    color: var(--ground); background: var(--teal);
    padding: 13px 22px; border-radius: 12px; text-decoration: none;
    transition: transform .18s ease, box-shadow .2s ease;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(110,231,214,.28); }
  .btn-ghost {
    display: inline-flex; align-items: center; gap: 9px;
    font-weight: 500; font-size: 15px; color: var(--text); text-decoration: none;
    padding: 13px 18px; border-radius: 12px; border: 1px solid var(--hairline-strong);
    transition: border-color .2s ease, background .2s ease;
  }
  .btn-ghost:hover { border-color: var(--teal); background: rgba(110,231,214,.06); }
  .os-note { font-family: var(--mono); font-size: 12px; color: var(--faint); margin-top: 16px; }

  /* ---- hero pitch card ---- */
  .stage {
    position: relative; border: 1px solid var(--hairline); border-radius: 18px;
    background: linear-gradient(180deg, var(--panel), #101219);
    padding: 14px; box-shadow: 0 30px 60px rgba(0,0,0,.4);
  }
  .stage-bar { display: flex; align-items: center; gap: 7px; padding: 4px 6px 12px; }
  .stage-bar i { width: 10px; height: 10px; border-radius: 50%; background: var(--raised); display: inline-block; }
  .stage-bar span { margin-left: 8px; font-family: var(--mono); font-size: 11px; color: var(--faint); }
  .pitch-svg { width: 100%; height: auto; display: block; border-radius: 10px; }
  .stage-tags { display: flex; gap: 8px; flex-wrap: wrap; padding: 12px 4px 4px; }
  .tag { font-family: var(--mono); font-size: 11px; padding: 4px 9px; border-radius: 7px; border: 1px solid var(--hairline); color: var(--muted); }
  .tag.t { color: var(--teal); border-color: rgba(110,231,214,.3); }
  .tag.v { color: var(--violet); border-color: rgba(183,166,240,.3); }

  /* ---- section scaffolding ---- */
  section { padding: 64px 0; }
  .sec-head { max-width: 62ch; margin-bottom: 40px; }
  .kicker { font-family: var(--mono); font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--teal-deep); }
  h2 { font-family: var(--display); font-weight: 800; font-size: clamp(26px, 3.4vw, 38px); letter-spacing: -.02em; line-height: 1.05; margin: 12px 0 14px; text-wrap: balance; }
  .sec-head p { color: var(--muted); font-size: 16px; margin: 0; }

  /* ---- feature grid ---- */
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  @media (max-width: 860px){ .grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 560px){ .grid { grid-template-columns: 1fr; } }
  .feat {
    border: 1px solid var(--hairline); border-radius: 14px; background: var(--panel);
    padding: 22px 20px; display: flex; flex-direction: column; gap: 10px;
    transition: border-color .2s ease, transform .2s ease;
  }
  .feat:hover { border-color: var(--hairline-strong); transform: translateY(-3px); }
  .feat .ico { width: 34px; height: 34px; border-radius: 9px; display: grid; place-items: center; background: rgba(110,231,214,.08); border: 1px solid rgba(110,231,214,.2); }
  .feat.ai .ico { background: rgba(183,166,240,.08); border-color: rgba(183,166,240,.22); }
  .feat h3 { font-family: var(--display); font-weight: 700; font-size: 17px; margin: 2px 0 0; letter-spacing: -.01em; }
  .feat p { color: var(--muted); font-size: 14px; margin: 0; }
  .feat .meta { margin-top: auto; font-family: var(--mono); font-size: 11px; color: var(--faint); padding-top: 8px; }
  .feat.ai .meta { color: var(--violet); opacity: .8; }

  /* ---- pipeline ---- */
  .pipe { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
  @media (max-width: 820px){ .pipe { grid-template-columns: 1fr 1fr; } }
  .step { border: 1px solid var(--hairline); border-radius: 12px; padding: 18px 16px; background: linear-gradient(180deg, var(--panel), #0f1117); }
  .step .n { font-family: var(--mono); font-size: 12px; color: var(--teal); }
  .step h4 { font-family: var(--display); font-weight: 700; font-size: 15px; margin: 10px 0 6px; }
  .step p { color: var(--muted); font-size: 13px; margin: 0; }

  /* ---- stat band ---- */
  .band { border: 1px solid var(--hairline); border-radius: 16px; background: var(--panel); padding: 30px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
  @media (max-width: 700px){ .band { grid-template-columns: 1fr 1fr; gap: 24px; } }
  .stat .v { font-family: var(--display); font-weight: 800; font-size: 34px; letter-spacing: -.02em; line-height: 1; }
  .stat .v.teal { color: var(--teal); } .stat .v.violet { color: var(--violet); }
  .stat .l { font-family: var(--mono); font-size: 11.5px; color: var(--muted); text-transform: uppercase; letter-spacing: .05em; margin-top: 9px; }

  /* ---- download ---- */
  .download { text-align: center; border: 1px solid var(--hairline-strong); border-radius: 20px; padding: 52px 30px; background: radial-gradient(120% 140% at 50% 0%, rgba(110,231,214,.08), transparent 60%), var(--panel); }
  .download h2 { margin-top: 0; }
  .download .lede { margin: 0 auto 26px; }
  .download .cta-row { justify-content: center; }
  .note { max-width: 60ch; margin: 24px auto 0; font-size: 13px; color: var(--faint); border-top: 1px solid var(--hairline); padding-top: 18px; }
  .note code { font-family: var(--mono); color: var(--teal); font-size: 12px; }

  /* ---- footer ---- */
  footer { border-top: 1px solid var(--hairline); padding: 34px 0 48px; }
  .foot { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; color: var(--faint); font-size: 13px; }
  .foot .mono { font-family: var(--mono); font-size: 12px; }

  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; scroll-behavior: auto; }
  }
</style>

<header class="nav">
  <div class="wrap nav-inner">
    <div class="brand"><span class="glyph"></span> Cuddy <small>football analysis</small></div>
    <nav class="nav-links">
      <a href="#features">Features</a>
      <a href="#pipeline">How it works</a>
      <a href="#download" class="nav-cta">Download</a>
    </nav>
  </div>
</header>

<main>
  <div class="wrap">
    <section class="hero">
      <div>
        <span class="eyebrow"><span class="dot"></span> Desktop app · Windows · GPU-accelerated</span>
        <h1>See the match<br>in <span class="grad">data.</span></h1>
        <p class="lede">Cuddy turns match footage into analysis. Tag events by hand with the reliability of pro video-coding software — then let the AI <b>track players, split the teams, map heatmaps, estimate xG</b>, and answer questions in plain English.</p>
        <div class="cta-row">
          <a href="#download" class="btn-primary">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1v9m0 0 3.2-3.2M8 10 4.8 6.8M2 11.5v1A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5v-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Download for Windows
          </a>
          <a href="#features" class="btn-ghost">Explore the features</a>
        </div>
        <p class="os-note">v0.1.0 · Windows 10/11 · installs in seconds</p>
      </div>

      <div class="stage" aria-label="Cuddy tactical analysis view">
        <div class="stage-bar"><i></i><i></i><i></i><span>match · second half · 61:04</span></div>
        <svg class="pitch-svg" viewBox="0 0 560 360" role="img" aria-label="Top-down pitch showing a team heatmap, shot markers sized by expected goals, and player tracking boxes">
          <defs>
            <radialGradient id="heat" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="rgba(110,231,214,.55)"/>
              <stop offset="55%" stop-color="rgba(110,231,214,.18)"/>
              <stop offset="100%" stop-color="rgba(110,231,214,0)"/>
            </radialGradient>
            <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#123326"/>
              <stop offset="100%" stop-color="#0d2419"/>
            </linearGradient>
          </defs>
          <!-- pitch -->
          <rect x="8" y="8" width="544" height="344" rx="10" fill="url(#grass)" stroke="var(--pitch-line)"/>
          <line x1="280" y1="8" x2="280" y2="352" stroke="var(--pitch-line)"/>
          <circle cx="280" cy="180" r="46" fill="none" stroke="var(--pitch-line)"/>
          <circle cx="280" cy="180" r="3" fill="var(--pitch-line)"/>
          <rect x="8" y="96" width="78" height="168" fill="none" stroke="var(--pitch-line)"/>
          <rect x="474" y="96" width="78" height="168" fill="none" stroke="var(--pitch-line)"/>
          <rect x="8" y="140" width="30" height="80" fill="none" stroke="var(--pitch-line)"/>
          <rect x="522" y="140" width="30" height="80" fill="none" stroke="var(--pitch-line)"/>
          <!-- heatmap blooms (attacking right) -->
          <ellipse cx="410" cy="150" rx="120" ry="95" fill="url(#heat)"/>
          <ellipse cx="360" cy="235" rx="80" ry="60" fill="url(#heat)" opacity=".7"/>
          <!-- pass lines -->
          <g stroke="rgba(234,236,242,.22)" stroke-dasharray="3 4">
            <line x1="150" y1="210" x2="300" y2="150"/>
            <line x1="300" y1="150" x2="430" y2="120"/>
            <line x1="430" y1="120" x2="470" y2="185"/>
          </g>
          <!-- shot markers sized by xG (violet) -->
          <g>
            <circle cx="470" cy="185" r="22" fill="rgba(183,166,240,.28)" stroke="var(--violet)"/>
            <circle cx="440" cy="150" r="13" fill="rgba(183,166,240,.22)" stroke="var(--violet)"/>
            <circle cx="420" cy="230" r="9" fill="rgba(183,166,240,.2)" stroke="var(--violet)"/>
            <text x="470" y="150" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--violet)" text-anchor="middle">xG 0.31</text>
          </g>
          <!-- tracking boxes -->
          <g font-family="JetBrains Mono, monospace" font-size="9">
            <rect x="300" y="140" width="16" height="34" fill="none" stroke="var(--teal)" stroke-width="1.5"/>
            <rect x="300" y="130" width="14" height="10" fill="var(--teal)"/><text x="303" y="138" fill="#0B0C10">9</text>
            <rect x="150" y="196" width="16" height="34" fill="none" stroke="var(--teal)" stroke-width="1.5"/>
            <rect x="150" y="186" width="14" height="10" fill="var(--teal)"/><text x="153" y="194" fill="#0B0C10">4</text>
            <rect x="352" y="215" width="16" height="34" fill="none" stroke="var(--pink)" stroke-width="1.5"/>
            <rect x="352" y="205" width="14" height="10" fill="var(--pink)"/><text x="355" y="213" fill="#0B0C10">6</text>
          </g>
          <!-- ball -->
          <circle cx="430" cy="120" r="4.5" fill="#F2C879" stroke="#0B0C10"/>
        </svg>
        <div class="stage-tags">
          <span class="tag t">Team A · possession 61%</span>
          <span class="tag v">3 shots · xG 0.74</span>
          <span class="tag">final third · left</span>
        </div>
      </div>
    </section>
  </div>

  <div class="wrap">
    <section id="features">
      <div class="sec-head">
        <span class="kicker">What it does</span>
        <h2>Manual precision, meet machine speed.</h2>
        <p>Every AI-detected moment lands on the same timeline you hand-correct — automation you can trust because you can edit it.</p>
      </div>
      <div class="grid">
        <article class="feat">
          <span class="ico"><svg width="17" height="17" viewBox="0 0 17 17" fill="none"><rect x="2" y="3" width="13" height="11" rx="2" stroke="#6EE7D6" stroke-width="1.4"/><path d="M2 11h13" stroke="#6EE7D6" stroke-width="1.4"/><circle cx="5" cy="12.5" r="1" fill="#6EE7D6"/></svg></span>
          <h3>Video coding</h3>
          <p>Customisable tag buttons with hotkeys, a linked timeline, descriptors, filters and highlight playlists.</p>
          <span class="meta">SportsCode XML · CSV export</span>
        </article>
        <article class="feat ai">
          <span class="ico"><svg width="17" height="17" viewBox="0 0 17 17" fill="none"><circle cx="5.5" cy="6" r="2.2" stroke="#B7A6F0" stroke-width="1.4"/><circle cx="11.5" cy="10" r="2.2" stroke="#B7A6F0" stroke-width="1.4"/><path d="M7.4 7.2 9.6 8.8" stroke="#B7A6F0" stroke-width="1.4"/></svg></span>
          <h3>Detection &amp; tracking</h3>
          <p>YOLO + ByteTrack follow every player and the ball, with a live overlay drawn over your video.</p>
          <span class="meta">runs on your GPU</span>
        </article>
        <article class="feat ai">
          <span class="ico"><svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M3 12c2-5 3-6 5.5-6S13 7 15 5" stroke="#B7A6F0" stroke-width="1.4" stroke-linecap="round"/><circle cx="8.5" cy="6" r="1.4" fill="#B7A6F0"/></svg></span>
          <h3>Team &amp; kit ID</h3>
          <p>Unsupervised colour clustering splits players into Team A and Team B — no training, no labels.</p>
          <span class="meta">k-means on jersey colour</span>
        </article>
        <article class="feat">
          <span class="ico"><svg width="17" height="17" viewBox="0 0 17 17" fill="none"><rect x="2.5" y="2.5" width="12" height="12" rx="2" stroke="#6EE7D6" stroke-width="1.4"/><circle cx="10" cy="6" r="2.6" fill="rgba(110,231,214,.4)"/><circle cx="6" cy="10" r="1.7" fill="rgba(110,231,214,.28)"/></svg></span>
          <h3>Pitch heatmaps</h3>
          <p>Click four corners to calibrate; Cuddy maps positions onto a 105 × 68 m pitch for per-team heatmaps and distance.</p>
          <span class="meta">homography · metres covered</span>
        </article>
        <article class="feat ai">
          <span class="ico"><svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M2 14V3M2 14h13" stroke="#B7A6F0" stroke-width="1.4" stroke-linecap="round"/><circle cx="6" cy="9" r="1.8" stroke="#B7A6F0" stroke-width="1.3"/><circle cx="11" cy="6" r="2.6" stroke="#B7A6F0" stroke-width="1.3"/></svg></span>
          <h3>Shots &amp; xG</h3>
          <p>Fast balls toward goal become shots, scored by a transparent distance-and-angle xG model on a shot map.</p>
          <span class="meta">possession · passing · turnovers</span>
        </article>
        <article class="feat ai">
          <span class="ico"><svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M3 4h11v7H8l-3 2.5V11H3z" stroke="#B7A6F0" stroke-width="1.4" stroke-linejoin="round"/></svg></span>
          <h3>Ask in plain English</h3>
          <p>“Which team created more xG?” Cuddy answers from the match data, grounded in your events and stats.</p>
          <span class="meta">powered by Claude</span>
        </article>
      </div>
    </section>
  </div>

  <div class="wrap">
    <section id="pipeline">
      <div class="sec-head">
        <span class="kicker">The workflow</span>
        <h2>From clip to insight in five steps.</h2>
        <p>Each stage writes into a shared model, so manual tags and AI output live side by side.</p>
      </div>
      <div class="pipe">
        <div class="step"><div class="n">01</div><h4>Import</h4><p>Drop in your clip or a public dataset match.</p></div>
        <div class="step"><div class="n">02</div><h4>Analyse</h4><p>Detect &amp; track players and the ball on the GPU.</p></div>
        <div class="step"><div class="n">03</div><h4>Calibrate</h4><p>Click the four pitch corners once for real coordinates.</p></div>
        <div class="step"><div class="n">04</div><h4>Read</h4><p>Heatmaps, distances, xG, possession and passing.</p></div>
        <div class="step"><div class="n">05</div><h4>Ask</h4><p>Query the match in plain language, review, export.</p></div>
      </div>
    </section>
  </div>

  <div class="wrap">
    <section>
      <div class="band">
        <div class="stat"><div class="v teal">2 pillars</div><div class="l">manual + AI, one timeline</div></div>
        <div class="stat"><div class="v">105×68</div><div class="l">metres · true pitch space</div></div>
        <div class="stat"><div class="v violet">xG</div><div class="l">distance · angle model</div></div>
        <div class="stat"><div class="v teal">100%</div><div class="l">local · your footage stays yours</div></div>
      </div>
    </section>
  </div>

  <div class="wrap">
    <section id="download">
      <div class="download">
        <span class="kicker">Get Cuddy</span>
        <h2>Download the desktop app.</h2>
        <p class="lede">A single Windows installer. Tag a match in minutes; layer the AI on when you want it.</p>
        <div class="cta-row">
          <a href="https://github.com/saifestabraq-cell/cuddy/releases/download/v0.1.0/Cuddy_0.1.0_x64-setup.exe" class="btn-primary" data-download>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1v9m0 0 3.2-3.2M8 10 4.8 6.8M2 11.5v1A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5v-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Download for Windows
          </a>
          <a href="https://github.com/saifestabraq-cell/cuddy" class="btn-ghost">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 .2a8 8 0 0 0-2.5 15.6c.4.1.5-.2.5-.4v-1.4c-2 .5-2.5-.9-2.5-.9-.3-.9-.8-1.1-.8-1.1-.7-.4 0-.4 0-.4.7 0 1.1.8 1.1.8.6 1.1 1.7.8 2.1.6 0-.5.2-.8.4-1-1.6-.2-3.3-.8-3.3-3.6 0-.8.3-1.5.8-2 0-.2-.4-1 .1-2 0 0 .6-.2 2 .8a7 7 0 0 1 3.6 0c1.4-1 2-.8 2-.8.5 1 .1 1.8.1 2 .5.5.8 1.2.8 2 0 2.8-1.7 3.4-3.3 3.6.3.2.5.7.5 1.4v2c0 .2.1.5.5.4A8 8 0 0 0 8 .2Z"/></svg>
            View source
          </a>
        </div>
        <p class="note">
          Windows 10/11 · ~22&nbsp;MB. The lean installer runs manual coding, the timeline, export and the Ask feature out of the box; the CV features (detection, heatmaps, xG) use your local Python&nbsp;+&nbsp;GPU environment. Natural-language queries need an <code>ANTHROPIC_API_KEY</code> set in the backend.
        </p>
      </div>
    </section>
  </div>
</main>

<footer>
  <div class="wrap foot">
    <div class="brand" style="font-size:16px;"><span class="glyph" style="width:22px;height:22px;"></span> Cuddy</div>
    <span class="mono">Tauri · React · FastAPI · YOLO · Claude</span>
    <span>Built for match analysts and the curious.</span>
  </div>
</footer>
</body>
</html>
```


## `football-analysis/.gitignore`

```
# Node
node_modules/
dist/
*.log

# Vite
.vite/

# Python
backend/.venv/
backend/.venv-cpu/
__pycache__/
*.pyc
.env

# Rust / Tauri
src-tauri/target/
src-tauri/gen/
src-tauri/binaries/

# PyInstaller (packaged backend build artifacts — cuddy-backend.spec itself
# is tracked source, so exclude only the build output, not the .spec file)
backend/build/
backend/dist/

# ML model weights (downloaded on demand, not source)
*.pt
*.onnx
*.engine

# App data / media (never commit clips)
data/
*.mp4
*.mov
*.mkv
*.avi
*.m4v
*.webm

# OS
.DS_Store
Thumbs.db
```


## `football-analysis/README.md`

```markdown
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
- **Phase 3b complete** — shot detection + a simple distance/angle xG estimate:
  shot map (markers sized by xG) and per-team xG/shot totals.
- **Phase 3c complete** — natural-language query over the match data via the
  Claude API. Set `ANTHROPIC_API_KEY` in the backend environment to enable it
  (optional `FA_LLM_MODEL`, default `claude-opus-5`).

Cuddy now spans Phases 0 → 3 — a full manual-coding tool plus AI
detection/tracking/teams, positional heatmaps, possession/passing/shot
analytics, and natural-language querying. See
[docs/architecture.md](docs/architecture.md).

- **Analyst workstation (in progress)** — event provenance (`EventRevision`,
  `EventRelation`), an AI **review queue** (accept/reject with keyboard flow),
  an evidence-grounded query engine (`/investigate`: deterministic clips +
  metrics, LLM only explains — works with no AI key), a layered **timeline**
  (manual vs AI lanes, zoom, scrub), honest per-metric **source labels**,
  event-provenance in XML/CSV export, and **Findings** (observations linked to
  evidence). DB head: migration `0005_finding`.

> The CV stack is a separate install — see [docs/setup.md](docs/setup.md#cv--ml-dependencies-phase-2).
```


## `football-analysis/backend/alembic.ini`

```ini
# Alembic config. The database URL is set at runtime in alembic/env.py from
# app config (settings.db_path), so it is intentionally left blank here.
[alembic]
script_location = %(here)s/alembic
prepend_sys_path = .
version_path_separator = os
sqlalchemy.url =

[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARNING
handlers = console
qualname =

[logger_sqlalchemy]
level = WARNING
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
```


## `football-analysis/backend/alembic/env.py`

```python
"""Alembic environment.

The database URL comes from the app's runtime config (``settings.db_path``) so
migrations always target the same per-user SQLite DB the app uses. Target
metadata is SQLModel's registry, populated by importing the models.
"""

from __future__ import annotations

from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool
from sqlmodel import SQLModel

from app.config import settings
from app import models  # noqa: F401  (registers table metadata)

config = context.config
config.set_main_option("sqlalchemy.url", f"sqlite:///{settings.db_path}")

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = SQLModel.metadata


def run_migrations_offline() -> None:
    context.configure(
        url=config.get_main_option("sqlalchemy.url"),
        target_metadata=target_metadata,
        literal_binds=True,
        render_as_batch=True,  # SQLite needs batch mode for ALTERs
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            render_as_batch=True,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
```


## `football-analysis/backend/alembic/versions/0001_baseline.py`

```python
"""Baseline schema (Phases 0-3): project, video, descriptor groups/descriptors,
category, event.

Revision ID: 0001_baseline
Revises:
Create Date: 2026-09-13
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0001_baseline"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "project",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("description", sa.String, nullable=False),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )
    op.create_table(
        "video",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("project_id", sa.Integer, sa.ForeignKey("project.id"), nullable=False),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("path", sa.String, nullable=False),
        sa.Column("duration_ms", sa.Integer, nullable=True),
        sa.Column("fps", sa.Float, nullable=True),
        sa.Column("width", sa.Integer, nullable=True),
        sa.Column("height", sa.Integer, nullable=True),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )
    op.create_index("ix_video_project_id", "video", ["project_id"])

    op.create_table(
        "descriptorgroup",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("project_id", sa.Integer, sa.ForeignKey("project.id"), nullable=False),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("sort_order", sa.Integer, nullable=False),
    )
    op.create_index("ix_descriptorgroup_project_id", "descriptorgroup", ["project_id"])

    op.create_table(
        "descriptor",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("group_id", sa.Integer, sa.ForeignKey("descriptorgroup.id"), nullable=False),
        sa.Column("label", sa.String, nullable=False),
        sa.Column("color", sa.String, nullable=True),
        sa.Column("sort_order", sa.Integer, nullable=False),
    )
    op.create_index("ix_descriptor_group_id", "descriptor", ["group_id"])

    op.create_table(
        "category",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("project_id", sa.Integer, sa.ForeignKey("project.id"), nullable=False),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("color", sa.String, nullable=False),
        sa.Column("hotkey", sa.String, nullable=True),
        sa.Column("lead_ms", sa.Integer, nullable=False),
        sa.Column("lag_ms", sa.Integer, nullable=False),
        sa.Column("sort_order", sa.Integer, nullable=False),
    )
    op.create_index("ix_category_project_id", "category", ["project_id"])

    op.create_table(
        "event",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("video_id", sa.Integer, sa.ForeignKey("video.id"), nullable=False),
        sa.Column("category_id", sa.Integer, sa.ForeignKey("category.id"), nullable=True),
        sa.Column("label", sa.String, nullable=False),
        sa.Column("start_ms", sa.Integer, nullable=False),
        sa.Column("end_ms", sa.Integer, nullable=False),
        sa.Column("notes", sa.String, nullable=False),
        sa.Column("descriptors", sa.JSON, nullable=True),
        sa.Column("source", sa.String, nullable=False),
        sa.Column("confidence", sa.Float, nullable=True),
        sa.Column("reviewed", sa.Boolean, nullable=False),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )
    op.create_index("ix_event_video_id", "event", ["video_id"])
    op.create_index("ix_event_category_id", "event", ["category_id"])


def downgrade() -> None:
    op.drop_table("event")
    op.drop_table("category")
    op.drop_table("descriptor")
    op.drop_table("descriptorgroup")
    op.drop_table("video")
    op.drop_table("project")
```


## `football-analysis/backend/alembic/versions/0002_analysis_run.py`

```python
"""Durable analysis-run state (staged, resumable pipeline).

Revision ID: 0002_analysis_run
Revises: 0001_baseline
Create Date: 2026-09-13
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0002_analysis_run"
down_revision = "0001_baseline"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Idempotent: a database created by the pre-Alembic create_all fallback may
    # already have this table. Adopting such a DB stamps it at 0001_baseline and
    # then upgrades, so this migration must no-op on an existing table rather
    # than fail with "table already exists".
    insp = sa.inspect(op.get_bind())
    if "analysisrun" not in insp.get_table_names():
        op.create_table(
            "analysisrun",
            sa.Column("id", sa.Integer, primary_key=True),
            sa.Column("video_id", sa.Integer, sa.ForeignKey("video.id"), nullable=False),
            sa.Column("kind", sa.String, nullable=False),
            sa.Column("status", sa.String, nullable=False),
            sa.Column("stage", sa.String, nullable=False),
            sa.Column("completed_stages", sa.JSON, nullable=True),
            sa.Column("progress", sa.Float, nullable=False),
            sa.Column("message", sa.String, nullable=False),
            sa.Column("error", sa.String, nullable=True),
            sa.Column("created_at", sa.DateTime, nullable=False),
            sa.Column("updated_at", sa.DateTime, nullable=False),
        )
    existing_indexes = {ix["name"] for ix in insp.get_indexes("analysisrun")}
    if "ix_analysisrun_video_id" not in existing_indexes:
        op.create_index("ix_analysisrun_video_id", "analysisrun", ["video_id"])


def downgrade() -> None:
    op.drop_table("analysisrun")
```


## `football-analysis/backend/alembic/versions/0003_event_detector.py`

```python
"""Add event.detector (auto-detector subtype for Phase 3 candidate events).

Revision ID: 0003_event_detector
Revises: 0002_analysis_run
Create Date: 2026-09-13
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0003_event_detector"
down_revision = "0002_analysis_run"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Idempotent: skip if the column is already present (e.g. a DB created by the
    # old create_all whose Event model already had this field).
    insp = sa.inspect(op.get_bind())
    columns = {c["name"] for c in insp.get_columns("event")}
    if "detector" not in columns:
        with op.batch_alter_table("event") as batch:
            batch.add_column(sa.Column("detector", sa.String, nullable=True))


def downgrade() -> None:
    with op.batch_alter_table("event") as batch:
        batch.drop_column("detector")
```


## `football-analysis/backend/alembic/versions/0004_event_provenance.py`

```python
"""Add event provenance: updated_at + analysis_run_id, revisions, relations.

Revision ID: 0004_event_provenance
Revises: 0003_event_detector
Create Date: 2026-09-18

Additive and backwards-compatible: existing rows keep their data, older
projects still open. New Event columns are backfilled (updated_at := created_at),
and the two new tables are created only if absent.
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0004_event_provenance"
down_revision = "0003_event_detector"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    insp = sa.inspect(bind)

    event_cols = {c["name"] for c in insp.get_columns("event")}

    if "updated_at" not in event_cols:
        with op.batch_alter_table("event") as batch:
            batch.add_column(sa.Column("updated_at", sa.DateTime, nullable=True))
        # Backfill: an event that has never been edited was last "updated" when
        # it was created. Leave nothing NULL so ORM reads stay well-typed.
        op.execute("UPDATE event SET updated_at = created_at WHERE updated_at IS NULL")

    if "analysis_run_id" not in event_cols:
        with op.batch_alter_table("event") as batch:
            batch.add_column(sa.Column("analysis_run_id", sa.Integer, nullable=True))
        op.create_index(
            "ix_event_analysis_run_id", "event", ["analysis_run_id"], unique=False
        )

    existing_tables = set(insp.get_table_names())

    if "eventrevision" not in existing_tables:
        op.create_table(
            "eventrevision",
            sa.Column("id", sa.Integer, primary_key=True),
            sa.Column(
                "event_id",
                sa.Integer,
                sa.ForeignKey("event.id"),
                nullable=False,
                index=True,
            ),
            sa.Column("previous_values", sa.JSON, nullable=False),
            sa.Column("new_values", sa.JSON, nullable=False),
            sa.Column("actor_type", sa.String, nullable=False, server_default="manual"),
            sa.Column("reason", sa.String, nullable=False, server_default=""),
            sa.Column("created_at", sa.DateTime, nullable=False),
        )

    if "eventrelation" not in existing_tables:
        op.create_table(
            "eventrelation",
            sa.Column("id", sa.Integer, primary_key=True),
            sa.Column(
                "from_event_id",
                sa.Integer,
                sa.ForeignKey("event.id"),
                nullable=False,
                index=True,
            ),
            sa.Column(
                "to_event_id",
                sa.Integer,
                sa.ForeignKey("event.id"),
                nullable=False,
                index=True,
            ),
            sa.Column("relation_type", sa.String, nullable=False),
            sa.Column("created_at", sa.DateTime, nullable=False),
        )


def downgrade() -> None:
    insp = sa.inspect(op.get_bind())
    existing_tables = set(insp.get_table_names())
    if "eventrelation" in existing_tables:
        op.drop_table("eventrelation")
    if "eventrevision" in existing_tables:
        op.drop_table("eventrevision")

    event_cols = {c["name"] for c in insp.get_columns("event")}
    with op.batch_alter_table("event") as batch:
        if "analysis_run_id" in event_cols:
            batch.drop_column("analysis_run_id")
        if "updated_at" in event_cols:
            batch.drop_column("updated_at")
```


## `football-analysis/backend/alembic/versions/0005_finding.py`

```python
"""Add the finding table (analyst observations linked to evidence).

Revision ID: 0005_finding
Revises: 0004_event_provenance
Create Date: 2026-09-18

Additive: creates one new table only, if absent. Existing data untouched.
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0005_finding"
down_revision = "0004_event_provenance"
branch_labels = None
depends_on = None


def upgrade() -> None:
    insp = sa.inspect(op.get_bind())
    if "finding" not in set(insp.get_table_names()):
        op.create_table(
            "finding",
            sa.Column("id", sa.Integer, primary_key=True),
            sa.Column(
                "video_id",
                sa.Integer,
                sa.ForeignKey("video.id"),
                nullable=False,
                index=True,
            ),
            sa.Column("title", sa.String, nullable=False),
            sa.Column("description", sa.String, nullable=False, server_default=""),
            sa.Column("event_ids", sa.JSON, nullable=False),
            sa.Column("start_ms", sa.Integer, nullable=True),
            sa.Column("end_ms", sa.Integer, nullable=True),
            sa.Column("created_at", sa.DateTime, nullable=False),
        )


def downgrade() -> None:
    insp = sa.inspect(op.get_bind())
    if "finding" in set(insp.get_table_names()):
        op.drop_table("finding")
```


## `football-analysis/backend/app/__init__.py`

```python
"""Football analysis backend (FastAPI sidecar)."""

__version__ = "0.1.0"
```


## `football-analysis/backend/app/__main__.py`

```python
"""Development entry point: `python -m app` (or `.venv/Scripts/python -m app`).

Reuses the single FastAPI app object from `app.main` — never construct a
second app. Host/port default to settings (127.0.0.1:8765) and can be
overridden with CUDDY_HOST / CUDDY_PORT (same override the production
executable, `sidecar_entry.py`, honors), so both entry points behave the same
way for local port conflicts.

NOTE: the packaged/frozen executable does NOT use this file. A frozen
PyInstaller build can't resolve this module's relative imports (`from .config`)
when run as `__main__`, so `sidecar_entry.py` (absolute imports) is the actual
production entry point — see cuddy-backend.spec.
"""

from __future__ import annotations

import os

import uvicorn

from .config import settings
from .main import app

if __name__ == "__main__":
    host = os.getenv("CUDDY_HOST", settings.host)
    port = int(os.getenv("CUDDY_PORT", str(settings.port)))
    uvicorn.run(
        app,
        host=host,
        port=port,
        reload=False,
        log_level="info",
    )
```


## `football-analysis/backend/app/config.py`

```python
"""Runtime configuration.

Resolves a per-user data directory so the SQLite DB and any imported media
live outside the source tree (and, importantly, can be pointed outside of a
OneDrive-synced folder to avoid sync churn during development).
"""

from __future__ import annotations

import os
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


def _default_data_dir() -> Path:
    """Choose a sensible per-user data directory for app state."""
    # Allow an explicit override (used by the Tauri sidecar launcher).
    override = os.environ.get("FA_DATA_DIR")
    if override:
        return Path(override)

    if os.name == "nt":
        base = os.environ.get("LOCALAPPDATA") or str(Path.home())
        return Path(base) / "Cuddy"
    return Path.home() / ".local" / "share" / "cuddy"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="FA_", env_file=".env", extra="ignore")

    app_name: str = "Cuddy"
    host: str = "127.0.0.1"
    port: int = 8765

    data_dir: Path = _default_data_dir()

    @property
    def db_path(self) -> Path:
        return self.data_dir / "app.db"

    @property
    def media_dir(self) -> Path:
        return self.data_dir / "media"

    @property
    def tracks_dir(self) -> Path:
        return self.data_dir / "tracks"

    @property
    def logs_dir(self) -> Path:
        return self.data_dir / "logs"

    def ensure_dirs(self) -> None:
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.media_dir.mkdir(parents=True, exist_ok=True)
        self.tracks_dir.mkdir(parents=True, exist_ok=True)
        self.logs_dir.mkdir(parents=True, exist_ok=True)


settings = Settings()
```


## `football-analysis/backend/app/cv/__init__.py`

```python
"""Computer-vision pipeline (Phase 2): detection, tracking, team classification."""
```


## `football-analysis/backend/app/cv/analytics.py`

```python
"""Possession & passing analytics derived from tracking data.

Heuristic and dependent on tracking quality (especially the ball): each frame
the ball is assigned to the nearest player within a control radius; the ordered
sequence of ball-holders yields possession %, passes (same-team holder change),
turnovers (cross-team change) and a pass network.
"""

from __future__ import annotations

import math

PERSON = 0
BALL = 32


def _center(d: dict) -> tuple[float, float]:
    return d["x"] + d["w"] / 2, d["y"] + d["h"] / 2


def compute_analytics(
    tracks: dict, control_frac: float = 0.08, min_hold_frames: int = 2
) -> dict:
    frame_w = tracks.get("width", 1) or 1
    radius = control_frac * frame_w

    # 1) nearest-player possession per frame
    seq: list[tuple[int, int | None, int]] = []  # (t_ms, holder_id|None, team)
    for f in tracks.get("frames", []):
        ball = None
        players = []
        for d in f["dets"]:
            if d["cls"] == BALL:
                ball = d
            elif d["cls"] == PERSON:
                players.append(d)
        holder, team = None, -1
        if ball and players:
            bx, by = _center(ball)
            best, best_d = None, 1e18
            for p in players:
                px, py = _center(p)
                dd = math.hypot(px - bx, py - by)
                if dd < best_d:
                    best_d, best = dd, p
            if best is not None and best_d <= radius:
                holder, team = best["id"], best.get("team", -1)
        seq.append((f["t_ms"], holder, team))

    # 2) collapse into runs of identical holder (None allowed)
    runs: list[dict] = []
    for t, h, team in seq:
        if runs and runs[-1]["h"] == h:
            runs[-1]["end"] = t
            runs[-1]["n"] += 1
        else:
            runs.append({"h": h, "team": team, "start": t, "end": t, "n": 1})

    # possession share (all held frames)
    held = {0: 0, 1: 0}
    for r in runs:
        if r["h"] is not None and r["team"] in (0, 1):
            held[r["team"]] += r["n"]
    total_held = held[0] + held[1]
    possession_pct = {
        "0": round(100 * held[0] / total_held, 1) if total_held else 0.0,
        "1": round(100 * held[1] / total_held, 1) if total_held else 0.0,
    }

    # 3) touches = holder runs meeting the min-hold threshold
    touches = [
        (r["h"], r["team"], r["start"])
        for r in runs
        if r["h"] is not None and r["n"] >= min_hold_frames
    ]

    passes = {0: 0, 1: 0}
    turnovers = 0
    pass_edges: dict[tuple[int, int, int], int] = {}
    pass_events: list[dict] = []
    turnover_events: list[dict] = []
    for (a_id, a_team, _t0), (b_id, b_team, t1) in zip(touches, touches[1:]):
        if a_team in (0, 1) and a_team == b_team and a_id != b_id:
            passes[a_team] += 1
            key = (a_team, a_id, b_id)
            pass_edges[key] = pass_edges.get(key, 0) + 1
            pass_events.append({"t_ms": t1, "team": a_team, "from": a_id, "to": b_id})
        elif a_team in (0, 1) and b_team in (0, 1) and a_team != b_team:
            turnovers += 1
            turnover_events.append({"t_ms": t1, "from_team": a_team, "to_team": b_team})

    edges = [
        {"team": t, "from": a, "to": b, "count": c}
        for (t, a, b), c in sorted(pass_edges.items(), key=lambda kv: -kv[1])
    ]

    return {
        "possession_pct": possession_pct,
        "held_frames": {"0": held[0], "1": held[1]},
        "passes": {"0": passes[0], "1": passes[1]},
        "turnovers": turnovers,
        "pass_edges": edges,
        "pass_events": pass_events,
        "turnover_events": turnover_events,
        "n_touches": len(touches),
    }
```


## `football-analysis/backend/app/cv/events.py`

```python
"""Phase 3 candidate-event detection from tracking data (image space, no pitch).

Produces reviewable ``source="ai"`` events from on-screen action without needing
precise spatial positions. Every detection carries a low, honest confidence and
a ``detector`` subtype; the analyst confirms or rejects each one. We deliberately
only emit the detectors we can defensibly ground in the tracks (turnover, shot
attempt, counter-attack) and abstain from ones that need pitch geometry or extra
signal (corner, goal, big chance) rather than guess.
"""

from __future__ import annotations

import math

from .analytics import compute_analytics

PERSON = 0
BALL = 32


def _ball_trajectory(frames: list[dict]) -> list[tuple[int, float, float]]:
    """(t_ms, cx, cy) for frames where a ball was detected, time-sorted."""
    out: list[tuple[int, float, float]] = []
    for f in frames:
        for d in f["dets"]:
            if d["cls"] == BALL:
                out.append((f["t_ms"], d["x"] + d["w"] / 2, d["y"] + d["h"] / 2))
                break
    out.sort(key=lambda p: p[0])
    return out


def detect_events(
    tracks: dict,
    window_ms: int = 2500,
    shot_speed: float = 1.2,   # frame-widths / second
    counter_dx: float = 0.55,  # fraction of frame width travelled
    counter_win_ms: int = 4000,
) -> list[dict]:
    frame_w = tracks.get("width", 1) or 1
    frames = tracks.get("frames", [])
    events: list[dict] = []

    # 1) Turnovers — cross-team possession change (nearest-player, image space).
    analytics = compute_analytics(tracks)
    for tv in analytics.get("turnover_events", []):
        t = tv["t_ms"]
        team = "A" if tv["from_team"] == 0 else "B"
        events.append({
            "detector": "turnover",
            "label": f"Turnover ({team} lost the ball)",
            "start_ms": max(0, t - window_ms),
            "end_ms": t + window_ms,
            "confidence": 0.4,
        })

    ball = _ball_trajectory(frames)

    # 2) Shot attempts — a burst of high ball speed toward a touchline edge.
    used_until = -1
    for (t0, x0, y0), (t1, x1, y1) in zip(ball, ball[1:]):
        dt = (t1 - t0) / 1000.0
        if dt <= 0:
            continue
        speed = math.hypot(x1 - x0, y1 - y0) / frame_w / dt
        toward_edge = x1 < 0.2 * frame_w or x1 > 0.8 * frame_w
        if speed >= shot_speed and toward_edge and t0 > used_until:
            side = "left" if x1 < 0.5 * frame_w else "right"
            events.append({
                "detector": "shot",
                "label": f"Shot attempt (toward {side})",
                "start_ms": max(0, t0 - 1500),
                "end_ms": t0 + 1500,
                "confidence": 0.3,
            })
            used_until = t0 + 3000

    # 3) Counter-attacks — large, sustained horizontal ball travel in a window.
    used_until = -1
    for i, (t_a, x_a, _y) in enumerate(ball):
        j = i
        while j < len(ball) and ball[j][0] - t_a < counter_win_ms:
            j += 1
        if j >= len(ball):
            break
        t_b, x_b, _ = ball[j]
        if abs(x_b - x_a) / frame_w >= counter_dx and t_a > used_until:
            events.append({
                "detector": "counter",
                "label": "Counter-attack",
                "start_ms": t_a,
                "end_ms": t_b,
                "confidence": 0.35,
            })
            used_until = t_b

    events.sort(key=lambda e: e["start_ms"])
    return events
```


## `football-analysis/backend/app/cv/pipeline.py`

```python
"""Video analysis pipeline: YOLO detection + ByteTrack tracking + team clustering.

Heavy imports (torch, ultralytics, cv2) are done lazily inside ``analyze_video``
so the API process starts fast and only loads the ML stack when analysis runs.

Output is a JSON file per video:
    {
      "video": "clip.mp4", "src_fps": 25.0, "stride": 5,
      "width": 1920, "height": 1080, "target_fps": 5,
      "n_tracks": 22, "teams": 2,
      "frames": [ {"t_ms": 0, "dets": [
          {"id": 3, "cls": 0, "team": 1, "conf": 0.91,
           "x": 100.0, "y": 220.0, "w": 40.0, "h": 90.0}, ... ]}, ... ]
    }

cls follows COCO: 0 = person, 32 = sports ball. team is 0/1 for players,
-1 for the ball or unclustered tracks.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Callable, Optional

PERSON = 0
BALL = 32

ProgressCb = Optional[Callable[[float, str], None]]


def _torso_color(img, cx: float, cy: float, bw: float, bh: float):
    """Median BGR of the jersey region (upper-middle of the player box)."""
    import numpy as np

    h, w = img.shape[:2]
    x0 = int(max(0, cx - bw * 0.18))
    x1 = int(min(w, cx + bw * 0.18))
    y0 = int(max(0, cy - bh * 0.30))
    y1 = int(min(h, cy - bh * 0.02))
    if x1 <= x0 or y1 <= y0:
        return None
    patch = img[y0:y1, x0:x1]
    if patch.size == 0:
        return None
    return np.median(patch.reshape(-1, 3), axis=0)


def _cluster_teams(track_colors: dict[int, list]) -> dict[int, int]:
    """Cluster per-track mean jersey colours into two teams."""
    import numpy as np

    ids = [tid for tid, cols in track_colors.items() if len(cols) >= 3]
    if len(ids) < 2:
        return {}
    means = np.array([np.mean(track_colors[tid], axis=0) for tid in ids])

    from sklearn.cluster import KMeans

    k = 2 if len(ids) >= 2 else 1
    labels = KMeans(n_clusters=k, n_init=10, random_state=0).fit_predict(means)
    return {tid: int(lbl) for tid, lbl in zip(ids, labels)}


def analyze_video(
    video_path: str,
    out_path: str,
    *,
    target_fps: float = 5.0,
    imgsz: int = 640,
    model_name: str = "yolov8n.pt",
    conf: float = 0.3,
    progress: ProgressCb = None,
) -> dict:
    import cv2
    import torch
    from ultralytics import YOLO

    def report(p: float, msg: str) -> None:
        if progress:
            progress(max(0.0, min(1.0, p)), msg)

    report(0.01, "Reading video metadata")
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise RuntimeError(f"Could not open video: {video_path}")
    src_fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    cap.release()

    stride = max(1, round(src_fps / max(0.1, target_fps)))
    n_est = max(1, total // stride) if total else 0
    device = 0 if torch.cuda.is_available() else "cpu"

    report(0.03, f"Loading model on {'GPU' if device == 0 else 'CPU'}")
    model = YOLO(model_name)

    frames: list[dict] = []
    track_colors: dict[int, list] = {}

    report(0.05, "Detecting + tracking")
    i = 0
    for r in model.track(
        source=video_path,
        stream=True,
        tracker="bytetrack.yaml",
        classes=[PERSON, BALL],
        conf=conf,
        imgsz=imgsz,
        device=device,
        vid_stride=stride,
        verbose=False,
    ):
        frame_idx = i * stride
        t_ms = int(frame_idx / src_fps * 1000)
        dets: list[dict] = []
        boxes = r.boxes
        img = r.orig_img
        if boxes is not None and boxes.id is not None:
            ids = boxes.id.int().tolist()
            clss = boxes.cls.int().tolist()
            confs = boxes.conf.tolist()
            xywh = boxes.xywh.tolist()
            for tid, c, cf, (cx, cy, bw, bh) in zip(ids, clss, confs, xywh):
                dets.append({
                    "id": int(tid), "cls": int(c), "conf": round(float(cf), 3),
                    "x": round(cx - bw / 2, 1), "y": round(cy - bh / 2, 1),
                    "w": round(bw, 1), "h": round(bh, 1),
                })
                if c == PERSON:
                    color = _torso_color(img, cx, cy, bw, bh)
                    if color is not None:
                        track_colors.setdefault(int(tid), []).append(color)
        frames.append({"t_ms": t_ms, "dets": dets})
        i += 1
        if n_est:
            report(0.05 + 0.9 * (i / n_est), "Detecting + tracking")

    report(0.96, "Classifying teams")
    team_of = _cluster_teams(track_colors)
    for f in frames:
        for d in f["dets"]:
            d["team"] = team_of.get(d["id"], -1) if d["cls"] == PERSON else -1

    out = {
        "video": Path(video_path).name,
        "src_fps": round(src_fps, 3),
        "stride": stride,
        "width": width,
        "height": height,
        "target_fps": target_fps,
        "n_tracks": len(track_colors),
        "teams": len(set(team_of.values())) if team_of else 0,
        "frames": frames,
    }
    Path(out_path).parent.mkdir(parents=True, exist_ok=True)
    Path(out_path).write_text(json.dumps(out))
    report(1.0, "Done")

    return {
        "frames": len(frames), "tracks": len(track_colors),
        "width": width, "height": height,
        "device": "cuda" if device == 0 else "cpu",
    }
```


## `football-analysis/backend/app/cv/pitch.py`

```python
"""Pitch geometry: homography from a manual 4-point calibration, position
transform, heatmaps, team distances, and ball-position extraction.

The user clicks four image points that correspond to a known rectangle on the
pitch — by default the four pitch corners (length x width metres). We map image
pixels -> pitch metres, project each player's foot point and the ball, and build
per-team heatmaps + distance stats.
"""

from __future__ import annotations

import math
from typing import Optional

PERSON = 0
BALL = 32

# Standard pitch, metres.
DEFAULT_LENGTH = 105.0
DEFAULT_WIDTH = 68.0

MAX_PLAYER_SPEED = 12.0  # m/s — above this a step is treated as a tracking jump


def homography_from_corners(
    img_pts: list[list[float]], length: float, width: float
):
    """Perspective transform mapping the 4 clicked image points (ordered
    TL, TR, BR, BL) to pitch-metre corners."""
    import cv2
    import numpy as np

    if len(img_pts) != 4:
        raise ValueError("Exactly 4 calibration points are required")
    src = np.array(img_pts, dtype="float32")
    dst = np.array(
        [[0, 0], [length, 0], [length, width], [0, width]], dtype="float32"
    )
    return cv2.getPerspectiveTransform(src, dst)


def _apply(H, x: float, y: float) -> tuple[float, float]:
    d = H[2][0] * x + H[2][1] * y + H[2][2]
    if abs(d) < 1e-9:
        d = 1e-9
    wx = (H[0][0] * x + H[0][1] * y + H[0][2]) / d
    wy = (H[1][0] * x + H[1][1] * y + H[1][2]) / d
    return wx, wy


def build_pitch_data(
    tracks: dict,
    img_pts: list[list[float]],
    length: float = DEFAULT_LENGTH,
    width: float = DEFAULT_WIDTH,
    bin_size: float = 2.0,
) -> dict:
    """Transform every detection to pitch coordinates and aggregate."""
    import numpy as np

    H = homography_from_corners(img_pts, length, width)
    nx = max(1, int(round(length / bin_size)))
    ny = max(1, int(round(width / bin_size)))

    heat = {0: np.zeros((ny, nx)), 1: np.zeros((ny, nx))}
    track_pos: dict[int, list[tuple[int, float, float]]] = {}
    track_team: dict[int, int] = {}
    ball_positions: list[list[float]] = []

    for frame in tracks.get("frames", []):
        t = frame["t_ms"]
        for d in frame["dets"]:
            if d["cls"] == BALL:
                bx, by = _apply(H, d["x"] + d["w"] / 2, d["y"] + d["h"] / 2)
                if 0 <= bx <= length and 0 <= by <= width:
                    ball_positions.append([t, round(bx, 2), round(by, 2)])
                continue
            # player foot point = bottom-centre of the box
            fx, fy = _apply(H, d["x"] + d["w"] / 2, d["y"] + d["h"])
            if not (0 <= fx <= length and 0 <= fy <= width):
                continue
            team = d.get("team", -1)
            track_pos.setdefault(d["id"], []).append((t, fx, fy))
            if team in (0, 1):
                track_team[d["id"]] = team
                gx = min(nx - 1, int(fx / bin_size))
                gy = min(ny - 1, int(fy / bin_size))
                heat[team][gy, gx] += 1

    # per-track distance (filtering unrealistic jumps), summed per team
    team_distance = {0: 0.0, 1: 0.0}
    track_distance: dict[int, float] = {}
    for tid, pts in track_pos.items():
        pts.sort(key=lambda p: p[0])
        dist = 0.0
        for (t0, x0, y0), (t1, x1, y1) in zip(pts, pts[1:]):
            dt = (t1 - t0) / 1000.0
            if dt <= 0:
                continue
            step = math.hypot(x1 - x0, y1 - y0)
            if step / dt <= MAX_PLAYER_SPEED:
                dist += step
        track_distance[tid] = round(dist, 1)
        team = track_team.get(tid)
        if team in (0, 1):
            team_distance[team] += dist

    def norm(grid) -> list[list[float]]:
        m = float(grid.max())
        if m <= 0:
            return grid.tolist()
        return (grid / m).round(4).tolist()

    return {
        "length": length,
        "width": width,
        "bins_x": nx,
        "bins_y": ny,
        "heatmaps": {"0": norm(heat[0]), "1": norm(heat[1])},
        "team_distance_m": {
            "0": round(team_distance[0], 1),
            "1": round(team_distance[1], 1),
        },
        "track_distance_m": {str(k): v for k, v in track_distance.items()},
        "ball_positions": ball_positions,
        "img_points": img_pts,
    }


def _blur(grid, passes: int = 2):
    """Light separable [1,2,1] smoothing so sparse samples read as a bloom."""
    import numpy as np

    k = np.array([1.0, 2.0, 1.0])
    k /= k.sum()
    g = grid.astype(float)
    for _ in range(passes):
        g = np.apply_along_axis(lambda m: np.convolve(m, k, mode="same"), 1, g)
        g = np.apply_along_axis(lambda m: np.convolve(m, k, mode="same"), 0, g)
    return g


def build_player_heatmap(
    tracks: dict,
    track_id: int,
    img_pts: Optional[list[list[float]]] = None,
    length: float = DEFAULT_LENGTH,
    width: float = DEFAULT_WIDTH,
    bin_size: float = 3.0,
) -> dict:
    """Heatmap for a single tracked player (by CV track id).

    If a 4-point calibration is supplied the foot points are projected to pitch
    metres (``space="pitch"``); otherwise a normalized image-space grid is built
    (``space="image"``) — labelled approximate, per the project's CV principle.
    """
    import numpy as np

    vw = float(tracks.get("width") or 1)
    vh = float(tracks.get("height") or 1)
    feet = [
        (d["x"] + d["w"] / 2, d["y"] + d["h"])
        for frame in tracks.get("frames", [])
        for d in frame["dets"]
        if d["cls"] != BALL and d["id"] == track_id
    ]

    if img_pts and len(img_pts) == 4:
        space = "pitch"
        H = homography_from_corners(img_pts, length, width)
        nx = max(1, int(round(length / bin_size)))
        ny = max(1, int(round(width / bin_size)))
        grid = np.zeros((ny, nx))
        n = 0
        for x, y in feet:
            fx, fy = _apply(H, x, y)
            if 0 <= fx <= length and 0 <= fy <= width:
                grid[min(ny - 1, int(fy / bin_size)), min(nx - 1, int(fx / bin_size))] += 1
                n += 1
    else:
        space = "image"
        nx, ny = 32, 18
        grid = np.zeros((ny, nx))
        n = 0
        for x, y in feet:
            gx = min(nx - 1, max(0, int(x / vw * nx)))
            gy = min(ny - 1, max(0, int(y / vh * ny)))
            grid[gy, gx] += 1
            n += 1

    grid = _blur(grid)
    m = float(grid.max())
    heat = (grid / m).round(4).tolist() if m > 0 else grid.tolist()
    return {
        "track_id": track_id,
        "space": space,
        "length": length,
        "width": width,
        "bins_x": nx,
        "bins_y": ny,
        "grid": heat,
        "n_points": n,
    }


def autotag_final_third(
    pitch_data: dict, min_ms: int = 1500, gap_ms: int = 800
) -> list[dict]:
    """Heuristic AI events: contiguous spells with the ball in a final third.

    A 'final third' is X < length/3 (one end) or X > 2*length/3 (the other).
    Returns event dicts with start/end/label ready to be inserted as
    source='ai'.
    """
    length = pitch_data["length"]
    third = length / 3.0
    ball = sorted(pitch_data.get("ball_positions", []), key=lambda p: p[0])

    def zone(x: float) -> Optional[str]:
        if x <= third:
            return "left final third"
        if x >= length - third:
            return "right final third"
        return None

    events: list[dict] = []
    run_zone: Optional[str] = None
    run_start = 0
    last_t = 0
    for t, x, _y in ball:
        z = zone(x)
        if z and z == run_zone and (t - last_t) <= gap_ms:
            last_t = t
        else:
            if run_zone and (last_t - run_start) >= min_ms:
                events.append({
                    "start_ms": run_start, "end_ms": last_t,
                    "label": f"Ball in {run_zone}",
                })
            run_zone = z
            run_start = t
            last_t = t
    if run_zone and (last_t - run_start) >= min_ms:
        events.append({
            "start_ms": run_start, "end_ms": last_t,
            "label": f"Ball in {run_zone}",
        })
    return events
```


## `football-analysis/backend/app/cv/segmentation.py`

```python
"""Phase 2 triage: split footage into camera runs and label the main tactical
camera, so downstream analysis works on "just the real football".

Heuristic and honest:
  - Shot boundaries come from drops in grayscale-histogram correlation between
    sampled frames (a cut changes the whole frame).
  - Main-camera runs are green-dominated (the pitch fills a wide, high, slow
    tactical shot); replays, close-ups, graphics and crowd shots are not.

Each run carries a confidence; nothing is asserted as exact.
"""

from __future__ import annotations

from typing import Callable, Optional

ProgressCb = Optional[Callable[[float, str], None]]


def segment_video(
    video_path: str,
    sample_fps: float = 3.0,
    cut_corr: float = 0.6,
    green_thresh: float = 0.25,
    progress: ProgressCb = None,
) -> list[dict]:
    import cv2
    import numpy as np

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise RuntimeError(f"Could not open video: {video_path}")
    src_fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    stride = max(1, round(src_fps / max(0.1, sample_fps)))

    samples: list[tuple[int, "np.ndarray", float]] = []
    idx = 0
    while True:
        grabbed = cap.grab()
        if not grabbed:
            break
        if idx % stride == 0:
            ok, frame = cap.retrieve()
            if not ok:
                break
            t_ms = int(idx / src_fps * 1000)
            small = cv2.resize(frame, (64, 36))
            hsv = cv2.cvtColor(small, cv2.COLOR_BGR2HSV)
            green = cv2.inRange(hsv, (35, 40, 40), (85, 255, 255))
            green_frac = float(green.mean()) / 255.0
            gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
            hist = cv2.calcHist([gray], [0], None, [32], [0, 256])
            cv2.normalize(hist, hist)
            samples.append((t_ms, hist, green_frac))
        idx += 1
        if progress and total:
            progress(min(0.98, idx / total), "Segmenting footage")
    cap.release()

    if not samples:
        return []

    # cut boundaries: low histogram correlation between consecutive samples
    boundaries = [0]
    for i in range(1, len(samples)):
        corr = cv2.compareHist(samples[i - 1][1], samples[i][1], cv2.HISTCMP_CORREL)
        if corr < cut_corr:
            boundaries.append(i)
    boundaries.append(len(samples))

    segments: list[dict] = []
    for b in range(len(boundaries) - 1):
        run = samples[boundaries[b]:boundaries[b + 1]]
        if not run:
            continue
        med_green = float(np.median([r[2] for r in run]))
        is_main = med_green >= green_thresh
        conf = med_green / green_thresh if is_main else 1 - med_green / green_thresh
        segments.append({
            "start_ms": run[0][0],
            # extend the last run to just past its final sample
            "end_ms": run[-1][0] + int(1000 * stride / src_fps),
            "class": "main" if is_main else "other",
            "confidence": round(min(1.0, max(0.0, conf)), 2),
        })
    if progress:
        progress(1.0, "Footage segmented")
    return segments


def summarize(segments: list[dict]) -> dict:
    main_ms = sum(s["end_ms"] - s["start_ms"] for s in segments if s["class"] == "main")
    total_ms = sum(s["end_ms"] - s["start_ms"] for s in segments)
    return {
        "segments": len(segments),
        "main_segments": sum(1 for s in segments if s["class"] == "main"),
        "main_ms": main_ms,
        "total_ms": total_ms,
        "main_fraction": round(main_ms / total_ms, 3) if total_ms else 0.0,
    }
```


## `football-analysis/backend/app/cv/shots.py`

```python
"""Heuristic shot detection + a simple distance/angle xG estimate.

Requires pitch calibration (ball positions in metres). A "shot" is a burst of
high ball speed heading toward a goal from within range. xG is a transparent
logistic of shot distance and the goal-mouth angle — a simplified estimate, not
a trained model.
"""

from __future__ import annotations

import math

PERSON = 0
BALL = 32
GOAL_WIDTH = 7.32

# xG logistic coefficients (heuristic; give sensible values across distances).
XG_B0 = -0.4
XG_B_DIST = -0.10
XG_B_ANGLE = 2.0


def _shot_angle(x: float, y: float, goal_x: float, goal_yc: float) -> float:
    """Angle (radians) subtended by the goal mouth from the shot location."""
    ax, ay = goal_x - x, (goal_yc - GOAL_WIDTH / 2) - y
    bx, by = goal_x - x, (goal_yc + GOAL_WIDTH / 2) - y
    cross = ax * by - ay * bx
    dot = ax * bx + ay * by
    return abs(math.atan2(abs(cross), dot))


def _xg(dist: float, angle: float) -> float:
    z = XG_B0 + XG_B_DIST * dist + XG_B_ANGLE * angle
    return 1.0 / (1.0 + math.exp(-z))


def _center(d: dict) -> tuple[float, float]:
    return d["x"] + d["w"] / 2, d["y"] + d["h"] / 2


def _nearest_team(tracks: dict, t_ms: int) -> int:
    """Team of the player nearest the ball in the frame closest to t_ms."""
    frames = tracks.get("frames", [])
    if not frames:
        return -1
    frame = min(frames, key=lambda f: abs(f["t_ms"] - t_ms))
    ball = None
    players = []
    for d in frame["dets"]:
        if d["cls"] == BALL:
            ball = d
        elif d["cls"] == PERSON:
            players.append(d)
    if not ball or not players:
        return -1
    bx, by = _center(ball)
    best, best_d = None, 1e18
    for p in players:
        px, py = _center(p)
        dd = math.hypot(px - bx, py - by)
        if dd < best_d:
            best_d, best = dd, p
    return best.get("team", -1) if best else -1


def detect_shots(
    tracks: dict,
    pitch: dict,
    speed_thresh: float = 7.0,
    max_origin_dist: float = 40.0,
    merge_ms: int = 1200,
) -> dict:
    length = pitch["length"]
    width = pitch["width"]
    yc = width / 2
    ball = sorted(pitch.get("ball_positions", []), key=lambda p: p[0])

    shots: list[dict] = []
    used_until = -1
    for (t0, x0, y0), (t1, x1, y1) in zip(ball, ball[1:]):
        dt = (t1 - t0) / 1000.0
        if dt <= 0:
            continue
        speed = math.hypot(x1 - x0, y1 - y0) / dt
        if speed < speed_thresh:
            continue
        goal_x, side = (0.0, "left") if x1 < x0 else (length, "right")
        d_before = math.hypot(x0 - goal_x, y0 - yc)
        d_after = math.hypot(x1 - goal_x, y1 - yc)
        if d_after >= d_before:  # not approaching the goal
            continue
        if d_before > max_origin_dist or t0 <= used_until:
            continue
        angle = _shot_angle(x0, y0, goal_x, yc)
        shots.append({
            "t_ms": t0, "X": round(x0, 1), "Y": round(y0, 1), "goal": side,
            "team": _nearest_team(tracks, t0), "distance_m": round(d_before, 1),
            "angle_rad": round(angle, 3), "xg": round(_xg(d_before, angle), 3),
        })
        used_until = t0 + merge_ms

    team_xg = {0: 0.0, 1: 0.0}
    for s in shots:
        if s["team"] in (0, 1):
            team_xg[s["team"]] += s["xg"]

    return {
        "shots": shots,
        "team_xg": {"0": round(team_xg[0], 3), "1": round(team_xg[1], 3)},
        "team_shots": {
            "0": sum(1 for s in shots if s["team"] == 0),
            "1": sum(1 for s in shots if s["team"] == 1),
        },
        "length": length,
        "width": width,
    }
```


## `football-analysis/backend/app/db.py`

```python
"""Database engine and session management (SQLite via SQLModel)."""

from __future__ import annotations

from collections.abc import Iterator

from sqlalchemy import event
from sqlmodel import Session, SQLModel, create_engine

from .config import settings

settings.ensure_dirs()

# check_same_thread=False lets the engine be shared across FastAPI's threadpool.
# The busy timeout is set once, via the PRAGMA in the connect hook below.
engine = create_engine(
    f"sqlite:///{settings.db_path}",
    echo=False,
    connect_args={"check_same_thread": False},
)


@event.listens_for(engine, "connect")
def _sqlite_pragmas(dbapi_conn, _record):
    """WAL mode lets the frontend's status polls read while the background
    analysis thread writes events/progress — without this the two collide and
    raise "database is locked" mid-analysis. NORMAL sync is safe under WAL.
    """
    cur = dbapi_conn.cursor()
    cur.execute("PRAGMA journal_mode=WAL")
    cur.execute("PRAGMA busy_timeout=30000")
    cur.execute("PRAGMA synchronous=NORMAL")
    cur.close()


def init_db() -> None:
    """Bring the schema up to date via Alembic migrations.

    Adopts an existing pre-Alembic DB at the baseline, then upgrades. Falls back
    to ``create_all`` only if migrations cannot run (e.g. Alembic files missing
    in a stripped build) so the app still starts.
    """
    from . import models  # noqa: F401  (registers table metadata)

    try:
        from .migrations import run_migrations

        run_migrations()
    except Exception as exc:  # noqa: BLE001 - never block startup on migration setup
        print(f"[db] migration run failed ({exc}); falling back to create_all")
        SQLModel.metadata.create_all(engine)


def get_session() -> Iterator[Session]:
    """FastAPI dependency yielding a scoped DB session."""
    with Session(engine) as session:
        yield session
```


## `football-analysis/backend/app/football.py`

```python
"""Shared football terminology + semantics.

A single source of truth for zones, phases, event families and the team/period
vocabulary, so the query planner, analytics and filters agree on the same words
instead of scattering hard-coded strings across the codebase.

Kept deliberately small and configurable — extend the maps here rather than
inventing new strings elsewhere.
"""

from __future__ import annotations

# --- Teams -----------------------------------------------------------------
# Internally teams are 0 (home / "Team A") and 1 (away / "Team B").
TEAM_HOME = 0
TEAM_AWAY = 1
TEAM_LABELS = {TEAM_HOME: "Team A", TEAM_AWAY: "Team B"}

# Words an analyst uses for each side. "we/our/us" default to the home team.
HOME_WORDS = ("home", "we", "our", "us", "ourselves", "team a")
AWAY_WORDS = ("away", "they", "their", "them", "opponent", "opposition", "team b")


# --- Zones -----------------------------------------------------------------
# Thirds run along the length of the pitch (attack direction is +x for home).
DEFENSIVE_THIRD = "defensive_third"
MIDDLE_THIRD = "middle_third"
FINAL_THIRD = "final_third"
LEFT = "left"
CENTER = "center"
RIGHT = "right"

THIRDS = (DEFENSIVE_THIRD, MIDDLE_THIRD, FINAL_THIRD)
CHANNELS = (LEFT, CENTER, RIGHT)

# Phrase -> canonical zone. Order matters: check longer phrases first.
ZONE_PHRASES: dict[str, str] = {
    "defensive third": DEFENSIVE_THIRD,
    "defending third": DEFENSIVE_THIRD,
    "own third": DEFENSIVE_THIRD,
    "middle third": MIDDLE_THIRD,
    "central third": MIDDLE_THIRD,
    "midfield": MIDDLE_THIRD,
    "final third": FINAL_THIRD,
    "attacking third": FINAL_THIRD,
    "opposition third": FINAL_THIRD,
    "left side": LEFT,
    "left wing": LEFT,
    "left flank": LEFT,
    "right side": RIGHT,
    "right wing": RIGHT,
    "right flank": RIGHT,
    "central area": CENTER,
    "centre": CENTER,
    "center": CENTER,
}


def third_of_x(x: float, length: float, attack_positive: bool = True) -> str:
    """Classify a pitch x-coordinate (metres) into a defensive/middle/final third.

    `attack_positive` = the team attacks toward +x. For the away team the pitch
    is mirrored, so the final third is the low-x end.
    """
    frac = x / length if length else 0.5
    if not attack_positive:
        frac = 1.0 - frac
    if frac < 1 / 3:
        return DEFENSIVE_THIRD
    if frac < 2 / 3:
        return MIDDLE_THIRD
    return FINAL_THIRD


def channel_of_y(y: float, width: float) -> str:
    """Classify a pitch y-coordinate (metres) into left/center/right."""
    frac = y / width if width else 0.5
    if frac < 1 / 3:
        return RIGHT  # low y = right when looking along +x
    if frac < 2 / 3:
        return CENTER
    return LEFT


# --- Phases ----------------------------------------------------------------
PHASES = (
    "possession",
    "build_up",
    "progression",
    "final_third",
    "transition",
    "defensive",
)


# --- Event families --------------------------------------------------------
# Canonical family -> the substrings that identify it in an event code/label.
EVENT_FAMILIES: dict[str, tuple[str, ...]] = {
    "pass": ("pass", "cross", "switch"),
    "shot": ("shot", "strike", "effort", "header on goal"),
    "goal": ("goal",),
    "turnover": ("turnover", "loss", "lost ball", "giveaway", "dispossess"),
    "recovery": ("recovery", "win", "regain", "interception", "tackle"),
    "entry": ("entry", "final third entry", "box entry"),
}


def family_of(code: str) -> str | None:
    """Best-effort event family from an event's code/label (case-insensitive)."""
    low = (code or "").lower()
    for family, needles in EVENT_FAMILIES.items():
        if any(n in low for n in needles):
            return family
    return None
```


## `football-analysis/backend/app/jobs.py`

```python
"""A tiny in-memory background-job registry.

Analysis runs on a worker thread so the API stays responsive; the frontend
polls ``GET /jobs/{id}`` for progress. Jobs are process-local (fine for a
single-user desktop app) and cleared on restart.
"""

from __future__ import annotations

import threading
import uuid
from dataclasses import dataclass, field
from typing import Any, Callable, Optional


@dataclass
class Job:
    id: str
    kind: str
    status: str = "pending"  # pending | running | done | error
    progress: float = 0.0
    message: str = ""
    result: Optional[dict] = None
    error: Optional[str] = None
    meta: dict = field(default_factory=dict)

    def as_dict(self) -> dict[str, Any]:
        return {
            "id": self.id, "kind": self.kind, "status": self.status,
            "progress": round(self.progress, 3), "message": self.message,
            "result": self.result, "error": self.error, "meta": self.meta,
        }


_jobs: dict[str, Job] = {}
_lock = threading.Lock()


def get_job(job_id: str) -> Optional[Job]:
    with _lock:
        return _jobs.get(job_id)


def start_job(kind: str, target: Callable[[Job], dict], meta: Optional[dict] = None) -> Job:
    """Create a job and run ``target(job)`` on a daemon thread.

    ``target`` receives the Job and may update ``job.progress`` / ``job.message``;
    its return value becomes ``job.result``.
    """
    job = Job(id=uuid.uuid4().hex[:12], kind=kind, meta=meta or {})
    with _lock:
        _jobs[job.id] = job

    def run() -> None:
        job.status = "running"
        try:
            job.result = target(job)
            job.status = "done"
            job.progress = 1.0
        except Exception as exc:  # noqa: BLE001 - surface any failure to the client
            job.status = "error"
            job.error = f"{type(exc).__name__}: {exc}"

    threading.Thread(target=run, daemon=True).start()
    return job
```


## `football-analysis/backend/app/llm.py`

```python
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
```


## `football-analysis/backend/app/logging_setup.py`

```python
"""Production-friendly logging: write the backend's logs to a user-accessible
file under the Cuddy data dir (``%LOCALAPPDATA%\\Cuddy\\logs\\backend.log``) so a
packaged user can troubleshoot startup, missing DLLs/models, port conflicts, DB
or ML init failures without opening a terminal.
"""

from __future__ import annotations

import logging
import sys
from logging.handlers import RotatingFileHandler
from pathlib import Path

from .config import settings


def setup_logging(level: int = logging.INFO) -> "Path | None":
    """Attach a rotating file handler (and keep console output). Returns the log
    path, or None if the file handler could not be created."""
    settings.ensure_dirs()
    fmt = logging.Formatter(
        "%(asctime)s %(levelname)-5s [%(name)s] %(message)s", "%Y-%m-%d %H:%M:%S"
    )
    root = logging.getLogger()
    root.setLevel(level)

    # Console (captured by the parent process in dev).
    if not any(isinstance(h, logging.StreamHandler) for h in root.handlers):
        console = logging.StreamHandler(sys.stderr)
        console.setFormatter(fmt)
        root.addHandler(console)

    log_path = settings.logs_dir / "backend.log"
    try:
        fileh = RotatingFileHandler(
            log_path, maxBytes=2_000_000, backupCount=3, encoding="utf-8"
        )
        fileh.setFormatter(fmt)
        root.addHandler(fileh)
    except Exception as exc:  # noqa: BLE001 - never let logging setup crash startup
        root.warning("Could not open log file %s: %s", log_path, exc)
        return None

    # Route uvicorn's loggers through the same handlers.
    for name in ("uvicorn", "uvicorn.error", "uvicorn.access"):
        lg = logging.getLogger(name)
        lg.handlers = []
        lg.propagate = True

    root.info("Cuddy backend logging to %s", log_path)
    return log_path
```


## `football-analysis/backend/app/main.py`

```python
"""FastAPI application entrypoint (the Python sidecar).

Run directly for development:
    uvicorn app.main:app --reload --port 8765
or via the module runner:
    python -m app
"""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import __version__
from .config import settings
from .db import init_db
from .routes import (
    analysis,
    categories,
    descriptors,
    events,
    export,
    findings,
    projects,
    settings as settings_routes,
    templates,
    videos,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    # Re-launch any analysis run left interrupted by a previous crash/restart.
    from .pipeline import resume_incomplete

    resume_incomplete()
    yield


app = FastAPI(title=settings.app_name, version=__version__, lifespan=lifespan)

# In dev the Vite server runs on :5173; the packaged Tauri app uses the
# tauri://localhost origin. Allow both plus localhost variants.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "tauri://localhost",
        # Windows WebView2 serves the packaged app from http://tauri.localhost;
        # macOS/Linux use https://tauri.localhost. Allow both so the desktop
        # app's requests aren't blocked by CORS.
        "http://tauri.localhost",
        "https://tauri.localhost",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["meta"])
def health():
    """Liveness probe used by the frontend to confirm the sidecar is up."""
    return {
        "status": "ok",
        "service": "cuddy-backend",
        "app": settings.app_name,
        "version": __version__,
    }


app.include_router(projects.router)
app.include_router(videos.router)
app.include_router(categories.router)
app.include_router(descriptors.router)
app.include_router(events.router)
app.include_router(export.router)
app.include_router(findings.router)
app.include_router(templates.router)
app.include_router(analysis.router)
app.include_router(settings_routes.router)
```


## `football-analysis/backend/app/migrations.py`

```python
"""Run Alembic migrations at startup.

Adopts an existing pre-Alembic database (created by the old ``create_all``) by
stamping it at the baseline before upgrading, so a populated user DB is never
recreated or lost. A fresh DB is built from migrations.
"""

from __future__ import annotations

import sqlite3
from pathlib import Path

from alembic import command
from alembic.config import Config

from .config import settings


def _alembic_config() -> Config:
    backend_dir = Path(__file__).resolve().parent.parent  # .../backend
    cfg = Config(str(backend_dir / "alembic.ini"))
    cfg.set_main_option("script_location", str(backend_dir / "alembic"))
    cfg.set_main_option("sqlalchemy.url", f"sqlite:///{settings.db_path}")
    return cfg


def _table_exists(db_path: str, name: str) -> bool:
    if not Path(db_path).exists():
        return False
    con = sqlite3.connect(db_path)
    try:
        row = con.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name=?", (name,)
        ).fetchone()
        return row is not None
    finally:
        con.close()


def run_migrations() -> None:
    settings.ensure_dirs()
    cfg = _alembic_config()
    db_path = str(settings.db_path)

    has_alembic = _table_exists(db_path, "alembic_version")
    has_schema = _table_exists(db_path, "project")

    # Existing pre-Alembic DB with data: adopt at baseline instead of recreating.
    if not has_alembic and has_schema:
        command.stamp(cfg, "0001_baseline")

    command.upgrade(cfg, "head")
```


## `football-analysis/backend/app/models.py`

```python
"""Data model.

The core Nacsport-style concepts:
  Project    -- a body of analysis work (a team, a season, a set of matches)
  Video      -- an imported match/clip belonging to a project
  Category   -- a coding "button" (e.g. Shot, Pass, Corner) with colour + hotkey
  Event      -- a tagged moment on a video's timeline, linked to a Category

The Event.source field is what unifies manual and AI workflows: an AI model can
insert events with source="ai" and a confidence score, and the analyst reviews
and corrects them on the exact same timeline as manually coded events.

NOTE: `from __future__ import annotations` is intentionally NOT used here.
It would stringify the Relationship type hints in a way SQLAlchemy cannot
resolve, breaking mapper configuration.
"""

from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Column, JSON
from sqlmodel import Field, Relationship, SQLModel


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: str = ""
    created_at: datetime = Field(default_factory=_utcnow)

    videos: list["Video"] = Relationship(back_populates="project")
    categories: list["Category"] = Relationship(back_populates="project")


class Video(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(foreign_key="project.id", index=True)
    name: str
    # Absolute path on disk. Phase 0 references clips in place; a later phase may
    # copy/transcode them into the app media dir.
    path: str
    # Probed lazily; may be None until the player or ffprobe reports them.
    duration_ms: Optional[int] = None
    fps: Optional[float] = None
    width: Optional[int] = None
    height: Optional[int] = None
    created_at: datetime = Field(default_factory=_utcnow)

    project: Optional[Project] = Relationship(back_populates="videos")
    events: list["Event"] = Relationship(back_populates="video")


class DescriptorGroup(SQLModel, table=True):
    """A named group of descriptor buttons (e.g. "Outcome", "Zone", "Player")."""

    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(foreign_key="project.id", index=True)
    name: str
    sort_order: int = 0

    descriptors: list["Descriptor"] = Relationship(back_populates="group")


class Descriptor(SQLModel, table=True):
    """A single descriptor label within a group (e.g. "goal", "left wing")."""

    id: Optional[int] = Field(default=None, primary_key=True)
    group_id: int = Field(foreign_key="descriptorgroup.id", index=True)
    label: str
    color: Optional[str] = None
    sort_order: int = 0

    group: Optional[DescriptorGroup] = Relationship(back_populates="descriptors")


class Category(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(foreign_key="project.id", index=True)
    name: str
    color: str = "#6EE7D6"  # default soft teal accent
    hotkey: Optional[str] = None
    # Default seconds captured before/after the click when coding live.
    lead_ms: int = 5000
    lag_ms: int = 3000
    sort_order: int = 0

    project: Optional[Project] = Relationship(back_populates="categories")
    events: list["Event"] = Relationship(back_populates="category")


class Event(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    video_id: int = Field(foreign_key="video.id", index=True)
    category_id: Optional[int] = Field(default=None, foreign_key="category.id", index=True)

    label: str = ""
    start_ms: int
    end_ms: int
    notes: str = ""
    # Free-form descriptor tags (e.g. ["left wing", "player 9", "counter"]).
    descriptors: list[str] = Field(default_factory=list, sa_column=Column(JSON))

    # "manual" | "ai" — drives review workflow and UI treatment.
    source: str = "manual"
    # 0..1 for AI-generated events; None for manual.
    confidence: Optional[float] = None
    # Set true once an analyst has reviewed an AI event.
    reviewed: bool = False
    # Auto-detector subtype (e.g. "shot", "turnover", "counter") for events
    # produced by the Phase 3 pipeline; None for manual or hand-triggered events.
    # Lets re-analysis refresh only unreviewed auto events without touching the
    # analyst's manual or accepted ones.
    detector: Optional[str] = None
    # Which analysis run produced this event (for AI events); None for manual.
    # Lets derived outputs be traced to the run/config that generated them.
    analysis_run_id: Optional[int] = Field(
        default=None, foreign_key="analysisrun.id", index=True
    )

    created_at: datetime = Field(default_factory=_utcnow)
    updated_at: datetime = Field(default_factory=_utcnow)

    video: Optional[Video] = Relationship(back_populates="events")
    category: Optional[Category] = Relationship(back_populates="events")
    revisions: list["EventRevision"] = Relationship(
        back_populates="event",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


class EventRevision(SQLModel, table=True):
    """An immutable record of one change to an Event.

    Every edit an analyst (or the system) makes to an Event appends a revision
    holding the before/after values, so an AI suggestion is never silently
    destroyed when it is corrected — the original is recoverable from history.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    event_id: int = Field(foreign_key="event.id", index=True)
    previous_values: dict = Field(default_factory=dict, sa_column=Column(JSON))
    new_values: dict = Field(default_factory=dict, sa_column=Column(JSON))
    actor_type: str = "manual"  # "manual" | "system"
    reason: str = ""
    created_at: datetime = Field(default_factory=_utcnow)

    event: Optional[Event] = Relationship(back_populates="revisions")


class EventRelation(SQLModel, table=True):
    """A typed link between two Events (e.g. a recovery that leads to a shot).

    Powers lightweight sequence queries ("possessions ending in a shot") without
    a second analytics system — relationships are data, not LLM inference.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    from_event_id: int = Field(foreign_key="event.id", index=True)
    to_event_id: int = Field(foreign_key="event.id", index=True)
    # e.g. follows | causes | assist_for | shot_from | turnover_to |
    # possession_start | possession_end | same_sequence | related_clip
    relation_type: str
    created_at: datetime = Field(default_factory=_utcnow)


class Finding(SQLModel, table=True):
    """An analyst-saved observation linked to its evidence.

    e.g. "Repeated left-side turnovers in the first phase" tied to the events
    and time range that support it. The lightweight basis for report generation
    — it references events rather than duplicating them.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    video_id: int = Field(foreign_key="video.id", index=True)
    title: str
    description: str = ""
    event_ids: list[int] = Field(default_factory=list, sa_column=Column(JSON))
    start_ms: Optional[int] = None
    end_ms: Optional[int] = None
    created_at: datetime = Field(default_factory=_utcnow)


class AnalysisRun(SQLModel, table=True):
    """Durable state for a staged analysis pipeline (triage -> events -> spatial).

    Persisted to SQLite so a run survives a process restart: on startup any run
    still marked running/pending is re-launched and skips the stages already in
    ``completed_stages``.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    video_id: int = Field(foreign_key="video.id", index=True)
    kind: str = "analyze"
    status: str = "pending"  # pending | running | done | error
    stage: str = ""  # stage currently running (or last run)
    completed_stages: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    progress: float = 0.0
    message: str = ""
    error: Optional[str] = None
    created_at: datetime = Field(default_factory=_utcnow)
    updated_at: datetime = Field(default_factory=_utcnow)
```


## `football-analysis/backend/app/pipeline.py`

```python
"""Durable, staged, resumable analysis pipeline.

Stages run in order: ``triage`` -> ``events`` -> ``spatial``. Each stage writes
its output to disk under the video's data dir and records completion in the
``AnalysisRun`` row. A run interrupted by a crash resumes from the last completed
stage (stages already in ``completed_stages`` are skipped), and any run left
``running``/``pending`` is re-launched on startup by :func:`resume_incomplete`.

Stage status today:
  - triage : minimal placeholder (whole video = one main-camera segment).
             Phase 2 replaces it with real shot-boundary/main-camera detection.
  - events : real YOLO detection + ByteTrack + team clustering (writes tracks).
  - spatial: skipped placeholder. Phase 7 adds per-frame homography here.
"""

from __future__ import annotations

import json
import threading
import time
from pathlib import Path
from typing import Callable

from sqlmodel import Session, select

from .config import settings
from .db import engine
from .models import AnalysisRun, Video

STAGES = ["triage", "events", "spatial"]

# Overall-progress slice each stage occupies in [0, 1].
STAGE_SPAN = {"triage": (0.0, 0.05), "events": (0.05, 0.95), "spatial": (0.95, 1.0)}

StageProgress = Callable[[float, str], None]  # (fraction-within-stage, message)


def tracks_path(video_id: int) -> Path:
    return settings.tracks_dir / f"{video_id}.json"


def segments_path(video_id: int) -> Path:
    return settings.tracks_dir / f"{video_id}_segments.json"


# --------------------------------------------------------------------------- #
# Persistence helpers
# --------------------------------------------------------------------------- #

def _touch(run: AnalysisRun, session: Session) -> None:
    from datetime import datetime, timezone

    run.updated_at = datetime.now(timezone.utc)
    session.add(run)
    session.commit()


def run_as_dict(run: AnalysisRun) -> dict:
    """Job-compatible shape for the frontend poller, plus stage detail."""
    return {
        "id": str(run.id),
        "kind": run.kind,
        "status": run.status,
        "stage": run.stage,
        "completed_stages": run.completed_stages,
        "stages": STAGES,
        "progress": round(run.progress, 3),
        "message": run.message,
        "error": run.error,
        "result": None,
        "elapsed_ms": _elapsed_ms(run),
        "meta": {"video_id": run.video_id},
    }


def _elapsed_ms(run: AnalysisRun) -> int:
    """Wall-clock ms since the run started (for a frontend ETA estimate)."""
    from datetime import datetime, timezone

    end = run.updated_at if run.status in ("done", "error") else datetime.now(timezone.utc)
    start = run.created_at
    if start.tzinfo is None:
        start = start.replace(tzinfo=timezone.utc)
    if end.tzinfo is None:
        end = end.replace(tzinfo=timezone.utc)
    return max(0, int((end - start).total_seconds() * 1000))


# --------------------------------------------------------------------------- #
# Stage implementations
# --------------------------------------------------------------------------- #

def _stage_triage(video: Video, progress: StageProgress, session: Session) -> None:
    """Split footage into camera runs and label the main tactical camera."""
    if not Path(video.path).is_file():
        raise FileNotFoundError(
            f"Source file missing: {video.path}. Relink the video and re-run."
        )
    from .cv.segmentation import segment_video, summarize  # heavy import, lazy

    segments = segment_video(video.path, progress=lambda p, m: progress(p, m))
    data = {
        "video_id": video.id,
        "placeholder": False,
        "segments": segments,
        "summary": summarize(segments),
    }
    p = segments_path(video.id)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(data))


def _upsert_ai_events(video_id: int, candidates: list[dict], session: Session) -> None:
    """Replace unreviewed auto-detected events with a fresh set; leave the
    analyst's manual and already-reviewed events untouched.

    Uses the pipeline run's own session — opening a second connection here
    deadlocks against the progress-update writes on SQLite ("database is
    locked") even under WAL.
    """
    from .models import Event

    prior = session.exec(
        select(Event).where(
            Event.video_id == video_id,
            Event.source == "ai",
            Event.reviewed == False,  # noqa: E712 - SQL boolean comparison
            Event.detector != None,  # noqa: E711 - SQL NULL comparison
        )
    ).all()
    for e in prior:
        session.delete(e)
    for c in candidates:
        session.add(Event(
            video_id=video_id, category_id=None, label=c["label"],
            start_ms=c["start_ms"], end_ms=c["end_ms"],
            source="ai", confidence=c["confidence"], detector=c["detector"],
        ))
    session.commit()


def _stage_events(video: Video, progress: StageProgress, session: Session) -> None:
    """Detection + tracking (writes tracks) then candidate-event detection."""
    if not Path(video.path).is_file():
        raise FileNotFoundError(
            f"Source file missing: {video.path}. Relink the video and re-run."
        )
    from .cv.pipeline import analyze_video  # heavy import, kept lazy

    analyze_video(
        video.path,
        str(tracks_path(video.id)),
        target_fps=5.0,
        progress=lambda p, m: progress(p * 0.9, m),  # detection = first 90%
    )
    progress(0.92, "Detecting events")
    from .cv.events import detect_events

    tracks = json.loads(tracks_path(video.id).read_text())
    candidates = detect_events(tracks)
    _upsert_ai_events(video.id, candidates, session)
    progress(1.0, f"Found {len(candidates)} candidate events")


def _stage_spatial(video: Video, progress: StageProgress, session: Session) -> None:
    """Placeholder: spatial registration is Phase 7. Skipped for now."""
    progress(1.0, "Spatial layer skipped (Phase 7)")


StageFn = Callable[[Video, "StageProgress", Session], None]
STAGE_FNS: dict[str, StageFn] = {
    "triage": _stage_triage,
    "events": _stage_events,
    "spatial": _stage_spatial,
}


# --------------------------------------------------------------------------- #
# Runner
# --------------------------------------------------------------------------- #

def _run_pipeline(run_id: int) -> None:
    with Session(engine) as session:
        run = session.get(AnalysisRun, run_id)
        if not run:
            return
        video = session.get(Video, run.video_id)
        if not video:
            run.status = "error"
            run.error = "Video not found"
            _touch(run, session)
            return

        run.status = "running"
        run.error = None
        _touch(run, session)
        completed = set(run.completed_stages or [])
        last_write = 0.0

        for stage in STAGES:
            if stage in completed:
                continue
            run.stage = stage
            lo, hi = STAGE_SPAN[stage]

            def progress(frac: float, msg: str, _lo=lo, _hi=hi) -> None:
                nonlocal last_write
                run.progress = _lo + (_hi - _lo) * max(0.0, min(1.0, frac))
                run.message = msg
                now = time.time()
                if now - last_write > 1.0:  # throttle DB writes
                    last_write = now
                    _touch(run, session)

            try:
                STAGE_FNS[stage](video, progress, session)
            except Exception as exc:  # noqa: BLE001 - surface stage failure to client
                run.status = "error"
                run.error = f"{type(exc).__name__}: {exc}"
                _touch(run, session)
                return

            completed.add(stage)
            run.completed_stages = sorted(completed, key=STAGES.index)
            run.progress = hi
            _touch(run, session)

        run.status = "done"
        run.stage = ""
        run.progress = 1.0
        run.message = "Analysis complete"
        _touch(run, session)


def _launch(run_id: int) -> None:
    threading.Thread(target=_run_pipeline, args=(run_id,), daemon=True).start()


def start_analysis(session: Session, video_id: int) -> AnalysisRun:
    """Create or resume a run for the video, then launch it on a worker thread."""
    existing = session.exec(
        select(AnalysisRun)
        .where(AnalysisRun.video_id == video_id)
        .order_by(AnalysisRun.id.desc())  # type: ignore[attr-defined]
    ).first()

    if existing and existing.status in ("pending", "running", "error"):
        run = existing  # resume from completed_stages
        run.status = "pending"
        run.error = None
    else:
        run = AnalysisRun(video_id=video_id, status="pending")
        session.add(run)
    session.commit()
    session.refresh(run)
    _launch(run.id)
    return run


def get_run(session: Session, run_id: int) -> AnalysisRun | None:
    return session.get(AnalysisRun, run_id)


def resume_incomplete() -> None:
    """On startup, re-launch any run left running/pending by a crash."""
    with Session(engine) as session:
        stuck = session.exec(
            select(AnalysisRun).where(AnalysisRun.status.in_(["running", "pending"]))  # type: ignore[attr-defined]
        ).all()
        for run in stuck:
            _launch(run.id)
```


## `football-analysis/backend/app/providers/__init__.py`

```python
"""External data providers (real match data)."""
```


## `football-analysis/backend/app/providers/apifootball.py`

```python
"""Real match data from API-Football (api-sports.io).

Given a free-text description ("Chelsea vs Arsenal", optionally with a season or
date), find the fixture and return a normalized bundle: both teams' names,
formations, starting lineups, team statistics and the event timeline — real,
provider-validated data rather than a CV estimate or an LLM guess.

Auth: the user's api-sports.io key (free tier ~100 requests/day), stored in
Settings. Docs: https://www.api-football.com/documentation-v3
"""

from __future__ import annotations

import re
from typing import Any

from .. import user_settings

BASE = "https://v3.football.api-sports.io"
_TIMEOUT = 15.0


class ProviderError(RuntimeError):
    """A recoverable provider problem (no key, not found, rate limited)."""


def _client():
    import httpx

    key = user_settings.get_apifootball_key()
    if not key:
        raise ProviderError(
            "No API-Football key configured. Add one in Settings (free at "
            "api-sports.io) to load real match data."
        )
    return httpx.Client(
        base_url=BASE, headers={"x-apisports-key": key}, timeout=_TIMEOUT
    )


def _get(client, path: str, params: dict) -> list[dict]:
    resp = client.get(path, params=params)
    if resp.status_code == 429:
        raise ProviderError("API-Football rate limit reached — try again later.")
    if resp.status_code in (401, 403):
        raise ProviderError("API-Football rejected the key. Check it in Settings.")
    resp.raise_for_status()
    body = resp.json()
    errors = body.get("errors")
    # api-sports returns errors as a dict (or [] when none).
    if isinstance(errors, dict) and errors:
        raise ProviderError("; ".join(str(v) for v in errors.values()))
    return body.get("response", []) or []


def _parse_teams(query: str) -> tuple[str, str] | None:
    """Pull two team names out of a description like 'Chelsea vs Arsenal 2024'."""
    cleaned = re.sub(r"\b(20\d{2}(?:[-/]\d{2,4})?)\b", " ", query)  # drop years
    parts = re.split(r"\s+(?:vs?\.?|v|[-–—]|x)\s+", cleaned, flags=re.IGNORECASE)
    parts = [p.strip(" .,-") for p in parts if p.strip(" .,-")]
    if len(parts) >= 2:
        return parts[0], parts[1]
    return None


def _team_id(client, name: str) -> dict | None:
    rows = _get(client, "/teams", {"search": name})
    if not rows:
        return None
    team = rows[0].get("team", {})
    return {"id": team.get("id"), "name": team.get("name"), "logo": team.get("logo")}


def _season_from(query: str) -> int | None:
    m = re.search(r"\b(20\d{2})\b", query)
    return int(m.group(1)) if m else None


def _pick_fixture(client, home_id: int, away_id: int, season: int | None) -> dict | None:
    params: dict[str, Any] = {"h2h": f"{home_id}-{away_id}"}
    if season:
        params["season"] = season
    rows = _get(client, "/fixtures/headtohead", params)
    if not rows:
        rows = _get(client, "/fixtures/headtohead", {"h2h": f"{home_id}-{away_id}"})
    if not rows:
        return None
    # Prefer finished matches, most recent first.
    def sort_key(r):
        return r.get("fixture", {}).get("timestamp", 0)

    finished = [
        r for r in rows if r.get("fixture", {}).get("status", {}).get("short") == "FT"
    ]
    chosen = max(finished or rows, key=sort_key)
    return chosen


def _normalize_stats(rows: list[dict]) -> dict[int, dict]:
    """team_id -> {stat label: value} from /fixtures/statistics."""
    out: dict[int, dict] = {}
    for entry in rows:
        tid = entry.get("team", {}).get("id")
        stats = {}
        for s in entry.get("statistics", []):
            stats[str(s.get("type"))] = s.get("value")
        if tid is not None:
            out[tid] = stats
    return out


def _normalize_lineups(rows: list[dict]) -> dict[int, dict]:
    out: dict[int, dict] = {}
    for entry in rows:
        tid = entry.get("team", {}).get("id")
        if tid is None:
            continue
        xi = [
            p.get("player", {}).get("name")
            for p in entry.get("startXI", [])
            if p.get("player", {}).get("name")
        ]
        out[tid] = {"formation": entry.get("formation"), "start_xi": xi}
    return out


def _fixture_summary(fx: dict) -> dict:
    """A lightweight fixture card for the browser (no stats/lineups)."""
    fixture = fx.get("fixture", {})
    goals = fx.get("goals", {})
    league = fx.get("league", {})
    home = fx.get("teams", {}).get("home", {})
    away = fx.get("teams", {}).get("away", {})
    return {
        "fixture_id": fixture.get("id"),
        "date": (fixture.get("date") or "")[:10] or None,
        "status": fixture.get("status", {}).get("short"),
        "competition": league.get("name"),
        "season": league.get("season"),
        "home": home.get("name"),
        "away": away.get("name"),
        "home_logo": home.get("logo"),
        "away_logo": away.get("logo"),
        "score": f'{goals.get("home")}-{goals.get("away")}'
        if goals.get("home") is not None
        else None,
    }


def search_fixtures(query: str, limit: int = 25) -> list[dict]:
    """Return candidate fixtures for a description, most recent first.

    Two teams ("Arsenal vs Chelsea") -> their head-to-head meetings. One team
    -> that team's recent fixtures. The caller picks the exact fixture, which is
    then loaded by id — far more reliable than free-text guessing.
    """
    with _client() as client:
        teams = _parse_teams(query)
        if teams:
            a = _team_id(client, teams[0])
            b = _team_id(client, teams[1])
            if not a or not a["id"]:
                raise ProviderError(f'Team not found: "{teams[0]}".')
            if not b or not b["id"]:
                raise ProviderError(f'Team not found: "{teams[1]}".')
            rows = _get(
                client, "/fixtures/headtohead", {"h2h": f'{a["id"]}-{b["id"]}'}
            )
        else:
            name = query.strip()
            if not name:
                raise ProviderError("Enter a team or 'Home vs Away' to search.")
            t = _team_id(client, name)
            if not t or not t["id"]:
                raise ProviderError(f'Team not found: "{name}".')
            rows = _get(client, "/fixtures", {"team": t["id"], "last": 30})

    rows.sort(key=lambda r: r.get("fixture", {}).get("timestamp", 0), reverse=True)
    return [_fixture_summary(r) for r in rows[:limit]]


def _bundle(client, fx: dict, query: str) -> dict:
    """Fetch stats/lineups/events for a fixture row and normalize everything."""
    fixture = fx.get("fixture", {})
    fid = fixture.get("id")
    goals = fx.get("goals", {})
    league = fx.get("league", {})
    f_home = fx.get("teams", {}).get("home", {})
    f_away = fx.get("teams", {}).get("away", {})

    stats = _normalize_stats(_get(client, "/fixtures/statistics", {"fixture": fid}))
    lineups = _normalize_lineups(_get(client, "/fixtures/lineups", {"fixture": fid}))
    events_raw = _get(client, "/fixtures/events", {"fixture": fid})

    def side(team: dict) -> dict:
        tid = team.get("id")
        lu = lineups.get(tid, {})
        return {
            "id": tid,
            "name": team.get("name"),
            "logo": team.get("logo"),
            "formation": lu.get("formation"),
            "start_xi": lu.get("start_xi", []),
            "stats": stats.get(tid, {}),
        }

    events = [
        {
            "minute": e.get("time", {}).get("elapsed"),
            "team": e.get("team", {}).get("name"),
            "player": e.get("player", {}).get("name"),
            "type": e.get("type"),
            "detail": e.get("detail"),
        }
        for e in events_raw
    ]

    return {
        "query": query,
        "fixture_id": fid,
        "competition": league.get("name"),
        "date": (fixture.get("date") or "")[:10] or None,
        "score": f'{goals.get("home")}-{goals.get("away")}'
        if goals.get("home") is not None
        else None,
        "home": side(f_home),
        "away": side(f_away),
        "events": events,
    }


def fetch_match_by_id(fixture_id: int) -> dict:
    """Load full match data for a specific fixture id (from the browser)."""
    with _client() as client:
        rows = _get(client, "/fixtures", {"id": fixture_id})
        if not rows:
            raise ProviderError(f"Fixture {fixture_id} not found.")
        return _bundle(client, rows[0], query=f"fixture:{fixture_id}")


def _player_line(entry: dict) -> dict:
    """Compact per-player stat line from a /fixtures/players player entry."""
    p = entry.get("player", {})
    s = (entry.get("statistics") or [{}])[0]
    games = s.get("games") or {}
    shots = s.get("shots") or {}
    goals = s.get("goals") or {}
    passes = s.get("passes") or {}
    tackles = s.get("tackles") or {}
    duels = s.get("duels") or {}
    dribbles = s.get("dribbles") or {}
    cards = s.get("cards") or {}
    rating = games.get("rating")
    return {
        "id": p.get("id"),
        "name": p.get("name"),
        "photo": p.get("photo"),
        "number": games.get("number"),
        "position": games.get("position"),
        "minutes": games.get("minutes"),
        "rating": round(float(rating), 1) if rating not in (None, "") else None,
        "captain": bool(games.get("captain")),
        "goals": goals.get("total") or 0,
        "assists": goals.get("assists") or 0,
        "shots": shots.get("total") or 0,
        "shots_on": shots.get("on") or 0,
        "passes": passes.get("total") or 0,
        "pass_accuracy": passes.get("accuracy"),
        "key_passes": passes.get("key") or 0,
        "tackles": tackles.get("total") or 0,
        "interceptions": tackles.get("interceptions") or 0,
        "duels_won": duels.get("won") or 0,
        "duels_total": duels.get("total") or 0,
        "dribbles": dribbles.get("success") or 0,
        "yellow": cards.get("yellow") or 0,
        "red": cards.get("red") or 0,
    }


def fetch_player_stats(fixture_id: int) -> dict:
    """Per-player match statistics for a fixture, grouped by team id.

    Returns ``{"fixture_id", "by_team": {team_id: {"name", "players": [...]}}}``
    from API-Football's ``/fixtures/players`` (real, provider-validated).
    """
    with _client() as client:
        rows = _get(client, "/fixtures/players", {"fixture": fixture_id})
    by_team: dict[str, dict] = {}
    for entry in rows:
        team = entry.get("team", {})
        tid = team.get("id")
        if tid is None:
            continue
        players = [_player_line(pe) for pe in entry.get("players", [])]
        # Keep only players who actually appeared, most involved first.
        players = [p for p in players if (p.get("minutes") or 0) > 0]
        players.sort(key=lambda p: (p.get("minutes") or 0), reverse=True)
        by_team[str(tid)] = {"name": team.get("name"), "players": players}
    return {"fixture_id": fixture_id, "by_team": by_team}


def fetch_match(query: str) -> dict:
    """Return normalized match data for the best-matching fixture (free-text)."""
    teams = _parse_teams(query)
    if not teams:
        raise ProviderError(
            'Could not read two team names from "%s". Try "Home vs Away".' % query
        )
    season = _season_from(query)
    with _client() as client:
        a = _team_id(client, teams[0])
        b = _team_id(client, teams[1])
        if not a or not a["id"]:
            raise ProviderError(f'Team not found: "{teams[0]}".')
        if not b or not b["id"]:
            raise ProviderError(f'Team not found: "{teams[1]}".')

        fx = _pick_fixture(client, a["id"], b["id"], season)
        if not fx:
            raise ProviderError(f'No fixture found between {a["name"]} and {b["name"]}.')
        return _bundle(client, fx, query=query)
```


## `football-analysis/backend/app/query.py`

```python
"""Deterministic query planner + evidence engine.

The architecture the spec mandates:

    question -> QUERY PLANNER -> STRUCTURED QUERY -> DETERMINISTIC ANALYTICS
             -> EVIDENCE PACKAGE -> (optional) LLM EXPLANATION

The LLM is NOT the analytics engine. `plan_query` turns a natural-language
question into a constrained `StructuredQuery` using rules (no network, no key),
and `resolve_query` answers it from the actual coded events + computed
analytics, returning events, metrics and clips that are all real. The LLM, when
configured, only writes prose over this evidence — it can never invent a clip.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal, Optional

from pydantic import BaseModel

from . import football

Intent = Literal[
    "metric_comparison",
    "event_lookup",
    "event_count",
    "event_filter",
    "sequence_lookup",
    "shot_analysis",
    "possession_analysis",
    "pass_analysis",
    "turnover_analysis",
    "zone_analysis",
    "player_analysis",
    "time_range_analysis",
    "clip_lookup",
]


class StructuredQuery(BaseModel):
    intent: Intent = "event_filter"
    team: Optional[Literal["home", "away", "both"]] = None
    period: Optional[int] = None  # 1 or 2
    zones: list[str] = []
    event_types: list[str] = []  # football families: pass/shot/turnover/...
    source: Optional[Literal["manual", "ai"]] = None
    reviewed: Optional[bool] = None
    time_range_ms: Optional[tuple[int, int]] = None
    metric: Optional[str] = None  # xg / possession / shots / passes / turnovers
    wants_clips: bool = False
    limit: int = 50


class Metric(BaseModel):
    label: str
    value: float | int | str
    source: str  # e.g. "cuddy_video_analysis", "heuristic", "approximate_cv"


class Clip(BaseModel):
    event_id: int
    start_ms: int
    end_ms: int
    label: str
    reason: str = ""


class EvidencePackage(BaseModel):
    question: str
    query: StructuredQuery
    summary: str
    metrics: list[Metric] = []
    events: list[int] = []  # matched event ids
    clips: list[Clip] = []
    warnings: list[str] = []


# --- Planner ---------------------------------------------------------------

# First half is conventionally 0..45' + stoppage; use 45:00 as the split when a
# real period boundary is unknown. (Kept explicit rather than a magic number.)
FIRST_HALF_END_MS = 45 * 60 * 1000

_INTENT_KEYWORDS: list[tuple[str, Intent]] = [
    ("sequence", "sequence_lookup"),
    ("leading to", "sequence_lookup"),
    ("ending in", "sequence_lookup"),
    ("build up to", "sequence_lookup"),
    ("build-up to", "sequence_lookup"),
    ("possession ending", "sequence_lookup"),
    ("turnover", "turnover_analysis"),
    ("lost the ball", "turnover_analysis"),
    ("lose the ball", "turnover_analysis"),
    ("giveaway", "turnover_analysis"),
    ("recovery", "event_filter"),
    ("possession", "possession_analysis"),
    ("pass network", "pass_analysis"),
    ("passing", "pass_analysis"),
    ("passes", "pass_analysis"),
    ("xg", "metric_comparison"),
    ("expected goals", "metric_comparison"),
    ("shot", "shot_analysis"),
    ("how many", "event_count"),
    ("how often", "event_count"),
]


def _detect_team(q: str) -> Optional[str]:
    if any(w in q for w in football.AWAY_WORDS):
        return "away"
    if any(w in q for w in football.HOME_WORDS):
        return "home"
    return None


def _detect_zones(q: str) -> list[str]:
    zones: list[str] = []
    for phrase, zone in football.ZONE_PHRASES.items():
        if phrase in q and zone not in zones:
            zones.append(zone)
    return zones


def _detect_period(q: str) -> Optional[int]:
    if "first half" in q or "1st half" in q:
        return 1
    if "second half" in q or "2nd half" in q:
        return 2
    return None


def _detect_families(q: str) -> list[str]:
    fams: list[str] = []
    for family, needles in football.EVENT_FAMILIES.items():
        if any(n in q for n in needles) and family not in fams:
            fams.append(family)
    return fams


def plan_query(question: str) -> StructuredQuery:
    """Rule-based NL -> StructuredQuery. Deterministic; no LLM."""
    q = (question or "").lower().strip()

    intent: Intent = "event_filter"
    for needle, mapped in _INTENT_KEYWORDS:
        if needle in q:
            intent = mapped
            break

    wants_clips = q.startswith("show me") or "show me" in q or "clips" in q

    metric = None
    if intent == "metric_comparison" or "xg" in q or "expected goals" in q:
        metric = "xg"
    elif "possession" in q:
        metric = "possession"

    zones = _detect_zones(q)
    families = _detect_families(q)
    period = _detect_period(q)
    team = _detect_team(q)

    # A "show me ... shots/turnovers" reads as a clip lookup filtered by family.
    if wants_clips and intent in ("event_filter", "event_count"):
        intent = "clip_lookup"

    source: Optional[str] = None
    if "ai" in q.split() or "suggested" in q or "detector" in q:
        source = "ai"
    elif "manual" in q:
        source = "manual"

    reviewed: Optional[bool] = None
    if "unreviewed" in q or "not reviewed" in q:
        reviewed = False
    elif "reviewed" in q or "accepted" in q:
        reviewed = True

    return StructuredQuery(
        intent=intent,
        team=team,
        period=period,
        zones=zones,
        event_types=families,
        source=source,  # type: ignore[arg-type]
        reviewed=reviewed,
        metric=metric,
        wants_clips=wants_clips,
    )


# --- Engine ----------------------------------------------------------------


@dataclass
class EventLite:
    """The minimum an event needs to be filtered/clipped. Decoupled from the ORM
    so the engine is unit-testable without a database."""

    id: int
    code: str
    start_ms: int
    end_ms: int
    source: str = "manual"
    reviewed: bool = False
    descriptors: list[str] = field(default_factory=list)


@dataclass
class QueryContext:
    """Everything the engine may read. Analytics/shots are optional (may be
    None when the video has not been analysed yet). `relations` are (from, to)
    event-id pairs powering sequence lookups."""

    events: list[EventLite]
    analytics: Optional[dict] = None
    shots: Optional[dict] = None
    relations: list[tuple[int, int]] = field(default_factory=list)


def _text_of(ev: EventLite) -> str:
    return " ".join([ev.code or ""] + list(ev.descriptors or [])).lower()


def _matches(ev: EventLite, q: StructuredQuery) -> bool:
    if q.source and ev.source != q.source:
        return False
    if q.reviewed is not None and ev.reviewed != q.reviewed:
        return False
    if q.period == 1 and ev.start_ms >= FIRST_HALF_END_MS:
        return False
    if q.period == 2 and ev.start_ms < FIRST_HALF_END_MS:
        return False
    if q.time_range_ms:
        lo, hi = q.time_range_ms
        if ev.end_ms < lo or ev.start_ms > hi:
            return False
    if q.event_types:
        fam = football.family_of(ev.code)
        text = _text_of(ev)
        if fam not in q.event_types and not any(f in text for f in q.event_types):
            return False
    if q.zones:
        text = _text_of(ev)
        # Zone match is descriptor-text based (events carry no coordinates);
        # only shots have true positions and are handled in shot_analysis.
        if not any(z.replace("_", " ") in text or z in text for z in q.zones):
            return False
    return True


def _clip(ev: EventLite, reason: str = "") -> Clip:
    return Clip(
        event_id=ev.id,
        start_ms=ev.start_ms,
        end_ms=ev.end_ms,
        label=ev.code or "Event",
        reason=reason,
    )


def _resolve_sequences(
    question: str, q: StructuredQuery, ctx: QueryContext
) -> EvidencePackage:
    """Reconstruct event chains from relations. If the query names a family
    (e.g. "ending in a shot"), keep only sequences that contain it."""
    pkg = EvidencePackage(question=question, query=q, summary="")
    by_id = {e.id: e for e in ctx.events}
    if not ctx.relations:
        pkg.summary = "No event sequences recorded. Link related events first."
        return pkg

    # Follow from->to chains. Nodes that are a `to` but never a `from` start no
    # chain; walk forward from each chain head (a `from` never seen as a `to`).
    succ: dict[int, list[int]] = {}
    tos: set[int] = set()
    for a, b in ctx.relations:
        succ.setdefault(a, []).append(b)
        tos.add(b)
    heads = [a for a in succ if a not in tos] or list(succ)

    sequences: list[list[int]] = []
    for head in heads:
        chain: list[int] = [head]
        cur = head
        seen = {head}
        while cur in succ:
            nxt = succ[cur][0]
            if nxt in seen:
                break
            chain.append(nxt)
            seen.add(nxt)
            cur = nxt
        sequences.append(chain)

    def contains_family(chain: list[int]) -> bool:
        if not q.event_types:
            return True
        for eid in chain:
            e = by_id.get(eid)
            if e and football.family_of(e.code) in q.event_types:
                return True
        return False

    kept = [c for c in sequences if contains_family(c)]
    # Flatten to clips (deduped, time-ordered) for playback.
    ids: list[int] = []
    for c in kept:
        for eid in c:
            if eid not in ids and eid in by_id:
                ids.append(eid)
    events = sorted((by_id[i] for i in ids), key=lambda e: e.start_ms)
    pkg.events = [e.id for e in events]
    pkg.clips = [_clip(e, "sequence") for e in events]
    label = (" ending in " + ", ".join(q.event_types)) if q.event_types else ""
    pkg.summary = (
        f"{len(kept)} sequence(s){label}." if kept else "No matching sequences found."
    )
    return pkg


def resolve_query(question: str, q: StructuredQuery, ctx: QueryContext) -> EvidencePackage:
    """Answer a structured query deterministically from real data."""
    warnings: list[str] = []
    matched = [e for e in ctx.events if _matches(e, q)]
    matched.sort(key=lambda e: e.start_ms)
    if q.limit:
        matched = matched[: q.limit]

    metrics: list[Metric] = []
    pkg = EvidencePackage(question=question, query=q, summary="")

    if q.intent == "sequence_lookup":
        return _resolve_sequences(question, q, ctx)

    if q.intent == "metric_comparison" and q.metric == "xg":
        if ctx.shots and ctx.shots.get("team_xg"):
            txg = ctx.shots["team_xg"]
            a, b = float(txg.get("0", 0)), float(txg.get("1", 0))
            metrics.append(Metric(label="xG — Team A", value=round(a, 2), source="cuddy_video_analysis"))
            metrics.append(Metric(label="xG — Team B", value=round(b, 2), source="cuddy_video_analysis"))
            lead = "Team A" if a > b else "Team B" if b > a else "Neither team"
            pkg.summary = f"{lead} created more xG ({round(a,2)} vs {round(b,2)}), by Cuddy's distance/angle model."
        else:
            warnings.append("No shot/xG data — run shot analysis first.")
            pkg.summary = "No xG data available yet."

    elif q.intent == "possession_analysis":
        if ctx.analytics and ctx.analytics.get("possession_pct"):
            pp = ctx.analytics["possession_pct"]
            a, b = float(pp.get("0", 0)), float(pp.get("1", 0))
            metrics.append(Metric(label="Possession — Team A", value=f"{round(a)}%", source="heuristic"))
            metrics.append(Metric(label="Possession — Team B", value=f"{round(b)}%", source="heuristic"))
            pkg.summary = f"Possession {round(a)}% / {round(b)}% (heuristic: nearest-player ball assignment)."
        else:
            warnings.append("No possession data — run analytics first.")
            pkg.summary = "No possession data available yet."

    elif q.intent == "shot_analysis":
        shot_events = matched or [e for e in ctx.events if football.family_of(e.code) == "shot"]
        pkg.clips = [_clip(e, "shot") for e in shot_events][: q.limit]
        pkg.events = [e.id for e in shot_events][: q.limit]
        if ctx.shots:
            metrics.append(Metric(label="Shots", value=len(ctx.shots.get("shots", [])), source="cuddy_video_analysis"))
        pkg.summary = f"{len(pkg.clips)} shot event(s)." if pkg.clips else "No shot events found."

    else:
        # event_count / event_filter / clip_lookup / turnover_analysis / etc.
        pkg.events = [e.id for e in matched]
        if q.wants_clips or q.intent in ("clip_lookup", "turnover_analysis", "event_filter", "sequence_lookup"):
            pkg.clips = [_clip(e, q.intent) for e in matched]
        label = ", ".join(q.event_types) if q.event_types else "matching"
        if matched:
            pkg.summary = f"{len(matched)} {label} event(s)" + (
                f" in {', '.join(z.replace('_', ' ') for z in q.zones)}" if q.zones else ""
            ) + "."
        else:
            pkg.summary = "No matching evidence found."

    pkg.metrics = metrics
    pkg.warnings = warnings
    return pkg
```


## `football-analysis/backend/app/routes/__init__.py`

```python
```


## `football-analysis/backend/app/routes/analysis.py`

```python
"""Video analysis endpoints (Phase 2a).

POST /videos/{id}/analyze   -> start a background detection+tracking job
GET  /jobs/{job_id}         -> poll job status/progress
GET  /videos/{id}/tracks    -> fetch the tracking result (boxes per frame)
GET  /videos/{id}/tracks/exists -> lightweight check
"""

from __future__ import annotations

import json
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlmodel import Session, select

from .. import user_settings
from ..config import settings
from ..cv.analytics import compute_analytics
from ..cv.pitch import autotag_final_third, build_pitch_data, build_player_heatmap
from ..cv.shots import detect_shots
from ..db import get_session
from ..llm import answer_question, explain_evidence, query_clips
from ..models import Category, Event, Video
from ..pipeline import get_run, run_as_dict, start_analysis as start_analysis_pipeline
from ..schemas import AskRequest, CalibrateRequest

router = APIRouter(tags=["analysis"])


def _tracks_path(video_id: int) -> Path:
    return settings.tracks_dir / f"{video_id}.json"


def _pitch_path(video_id: int) -> Path:
    return settings.tracks_dir / f"{video_id}_pitch.json"


def _analytics_path(video_id: int) -> Path:
    return settings.tracks_dir / f"{video_id}_analytics.json"


def _shots_path(video_id: int) -> Path:
    return settings.tracks_dir / f"{video_id}_shots.json"


def _matchdata_path(video_id: int) -> Path:
    return settings.tracks_dir / f"{video_id}_matchdata.json"


def _studio_path(video_id: int) -> Path:
    return settings.tracks_dir / f"{video_id}_studio.json"


def _playerstats_path(video_id: int) -> Path:
    return settings.tracks_dir / f"{video_id}_playerstats.json"


def _assign_path(video_id: int) -> Path:
    return settings.tracks_dir / f"{video_id}_assign.json"


@router.post("/videos/{video_id}/analyze")
def start_analysis(video_id: int, session: Session = Depends(get_session)):
    """Start (or resume) the durable staged pipeline for this video."""
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(404, "Video not found")
    run = start_analysis_pipeline(session, video_id)
    return run_as_dict(run)


@router.get("/jobs/{job_id}")
def job_status(job_id: str, session: Session = Depends(get_session)):
    try:
        run_id = int(job_id)
    except ValueError:
        raise HTTPException(404, "Job not found")
    run = get_run(session, run_id)
    if not run:
        raise HTTPException(404, "Job not found")
    return run_as_dict(run)


@router.get("/videos/{video_id}/tracks/exists")
def tracks_exist(video_id: int):
    return {"exists": _tracks_path(video_id).is_file()}


@router.get("/videos/{video_id}/tracks")
def get_tracks(video_id: int):
    path = _tracks_path(video_id)
    if not path.is_file():
        raise HTTPException(404, "No analysis for this video yet")
    return FileResponse(path, media_type="application/json")


@router.get("/videos/{video_id}/tracks/window")
def get_tracks_window(video_id: int, start_ms: int, end_ms: int):
    """Only the frames within [start_ms, end_ms] plus the track metadata.

    Lets the overlay load a time window near the playhead instead of pulling the
    whole match into browser memory (spec §18). Metadata mirrors /tracks/summary.
    """
    path = _tracks_path(video_id)
    if not path.is_file():
        raise HTTPException(404, "No analysis for this video yet")
    if end_ms < start_ms:
        raise HTTPException(422, "end_ms must be >= start_ms")
    data = json.loads(path.read_text())
    frames = [
        f for f in data.get("frames", []) if start_ms <= f.get("t_ms", -1) <= end_ms
    ]
    meta = {k: v for k, v in data.items() if k != "frames"}
    return meta | {"frames": frames, "window": [start_ms, end_ms], "n_total": len(data.get("frames", []))}


@router.get("/videos/{video_id}/segments")
def get_segments(video_id: int):
    """Triage output: the camera-run segment map (main vs other)."""
    path = settings.tracks_dir / f"{video_id}_segments.json"
    if not path.is_file():
        raise HTTPException(404, "No segmentation for this video yet")
    return json.loads(path.read_text())


# --- Studio: telestration graphics drawn over the video ---


class StudioShape(BaseModel):
    id: str
    type: str
    color: str
    geom: list[list[float]]
    label: str | None = None
    pinnedTrackId: int | None = None
    pinPos: list[float] | None = None


class StudioDoc(BaseModel):
    shapes: list[StudioShape] = []


@router.get("/videos/{video_id}/studio")
def get_studio(video_id: int, session: Session = Depends(get_session)):
    """Return the saved telestration graphics for this video (or an empty set)."""
    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    path = _studio_path(video_id)
    if path.is_file():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except (ValueError, OSError):
            pass
    return {"shapes": []}


@router.put("/videos/{video_id}/studio")
def put_studio(
    video_id: int, payload: StudioDoc, session: Session = Depends(get_session)
):
    """Persist the telestration graphics as a JSON file in the tracks dir."""
    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    data = payload.model_dump(exclude_none=True)
    try:
        settings.ensure_dirs()
        _studio_path(video_id).write_text(json.dumps(data, indent=2), encoding="utf-8")
    except OSError as exc:
        raise HTTPException(500, f"Could not save studio graphics: {exc}") from exc
    return data


@router.get("/videos/{video_id}/tracks/summary")
def tracks_summary(video_id: int):
    """Lightweight summary without the (potentially large) per-frame data."""
    path = _tracks_path(video_id)
    if not path.is_file():
        raise HTTPException(404, "No analysis for this video yet")
    data = json.loads(path.read_text())
    return {k: v for k, v in data.items() if k != "frames"} | {
        "n_frames": len(data.get("frames", []))
    }


# --- Phase 2b: pitch calibration / heatmaps / auto-tagging ---


@router.post("/videos/{video_id}/calibrate")
def calibrate(video_id: int, payload: CalibrateRequest):
    """Compute homography from 4 image points and build heatmaps + distances."""
    tracks_path = _tracks_path(video_id)
    if not tracks_path.is_file():
        raise HTTPException(400, "Analyse the video before calibrating")
    tracks = json.loads(tracks_path.read_text())
    try:
        pitch = build_pitch_data(
            tracks, payload.img_points, payload.length, payload.width
        )
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc
    _pitch_path(video_id).write_text(json.dumps(pitch))
    return pitch


@router.get("/videos/{video_id}/pitch")
def get_pitch(video_id: int):
    path = _pitch_path(video_id)
    if not path.is_file():
        raise HTTPException(404, "No calibration for this video yet")
    return json.loads(path.read_text())


@router.post("/videos/{video_id}/autotag")
def autotag(video_id: int, session: Session = Depends(get_session)):
    """Generate reviewable AI events (ball in a final third) from the pitch data."""
    path = _pitch_path(video_id)
    if not path.is_file():
        raise HTTPException(400, "Calibrate the pitch before auto-tagging")
    pitch = json.loads(path.read_text())
    suggestions = autotag_final_third(pitch)

    created = 0
    for s in suggestions:
        session.add(Event(
            video_id=video_id, category_id=None, label=s["label"],
            start_ms=s["start_ms"], end_ms=s["end_ms"],
            source="ai", confidence=0.5,
        ))
        created += 1
    session.commit()
    return {"created": created}


# --- Phase 3a: possession & passing analytics ---


@router.post("/videos/{video_id}/analytics")
def compute_video_analytics(video_id: int):
    tracks_path = _tracks_path(video_id)
    if not tracks_path.is_file():
        raise HTTPException(400, "Analyse the video before computing analytics")
    tracks = json.loads(tracks_path.read_text())
    result = compute_analytics(tracks)
    _analytics_path(video_id).write_text(json.dumps(result))
    return result


@router.get("/videos/{video_id}/analytics")
def get_video_analytics(video_id: int):
    path = _analytics_path(video_id)
    if not path.is_file():
        raise HTTPException(404, "No analytics for this video yet")
    return json.loads(path.read_text())


@router.post("/videos/{video_id}/tag-turnovers")
def tag_turnovers(
    video_id: int, window_ms: int = 2000, session: Session = Depends(get_session)
):
    path = _analytics_path(video_id)
    if not path.is_file():
        raise HTTPException(400, "Compute analytics before tagging turnovers")
    data = json.loads(path.read_text())
    created = 0
    for ev in data.get("turnover_events", []):
        t = ev["t_ms"]
        label = f"Turnover (Team {'A' if ev['from_team'] == 0 else 'B'} lost ball)"
        session.add(Event(
            video_id=video_id, category_id=None, label=label,
            start_ms=max(0, t - window_ms), end_ms=t + window_ms,
            source="ai", confidence=0.5,
        ))
        created += 1
    session.commit()
    return {"created": created}


# --- Phase 3b: shots & xG ---


@router.post("/videos/{video_id}/shots")
def compute_shots(video_id: int):
    tracks_path = _tracks_path(video_id)
    pitch_path = _pitch_path(video_id)
    if not tracks_path.is_file():
        raise HTTPException(400, "Analyse the video first")
    if not pitch_path.is_file():
        raise HTTPException(400, "Calibrate the pitch before detecting shots")
    tracks = json.loads(tracks_path.read_text())
    pitch = json.loads(pitch_path.read_text())
    result = detect_shots(tracks, pitch)
    _shots_path(video_id).write_text(json.dumps(result))
    return result


@router.get("/videos/{video_id}/shots")
def get_shots(video_id: int):
    path = _shots_path(video_id)
    if not path.is_file():
        raise HTTPException(404, "No shots computed for this video yet")
    return json.loads(path.read_text())


@router.post("/videos/{video_id}/tag-shots")
def tag_shots(
    video_id: int, window_ms: int = 2500, session: Session = Depends(get_session)
):
    path = _shots_path(video_id)
    if not path.is_file():
        raise HTTPException(400, "Detect shots before tagging them")
    data = json.loads(path.read_text())
    created = 0
    for s in data.get("shots", []):
        t = s["t_ms"]
        team = "A" if s["team"] == 0 else "B" if s["team"] == 1 else "?"
        label = f"Shot (Team {team}, xG {s['xg']:.2f})"
        session.add(Event(
            video_id=video_id, category_id=None, label=label,
            start_ms=max(0, t - window_ms), end_ms=t + window_ms,
            source="ai", confidence=round(min(0.99, 0.4 + s["xg"]), 2),
        ))
        created += 1
    session.commit()
    return {"created": created}


# --- Phase 3c: natural-language query (Claude API) ---


def _build_context(video_id: int, session: Session) -> str:
    """Compact JSON of the match's data for grounding the LLM answer."""
    cats = {c.id: c.name for c in session.exec(select(Category)).all()}
    events = session.exec(
        select(Event).where(Event.video_id == video_id).order_by(Event.start_ms)
    ).all()
    ctx: dict = {
        "events": [
            {
                "code": cats.get(e.category_id) or e.label or "Event",
                "start_s": round(e.start_ms / 1000, 1),
                "end_s": round(e.end_ms / 1000, 1),
                "descriptors": e.descriptors,
                "source": e.source,
            }
            for e in events
        ],
        "n_events": len(events),
    }
    ap = _analytics_path(video_id)
    if ap.is_file():
        a = json.loads(ap.read_text())
        ctx["possession_pct"] = a.get("possession_pct")
        ctx["passes"] = a.get("passes")
        ctx["turnovers"] = a.get("turnovers")
    pp = _pitch_path(video_id)
    if pp.is_file():
        ctx["team_distance_m"] = json.loads(pp.read_text()).get("team_distance_m")
    sp = _shots_path(video_id)
    if sp.is_file():
        s = json.loads(sp.read_text())
        ctx["team_xg"] = s.get("team_xg")
        ctx["team_shots"] = s.get("team_shots")
    ctx["teams"] = {"0": "Team A", "1": "Team B"}
    return json.dumps(ctx)


@router.post("/videos/{video_id}/ask")
def ask(video_id: int, payload: AskRequest, session: Session = Depends(get_session)):
    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    if not user_settings.has_llm_key():
        raise HTTPException(
            400,
            "No AI provider key configured. Add a free Groq key in Settings to use AI chat.",
        )
    context = _build_context(video_id, session)
    try:
        answer = answer_question(payload.question, context)
    except Exception as exc:  # noqa: BLE001 - surface the LLM error to the client
        raise HTTPException(502, f"LLM request failed: {type(exc).__name__}: {exc}") from exc
    return {"answer": answer, "question": payload.question}


# --- Phase 5: clip-returning natural-language query ---


@router.post("/videos/{video_id}/query")
def query_video(video_id: int, payload: AskRequest, session: Session = Depends(get_session)):
    """Return a playable reel (event clips) + a one-line grounded summary."""
    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    if not user_settings.has_llm_key():
        raise HTTPException(
            400,
            "No AI provider key configured. Add a free Groq key in Settings to use AI chat.",
        )
    cats = {c.id: c.name for c in session.exec(select(Category)).all() if c.id}
    events = session.exec(
        select(Event).where(Event.video_id == video_id).order_by(Event.start_ms)
    ).all()

    def code_of(e: Event) -> str:
        return (cats.get(e.category_id) if e.category_id else None) or e.label or "Event"

    ev_list = [
        {
            "id": e.id, "code": code_of(e),
            "start_s": round(e.start_ms / 1000, 1), "end_s": round(e.end_ms / 1000, 1),
            "source": e.source, "descriptors": e.descriptors,
        }
        for e in events
    ]
    try:
        result = query_clips(payload.question, json.dumps(ev_list))
    except Exception as exc:  # noqa: BLE001 - surface the LLM error
        raise HTTPException(502, f"LLM request failed: {type(exc).__name__}: {exc}") from exc

    by_id = {e.id: e for e in events}
    clips = []
    for c in result.get("clips", []):
        ev = by_id.get(c.get("event_id"))
        if ev:
            clips.append({
                "event_id": ev.id, "start_ms": ev.start_ms, "end_ms": ev.end_ms,
                "label": code_of(ev), "reason": str(c.get("reason", "")),
            })
    return {"summary": result.get("summary", ""), "clips": clips, "question": payload.question}


# --- Structured, evidence-grounded query (planner -> deterministic -> LLM) ---

# Cache deterministic query results keyed by (video, question, data signature).
# When the underlying events/analytics change, the signature changes and the old
# entry is bypassed. Caches structured evidence (incl. any explanation), never
# provider prose as a source of truth (spec §45). Bounded, in-process.
import hashlib as _hashlib
from collections import OrderedDict as _OrderedDict

_QUERY_CACHE: "_OrderedDict[str, dict]" = _OrderedDict()
_QUERY_CACHE_MAX = 128


def _data_signature(lite, relations, ap, sp) -> str:
    parts = [
        (e.id, e.start_ms, e.end_ms, e.source, e.reviewed, e.code) for e in lite
    ]
    mt = []
    for p in (ap, sp):
        try:
            mt.append(p.stat().st_mtime_ns if p.is_file() else 0)
        except OSError:
            mt.append(0)
    blob = json.dumps([parts, sorted(relations), mt], default=str, sort_keys=True)
    return _hashlib.sha256(blob.encode()).hexdigest()[:16]


@router.post("/videos/{video_id}/investigate")
def investigate(
    video_id: int, payload: AskRequest, session: Session = Depends(get_session)
):
    """Answer a question with deterministic evidence + clips.

    The clips and metrics come from real coded events / computed analytics via
    the query engine — never from the LLM. The LLM (if a key is configured) only
    adds a short explanation. Works fully offline without an AI key.
    """
    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")

    from ..query import EventLite, QueryContext, plan_query, resolve_query

    cats = {c.id: c.name for c in session.exec(select(Category)).all() if c.id}
    events = session.exec(
        select(Event).where(Event.video_id == video_id).order_by(Event.start_ms)
    ).all()

    def code_of(e: Event) -> str:
        return (cats.get(e.category_id) if e.category_id else None) or e.label or "Event"

    lite = [
        EventLite(
            id=e.id,
            code=code_of(e),
            start_ms=e.start_ms,
            end_ms=e.end_ms,
            source=e.source,
            reviewed=e.reviewed,
            descriptors=list(e.descriptors or []),
        )
        for e in events
    ]

    analytics = None
    ap = _analytics_path(video_id)
    if ap.is_file():
        try:
            analytics = json.loads(ap.read_text())
        except (ValueError, OSError):
            analytics = None
    shots = None
    sp = _shots_path(video_id)
    if sp.is_file():
        try:
            shots = json.loads(sp.read_text())
        except (ValueError, OSError):
            shots = None

    from ..models import EventRelation

    relations = [
        (r.from_event_id, r.to_event_id)
        for r in session.exec(select(EventRelation)).all()
        if r.from_event_id in {e.id for e in events}
    ]

    # Cache lookup: same question over the same data returns instantly and skips
    # the provider call.
    sig = _data_signature(lite, relations, ap, sp)
    key = f"{video_id}|{payload.question.strip().lower()}|{sig}"
    if key in _QUERY_CACHE:
        _QUERY_CACHE.move_to_end(key)
        return {**_QUERY_CACHE[key], "cached": True}

    query = plan_query(payload.question)
    pkg = resolve_query(
        payload.question, query, QueryContext(lite, analytics, shots, relations)
    )

    result = pkg.model_dump()
    # Optional prose over the evidence — additive, never the source of numbers.
    explanation = None
    if user_settings.has_llm_key():
        try:
            explanation = explain_evidence(
                payload.question, json.dumps(result, default=str)
            )
        except Exception as exc:  # noqa: BLE001 - explanation is best-effort
            pkg.warnings.append(f"Explanation unavailable: {type(exc).__name__}")
            result["warnings"] = pkg.warnings
    result["explanation"] = explanation
    result["cached"] = False

    _QUERY_CACHE[key] = result
    _QUERY_CACHE.move_to_end(key)
    while len(_QUERY_CACHE) > _QUERY_CACHE_MAX:
        _QUERY_CACHE.popitem(last=False)
    return result


# --- Real match data from API-Football (score, formations, lineups, stats) ---


@router.get("/videos/{video_id}/match-data")
def get_match_data(video_id: int, session: Session = Depends(get_session)):
    """Return previously-fetched real match data, or null if none saved."""
    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    path = _matchdata_path(video_id)
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except (ValueError, OSError):
            pass
    return None


class MatchSearchRequest(BaseModel):
    query: str


class MatchDataRequest(BaseModel):
    # Either a free-text description, or a precise fixture id from the browser.
    question: str = ""
    fixture_id: int | None = None


@router.post("/videos/{video_id}/match-search")
def search_matches(
    video_id: int, payload: MatchSearchRequest, session: Session = Depends(get_session)
):
    """Return candidate fixtures for a description so the user picks the exact one."""
    from ..providers import apifootball

    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    query = payload.query.strip()
    if not query:
        raise HTTPException(400, "Enter a team or 'Home vs Away' to search.")
    try:
        return apifootball.search_fixtures(query)
    except apifootball.ProviderError as exc:
        raise HTTPException(400, str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(502, f"Fixture search failed: {type(exc).__name__}: {exc}") from exc


@router.post("/videos/{video_id}/match-data")
def fetch_match_data(
    video_id: int, payload: MatchDataRequest, session: Session = Depends(get_session)
):
    """Load real match data (lineups, formations, stats, events) from
    API-Football and persist it — by exact fixture id, or from a description."""
    from ..providers import apifootball

    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    try:
        if payload.fixture_id is not None:
            data = apifootball.fetch_match_by_id(payload.fixture_id)
        else:
            description = payload.question.strip()
            if not description:
                raise HTTPException(400, "Provide a match description or a fixture id.")
            data = apifootball.fetch_match(description)
    except apifootball.ProviderError as exc:
        raise HTTPException(400, str(exc)) from exc
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001 - surface unexpected provider errors
        raise HTTPException(502, f"Match-data lookup failed: {type(exc).__name__}: {exc}") from exc
    try:
        _matchdata_path(video_id).write_text(json.dumps(data, indent=2), encoding="utf-8")
    except OSError:
        pass
    return data


# --- Per-player statistics (API-Football, real named players) ---


@router.get("/videos/{video_id}/player-stats")
def get_player_stats(video_id: int, session: Session = Depends(get_session)):
    """Return cached per-player stats for this video, or null if none saved."""
    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    path = _playerstats_path(video_id)
    if path.is_file():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except (ValueError, OSError):
            pass
    return None


@router.post("/videos/{video_id}/player-stats")
def fetch_player_stats(video_id: int, session: Session = Depends(get_session)):
    """Fetch per-player stats for the fixture already loaded on this video.

    Uses the fixture id from the saved match data, so the user loads a fixture
    first (via the match browser) and this pulls the named player stat lines.
    """
    from ..providers import apifootball

    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    md_path = _matchdata_path(video_id)
    if not md_path.is_file():
        raise HTTPException(400, "Load a match fixture first, then fetch player stats.")
    try:
        fixture_id = json.loads(md_path.read_text(encoding="utf-8")).get("fixture_id")
    except (ValueError, OSError):
        fixture_id = None
    if not fixture_id:
        raise HTTPException(400, "The loaded match has no fixture id to look up.")
    try:
        data = apifootball.fetch_player_stats(int(fixture_id))
    except apifootball.ProviderError as exc:
        raise HTTPException(400, str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(502, f"Player-stats lookup failed: {type(exc).__name__}: {exc}") from exc
    try:
        _playerstats_path(video_id).write_text(json.dumps(data, indent=2), encoding="utf-8")
    except OSError:
        pass
    return data


# --- Per-player heatmap (from CV tracks) + player↔track assignments ---


@router.get("/videos/{video_id}/player-heatmap")
def player_heatmap(video_id: int, track_id: int, session: Session = Depends(get_session)):
    """Heatmap for a single tracked player, in pitch space if the video is
    calibrated, else normalized image space (approximate)."""
    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    tpath = _tracks_path(video_id)
    if not tpath.is_file():
        raise HTTPException(400, "Analyse the video first to produce tracks.")
    tracks = json.loads(tpath.read_text(encoding="utf-8"))
    img_pts = None
    ppath = _pitch_path(video_id)
    if ppath.is_file():
        try:
            img_pts = json.loads(ppath.read_text(encoding="utf-8")).get("img_points")
        except (ValueError, OSError):
            img_pts = None
    return build_player_heatmap(tracks, track_id, img_pts)


class Assignments(BaseModel):
    # player full name -> CV track id
    map: dict[str, int] = {}


@router.get("/videos/{video_id}/assignments")
def get_assignments(video_id: int, session: Session = Depends(get_session)):
    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    path = _assign_path(video_id)
    if path.is_file():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except (ValueError, OSError):
            pass
    return {"map": {}}


@router.put("/videos/{video_id}/assignments")
def put_assignments(
    video_id: int, payload: Assignments, session: Session = Depends(get_session)
):
    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    data = payload.model_dump()
    try:
        settings.ensure_dirs()
        _assign_path(video_id).write_text(json.dumps(data, indent=2), encoding="utf-8")
    except OSError as exc:
        raise HTTPException(500, f"Could not save assignments: {exc}") from exc
    return data


# --- Phase 1: validation harness (score AI events vs the manual reference) ---


@router.get("/videos/{video_id}/validation")
def validate_video(video_id: int, session: Session = Depends(get_session)):
    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    from validation.service import build_validation, write_report  # sibling package

    result = build_validation(video_id, session)
    try:
        write_report(result)
    except Exception:  # noqa: BLE001 - report persistence is best-effort
        pass
    return result
```


## `football-analysis/backend/app/routes/categories.py`

```python
"""Category (coding button) CRUD."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models import Category
from ..schemas import CategoryCreate

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[Category])
def list_categories(project_id: int, session: Session = Depends(get_session)):
    stmt = (
        select(Category)
        .where(Category.project_id == project_id)
        .order_by(Category.sort_order, Category.id)
    )
    return session.exec(stmt).all()


@router.post("", response_model=Category, status_code=201)
def create_category(payload: CategoryCreate, session: Session = Depends(get_session)):
    category = Category(**payload.model_dump())
    session.add(category)
    session.commit()
    session.refresh(category)
    return category


@router.delete("/{category_id}", status_code=204)
def delete_category(category_id: int, session: Session = Depends(get_session)):
    category = session.get(Category, category_id)
    if not category:
        raise HTTPException(404, "Category not found")
    session.delete(category)
    session.commit()
```


## `football-analysis/backend/app/routes/descriptors.py`

```python
"""Descriptor group + descriptor CRUD.

Descriptors are Nacsport-style labels grouped into sets (Outcome, Zone, …) that
an analyst attaches to events. The group list is returned with its descriptors
nested for easy rendering.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models import Descriptor, DescriptorGroup
from ..schemas import (
    DescriptorCreate,
    DescriptorGroupCreate,
    DescriptorGroupRead,
    DescriptorRead,
)

router = APIRouter(tags=["descriptors"])


def _serialize(group: DescriptorGroup, descriptors: list[Descriptor]) -> DescriptorGroupRead:
    return DescriptorGroupRead(
        id=group.id,
        project_id=group.project_id,
        name=group.name,
        sort_order=group.sort_order,
        descriptors=[
            DescriptorRead(
                id=d.id, group_id=d.group_id, label=d.label, color=d.color,
                sort_order=d.sort_order,
            )
            for d in sorted(descriptors, key=lambda d: (d.sort_order, d.id or 0))
        ],
    )


@router.get("/descriptor-groups", response_model=list[DescriptorGroupRead])
def list_groups(project_id: int, session: Session = Depends(get_session)):
    groups = session.exec(
        select(DescriptorGroup)
        .where(DescriptorGroup.project_id == project_id)
        .order_by(DescriptorGroup.sort_order, DescriptorGroup.id)
    ).all()
    out = []
    for g in groups:
        descriptors = session.exec(
            select(Descriptor).where(Descriptor.group_id == g.id)
        ).all()
        out.append(_serialize(g, descriptors))
    return out


@router.post("/descriptor-groups", response_model=DescriptorGroupRead, status_code=201)
def create_group(payload: DescriptorGroupCreate, session: Session = Depends(get_session)):
    group = DescriptorGroup(**payload.model_dump())
    session.add(group)
    session.commit()
    session.refresh(group)
    return _serialize(group, [])


@router.delete("/descriptor-groups/{group_id}", status_code=204)
def delete_group(group_id: int, session: Session = Depends(get_session)):
    group = session.get(DescriptorGroup, group_id)
    if not group:
        raise HTTPException(404, "Group not found")
    # remove child descriptors first
    for d in session.exec(select(Descriptor).where(Descriptor.group_id == group_id)).all():
        session.delete(d)
    session.delete(group)
    session.commit()


@router.post("/descriptors", response_model=DescriptorRead, status_code=201)
def create_descriptor(payload: DescriptorCreate, session: Session = Depends(get_session)):
    if not session.get(DescriptorGroup, payload.group_id):
        raise HTTPException(400, "Group not found")
    descriptor = Descriptor(**payload.model_dump())
    session.add(descriptor)
    session.commit()
    session.refresh(descriptor)
    return DescriptorRead(
        id=descriptor.id, group_id=descriptor.group_id, label=descriptor.label,
        color=descriptor.color, sort_order=descriptor.sort_order,
    )


@router.delete("/descriptors/{descriptor_id}", status_code=204)
def delete_descriptor(descriptor_id: int, session: Session = Depends(get_session)):
    descriptor = session.get(Descriptor, descriptor_id)
    if not descriptor:
        raise HTTPException(404, "Descriptor not found")
    session.delete(descriptor)
    session.commit()
```


## `football-analysis/backend/app/routes/events.py`

```python
"""Event (timeline tag) CRUD + provenance and review actions.

Manual and AI events share this endpoint set — one canonical Event model — so
filtering by `source` is how the AI-suggested tags are reviewed separately.

Edits append an immutable EventRevision (before/after values) so an AI
suggestion is never silently overwritten; accept/reject drive the review
workflow; EventRelation links events into sequences.
"""

from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models import Event, EventRelation, EventRevision
from ..schemas import EventCreate, EventRelationCreate, EventUpdate

router = APIRouter(prefix="/events", tags=["events"])

# Event fields whose changes are worth recording in the provenance trail.
_TRACKED_FIELDS = (
    "category_id",
    "label",
    "start_ms",
    "end_ms",
    "notes",
    "descriptors",
    "reviewed",
)


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _record_revision(
    session: Session,
    event: Event,
    changes: dict,
    *,
    actor_type: str = "manual",
    reason: str = "",
) -> None:
    """Append a revision capturing only the fields that actually changed.

    Call BEFORE mutating `event`, passing the incoming changes; no-op writes
    (same value) are skipped so the history stays meaningful.
    """
    previous: dict = {}
    new: dict = {}
    for key, value in changes.items():
        if key not in _TRACKED_FIELDS:
            continue
        current = getattr(event, key, None)
        if current != value:
            previous[key] = current
            new[key] = value
    if not new:
        return
    session.add(
        EventRevision(
            event_id=event.id,
            previous_values=previous,
            new_values=new,
            actor_type=actor_type,
            reason=reason,
        )
    )


@router.get("", response_model=list[Event])
def list_events(
    video_id: int,
    source: str | None = None,
    session: Session = Depends(get_session),
):
    stmt = select(Event).where(Event.video_id == video_id)
    if source:
        stmt = stmt.where(Event.source == source)
    return session.exec(stmt.order_by(Event.start_ms)).all()


@router.post("", response_model=Event, status_code=201)
def create_event(payload: EventCreate, session: Session = Depends(get_session)):
    event = Event(**payload.model_dump())
    session.add(event)
    session.commit()
    session.refresh(event)
    return event


@router.patch("/{event_id}", response_model=Event)
def update_event(
    event_id: int, payload: EventUpdate, session: Session = Depends(get_session)
):
    event = session.get(Event, event_id)
    if not event:
        raise HTTPException(404, "Event not found")
    changes = payload.model_dump(exclude_none=True)
    _record_revision(session, event, changes, reason="edit")
    for key, value in changes.items():
        setattr(event, key, value)
    event.updated_at = _utcnow()
    session.add(event)
    session.commit()
    session.refresh(event)
    return event


@router.post("/{event_id}/accept", response_model=Event)
def accept_event(event_id: int, session: Session = Depends(get_session)):
    """Mark an AI suggestion as reviewed/accepted (keeps it on the timeline)."""
    event = session.get(Event, event_id)
    if not event:
        raise HTTPException(404, "Event not found")
    _record_revision(
        session, event, {"reviewed": True}, actor_type="manual", reason="accept"
    )
    event.reviewed = True
    event.updated_at = _utcnow()
    session.add(event)
    session.commit()
    session.refresh(event)
    return event


@router.post("/{event_id}/reject", status_code=204)
def reject_event(event_id: int, session: Session = Depends(get_session)):
    """Reject a suggestion: removes the event (and its revision trail) from the
    timeline. The analyst has judged it wrong."""
    event = session.get(Event, event_id)
    if not event:
        raise HTTPException(404, "Event not found")
    session.delete(event)
    session.commit()


@router.get("/{event_id}/revisions", response_model=list[EventRevision])
def list_revisions(event_id: int, session: Session = Depends(get_session)):
    """Provenance trail for an event, newest first."""
    stmt = (
        select(EventRevision)
        .where(EventRevision.event_id == event_id)
        .order_by(EventRevision.created_at.desc())
    )
    return session.exec(stmt).all()


@router.delete("/{event_id}", status_code=204)
def delete_event(event_id: int, session: Session = Depends(get_session)):
    event = session.get(Event, event_id)
    if not event:
        raise HTTPException(404, "Event not found")
    session.delete(event)
    session.commit()


# --- Relations (event sequences) ---


@router.get("/{event_id}/relations", response_model=list[EventRelation])
def list_relations(event_id: int, session: Session = Depends(get_session)):
    stmt = select(EventRelation).where(
        (EventRelation.from_event_id == event_id)
        | (EventRelation.to_event_id == event_id)
    )
    return session.exec(stmt).all()


@router.post("/relations", response_model=EventRelation, status_code=201)
def create_relation(
    payload: EventRelationCreate, session: Session = Depends(get_session)
):
    for eid in (payload.from_event_id, payload.to_event_id):
        if not session.get(Event, eid):
            raise HTTPException(404, f"Event {eid} not found")
    relation = EventRelation(**payload.model_dump())
    session.add(relation)
    session.commit()
    session.refresh(relation)
    return relation


@router.delete("/relations/{relation_id}", status_code=204)
def delete_relation(relation_id: int, session: Session = Depends(get_session)):
    relation = session.get(EventRelation, relation_id)
    if not relation:
        raise HTTPException(404, "Relation not found")
    session.delete(relation)
    session.commit()
```


## `football-analysis/backend/app/routes/export.py`

```python
"""Export a video's events.

Two formats:
  - SportsCode / Nacsport-compatible XML (ALL_INSTANCES), the lingua franca of
    performance-analysis tools, so work here can round-trip with the industry.
  - CSV for spreadsheets / quick analysis.
"""

from __future__ import annotations

import csv
import io
from xml.etree.ElementTree import Element, SubElement, tostring

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlmodel import Session, select

from ..db import get_session
from ..models import Category, Event, Video
from ..schemas import SelectionExport

router = APIRouter(prefix="/export", tags=["export"])


def _load(
    video_id: int, session: Session, event_ids: list[int] | None = None
) -> tuple[Video, list[Event], dict[int, Category]]:
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(404, "Video not found")
    stmt = select(Event).where(Event.video_id == video_id)
    if event_ids is not None:
        stmt = stmt.where(Event.id.in_(event_ids))  # type: ignore[attr-defined]
    events = session.exec(stmt.order_by(Event.start_ms)).all()
    cats = {c.id: c for c in session.exec(select(Category)).all() if c.id is not None}
    return video, events, cats


def _labelled(parent: Element, group: str, text: str) -> None:
    """A SportsCode/Nacsport <label><group/><text/></label> tag — the standard
    way extra metadata rides along an instance, so provenance round-trips."""
    label = SubElement(parent, "label")
    SubElement(label, "group").text = group
    SubElement(label, "text").text = text


def _build_xml(video: Video, events: list[Event], cats: dict[int, Category]) -> bytes:
    root = Element("file")
    instances = SubElement(root, "ALL_INSTANCES")
    for i, ev in enumerate(events, start=1):
        inst = SubElement(instances, "instance")
        SubElement(inst, "ID").text = str(i)
        SubElement(inst, "start").text = f"{ev.start_ms / 1000:.2f}"
        SubElement(inst, "end").text = f"{ev.end_ms / 1000:.2f}"
        code = cats[ev.category_id].name if ev.category_id in cats else (ev.label or "Event")
        SubElement(inst, "code").text = code
        for descriptor in ev.descriptors:
            label = SubElement(inst, "label")
            SubElement(label, "text").text = descriptor
        # Provenance rides as grouped labels so the origin of each event survives
        # the export (and is honest about being Cuddy-derived, not official).
        _labelled(inst, "source", ev.source)
        if ev.detector:
            _labelled(inst, "detector", ev.detector)
        if ev.confidence is not None:
            _labelled(inst, "confidence", f"{ev.confidence:.3f}")
        _labelled(inst, "reviewed", "true" if ev.reviewed else "false")
    return b'<?xml version="1.0" encoding="UTF-8"?>\n' + tostring(root, encoding="utf-8")


def _build_csv(events: list[Event], cats: dict[int, Category]) -> str:
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(
        ["id", "code", "category", "label", "start_s", "end_s", "duration_s",
         "descriptors", "source", "detector", "confidence", "reviewed", "notes"]
    )
    for ev in events:
        code = cats[ev.category_id].name if ev.category_id in cats else ""
        writer.writerow([
            ev.id, code, code, ev.label,
            f"{ev.start_ms / 1000:.2f}", f"{ev.end_ms / 1000:.2f}",
            f"{(ev.end_ms - ev.start_ms) / 1000:.2f}",
            "; ".join(ev.descriptors), ev.source, ev.detector or "",
            "" if ev.confidence is None else f"{ev.confidence:.3f}",
            "true" if ev.reviewed else "false", ev.notes,
        ])
    return buf.getvalue()


def _xml_response(name: str, data: bytes) -> Response:
    filename = f"{name or 'video'}.xml".replace(" ", "_")
    return Response(
        content=data, media_type="application/xml",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


def _csv_response(name: str, data: str) -> Response:
    filename = f"{name or 'video'}.csv".replace(" ", "_")
    return Response(
        content=data, media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/videos/{video_id}/xml")
def export_xml(video_id: int, session: Session = Depends(get_session)):
    video, events, cats = _load(video_id, session)
    return _xml_response(video.name, _build_xml(video, events, cats))


@router.get("/videos/{video_id}/csv")
def export_csv(video_id: int, session: Session = Depends(get_session)):
    video, events, cats = _load(video_id, session)
    return _csv_response(video.name, _build_csv(events, cats))


@router.post("/selection/xml")
def export_selection_xml(payload: SelectionExport, session: Session = Depends(get_session)):
    """Export a chosen subset of events (a highlight playlist) as XML."""
    video, events, cats = _load(payload.video_id, session, payload.event_ids)
    return _xml_response(f"{video.name}_selection", _build_xml(video, events, cats))


@router.post("/selection/csv")
def export_selection_csv(payload: SelectionExport, session: Session = Depends(get_session)):
    video, events, cats = _load(payload.video_id, session, payload.event_ids)
    return _csv_response(f"{video.name}_selection", _build_csv(events, cats))
```


## `football-analysis/backend/app/routes/findings.py`

```python
"""Findings: analyst observations linked to their supporting evidence.

A Finding references events (by id) plus an optional time range; it never
duplicates event data. This is the lightweight substrate for reporting.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..config import settings
from ..db import get_session
from ..models import Category, Event, Finding, Video
from ..schemas import FindingCreate

router = APIRouter(tags=["findings"])


@router.get("/videos/{video_id}/findings", response_model=list[Finding])
def list_findings(video_id: int, session: Session = Depends(get_session)):
    stmt = (
        select(Finding)
        .where(Finding.video_id == video_id)
        .order_by(Finding.created_at.desc())
    )
    return session.exec(stmt).all()


@router.post("/videos/{video_id}/findings", response_model=Finding, status_code=201)
def create_finding(
    video_id: int, payload: FindingCreate, session: Session = Depends(get_session)
):
    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    if not payload.title.strip():
        raise HTTPException(422, "A finding needs a title")
    finding = Finding(video_id=video_id, **payload.model_dump())
    session.add(finding)
    session.commit()
    session.refresh(finding)
    return finding


@router.delete("/findings/{finding_id}", status_code=204)
def delete_finding(finding_id: int, session: Session = Depends(get_session)):
    finding = session.get(Finding, finding_id)
    if not finding:
        raise HTTPException(404, "Finding not found")
    session.delete(finding)
    session.commit()


def _match_summary(video_id: int) -> dict | None:
    """Compact, validated match facts from the saved API-Football data, if any."""
    path = settings.tracks_dir / f"{video_id}_matchdata.json"
    if not path.exists():
        return None
    try:
        d = json.loads(path.read_text(encoding="utf-8"))
    except (ValueError, OSError):
        return None
    return {
        "competition": d.get("competition"),
        "date": d.get("date"),
        "score": d.get("score"),
        "home": (d.get("home") or {}).get("name"),
        "away": (d.get("away") or {}).get("name"),
        "source": "official_match_data",
    }


@router.get("/videos/{video_id}/report")
def build_report(video_id: int, session: Session = Depends(get_session)):
    """Assemble a structured report payload: match facts + findings with their
    evidence resolved to real event clips. Structured JSON first (spec §56) —
    a publishing engine can render this later."""
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(404, "Video not found")

    cats = {c.id: c.name for c in session.exec(select(Category)).all() if c.id}
    events = {
        e.id: e
        for e in session.exec(select(Event).where(Event.video_id == video_id)).all()
    }

    def code_of(e: Event) -> str:
        return (cats.get(e.category_id) if e.category_id else None) or e.label or "Event"

    findings = session.exec(
        select(Finding)
        .where(Finding.video_id == video_id)
        .order_by(Finding.created_at.desc())
    ).all()

    def clips_for(ids: list[int]) -> list[dict]:
        out = []
        for eid in ids:
            e = events.get(eid)
            if e:
                out.append({
                    "event_id": e.id,
                    "label": code_of(e),
                    "start_ms": e.start_ms,
                    "end_ms": e.end_ms,
                    "source": e.source,
                })
        return out

    return {
        "title": video.name,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "match": _match_summary(video_id),
        "findings": [
            {
                "id": f.id,
                "title": f.title,
                "description": f.description,
                "start_ms": f.start_ms,
                "end_ms": f.end_ms,
                "clips": clips_for(f.event_ids),
            }
            for f in findings
        ],
        "notes": "Cuddy-derived clips reference the analyst's coded events; "
        "CV-derived spatial metrics are approximate, not official data.",
    }
```


## `football-analysis/backend/app/routes/projects.py`

```python
"""Project CRUD."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models import Project
from ..schemas import ProjectCreate

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=list[Project])
def list_projects(session: Session = Depends(get_session)):
    return session.exec(select(Project).order_by(Project.created_at)).all()


@router.post("", response_model=Project, status_code=201)
def create_project(payload: ProjectCreate, session: Session = Depends(get_session)):
    project = Project(name=payload.name, description=payload.description)
    session.add(project)
    session.commit()
    session.refresh(project)
    return project


@router.get("/{project_id}", response_model=Project)
def get_project(project_id: int, session: Session = Depends(get_session)):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(404, "Project not found")
    return project


@router.delete("/{project_id}", status_code=204)
def delete_project(project_id: int, session: Session = Depends(get_session)):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(404, "Project not found")
    session.delete(project)
    session.commit()
```


## `football-analysis/backend/app/routes/settings.py`

```python
"""User settings: the AI provider/key (Groq or Anthropic) and API-Football key.

Keys are never returned to the client — only whether each is configured — so
they are not echoed back into the UI or logs.
"""

from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

from .. import user_settings

router = APIRouter(prefix="/settings", tags=["settings"])


class SettingsStatus(BaseModel):
    anthropic_api_key_set: bool
    groq_api_key_set: bool
    provider: str  # "groq" | "anthropic"
    model: str
    key_source: str  # active provider's key: "env" | "stored" | "none"
    apifootball_key_set: bool


class SettingsUpdate(BaseModel):
    anthropic_api_key: str | None = None
    groq_api_key: str | None = None
    provider: str | None = None
    model: str | None = None
    apifootball_key: str | None = None


def _key_source() -> str:
    """Where the active provider's key comes from."""
    import os

    provider = user_settings.get_provider()
    env_var = "GROQ_API_KEY" if provider == "groq" else "ANTHROPIC_API_KEY"
    stored_field = "groq_api_key" if provider == "groq" else "anthropic_api_key"
    if os.environ.get(env_var):
        return "env"
    if user_settings.load().get(stored_field):
        return "stored"
    return "none"


def _status() -> SettingsStatus:
    return SettingsStatus(
        anthropic_api_key_set=user_settings.has_anthropic_key(),
        groq_api_key_set=user_settings.has_groq_key(),
        provider=user_settings.get_provider(),
        model=user_settings.get_model(),
        key_source=_key_source(),
        apifootball_key_set=user_settings.has_apifootball_key(),
    )


@router.get("", response_model=SettingsStatus)
def get_settings() -> SettingsStatus:
    return _status()


@router.post("", response_model=SettingsStatus)
def update_settings(payload: SettingsUpdate) -> SettingsStatus:
    user_settings.set_values(
        anthropic_api_key=payload.anthropic_api_key,
        groq_api_key=payload.groq_api_key,
        provider=payload.provider,
        model=payload.model,
        apifootball_key=payload.apifootball_key,
    )
    return _status()
```


## `football-analysis/backend/app/routes/templates.py`

```python
"""Coding templates — export a project's category + descriptor setup as portable
JSON, and apply such a template to another project.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models import Category, Descriptor, DescriptorGroup, Project
from ..schemas import (
    CodingTemplate,
    TemplateCategory,
    TemplateDescriptorGroup,
)

router = APIRouter(prefix="/projects/{project_id}", tags=["templates"])


@router.get("/coding-template", response_model=CodingTemplate)
def get_template(project_id: int, session: Session = Depends(get_session)):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(404, "Project not found")

    categories = session.exec(
        select(Category).where(Category.project_id == project_id)
        .order_by(Category.sort_order, Category.id)
    ).all()
    groups = session.exec(
        select(DescriptorGroup).where(DescriptorGroup.project_id == project_id)
        .order_by(DescriptorGroup.sort_order, DescriptorGroup.id)
    ).all()

    tmpl_groups = []
    for g in groups:
        labels = session.exec(
            select(Descriptor).where(Descriptor.group_id == g.id)
            .order_by(Descriptor.sort_order, Descriptor.id)
        ).all()
        tmpl_groups.append(
            TemplateDescriptorGroup(name=g.name, descriptors=[d.label for d in labels])
        )

    return CodingTemplate(
        name=f"{project.name} template",
        categories=[
            TemplateCategory(
                name=c.name, color=c.color, hotkey=c.hotkey,
                lead_ms=c.lead_ms, lag_ms=c.lag_ms,
            )
            for c in categories
        ],
        descriptor_groups=tmpl_groups,
    )


@router.post("/apply-template", status_code=201)
def apply_template(
    project_id: int, template: CodingTemplate, session: Session = Depends(get_session)
):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(404, "Project not found")

    existing_cats = len(
        session.exec(select(Category).where(Category.project_id == project_id)).all()
    )
    for i, c in enumerate(template.categories):
        session.add(
            Category(
                project_id=project_id, name=c.name, color=c.color, hotkey=c.hotkey,
                lead_ms=c.lead_ms, lag_ms=c.lag_ms, sort_order=existing_cats + i,
            )
        )

    existing_groups = len(
        session.exec(
            select(DescriptorGroup).where(DescriptorGroup.project_id == project_id)
        ).all()
    )
    for gi, g in enumerate(template.descriptor_groups):
        group = DescriptorGroup(
            project_id=project_id, name=g.name, sort_order=existing_groups + gi
        )
        session.add(group)
        session.commit()
        session.refresh(group)
        for di, label in enumerate(g.descriptors):
            session.add(Descriptor(group_id=group.id, label=label, sort_order=di))

    session.commit()
    return {"applied": True, "categories": len(template.categories),
            "descriptor_groups": len(template.descriptor_groups)}
```


## `football-analysis/backend/app/routes/videos.py`

```python
"""Video registration and range-capable streaming.

Phase 0 registers a clip by its absolute path (the desktop file picker in the
Tauri shell yields a real path) and streams it back with HTTP range support so
the <video> element can seek smoothly.
"""

from __future__ import annotations

import mimetypes
import re
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import FileResponse, StreamingResponse
from sqlmodel import Session, select

from ..db import get_session
from ..models import Video
from ..schemas import RelinkRequest, VideoCreate, VideoMetaUpdate

router = APIRouter(prefix="/videos", tags=["videos"])

_RANGE_RE = re.compile(r"bytes=(\d+)-(\d*)")
_CHUNK = 1024 * 1024  # 1 MiB


@router.get("", response_model=list[Video])
def list_videos(project_id: int | None = None, session: Session = Depends(get_session)):
    stmt = select(Video)
    if project_id is not None:
        stmt = stmt.where(Video.project_id == project_id)
    return session.exec(stmt.order_by(Video.created_at)).all()


@router.post("", response_model=Video, status_code=201)
def register_video(payload: VideoCreate, session: Session = Depends(get_session)):
    if not Path(payload.path).is_file():
        raise HTTPException(400, f"File not found: {payload.path}")
    video = Video(**payload.model_dump())
    session.add(video)
    session.commit()
    session.refresh(video)
    return video


@router.post("/pick")
def pick_video_file():
    """Open a native OS file-open dialog on the local machine and return the
    chosen path. Lets the browser/dev app import a file by clicking rather than
    pasting a path (the backend runs locally, so it can show a real dialog)."""
    import subprocess
    import sys

    if sys.platform != "win32":
        raise HTTPException(400, "Native file picker is only wired for Windows.")
    ps = (
        "Add-Type -AssemblyName System.Windows.Forms;"
        "$f=New-Object System.Windows.Forms.OpenFileDialog;"
        "$f.Filter='Video files|*.mp4;*.mov;*.mkv;*.avi;*.m4v;*.webm|All files|*.*';"
        "$f.Title='Select a match video';"
        "$f.Multiselect=$false;"
        "if($f.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK){[Console]::Out.Write($f.FileName)}"
    )
    try:
        out = subprocess.run(
            ["powershell", "-NoProfile", "-STA", "-Command", ps],
            capture_output=True,
            text=True,
            timeout=180,
        )
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(500, f"Could not open the file picker: {exc}") from exc
    path = (out.stdout or "").strip()
    return {"path": path or None}


@router.get("/{video_id}", response_model=Video)
def get_video(video_id: int, session: Session = Depends(get_session)):
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(404, "Video not found")
    return video


@router.patch("/{video_id}", response_model=Video)
def update_video_meta(
    video_id: int, payload: VideoMetaUpdate, session: Session = Depends(get_session)
):
    """The frontend reports duration/dimensions once the <video> loads."""
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(404, "Video not found")
    for key, value in payload.model_dump(exclude_none=True).items():
        setattr(video, key, value)
    session.add(video)
    session.commit()
    session.refresh(video)
    return video


@router.get("/{video_id}/status")
def video_status(video_id: int, session: Session = Depends(get_session)):
    """Whether the source file is still present at its recorded path.

    Derived artifacts (tracks, pitch, analytics, shots, segments) are keyed by
    video id, so they stay associated even when the source file moves — only
    playback/analysis need the file, which the relink flow restores.
    """
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(404, "Video not found")
    return {"exists": Path(video.path).is_file(), "path": video.path}


@router.post("/{video_id}/relink", response_model=Video)
def relink_video(
    video_id: int, payload: RelinkRequest, session: Session = Depends(get_session)
):
    """Point the video at a moved/renamed source file without losing its data."""
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(404, "Video not found")
    if not Path(payload.path).is_file():
        raise HTTPException(400, f"File not found: {payload.path}")
    video.path = payload.path
    session.add(video)
    session.commit()
    session.refresh(video)
    return video


@router.delete("/{video_id}", status_code=204)
def delete_video(video_id: int, session: Session = Depends(get_session)):
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(404, "Video not found")
    session.delete(video)
    session.commit()


@router.get("/{video_id}/stream")
def stream_video(video_id: int, request: Request, session: Session = Depends(get_session)):
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(404, "Video not found")
    path = Path(video.path)
    if not path.is_file():
        raise HTTPException(410, "Underlying file is missing")

    file_size = path.stat().st_size
    content_type = mimetypes.guess_type(str(path))[0] or "application/octet-stream"
    range_header = request.headers.get("range")

    # No range -> return the whole file (still advertise range support).
    if not range_header:
        return FileResponse(
            path, media_type=content_type, headers={"Accept-Ranges": "bytes"}
        )

    match = _RANGE_RE.match(range_header)
    if not match:
        raise HTTPException(416, "Invalid range header")
    start = int(match.group(1))
    end = int(match.group(2)) if match.group(2) else file_size - 1
    end = min(end, file_size - 1)
    if start > end:
        raise HTTPException(416, "Range not satisfiable")

    length = end - start + 1

    def iter_file():
        with open(path, "rb") as fh:
            fh.seek(start)
            remaining = length
            while remaining > 0:
                chunk = fh.read(min(_CHUNK, remaining))
                if not chunk:
                    break
                remaining -= len(chunk)
                yield chunk

    headers = {
        "Content-Range": f"bytes {start}-{end}/{file_size}",
        "Accept-Ranges": "bytes",
        "Content-Length": str(length),
        "Content-Type": content_type,
    }
    return StreamingResponse(iter_file(), status_code=206, headers=headers)
```


## `football-analysis/backend/app/schemas.py`

```python
"""Request/response payloads (kept separate from table models)."""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel


class ProjectCreate(BaseModel):
    name: str
    description: str = ""


class VideoCreate(BaseModel):
    project_id: int
    name: str
    path: str
    duration_ms: Optional[int] = None
    fps: Optional[float] = None
    width: Optional[int] = None
    height: Optional[int] = None


class VideoMetaUpdate(BaseModel):
    duration_ms: Optional[int] = None
    fps: Optional[float] = None
    width: Optional[int] = None
    height: Optional[int] = None


class RelinkRequest(BaseModel):
    path: str


class CategoryCreate(BaseModel):
    project_id: int
    name: str
    color: str = "#6EE7D6"
    hotkey: Optional[str] = None
    lead_ms: int = 5000
    lag_ms: int = 3000
    sort_order: int = 0


class EventCreate(BaseModel):
    video_id: int
    category_id: Optional[int] = None
    label: str = ""
    start_ms: int
    end_ms: int
    notes: str = ""
    descriptors: list[str] = []
    source: str = "manual"
    confidence: Optional[float] = None


class DescriptorGroupCreate(BaseModel):
    project_id: int
    name: str
    sort_order: int = 0


class DescriptorCreate(BaseModel):
    group_id: int
    label: str
    color: Optional[str] = None
    sort_order: int = 0


class DescriptorRead(BaseModel):
    id: int
    group_id: int
    label: str
    color: Optional[str] = None
    sort_order: int = 0


class DescriptorGroupRead(BaseModel):
    id: int
    project_id: int
    name: str
    sort_order: int = 0
    descriptors: list[DescriptorRead] = []


# --- Coding templates (portable category + descriptor setup) ---

class TemplateDescriptorGroup(BaseModel):
    name: str
    descriptors: list[str] = []


class TemplateCategory(BaseModel):
    name: str
    color: str = "#6EE7D6"
    hotkey: Optional[str] = None
    lead_ms: int = 5000
    lag_ms: int = 3000


class CodingTemplate(BaseModel):
    name: str = "Coding template"
    categories: list[TemplateCategory] = []
    descriptor_groups: list[TemplateDescriptorGroup] = []


class SelectionExport(BaseModel):
    video_id: int
    event_ids: list[int]


class CalibrateRequest(BaseModel):
    # Four image points in pixel coords, ordered TL, TR, BR, BL.
    img_points: list[list[float]]
    length: float = 105.0
    width: float = 68.0


class AskRequest(BaseModel):
    question: str


class EventUpdate(BaseModel):
    category_id: Optional[int] = None
    label: Optional[str] = None
    start_ms: Optional[int] = None
    end_ms: Optional[int] = None
    notes: Optional[str] = None
    descriptors: Optional[list[str]] = None
    reviewed: Optional[bool] = None


class EventRelationCreate(BaseModel):
    from_event_id: int
    to_event_id: int
    relation_type: str


class FindingCreate(BaseModel):
    title: str
    description: str = ""
    event_ids: list[int] = []
    start_ms: Optional[int] = None
    end_ms: Optional[int] = None
```


## `football-analysis/backend/app/user_settings.py`

```python
"""User-writable app settings (persisted outside the source tree).

Holds runtime configuration the user supplies at runtime — the AI provider and
its API key (Groq by default, Anthropic optional), an optional model, and the
API-Football key — in a small JSON file under the data directory. This lets the
packaged app be configured without environment variables. Matching environment
variables still win, so existing dev workflows keep working.
"""

from __future__ import annotations

import json
import os

from .config import settings

_FILENAME = "settings.json"

# Default AI provider. Groq is free (OpenAI-compatible); Anthropic is optional.
_DEFAULT_PROVIDER = "groq"
_DEFAULT_MODELS = {
    "groq": "openai/gpt-oss-120b",
    "anthropic": "claude-opus-5",
}


def _path():
    return settings.data_dir / _FILENAME


def load() -> dict:
    p = _path()
    if p.exists():
        try:
            data = json.loads(p.read_text(encoding="utf-8"))
            return data if isinstance(data, dict) else {}
        except (ValueError, OSError):
            return {}
    return {}


def save(data: dict) -> None:
    settings.ensure_dirs()
    _path().write_text(json.dumps(data, indent=2), encoding="utf-8")


def get_anthropic_key() -> str | None:
    """The Anthropic key, preferring an explicit environment variable."""
    env = os.environ.get("ANTHROPIC_API_KEY")
    if env:
        return env
    key = load().get("anthropic_api_key")
    return key or None


def get_groq_key() -> str | None:
    """The Groq key (free, OpenAI-compatible), preferring the environment."""
    env = os.environ.get("GROQ_API_KEY")
    if env:
        return env
    key = load().get("groq_api_key")
    return key or None


def get_provider() -> str:
    """Active AI provider: ``"groq"`` (default) or ``"anthropic"``."""
    p = (os.environ.get("FA_LLM_PROVIDER") or load().get("provider") or _DEFAULT_PROVIDER)
    p = str(p).strip().lower()
    return p if p in _DEFAULT_MODELS else _DEFAULT_PROVIDER


def get_model() -> str:
    """Model id for the active provider.

    A model stored under the provider's own key wins; ``FA_LLM_MODEL`` overrides
    both. The legacy ``model`` key applies only to Anthropic so switching to Groq
    never sends a Claude model id to the Groq endpoint.
    """
    env = os.environ.get("FA_LLM_MODEL")
    if env:
        return env
    data = load()
    provider = get_provider()
    if provider == "groq":
        return data.get("groq_model") or _DEFAULT_MODELS["groq"]
    return data.get("model") or _DEFAULT_MODELS["anthropic"]


def get_apifootball_key() -> str | None:
    """API-Football (api-sports.io) key for real match data."""
    env = os.environ.get("APIFOOTBALL_KEY")
    if env:
        return env
    key = load().get("apifootball_key")
    return key or None


def _set_key(data: dict, field: str, value: str | None) -> None:
    if value is None:
        return
    stripped = value.strip()
    if stripped:
        data[field] = stripped
    else:
        data.pop(field, None)


def set_values(
    *,
    anthropic_api_key: str | None = None,
    groq_api_key: str | None = None,
    provider: str | None = None,
    model: str | None = None,
    apifootball_key: str | None = None,
) -> None:
    data = load()
    _set_key(data, "anthropic_api_key", anthropic_api_key)
    _set_key(data, "groq_api_key", groq_api_key)
    if provider is not None:
        p = provider.strip().lower()
        if p in _DEFAULT_MODELS:
            data["provider"] = p
    _set_key(data, "model", model)
    _set_key(data, "apifootball_key", apifootball_key)
    save(data)


def has_anthropic_key() -> bool:
    return bool(get_anthropic_key())


def has_groq_key() -> bool:
    return bool(get_groq_key())


# Backwards-compatible alias (was Anthropic-only).
def has_key() -> bool:
    return has_anthropic_key()


def has_llm_key() -> bool:
    """Whether the active provider has a usable key."""
    return has_groq_key() if get_provider() == "groq" else has_anthropic_key()


def has_apifootball_key() -> bool:
    return bool(get_apifootball_key())
```


## `football-analysis/backend/cuddy-backend.spec`

```python
# PyInstaller spec for the production Cuddy backend (cuddy-backend.exe).
#
# Bundles the full CV/ML stack (torch, ultralytics, opencv, supervision,
# scikit-learn) plus Alembic's migration files and alembic.ini as data, so the
# frozen executable behaves like the dev backend with no separate Python env.
#
# Build (from backend/, with the venv that has the full CV stack active):
#   pyinstaller cuddy-backend.spec --noconfirm
# Output: backend/dist/cuddy-backend.exe
#
# NOTE: PyInstaller resolves relative paths against the CWD it's invoked from,
# not this file's location — always run it from backend/.

import sys

from PyInstaller.utils.hooks import collect_all

block_cipher = None

# Packages whose data/binaries/hidden-imports must be fully collected. Native
# extensions (torch, cv2, sklearn's compiled bits) and packages with dynamic
# imports/plugin discovery (ultralytics, supervision) or package data
# (matplotlib, pandas) are frequent PyInstaller failure points if only
# partially collected.
COLLECT_ALL = [
    "numpy",
    "scipy",
    "pandas",
    "matplotlib",
    "torch",
    "torchvision",
    "ultralytics",
    "cv2",
    "supervision",
    "sklearn",
    # Alembic drives migrations via `from alembic import command` and loads its
    # ddl/operations/script submodules dynamically; a couple of explicit hidden
    # imports miss them, so collect the whole package (submodules + templates).
    "alembic",
]

datas = [
    ("alembic.ini", "."),
    ("alembic", "alembic"),
]
binaries = []
hiddenimports = [
    "app.main",
    "app.user_settings",
    "app.providers.apifootball",
    "app.routes.analysis",
    "app.routes.categories",
    "app.routes.descriptors",
    "app.routes.events",
    "app.routes.export",
    "app.routes.findings",
    "app.routes.projects",
    "app.routes.settings",
    "app.routes.templates",
    "app.routes.videos",
    "app.query",
    "app.football",
    "validation.harness",
    "validation.service",
    "validation.run",
    "uvicorn",
    "uvicorn.loops.auto",
    "uvicorn.protocols.http.auto",
    "uvicorn.protocols.websockets.auto",
    "uvicorn.lifespan.on",
    "anthropic",
    "alembic.command",
    "alembic.config",
    "alembic.runtime.migration",
    "sqlmodel",
    "sqlalchemy.dialects.sqlite",
    "pydantic",
    "pydantic_settings",
]

for pkg in COLLECT_ALL:
    d, b, h = collect_all(pkg)
    datas += d
    binaries += b
    hiddenimports += h

a = Analysis(
    ["sidecar_entry.py"],
    pathex=["."],
    binaries=binaries,
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    cipher=block_cipher,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name="cuddy-backend",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=False,
    console=True,  # keep a console so uvicorn/errors are visible during dev testing
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
```


## `football-analysis/backend/requirements-cv.txt`

```
# Phase 2 CV/ML dependencies. Installed into the same venv as requirements.txt.
#
# torch/torchvision must come from the PyTorch CUDA index, NOT PyPI:
#   python -m pip install torch==2.5.1 torchvision==0.20.1 \
#       --index-url https://download.pytorch.org/whl/cu124
#   python -m pip install -r requirements-cv.txt
#
# (torch is listed here only for reference/reproducibility.)
# torch==2.5.1+cu124
# torchvision==0.20.1+cu124
ultralytics==8.3.40
supervision==0.25.1
opencv-python-headless==4.10.0.84
scikit-learn==1.6.0
lapx==0.5.11
```


## `football-analysis/backend/requirements-dev.txt`

```
# Dev/test-only dependencies (not bundled into the packaged sidecar).
# Install into the backend venv:  .venv/Scripts/python -m pip install -r requirements-dev.txt
pytest>=8
httpx>=0.27
```


## `football-analysis/backend/requirements.txt`

```
# Backend (FastAPI sidecar) — Phase 0/1 dependencies.
# CV/ML deps (torch, ultralytics, opencv, supervision) are added in Phase 2
# to keep the initial install light and fast.
fastapi==0.115.6
uvicorn[standard]==0.34.0
sqlmodel==0.0.22
alembic==1.14.0
pydantic==2.10.4
pydantic-settings==2.7.1
python-multipart==0.0.20
# Natural-language query (Phase 3c) — needs ANTHROPIC_API_KEY at runtime
anthropic==0.69.0
```


## `football-analysis/backend/sidecar_entry.py`

```python
"""PyInstaller entry point for the packaged Cuddy backend (cuddy-backend.exe).

Uses absolute imports (relative imports don't resolve in a frozen __main__).
Sets up file logging first so any startup failure (missing DLL/model, port
conflict, DB or ML init error) is recorded to %LOCALAPPDATA%\\Cuddy\\logs\\ where
the user can find it without a terminal.

Host/port default to 127.0.0.1:8765 and can be overridden with CUDDY_HOST /
CUDDY_PORT (or the FA_HOST / FA_PORT settings the app already reads).
"""

import logging
import os
import sys
import traceback

from app.logging_setup import setup_logging

setup_logging()
log = logging.getLogger("cuddy.entry")


def main() -> int:
    import uvicorn

    from app.config import settings
    from app.main import app

    host = os.getenv("CUDDY_HOST", settings.host)
    port = int(os.getenv("CUDDY_PORT", str(settings.port)))
    log.info("Starting Cuddy backend on http://%s:%s", host, port)
    # log_config=None: keep the handlers setup_logging() installed (which write
    # to backend.log). Uvicorn otherwise re-runs its own dictConfig on start,
    # replacing them with stderr-only handlers, so its startup/port-conflict
    # messages would never reach the log file the user is told to check.
    uvicorn.run(app, host=host, port=port, log_level="info", log_config=None)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except SystemExit:
        raise
    except Exception:  # noqa: BLE001 - record the traceback before exiting
        log.critical("Cuddy backend failed to start:\n%s", traceback.format_exc())
        sys.exit(1)
```


## `football-analysis/backend/tests/conftest.py`

```python
"""Test fixtures.

Point the app at a throwaway data dir BEFORE any app module imports, so the
SQLite engine (created at import time from settings.db_path) uses an isolated
DB and the real user DB under %LOCALAPPDATA%\\Cuddy is never touched.
"""

from __future__ import annotations

import os
import tempfile
from pathlib import Path

# Must run before `app.config`/`app.db` are imported anywhere.
_TMP = Path(tempfile.mkdtemp(prefix="cuddy-test-"))
os.environ["FA_DATA_DIR"] = str(_TMP)

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402


@pytest.fixture()
def client():
    """A TestClient that runs the app lifespan (which calls init_db/migrations)."""
    from app.main import app

    with TestClient(app) as c:
        yield c


@pytest.fixture()
def video(client):
    """A project + video to hang events off of. Returns the video id.

    The video route validates that the path is a real file, so point it at a
    throwaway one.
    """
    fake = _TMP / "match.mp4"
    fake.write_bytes(b"\x00")
    p = client.post("/projects", json={"name": "Test"}).json()
    v = client.post(
        "/videos",
        json={"project_id": p["id"], "name": "match", "path": str(fake)},
    ).json()
    return v["id"]
```


## `football-analysis/backend/tests/test_events_provenance.py`

```python
"""Provenance, review actions, and relations on the unified Event model."""

from __future__ import annotations


def _make_ai_event(client, video_id, **over):
    body = {
        "video_id": video_id,
        "label": "shot",
        "start_ms": 1000,
        "end_ms": 4000,
        "source": "ai",
        "confidence": 0.42,
    }
    body.update(over)
    r = client.post("/events", json=body)
    assert r.status_code == 201, r.text
    return r.json()


def test_edit_records_revision(client, video):
    ev = _make_ai_event(client, video)
    # No history yet.
    assert client.get(f"/events/{ev['id']}/revisions").json() == []

    r = client.patch(f"/events/{ev['id']}", json={"label": "header", "end_ms": 5000})
    assert r.status_code == 200
    assert r.json()["label"] == "header"

    revs = client.get(f"/events/{ev['id']}/revisions").json()
    assert len(revs) == 1
    rev = revs[0]
    assert rev["previous_values"] == {"label": "shot", "end_ms": 4000}
    assert rev["new_values"] == {"label": "header", "end_ms": 5000}
    assert rev["actor_type"] == "manual"
    assert rev["reason"] == "edit"


def test_no_op_edit_records_no_revision(client, video):
    ev = _make_ai_event(client, video)
    client.patch(f"/events/{ev['id']}", json={"label": "shot"})  # same value
    assert client.get(f"/events/{ev['id']}/revisions").json() == []


def test_accept_marks_reviewed_and_keeps_event(client, video):
    ev = _make_ai_event(client, video)
    assert ev["reviewed"] is False
    r = client.post(f"/events/{ev['id']}/accept")
    assert r.status_code == 200
    assert r.json()["reviewed"] is True
    # Event survives and carries an accept revision.
    revs = client.get(f"/events/{ev['id']}/revisions").json()
    assert revs[0]["reason"] == "accept"


def test_reject_removes_event(client, video):
    ev = _make_ai_event(client, video)
    r = client.post(f"/events/{ev['id']}/reject")
    assert r.status_code == 204
    assert client.get("/events", params={"video_id": video}).json() == []


def test_relations_link_events(client, video):
    a = _make_ai_event(client, video, label="recovery", start_ms=0, end_ms=2000)
    b = _make_ai_event(client, video, label="shot", start_ms=8000, end_ms=11000)
    r = client.post(
        "/events/relations",
        json={
            "from_event_id": a["id"],
            "to_event_id": b["id"],
            "relation_type": "same_sequence",
        },
    )
    assert r.status_code == 201
    rels = client.get(f"/events/{a['id']}/relations").json()
    assert len(rels) == 1
    assert rels[0]["relation_type"] == "same_sequence"
    # Visible from the other end too.
    assert len(client.get(f"/events/{b['id']}/relations").json()) == 1


def test_relation_requires_existing_events(client, video):
    a = _make_ai_event(client, video)
    r = client.post(
        "/events/relations",
        json={"from_event_id": a["id"], "to_event_id": 99999, "relation_type": "follows"},
    )
    assert r.status_code == 404
```


## `football-analysis/backend/tests/test_export.py`

```python
"""Export carries event provenance (source/detector/confidence/reviewed)."""

from __future__ import annotations


def _seed(client, video):
    client.post(
        "/events",
        json={
            "video_id": video,
            "label": "Shot",
            "start_ms": 2000,
            "end_ms": 5000,
            "source": "ai",
            "confidence": 0.82,
            "descriptors": ["goal"],
        },
    )
    # mark it reviewed via accept so reviewed=true and detector stays None
    ev = client.get("/events", params={"video_id": video}).json()[0]
    client.post(f"/events/{ev['id']}/accept")
    return ev["id"]


def test_csv_includes_provenance_columns(client, video):
    _seed(client, video)
    r = client.get(f"/export/videos/{video}/csv")
    assert r.status_code == 200
    text = r.text
    header = text.splitlines()[0]
    for col in ("source", "detector", "confidence", "reviewed", "category"):
        assert col in header, header
    row = text.splitlines()[1]
    assert "ai" in row
    assert "0.820" in row
    assert "true" in row  # reviewed after accept


def test_xml_includes_provenance_labels(client, video):
    _seed(client, video)
    r = client.get(f"/export/videos/{video}/xml")
    assert r.status_code == 200
    xml = r.text
    assert "<group>source</group>" in xml
    assert "<text>ai</text>" in xml
    assert "<group>confidence</group>" in xml
    assert "<group>reviewed</group>" in xml
```


## `football-analysis/backend/tests/test_findings.py`

```python
"""Findings CRUD, linked to events by id."""

from __future__ import annotations


def test_create_list_delete_finding(client, video):
    e = client.post(
        "/events",
        json={"video_id": video, "label": "Turnover", "start_ms": 1000, "end_ms": 4000},
    ).json()

    r = client.post(
        f"/videos/{video}/findings",
        json={
            "title": "Left-side turnovers",
            "description": "Repeated losses on the left in the first phase.",
            "event_ids": [e["id"]],
            "start_ms": 0,
            "end_ms": 60000,
        },
    )
    assert r.status_code == 201, r.text
    f = r.json()
    assert f["title"] == "Left-side turnovers"
    assert f["event_ids"] == [e["id"]]

    listed = client.get(f"/videos/{video}/findings").json()
    assert len(listed) == 1

    assert client.delete(f"/findings/{f['id']}").status_code == 204
    assert client.get(f"/videos/{video}/findings").json() == []


def test_finding_requires_title(client, video):
    r = client.post(f"/videos/{video}/findings", json={"title": "   "})
    assert r.status_code == 422


def test_report_assembles_findings_with_clips(client, video):
    e = client.post(
        "/events",
        json={"video_id": video, "label": "Shot", "start_ms": 2000, "end_ms": 5000},
    ).json()
    client.post(
        f"/videos/{video}/findings",
        json={"title": "Chances created", "event_ids": [e["id"]], "start_ms": 2000, "end_ms": 5000},
    )
    r = client.get(f"/videos/{video}/report")
    assert r.status_code == 200
    report = r.json()
    assert report["title"]
    assert report["generated_at"]
    assert len(report["findings"]) == 1
    f = report["findings"][0]
    assert f["title"] == "Chances created"
    assert f["clips"][0]["event_id"] == e["id"]
    assert f["clips"][0]["label"] == "Shot"
    assert f["clips"][0]["start_ms"] == 2000
```


## `football-analysis/backend/tests/test_investigate_route.py`

```python
"""Integration: the /investigate endpoint returns real evidence offline.

No AI key is configured in the test env, so this proves the deterministic path
works without an LLM (spec acceptance F: manual/query workflow with no LLM key).
"""

from __future__ import annotations


def _ai_turnover(client, video_id, start_ms, descriptors):
    return client.post(
        "/events",
        json={
            "video_id": video_id,
            "label": "Turnover",
            "start_ms": start_ms,
            "end_ms": start_ms + 3000,
            "source": "ai",
            "confidence": 0.5,
            "descriptors": descriptors,
        },
    ).json()


def test_investigate_returns_grounded_clips_without_llm(client, video):
    # First half, middle third -> should match.
    a = _ai_turnover(client, video, 10_000, ["middle third"])
    # Second half, final third -> should NOT match a first-half middle-third query.
    _ai_turnover(client, video, 50 * 60_000, ["final third"])

    r = client.post(
        f"/videos/{video}/investigate",
        json={"question": "Show me every turnover in the middle third in the first half"},
    )
    assert r.status_code == 200, r.text
    body = r.json()

    assert body["events"] == [a["id"]]
    assert len(body["clips"]) == 1
    clip = body["clips"][0]
    assert clip["event_id"] == a["id"]
    assert clip["start_ms"] == 10_000
    # Deterministic summary present; no LLM configured so explanation is null.
    assert body["summary"]
    assert body["explanation"] is None
    # The structured query is echoed back for transparency.
    assert body["query"]["period"] == 1
    assert "middle_third" in body["query"]["zones"]


def test_investigate_cache_hit_then_invalidation(client, video):
    _ai_turnover(client, video, 10_000, ["middle third"])
    q = {"question": "Show me turnovers in the middle third"}

    first = client.post(f"/videos/{video}/investigate", json=q).json()
    assert first["cached"] is False
    second = client.post(f"/videos/{video}/investigate", json=q).json()
    assert second["cached"] is True
    assert second["events"] == first["events"]

    # Adding an event changes the data signature -> cache is bypassed.
    _ai_turnover(client, video, 20_000, ["middle third"])
    third = client.post(f"/videos/{video}/investigate", json=q).json()
    assert third["cached"] is False
    assert len(third["events"]) == 2


def test_investigate_no_match_is_honest(client, video):
    r = client.post(
        f"/videos/{video}/investigate",
        json={"question": "Show me every corner"},
    )
    assert r.status_code == 200
    body = r.json()
    assert body["clips"] == []
    assert "No matching evidence" in body["summary"]
```


## `football-analysis/backend/tests/test_query.py`

```python
"""Deterministic query planner + evidence engine (no LLM, no DB)."""

from __future__ import annotations

from app.query import (
    EventLite,
    QueryContext,
    plan_query,
    resolve_query,
)


# --- Planner ---------------------------------------------------------------


def test_plan_turnover_middle_third_first_half():
    q = plan_query("Show me every turnover in the middle third in the first half")
    assert q.intent in ("turnover_analysis", "clip_lookup")
    assert "turnover" in q.event_types
    assert "middle_third" in q.zones
    assert q.period == 1
    assert q.wants_clips is True


def test_plan_xg_comparison():
    q = plan_query("Which team had more xG?")
    assert q.intent == "metric_comparison"
    assert q.metric == "xg"


def test_plan_team_detection():
    assert plan_query("show me our attacks on the right").team == "home"
    assert plan_query("how many shots did the opponent take").team == "away"


def test_plan_possession():
    q = plan_query("What was the possession split?")
    assert q.intent == "possession_analysis"


# --- Engine ----------------------------------------------------------------


def _events():
    return [
        EventLite(1, "Turnover", 10_000, 13_000, descriptors=["middle third"]),
        EventLite(2, "Turnover", 50 * 60_000, 50 * 60_000 + 3000, descriptors=["final third"]),
        EventLite(3, "Shot", 20_000, 23_000),
        EventLite(4, "Pass", 5_000, 6_000, source="ai", reviewed=False),
    ]


def test_engine_turnover_filter_by_zone_and_half():
    q = plan_query("Show me turnovers in the middle third in the first half")
    pkg = resolve_query("q", q, QueryContext(events=_events()))
    assert pkg.events == [1]  # event 2 is final third + second half
    assert len(pkg.clips) == 1
    assert pkg.clips[0].event_id == 1
    assert pkg.clips[0].start_ms == 10_000


def test_engine_no_match_says_so():
    q = plan_query("Show me every corner")
    q.event_types = ["corner"]  # a family with no matching events
    pkg = resolve_query("q", q, QueryContext(events=_events()))
    assert pkg.clips == []
    assert "No matching evidence" in pkg.summary


def test_engine_xg_uses_real_shot_data_not_llm():
    q = plan_query("Which team created more xG?")
    ctx = QueryContext(events=_events(), shots={"team_xg": {"0": 1.4, "1": 0.6}})
    pkg = resolve_query("q", q, ctx)
    assert any(m.label == "xG — Team A" for m in pkg.metrics)
    assert "Team A" in pkg.summary


def test_engine_xg_warns_when_missing():
    q = plan_query("Which team created more xG?")
    pkg = resolve_query("q", q, QueryContext(events=_events()))
    assert pkg.warnings
    assert pkg.metrics == []


def test_plan_sequence_lookup():
    q = plan_query("Show me every sequence ending in a shot")
    assert q.intent == "sequence_lookup"
    assert "shot" in q.event_types


def test_engine_sequence_lookup_filters_by_family():
    events = [
        EventLite(1, "Recovery", 0, 1000),
        EventLite(2, "Pass", 2000, 3000),
        EventLite(3, "Shot", 4000, 5000),
        EventLite(4, "Recovery", 20000, 21000),
        EventLite(5, "Pass", 22000, 23000),  # sequence with no shot
    ]
    relations = [(1, 2), (2, 3), (4, 5)]
    q = plan_query("Show me sequences ending in a shot")
    pkg = resolve_query("q", q, QueryContext(events=events, relations=relations))
    assert pkg.events == [1, 2, 3]  # only the chain containing a shot
    assert "1 sequence" in pkg.summary


def test_engine_sequence_lookup_no_relations():
    q = plan_query("Show me every sequence")
    pkg = resolve_query("q", q, QueryContext(events=[EventLite(1, "Pass", 0, 1000)]))
    assert pkg.clips == []
    assert "No event sequences" in pkg.summary


def test_engine_source_filter():
    q = plan_query("show me ai suggested passes")
    pkg = resolve_query("q", q, QueryContext(events=_events()))
    # only event 4 is source=ai
    assert pkg.events == [4]
```


## `football-analysis/backend/tests/test_tracks_window.py`

```python
"""Windowed track access returns only the frames in range (spec §18)."""

from __future__ import annotations

import json


def _write_tracks(video_id: int):
    from app.config import settings

    settings.ensure_dirs()
    path = settings.tracks_dir / f"{video_id}.json"
    frames = [{"t_ms": t, "dets": []} for t in range(0, 10001, 1000)]  # 0..10s
    path.write_text(json.dumps({
        "video": "x", "src_fps": 25, "stride": 5, "width": 1280, "height": 720,
        "target_fps": 5, "n_tracks": 3, "teams": 2, "frames": frames,
    }))


def test_window_returns_only_frames_in_range(client, video):
    _write_tracks(video)
    r = client.get(f"/videos/{video}/tracks/window", params={"start_ms": 3000, "end_ms": 6000})
    assert r.status_code == 200
    body = r.json()
    ts = [f["t_ms"] for f in body["frames"]]
    assert ts == [3000, 4000, 5000, 6000]
    assert body["n_total"] == 11  # full track has 11 frames
    assert body["window"] == [3000, 6000]
    assert body["n_tracks"] == 3  # metadata preserved
    assert "frames" not in {k for k in body if k == "framez"}  # sanity


def test_window_rejects_inverted_range(client, video):
    _write_tracks(video)
    r = client.get(f"/videos/{video}/tracks/window", params={"start_ms": 6000, "end_ms": 3000})
    assert r.status_code == 422


def test_window_404_without_analysis(client, video):
    r = client.get(f"/videos/{video}/tracks/window", params={"start_ms": 0, "end_ms": 1000})
    assert r.status_code == 404
```


## `football-analysis/backend/validation/__init__.py`

```python
"""Validation harness: score CV/AI output against human-coded ground truth.

The success metric for any CV change is whether it *reduces human correction*,
not whether it looks right. This package scores auto-generated events against a
manual reference and produces a small, comparable report per run.
"""
```


## `football-analysis/backend/validation/harness.py`

```python
"""Scoring functions (pure, DB-agnostic) for the validation harness.

Events are compared as dicts: {"code": str, "start_ms": int, "end_ms": int}.
An auto (predicted) event matches a manual (reference) event when they share a
code and their time intervals overlap by at least ``iou_tol`` (temporal IoU).
Matching is greedy one-to-one, best overlap first.

The headline number is ``corrections_required`` — the estimated human actions to
turn the AI output into the reference: one *reject* per false positive, one *add*
per false negative, one *adjust* per matched pair whose boundaries are off by
more than ``boundary_tol_ms``. Fewer corrections = a better model.
"""

from __future__ import annotations

from typing import Any


def _iou(a: dict, b: dict) -> float:
    start = max(a["start_ms"], b["start_ms"])
    end = min(a["end_ms"], b["end_ms"])
    inter = max(0, end - start)
    union = (a["end_ms"] - a["start_ms"]) + (b["end_ms"] - b["start_ms"]) - inter
    return inter / union if union > 0 else 0.0


def score_events(
    reference: list[dict],
    predicted: list[dict],
    iou_tol: float = 0.3,
    boundary_tol_ms: int = 500,
) -> dict[str, Any]:
    """Precision/recall/boundary error + corrections-required for event detection."""
    ref = list(reference)
    pred = list(predicted)

    candidates: list[tuple[float, int, int]] = []
    for i, r in enumerate(ref):
        for j, p in enumerate(pred):
            if r["code"] == p["code"]:
                v = _iou(r, p)
                if v >= iou_tol:
                    candidates.append((v, i, j))
    candidates.sort(reverse=True)  # best overlap first

    used_ref: set[int] = set()
    used_pred: set[int] = set()
    matched: list[tuple[int, int]] = []
    for _v, i, j in candidates:
        if i in used_ref or j in used_pred:
            continue
        used_ref.add(i)
        used_pred.add(j)
        matched.append((i, j))

    tp = len(matched)
    fp = len(pred) - len(used_pred)
    fn = len(ref) - len(used_ref)
    precision = tp / (tp + fp) if (tp + fp) else 0.0
    recall = tp / (tp + fn) if (tp + fn) else 0.0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) else 0.0

    boundary_errs = [
        (abs(ref[i]["start_ms"] - pred[j]["start_ms"])
         + abs(ref[i]["end_ms"] - pred[j]["end_ms"])) / 2
        for i, j in matched
    ]
    boundary_error_ms = sum(boundary_errs) / len(boundary_errs) if boundary_errs else 0.0
    adjustments = sum(1 for e in boundary_errs if e > boundary_tol_ms)

    return {
        "reference": len(ref),
        "predicted": len(pred),
        "tp": tp,
        "fp": fp,
        "fn": fn,
        "precision": round(precision, 3),
        "recall": round(recall, 3),
        "f1": round(f1, 3),
        "boundary_error_ms": round(boundary_error_ms, 1),
        "boundary_adjustments": adjustments,
        "corrections_required": fp + fn + adjustments,
        "params": {"iou_tol": iou_tol, "boundary_tol_ms": boundary_tol_ms},
    }


def score_xg(shots: list[dict]) -> dict[str, Any] | None:
    """Calibration of xG against known outcomes (Brier score), when outcomes exist.

    shots: [{"xg": float, "goal": bool}]. Returns None if no labeled outcomes.
    """
    labeled = [s for s in shots if "goal" in s]
    if not labeled:
        return None
    n = len(labeled)
    brier = sum((s["xg"] - (1.0 if s["goal"] else 0.0)) ** 2 for s in labeled) / n
    return {
        "n": n,
        "goals": sum(1 for s in labeled if s["goal"]),
        "sum_xg": round(sum(s["xg"] for s in labeled), 2),
        "brier": round(brier, 4),
    }


def format_report(event_scores: dict, xg_scores: dict | None = None) -> str:
    """A compact, comparable text report for a run."""
    e = event_scores
    lines = [
        "== Validation report ==",
        f"events   ref={e['reference']}  pred={e['predicted']}  "
        f"tp={e['tp']} fp={e['fp']} fn={e['fn']}",
        f"quality  precision={e['precision']}  recall={e['recall']}  f1={e['f1']}",
        f"bounds   mean_error={e['boundary_error_ms']}ms  "
        f"adjustments={e['boundary_adjustments']}",
        f"EFFORT   corrections_required={e['corrections_required']}",
    ]
    if xg_scores:
        lines.append(
            f"xG       n={xg_scores['n']} goals={xg_scores['goals']} "
            f"sum_xg={xg_scores['sum_xg']} brier={xg_scores['brier']}"
        )
    return "\n".join(lines)
```


## `football-analysis/backend/validation/run.py`

```python
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
```


## `football-analysis/backend/validation/service.py`

```python
"""Bridge the harness to the app's data: score a video's AI events against its
manually-coded events (the reference), plus xG calibration when shots carry
outcomes.
"""

from __future__ import annotations

import json
from pathlib import Path

from sqlmodel import Session, select

from app.config import settings
from app.models import Category, Event

from .harness import format_report, score_events, score_xg


def _code(ev: Event, cats: dict[int, str]) -> str:
    return (cats.get(ev.category_id) if ev.category_id else None) or ev.label or "Event"


def _shot_outcomes(video_id: int, events: list[Event]) -> list[dict]:
    """Pair detected shots with a labeled goal/no-goal outcome, when the analyst
    has coded a 'Goal' event overlapping the shot. No goals coded -> no labels."""
    shots_path = settings.tracks_dir / f"{video_id}_shots.json"
    if not shots_path.is_file():
        return []
    shots = json.loads(shots_path.read_text()).get("shots", [])
    goals = [
        e for e in events
        if "goal" in (e.label or "").lower() and e.source == "manual"
    ]
    out = []
    for s in shots:
        t = s["t_ms"]
        is_goal = any(g.start_ms - 3000 <= t <= g.end_ms + 3000 for g in goals)
        if goals:  # only label outcomes if the analyst coded goals
            out.append({"xg": s["xg"], "goal": is_goal})
    return out


def build_validation(video_id: int, session: Session) -> dict:
    cats = {c.id: c.name for c in session.exec(select(Category)).all() if c.id}
    events = session.exec(select(Event).where(Event.video_id == video_id)).all()

    ref = [
        {"code": _code(e, cats), "start_ms": e.start_ms, "end_ms": e.end_ms}
        for e in events if e.source == "manual"
    ]
    pred = [
        {"code": _code(e, cats), "start_ms": e.start_ms, "end_ms": e.end_ms}
        for e in events if e.source == "ai"
    ]

    event_scores = score_events(ref, pred)
    xg_scores = score_xg(_shot_outcomes(video_id, events))
    return {
        "video_id": video_id,
        "events": event_scores,
        "xg": xg_scores,
        "report": format_report(event_scores, xg_scores),
    }


def write_report(result: dict) -> Path:
    """Persist a run's report so parameter/model changes can be compared over time."""
    runs_dir = settings.data_dir / "validation"
    runs_dir.mkdir(parents=True, exist_ok=True)
    from datetime import datetime, timezone

    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    path = runs_dir / f"video{result['video_id']}_{stamp}.json"
    path.write_text(json.dumps(result, indent=2))
    return path
```


## `football-analysis/docs/architecture.md`

```markdown
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
```


## `football-analysis/docs/running-on-a-new-machine.md`

```markdown
# Running Cuddy on a new machine

Everything needed to get Cuddy building and running on a fresh computer, in one
place. If you only want to *use* the app (not develop it), skip to
[Just want to use it?](#just-want-to-use-it).

Repo: <https://github.com/saifestabraq-cell/cuddy>
All commands run from `football-analysis/` unless noted.

---

## 1. Prerequisites

| Tool | Version | How to install |
|------|---------|----------------|
| Node / npm | 18+ (dev machine: 24.19 / 11.17) | <https://nodejs.org> |
| Python | **3.12 exactly** — invoked as `py -3.12` | <https://python.org> |
| Rust + Cargo | stable (dev machine: 1.98.1) | `winget install Rustlang.Rustup` |
| C++ Build Tools | Visual Studio 2022 Community (MSVC) | required by Tauri on Windows |
| GPU (optional) | NVIDIA + CUDA | for Phase 2+ CV; otherwise runs CPU-only |

> **Python 3.12 is required.** The ML stack does not ship wheels for 3.13/3.14.
> If your system default is newer, keep 3.12 installed alongside and always use
> `py -3.12`.

---

## 2. Get the code

```bash
git clone https://github.com/saifestabraq-cell/cuddy.git
cd cuddy/football-analysis
```

> **Do not clone into a OneDrive-synced folder.** OneDrive will try to sync
> `node_modules/`, `src-tauri/target/`, and `backend/.venv/`, causing slow
> builds and file-lock errors. Use a plain path like `C:\dev\cuddy`.

---

## 3. Frontend dependencies

```bash
npm install
node node_modules/esbuild/install.js   # npm 11 blocks install scripts by default
```

---

## 4. Python backend environment

```bash
cd backend
py -3.12 -m venv .venv
.venv/Scripts/python -m pip install --upgrade pip
.venv/Scripts/python -m pip install -r requirements.txt
cd ..
```

---

## 5. (Optional) CV / ML stack — Phase 2+

Only needed for detection, tracking, team classification, and heatmaps.
Installed into the **same** backend venv. `torch` must come from the CUDA index:

```bash
cd backend
.venv/Scripts/python -m pip install torch==2.5.1 torchvision==0.20.1 --index-url https://download.pytorch.org/whl/cu124
.venv/Scripts/python -m pip install -r requirements-cv.txt
cd ..
```

- **CPU-only machine:** install `torch` / `torchvision` without the CUDA index
  (`pip install torch torchvision`), then `requirements-cv.txt`.
- YOLO weights (`yolov8n.pt`, ~6 MB) download automatically on first analysis.
- On a 4 GB GPU, analysis runs offline (process-then-review) at ~5 fps sampled,
  using the small `yolov8n` model.

---

## 6. (Optional) AI natural-language query

Set one of these in the backend environment before running. The active provider,
key, and model also come from the in-app settings store.

| Variable | Purpose |
|----------|---------|
| `GROQ_API_KEY` | Default provider (Groq, OpenAI-compatible, free tier) |
| `ANTHROPIC_API_KEY` | Use with `FA_LLM_PROVIDER=anthropic` |
| `FA_LLM_PROVIDER` | `groq` (default) or `anthropic` |
| `FA_LLM_MODEL` | Override the model id |

Without a key, the app runs fine — only the natural-language query is disabled.

---

## 7. Run it

**Browser dev loop (fastest):**

```bash
npm run dev      # Python API + Vite together
```

Open <http://localhost:5173>.

**Desktop app:**

```bash
npm run app      # tauri dev — compiles the Rust shell and opens the window
```

The first `npm run app` compiles Rust dependencies and can take several minutes;
later runs are fast.

**Ports**

| Service | Port |
|---------|------|
| Python sidecar (FastAPI) | 8765 |
| Vite dev server | 5173 |

---

## 8. App data & environment

- App data (SQLite `app.db` + imported `media/`, tracks, logs) lives outside the
  source tree at `%LOCALAPPDATA%\Cuddy\`. Override with the `FA_DATA_DIR`
  environment variable.
- This data is **per-machine** — it does not travel with the git repo. To move a
  project's footage/events to another computer, copy the `%LOCALAPPDATA%\Cuddy\`
  folder across (or set `FA_DATA_DIR` to a shared location).
- Backend logs: `%LOCALAPPDATA%\Cuddy\logs\backend.log`.

---

## Building a distributable installer

To produce the Windows installer (backend frozen to `cuddy-backend.exe` sidecar
→ Tauri installer), from `football-analysis/`:

```bash
npm run build:windows     # full: backend .exe → sidecar → installer
npm run build:backend     # backend sidecar only
```

The packaged sidecar bundles the full CV/ML stack (CPU PyTorch), so the
installed app needs no Python / Node / Rust.

---

## Just want to use it?

If the target machine only needs to *run* Cuddy (not develop it), download the
prebuilt Windows installer — no Python, Node, or Rust required:

<https://github.com/saifestabraq-cell/cuddy/releases/latest>

---

## Reference docs

- [README](../README.md) — stack + quick start
- [docs/setup.md](setup.md) — recorded dev-machine state
- [docs/architecture.md](architecture.md) — how the pipeline is built
```


## `football-analysis/docs/setup.md`

```markdown
# Setup & environment

Recorded state of the development machine and the steps to reproduce it.

## Verified toolchain (2026-09-12)

| Tool | Version | Notes |
|------|---------|-------|
| Node / npm | 24.19.0 / 11.17.0 | ✅ |
| Python | 3.12.9 (via `py -3.12`) | Used for the backend venv. System default is 3.14, which the ML stack does not yet ship wheels for — the project pins 3.12. |
| Rust / Cargo | 1.98.1 (stable) | Installed via `winget install Rustlang.Rustup` |
| C++ Build Tools | Visual Studio Community 2022 | Required by Tauri on Windows |
| GPU | NVIDIA RTX 3050 Ti Laptop, 4 GB | Driver 572.83 |

### GPU note (matters for Phase 2+)

4 GB of VRAM is the tightest constraint. The CV pipeline is therefore scoped to:
- **Lighter YOLO variants** (n/s) and downscaled frames.
- **Offline / batch** processing (process-then-review) rather than smooth
  real-time inference on full-HD video.

This does not affect Phase 0/1 (the manual analysis tool), which is pure
CPU/JS.

## ⚠️ OneDrive caveat

This project currently lives under `OneDrive\Documents`. OneDrive will try to
sync heavy build artifacts (`node_modules/`, `src-tauri/target/`,
`backend/.venv/`), which causes slow builds and occasional file-lock errors.
`.gitignore` excludes them from git but **not** from OneDrive sync.

Recommended fix (optional): move the repo to a non-synced path such as
`C:\dev\football-analysis`, or mark the heavy folders "Free up space" /
add them to OneDrive's excluded folders.

## Reproduce the environment

```powershell
# Python backend
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\python -m pip install --upgrade pip
.\.venv\Scripts\python -m pip install -r requirements.txt

# Frontend
cd ..
npm install
node node_modules/esbuild/install.js   # npm 11 blocks install scripts by default

# Rust is global; verify:
cargo --version
```

## CV / ML dependencies (Phase 2)

Installed into the same backend venv. torch must come from the CUDA index:

```powershell
cd backend
.\.venv\Scripts\python -m pip install torch==2.5.1 torchvision==0.20.1 `
    --index-url https://download.pytorch.org/whl/cu124
.\.venv\Scripts\python -m pip install -r requirements-cv.txt
```

The YOLO weights (`yolov8n.pt`, ~6 MB) download automatically on first analysis.
Tracking results are written to `%LOCALAPPDATA%\Cuddy\tracks\<video_id>.json`.

On the 4 GB GPU, analysis runs **offline** (process-then-review) at a sampled
frame rate (default 5 fps) with the small `yolov8n` model.

## Ports

| Service | Port |
|---------|------|
| Python sidecar (FastAPI) | 8765 |
| Vite dev server | 5173 |

## App data location

The SQLite DB and imported media live outside the source tree:

- Windows: `%LOCALAPPDATA%\Cuddy\` (`app.db`, `media/`)

Override with the `FA_DATA_DIR` environment variable.
```


## `football-analysis/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cuddy</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```


## `football-analysis/package.json`

```json
{
  "name": "football-analysis",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "AI-assisted football match analysis — desktop app (Tauri + React + Python).",
  "scripts": {
    "dev:web": "vite",
    "dev:api": "cd backend && .venv/Scripts/python -m app",
    "dev": "concurrently -n api,web -c cyan,magenta \"npm:dev:api\" \"npm:dev:web\"",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "tauri": "tauri",
    "app": "tauri dev",
    "app:build": "tauri build",
    "build:backend": "powershell -ExecutionPolicy Bypass -File scripts/build-windows.ps1 -BackendOnly",
    "build:windows": "powershell -ExecutionPolicy Bypass -File scripts/build-windows.ps1"
  },
  "dependencies": {
    "@tauri-apps/api": "^2.1.1",
    "@tauri-apps/plugin-dialog": "^2.2.0",
    "@tauri-apps/plugin-shell": "^2.2.0",
    "framer-motion": "^11.15.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zustand": "^5.0.2"
  },
  "devDependencies": {
    "@tauri-apps/cli": "^2.1.0",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "concurrently": "^9.1.2",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.2",
    "vite": "^6.0.5"
  }
}
```


## `football-analysis/postcss.config.js`

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```


## `football-analysis/scripts/build-windows.ps1`

```powershell
#Requires -Version 5.1
<#
.SYNOPSIS
  Production Windows build for Cuddy: freeze the Python backend into
  cuddy-backend.exe, place it as a Tauri sidecar, then build the desktop
  installer.

.DESCRIPTION
  1. Verify Python, Node, and Rust/Cargo are on PATH.
  2. Verify/install the backend's Python dependencies (incl. the full CV/ML
     stack) into backend/.venv-cpu.
  3. Install PyInstaller into that venv if missing.
  4. Build backend/dist/cuddy-backend.exe from backend/cuddy-backend.spec.
  5. Copy it to src-tauri/binaries/cuddy-backend-x86_64-pc-windows-msvc.exe
     (the exact target-triple filename Tauri's externalBin expects).
  6. Build the Tauri application (`npm run app:build`).
  7. Report the resulting installer path.

  Run from the repository's football-analysis/ directory, or anywhere - the
  script resolves paths relative to its own location.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts/build-windows.ps1
#>

[CmdletBinding()]
param(
    # Skip rebuilding cuddy-backend.exe (reuse the existing backend/dist build).
    [switch]$SkipBackend,
    # Stop after building/placing the sidecar; don't run the Tauri build.
    [switch]$BackendOnly
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$root = Split-Path -Parent $PSScriptRoot   # football-analysis/
$backend = Join-Path $root "backend"
$venv = Join-Path $backend ".venv-cpu"
$py = Join-Path $venv "Scripts\python.exe"
$binariesDir = Join-Path $root "src-tauri\binaries"
$targetTriple = "x86_64-pc-windows-msvc"
$sidecarName = "cuddy-backend-$targetTriple.exe"

function Write-Step($msg) {
    Write-Host ""
    Write-Host "==> $msg" -ForegroundColor Cyan
}

function Assert-Command($name, $hint) {
    $cmd = Get-Command $name -ErrorAction SilentlyContinue
    if (-not $cmd) {
        throw "$name not found on PATH. $hint"
    }
    return $cmd.Source
}

# ---- 1. Prerequisites -----------------------------------------------------
Write-Step "Verifying prerequisites"
$nodeCmd = Assert-Command "npm" "Install Node.js (https://nodejs.org)."
Write-Host "  npm  -> $nodeCmd"

$cargoPath = Join-Path $env:USERPROFILE ".cargo\bin\cargo.exe"
if (-not (Test-Path $cargoPath)) {
    $cargoCmd = Get-Command cargo -ErrorAction SilentlyContinue
    if (-not $cargoCmd) { throw "cargo not found. Install Rust (https://rustup.rs)." }
    $cargoPath = $cargoCmd.Source
}
Write-Host "  cargo -> $cargoPath"
$env:PATH = "$(Split-Path $cargoPath);$env:PATH"

if (-not $SkipBackend) {
    $pyLauncher = Get-Command py -ErrorAction SilentlyContinue
    if (-not $pyLauncher) { throw "Python launcher 'py' not found. Install Python 3.12." }
    Write-Host "  py   -> $($pyLauncher.Source)"
}

# ---- 2 & 3. Backend venv + PyInstaller ------------------------------------
if (-not $SkipBackend) {
    Write-Step "Preparing the backend build environment ($venv)"
    if (-not (Test-Path $py)) {
        Write-Host "  Creating venv with Python 3.12..."
        & py -3.12 -m venv $venv
    }
    & $py -m pip install --upgrade pip --quiet
    Write-Host "  Installing CPU PyTorch (this is the slow step on a fresh venv)..."
    & $py -m pip install torch==2.5.1 torchvision==0.20.1 `
        --index-url https://download.pytorch.org/whl/cpu --quiet
    Write-Host "  Installing backend requirements..."
    & $py -m pip install -r (Join-Path $backend "requirements.txt") --quiet
    & $py -m pip install ultralytics==8.3.40 supervision==0.25.1 `
        opencv-python-headless==4.10.0.84 scikit-learn==1.6.0 lapx==0.5.11 --quiet
    & $py -m pip install pyinstaller==6.11.1 --quiet
    if ($LASTEXITCODE -ne 0) { throw "Backend dependency installation failed." }

    # Verify the critical imports actually resolve. --quiet can mask a partial
    # install; a missing package (e.g. alembic) otherwise produces a
    # silently-broken exe whose migrations fall back to create_all at runtime.
    Write-Host "  Verifying backend dependencies import..."
    & $py -c "from alembic import command, config; import torch, cv2, ultralytics, anthropic, sqlmodel, fastapi, uvicorn"
    if ($LASTEXITCODE -ne 0) { throw "Backend dependency verification failed - a required package did not install." }

    # ---- 4. Build cuddy-backend.exe ---------------------------------------
    Write-Step "Building cuddy-backend.exe (PyInstaller - several minutes)"
    Push-Location $backend
    try {
        & $py -m PyInstaller cuddy-backend.spec --noconfirm --clean
        if ($LASTEXITCODE -ne 0) { throw "PyInstaller build failed (see traceback above)." }
    } finally {
        Pop-Location
    }

    $builtExe = Join-Path $backend "dist\cuddy-backend.exe"
    if (-not (Test-Path $builtExe)) { throw "Expected output not found: $builtExe" }
    $sizeMB = [math]::Round((Get-Item $builtExe).Length / 1MB, 1)
    Write-Host "  Built: $builtExe ($sizeMB MB)"

    # ---- 5. Copy into src-tauri/binaries with the target-triple name ------
    Write-Step "Placing the sidecar binary"
    New-Item -ItemType Directory -Force -Path $binariesDir | Out-Null
    $dest = Join-Path $binariesDir $sidecarName
    Copy-Item $builtExe $dest -Force
    Write-Host "  Copied to: $dest"
} else {
    Write-Step "Skipping backend build (-SkipBackend)"
    $dest = Join-Path $binariesDir $sidecarName
    if (-not (Test-Path $dest)) {
        throw "No existing sidecar at $dest - run without -SkipBackend first."
    }
}

if ($BackendOnly) {
    Write-Host ""
    Write-Host "Backend build complete (BackendOnly): $dest" -ForegroundColor Green
    exit 0
}

# ---- 6. Build the Tauri application ---------------------------------------
Write-Step "Building the Tauri application (npm run app:build)"
Push-Location $root
try {
    npm run app:build
    if ($LASTEXITCODE -ne 0) { throw "Tauri build failed (see output above)." }
} finally {
    Pop-Location
}

# ---- 7. Report --------------------------------------------------------------
Write-Step "Locating the installer"
$bundleDir = Join-Path $root "src-tauri\target\release\bundle\nsis"
$installer = Get-ChildItem -Path $bundleDir -Filter "*.exe" -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1

if ($installer) {
    $installerSizeMB = [math]::Round($installer.Length / 1MB, 1)
    Write-Host ""
    Write-Host "Build complete." -ForegroundColor Green
    Write-Host "  Installer: $($installer.FullName) ($installerSizeMB MB)"
} else {
    Write-Warning "Tauri build finished but no installer was found under $bundleDir"
}
```


## `football-analysis/src-tauri/Cargo.toml`

```toml
[package]
name = "football-analysis"
version = "0.1.0"
description = "AI-assisted football match analysis"
edition = "2021"
rust-version = "1.77"

[lib]
name = "app_lib"
crate-type = ["staticlib", "cdylib", "rlib"]

[build-dependencies]
tauri-build = { version = "2", features = [] }

[dependencies]
tauri = { version = "2", features = [] }
tauri-plugin-shell = "2"
tauri-plugin-dialog = "2"
serde = { version = "1", features = ["derive"] }
serde_json = "1"

[profile.release]
panic = "abort"
codegen-units = 1
lto = true
opt-level = "s"
strip = true
```


## `football-analysis/src-tauri/build.rs`

```rust
fn main() {
    tauri_build::build()
}
```


## `football-analysis/src-tauri/capabilities/default.json`

```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "Default capabilities for the main window.",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "dialog:default",
    "shell:allow-open",
    {
      "identifier": "shell:allow-execute",
      "allow": [
        { "name": "binaries/cuddy-backend", "sidecar": true }
      ]
    }
  ]
}
```


## `football-analysis/src-tauri/icons/android/mipmap-anydpi-v26/ic_launcher.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
  <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
  <background android:drawable="@color/ic_launcher_background"/>
</adaptive-icon>```


## `football-analysis/src-tauri/icons/android/values/ic_launcher_background.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
  <color name="ic_launcher_background">#fff</color>
</resources>```


## `football-analysis/src-tauri/src/lib.rs`

```rust
// Tauri application entry.
//
// In development the Python backend is started by the `beforeDevCommand`
// (`npm run dev` runs the API + Vite together), so we do NOT spawn it here.
//
// In a packaged release build, the backend is bundled as an external binary
// (`cuddy-backend`, produced by PyInstaller — see docs/architecture.md) and
// launched on startup as a Tauri sidecar. If it isn't present yet the app
// still opens and simply reports "Engine offline"/"failed to start" until the
// backend is reachable (the frontend's health poll drives that state).
//
// The spawned child is tracked in app state so it can be terminated when the
// window closes — otherwise a packaged app can leave an orphaned
// cuddy-backend.exe running after the user quits Cuddy.

use std::sync::Mutex;
use tauri::Manager;

/// Holds the sidecar's child-process handle so it can be killed on exit.
struct BackendProcess(Mutex<Option<tauri_plugin_shell::process::CommandChild>>);

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .manage(BackendProcess(Mutex::new(None)))
        .setup(|_app| {
            #[cfg(not(debug_assertions))]
            {
                use tauri_plugin_shell::ShellExt;
                match _app.shell().sidecar("cuddy-backend") {
                    Ok(cmd) => match cmd.spawn() {
                        Ok((mut rx, child)) => {
                            let state = _app.state::<BackendProcess>();
                            *state.0.lock().unwrap() = Some(child);
                            // Drain the child's stdout/stderr events. If this
                            // receiver is dropped, nobody empties the OS pipes;
                            // once the ~4KB Windows pipe buffer fills (uvicorn
                            // logs a line per request) the backend blocks on its
                            // next write and the app freezes as "Engine offline".
                            tauri::async_runtime::spawn(async move {
                                while rx.recv().await.is_some() {}
                            });
                        }
                        Err(err) => eprintln!("Failed to spawn Cuddy backend: {err}"),
                    },
                    Err(err) => eprintln!("Cuddy backend sidecar not configured: {err}"),
                }
            }
            Ok(())
        })
        .on_window_event(|window, event| {
            // Terminate the backend child process when the main window closes,
            // so no cuddy-backend.exe is left running after Cuddy quits.
            if let tauri::WindowEvent::CloseRequested { .. } = event {
                let state = window.state::<BackendProcess>();
                let child = state.0.lock().unwrap().take();
                if let Some(child) = child {
                    // PyInstaller's onefile bootloader (the process Tauri spawns)
                    // re-launches itself as a child that actually runs uvicorn.
                    // child.kill() reaps only the bootloader, orphaning the real
                    // backend — so kill the whole process tree by PID first.
                    #[cfg(windows)]
                    {
                        use std::os::windows::process::CommandExt;
                        const CREATE_NO_WINDOW: u32 = 0x0800_0000;
                        let _ = std::process::Command::new("taskkill")
                            .args(["/F", "/T", "/PID", &child.pid().to_string()])
                            .creation_flags(CREATE_NO_WINDOW)
                            .status();
                    }
                    let _ = child.kill();
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running Cuddy");
}
```


## `football-analysis/src-tauri/src/main.rs`

```rust
// Prevents an extra console window on Windows in release builds.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    app_lib::run();
}
```


## `football-analysis/src-tauri/tauri.conf.json`

```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "Cuddy",
  "version": "0.1.0",
  "identifier": "com.cuddy.app",
  "build": {
    "frontendDist": "../dist",
    "devUrl": "http://localhost:5173",
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build"
  },
  "app": {
    "windows": [
      {
        "title": "Cuddy",
        "width": 1320,
        "height": 860,
        "minWidth": 1024,
        "minHeight": 680,
        "resizable": true,
        "backgroundColor": "#0E0F13"
      }
    ],
    "security": {
      "csp": null
    }
  },
  "bundle": {
    "active": true,
    "targets": ["nsis"],
    "externalBin": ["binaries/cuddy-backend"],
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ]
  }
}
```


## `football-analysis/src/App.tsx`

```ts
import { useEffect } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useStore } from "./store";
import TitleBar from "./components/TitleBar";
import Sidebar from "./components/Sidebar";
import Workspace from "./components/Workspace";
import SettingsPanel from "./components/SettingsPanel";

const STAGE_MESSAGE: Record<string, string> = {
  checking: "Starting Cuddy Engine…",
  offline: "Connecting to Analysis Engine…",
};

export default function App() {
  const { checkHealth, loadProjects, health, resetHealthCheck, refreshSettings } =
    useStore();
  const reducedMotion = useStore((s) => s.reducedMotion);

  useEffect(() => {
    // Poll health until online, then load projects. Stops polling once the
    // sidecar is declared "failed" (see checkHealth's attempt budget) so a
    // genuinely dead backend doesn't spin forever; Retry restarts polling.
    let cancelled = false;
    let loaded = false;
    // Load projects + settings the first time health becomes online — whether
    // that's the initial check or a later poll. In the packaged app the sidecar
    // takes 24-60s to start, so the first checkHealth almost always fails; if we
    // only loaded on that first attempt the app would show "Engine ready" with
    // an empty sidebar and no stored key applied.
    const loadOnce = async () => {
      if (loaded || cancelled) return;
      loaded = true;
      await Promise.all([loadProjects(), refreshSettings()]);
    };
    const tick = async () => {
      await checkHealth();
      if (cancelled) return;
      if (useStore.getState().health === "online") await loadOnce();
    };
    tick();
    const interval = setInterval(() => {
      const h = useStore.getState().health;
      if (h !== "online" && h !== "failed") tick();
    }, 1500);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [checkHealth, loadProjects, refreshSettings]);

  const retry = () => {
    resetHealthCheck();
  };

  return (
    <MotionConfig reducedMotion={reducedMotion ? "always" : "user"}>
    <div className="min-h-screen flex flex-col bg-ink-900 text-mist-100">
      <TitleBar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 min-w-0 p-4">
          <AnimatePresence mode="wait">
            {health === "failed" ? (
              <motion.div
                key="failed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-h-[70vh] grid place-items-center"
              >
                <div className="text-center max-w-sm">
                  <div className="text-signal-live text-lg mb-2">
                    Analysis Engine failed to start.
                  </div>
                  <p className="text-mist-300 text-sm leading-relaxed mb-4">
                    The backend didn't come up in time. In development, start it
                    with <code className="text-teal-300">npm run dev:api</code>.
                    In the installed app, check the log file for details.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button className="btn-accent" onClick={retry}>
                      Retry
                    </button>
                    <span
                      className="text-xs text-mist-400"
                      title="%LOCALAPPDATA%\Cuddy\logs\backend.log"
                    >
                      View Logs: %LOCALAPPDATA%\Cuddy\logs\backend.log
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : health !== "online" ? (
              <motion.div
                key="offline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-h-[70vh] grid place-items-center"
              >
                <div className="text-center max-w-sm">
                  <div className="text-mist-200 text-lg mb-2">
                    {STAGE_MESSAGE[health] ?? "Connecting…"}
                  </div>
                  <p className="text-mist-300 text-sm leading-relaxed">
                    In development, start the backend with{" "}
                    <code className="text-teal-300">npm run dev:api</code>.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="workspace"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <Workspace />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      <SettingsPanel />
    </div>
    </MotionConfig>
  );
}
```


## `football-analysis/src/components/AIPanel.tsx`

```ts
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store";
import { api } from "../lib/api";
import type { EvidencePackage } from "../lib/types";
import { fmtClock } from "../lib/time";
import SectionHeader from "./SectionHeader";
import SourceBadge from "./SourceBadge";

type Mode = "ask" | "show";

const SUGGESTIONS: Record<Mode, string[]> = {
  ask: [
    "Which team had more possession?",
    "Which team created more xG?",
    "How many turnovers in the first half?",
  ],
  show: [
    "Show me every turnover in the middle third",
    "Show me all shots",
    "Show me our attacks in the final third",
  ],
};

const PLACEHOLDER: Record<Mode, string> = {
  ask: "e.g. Which team created more xG?",
  show: "e.g. show me every turnover in the second half",
};

/**
 * Unified AI surface. Both "Ask" and "Show me" run the SAME grounded engine
 * (/investigate): deterministic evidence (metrics + real event clips) computed
 * from coded data, with optional LLM prose over it. The model never invents a
 * clip or a metric, and the panel works with no AI key (explanation is just
 * omitted).
 */
export default function AIPanel() {
  const videoId = useStore((s) => s.currentVideoId);
  const aiKeySet = useStore((s) => s.aiKeySet);
  const openSettings = useStore((s) => s.openSettings);
  const requestSeek = useStore((s) => s.requestSeek);
  const selectEvent = useStore((s) => s.selectEvent);
  const setPlaylist = useStore((s) => s.setPlaylist);

  const [mode, setMode] = useState<Mode>("ask");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<EvidencePackage | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  // Monotonic token: a superseded request's result is dropped.
  const reqId = useRef(0);

  const switchMode = (m: Mode) => {
    if (m === mode) return;
    reqId.current += 1;
    setBusy(false);
    setMode(m);
    setResult(null);
    setErr(null);
  };

  const run = async (q: string) => {
    if (!videoId || !q.trim()) return;
    const myId = (reqId.current += 1);
    setBusy(true);
    setErr(null);
    setResult(null);
    try {
      const res = await api.investigate(videoId, q.trim());
      if (reqId.current === myId) setResult(res);
    } catch (e) {
      if (reqId.current === myId)
        setErr(e instanceof Error ? e.message : "Request failed");
    } finally {
      if (reqId.current === myId) setBusy(false);
    }
  };

  const openClip = (eventId: number, startMs: number) => {
    selectEvent(eventId);
    requestSeek(startMs);
  };

  return (
    <div className="panel p-3">
      <SectionHeader
        label="Ask AI"
        className="mb-2"
        right={
          <div className="flex items-center gap-1 rounded-lg bg-ink-900/60 p-0.5">
            <ModeTab label="Ask" active={mode === "ask"} onClick={() => switchMode("ask")} />
            <ModeTab label="Show me" active={mode === "show"} onClick={() => switchMode("show")} />
          </div>
        }
      />

      {!aiKeySet && (
        <button
          onClick={openSettings}
          className="mb-2 w-full text-left card px-3 py-2 text-xs text-mist-300 hover:bg-ink-600 transition-colors flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
          Evidence &amp; clips work without a key. Add a free Groq key in Settings for written answers.
        </button>
      )}

      <div className="flex items-center gap-2">
        <input
          className="input flex-1"
          placeholder={PLACEHOLDER[mode]}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run(question)}
          disabled={busy || !videoId}
        />
        <button
          className="btn-accent"
          disabled={busy || !videoId || !question.trim()}
          onClick={() => run(question)}
        >
          {busy ? "Working…" : mode === "ask" ? "Ask" : "Show me"}
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-2">
        {SUGGESTIONS[mode].map((s) => (
          <button
            key={s}
            className="px-2 py-0.5 rounded-lg text-xs text-mist-300 border border-ink-500/60 hover:bg-ink-700 transition-colors"
            disabled={busy || !videoId}
            onClick={() => {
              setQuestion(s);
              run(s);
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex flex-col gap-2"
        >
          <p className="text-sm text-mist-100 leading-relaxed">{result.summary}</p>

          {result.explanation && (
            <div className="card p-2.5 text-sm text-mist-200 whitespace-pre-wrap leading-relaxed">
              {result.explanation}
            </div>
          )}

          {result.metrics.length > 0 && (
            <div className="flex flex-col gap-1">
              {result.metrics.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between card px-2.5 py-1.5 text-sm"
                >
                  <span className="text-mist-200">{m.label}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-mist-100 tabular-nums">{m.value}</span>
                    <SourceBadge source={m.source} />
                  </span>
                </div>
              ))}
            </div>
          )}

          {result.clips.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase text-mist-400">
                  {result.clips.length} clip{result.clips.length === 1 ? "" : "s"}
                </span>
                <button
                  className="btn h-7 py-0"
                  onClick={() => setPlaylist(result.clips.map((c) => c.event_id))}
                >
                  Play all →
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {result.clips.map((c) => (
                  <button
                    key={c.event_id}
                    onClick={() => openClip(c.event_id, c.start_ms)}
                    className="card px-2.5 py-1.5 text-left hover:bg-ink-600 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-sm text-mist-100">
                      <span className="tabular-nums text-teal-300 text-xs">
                        {fmtClock(c.start_ms)}
                      </span>
                      {c.label}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {result.warnings.length > 0 && (
            <div className="flex flex-col gap-1">
              {result.warnings.map((w, i) => (
                <p key={i} className="text-xs text-amber-300/90 leading-relaxed">
                  ⚠ {w}
                </p>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {err && <p className="text-xs text-signal-live mt-2 leading-relaxed">{err}</p>}
    </div>
  );
}

function ModeTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
        active ? "bg-ink-600 text-mist-100" : "text-mist-400 hover:text-mist-200"
      }`}
    >
      {label}
    </button>
  );
}
```


## `football-analysis/src/components/AddEventPanel.tsx`

```ts
import { useEffect, useState } from "react";
import { useStore } from "../store";
import { fmtClock } from "../lib/time";
import SectionHeader from "./SectionHeader";

interface Props {
  playheadMs: number;
  disabled: boolean;
}

/** Parse "m:ss" or seconds into ms; returns null if unparseable. */
function parseClock(v: string): number | null {
  const t = v.trim();
  if (!t) return null;
  if (t.includes(":")) {
    const [m, s] = t.split(":");
    const mm = parseInt(m, 10);
    const ss = parseFloat(s);
    if (isNaN(mm) || isNaN(ss)) return null;
    return Math.round((mm * 60 + ss) * 1000);
  }
  const secs = parseFloat(t);
  return isNaN(secs) ? null : Math.round(secs * 1000);
}

/**
 * Field-based event entry — replaces the tag-button pad. Enter a time, type,
 * optional category and note; the time defaults to (and can snap to) the
 * current playhead.
 */
export default function AddEventPanel({ playheadMs, disabled }: Props) {
  const categories = useStore((s) => s.categories);
  const addEvent = useStore((s) => s.addEvent);
  const updateEvent = useStore((s) => s.updateEvent);
  const addCategory = useStore((s) => s.addCategory);
  const currentVideoId = useStore((s) => s.currentVideoId);
  const composeSeed = useStore((s) => s.composeSeed);
  const setComposeSeed = useStore((s) => s.setComposeSeed);

  const [time, setTime] = useState(fmtClock(playheadMs));
  const [touchedTime, setTouchedTime] = useState(false);
  const [label, setLabel] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [duration, setDuration] = useState(8);
  const [notes, setNotes] = useState("");
  const [flash, setFlash] = useState(false);

  // Follow the playhead until the user edits the time field themselves.
  useEffect(() => {
    if (!touchedTime) setTime(fmtClock(playheadMs));
  }, [playheadMs, touchedTime]);

  // Prefill from a clicked timeline/list item, then consume the seed.
  useEffect(() => {
    if (!composeSeed) return;
    setTime(fmtClock(composeSeed.ms));
    setTouchedTime(true); // pin the seeded time; don't let the playhead override it
    if (composeSeed.label != null) setLabel(composeSeed.label);
    if (composeSeed.categoryId != null) setCategoryId(composeSeed.categoryId);
    setComposeSeed(null);
  }, [composeSeed, setComposeSeed]);

  const snap = () => {
    setTime(fmtClock(playheadMs));
    setTouchedTime(false);
  };

  const submit = async () => {
    if (!currentVideoId) return;
    const startMs = parseClock(time);
    if (startMs == null) return;
    if (categoryId === "" && !label.trim()) return;
    await addEvent({
      video_id: currentVideoId,
      category_id: categoryId === "" ? null : categoryId,
      label: label.trim() || undefined,
      start_ms: Math.max(0, startMs),
      end_ms: Math.max(0, startMs) + Math.max(1, duration) * 1000,
      source: "manual",
    });
    // notes aren't part of the create payload — set them on the new event.
    const newId = useStore.getState().selectedEventId;
    if (newId && notes.trim()) await updateEvent(newId, { notes: notes.trim() });
    setLabel("");
    setNotes("");
    setFlash(true);
    setTimeout(() => setFlash(false), 700);
  };

  const canAdd =
    !disabled && !!currentVideoId && (categoryId !== "" || !!label.trim());

  return (
    <div className="panel p-4">
      <SectionHeader
        label="Add Event"
        className="mb-3"
        right={flash ? <span className="text-[11px] text-teal-300">Added ✓</span> : undefined}
      />

      <div className="grid grid-cols-2 gap-2.5">
        <Field label="Time">
          <div className="flex gap-1.5">
            <input
              className="input flex-1 tabular-nums"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                setTouchedTime(true);
              }}
              placeholder="0:00"
            />
            <button
              className="btn shrink-0 px-2"
              title="Snap to current playhead"
              onClick={snap}
            >
              Now
            </button>
          </div>
        </Field>

        <Field label="Duration (s)">
          <input
            type="number"
            min={1}
            className="input w-full tabular-nums"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value, 10) || 1)}
          />
        </Field>

        <Field label="Category">
          <select
            className="input w-full"
            value={categoryId}
            onChange={(e) =>
              setCategoryId(e.target.value === "" ? "" : Number(e.target.value))
            }
          >
            <option value="">— none —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Type / label">
          <input
            className="input w-full"
            placeholder="e.g. Shot, Foul"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </Field>

        <div className="col-span-2">
          <Field label="Note">
            <input
              className="input w-full"
              placeholder="optional"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </Field>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <button
          className="text-[11px] text-mist-400 hover:text-teal-300 transition-colors"
          onClick={() => {
            const name = label.trim();
            if (name) {
              addCategory(name, "#6E75F5");
              setLabel("");
            }
          }}
          title="Save the typed label as a reusable category"
        >
          + save as category
        </button>
        <button className="btn-accent" disabled={!canAdd} onClick={submit}>
          Add event
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wide text-mist-400">{label}</span>
      {children}
    </label>
  );
}
```


## `football-analysis/src/components/AnalysisTabs.tsx`

```ts
import { useState } from "react";
import PitchPanel from "./PitchPanel";
import AnalyticsPanel from "./AnalyticsPanel";
import ShotsPanel from "./ShotsPanel";

type Tab = "heat" | "passing" | "shots";

const TABS: { key: Tab; label: string }[] = [
  { key: "heat", label: "Heatmap" },
  { key: "passing", label: "Passing" },
  { key: "shots", label: "Shots" },
];

/** Consolidates the pitch heatmap, passing and shots panels behind tabs so the
 * left column shows one at a time instead of three stacked panels. */
export default function AnalysisTabs() {
  const [tab, setTab] = useState<Tab>("heat");
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1 rounded-lg bg-ink-800 border border-ink-500/60 p-0.5 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
              tab === t.key
                ? "bg-ink-600 text-mist-100"
                : "text-mist-400 hover:text-mist-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div hidden={tab !== "heat"}>
        <PitchPanel />
      </div>
      <div hidden={tab !== "passing"}>
        <AnalyticsPanel />
      </div>
      <div hidden={tab !== "shots"}>
        <ShotsPanel />
      </div>
    </div>
  );
}
```


## `football-analysis/src/components/AnalyticsPanel.tsx`

```ts
import { useState } from "react";
import { useStore } from "../store";
import { TEAM_COLORS } from "./AnalyzePanel";

/** Possession % + passing network + turnovers (Phase 3a). */
export default function AnalyticsPanel() {
  const tracks = useStore((s) => s.tracks);
  const analytics = useStore((s) => s.analytics);
  const computeAnalytics = useStore((s) => s.computeAnalytics);
  const tagTurnovers = useStore((s) => s.tagTurnovers);
  const requestSeek = useStore((s) => s.requestSeek);

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  if (!tracks) {
    return (
      <div className="panel p-3">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          Possession &amp; passing
        </span>
        <p className="text-mist-400 text-sm mt-2">Analyse the video first.</p>
      </div>
    );
  }

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };

  const pA = analytics?.possession_pct["0"] ?? 0;
  const pB = analytics?.possession_pct["1"] ?? 0;

  return (
    <div className="panel p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          Possession &amp; passing
        </span>
        <button
          className="text-mist-300 hover:text-teal-300 transition-colors text-xs"
          disabled={busy}
          onClick={() => run(computeAnalytics)}
        >
          {analytics ? "Recompute" : "Compute"}
        </button>
      </div>

      {!analytics ? (
        <p className="text-mist-400 text-sm">
          Compute possession share, passes, and turnovers from the tracking data.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {/* possession bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: TEAM_COLORS[0] }}>Team A {pA}%</span>
              <span className="text-mist-400">Possession</span>
              <span style={{ color: TEAM_COLORS[1] }}>{pB}% Team B</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden flex bg-ink-900/70">
              <div style={{ width: `${pA}%`, background: TEAM_COLORS[0] }} />
              <div style={{ width: `${pB}%`, background: TEAM_COLORS[1] }} />
            </div>
          </div>

          {/* stat tiles */}
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Passes A" value={analytics.passes["0"]} color={TEAM_COLORS[0]} />
            <Stat label="Passes B" value={analytics.passes["1"]} color={TEAM_COLORS[1]} />
            <Stat label="Turnovers" value={analytics.turnovers} />
          </div>

          {/* top pass combinations — click to jump to that pass in the video */}
          {analytics.pass_edges.length > 0 && (
            <div>
              <div className="text-[11px] uppercase text-mist-400 mb-1">
                Top pass combinations
              </div>
              <div className="flex flex-col gap-1">
                {analytics.pass_edges.slice(0, 5).map((e, i) => {
                  const first = analytics.pass_events.find(
                    (p) => p.team === e.team && p.from === e.from && p.to === e.to,
                  );
                  return (
                    <button
                      key={i}
                      disabled={!first}
                      onClick={() => first && requestSeek(first.t_ms)}
                      title={first ? "Jump to this pass" : "No clip for this pass"}
                      className="flex items-center gap-2 text-xs text-mist-200 text-left rounded px-1 -mx-1 hover:bg-ink-600 disabled:hover:bg-transparent transition-colors"
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: TEAM_COLORS[e.team] }}
                      />
                      #{e.from} → #{e.to}
                      <span className="text-mist-400">×{e.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {analytics.turnover_events.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                className="btn-accent"
                disabled={busy}
                onClick={() =>
                  run(async () => {
                    const n = await tagTurnovers();
                    setMsg(`Added ${n} turnover event${n === 1 ? "" : "s"}.`);
                  })
                }
              >
                Tag turnovers on timeline
              </button>
              {msg && <span className="text-xs text-teal-300">{msg}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="card p-2 text-center">
      <div
        className="text-xl font-semibold tabular-nums"
        style={{ color: color ?? "#EAECF2" }}
      >
        {value}
      </div>
      <div className="text-[11px] uppercase tracking-wide text-mist-400">{label}</div>
    </div>
  );
}
```


## `football-analysis/src/components/AnalyzePanel.tsx`

```ts
import { motion } from "framer-motion";
import { useStore } from "../store";
import type { OverlayMode } from "../lib/types";

export const TEAM_COLORS = ["#4C9BFF", "#FF6B4C"]; // team 0 (blue), team 1 (orange-red)
export const BALL_COLOR = "#FFE14D"; // lit yellow

const OVERLAY_MODES: { value: OverlayMode; label: string }[] = [
  { value: "off", label: "Off" },
  { value: "players", label: "Players" },
  { value: "ball", label: "Ball" },
  { value: "both", label: "Both" },
  { value: "analysis", label: "Analysis" },
];

const STAGE_LABELS: Record<string, string> = {
  triage: "Triage",
  events: "Detect",
  spatial: "Spatial",
};

/** Runs CV analysis on the current video and controls the detection overlay. */
export default function AnalyzePanel() {
  const currentVideo = useStore((s) => s.currentVideo());
  const job = useStore((s) => s.analysisJob);
  const tracks = useStore((s) => s.tracks);
  const segments = useStore((s) => s.segments);
  const overlayMode = useStore((s) => s.overlayMode);
  const analyzeVideo = useStore((s) => s.analyzeVideo);
  const setOverlayMode = useStore((s) => s.setOverlayMode);

  const running = job?.status === "running" || job?.status === "pending";
  const pct = Math.round((job?.progress ?? 0) * 100);
  const eta = etaLabel(job?.elapsed_ms, job?.progress);

  return (
    <div className="panel p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          AI analysis
        </span>
        {tracks && (
          <div className="flex items-center gap-0.5 rounded-lg bg-ink-900/60 p-0.5">
            {OVERLAY_MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => setOverlayMode(m.value)}
                title={`Overlay: ${m.label}`}
                className={`px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wide transition-colors ${
                  overlayMode === m.value
                    ? "bg-ink-600 text-mist-100"
                    : "text-mist-400 hover:text-mist-200"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          className="btn-accent"
          disabled={!currentVideo || running}
          onClick={() => analyzeVideo(5)}
        >
          {running ? "Analysing…" : tracks ? "Re-analyse" : "Analyse video"}
        </button>
        {tracks && (
          <span className="text-xs text-mist-300">
            {tracks.n_tracks} tracks · {tracks.teams} teams · {tracks.frames.length}{" "}
            frames
          </span>
        )}
      </div>

      {segments?.summary && (
        <div className="mt-2 flex items-center gap-3 text-xs text-mist-400">
          <span>
            Footage:{" "}
            <span className="text-teal-300">
              {Math.round(segments.summary.main_fraction * 100)}% main camera
            </span>
          </span>
          <span>
            {segments.summary.segments} segment
            {segments.summary.segments === 1 ? "" : "s"}
          </span>
        </div>
      )}

      {running && (
        <div className="mt-3">
          <div className="h-2 rounded-full bg-ink-900/70 overflow-hidden">
            <motion.div
              className="h-full bg-teal-300"
              animate={{ width: `${pct}%` }}
              transition={{ ease: "linear", duration: 0.3 }}
            />
          </div>
          <div className="text-xs text-mist-400 mt-1 flex justify-between gap-2">
            <span className="truncate">{job?.message}</span>
            <span className="tabular-nums shrink-0 flex items-center gap-2">
              {eta && <span className="text-mist-500">{eta}</span>}
              <span className="text-mist-200">{pct}%</span>
            </span>
          </div>
          {/* staged pipeline tracker */}
          {job?.stages && (
            <div className="flex items-center gap-1.5 mt-2">
              {job.stages.map((st) => {
                const done = job.completed_stages?.includes(st);
                const active = job.stage === st;
                return (
                  <span
                    key={st}
                    className={`px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wide border ${
                      done
                        ? "text-teal-300 border-teal-300/40 bg-teal-300/10"
                        : active
                        ? "text-violet-300 border-violet-300/40 bg-violet-300/10"
                        : "text-mist-500 border-ink-500/60"
                    }`}
                  >
                    {done ? "✓ " : ""}
                    {STAGE_LABELS[st] ?? st}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}

      {job?.status === "error" && (
        <p className="text-xs text-signal-live mt-2">{job.error}</p>
      )}

      {tracks && (
        <div className="flex items-center gap-3 mt-3 text-xs text-mist-300">
          <Legend color={TEAM_COLORS[0]} label="Team A" />
          <Legend color={TEAM_COLORS[1]} label="Team B" />
          <Legend color={BALL_COLOR} label="Ball" />
        </div>
      )}
    </div>
  );
}

/** Rough time-remaining estimate from elapsed time and fractional progress. */
function etaLabel(elapsedMs?: number, progress?: number): string | null {
  if (!elapsedMs || !progress || progress <= 0.03 || progress >= 1) return null;
  const totalMs = elapsedMs / progress;
  const remainMs = Math.max(0, totalMs - elapsedMs);
  const s = Math.round(remainMs / 1000);
  if (s < 60) return `~${s}s left`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return rem ? `~${m}m ${rem}s left` : `~${m}m left`;
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded" style={{ background: color }} />
      {label}
    </span>
  );
}
```


## `football-analysis/src/components/Dashboard.tsx`

```ts
import { useMemo } from "react";
import { useStore } from "../store";
import { openExternal } from "../lib/platform";

/** Live counts derived from the coded events — the seed of a full dashboard. */
export default function Dashboard() {
  const events = useStore((s) => s.events);
  const categories = useStore((s) => s.categories);
  const project = useStore((s) => s.currentProject());
  const info = useStore((s) => s.matchData);

  const stats = useMemo(() => {
    const byCat = new Map<number, number>();
    let manual = 0;
    let ai = 0;
    for (const ev of events) {
      if (ev.category_id) byCat.set(ev.category_id, (byCat.get(ev.category_id) ?? 0) + 1);
      if (ev.source === "ai") ai++;
      else manual++;
    }
    const max = Math.max(1, ...byCat.values());
    return { byCat, manual, ai, max };
  }, [events]);

  const shareOnX = () => {
    const lines: string[] = [];
    if (info?.score && (info.home.name || info.away.name)) {
      lines.push(
        `${info.home.name ?? "Home"} ${info.score} ${info.away.name ?? "Away"}`.trim(),
      );
      const formations = [info.home.formation, info.away.formation].filter(Boolean);
      if (formations.length) lines.push(`Formations: ${formations.join(" vs ")}`);
    } else if (project) {
      lines.push(`${project.name} — match analysis`);
    }
    lines.push(
      `${events.length} events coded${stats.ai ? ` (${stats.ai} AI-assisted)` : ""}.`,
    );
    lines.push("Analysed with Cuddy ⚽ #footballanalysis");
    const text = lines.join("\n");
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    openExternal(url);
  };

  return (
    <div className="panel p-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          Dashboard
        </span>
        <button
          onClick={shareOnX}
          title="Share this project on X"
          className="flex items-center gap-1.5 text-xs text-mist-300 hover:text-mist-100 border border-ink-500/60 hover:border-ink-400 rounded-lg px-2 py-1 transition-colors"
        >
          <XLogo />
          Share
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3">
        <Stat label="Events" value={events.length} />
        <Stat label="Manual" value={stats.manual} accent="#6EE7D6" />
        <Stat label="AI" value={stats.ai} accent="#B7A6F0" />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {categories.map((c) => {
          const count = stats.byCat.get(c.id) ?? 0;
          return (
            <div key={c.id} className="flex items-center gap-2">
              <span className="w-20 shrink-0 text-xs text-mist-200 truncate">
                {c.name}
              </span>
              <div className="flex-1 h-2.5 rounded-full bg-ink-900/70 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-smooth"
                  style={{
                    width: `${(count / stats.max) * 100}%`,
                    background: c.color,
                  }}
                />
              </div>
              <span className="w-6 text-right text-xs tabular-nums text-mist-300">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function XLogo() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="card p-2.5 text-center">
      <div
        className="text-2xl font-semibold tabular-nums"
        style={{ color: accent ?? "#EAECF2" }}
      >
        {value}
      </div>
      <div className="text-[11px] uppercase tracking-wide text-mist-400">
        {label}
      </div>
    </div>
  );
}
```


## `football-analysis/src/components/DescriptorManager.tsx`

```ts
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "../store";

/** Define descriptor groups and their buttons (collapsible). */
export default function DescriptorManager() {
  const {
    descriptorGroups,
    addDescriptorGroup,
    removeDescriptorGroup,
    addDescriptor,
    removeDescriptor,
  } = useStore();
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [drafts, setDrafts] = useState<Record<number, string>>({});

  return (
    <div className="panel p-3">
      <button
        className="w-full flex items-center justify-between text-xs uppercase tracking-wider text-mist-400"
        onClick={() => setOpen((v) => !v)}
      >
        <span>Descriptors</span>
        <span className="text-mist-500">{open ? "▾" : "▸"}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 flex flex-col gap-3">
              {descriptorGroups.map((g) => (
                <div key={g.id} className="card p-2.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-mist-100">{g.name}</span>
                    <button
                      className="text-mist-500 hover:text-signal-live text-xs"
                      onClick={() => removeDescriptorGroup(g.id)}
                    >
                      remove
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {g.descriptors.map((d) => (
                      <span
                        key={d.id}
                        className="group px-2 py-0.5 rounded-lg text-xs bg-ink-700 border border-ink-500/60 text-mist-200 flex items-center gap-1"
                      >
                        {d.label}
                        <button
                          className="text-mist-500 hover:text-signal-live"
                          onClick={() => removeDescriptor(d.id)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    className="input h-7 py-0 w-full"
                    placeholder="Add button + Enter"
                    value={drafts[g.id] ?? ""}
                    onChange={(e) =>
                      setDrafts({ ...drafts, [g.id]: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const label = (drafts[g.id] ?? "").trim();
                        if (label) {
                          addDescriptor(g.id, label);
                          setDrafts({ ...drafts, [g.id]: "" });
                        }
                      }
                    }}
                  />
                </div>
              ))}

              <div className="flex items-center gap-2">
                <input
                  className="input h-8 py-0 flex-1"
                  placeholder="New group (e.g. Outcome, Zone)"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && groupName.trim()) {
                      addDescriptorGroup(groupName.trim());
                      setGroupName("");
                    }
                  }}
                />
                <button
                  className="btn h-8 py-0"
                  onClick={() => {
                    if (groupName.trim()) {
                      addDescriptorGroup(groupName.trim());
                      setGroupName("");
                    }
                  }}
                >
                  Add group
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```


## `football-analysis/src/components/EventEditPanel.tsx`

```ts
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store";
import { api } from "../lib/api";
import type { EventRevision } from "../lib/types";
import { fmtClock } from "../lib/time";
import { BAND_CLASS, BAND_LABEL, confidenceBand, confidencePct } from "../lib/confidence";

interface Props {
  playheadMs: number;
  onSeek: (ms: number) => void;
}

/** Inline inspector for the selected event: boundaries, label, notes,
 *  descriptors, AI provenance (source/detector/confidence + change history),
 *  and review actions that preserve provenance. */
export default function EventEditPanel({ playheadMs, onSeek }: Props) {
  const ev = useStore((s) => s.selectedEvent());
  const categories = useStore((s) => s.categories);
  const descriptorGroups = useStore((s) => s.descriptorGroups);
  const updateEvent = useStore((s) => s.updateEvent);
  const removeEvent = useStore((s) => s.removeEvent);
  const acceptEvent = useStore((s) => s.acceptEvent);
  const rejectEvent = useStore((s) => s.rejectEvent);
  const toggleEventDescriptor = useStore((s) => s.toggleEventDescriptor);
  const selectEvent = useStore((s) => s.selectEvent);

  const [showHistory, setShowHistory] = useState(false);
  const [revisions, setRevisions] = useState<EventRevision[] | null>(null);

  const evId = ev?.id;
  const evUpdatedAt = ev?.updated_at;
  // (Re)load history when opened, or when this event changes underneath it.
  useEffect(() => {
    if (!showHistory || evId == null) return;
    let alive = true;
    api
      .listRevisions(evId)
      .then((r) => alive && setRevisions(r))
      .catch(() => alive && setRevisions([]));
    return () => {
      alive = false;
    };
  }, [showHistory, evId, evUpdatedAt]);

  if (!ev) return null;
  const cat = categories.find((c) => c.id === ev.category_id);
  const band = confidenceBand(ev.confidence);

  const setSec = (field: "start_ms" | "end_ms", secText: string) => {
    const ms = Math.max(0, Math.round(parseFloat(secText) * 1000));
    if (!isNaN(ms)) updateEvent(ev.id, { [field]: ms } as never);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel p-3"
      style={{ borderColor: cat ? `${cat.color}55` : undefined }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ background: cat?.color ?? "#8A90A0" }}
          />
          <span className="text-sm font-medium text-mist-100 truncate">
            {cat?.name ?? ev.label ?? "Event"}
          </span>
          {ev.source === "ai" ? (
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] shrink-0 ${BAND_CLASS[band]}`}
              title={BAND_LABEL[band]}
            >
              AI {confidencePct(ev.confidence)}
            </span>
          ) : (
            <span className="text-[10px] text-mist-500 uppercase shrink-0">Manual</span>
          )}
        </div>
        <button
          className="text-mist-400 hover:text-mist-100 text-sm"
          onClick={() => selectEvent(null)}
        >
          ✕
        </button>
      </div>

      {/* provenance line for AI events */}
      {ev.source === "ai" && (
        <div className="text-[11px] text-mist-400 mb-3 -mt-1">
          {ev.detector ? `${ev.detector} detector` : "detector: unknown"} ·{" "}
          {BAND_LABEL[band]}
        </div>
      )}

      {/* boundaries */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {(["start_ms", "end_ms"] as const).map((field) => (
          <div key={field} className="card p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] uppercase text-mist-400">
                {field === "start_ms" ? "Start" : "End"}
              </span>
              <button
                className="text-[11px] text-teal-300 hover:text-teal-400"
                onClick={() => updateEvent(ev.id, { [field]: Math.round(playheadMs) } as never)}
                title="Set to current playhead"
              >
                ⇢ playhead
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                step="0.1"
                className="input h-7 py-0 w-full"
                value={(ev[field] / 1000).toFixed(1)}
                onChange={(e) => setSec(field, e.target.value)}
              />
              <button
                className="btn h-7 py-0 px-2"
                onClick={() => onSeek(ev[field])}
                title="Seek here"
              >
                {fmtClock(ev[field])}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* label + notes */}
      <input
        className="input w-full mb-2"
        placeholder="Label"
        value={ev.label}
        onChange={(e) => updateEvent(ev.id, { label: e.target.value })}
      />
      <textarea
        className="input w-full mb-3 resize-none"
        rows={2}
        placeholder="Notes"
        value={ev.notes}
        onChange={(e) => updateEvent(ev.id, { notes: e.target.value })}
      />

      {/* descriptors */}
      {descriptorGroups.length > 0 && (
        <div className="flex flex-col gap-2 mb-3">
          {descriptorGroups.map((g) => (
            <div key={g.id}>
              <div className="text-[11px] uppercase text-mist-400 mb-1">{g.name}</div>
              <div className="flex flex-wrap gap-1.5">
                {g.descriptors.map((d) => {
                  const on = ev.descriptors.includes(d.label);
                  return (
                    <button
                      key={d.id}
                      onClick={() => toggleEventDescriptor(ev.id, d.label)}
                      className={`px-2 py-0.5 rounded-lg text-xs border transition-colors ${
                        on
                          ? "bg-teal-300 text-ink-900 border-teal-300"
                          : "text-mist-200 border-ink-500/60 hover:bg-ink-700"
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
                {g.descriptors.length === 0 && (
                  <span className="text-xs text-mist-500">no buttons</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {ev.source === "ai" && !ev.reviewed && (
        <div className="card p-2.5 mb-3 flex items-center gap-2 border-violet-400/30">
          <span className="text-xs text-violet-300 flex-1">
            AI suggestion — accept or reject
          </span>
          <button className="btn-accent" onClick={() => acceptEvent(ev.id)}>
            Accept
          </button>
          <button className="btn text-rose-300" onClick={() => rejectEvent(ev.id)}>
            Reject
          </button>
        </div>
      )}

      {/* provenance / change history */}
      <button
        className="text-[11px] text-mist-400 hover:text-mist-200 mb-2"
        onClick={() => setShowHistory((v) => !v)}
      >
        {showHistory ? "▾" : "▸"} History
      </button>
      {showHistory && (
        <div className="card p-2 mb-3 flex flex-col gap-1.5 max-h-40 overflow-auto">
          {revisions == null ? (
            <span className="text-xs text-mist-500">Loading…</span>
          ) : revisions.length === 0 ? (
            <span className="text-xs text-mist-500">No changes recorded yet.</span>
          ) : (
            revisions.map((r) => (
              <div key={r.id} className="text-[11px] text-mist-300">
                <span className="text-mist-100">{r.reason || "edit"}</span>{" "}
                <span className="text-mist-500">({r.actor_type})</span>
                {Object.keys(r.new_values).length > 0 && (
                  <span className="text-mist-400">
                    {" "}
                    — {Object.keys(r.new_values).join(", ")}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-mist-300">
          <input
            type="checkbox"
            checked={ev.reviewed}
            onChange={(e) => updateEvent(ev.id, { reviewed: e.target.checked })}
          />
          Reviewed
        </label>
        <button
          className="btn text-signal-live hover:text-signal-live"
          onClick={() => removeEvent(ev.id)}
        >
          Delete event
        </button>
      </div>
    </motion.div>
  );
}
```


## `football-analysis/src/components/EventList.tsx`

```ts
import { AnimatePresence, motion } from "framer-motion";
import { useStore, useFilteredEvents } from "../store";
import type { Category } from "../lib/types";
import { fmtClock } from "../lib/time";

interface Props {
  onSeek: (ms: number) => void;
}

/** Coded-events list — click to select+seek, checkbox to add to the playlist. */
export default function EventList({ onSeek }: Props) {
  const events = useFilteredEvents();
  const categories = useStore((s) => s.categories);
  const selectedId = useStore((s) => s.selectedEventId);
  const selectEvent = useStore((s) => s.selectEvent);
  const playlist = useStore((s) => s.playlist);
  const togglePlaylist = useStore((s) => s.togglePlaylist);
  const catById = new Map<number, Category>(categories.map((c) => [c.id, c]));

  return (
    <div className="panel p-3 flex-1 min-h-0 flex flex-col">
      <span className="text-xs uppercase tracking-wider text-mist-400 px-1 mb-2">
        Coded events ({events.length})
      </span>
      <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-1">
        <AnimatePresence initial={false}>
          {events.map((ev) => {
            const cat = ev.category_id ? catById.get(ev.category_id) : undefined;
            const color = cat?.color ?? "#8A90A0";
            const selected = ev.id === selectedId;
            const inPlaylist = playlist.includes(ev.id);
            return (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className={`group card px-2.5 py-2 flex items-center gap-2.5 cursor-pointer transition-colors ${
                  selected ? "bg-ink-600 ring-1 ring-white/20" : "hover:bg-ink-600"
                }`}
                onClick={() => {
                  selectEvent(ev.id);
                  onSeek(ev.start_ms);
                }}
              >
                <input
                  type="checkbox"
                  checked={inPlaylist}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => togglePlaylist(ev.id)}
                  title="Add to playlist"
                />
                <span
                  className="w-1.5 h-8 rounded-full shrink-0"
                  style={{ background: color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-mist-100 truncate flex items-center gap-1.5">
                    {cat?.name ?? ev.label ?? "Event"}
                    {ev.source === "ai" && (
                      <span className="text-[10px] text-violet-300 uppercase">
                        AI {Math.round((ev.confidence ?? 0) * 100)}%
                      </span>
                    )}
                    {ev.reviewed && (
                      <span className="text-[10px] text-teal-400" title="Reviewed">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-mist-400 tabular-nums flex items-center gap-1.5">
                    {fmtClock(ev.start_ms)} – {fmtClock(ev.end_ms)}
                    {ev.descriptors.length > 0 && (
                      <span className="text-violet-300 truncate">
                        · {ev.descriptors.join(", ")}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {events.length === 0 && (
          <p className="text-mist-400 text-xs px-1">No events match the filter.</p>
        )}
      </div>
    </div>
  );
}
```


## `football-analysis/src/components/FilterBar.tsx`

```ts
import { useStore } from "../store";

/** Filter chips that drive the timeline, event list and dashboard together. */
export default function FilterBar() {
  const { categories, descriptorGroups, filter, setFilter, clearFilter } =
    useStore();
  const allDescriptors = descriptorGroups.flatMap((g) =>
    g.descriptors.map((d) => d.label),
  );

  const active =
    filter.categoryIds.length > 0 ||
    filter.descriptors.length > 0 ||
    filter.source !== "all" ||
    filter.text.trim() !== "";

  const toggleCat = (id: number) =>
    setFilter({
      categoryIds: filter.categoryIds.includes(id)
        ? filter.categoryIds.filter((c) => c !== id)
        : [...filter.categoryIds, id],
    });

  const toggleDesc = (label: string) =>
    setFilter({
      descriptors: filter.descriptors.includes(label)
        ? filter.descriptors.filter((d) => d !== label)
        : [...filter.descriptors, label],
    });

  return (
    <div className="panel px-3 py-2 flex items-center gap-2 flex-wrap">
      <span className="text-xs uppercase tracking-wider text-mist-400 mr-1">
        Filter
      </span>

      {/* source */}
      <div className="flex rounded-lg overflow-hidden border border-ink-500/60">
        {(["all", "manual", "ai"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter({ source: s })}
            className={`px-2.5 py-1 text-xs capitalize transition-colors ${
              filter.source === s
                ? "bg-ink-600 text-mist-100"
                : "text-mist-300 hover:bg-ink-700"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* categories */}
      {categories.map((c) => {
        const on = filter.categoryIds.includes(c.id);
        return (
          <button
            key={c.id}
            onClick={() => toggleCat(c.id)}
            className="px-2.5 py-1 rounded-lg text-xs border transition-all"
            style={{
              color: on ? "#0E0F13" : c.color,
              background: on ? c.color : `${c.color}1A`,
              borderColor: `${c.color}66`,
            }}
          >
            {c.name}
          </button>
        );
      })}

      {/* descriptors */}
      {allDescriptors.map((label) => {
        const on = filter.descriptors.includes(label);
        return (
          <button
            key={label}
            onClick={() => toggleDesc(label)}
            className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${
              on
                ? "bg-violet-400 text-ink-900 border-violet-400"
                : "text-violet-300 border-violet-400/40 hover:bg-ink-700"
            }`}
          >
            {label}
          </button>
        );
      })}

      <input
        className="input h-7 py-0 w-40 ml-auto"
        placeholder="Search…"
        value={filter.text}
        onChange={(e) => setFilter({ text: e.target.value })}
      />
      {active && (
        <button className="btn h-7 py-0" onClick={clearFilter}>
          Clear
        </button>
      )}
    </div>
  );
}
```


## `football-analysis/src/components/FindingsPanel.tsx`

```ts
import { useState } from "react";
import { useStore } from "../store";
import { api, downloadText } from "../lib/api";
import { fmtClock } from "../lib/time";
import SectionHeader from "./SectionHeader";

/**
 * Findings: save an observation tied to its evidence. The currently selected
 * playlist events become the supporting events, and the time range is derived
 * from them. Clicking a finding loads its events as the reel and seeks to the
 * start — evidence you can always get back to.
 */
export default function FindingsPanel() {
  const findings = useStore((s) => s.findings);
  const addFinding = useStore((s) => s.addFinding);
  const removeFinding = useStore((s) => s.removeFinding);
  const events = useStore((s) => s.events);
  const playlist = useStore((s) => s.playlist);
  const setPlaylist = useStore((s) => s.setPlaylist);
  const requestSeek = useStore((s) => s.requestSeek);
  const selectEvent = useStore((s) => s.selectEvent);
  const videoId = useStore((s) => s.currentVideoId);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [busy, setBusy] = useState(false);

  const supporting = events.filter((e) => playlist.includes(e.id));
  const range =
    supporting.length > 0
      ? {
          start_ms: Math.min(...supporting.map((e) => e.start_ms)),
          end_ms: Math.max(...supporting.map((e) => e.end_ms)),
        }
      : { start_ms: null, end_ms: null };

  const save = async () => {
    if (!title.trim()) return;
    setBusy(true);
    try {
      await addFinding({
        title: title.trim(),
        description: desc.trim(),
        event_ids: playlist,
        start_ms: range.start_ms,
        end_ms: range.end_ms,
      });
      setTitle("");
      setDesc("");
    } finally {
      setBusy(false);
    }
  };

  const openFinding = (eventIds: number[], startMs: number | null) => {
    if (eventIds.length) setPlaylist(eventIds);
    if (startMs != null) {
      selectEvent(eventIds[0] ?? null);
      requestSeek(startMs);
    }
  };

  if (!videoId) return null;

  return (
    <div className="panel p-3">
      <SectionHeader
        label="Findings"
        className="mb-2"
        right={
          <div className="flex items-center gap-2">
            {findings.length > 0 && (
              <button
                className="text-[11px] text-mist-400 hover:text-teal-300 transition-colors"
                onClick={async () => {
                  const report = await api.getReport(videoId);
                  downloadText(
                    JSON.stringify(report, null, 2),
                    `${report.title || "match"}-report.json`,
                  );
                }}
              >
                Export report
              </button>
            )}
            <span className="text-[11px] text-mist-400 tabular-nums">
              {findings.length}
            </span>
          </div>
        }
      />

      <div className="flex flex-col gap-2 mb-3">
        <input
          className="input"
          placeholder="Finding title — e.g. Left-side turnovers in the first phase"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
        />
        <textarea
          className="input resize-none"
          rows={2}
          placeholder="Notes (optional)"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-mist-400">
            {supporting.length > 0
              ? `${supporting.length} supporting event${supporting.length === 1 ? "" : "s"} · ${fmtClock(range.start_ms ?? 0)}–${fmtClock(range.end_ms ?? 0)}`
              : "Select events (▶ playlist) to attach evidence"}
          </span>
          <button
            className="btn-accent h-7 py-0"
            disabled={busy || !title.trim()}
            onClick={save}
          >
            Save finding
          </button>
        </div>
      </div>

      {findings.length === 0 ? (
        <p className="text-xs text-mist-400">
          No findings yet. Capture what the evidence shows so you can return to it.
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {findings.map((f) => (
            <div key={f.id} className="card px-2.5 py-2">
              <div className="flex items-start justify-between gap-2">
                <button
                  className="text-left flex-1 min-w-0"
                  onClick={() => openFinding(f.event_ids, f.start_ms)}
                >
                  <div className="text-sm text-mist-100 flex items-center gap-2">
                    {f.start_ms != null && (
                      <span className="tabular-nums text-teal-300 text-xs shrink-0">
                        {fmtClock(f.start_ms)}
                      </span>
                    )}
                    <span className="truncate">{f.title}</span>
                  </div>
                  {f.description && (
                    <div className="text-xs text-mist-400 mt-0.5">{f.description}</div>
                  )}
                  {f.event_ids.length > 0 && (
                    <div className="text-[11px] text-mist-500 mt-0.5">
                      {f.event_ids.length} event{f.event_ids.length === 1 ? "" : "s"} · click to load reel
                    </div>
                  )}
                </button>
                <button
                  className="text-mist-500 hover:text-signal-live text-sm shrink-0"
                  onClick={() => removeFinding(f.id)}
                  aria-label="Delete finding"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```


## `football-analysis/src/components/HeatmapView.tsx`

```ts
import { useEffect, useRef } from "react";
import type { PitchData } from "../lib/types";

interface Props {
  pitch: PitchData;
  team: "0" | "1";
}

/** Top-down pitch: green turf with mowing stripes and a smooth red heat bloom. */
export default function HeatmapView({ pitch, team }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.clientWidth;
    const ch = Math.round((cw * pitch.width) / pitch.length);
    canvas.width = cw;
    canvas.height = ch;
    canvas.style.height = `${ch}px`;

    const sx = cw / pitch.length;
    const sy = ch / pitch.width;

    // --- turf with mowing stripes ---------------------------------------
    const stripes = 12;
    for (let i = 0; i < stripes; i++) {
      ctx.fillStyle = i % 2 === 0 ? "#1f6a41" : "#1a5c39";
      ctx.fillRect((i * cw) / stripes, 0, cw / stripes + 1, ch);
    }
    // corner vignette
    const vg = ctx.createRadialGradient(
      cw / 2,
      ch / 2,
      ch * 0.25,
      cw / 2,
      ch / 2,
      cw * 0.72,
    );
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.32)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, cw, ch);

    // --- red heat bloom -------------------------------------------------
    const grid = pitch.heatmaps[team];
    const cellW = cw / pitch.bins_x;
    const cellH = ch / pitch.bins_y;
    ctx.globalCompositeOperation = "lighter";
    for (let gy = 0; gy < pitch.bins_y; gy++) {
      for (let gx = 0; gx < pitch.bins_x; gx++) {
        const v = grid[gy]?.[gx] ?? 0;
        if (v <= 0) continue;
        const px = (gx + 0.5) * cellW;
        const py = (gy + 0.5) * cellH;
        const rad = Math.max(cellW, cellH) * 1.25;
        const a = Math.min(0.9, 0.12 + v * 0.85);
        const g = ctx.createRadialGradient(px, py, 0, px, py, rad);
        g.addColorStop(0, `rgba(255,64,42,${a})`);
        g.addColorStop(0.6, `rgba(255,96,48,${a * 0.5})`);
        g.addColorStop(1, "rgba(255,96,48,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalCompositeOperation = "source-over";

    // --- markings (crisp white) -----------------------------------------
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 1.5;
    const pad = 4;
    const L = cw - pad * 2;
    const W = ch - pad * 2;
    const round = (fn: () => void) => {
      ctx.save();
      ctx.lineJoin = "round";
      fn();
      ctx.restore();
    };

    round(() => ctx.strokeRect(pad, pad, L, W));
    // halfway line + centre circle + spot
    ctx.beginPath();
    ctx.moveTo(cw / 2, pad);
    ctx.lineTo(cw / 2, ch - pad);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cw / 2, ch / 2, 9.15 * sx, 0, Math.PI * 2);
    ctx.stroke();
    dot(ctx, cw / 2, ch / 2, 2);

    const boxD = 16.5 * sx;
    const boxW = 40.32 * sy;
    const goalD = 5.5 * sx;
    const goalW = 18.32 * sy;
    const penDist = 11 * sx;
    const arcR = 9.15 * sx;

    for (const side of [0, 1]) {
      const dir = side === 0 ? 1 : -1;
      const edge = side === 0 ? pad : cw - pad;
      // penalty box
      round(() =>
        ctx.strokeRect(
          side === 0 ? pad : cw - pad - boxD,
          (ch - boxW) / 2,
          boxD,
          boxW,
        ),
      );
      // goal box
      round(() =>
        ctx.strokeRect(
          side === 0 ? pad : cw - pad - goalD,
          (ch - goalW) / 2,
          goalD,
          goalW,
        ),
      );
      // penalty spot + arc (the "D") — only the portion outside the box
      const spotX = edge + dir * penDist;
      dot(ctx, spotX, ch / 2, 2);
      const theta = Math.acos(Math.min(1, (boxD - penDist) / arcR));
      ctx.beginPath();
      if (side === 0) ctx.arc(spotX, ch / 2, arcR, -theta, theta);
      else ctx.arc(spotX, ch / 2, arcR, Math.PI - theta, Math.PI + theta);
      ctx.stroke();
    }
  }, [pitch, team]);

  return <canvas ref={canvasRef} className="w-full rounded-lg" />;
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
```


## `football-analysis/src/components/MatchHero.tsx`

```ts
import { motion } from "framer-motion";
import { useStore } from "../store";
import SectionHeader from "./SectionHeader";
import { TeamHead } from "./TeamBits";

/** Full-width match band: the validated-match strip, scoreline, and a KPI row
 *  (possession / shots / xG / pass accuracy) — artboard 1's hero. */
export default function MatchHero() {
  const data = useStore((s) => s.matchData);
  if (!data) return null;

  const sub = [data.competition, data.date].filter(Boolean).join(" · ");
  const kpis = [
    { label: "Possession", ...pick(data, ["Ball Possession"]), suffix: "%" },
    { label: "Shots", ...pick(data, ["Total Shots"]), suffix: undefined as string | undefined },
    { label: "Expected Goals", ...pick(data, ["expected_goals", "Expected Goals"]), suffix: undefined as string | undefined },
    { label: "Pass Accuracy", ...pick(data, ["Passes %"]), suffix: "%" },
  ];

  return (
    <motion.div
      className="panel p-4 shrink-0"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <SectionHeader
        label="Match — API-Football · Validated"
        right={
          <div className="flex items-center gap-3 min-w-0">
            {sub && <span className="text-[11px] text-mist-400 truncate">{sub}</span>}
            <button
              className="text-[11px] text-mist-400 hover:text-teal-300 transition-colors shrink-0"
              onClick={() => useStore.setState({ matchData: null })}
            >
              Change fixture
            </button>
          </div>
        }
      />

      {/* Scoreline */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 mt-3 mb-4">
        <TeamHead team={data.home} align="right" size={9} />
        <div className="text-center px-2">
          <div className="text-4xl font-bold tabular-nums text-mist-100 leading-none tracking-tight">
            {data.score ?? "—"}
          </div>
          <div className="text-[10px] uppercase tracking-[0.16em] text-mist-500 mt-1.5">
            Full time
          </div>
        </div>
        <TeamHead team={data.away} align="left" size={9} />
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 pt-3 border-t border-ink-500/40">
        {kpis.map((k) => (
          <Kpi key={k.label} label={k.label} home={k.home} away={k.away} suffix={k.suffix} />
        ))}
      </div>
    </motion.div>
  );
}

function Kpi({
  label,
  home,
  away,
  suffix,
}: {
  label: string;
  home: string | number | null;
  away: string | number | null;
  suffix?: string;
}) {
  const h = num(home);
  const a = num(away);
  const total = (h ?? 0) + (a ?? 0);
  const hPct = total > 0 ? ((h ?? 0) / total) * 100 : 50;
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="tabular-nums text-mist-100 font-medium">{fmt(home, suffix)}</span>
        <span className="text-[10px] uppercase tracking-[0.12em] text-mist-400">{label}</span>
        <span className="tabular-nums text-mist-100 font-medium">{fmt(away, suffix)}</span>
      </div>
      <div className="flex items-center gap-1 mt-1.5 h-1.5">
        <div className="flex-1 flex justify-end">
          <div className="h-full rounded-full bg-teal-400/80" style={{ width: `${hPct}%` }} />
        </div>
        <div className="flex-1">
          <div className="h-full rounded-full bg-violet-400/80" style={{ width: `${100 - hPct}%` }} />
        </div>
      </div>
    </div>
  );
}

/** Find a stat value on both teams by trying candidate keys (case-insensitive). */
function pick(
  data: { home: { stats: Record<string, unknown> }; away: { stats: Record<string, unknown> } },
  keys: string[],
): { home: string | number | null; away: string | number | null } {
  const get = (stats: Record<string, unknown>) => {
    for (const k of keys) {
      if (k in stats) return stats[k] as string | number | null;
      const hit = Object.keys(stats).find((s) => s.toLowerCase() === k.toLowerCase());
      if (hit) return stats[hit] as string | number | null;
    }
    return null;
  };
  return { home: get(data.home.stats), away: get(data.away.stats) };
}

function num(v: string | number | null): number | null {
  if (v == null) return null;
  if (typeof v === "number") return v;
  const m = String(v).match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}

function fmt(v: string | number | null, suffix?: string): string {
  if (v == null || v === "") return "—";
  const s = String(v);
  if (suffix && !s.includes(suffix)) return s + suffix;
  return s;
}
```


## `football-analysis/src/components/PitchPanel.tsx`

```ts
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "../store";
import HeatmapView from "./HeatmapView";
import { TEAM_COLORS } from "./AnalyzePanel";

/** Manual pitch calibration -> heatmaps, team distances, and auto-tagging. */
export default function PitchPanel() {
  const tracks = useStore((s) => s.tracks);
  const pitch = useStore((s) => s.pitch);
  const calibrationMode = useStore((s) => s.calibrationMode);
  const calibrationPoints = useStore((s) => s.calibrationPoints);
  const setCalibrationMode = useStore((s) => s.setCalibrationMode);
  const clearCalibrationPoints = useStore((s) => s.clearCalibrationPoints);
  const calibratePitch = useStore((s) => s.calibratePitch);
  const runAutotag = useStore((s) => s.runAutotag);

  const [length, setLength] = useState(105);
  const [width, setWidth] = useState(68);
  const [team, setTeam] = useState<"0" | "1">("0");
  const [busy, setBusy] = useState(false);
  const [tagMsg, setTagMsg] = useState<string | null>(null);

  if (!tracks) {
    return (
      <div className="panel p-3">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          Pitch &amp; heatmaps
        </span>
        <p className="text-mist-400 text-sm mt-2">
          Analyse the video first, then calibrate the pitch here.
        </p>
      </div>
    );
  }

  const compute = async () => {
    setBusy(true);
    try {
      await calibratePitch(length, width);
    } finally {
      setBusy(false);
    }
  };

  const doAutotag = async () => {
    setBusy(true);
    try {
      const n = await runAutotag();
      setTagMsg(`Added ${n} AI event${n === 1 ? "" : "s"} to the timeline.`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="panel p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          Pitch &amp; heatmaps
        </span>
        {!calibrationMode && (
          <button
            className="text-mist-300 hover:text-teal-300 transition-colors text-xs"
            onClick={() => setCalibrationMode(true)}
          >
            {pitch ? "Re-calibrate" : "Calibrate pitch"}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {calibrationMode ? (
          <motion.div
            key="calib"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-2"
          >
            <p className="text-xs text-mist-300 leading-relaxed">
              Click the four pitch corners on the video, in order:{" "}
              <span className="text-teal-300">
                top-left → top-right → bottom-right → bottom-left
              </span>
              .
            </p>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`w-6 h-6 grid place-items-center rounded-lg text-xs border ${
                    calibrationPoints.length > i
                      ? "bg-teal-300 text-ink-900 border-teal-300"
                      : "text-mist-400 border-ink-500/60"
                  }`}
                >
                  {i + 1}
                </span>
              ))}
              <span className="text-xs text-mist-400 ml-1">
                {calibrationPoints.length}/4 points
              </span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-mist-300">Length</label>
              <input
                type="number"
                className="input h-7 py-0 w-16"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
              />
              <label className="text-xs text-mist-300">Width</label>
              <input
                type="number"
                className="input h-7 py-0 w-16"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
              />
              <span className="text-xs text-mist-500">m</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="btn-accent"
                disabled={calibrationPoints.length !== 4 || busy}
                onClick={compute}
              >
                {busy ? "Computing…" : "Compute heatmaps"}
              </button>
              <button className="btn" onClick={clearCalibrationPoints}>
                Clear points
              </button>
              <button className="btn" onClick={() => setCalibrationMode(false)}>
                Cancel
              </button>
            </div>
          </motion.div>
        ) : pitch ? (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-mist-400">Heatmap:</span>
              {(["0", "1"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTeam(t)}
                  className="px-2.5 py-1 rounded-lg text-xs border transition-all"
                  style={{
                    color: team === t ? "#0E0F13" : TEAM_COLORS[Number(t)],
                    background: team === t ? TEAM_COLORS[Number(t)] : "transparent",
                    borderColor: `${TEAM_COLORS[Number(t)]}66`,
                  }}
                >
                  Team {t === "0" ? "A" : "B"}
                </button>
              ))}
            </div>

            <HeatmapView pitch={pitch} team={team} />

            <div className="grid grid-cols-2 gap-2">
              <Stat
                label="Team A distance"
                value={`${(pitch.team_distance_m["0"] / 1000).toFixed(2)} km`}
                color={TEAM_COLORS[0]}
              />
              <Stat
                label="Team B distance"
                value={`${(pitch.team_distance_m["1"] / 1000).toFixed(2)} km`}
                color={TEAM_COLORS[1]}
              />
            </div>

            <div className="flex items-center gap-2">
              <button className="btn-accent" onClick={doAutotag} disabled={busy}>
                {busy ? "Working…" : "Auto-tag (ball in final third)"}
              </button>
              {tagMsg && <span className="text-xs text-teal-300">{tagMsg}</span>}
            </div>
          </motion.div>
        ) : (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-mist-400 text-sm"
          >
            Calibrate the pitch to unlock heatmaps, team distances, and
            auto-tagging.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="card p-2">
      <div className="text-lg font-semibold tabular-nums" style={{ color }}>
        {value}
      </div>
      <div className="text-[11px] uppercase tracking-wide text-mist-400">{label}</div>
    </div>
  );
}
```


## `football-analysis/src/components/PlaylistBar.tsx`

```ts
import { useStore } from "../store";
import { downloadSelection } from "../lib/api";

interface Props {
  presenting: boolean;
  onPlay: () => void;
  onStop: () => void;
}

/** Highlight-reel controls: play the selection back-to-back, or export it. */
export default function PlaylistBar({ presenting, onPlay, onStop }: Props) {
  const playlist = useStore((s) => s.playlist);
  const clearPlaylist = useStore((s) => s.clearPlaylist);
  const currentVideo = useStore((s) => s.currentVideo());

  const count = playlist.length;
  const disabled = count === 0 || !currentVideo;

  const doExport = async (fmt: "xml" | "csv") => {
    if (!currentVideo) return;
    await downloadSelection(
      currentVideo.id,
      playlist,
      fmt,
      `${currentVideo.name}_playlist.${fmt}`,
    );
  };

  return (
    <div className="panel px-3 py-2 flex items-center gap-2">
      <span className="text-xs uppercase tracking-wider text-mist-400">
        Playlist
      </span>
      <span className="text-sm text-mist-200 tabular-nums">{count} selected</span>
      <div className="flex-1" />
      {presenting ? (
        <button className="btn" onClick={onStop}>
          Stop
        </button>
      ) : (
        <button className="btn-accent" disabled={disabled} onClick={onPlay}>
          ▶ Play reel
        </button>
      )}
      <button className="btn" disabled={disabled} onClick={() => doExport("xml")}>
        Export XML
      </button>
      <button className="btn" disabled={disabled} onClick={() => doExport("csv")}>
        Export CSV
      </button>
      <button className="btn" disabled={count === 0} onClick={clearPlaylist}>
        Clear
      </button>
    </div>
  );
}
```


## `football-analysis/src/components/ReviewQueue.tsx`

```ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "../store";
import type { Category, MatchEvent } from "../lib/types";
import { fmtClock } from "../lib/time";
import { BAND_CLASS, BAND_LABEL, confidenceBand, confidencePct } from "../lib/confidence";
import SectionHeader from "./SectionHeader";

type QueueFilter = "all" | "high" | "medium" | "low";

/**
 * AI Review Queue: process machine-generated suggestions fast.
 *
 * Shows the UNREVIEWED AI events (source="ai", reviewed=false). Accept keeps the
 * event on the timeline and marks it reviewed; reject removes it. Both auto-
 * advance to the next item. Keyboard (only while the queue is focused, never
 * while typing in a field):
 *   Enter = accept · Delete/Backspace = reject · ↑/↓ = prev/next · Space = seek
 */
export default function ReviewQueue() {
  const events = useStore((s) => s.events);
  const categories = useStore((s) => s.categories);
  const acceptEvent = useStore((s) => s.acceptEvent);
  const rejectEvent = useStore((s) => s.rejectEvent);
  const selectEvent = useStore((s) => s.selectEvent);
  const requestSeek = useStore((s) => s.requestSeek);
  const selectedEventId = useStore((s) => s.selectedEventId);

  const [filter, setFilter] = useState<QueueFilter>("all");
  const containerRef = useRef<HTMLDivElement>(null);

  const catName = useMemo(() => {
    const m = new Map<number, string>();
    categories.forEach((c: Category) => c.id && m.set(c.id, c.name));
    return m;
  }, [categories]);

  const codeOf = useCallback(
    (e: MatchEvent) =>
      (e.category_id ? catName.get(e.category_id) : null) || e.label || "Event",
    [catName],
  );

  // Unreviewed AI suggestions, sorted by time, optionally by confidence band.
  const queue = useMemo(() => {
    return events
      .filter((e) => e.source === "ai" && !e.reviewed)
      .filter((e) => filter === "all" || confidenceBand(e.confidence) === filter)
      .sort((a, b) => a.start_ms - b.start_ms);
  }, [events, filter]);

  // Track which queue item is the cursor. Default to the selected event if it's
  // in the queue, else the first item.
  const [cursor, setCursor] = useState(0);
  useEffect(() => {
    const idx = queue.findIndex((e) => e.id === selectedEventId);
    if (idx >= 0) setCursor(idx);
    else if (cursor >= queue.length) setCursor(Math.max(0, queue.length - 1));
  }, [queue, selectedEventId]); // eslint-disable-line react-hooks/exhaustive-deps

  const current = queue[cursor];

  const focusItem = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(idx, queue.length - 1));
      setCursor(clamped);
      const ev = queue[clamped];
      if (ev) selectEvent(ev.id);
    },
    [queue, selectEvent],
  );

  const doAccept = useCallback(async () => {
    if (!current) return;
    await acceptEvent(current.id); // leaves the queue -> next item shifts into `cursor`
    setCursor(Math.min(cursor, Math.max(0, queue.length - 2)));
  }, [current, cursor, acceptEvent, queue.length]);

  const doReject = useCallback(async () => {
    if (!current) return;
    await rejectEvent(current.id);
    setCursor(Math.min(cursor, Math.max(0, queue.length - 2)));
  }, [current, cursor, rejectEvent, queue.length]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    // Never hijack typing.
    const t = e.target as HTMLElement;
    if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;
    if (e.key === "Enter") {
      e.preventDefault();
      void doAccept();
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      void doReject();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      focusItem(cursor + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusItem(cursor - 1);
    } else if (e.key === " ") {
      e.preventDefault();
      if (current) requestSeek(current.start_ms);
    }
  };

  return (
    <div className="panel p-3">
      <SectionHeader
        label="Review queue"
        className="mb-2"
        right={
          <span className="text-[11px] text-mist-400 tabular-nums">
            {queue.length} to review
          </span>
        }
      />

      {events.some((e) => e.source === "ai") ? (
        <>
          <div className="flex items-center gap-1 mb-2 rounded-lg bg-ink-900/60 p-0.5 w-fit">
            {(["all", "high", "medium", "low"] as QueueFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-md text-xs capitalize transition-colors ${
                  filter === f ? "bg-ink-600 text-mist-100" : "text-mist-400 hover:text-mist-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {queue.length === 0 ? (
            <p className="text-xs text-mist-400 py-2">
              Nothing left to review in this filter. ✓
            </p>
          ) : (
            <div
              ref={containerRef}
              tabIndex={0}
              onKeyDown={onKeyDown}
              className="flex flex-col gap-1 outline-none focus:ring-1 focus:ring-violet-500/40 rounded-lg"
            >
              {queue.map((e, i) => {
                const band = confidenceBand(e.confidence);
                const active = i === cursor;
                return (
                  <div
                    key={e.id}
                    onClick={() => {
                      focusItem(i);
                      requestSeek(e.start_ms);
                    }}
                    className={`card px-2.5 py-1.5 cursor-pointer transition-colors ${
                      active ? "ring-1 ring-violet-500/50 bg-ink-600" : "hover:bg-ink-600"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm text-mist-100 min-w-0">
                        <span className="tabular-nums text-teal-300 text-xs shrink-0">
                          {fmtClock(e.start_ms)}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                        <span className="truncate">{codeOf(e)}</span>
                      </div>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] shrink-0 ${BAND_CLASS[band]}`}
                        title={BAND_LABEL[band]}
                      >
                        {confidencePct(e.confidence)}
                      </span>
                    </div>
                    {e.detector && (
                      <div className="text-[11px] text-mist-400 mt-0.5">
                        {e.detector} · {BAND_LABEL[band]}
                      </div>
                    )}
                    {active && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <button
                          onClick={(ev) => {
                            ev.stopPropagation();
                            void doAccept();
                          }}
                          className="btn h-7 py-0 text-teal-300"
                        >
                          Accept
                        </button>
                        <button
                          onClick={(ev) => {
                            ev.stopPropagation();
                            void doReject();
                          }}
                          className="btn h-7 py-0 text-rose-300"
                        >
                          Reject
                        </button>
                        <button
                          onClick={(ev) => {
                            ev.stopPropagation();
                            selectEvent(e.id);
                            requestSeek(e.start_ms);
                          }}
                          className="btn h-7 py-0"
                        >
                          Watch
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-[10px] text-mist-500 mt-2 leading-relaxed">
            Focus the list, then: <b>Enter</b> accept · <b>Del</b> reject ·{" "}
            <b>↑↓</b> move · <b>Space</b> seek
          </p>
        </>
      ) : (
        <p className="text-xs text-mist-400 py-2">
          No AI suggestions yet. Run analysis to generate reviewable events.
        </p>
      )}
    </div>
  );
}
```


## `football-analysis/src/components/SectionHeader.tsx`

```ts
import type { ReactNode } from "react";

/**
 * The "■ SECTION LABEL" header used across the workspace panels — a small
 * blurple square bullet + an uppercase, letter-spaced label, with optional
 * right-aligned content (a control or meta text).
 */
export default function SectionHeader({
  label,
  right,
  className = "",
}: {
  label: string;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-2 h-2 rounded-[3px] bg-teal-400 shrink-0" />
        <span className="text-[11px] uppercase tracking-[0.14em] text-mist-300 font-medium truncate">
          {label}
        </span>
      </div>
      {right}
    </div>
  );
}
```


## `football-analysis/src/components/SettingsPanel.tsx`

```ts
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "../store";

/** Modal to configure the AI provider key (Groq/Anthropic) and API-Football key. */
export default function SettingsPanel() {
  const open = useStore((s) => s.settingsOpen);
  const close = useStore((s) => s.closeSettings);
  const apiKeySet = useStore((s) => s.apiKeySet);
  const groqKeySet = useStore((s) => s.groqKeySet);
  const provider = useStore((s) => s.aiProvider);
  const keySource = useStore((s) => s.keySource);
  const apifootballKeySet = useStore((s) => s.apifootballKeySet);
  const saveApiKey = useStore((s) => s.saveApiKey);
  const saveGroqKey = useStore((s) => s.saveGroqKey);
  const setProvider = useStore((s) => s.setProvider);
  const saveApiFootballKey = useStore((s) => s.saveApiFootballKey);
  const refreshSettings = useStore((s) => s.refreshSettings);
  const reducedMotion = useStore((s) => s.reducedMotion);
  const setReducedMotion = useStore((s) => s.setReducedMotion);

  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [fbKey, setFbKey] = useState("");
  const [fbBusy, setFbBusy] = useState(false);
  const [fbSaved, setFbSaved] = useState(false);
  const [fbErr, setFbErr] = useState<string | null>(null);

  const activeKeySet = provider === "groq" ? groqKeySet : apiKeySet;

  useEffect(() => {
    if (open) {
      setKey("");
      setSaved(false);
      setErr(null);
      setFbKey("");
      setFbSaved(false);
      setFbErr(null);
      refreshSettings();
    }
  }, [open, refreshSettings]);

  const saveFootball = async () => {
    if (!fbKey.trim()) return;
    setFbBusy(true);
    setFbErr(null);
    try {
      await saveApiFootballKey(fbKey.trim());
      setFbSaved(true);
      setFbKey("");
    } catch (e) {
      setFbErr(e instanceof Error ? e.message : "Could not save the key.");
    } finally {
      setFbBusy(false);
    }
  };

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && close();
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, close]);

  const save = async () => {
    if (!key.trim()) return;
    setBusy(true);
    setErr(null);
    try {
      if (provider === "groq") await saveGroqKey(key.trim());
      else await saveApiKey(key.trim());
      setSaved(true);
      setKey("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not save the key.");
    } finally {
      setBusy(false);
    }
  };

  const switchProvider = async (p: "groq" | "anthropic") => {
    if (p === provider) return;
    setKey("");
    setSaved(false);
    setErr(null);
    try {
      await setProvider(p);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not switch provider.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-ink-900/70 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            className="panel w-full max-w-md p-5"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-medium text-mist-100">Settings</h2>
              <button
                className="text-mist-400 hover:text-mist-100 transition-colors text-lg leading-none"
                onClick={close}
                aria-label="Close settings"
              >
                ×
              </button>
            </div>

            {/* Match data — API-Football (the primary data source) */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    apifootballKeySet ? "bg-teal-400" : "bg-mist-500"
                  }`}
                />
                <label className="text-xs font-medium text-mist-200">
                  Match data — API-Football
                </label>
              </div>
              <p className="text-[11px] text-mist-400 mb-2 leading-relaxed">
                Real scores, lineups, formations and team stats. Get a free key at{" "}
                <span className="text-mist-300">api-sports.io</span> (dashboard →
                API key). Stored locally.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  className="input flex-1"
                  placeholder={apifootballKeySet ? "•••••• (configured)" : "your api-sports key"}
                  value={fbKey}
                  onChange={(e) => {
                    setFbKey(e.target.value);
                    setFbSaved(false);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && saveFootball()}
                />
                <button
                  className="btn-accent"
                  disabled={fbBusy || !fbKey.trim()}
                  onClick={saveFootball}
                >
                  {fbBusy ? "Saving…" : apifootballKeySet ? "Update" : "Save"}
                </button>
              </div>
              {fbSaved && (
                <span className="text-xs text-teal-300 mt-1 inline-block">Saved ✓</span>
              )}
              {fbErr && <span className="text-xs text-signal-live mt-1 inline-block">{fbErr}</span>}
            </div>

            <div className="border-t border-ink-500/50 my-4" />

            {/* AI chat — provider (Groq is free; Anthropic optional) */}
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-mist-200">AI chat</label>
              <div className="flex items-center gap-1 rounded-lg bg-ink-900/60 p-0.5">
                <ProviderTab
                  label="Groq · free"
                  active={provider === "groq"}
                  onClick={() => switchProvider("groq")}
                />
                <ProviderTab
                  label="Anthropic"
                  active={provider === "anthropic"}
                  onClick={() => switchProvider("anthropic")}
                />
              </div>
            </div>

            <p className="text-[11px] text-mist-400 mb-3 leading-relaxed">
              {provider === "groq" ? (
                <>
                  Natural-language questions run on Groq&apos;s free, fast API. Get a
                  free key at <span className="text-mist-300">console.groq.com</span>{" "}
                  (API Keys). Stored locally, only sent to Groq.
                </>
              ) : (
                <>
                  Uses the Anthropic API — a separate paid key (your Claude
                  subscription does not apply). Stored locally, only sent to
                  Anthropic.
                </>
              )}
            </p>

            <div className="flex items-center gap-2 mb-3 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  activeKeySet ? "bg-teal-400" : "bg-mist-500"
                }`}
              />
              <span className="text-mist-300">
                {activeKeySet
                  ? keySource === "env"
                    ? "Key active (from environment)"
                    : "Key configured"
                  : "No key configured"}
              </span>
            </div>

            {keySource === "env" ? (
              <p className="text-xs text-mist-400 leading-relaxed">
                A{" "}
                <code className="text-teal-300">
                  {provider === "groq" ? "GROQ_API_KEY" : "ANTHROPIC_API_KEY"}
                </code>{" "}
                environment variable is set and takes precedence. Unset it to
                manage the key here instead.
              </p>
            ) : (
              <>
                <label className="text-xs text-mist-300">
                  {provider === "groq" ? "Groq API key" : "Anthropic API key"}
                </label>
                <input
                  type="password"
                  autoFocus
                  className="input w-full mt-1"
                  placeholder={provider === "groq" ? "gsk_…" : "sk-ant-…"}
                  value={key}
                  onChange={(e) => {
                    setKey(e.target.value);
                    setSaved(false);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && save()}
                />
                <div className="flex items-center gap-3 mt-4">
                  <button
                    className="btn-accent"
                    disabled={busy || !key.trim()}
                    onClick={save}
                  >
                    {busy ? "Saving…" : activeKeySet ? "Update key" : "Save key"}
                  </button>
                  {saved && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-teal-300"
                    >
                      Saved ✓
                    </motion.span>
                  )}
                  {err && <span className="text-xs text-signal-live">{err}</span>}
                </div>
              </>
            )}

            <div className="border-t border-ink-500/50 my-4" />

            {/* Interface preferences */}
            <label className="text-xs font-medium text-mist-200">Interface</label>
            <label className="flex items-center justify-between gap-3 mt-2 cursor-pointer">
              <span className="text-xs text-mist-300 leading-relaxed">
                Reduced motion
                <span className="block text-[11px] text-mist-500">
                  Minimise animation across the app.
                </span>
              </span>
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
              />
            </label>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProviderTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
        active ? "bg-ink-600 text-mist-100" : "text-mist-400 hover:text-mist-200"
      }`}
    >
      {label}
    </button>
  );
}
```


## `football-analysis/src/components/ShotMap.tsx`

```ts
import { useEffect, useRef } from "react";
import type { Shot, ShotsData } from "../lib/types";
import { TEAM_COLORS } from "./AnalyzePanel";

/** Top-down pitch with shot markers sized by xG. Clicking a marker seeks the
 *  video to that shot (spec §25) — pitch becomes a control surface. */
export default function ShotMap({
  shots,
  onSeek,
}: {
  shots: ShotsData;
  onSeek?: (ms: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Screen-space marker geometry, kept for click hit-testing.
  const hitsRef = useRef<{ x: number; y: number; r: number; shot: Shot }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.clientWidth;
    const ch = Math.round((cw * shots.width) / shots.length);
    canvas.width = cw;
    canvas.height = ch;
    canvas.style.height = `${ch}px`;

    // pitch
    ctx.fillStyle = "#12241C";
    ctx.fillRect(0, 0, cw, ch);
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(1, 1, cw - 2, ch - 2);
    ctx.beginPath();
    ctx.moveTo(cw / 2, 0);
    ctx.lineTo(cw / 2, ch);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cw / 2, ch / 2, (9.15 * cw) / shots.length, 0, Math.PI * 2);
    ctx.stroke();

    // shots
    const sx = cw / shots.length;
    const sy = ch / shots.width;
    const hits: { x: number; y: number; r: number; shot: Shot }[] = [];
    for (const s of shots.shots) {
      const x = s.X * sx;
      const y = s.Y * sy;
      const r = 3 + s.xg * 14;
      const color = TEAM_COLORS[s.team] ?? "#8A90A0";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `${color}55`;
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      hits.push({ x, y, r: Math.max(r, 8), shot: s });
    }
    hitsRef.current = hits;
  }, [shots]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    // Nearest marker within its radius.
    let best: { d: number; shot: Shot } | null = null;
    for (const h of hitsRef.current) {
      const d = Math.hypot(px - h.x, py - h.y);
      if (d <= h.r && (!best || d < best.d)) best = { d, shot: h.shot };
    }
    if (best) onSeek(best.shot.t_ms);
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      className={`w-full rounded-lg ${onSeek ? "cursor-pointer" : ""}`}
    />
  );
}
```


## `football-analysis/src/components/ShotsPanel.tsx`

```ts
import { useState } from "react";
import { useStore } from "../store";
import ShotMap from "./ShotMap";
import { TEAM_COLORS } from "./AnalyzePanel";

/** Shot detection + simple xG (Phase 3b). Requires pitch calibration. */
export default function ShotsPanel() {
  const tracks = useStore((s) => s.tracks);
  const pitch = useStore((s) => s.pitch);
  const shots = useStore((s) => s.shots);
  const computeShots = useStore((s) => s.computeShots);
  const tagShots = useStore((s) => s.tagShots);
  const requestSeek = useStore((s) => s.requestSeek);

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  if (!tracks) return null;

  if (!pitch) {
    return (
      <div className="panel p-3">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          Shots &amp; xG
        </span>
        <p className="text-mist-400 text-sm mt-2">
          Calibrate the pitch (above) to detect shots and estimate xG.
        </p>
      </div>
    );
  }

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="panel p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          Shots &amp; xG
        </span>
        <button
          className="text-mist-300 hover:text-teal-300 transition-colors text-xs"
          disabled={busy}
          onClick={() => run(computeShots)}
        >
          {shots ? "Recompute" : "Detect shots"}
        </button>
      </div>

      {!shots ? (
        <p className="text-mist-400 text-sm">
          Detect shots (fast ball toward goal) and estimate xG from distance and
          angle.
        </p>
      ) : shots.shots.length === 0 ? (
        <p className="text-mist-400 text-sm">
          No shots detected — this depends on ball-tracking quality.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <Stat
              label="Team A xG"
              value={shots.team_xg["0"].toFixed(2)}
              sub={`${shots.team_shots["0"]} shots`}
              color={TEAM_COLORS[0]}
            />
            <Stat
              label="Team B xG"
              value={shots.team_xg["1"].toFixed(2)}
              sub={`${shots.team_shots["1"]} shots`}
              color={TEAM_COLORS[1]}
            />
          </div>

          <ShotMap shots={shots} onSeek={requestSeek} />
          <p className="text-[11px] text-mist-500">
            Dot size ∝ xG. Heuristic estimate — not a trained model.
          </p>

          <div className="flex items-center gap-2">
            <button
              className="btn-accent"
              disabled={busy}
              onClick={() =>
                run(async () => {
                  const n = await tagShots();
                  setMsg(`Added ${n} shot event${n === 1 ? "" : "s"}.`);
                })
              }
            >
              Tag shots on timeline
            </button>
            {msg && <span className="text-xs text-teal-300">{msg}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="card p-2.5 text-center">
      <div className="text-2xl font-semibold tabular-nums" style={{ color }}>
        {value}
      </div>
      <div className="text-[11px] uppercase tracking-wide text-mist-400">{label}</div>
      <div className="text-[11px] text-mist-500">{sub}</div>
    </div>
  );
}
```


## `football-analysis/src/components/Sidebar.tsx`

```ts
import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store";

function readCollapsed(): boolean {
  try {
    return localStorage.getItem("cuddy.sidebarCollapsed") === "1";
  } catch {
    return false;
  }
}

export default function Sidebar() {
  const { projects, currentProjectId, selectProject, addProject } = useStore();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [collapsed, setCollapsed] = useState(readCollapsed);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem("cuddy.sidebarCollapsed", next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const submit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    await addProject(trimmed);
    setName("");
    setAdding(false);
  };

  // Collapsed: a thin rail with just an expand button.
  if (collapsed) {
    return (
      <aside className="w-10 shrink-0 border-r border-ink-500/60 bg-ink-800/40 sticky top-11 self-start h-[calc(100vh-2.75rem)] flex flex-col items-center pt-3">
        <button
          className="text-mist-300 hover:text-teal-300 transition-colors p-1 rounded-lg hover:bg-ink-700"
          onClick={toggleCollapsed}
          title="Show projects"
          aria-label="Show projects"
        >
          »
        </button>
        <span className="mt-3 text-[10px] uppercase tracking-[0.14em] text-mist-500 [writing-mode:vertical-rl]">
          Projects
        </span>
      </aside>
    );
  }

  return (
    <aside className="w-60 shrink-0 border-r border-ink-500/60 bg-ink-800/40 p-3 sticky top-11 self-start h-[calc(100vh-2.75rem)] flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs uppercase tracking-wider text-mist-400">Projects</span>
        <div className="flex items-center gap-1.5">
          <button
            className="text-mist-300 hover:text-teal-300 transition-colors text-lg leading-none"
            onClick={() => setAdding((v) => !v)}
            title="New project"
          >
            +
          </button>
          <button
            className="text-mist-400 hover:text-teal-300 transition-colors text-sm leading-none px-1"
            onClick={toggleCollapsed}
            title="Collapse"
            aria-label="Collapse projects"
          >
            «
          </button>
        </div>
      </div>

      {adding && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="px-1 flex flex-col gap-2 overflow-hidden"
        >
          <input
            autoFocus
            className="input w-full"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              if (e.key === "Escape") setAdding(false);
            }}
          />
          {name.trim() && (
            <motion.button
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="btn-accent w-full justify-center"
              onClick={submit}
            >
              Start project
            </motion.button>
          )}
        </motion.div>
      )}

      <div className="flex-1 overflow-y-auto flex flex-col gap-1 min-h-0">
        {projects.length === 0 && (
          <p className="text-mist-400 text-sm px-1 leading-relaxed">
            No projects yet. Create one to start analysing.
          </p>
        )}
        {projects.map((p) => {
          const active = p.id === currentProjectId;
          return (
            <button
              key={p.id}
              onClick={() => selectProject(p.id)}
              className={`text-left px-3 py-2 rounded-xl text-sm transition-colors duration-200 ease-smooth ${
                active
                  ? "bg-ink-600 text-mist-100 shadow-soft"
                  : "text-mist-200 hover:bg-ink-700"
              }`}
            >
              {p.name}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
```


## `football-analysis/src/components/SourceBadge.tsx`

```ts
// A small, honest badge for where a number came from. Approximate/heuristic
// sources are amber (check me); validated/official sources are teal.
//
// Shared by the AI panel and the match overview so data provenance reads the
// same everywhere (spec §13/§58).

export const SOURCE_LABEL: Record<string, string> = {
  official_match_data: "Official",
  cuddy_video_analysis: "Cuddy CV",
  approximate_cv: "Approx. CV",
  heuristic: "Heuristic",
};

const APPROX = new Set(["approximate_cv", "heuristic"]);

const TITLE: Record<string, string> = {
  official_match_data: "Validated official match data (API-Football)",
  cuddy_video_analysis: "Derived from Cuddy's video analysis",
  approximate_cv: "Approximate — spatial CV, not measured data",
  heuristic: "Heuristic estimate from tracking",
};

export default function SourceBadge({ source }: { source: string }) {
  const label = SOURCE_LABEL[source] ?? source;
  const approx = APPROX.has(source);
  return (
    <span
      className={`px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide ${
        approx ? "bg-amber-500/15 text-amber-300" : "bg-teal-500/15 text-teal-300"
      }`}
      title={TITLE[source] ?? "Data source"}
    >
      {label}
    </span>
  );
}
```


## `football-analysis/src/components/StatsDashboard.tsx`

```ts
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store";
import { api } from "../lib/api";
import SectionHeader from "./SectionHeader";
import SourceBadge from "./SourceBadge";
import { teamCode } from "./TeamBits";
import type {
  Analytics,
  MatchFixtureSummary,
  MatchTeam,
  PlayerHeatmap,
  PlayerStat,
  ShotsData,
  TracksData,
} from "../lib/types";

/** Lowercase, strip accents/punctuation for loose name matching. */
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z\s.]/g, "")
    .trim();
}

/** The surname-ish last token of a name, ignoring initials like "W.". */
function lastToken(s: string): string {
  const parts = norm(s)
    .replace(/\b[a-z]\.\s*/g, "") // drop "w. " style initials
    .split(/\s+/)
    .filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

/**
 * Post-analysis match dashboard: real score, formations and a side-by-side
 * team stats table, plus a Team A / Team B switch for lineups — all from
 * API-Football (validated data, not CV/LLM-derived).
 */
export default function StatsDashboard() {
  const currentVideo = useStore((s) => s.currentVideo());
  const project = useStore((s) => s.currentProject());
  const data = useStore((s) => s.matchData);
  const loading = useStore((s) => s.matchDataLoading);
  const error = useStore((s) => s.matchDataError);
  const keySet = useStore((s) => s.apifootballKeySet);
  const openSettings = useStore((s) => s.openSettings);
  const results = useStore((s) => s.fixtureResults);
  const searching = useStore((s) => s.fixtureSearchLoading);
  const searchError = useStore((s) => s.fixtureSearchError);
  const searchFixtures = useStore((s) => s.searchFixtures);
  const loadFixture = useStore((s) => s.loadFixture);
  const playerStats = useStore((s) => s.playerStats);
  const playerStatsLoading = useStore((s) => s.playerStatsLoading);
  const playerStatsError = useStore((s) => s.playerStatsError);
  const fetchPlayerStats = useStore((s) => s.fetchPlayerStats);
  const selectedPlayerName = useStore((s) => s.selectedPlayerName);
  const selectPlayer = useStore((s) => s.selectPlayer);
  const tracks = useStore((s) => s.tracks);
  const currentVideoId = useStore((s) => s.currentVideoId);
  const assignments = useStore((s) => s.assignments);
  const assignPlayer = useStore((s) => s.assignPlayer);
  const analytics = useStore((s) => s.analytics);
  const shots = useStore((s) => s.shots);

  const [query, setQuery] = useState("");
  const [side, setSide] = useState<"both" | "home" | "away">("both");

  if (!currentVideo) return null;

  // Resolve a lineup name (often abbreviated, e.g. "W. Saliba") to a stat line
  // (full name, e.g. "William Saliba"). Match on the surname / shared token so
  // the two API-Football name formats line up.
  const allStats: PlayerStat[] = playerStats
    ? Object.values(playerStats.by_team).flatMap((t) => t.players)
    : [];
  const resolveStat = (lineupName: string): PlayerStat | undefined => {
    if (!allStats.length) return undefined;
    const key = lastToken(lineupName);
    if (!key) return undefined;
    // Prefer a real surname match; fall back to a name that contains the token.
    return (
      allStats.find((p) => p.name && lastToken(p.name) === key) ??
      allStats.find((p) => p.name && norm(p.name).includes(key))
    );
  };
  const selectedStat = selectedPlayerName ? resolveStat(selectedPlayerName) : undefined;

  const search = (q: string) => q.trim() && searchFixtures(q.trim());

  // --- empty / prompt states ------------------------------------------------
  if (!data) {
    return (
      <div className="panel p-4">
        <Header />
        {!keySet ? (
          <button
            onClick={openSettings}
            className="mt-1 w-full text-left card px-3 py-2.5 text-xs text-mist-300 hover:bg-ink-600 transition-colors flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
            Add a free API-Football key in Settings to pull real match stats,
            lineups and formations.
          </button>
        ) : (
          <div className="mt-1 flex flex-col gap-2">
            <p className="text-xs text-mist-400">
              Search for the match, then pick the exact fixture.
            </p>
            <div className="flex items-center gap-2">
              <input
                className="input flex-1"
                placeholder="e.g. Arsenal vs Chelsea"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search(query)}
              />
              <button
                className="btn-accent"
                disabled={searching || !query.trim()}
                onClick={() => search(query)}
              >
                {searching ? "Searching…" : "Search"}
              </button>
            </div>
            {project && !results.length && (
              <button
                className="text-[11px] text-mist-400 hover:text-teal-300 transition-colors self-start"
                onClick={() => search(project.name)}
              >
                Search project name: "{project.name}"
              </button>
            )}
            {searchError && <p className="text-xs text-signal-live">{searchError}</p>}

            {results.length > 0 && (
              <div className="flex flex-col gap-1 mt-1 max-h-72 overflow-y-auto pr-1">
                {results.map((fx) => (
                  <FixtureRow
                    key={fx.fixture_id}
                    fx={fx}
                    disabled={loading}
                    onClick={() => loadFixture(fx.fixture_id)}
                  />
                ))}
              </div>
            )}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-mist-400 mt-1">
                <span className="w-3 h-3 rounded-full border-2 border-teal-300/40 border-t-teal-300 animate-spin" />
                Loading fixture…
              </div>
            )}
            {error && <p className="text-xs text-signal-live">{error}</p>}
          </div>
        )}
      </div>
    );
  }

  // --- populated dashboard --------------------------------------------------
  const statKeys = orderedStatKeys(data.home.stats, data.away.stats);
  const hasLineups =
    data.home.start_xi.length > 0 || data.away.start_xi.length > 0;

  const homeCode = teamCode(data.home.name);
  const awayCode = teamCode(data.away.name);

  return (
    <motion.div
      className="panel p-4"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Team statistics (scoreline + KPIs live in the full-width MatchHero) */}
      <SectionHeader
        label="Team Statistics"
        className="mb-1"
        right={
          <div className="flex items-center gap-0.5 rounded-lg bg-ink-900/70 p-0.5">
            <SideTab label="Both" active={side === "both"} onClick={() => setSide("both")} />
            <SideTab label={homeCode} active={side === "home"} onClick={() => setSide("home")} />
            <SideTab label={awayCode} active={side === "away"} onClick={() => setSide("away")} />
          </div>
        }
      />
      <div className="mb-2.5">
        <SourceBadge source="official_match_data" />
      </div>

      {statKeys.length > 0 && side === "both" && (
        <>
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-mist-400 mb-1.5 px-0.5">
            <span className="text-teal-300 font-medium">{homeCode}</span>
            <span>Metric</span>
            <span className="text-violet-300 font-medium">{awayCode}</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {statKeys.map((k) => (
              <StatRow key={k} label={k} home={data.home.stats[k]} away={data.away.stats[k]} />
            ))}
          </div>
        </>
      )}
      {statKeys.length > 0 && side !== "both" && (
        <div className="flex flex-col gap-2.5">
          {statKeys.map((k) => (
            <StatLine
              key={k}
              label={k}
              value={(side === "home" ? data.home : data.away).stats[k]}
              accent={side === "home" ? "teal" : "violet"}
            />
          ))}
        </div>
      )}

      {/* Cuddy video-derived analytics — clearly separated from official data
          and labelled by how each number was produced (spec §13/§58). */}
      <CuddyAnalysisSection homeCode={homeCode} awayCode={awayCode} analytics={analytics} shots={shots} />

      {/* Lineups — both XIs for "Both", one otherwise. Names are clickable to
          show that player's real match stats (once loaded). */}
      {hasLineups && (
        <>
          <SectionHeader
            label="Lineups"
            className="mt-5 mb-2.5"
            right={
              !playerStats ? (
                <button
                  className="text-[11px] text-mist-400 hover:text-teal-300 transition-colors disabled:opacity-50"
                  disabled={playerStatsLoading}
                  onClick={() => fetchPlayerStats()}
                >
                  {playerStatsLoading ? "Loading…" : "Load player stats"}
                </button>
              ) : (
                <span className="text-[10px] uppercase tracking-wide text-mist-500">
                  Tap a player
                </span>
              )
            }
          />
          {playerStatsError && (
            <p className="text-xs text-signal-live mb-2">{playerStatsError}</p>
          )}
          {selectedStat && (
            <PlayerStatCard
              stat={selectedStat}
              videoId={currentVideoId}
              tracks={tracks}
              assignedTrackId={
                selectedStat.name ? assignments[selectedStat.name] : undefined
              }
              onAssign={(trackId) =>
                selectedStat.name && assignPlayer(selectedStat.name, trackId)
              }
              onClose={() => selectPlayer(null)}
            />
          )}
          <div className="grid gap-4">
            {(side === "both" || side === "home") &&
              data.home.start_xi.length > 0 && (
                <Lineup
                  team={data.home}
                  accent="teal"
                  resolveStat={resolveStat}
                  hasStats={allStats.length > 0}
                  selectedName={selectedPlayerName}
                  onPick={selectPlayer}
                />
              )}
            {(side === "both" || side === "away") &&
              data.away.start_xi.length > 0 && (
                <Lineup
                  team={data.away}
                  accent="violet"
                  resolveStat={resolveStat}
                  hasStats={allStats.length > 0}
                  selectedName={selectedPlayerName}
                  onPick={selectPlayer}
                />
              )}
          </div>
        </>
      )}
    </motion.div>
  );
}

/** Compact card of a player's real match stats (API-Football) + a per-player
 *  heatmap from CV tracks once the player is assigned to a tracked number. */
function PlayerStatCard({
  stat,
  videoId,
  tracks,
  assignedTrackId,
  onAssign,
  onClose,
}: {
  stat: PlayerStat;
  videoId: number | null;
  tracks: TracksData | null;
  assignedTrackId?: number;
  onAssign: (trackId: number) => void;
  onClose: () => void;
}) {
  // API-Football reports passes.accuracy as the COUNT of accurate passes;
  // derive the completion percentage from total rather than mislabelling it.
  const acc =
    typeof stat.pass_accuracy === "number" &&
    stat.passes > 0 &&
    stat.pass_accuracy <= stat.passes
      ? Math.round((stat.pass_accuracy / stat.passes) * 100)
      : null;
  const cells: [string, string | number][] = [
    ["Rating", stat.rating ?? "—"],
    ["Mins", stat.minutes ?? "—"],
    ["Goals", stat.goals],
    ["Assists", stat.assists],
    ["Shots", `${stat.shots}${stat.shots_on ? ` (${stat.shots_on})` : ""}`],
    ["Passes", stat.passes],
    ["Pass %", acc != null ? `${acc}%` : "—"],
    ["Key passes", stat.key_passes],
    ["Tackles", stat.tackles],
    ["Interc.", stat.interceptions],
    ["Duels won", `${stat.duels_won}/${stat.duels_total}`],
    ["Dribbles", stat.dribbles],
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-3 mb-3"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {stat.number != null && (
            <span className="w-5 h-5 grid place-items-center rounded-md bg-teal-400/20 text-teal-200 text-[10px] font-semibold tabular-nums shrink-0">
              {stat.number}
            </span>
          )}
          <span className="text-sm font-medium text-mist-100 truncate">{stat.name}</span>
          {stat.position && (
            <span className="text-[10px] uppercase text-mist-500">{stat.position}</span>
          )}
          {stat.rating != null && (
            <span className="text-[11px] tabular-nums text-teal-300">{stat.rating}</span>
          )}
        </div>
        <button
          className="text-mist-500 hover:text-mist-200 transition-colors text-sm leading-none"
          onClick={onClose}
          aria-label="Close player stats"
        >
          ×
        </button>
      </div>
      <div className="grid grid-cols-3 gap-x-3 gap-y-1.5">
        {cells.map(([k, v]) => (
          <div key={k} className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wide text-mist-500">{k}</span>
            <span className="text-sm tabular-nums text-mist-100">{v}</span>
          </div>
        ))}
      </div>

      <PlayerHeatmapSection
        videoId={videoId}
        tracks={tracks}
        assignedTrackId={assignedTrackId}
        onAssign={onAssign}
      />
    </motion.div>
  );
}

/** Heatmap block inside the player card: assign the named player to a CV track
 *  number, then render that track's heatmap (approximate — from footage). */
function PlayerHeatmapSection({
  videoId,
  tracks,
  assignedTrackId,
  onAssign,
}: {
  videoId: number | null;
  tracks: TracksData | null;
  assignedTrackId?: number;
  onAssign: (trackId: number) => void;
}) {
  const [hm, setHm] = useState<PlayerHeatmap | null>(null);
  const [loading, setLoading] = useState(false);
  const [reassign, setReassign] = useState(false);

  // Track ids present in the analysis (person detections), sorted by how often
  // they appear so the most-tracked players are offered first.
  const trackIds = useMemo(() => {
    if (!tracks) return [] as number[];
    const counts = new Map<number, number>();
    for (const f of tracks.frames) {
      for (const d of f.dets) {
        if (d.cls === 32) continue;
        counts.set(d.id, (counts.get(d.id) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id)
      .slice(0, 40);
  }, [tracks]);

  useEffect(() => {
    let cancelled = false;
    if (videoId == null || assignedTrackId == null) {
      setHm(null);
      return;
    }
    setLoading(true);
    api
      .getPlayerHeatmap(videoId, assignedTrackId)
      .then((d) => !cancelled && setHm(d))
      .catch(() => !cancelled && setHm(null))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [videoId, assignedTrackId]);

  if (!tracks) {
    return (
      <p className="text-[11px] text-mist-500 mt-3">
        Analyse the video to enable a per-player heatmap.
      </p>
    );
  }

  const showPicker = assignedTrackId == null || reassign;

  return (
    <div className="mt-3 pt-3 border-t border-ink-500/40">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-wide text-mist-500">
          Heatmap{" "}
          <span className="text-mist-600 normal-case">
            {hm?.space === "image" ? "· camera view (approx.)" : hm?.space === "pitch" ? "· pitch" : ""}
          </span>
        </span>
        {assignedTrackId != null && !reassign && (
          <button
            className="text-[11px] text-mist-400 hover:text-teal-300 transition-colors"
            onClick={() => setReassign(true)}
          >
            #{assignedTrackId} · reassign
          </button>
        )}
      </div>

      {showPicker ? (
        <div>
          <p className="text-[11px] text-mist-400 mb-1.5">
            Link this player to their tracked number (hover a marker on the video
            to read numbers):
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {trackIds.map((id) => (
              <button
                key={id}
                className={`px-2 py-0.5 rounded-md text-[11px] tabular-nums border transition-colors ${
                  id === assignedTrackId
                    ? "bg-teal-400/20 border-teal-400/60 text-mist-100"
                    : "border-ink-500/60 text-mist-300 hover:bg-ink-600"
                }`}
                onClick={() => {
                  onAssign(id);
                  setReassign(false);
                }}
              >
                #{id}
              </button>
            ))}
            {trackIds.length === 0 && (
              <span className="text-[11px] text-mist-500">No tracked players found.</span>
            )}
          </div>
        </div>
      ) : loading ? (
        <div className="h-28 grid place-items-center text-[11px] text-mist-500">
          Building heatmap…
        </div>
      ) : hm && hm.n_points > 0 ? (
        <MiniHeatmap hm={hm} />
      ) : (
        <p className="text-[11px] text-mist-500">
          No positions tracked for #{assignedTrackId}. Try another number.
        </p>
      )}
    </div>
  );
}

/** Renders a normalized heat grid as red blooms over a pitch/camera rectangle. */
function MiniHeatmap({ hm }: { hm: PlayerHeatmap }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = (canvas.width = canvas.clientWidth);
    const ch = (canvas.height = canvas.clientHeight);
    const cols = hm.bins_x;
    const rows = hm.bins_y;
    // Ground.
    if (hm.space === "pitch") {
      ctx.fillStyle = "#14352a";
      ctx.fillRect(0, 0, cw, ch);
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1;
      ctx.strokeRect(3, 3, cw - 6, ch - 6);
      ctx.beginPath();
      ctx.moveTo(cw / 2, 3);
      ctx.lineTo(cw / 2, ch - 3);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cw / 2, ch / 2, Math.min(cw, ch) * 0.12, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = "#0C0E16";
      ctx.fillRect(0, 0, cw, ch);
    }
    // Heat blooms.
    ctx.globalCompositeOperation = "lighter";
    const bw = cw / cols;
    const bh = ch / rows;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const v = hm.grid[y]?.[x] ?? 0;
        if (v <= 0.02) continue;
        const cx = (x + 0.5) * bw;
        const cy = (y + 0.5) * bh;
        const r = Math.max(bw, bh) * 1.6;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `rgba(255,80,60,${Math.min(0.9, v)})`);
        g.addColorStop(1, "rgba(255,80,60,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalCompositeOperation = "source-over";
  }, [hm]);
  return (
    <div>
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg border border-ink-500/50"
        style={{ aspectRatio: hm.space === "pitch" ? "105 / 68" : "16 / 9" }}
      />
      <p className="text-[10px] text-mist-500 mt-1">
        {hm.n_points} tracked positions · approximate spatial layer, not measured data.
      </p>
    </div>
  );
}

/** Video-derived metrics, each tagged with how it was produced. Kept visually
 *  distinct from the official API-Football table above so the two data sources
 *  are never conflated. */
function CuddyAnalysisSection({
  homeCode,
  awayCode,
  analytics,
  shots,
}: {
  homeCode: string;
  awayCode: string;
  analytics: Analytics | null;
  shots: ShotsData | null;
}) {
  const rows: { label: string; value: string; source: string }[] = [];
  if (analytics?.possession_pct) {
    const p = analytics.possession_pct;
    rows.push({
      label: "Possession",
      value: `${Math.round(p["0"])}% / ${Math.round(p["1"])}%`,
      source: "heuristic",
    });
  }
  if (analytics?.passes) {
    rows.push({
      label: "Passes",
      value: `${analytics.passes["0"]} / ${analytics.passes["1"]}`,
      source: "heuristic",
    });
  }
  if (analytics && typeof analytics.turnovers === "number") {
    rows.push({ label: "Turnovers", value: String(analytics.turnovers), source: "heuristic" });
  }
  if (shots?.team_xg) {
    rows.push({
      label: "xG",
      value: `${shots.team_xg["0"].toFixed(2)} / ${shots.team_xg["1"].toFixed(2)}`,
      source: "cuddy_video_analysis",
    });
  }
  if (shots?.team_shots) {
    rows.push({
      label: "Shots (detected)",
      value: `${shots.team_shots["0"]} / ${shots.team_shots["1"]}`,
      source: "cuddy_video_analysis",
    });
  }

  return (
    <>
      <SectionHeader
        label="Cuddy Video Analysis"
        className="mt-5 mb-1"
        right={
          <span className="text-[10px] uppercase tracking-wide text-mist-500">
            {homeCode} / {awayCode}
          </span>
        }
      />
      {rows.length === 0 ? (
        <p className="text-xs text-mist-400">
          Run analysis to compute video-derived metrics (possession, xG, turnovers).
          These are approximate, not official data.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between card px-2.5 py-1.5 text-sm"
            >
              <span className="text-mist-300 text-[11px] uppercase tracking-wide">
                {r.label}
              </span>
              <span className="flex items-center gap-2">
                <span className="tabular-nums text-mist-100">{r.value}</span>
                <SourceBadge source={r.source} />
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Lineup({
  team,
  accent,
  resolveStat,
  hasStats,
  selectedName,
  onPick,
}: {
  team: MatchTeam;
  accent: "teal" | "violet";
  resolveStat?: (name: string) => PlayerStat | undefined;
  hasStats?: boolean;
  selectedName?: string | null;
  onPick?: (name: string | null) => void;
}) {
  const dot = accent === "teal" ? "bg-teal-400" : "bg-violet-400";
  const form = accent === "teal" ? "text-teal-300" : "text-violet-300";
  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-mist-400 mb-1.5">
        {team.logo ? (
          <img src={team.logo} alt="" className="w-4 h-4 object-contain shrink-0" />
        ) : (
          <span className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
        )}
        <span className={`tabular-nums ${form}`}>{team.formation ?? "—"}</span>
        <span className="truncate">{team.name}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {team.start_xi.map((p) => {
          const hasStat = hasStats ? !!resolveStat?.(p) : false;
          const selected = selectedName === p;
          const cls = `px-2 py-0.5 rounded-md text-[11px] border transition-colors ${
            selected
              ? "bg-teal-400/20 border-teal-400/60 text-mist-100"
              : "text-mist-200 bg-ink-700/60 border-ink-500/50"
          } ${hasStat ? "hover:bg-ink-600 cursor-pointer" : ""}`;
          return hasStat && onPick ? (
            <button
              key={p}
              className={cls}
              onClick={() => onPick(selected ? null : p)}
              title="Show match stats"
            >
              {p}
            </button>
          ) : (
            <span key={p} className={cls}>
              {p}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** Single-team stat line with a proportional bar (0–100 scaled or share). */
function StatLine({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number | null;
  accent: "teal" | "violet";
}) {
  const bar = accent === "teal" ? "bg-teal-400/80" : "bg-violet-400/80";
  const n = num(value);
  // Percent-like values fill by magnitude; others just show a full subtle bar.
  const pct =
    n != null && n >= 0 && n <= 100 && /%|Possession|Passes %/i.test(label)
      ? n
      : null;
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-mist-400 text-[11px] uppercase tracking-wide">{label}</span>
        <span className="tabular-nums text-mist-100">{fmt(value)}</span>
      </div>
      {pct != null && (
        <div className="mt-1 h-1.5">
          <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  );
}

function FixtureRow({
  fx,
  disabled,
  onClick,
}: {
  fx: MatchFixtureSummary;
  disabled: boolean;
  onClick: () => void;
}) {
  const meta = [fx.competition, fx.date].filter(Boolean).join(" · ");
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="card px-2.5 py-2 text-left hover:bg-ink-600 transition-colors disabled:opacity-50"
    >
      <div className="flex items-center gap-2 text-sm text-mist-100">
        <span className="flex-1 min-w-0 flex items-center gap-1.5 justify-end">
          <span className="truncate text-right">{fx.home}</span>
          <FixtureLogo src={fx.home_logo} />
        </span>
        <span className="tabular-nums text-teal-300 shrink-0 px-1">{fx.score ?? "vs"}</span>
        <span className="flex-1 min-w-0 flex items-center gap-1.5">
          <FixtureLogo src={fx.away_logo} />
          <span className="truncate">{fx.away}</span>
        </span>
      </div>
      {meta && <div className="text-[11px] text-mist-500 mt-0.5">{meta}</div>}
    </button>
  );
}

function FixtureLogo({ src }: { src?: string | null }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      className="w-4 h-4 object-contain shrink-0"
      onError={(e) => (e.currentTarget.style.display = "none")}
    />
  );
}

function Header({
  competition,
  date,
  onChange,
}: {
  competition?: string | null;
  date?: string | null;
  onChange?: () => void;
}) {
  const sub = [competition, date].filter(Boolean).join(" · ");
  return (
    <SectionHeader
      label="Match — API-Football · Validated"
      right={
        <div className="flex items-center gap-3 min-w-0">
          {sub && <span className="text-[11px] text-mist-400 truncate">{sub}</span>}
          {onChange && (
            <button
              className="text-[11px] text-mist-400 hover:text-teal-300 transition-colors shrink-0"
              onClick={onChange}
            >
              Change fixture
            </button>
          )}
        </div>
      }
    />
  );
}

function StatRow({
  label,
  home,
  away,
}: {
  label: string;
  home: string | number | null;
  away: string | number | null;
}) {
  const h = num(home);
  const a = num(away);
  const total = (h ?? 0) + (a ?? 0);
  const hPct = total > 0 ? ((h ?? 0) / total) * 100 : 50;
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="tabular-nums text-mist-100 w-12">{fmt(home)}</span>
        <span className="text-mist-400 text-[11px] uppercase tracking-wide">{label}</span>
        <span className="tabular-nums text-mist-100 w-12 text-right">{fmt(away)}</span>
      </div>
      <div className="flex items-center gap-1 mt-1 h-1.5">
        <div className="flex-1 flex justify-end">
          <div className="h-full rounded-full bg-teal-400/80" style={{ width: `${hPct}%` }} />
        </div>
        <div className="flex-1">
          <div
            className="h-full rounded-full bg-violet-400/80"
            style={{ width: `${100 - hPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function SideTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-md text-xs transition-colors max-w-[9rem] truncate ${
        active ? "bg-ink-600 text-mist-100" : "text-mist-400 hover:text-mist-200"
      }`}
    >
      {label}
    </button>
  );
}

// Preferred stat order; anything else follows in first-seen order.
const PREFERRED = [
  "Ball Possession",
  "Total Shots",
  "Shots on Goal",
  "Shots off Goal",
  "Total passes",
  "Passes accurate",
  "Passes %",
  "Fouls",
  "Corner Kicks",
  "Offsides",
  "Yellow Cards",
  "Red Cards",
];

function orderedStatKeys(
  home: Record<string, unknown>,
  away: Record<string, unknown>,
): string[] {
  const keys = new Set([...Object.keys(home), ...Object.keys(away)]);
  const preferred = PREFERRED.filter((k) => keys.has(k));
  const rest = [...keys].filter((k) => !PREFERRED.includes(k));
  return [...preferred, ...rest];
}

function num(v: string | number | null): number | null {
  if (v == null) return null;
  if (typeof v === "number") return v;
  const m = String(v).match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}

function fmt(v: string | number | null): string {
  if (v == null || v === "") return "—";
  return String(v);
}
```


## `football-analysis/src/components/StudioLayer.tsx`

```ts
import { useEffect, useRef, useState } from "react";
import { useStore } from "../store";
import { nearestPlayerAt, trackPosAt } from "../lib/tracks";
import type { StudioShape, StudioTool } from "../lib/types";

// The SVG works in a fixed 16:9 space; the container is `aspect-video` so the
// scale to the video box is uniform (no distortion). Geometry is stored
// normalized [0..1] and mapped into this space at render time.
const W = 1600;
const H = 900;
const STROKE = 5;

interface Props {
  getVideo: () => HTMLVideoElement | null;
  playing: boolean;
  ms: number;
}

type Draft = {
  type: StudioTool;
  geom: [number, number][];
  vertexTracks?: (number | null)[];
} | null;

const TWO_POINT: StudioTool[] = ["arrow", "box", "zone"];
const N_POINT: StudioTool[] = ["path", "shape"];

let shapeSeq = 0;
const newId = () => `s${Date.now().toString(36)}${(shapeSeq++).toString(36)}`;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Telestration drawing + rendering surface, overlaid on the video. */
export default function StudioLayer({ getVideo, playing, ms }: Props) {
  const shapes = useStore((s) => s.studioShapes);
  const tool = useStore((s) => s.studioTool);
  const color = useStore((s) => s.studioColor);
  const selectedId = useStore((s) => s.selectedShapeId);
  const pinArm = useStore((s) => s.studioPinArm);
  const tracks = useStore((s) => s.tracks);
  const addShape = useStore((s) => s.addShape);
  const updateShape = useStore((s) => s.updateShape);
  const selectShape = useStore((s) => s.selectShape);
  const deleteShape = useStore((s) => s.deleteShape);
  const pinShapeToTrack = useStore((s) => s.pinShapeToTrack);
  const armPin = useStore((s) => s.armPin);
  const undoStudio = useStore((s) => s.undoStudio);
  const pushStudioHistory = useStore((s) => s.pushStudioHistory);

  const svgRef = useRef<SVGSVGElement>(null);
  const [draft, setDraft] = useState<Draft>(null);
  // Smooth follow: while playing, drive the clock off the video via rAF; the
  // timeupdate-based `ms` prop is too coarse for graphics that track a player.
  const [liveMs, setLiveMs] = useState(ms);
  useEffect(() => {
    if (!playing) setLiveMs(ms);
  }, [ms, playing]);
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const loop = () => {
      const v = getVideo();
      if (v) setLiveMs(v.currentTime * 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, getVideo]);
  const curMs = playing ? liveMs : ms;

  // Delete the selected shape with Delete/Backspace (unless typing in a field).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA") return;
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        deleteShape(selectedId);
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        setDraft(null);
        undoStudio();
      }
      if (e.key === "Escape") {
        setDraft(null);
        armPin(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, deleteShape, armPin, undoStudio]);

  const drawing = tool !== null;
  const bgInteractive = drawing || pinArm;

  const toNorm = (clientX: number, clientY: number): [number, number] => {
    const rect = svgRef.current!.getBoundingClientRect();
    return [
      clamp01((clientX - rect.left) / rect.width),
      clamp01((clientY - rect.top) / rect.height),
    ];
  };

  const commitShape = (
    type: StudioTool,
    geom: [number, number][],
    label?: string,
    vertexTracks?: (number | null)[],
  ) => {
    addShape({ id: newId(), type, color, geom, label, vertexTracks });
  };

  const handlePin = (n: [number, number]) => {
    if (!selectedId || !tracks) {
      armPin(false);
      return;
    }
    const hit = nearestPlayerAt(tracks, curMs, n[0], n[1]);
    if (hit) pinShapeToTrack(selectedId, hit.id, hit.pos);
    else armPin(false);
  };

  // --- background interactions (draw / place / pin) ---
  const onBgMouseDown = (e: React.MouseEvent) => {
    if (!bgInteractive) return;
    e.preventDefault();
    const n = toNorm(e.clientX, e.clientY);
    if (pinArm) {
      handlePin(n);
      return;
    }
    if (!tool) return;
    if (tool === "highlight") {
      commitShape("highlight", [n]);
      return;
    }
    if (tool === "text") {
      const label = window.prompt("Label text");
      if (label && label.trim()) commitShape("text", [n], label.trim());
      return;
    }
    if (TWO_POINT.includes(tool)) {
      setDraft({ type: tool, geom: [n, n] });
      const move = (ev: MouseEvent) =>
        setDraft((d) => (d ? { ...d, geom: [d.geom[0], toNorm(ev.clientX, ev.clientY)] } : d));
      const up = (ev: MouseEvent) => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
        const end = toNorm(ev.clientX, ev.clientY);
        const [sx, sy] = n;
        const dist = Math.hypot(end[0] - sx, end[1] - sy);
        setDraft(null);
        if (dist > 0.012) commitShape(tool, [n, end]);
      };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    }
  };

  const onBgClick = (e: React.MouseEvent) => {
    if (!tool) return;
    const n = toNorm(e.clientX, e.clientY);
    if (tool === "link") {
      // Each click must land on a tracked player: the vertex pins to that
      // player so the shape connects players and deforms as they move. Clicks
      // that miss every player are ignored (no free-floating vertices).
      const hit = tracks ? nearestPlayerAt(tracks, curMs, n[0], n[1]) : null;
      if (!hit) return;
      setDraft((d) =>
        d && d.type === "link"
          ? { ...d, geom: [...d.geom, hit.pos], vertexTracks: [...(d.vertexTracks ?? []), hit.id] }
          : { type: "link", geom: [hit.pos], vertexTracks: [hit.id] },
      );
      return;
    }
    if (!N_POINT.includes(tool)) return;
    setDraft((d) =>
      d && d.type === tool ? { ...d, geom: [...d.geom, n] } : { type: tool, geom: [n] },
    );
  };

  const onBgDoubleClick = () => {
    setDraft((d) => {
      if (!d) return null;
      if (d.type === "link" && d.geom.length >= 3) {
        // drop the duplicate final point from the finishing double-click
        const geom = d.geom.slice(0, -1);
        const vt = (d.vertexTracks ?? []).slice(0, geom.length);
        if (geom.length >= 2) commitShape("link", geom, undefined, vt);
      } else if (N_POINT.includes(d.type) && d.geom.length >= 2) {
        const geom = d.geom.slice(0, -1);
        if (geom.length >= 2) commitShape(d.type, geom);
      }
      return null;
    });
  };

  // --- move a selected shape by dragging it ---
  const startMove = (e: React.MouseEvent, shape: StudioShape) => {
    e.stopPropagation();
    selectShape(shape.id);
    if (drawing || pinArm) return; // don't move while drawing/pinning
    pushStudioHistory();
    const start = toNorm(e.clientX, e.clientY);
    const orig = shape.geom;
    const move = (ev: MouseEvent) => {
      const p = toNorm(ev.clientX, ev.clientY);
      const dx = p[0] - start[0];
      const dy = p[1] - start[1];
      updateShape(shape.id, {
        geom: orig.map(([x, y]) => [clamp01(x + dx), clamp01(y + dy)] as [number, number]),
      });
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none", cursor: bgInteractive ? "crosshair" : "default" }}
    >
      {/* Background capture layer — active only when drawing or pinning. */}
      <rect
        x={0}
        y={0}
        width={W}
        height={H}
        fill="transparent"
        style={{ pointerEvents: bgInteractive ? "auto" : "none" }}
        onMouseDown={onBgMouseDown}
        onClick={onBgClick}
        onDoubleClick={onBgDoubleClick}
      />

      {shapes.map((shape) => {
        const geom = resolveGeom(shape, curMs, tracks);
        if (!geom) return null; // pinned track dropped out — hide
        return (
          <ShapeView
            key={shape.id}
            shape={shape}
            geom={geom}
            selected={shape.id === selectedId}
            onMouseDown={(e) => startMove(e, shape)}
          />
        );
      })}

      {draft && <ShapeView shape={{ ...DRAFT_META, type: draft.type, color }} geom={draft.geom} draft />}
    </svg>
  );
}

const DRAFT_META = { id: "draft", geom: [] as [number, number][] };

/** Live geometry: per-vertex player tracking, else rigid single-pin follow. */
function resolveGeom(
  shape: StudioShape,
  ms: number,
  tracks: ReturnType<typeof useStore.getState>["tracks"],
): [number, number][] | null {
  // Per-vertex: each point follows its own player (shape deforms).
  if (shape.vertexTracks && tracks) {
    return shape.geom.map(([x, y], i) => {
      const tid = shape.vertexTracks![i];
      if (tid == null) return [x, y] as [number, number];
      const cur = trackPosAt(tracks, tid, ms);
      return cur ?? ([x, y] as [number, number]); // hold last authored if lost
    });
  }
  // Rigid: whole shape translates with one pinned player.
  if (shape.pinnedTrackId != null && shape.pinPos && tracks) {
    const cur = trackPosAt(tracks, shape.pinnedTrackId, ms);
    if (!cur) return null;
    const dx = cur[0] - shape.pinPos[0];
    const dy = cur[1] - shape.pinPos[1];
    return shape.geom.map(([x, y]) => [x + dx, y + dy]);
  }
  return shape.geom;
}

const px = (p: [number, number]): [number, number] => [p[0] * W, p[1] * H];

function ShapeView({
  shape,
  geom,
  selected,
  draft,
  onMouseDown,
}: {
  shape: { id: string; type: StudioTool; color: string; label?: string; pinnedTrackId?: number };
  geom: [number, number][];
  selected?: boolean;
  draft?: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
}) {
  const c = shape.color;
  const fill = `${c}33`;
  const pts = geom.map(px);
  const interactive = !draft;
  const wrap = (children: React.ReactNode) => (
    <g
      style={{ pointerEvents: interactive ? "auto" : "none", cursor: interactive ? "move" : "inherit" }}
      onMouseDown={onMouseDown}
    >
      {children}
      {selected && pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={7} fill="#fff" stroke={c} strokeWidth={2} />
      ))}
    </g>
  );

  if (shape.type === "arrow" && pts.length >= 2) {
    const [a, b] = [pts[0], pts[pts.length - 1]];
    return wrap(
      <>
        <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={c} strokeWidth={STROKE} strokeLinecap="round" />
        <polygon points={arrowHead(a[0], a[1], b[0], b[1], 26)} fill={c} />
      </>,
    );
  }
  if (shape.type === "path" && pts.length >= 2) {
    const last = pts[pts.length - 1];
    const prev = pts[pts.length - 2];
    return wrap(
      <>
        <polyline
          points={pts.map((p) => p.join(",")).join(" ")}
          fill="none"
          stroke={c}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polygon points={arrowHead(prev[0], prev[1], last[0], last[1], 24)} fill={c} />
      </>,
    );
  }
  if ((shape.type === "box" || shape.type === "zone") && pts.length >= 2) {
    const x = Math.min(pts[0][0], pts[1][0]);
    const y = Math.min(pts[0][1], pts[1][1]);
    const w = Math.abs(pts[1][0] - pts[0][0]);
    const h = Math.abs(pts[1][1] - pts[0][1]);
    return wrap(
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        fill={shape.type === "zone" ? fill : "transparent"}
        stroke={c}
        strokeWidth={STROKE}
        strokeDasharray={shape.type === "box" ? "12 8" : undefined}
      />,
    );
  }
  if (shape.type === "shape" && pts.length >= 2) {
    return wrap(
      <polygon
        points={pts.map((p) => p.join(",")).join(" ")}
        fill={fill}
        stroke={c}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />,
    );
  }
  if (shape.type === "link" && pts.length >= 1) {
    // Players connected by lines; ≥3 closes into a filled shape. Vertices show
    // a ring so it reads as "these players", and it deforms as they move.
    const closed = pts.length >= 3;
    return wrap(
      <>
        {closed ? (
          <polygon
            points={pts.map((p) => p.join(",")).join(" ")}
            fill={fill}
            stroke={c}
            strokeWidth={STROKE}
            strokeLinejoin="round"
          />
        ) : (
          <polyline
            points={pts.map((p) => p.join(",")).join(" ")}
            fill="none"
            stroke={c}
            strokeWidth={STROKE}
            strokeLinecap="round"
          />
        )}
        {(draft || selected) &&
          pts.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={9} fill={`${c}55`} stroke={c} strokeWidth={2.5} />
          ))}
      </>,
    );
  }
  if (shape.type === "highlight" && pts[0]) {
    const [x, y] = pts[0];
    return wrap(
      <>
        <ellipse cx={x} cy={y} rx={52} ry={24} fill={fill} stroke={c} strokeWidth={STROKE} />
        <ellipse cx={x} cy={y} rx={30} ry={14} fill="none" stroke={c} strokeWidth={2} opacity={0.6} />
      </>,
    );
  }
  if (shape.type === "text" && pts[0]) {
    const [x, y] = pts[0];
    return wrap(
      <text
        x={x}
        y={y}
        fontSize={34}
        fontWeight={700}
        fill={c}
        stroke="#0A0C12"
        strokeWidth={5}
        paintOrder="stroke"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      >
        {shape.label ?? ""}
      </text>,
    );
  }
  return null;
}

function arrowHead(x1: number, y1: number, x2: number, y2: number, size: number): string {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const a1 = angle + Math.PI - 0.42;
  const a2 = angle + Math.PI + 0.42;
  return [
    `${x2},${y2}`,
    `${x2 + size * Math.cos(a1)},${y2 + size * Math.sin(a1)}`,
    `${x2 + size * Math.cos(a2)},${y2 + size * Math.sin(a2)}`,
  ].join(" ");
}
```


## `football-analysis/src/components/StudioToolbar.tsx`

```ts
import { useStore } from "../store";
import type { StudioTool } from "../lib/types";
import SectionHeader from "./SectionHeader";

const TOOLS: { tool: StudioTool; label: string; hint: string }[] = [
  { tool: "arrow", label: "Arrow", hint: "Drag to draw an arrow" },
  { tool: "highlight", label: "Spotlight", hint: "Click to spotlight a player" },
  { tool: "box", label: "Box", hint: "Drag a bounding box" },
  { tool: "zone", label: "Zone", hint: "Drag a filled zone" },
  { tool: "path", label: "Path", hint: "Click points, double-click to finish" },
  { tool: "shape", label: "Shape", hint: "Click points, double-click to finish" },
  { tool: "text", label: "Text", hint: "Click to place a label" },
  {
    tool: "link",
    label: "Link players",
    hint: "Click players to connect them; double-click to finish. The shape follows and deforms as they move.",
  },
];

const COLORS = ["#F5C24B", "#6E75F5", "#F2555A", "#29E0C4", "#EAECF2", "#F59E42"];

/**
 * Studio telestration controls: pick a tool + colour, pin a graphic to a tracked
 * player so it follows them, and manage the current drawing.
 */
export default function StudioToolbar() {
  const tool = useStore((s) => s.studioTool);
  const setTool = useStore((s) => s.setStudioTool);
  const color = useStore((s) => s.studioColor);
  const setColor = useStore((s) => s.setStudioColor);
  const shapes = useStore((s) => s.studioShapes);
  const selectedId = useStore((s) => s.selectedShapeId);
  const deleteShape = useStore((s) => s.deleteShape);
  const updateShape = useStore((s) => s.updateShape);
  const clearStudio = useStore((s) => s.clearStudio);
  const armPin = useStore((s) => s.armPin);
  const pinArm = useStore((s) => s.studioPinArm);
  const tracks = useStore((s) => s.tracks);
  const undoStudio = useStore((s) => s.undoStudio);
  const canUndo = useStore((s) => s.studioHistory.length > 0);

  const selected = shapes.find((s) => s.id === selectedId) ?? null;
  const canPin = !!selected && !!tracks;
  const activeHint = pinArm
    ? "Click a player to pin the selected graphic to them."
    : tool
      ? TOOLS.find((t) => t.tool === tool)?.hint
      : selected
        ? "Drag to move · Delete to remove · Pin to a player to follow."
        : "Pick a tool to start drawing over the video.";

  return (
    <div className="panel p-3">
      <SectionHeader
        label="Studio"
        className="mb-2 px-0.5"
        right={
          <div className="flex items-center gap-3">
            <button
              className="text-[11px] text-mist-400 hover:text-teal-300 transition-colors disabled:opacity-40 disabled:hover:text-mist-400"
              onClick={undoStudio}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
            >
              ↶ Undo
            </button>
            {shapes.length > 0 && (
              <button
                className="text-[11px] text-mist-400 hover:text-signal-live transition-colors"
                onClick={clearStudio}
              >
                Clear all
              </button>
            )}
          </div>
        }
      />

      <div className="flex flex-wrap gap-1.5">
        {TOOLS.map((t) => (
          <button
            key={t.tool}
            title={t.hint}
            onClick={() => setTool(tool === t.tool ? null : t.tool)}
            className={`px-2.5 py-1 rounded-lg text-xs transition-colors border ${
              tool === t.tool
                ? "bg-teal-500/20 border-teal-400/60 text-mist-100"
                : "border-ink-500/60 text-mist-300 hover:bg-ink-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-3">
        <span className="text-[11px] text-mist-400">Colour</span>
        <div className="flex items-center gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              aria-label={`Colour ${c}`}
              onClick={() => setColor(c)}
              className={`w-5 h-5 rounded-full transition-transform ${
                color === c ? "ring-2 ring-white/80 scale-110" : "ring-1 ring-black/30"
              }`}
              style={{ background: c }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <button
          className="btn h-7 py-0 disabled:opacity-40"
          onClick={undoStudio}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          ↶ Undo
        </button>
        <button
          className={`btn h-7 py-0 ${pinArm ? "bg-teal-500/25 text-mist-100" : ""}`}
          disabled={!canPin}
          title={
            tracks
              ? "Pin the selected graphic to a tracked player so it follows them"
              : "Analyse the video first to track players"
          }
          onClick={() => armPin(!pinArm)}
        >
          {pinArm ? "Click a player…" : "Pin to player"}
        </button>
        {selected?.pinnedTrackId != null && (
          <button
            className="btn h-7 py-0"
            onClick={() => updateShape(selected.id, { pinnedTrackId: undefined, pinPos: undefined })}
          >
            Unpin
          </button>
        )}
        {selected && (
          <button
            className="btn h-7 py-0 text-signal-live"
            onClick={() => deleteShape(selected.id)}
          >
            Delete
          </button>
        )}
      </div>

      <p className="text-[11px] text-mist-500 mt-2 leading-relaxed">{activeHint}</p>
    </div>
  );
}
```


## `football-analysis/src/components/TeamBits.tsx`

```ts
import type { MatchTeam } from "../lib/types";

/** Short 3-letter team code from an explicit abbrev, else the name. */
export function teamCode(name?: string | null): string {
  if (!name) return "—";
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0] + (words[1][1] ?? "")).toUpperCase();
  return name.slice(0, 3).toUpperCase();
}

/** Team badge: the crest if available, else a blurple rounded-square code chip. */
export function TeamBadge({ team, size = 8 }: { team: MatchTeam; size?: number }) {
  const dim = `${size * 4}px`;
  if (team.logo) {
    return (
      <img
        src={team.logo}
        alt=""
        style={{ width: dim, height: dim }}
        className="object-contain shrink-0"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
    );
  }
  return (
    <span
      style={{ width: dim, height: dim }}
      className="shrink-0 grid place-items-center rounded-lg bg-teal-400/20 text-teal-200 text-[11px] font-semibold tabular-nums"
    >
      {teamCode(team.name)}
    </span>
  );
}

/** Scoreline team block: badge + name + "formation · Home/Away". */
export function TeamHead({
  team,
  align,
  size = 8,
}: {
  team: MatchTeam;
  align: "left" | "right";
  size?: number;
}) {
  const side = align === "right" ? "Home" : "Away";
  const meta = [team.formation, side].filter(Boolean).join(" · ");
  return (
    <div
      className={`flex items-center gap-2.5 ${
        align === "right" ? "flex-row-reverse text-right" : "text-left"
      }`}
    >
      <TeamBadge team={team} size={size} />
      <div className="min-w-0">
        <div className="text-base font-semibold text-mist-100 truncate leading-tight">
          {team.name}
        </div>
        {meta && (
          <div className="text-[11px] text-mist-400 tabular-nums truncate">{meta}</div>
        )}
      </div>
    </div>
  );
}
```


## `football-analysis/src/components/Timeline.tsx`

```ts
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useStore, useFilteredEvents } from "../store";
import type { Category, MatchEvent } from "../lib/types";
import { fmtClock } from "../lib/time";
import { confidencePct } from "../lib/confidence";
import SectionHeader from "./SectionHeader";

interface Props {
  durationMs: number;
  playheadMs: number;
  onSeek: (ms: number) => void;
}

type Drag = { id: number; edge: "start" | "end"; start: number; end: number } | null;

// Zoom presets: visible span in ms (0 = fit whole match).
const ZOOMS: { label: string; span: number }[] = [
  { label: "Fit", span: 0 },
  { label: "10m", span: 10 * 60_000 },
  { label: "5m", span: 5 * 60_000 },
  { label: "1m", span: 60_000 },
];

/**
 * The timeline spine. Two lanes separate manual coding from AI suggestions;
 * click empty space to seek + seed the composer, click a block to select+seek,
 * drag block edges to adjust boundaries, drag the playhead to scrub. Zoom scales
 * the track inside a horizontal scroller and the playhead auto-follows playback.
 */
export default function Timeline({ durationMs, playheadMs, onSeek }: Props) {
  const events = useFilteredEvents();
  const categories = useStore((s) => s.categories);
  const selectedId = useStore((s) => s.selectedEventId);
  const selectEvent = useStore((s) => s.selectEvent);
  const updateEvent = useStore((s) => s.updateEvent);
  const setComposeSeed = useStore((s) => s.setComposeSeed);
  // Memoize per-render allocations: the category map and lane splits only change
  // when categories/events do, not on every playhead tick (spec §35).
  const catById = useMemo(
    () => new Map<number, Category>(categories.map((c) => [c.id, c])),
    [categories],
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<Drag>(null);
  const [zoom, setZoom] = useState(0); // index into ZOOMS

  const dur = durationMs || 1;
  const span = ZOOMS[zoom].span || dur;
  const widthPct = Math.max(100, (dur / span) * 100); // track width vs viewport
  const pct = (ms: number) => `${Math.min(100, Math.max(0, (ms / dur) * 100))}%`;

  const manual = useMemo(() => events.filter((e) => e.source !== "ai"), [events]);
  const ai = useMemo(() => events.filter((e) => e.source === "ai"), [events]);

  const msFromClientX = (clientX: number) => {
    const rect = trackRef.current!.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(dur, ratio * dur));
  };

  // Keep the playhead in view when zoomed and playing.
  useLayoutEffect(() => {
    if (zoom === 0 || !scrollRef.current || !trackRef.current) return;
    const scroller = scrollRef.current;
    const x = (playheadMs / dur) * trackRef.current.scrollWidth;
    const margin = scroller.clientWidth * 0.15;
    if (x < scroller.scrollLeft + margin) scroller.scrollLeft = x - margin;
    else if (x > scroller.scrollLeft + scroller.clientWidth - margin)
      scroller.scrollLeft = x - scroller.clientWidth + margin;
  }, [playheadMs, zoom, dur]);

  // When switching to a zoomed level, center on the playhead once.
  useEffect(() => {
    if (zoom === 0 || !scrollRef.current || !trackRef.current) return;
    const scroller = scrollRef.current;
    const x = (playheadMs / dur) * trackRef.current.scrollWidth;
    scroller.scrollLeft = Math.max(0, x - scroller.clientWidth / 2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom]);

  const seekAndSeed = (clientX: number) => {
    const ms = msFromClientX(clientX);
    onSeek(ms);
    setComposeSeed({ ms: Math.round(ms) });
  };

  const beginBoundaryDrag = (
    e: React.MouseEvent,
    id: number,
    edge: "start" | "end",
    start: number,
    end: number,
  ) => {
    e.stopPropagation();
    const state: Drag = { id, edge, start, end };
    setDrag(state);
    const onMove = (me: MouseEvent) => {
      const ms = Math.round(msFromClientX(me.clientX));
      if (edge === "start") state!.start = Math.min(ms, state!.end - 100);
      else state!.end = Math.max(ms, state!.start + 100);
      setDrag({ ...state! });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      updateEvent(id, { start_ms: state!.start, end_ms: state!.end });
      setDrag(null);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const beginPlayheadDrag = (e: React.MouseEvent) => {
    e.stopPropagation();
    const onMove = (me: MouseEvent) => onSeek(Math.round(msFromClientX(me.clientX)));
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const renderBlock = (ev: MatchEvent) => {
    const cat = ev.category_id ? catById.get(ev.category_id) : undefined;
    const color = cat?.color ?? "#8A90A0";
    const isAi = ev.source === "ai";
    const selected = ev.id === selectedId;
    const start = drag?.id === ev.id ? drag.start : ev.start_ms;
    const end = drag?.id === ev.id ? drag.end : ev.end_ms;
    const title = isAi
      ? `${cat?.name ?? ev.label} — ${fmtClock(start)} · AI ${confidencePct(ev.confidence)}`
      : `${cat?.name ?? ev.label} — ${fmtClock(start)}`;
    return (
      <div
        key={ev.id}
        onClick={(e) => {
          e.stopPropagation();
          selectEvent(ev.id);
          onSeek(start);
          setComposeSeed({
            ms: Math.round(start),
            label: ev.label ?? undefined,
            categoryId: ev.category_id ?? undefined,
          });
        }}
        title={title}
        className="absolute top-1 bottom-1 rounded-md group"
        style={{
          left: pct(start),
          width: `${Math.max(0.4, ((end - start) / dur) * 100)}%`,
          background: isAi ? `${color}44` : `${color}CC`,
          border: `${selected ? 2 : 1}px ${isAi ? "dashed" : "solid"} ${
            selected ? "#EAECF2" : isAi ? "#A78BFA" : color
          }`,
        }}
      >
        <span
          onMouseDown={(e) => beginBoundaryDrag(e, ev.id, "start", ev.start_ms, ev.end_ms)}
          className="absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize opacity-0 group-hover:opacity-100 bg-white/70 rounded-l"
        />
        <span
          onMouseDown={(e) => beginBoundaryDrag(e, ev.id, "end", ev.start_ms, ev.end_ms)}
          className="absolute right-0 top-0 bottom-0 w-1.5 cursor-ew-resize opacity-0 group-hover:opacity-100 bg-white/70 rounded-r"
        />
      </div>
    );
  };

  return (
    <div className="panel p-3">
      <SectionHeader
        label="Timeline"
        className="mb-2 px-1"
        right={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 rounded-lg bg-ink-900/60 p-0.5">
              {ZOOMS.map((z, i) => (
                <button
                  key={z.label}
                  onClick={() => setZoom(i)}
                  className={`px-2 py-0.5 rounded-md text-[11px] transition-colors ${
                    zoom === i ? "bg-ink-600 text-mist-100" : "text-mist-400 hover:text-mist-200"
                  }`}
                  disabled={z.span > 0 && z.span >= dur}
                >
                  {z.label}
                </button>
              ))}
            </div>
            <span className="text-xs text-mist-400 tabular-nums">
              {fmtClock(playheadMs)} / {fmtClock(durationMs)}
            </span>
          </div>
        }
      />

      <div ref={scrollRef} className="overflow-x-auto overflow-y-hidden">
        <div
          ref={trackRef}
          className="relative select-none"
          style={{ width: `${widthPct}%` }}
        >
          {/* lane labels */}
          <div className="flex flex-col gap-1">
            <Lane label="Manual" accent="#8A90A0">
              <div
                className="relative h-8 w-full cursor-pointer"
                onClick={(e) => !drag && seekAndSeed(e.clientX)}
              >
                {manual.map(renderBlock)}
              </div>
            </Lane>
            <Lane label="AI" accent="#A78BFA">
              <div
                className="relative h-8 w-full cursor-pointer"
                onClick={(e) => !drag && seekAndSeed(e.clientX)}
              >
                {ai.map(renderBlock)}
              </div>
            </Lane>
          </div>

          {/* playhead spans both lanes; drag to scrub */}
          <div
            onMouseDown={beginPlayheadDrag}
            className="absolute top-0 bottom-0 w-1 -ml-0.5 bg-teal-300 shadow-glow cursor-ew-resize transition-[left] duration-100 ease-linear"
            style={{ left: pct(playheadMs) }}
          />
        </div>
      </div>

      <p className="text-[10px] text-mist-500 px-1 mt-2">
        Click a lane to seek &amp; seed an event · drag block edges to trim · drag the playhead to scrub
      </p>

      {events.length === 0 && (
        <p className="text-mist-400 text-xs mt-1 px-1">
          No events match — code the match below, or adjust the filter.
        </p>
      )}
    </div>
  );
}

function Lane({
  label,
  accent,
  children,
}: {
  label: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-lg bg-ink-900/70 border border-ink-500/50">
      <span
        className="absolute left-1 top-1 z-10 text-[9px] uppercase tracking-wide px-1 rounded pointer-events-none"
        style={{ color: accent, background: "#0000004D" }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}
```


## `football-analysis/src/components/TitleBar.tsx`

```ts
import { motion } from "framer-motion";
import { useStore } from "../store";

const dot = {
  checking: "bg-mist-400",
  online: "bg-teal-400",
  offline: "bg-mist-400",
  failed: "bg-signal-live",
} as const;

const label = {
  checking: "Starting Cuddy Engine…",
  online: "Engine ready",
  offline: "Connecting to Analysis Engine…",
  failed: "Engine failed to start",
} as const;

/** Short 3-letter code for a team (from an explicit abbrev, else the name). */
function teamCode(name?: string | null): string {
  if (!name) return "";
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0] + (words[1][1] ?? "")).toUpperCase();
  return name.slice(0, 3).toUpperCase();
}

export default function TitleBar() {
  const health = useStore((s) => s.health);
  const openSettings = useStore((s) => s.openSettings);
  const apiKeySet = useStore((s) => s.apiKeySet);
  const match = useStore((s) => s.matchData);

  const fixture = match
    ? [
        match.competition || undefined,
        `${teamCode(match.home?.name)} v ${teamCode(match.away?.name)}`,
      ]
        .filter(Boolean)
        .join(" · ")
    : null;

  return (
    <header
      className="h-11 shrink-0 sticky top-0 z-30 flex items-center justify-between px-4 border-b border-ink-500/60 bg-ink-800/80 backdrop-blur"
      // Lets the user drag the frameless Tauri window by the title bar.
      data-tauri-drag-region
    >
      <div className="flex items-center gap-2.5 pointer-events-none">
        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-teal-300 to-violet-400" />
        <span className="text-sm font-semibold tracking-tight text-mist-100">
          Cuddy
        </span>
        <span className="text-[11px] uppercase tracking-[0.14em] text-mist-400">
          Match Analysis
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs text-mist-300">
        <div className="flex items-center gap-2">
          <motion.span
            key={health}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`w-2 h-2 rounded-full ${dot[health]}`}
          />
          {label[health]}
        </div>
        {fixture && (
          <>
            <span className="text-ink-500">|</span>
            <span className="text-mist-200 tabular-nums">{fixture}</span>
          </>
        )}
        <button
          onClick={openSettings}
          title="Settings"
          aria-label="Settings"
          className="relative pointer-events-auto text-mist-400 hover:text-teal-300 transition-colors p-1 -mr-1 rounded-lg hover:bg-ink-700"
        >
          <GearIcon />
          {!apiKeySet && (
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-violet-400" />
          )}
        </button>
      </div>
    </header>
  );
}

function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 15a3 3 0 100-6 3 3 0 000 6z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M19.4 13a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}
```


## `football-analysis/src/components/ValidationPanel.tsx`

```ts
import { useState } from "react";
import { useStore } from "../store";
import { api } from "../lib/api";
import type { ValidationResult } from "../lib/types";

/**
 * Phase 1: score the AI's events against the analyst's manually-coded events.
 * The headline is "corrections required" — the estimated edits to turn the AI
 * output into the reference. Lower is a better model.
 */
export default function ValidationPanel() {
  const videoId = useStore((s) => s.currentVideoId);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const run = async () => {
    if (!videoId) return;
    setBusy(true);
    setErr(null);
    try {
      setResult(await api.getValidation(videoId));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  };

  const e = result?.events;

  return (
    <div className="panel p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          Validation
        </span>
        <button
          className="text-mist-300 hover:text-teal-300 transition-colors text-xs"
          disabled={busy || !videoId}
          onClick={run}
        >
          {result ? "Re-score" : "Score AI vs coding"}
        </button>
      </div>

      {!result ? (
        <p className="text-mist-400 text-sm">
          Compare AI-suggested events against your manually-coded ones —
          precision, recall, and the edits needed to reconcile them.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Precision" value={fmt(e!.precision)} color="#6EE7D6" />
            <Stat label="Recall" value={fmt(e!.recall)} color="#6EE7D6" />
            <Stat label="Corrections" value={String(e!.corrections_required)} color="#F0A6C0" />
          </div>
          <div className="text-xs text-mist-400 flex flex-wrap gap-x-4 gap-y-1">
            <span>matched {e!.tp}</span>
            <span>false+ {e!.fp}</span>
            <span>missed {e!.fn}</span>
            <span>bound err {e!.boundary_error_ms}ms</span>
            {result.xg && <span className="text-violet-300">xG brier {result.xg.brier}</span>}
          </div>
          <p className="text-[11px] text-mist-500">
            Scored against your {e!.reference} manual event
            {e!.reference === 1 ? "" : "s"}. Needs some hand-coded events to be
            meaningful.
          </p>
        </div>
      )}
      {err && <p className="text-xs text-signal-live mt-2">{err}</p>}
    </div>
  );
}

const fmt = (v: number) => `${Math.round(v * 100)}%`;

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="card p-2 text-center">
      <div className="text-xl font-semibold tabular-nums" style={{ color }}>
        {value}
      </div>
      <div className="text-[11px] uppercase tracking-wide text-mist-400">{label}</div>
    </div>
  );
}
```


## `football-analysis/src/components/VideoBar.tsx`

```ts
import { useRef, useState } from "react";
import { useStore } from "../store";
import { exportUrl, downloadText, api } from "../lib/api";
import { pickVideoFile, isTauri, baseName } from "../lib/platform";
import type { CodingTemplate } from "../lib/types";

/** Video selector + import, coding-template save/apply, and export controls. */
export default function VideoBar() {
  const { videos, currentVideoId, selectVideo, registerVideo, saveTemplate, applyTemplate } =
    useStore();
  const [manualPath, setManualPath] = useState("");
  const [importing, setImporting] = useState(false);
  const [menu, setMenu] = useState<"tpl" | "exp" | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const doImport = async () => {
    if (isTauri()) {
      const path = await pickVideoFile();
      if (path) await registerVideo(baseName(path), path);
      return;
    }
    // Browser/dev: ask the local backend to open a native OS file dialog.
    try {
      const { path } = await api.pickVideoFile();
      if (path) await registerVideo(baseName(path), path);
    } catch {
      // Fallback to the manual path input if the picker isn't available.
      setImporting((v) => !v);
    }
  };

  const submitManual = async () => {
    const p = manualPath.trim();
    if (!p) return;
    await registerVideo(baseName(p), p);
    setManualPath("");
    setImporting(false);
  };

  const doSaveTemplate = async () => {
    const tmpl = await saveTemplate();
    if (tmpl) downloadText(JSON.stringify(tmpl, null, 2), `${tmpl.name}.json`);
  };

  const onTemplateFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const tmpl = JSON.parse(await file.text()) as CodingTemplate;
      await applyTemplate(tmpl);
    } catch {
      alert("Could not read that template file.");
    }
    e.target.value = "";
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <select
        className="input min-w-[12rem]"
        value={currentVideoId ?? ""}
        onChange={(e) => selectVideo(Number(e.target.value))}
        disabled={videos.length === 0}
      >
        {videos.length === 0 && <option value="">No videos</option>}
        {videos.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>

      <button className="btn-accent" onClick={doImport}>
        Import video
      </button>

      {importing && !isTauri() && (
        <div className="flex items-center gap-2">
          <input
            autoFocus
            className="input w-80"
            placeholder="Absolute path to a video file (dev mode)"
            value={manualPath}
            onChange={(e) => setManualPath(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitManual()}
          />
          <button className="btn" onClick={submitManual}>
            Add
          </button>
        </div>
      )}

      <div className="flex-1" />

      {/* Templates menu */}
      <div className="relative">
        <button
          className="btn"
          onClick={() => setMenu((m) => (m === "tpl" ? null : "tpl"))}
        >
          Templates ▾
        </button>
        {menu === "tpl" && (
          <div
            className="absolute right-0 mt-1 z-20 card p-1 flex flex-col min-w-[10rem] shadow-soft"
            onMouseLeave={() => setMenu(null)}
          >
            <button
              className="text-left px-3 py-1.5 rounded-lg text-sm text-mist-200 hover:bg-ink-600"
              onClick={() => {
                setMenu(null);
                doSaveTemplate();
              }}
            >
              Save template
            </button>
            <button
              className="text-left px-3 py-1.5 rounded-lg text-sm text-mist-200 hover:bg-ink-600"
              onClick={() => {
                setMenu(null);
                fileRef.current?.click();
              }}
            >
              Apply template
            </button>
          </div>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={onTemplateFile}
      />

      {/* Export menu */}
      <div className="relative">
        <button
          className="btn"
          onClick={() => setMenu((m) => (m === "exp" ? null : "exp"))}
        >
          Export ▾
        </button>
        {menu === "exp" && (
          <div
            className="absolute right-0 mt-1 z-20 card p-1 flex flex-col min-w-[9rem] shadow-soft"
            onMouseLeave={() => setMenu(null)}
          >
            <a
              className="px-3 py-1.5 rounded-lg text-sm text-mist-200 hover:bg-ink-600"
              href={currentVideoId ? exportUrl(currentVideoId, "xml") : undefined}
              aria-disabled={!currentVideoId}
              onClick={(e) => {
                if (!currentVideoId) e.preventDefault();
                setMenu(null);
              }}
            >
              Export XML
            </a>
            <a
              className="px-3 py-1.5 rounded-lg text-sm text-mist-200 hover:bg-ink-600"
              href={currentVideoId ? exportUrl(currentVideoId, "csv") : undefined}
              aria-disabled={!currentVideoId}
              onClick={(e) => {
                if (!currentVideoId) e.preventDefault();
                setMenu(null);
              }}
            >
              Export CSV
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
```


## `football-analysis/src/components/VideoPlayer.tsx`

```ts
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { fmtClockPrecise } from "../lib/time";
import { useStore } from "../store";
import { nearestFrame } from "../lib/tracks";
import { TEAM_COLORS, BALL_COLOR } from "./AnalyzePanel";
import StudioLayer from "./StudioLayer";

interface Props {
  src: string | null;
  onTime: (ms: number) => void;
  onMeta: (meta: { duration_ms: number; width: number; height: number }) => void;
}

const CALIB_LABELS = ["TL", "TR", "BR", "BL"];

const VideoPlayer = forwardRef<HTMLVideoElement, Props>(
  ({ src, onTime, onMeta }, ref) => {
    const [playing, setPlaying] = useState(false);
    const [time, setTime] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [maximized, setMaximized] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);

    const tracks = useStore((s) => s.tracks);
    const overlayMode = useStore((s) => s.overlayMode);
    const studioTool = useStore((s) => s.studioTool);
    const calibrationMode = useStore((s) => s.calibrationMode);
    const calibrationPoints = useStore((s) => s.calibrationPoints);
    const addCalibrationPoint = useStore((s) => s.addCalibrationPoint);
    const videoMissing = useStore((s) => s.videoMissing);
    const relinkVideo = useStore((s) => s.relinkVideo);

    const el = () =>
      (ref as React.MutableRefObject<HTMLVideoElement | null>)?.current ?? null;

    const nativeW = tracks?.width ?? 1;
    const nativeH = tracks?.height ?? 1;

    const draw = useCallback(
      (ms: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const cw = canvas.clientWidth;
        const ch = canvas.clientHeight;
        if (canvas.width !== cw) canvas.width = cw;
        if (canvas.height !== ch) canvas.height = ch;
        ctx.clearRect(0, 0, cw, ch);

        // detection overlay — per-mode: players / ball / both / analysis
        const showPlayers =
          overlayMode === "players" || overlayMode === "both" || overlayMode === "analysis";
        const showBall =
          overlayMode === "ball" || overlayMode === "both" || overlayMode === "analysis";
        if (overlayMode !== "off" && tracks) {
          const frame = nearestFrame(tracks.frames, ms);
          if (frame) {
            const sx = cw / tracks.width;
            const sy = ch / tracks.height;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            for (const d of frame.dets) {
              const isBall = d.cls === 32;
              if (isBall ? !showBall : !showPlayers) continue;
              const color = isBall ? BALL_COLOR : TEAM_COLORS[d.team] ?? "#8A90A0";
              const x = d.x * sx;
              const y = d.y * sy;
              const w = d.w * sx;
              const h = d.h * sy;
              if (isBall) {
                // Lit ball marker: soft halo + bright core.
                const bx = x + w / 2;
                const by = y + h / 2;
                const halo = ctx.createRadialGradient(bx, by, 0, bx, by, 16);
                halo.addColorStop(0, "rgba(255,225,77,0.55)");
                halo.addColorStop(1, "rgba(255,225,77,0)");
                ctx.fillStyle = halo;
                ctx.beginPath();
                ctx.arc(bx, by, 16, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(bx, by, 4.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = "#ffffff";
                ctx.stroke();
              } else {
                // Small numbered circular marker at the player's feet.
                const cx = x + w / 2;
                const cy = y + h;
                const label = String(d.id);
                const r = label.length > 2 ? 11 : 9;
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = "rgba(9,11,17,0.7)";
                ctx.stroke();
                ctx.fillStyle = "#0A0C12";
                ctx.font = `bold ${label.length > 2 ? 9 : 10}px Inter, system-ui, sans-serif`;
                ctx.fillText(label, cx, cy + 0.5);
              }
            }
          }
        }

        // calibration markers
        if (calibrationMode && calibrationPoints.length) {
          const sx = cw / nativeW;
          const sy = ch / nativeH;
          ctx.strokeStyle = "#6EE7D6";
          ctx.lineWidth = 2;
          ctx.beginPath();
          calibrationPoints.forEach(([px, py], i) => {
            const dx = px * sx;
            const dy = py * sy;
            if (i === 0) ctx.moveTo(dx, dy);
            else ctx.lineTo(dx, dy);
          });
          if (calibrationPoints.length === 4) ctx.closePath();
          ctx.stroke();
          calibrationPoints.forEach(([px, py], i) => {
            const dx = px * sx;
            const dy = py * sy;
            ctx.fillStyle = "#6EE7D6";
            ctx.beginPath();
            ctx.arc(dx, dy, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#0E0F13";
            ctx.font = "10px Inter, system-ui, sans-serif";
            ctx.fillText(CALIB_LABELS[i] ?? String(i + 1), dx - 7, dy - 9);
          });
        }
      },
      [overlayMode, tracks, calibrationMode, calibrationPoints, nativeW, nativeH],
    );

    useEffect(() => {
      const v = el();
      draw(v ? v.currentTime * 1000 : 0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draw, src]);

    useEffect(() => {
      setTime(0);
      setPlaying(false);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }, [src]);

    useEffect(() => {
      if (!maximized) return;
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMaximized(false);
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [maximized]);

    const clampPan = (x: number, y: number, z: number) => {
      const rect = boxRef.current?.getBoundingClientRect();
      const maxX = rect ? ((z - 1) * rect.width) / 2 : 0;
      const maxY = rect ? ((z - 1) * rect.height) / 2 : 0;
      return {
        x: Math.max(-maxX, Math.min(maxX, x)),
        y: Math.max(-maxY, Math.min(maxY, y)),
      };
    };

    const setZoomLevel = (z: number) => {
      const nz = Math.max(1, Math.min(4, z));
      setZoom(nz);
      setPan((p) => (nz === 1 ? { x: 0, y: 0 } : clampPan(p.x, p.y, nz)));
    };

    const startPan = (e: React.MouseEvent) => {
      e.preventDefault();
      const sx = e.clientX;
      const sy = e.clientY;
      const orig = pan;
      const move = (ev: MouseEvent) =>
        setPan(clampPan(orig.x + (ev.clientX - sx), orig.y + (ev.clientY - sy), zoom));
      const up = () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
      };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    };

    const toggle = () => {
      const v = el();
      if (!v) return;
      if (v.paused) v.play();
      else v.pause();
    };

    const onCalibClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * nativeW;
      const ny = ((e.clientY - rect.top) / rect.height) * nativeH;
      addCalibrationPoint(nx, ny);
    };

    return (
      <div
        className={
          maximized
            ? "fixed inset-0 z-[60] bg-ink-900 flex flex-col justify-center overflow-hidden"
            : "panel overflow-hidden flex flex-col shrink-0"
        }
      >
        <div
          ref={boxRef}
          className={`relative bg-black w-full overflow-hidden ${
            maximized ? "max-h-[calc(100vh-3.25rem)] aspect-video m-auto" : "aspect-video"
          }`}
        >
          {src ? (
            <>
              <div
                className="absolute inset-0"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: "center center",
                }}
              >
                <video
                  ref={ref}
                  src={src}
                  className="absolute inset-0 w-full h-full"
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onTimeUpdate={(e) => {
                    const ms = e.currentTarget.currentTime * 1000;
                    setTime(ms);
                    onTime(ms);
                    draw(ms);
                  }}
                  onLoadedMetadata={(e) => {
                    const v = e.currentTarget;
                    onMeta({
                      duration_ms: Math.round(v.duration * 1000),
                      width: v.videoWidth,
                      height: v.videoHeight,
                    });
                  }}
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                />
                <StudioLayer getVideo={el} playing={playing} ms={time} />
                {calibrationMode && (
                  <div
                    className="absolute inset-0 cursor-crosshair"
                    onClick={onCalibClick}
                    title="Click the pitch corners: TL, TR, BR, BL"
                  />
                )}
              </div>
              {/* Pan grabber — only when zoomed and no drawing tool is active. */}
              {zoom > 1 && !calibrationMode && studioTool === null && (
                <div
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                  onMouseDown={startPan}
                />
              )}
              {videoMissing && (
                <div className="absolute inset-0 grid place-items-center bg-ink-900/92 text-center p-4">
                  <div className="max-w-xs">
                    <div className="text-mist-100 text-sm font-medium mb-1">
                      Source file not found
                    </div>
                    <p className="text-mist-400 text-xs mb-3 leading-relaxed">
                      The video moved or was renamed. Your coded events and
                      analysis are safe — relink the file to keep working.
                    </p>
                    <button className="btn-accent" onClick={relinkVideo}>
                      Relink file
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 grid place-items-center text-mist-400 text-sm">
              No video loaded
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 px-4 py-2.5 border-t border-ink-500/50">
          <button className="btn-accent w-16" onClick={toggle} disabled={!src}>
            {playing ? "Pause" : "Play"}
          </button>
          <span className="text-sm tabular-nums text-mist-200">
            {fmtClockPrecise(time)}
          </span>
          <span
            className="text-[10px] text-mist-500 hidden md:inline"
            title="J reverse · K/Space pause-play · L play (repeat = 2x) · , . step frame · [ ] nudge selected event (Shift for the other way)"
          >
            J K L · , . frame · [ ] nudge
          </span>
          <div className="flex-1" />
          <button
            className="btn px-2.5 mr-1"
            disabled={!src}
            title={maximized ? "Exit maximize (Esc)" : "Maximize"}
            onClick={() => setMaximized((v) => !v)}
          >
            {maximized ? "⤡ Exit" : "⤢ Maximize"}
          </button>
          {/* Zoom */}
          <div className="flex items-center gap-1 mr-1">
            <button
              className="btn px-2"
              disabled={!src || zoom <= 1}
              title="Zoom out"
              onClick={() => setZoomLevel(zoom - 0.5)}
            >
              −
            </button>
            <button
              className="btn px-2 tabular-nums min-w-[3rem]"
              disabled={!src}
              title="Reset zoom"
              onClick={() => setZoomLevel(1)}
            >
              {zoom.toFixed(1)}×
            </button>
            <button
              className="btn px-2"
              disabled={!src || zoom >= 4}
              title="Zoom in"
              onClick={() => setZoomLevel(zoom + 0.5)}
            >
              +
            </button>
          </div>
          {[-5, -1, 1, 5].map((sec) => (
            <button
              key={sec}
              className="btn"
              disabled={!src}
              onClick={() => {
                const v = el();
                if (v) v.currentTime = Math.max(0, v.currentTime + sec);
              }}
            >
              {sec > 0 ? `+${sec}s` : `${sec}s`}
            </button>
          ))}
        </div>
      </div>
    );
  },
);

VideoPlayer.displayName = "VideoPlayer";
export default VideoPlayer;
```


## `football-analysis/src/components/Workspace.tsx`

```ts
import { useEffect, useRef, useState } from "react";
import { useStore } from "../store";
import { streamUrl } from "../lib/api";
import type { MatchEvent } from "../lib/types";
import VideoBar from "./VideoBar";
import VideoPlayer from "./VideoPlayer";
import FilterBar from "./FilterBar";
import Timeline from "./Timeline";
import AnalyzePanel from "./AnalyzePanel";
import StatsDashboard from "./StatsDashboard";
import DescriptorManager from "./DescriptorManager";
import Dashboard from "./Dashboard";
import EventList from "./EventList";
import EventEditPanel from "./EventEditPanel";
import PlaylistBar from "./PlaylistBar";
import AnalysisTabs from "./AnalysisTabs";
import AIPanel from "./AIPanel";
import ReviewQueue from "./ReviewQueue";
import FindingsPanel from "./FindingsPanel";
import AddEventPanel from "./AddEventPanel";
import StudioToolbar from "./StudioToolbar";
import MatchHero from "./MatchHero";
import ValidationPanel from "./ValidationPanel";

export default function Workspace() {
  const currentProject = useStore((s) => s.currentProject());
  const currentVideo = useStore((s) => s.currentVideo());
  const setVideoMeta = useStore((s) => s.setVideoMeta);
  const selectedEventId = useStore((s) => s.selectedEventId);
  const updateEvent = useStore((s) => s.updateEvent);
  const tracksFps = useStore((s) => s.tracks?.src_fps);
  const analyzed = useStore((s) => s.tracks != null);
  const requestSeekMs = useStore((s) => s.requestSeekMs);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [playheadMs, setPlayheadMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);

  // Presentation (highlight reel) playback state.
  const [presenting, setPresenting] = useState(false);
  const queueRef = useRef<MatchEvent[]>([]);
  const idxRef = useRef(0);

  const seek = (ms: number) => {
    if (videoRef.current) videoRef.current.currentTime = ms / 1000;
    setPlayheadMs(ms);
  };

  // Consume deep-link seek requests (e.g. clicking a clip in a query result).
  useEffect(() => {
    if (requestSeekMs != null) {
      seek(requestSeekMs);
      useStore.setState({ requestSeekMs: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestSeekMs]);

  const stopPresentation = () => {
    setPresenting(false);
    videoRef.current?.pause();
  };

  const playPlaylist = () => {
    const { playlist, events } = useStore.getState();
    const queue = events
      .filter((e) => playlist.includes(e.id))
      .sort((a, b) => a.start_ms - b.start_ms);
    if (!queue.length || !videoRef.current) return;
    queueRef.current = queue;
    idxRef.current = 0;
    setPresenting(true);
    videoRef.current.currentTime = queue[0].start_ms / 1000;
    videoRef.current.play();
  };

  const handleTime = (ms: number) => {
    setPlayheadMs(ms);
    if (!presenting) return;
    const item = queueRef.current[idxRef.current];
    if (item && ms >= item.end_ms - 30) {
      const next = idxRef.current + 1;
      if (next < queueRef.current.length && videoRef.current) {
        idxRef.current = next;
        videoRef.current.currentTime = queueRef.current[next].start_ms / 1000;
      } else {
        stopPresentation();
      }
    }
  };

  // Phase 4: keyboard transport + frame-accurate editing.
  //  J = reverse, K/Space = pause/play, L = play (repeat toggles 2x),
  //  , / . = step one frame, [ / ] = nudge selected event start/end by a frame
  //  (hold Shift to nudge the other way).
  useEffect(() => {
    const fps = currentVideo?.fps || tracksFps || 25;
    const frameSec = 1 / fps;
    let reverse: number | null = null;
    const stopReverse = () => {
      if (reverse !== null) {
        window.clearInterval(reverse);
        reverse = null;
      }
    };
    const v = () => videoRef.current;

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA") return;

      // One-keystroke review of a selected, unreviewed AI event.
      const sel = useStore.getState().selectedEvent();
      if (sel && sel.source === "ai" && !sel.reviewed) {
        if (e.key === "y" || e.key === "Y" || e.key === "Enter") {
          e.preventDefault();
          updateEvent(sel.id, { reviewed: true });
          return;
        }
        if (e.key === "n" || e.key === "N") {
          e.preventDefault();
          useStore.getState().removeEvent(sel.id);
          return;
        }
      }

      const vid = v();
      switch (e.key) {
        case " ":
        case "k":
        case "K":
          if (!vid) return;
          e.preventDefault();
          stopReverse();
          vid.paused ? vid.play() : vid.pause();
          break;
        case "l":
        case "L":
          if (!vid) return;
          e.preventDefault();
          stopReverse();
          if (vid.paused) {
            vid.playbackRate = 1;
            vid.play();
          } else {
            vid.playbackRate = vid.playbackRate >= 2 ? 1 : 2;
          }
          break;
        case "j":
        case "J":
          if (!vid) return;
          e.preventDefault();
          vid.pause();
          if (reverse === null) {
            reverse = window.setInterval(() => {
              const vv = v();
              if (vv) vv.currentTime = Math.max(0, vv.currentTime - frameSec * 2);
            }, 1000 / 30);
          }
          break;
        case ",":
          if (!vid) return;
          e.preventDefault();
          stopReverse();
          vid.pause();
          vid.currentTime = Math.max(0, vid.currentTime - frameSec);
          break;
        case ".":
          if (!vid) return;
          e.preventDefault();
          stopReverse();
          vid.pause();
          vid.currentTime = vid.currentTime + frameSec;
          break;
        case "[":
        case "]": {
          const ev = useStore.getState().selectedEvent();
          if (!ev) return;
          e.preventDefault();
          const deltaMs = (e.shiftKey ? -1 : 1) * frameSec * 1000;
          if (e.key === "[") {
            updateEvent(ev.id, { start_ms: Math.max(0, Math.round(ev.start_ms + deltaMs)) });
          } else {
            updateEvent(ev.id, { end_ms: Math.round(ev.end_ms + deltaMs) });
          }
          break;
        }
        default:
          return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      stopReverse();
    };
  }, [currentVideo, tracksFps, updateEvent]);

  if (!currentProject) {
    return (
      <div className="min-h-[70vh] grid place-items-center text-mist-300">
        Select or create a project to begin.
      </div>
    );
  }

  const src = currentVideo ? streamUrl(currentVideo.id) : null;

  return (
    <div className="flex flex-col gap-3">
      <VideoBar />
      <FilterBar />
      <MatchHero />

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 items-start">
        {/* left: video + timeline + coding */}
        <div className="flex flex-col gap-3">
          <VideoPlayer
            ref={videoRef}
            src={src}
            onTime={handleTime}
            onMeta={(meta) => {
              setDurationMs(meta.duration_ms);
              if (currentVideo) setVideoMeta(currentVideo.id, meta);
            }}
          />
          {currentVideo && <StudioToolbar />}
          <AnalyzePanel />
          {analyzed && <AnalysisTabs />}
          <Timeline
            durationMs={durationMs || currentVideo?.duration_ms || 0}
            playheadMs={playheadMs}
            onSeek={seek}
          />
          <AddEventPanel playheadMs={playheadMs} disabled={!currentVideo} />
          <DescriptorManager />
        </div>

        {/* right: playlist + edit + dashboard + events */}
        <div className="flex flex-col gap-3">
          <StatsDashboard />
          <PlaylistBar
            presenting={presenting}
            onPlay={playPlaylist}
            onStop={stopPresentation}
          />
          <AIPanel />
          <ReviewQueue />
          <FindingsPanel />
          {analyzed && <ValidationPanel />}
          {selectedEventId && (
            <EventEditPanel playheadMs={playheadMs} onSeek={seek} />
          )}
          <Dashboard />
          <EventList onSeek={seek} />
        </div>
      </div>
    </div>
  );
}
```


## `football-analysis/src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}

html,
body {
  min-height: 100%;
  margin: 0;
}

#root {
  min-height: 100vh;
}

body {
  background: theme("colors.ink.900");
  color: theme("colors.mist.100");
  font-family: theme("fontFamily.sans");
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  /* Desktop-app feel: no text selection except where useful. */
  user-select: none;
  /* Let the whole page scroll naturally instead of trapping panes. */
  overflow-x: hidden;
}

/* Subtle, elegant scrollbars. */
*::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
*::-webkit-scrollbar-thumb {
  background: theme("colors.ink.600");
  border-radius: 9999px;
  border: 2px solid theme("colors.ink.900");
}
*::-webkit-scrollbar-thumb:hover {
  background: theme("colors.ink.500");
}

@layer components {
  .panel {
    @apply bg-ink-800 border border-ink-500/60 rounded-2xl shadow-soft;
  }
  .card {
    @apply bg-ink-700 border border-ink-500/50 rounded-xl;
  }
  .btn {
    @apply px-3 py-1.5 rounded-xl text-sm text-mist-100 bg-ink-700 border border-ink-500/60
           transition-colors duration-200 ease-smooth hover:bg-ink-600;
  }
  .btn-accent {
    @apply px-3 py-1.5 rounded-xl text-sm font-medium text-ink-900 bg-teal-300
           transition-all duration-200 ease-smooth hover:bg-teal-400 hover:shadow-glow;
  }
  .input {
    @apply bg-ink-900/60 border border-ink-500/60 rounded-xl px-3 py-1.5 text-sm text-mist-100
           outline-none focus:border-teal-400/70 transition-colors duration-200 ease-smooth;
  }
}
```


## `football-analysis/src/lib/api.ts`

```ts
// Typed client for the Python sidecar API.

import type {
  AnalysisJob,
  Analytics,
  Category,
  CodingTemplate,
  Descriptor,
  DescriptorGroup,
  EventRelation,
  EventRevision,
  EvidencePackage,
  Finding,
  MatchData,
  MatchEvent,
  MatchFixtureSummary,
  PitchData,
  PlayerHeatmap,
  PlayerStatsDoc,
  Project,
  QueryResult,
  ReportPayload,
  SegmentMap,
  SettingsStatus,
  ShotsData,
  StudioDoc,
  TracksData,
  TracksWindow,
  ValidationResult,
  Video,
} from "./types";

export const API_BASE = "http://127.0.0.1:8765";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} — ${text}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const streamUrl = (videoId: number) =>
  `${API_BASE}/videos/${videoId}/stream`;

export const exportUrl = (videoId: number, fmt: "xml" | "csv") =>
  `${API_BASE}/export/videos/${videoId}/${fmt}`;

export const api = {
  health: () => request<{ status: string; version: string }>("/health"),

  // Projects
  listProjects: () => request<Project[]>("/projects"),
  createProject: (name: string, description = "") =>
    request<Project>("/projects", {
      method: "POST",
      body: JSON.stringify({ name, description }),
    }),
  deleteProject: (id: number) =>
    request<void>(`/projects/${id}`, { method: "DELETE" }),

  // Videos
  listVideos: (projectId: number) =>
    request<Video[]>(`/videos?project_id=${projectId}`),
  registerVideo: (projectId: number, name: string, path: string) =>
    request<Video>("/videos", {
      method: "POST",
      body: JSON.stringify({ project_id: projectId, name, path }),
    }),
  updateVideoMeta: (id: number, meta: Partial<Video>) =>
    request<Video>(`/videos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(meta),
    }),
  videoStatus: (id: number) =>
    request<{ exists: boolean; path: string }>(`/videos/${id}/status`),
  relinkVideo: (id: number, path: string) =>
    request<Video>(`/videos/${id}/relink`, {
      method: "POST",
      body: JSON.stringify({ path }),
    }),
  deleteVideo: (id: number) =>
    request<void>(`/videos/${id}`, { method: "DELETE" }),

  // Categories
  listCategories: (projectId: number) =>
    request<Category[]>(`/categories?project_id=${projectId}`),
  createCategory: (input: Partial<Category> & { project_id: number; name: string }) =>
    request<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  deleteCategory: (id: number) =>
    request<void>(`/categories/${id}`, { method: "DELETE" }),

  // Events
  listEvents: (videoId: number, source?: "manual" | "ai") =>
    request<MatchEvent[]>(
      `/events?video_id=${videoId}${source ? `&source=${source}` : ""}`,
    ),
  createEvent: (input: {
    video_id: number;
    category_id?: number | null;
    label?: string;
    start_ms: number;
    end_ms: number;
    descriptors?: string[];
    source?: "manual" | "ai";
    confidence?: number | null;
  }) =>
    request<MatchEvent>("/events", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateEvent: (id: number, patch: Partial<MatchEvent>) =>
    request<MatchEvent>(`/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    }),
  deleteEvent: (id: number) =>
    request<void>(`/events/${id}`, { method: "DELETE" }),

  // Review actions on AI suggestions (same canonical Event model)
  acceptEvent: (id: number) =>
    request<MatchEvent>(`/events/${id}/accept`, { method: "POST" }),
  rejectEvent: (id: number) =>
    request<void>(`/events/${id}/reject`, { method: "POST" }),

  // Provenance trail (before/after values per edit), newest first
  listRevisions: (id: number) =>
    request<EventRevision[]>(`/events/${id}/revisions`),

  // Event relations (sequences)
  listRelations: (eventId: number) =>
    request<EventRelation[]>(`/events/${eventId}/relations`),
  createRelation: (
    fromEventId: number,
    toEventId: number,
    relationType: string,
  ) =>
    request<EventRelation>(`/events/relations`, {
      method: "POST",
      body: JSON.stringify({
        from_event_id: fromEventId,
        to_event_id: toEventId,
        relation_type: relationType,
      }),
    }),
  deleteRelation: (relationId: number) =>
    request<void>(`/events/relations/${relationId}`, { method: "DELETE" }),

  // Findings (analyst observations linked to evidence)
  listFindings: (videoId: number) =>
    request<Finding[]>(`/videos/${videoId}/findings`),
  createFinding: (
    videoId: number,
    input: {
      title: string;
      description?: string;
      event_ids?: number[];
      start_ms?: number | null;
      end_ms?: number | null;
    },
  ) =>
    request<Finding>(`/videos/${videoId}/findings`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  deleteFinding: (id: number) =>
    request<void>(`/findings/${id}`, { method: "DELETE" }),
  getReport: (videoId: number) =>
    request<ReportPayload>(`/videos/${videoId}/report`),

  // Descriptors
  listDescriptorGroups: (projectId: number) =>
    request<DescriptorGroup[]>(`/descriptor-groups?project_id=${projectId}`),
  createDescriptorGroup: (projectId: number, name: string, sortOrder = 0) =>
    request<DescriptorGroup>("/descriptor-groups", {
      method: "POST",
      body: JSON.stringify({ project_id: projectId, name, sort_order: sortOrder }),
    }),
  deleteDescriptorGroup: (id: number) =>
    request<void>(`/descriptor-groups/${id}`, { method: "DELETE" }),
  createDescriptor: (groupId: number, label: string, color?: string, sortOrder = 0) =>
    request<Descriptor>("/descriptors", {
      method: "POST",
      body: JSON.stringify({ group_id: groupId, label, color, sort_order: sortOrder }),
    }),
  deleteDescriptor: (id: number) =>
    request<void>(`/descriptors/${id}`, { method: "DELETE" }),

  // Templates
  getTemplate: (projectId: number) =>
    request<CodingTemplate>(`/projects/${projectId}/coding-template`),
  applyTemplate: (projectId: number, template: CodingTemplate) =>
    request<{ applied: boolean }>(`/projects/${projectId}/apply-template`, {
      method: "POST",
      body: JSON.stringify(template),
    }),

  // Analysis (Phase 2)
  startAnalysis: (videoId: number, targetFps = 5, model = "yolov8n.pt") =>
    request<AnalysisJob>(
      `/videos/${videoId}/analyze?target_fps=${targetFps}&model=${model}`,
      { method: "POST" },
    ),
  getJob: (jobId: string) => request<AnalysisJob>(`/jobs/${jobId}`),
  tracksExist: (videoId: number) =>
    request<{ exists: boolean }>(`/videos/${videoId}/tracks/exists`),
  pickVideoFile: () =>
    request<{ path: string | null }>("/videos/pick", { method: "POST" }),
  getTracks: (videoId: number) => request<TracksData>(`/videos/${videoId}/tracks`),
  // Windowed track access (spec §18): only frames near the playhead.
  getTracksWindow: (videoId: number, startMs: number, endMs: number) =>
    request<TracksWindow>(
      `/videos/${videoId}/tracks/window?start_ms=${Math.max(0, Math.round(startMs))}&end_ms=${Math.round(endMs)}`,
    ),
  getSegments: (videoId: number) =>
    request<SegmentMap>(`/videos/${videoId}/segments`),

  // Studio telestration graphics (persisted per video)
  getStudio: (videoId: number) => request<StudioDoc>(`/videos/${videoId}/studio`),
  putStudio: (videoId: number, doc: StudioDoc) =>
    request<StudioDoc>(`/videos/${videoId}/studio`, {
      method: "PUT",
      body: JSON.stringify(doc),
    }),

  // Pitch calibration / heatmaps / auto-tag (Phase 2b)
  calibrate: (videoId: number, imgPoints: number[][], length = 105, width = 68) =>
    request<PitchData>(`/videos/${videoId}/calibrate`, {
      method: "POST",
      body: JSON.stringify({ img_points: imgPoints, length, width }),
    }),
  getPitch: (videoId: number) => request<PitchData>(`/videos/${videoId}/pitch`),
  autotag: (videoId: number) =>
    request<{ created: number }>(`/videos/${videoId}/autotag`, { method: "POST" }),

  // Possession & passing analytics (Phase 3a)
  computeAnalytics: (videoId: number) =>
    request<Analytics>(`/videos/${videoId}/analytics`, { method: "POST" }),
  getAnalytics: (videoId: number) => request<Analytics>(`/videos/${videoId}/analytics`),
  tagTurnovers: (videoId: number) =>
    request<{ created: number }>(`/videos/${videoId}/tag-turnovers`, { method: "POST" }),

  // Shots & xG (Phase 3b)
  computeShots: (videoId: number) =>
    request<ShotsData>(`/videos/${videoId}/shots`, { method: "POST" }),
  getShots: (videoId: number) => request<ShotsData>(`/videos/${videoId}/shots`),
  tagShots: (videoId: number) =>
    request<{ created: number }>(`/videos/${videoId}/tag-shots`, { method: "POST" }),

  // Natural-language query (Phase 3c)
  ask: (videoId: number, question: string) =>
    request<{ answer: string; question: string }>(`/videos/${videoId}/ask`, {
      method: "POST",
      body: JSON.stringify({ question }),
    }),
  query: (videoId: number, question: string) =>
    request<QueryResult>(`/videos/${videoId}/query`, {
      method: "POST",
      body: JSON.stringify({ question }),
    }),
  // Structured, evidence-grounded query: deterministic clips/metrics first,
  // optional LLM explanation. Works with no AI key.
  investigate: (videoId: number, question: string) =>
    request<EvidencePackage>(`/videos/${videoId}/investigate`, {
      method: "POST",
      body: JSON.stringify({ question }),
    }),

  // Validation harness (Phase 1): score AI events vs the manual reference
  getValidation: (videoId: number) =>
    request<ValidationResult>(`/videos/${videoId}/validation`),

  // Real match data (API-Football)
  getMatchData: (videoId: number) =>
    request<MatchData | null>(`/videos/${videoId}/match-data`),
  fetchMatchData: (videoId: number, description: string) =>
    request<MatchData>(`/videos/${videoId}/match-data`, {
      method: "POST",
      body: JSON.stringify({ question: description }),
    }),
  fetchMatchDataById: (videoId: number, fixtureId: number) =>
    request<MatchData>(`/videos/${videoId}/match-data`, {
      method: "POST",
      body: JSON.stringify({ fixture_id: fixtureId }),
    }),
  searchMatches: (videoId: number, query: string) =>
    request<MatchFixtureSummary[]>(`/videos/${videoId}/match-search`, {
      method: "POST",
      body: JSON.stringify({ query }),
    }),

  // Per-player statistics (API-Football)
  getPlayerStats: (videoId: number) =>
    request<PlayerStatsDoc | null>(`/videos/${videoId}/player-stats`),
  fetchPlayerStats: (videoId: number) =>
    request<PlayerStatsDoc>(`/videos/${videoId}/player-stats`, { method: "POST" }),

  // Per-player heatmap (from CV tracks) + player↔track assignments
  getPlayerHeatmap: (videoId: number, trackId: number) =>
    request<PlayerHeatmap>(`/videos/${videoId}/player-heatmap?track_id=${trackId}`),
  getAssignments: (videoId: number) =>
    request<{ map: Record<string, number> }>(`/videos/${videoId}/assignments`),
  putAssignments: (videoId: number, map: Record<string, number>) =>
    request<{ map: Record<string, number> }>(`/videos/${videoId}/assignments`, {
      method: "PUT",
      body: JSON.stringify({ map }),
    }),

  // User settings (API keys / model)
  getSettings: () => request<SettingsStatus>("/settings"),
  saveSettings: (input: {
    anthropic_api_key?: string;
    groq_api_key?: string;
    provider?: "groq" | "anthropic";
    model?: string;
    apifootball_key?: string;
  }) =>
    request<SettingsStatus>("/settings", {
      method: "POST",
      body: JSON.stringify(input),
    }),
};

/** Download a selection (playlist) export as a file via a Blob. */
export async function downloadSelection(
  videoId: number,
  eventIds: number[],
  fmt: "xml" | "csv",
  filename: string,
): Promise<void> {
  const res = await fetch(`${API_BASE}/export/selection/${fmt}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ video_id: videoId, event_ids: eventIds }),
  });
  if (!res.ok) throw new Error(`Export failed: ${res.status}`);
  const blob = await res.blob();
  triggerDownload(blob, filename);
}

/** Download arbitrary text as a file (used for template JSON export). */
export function downloadText(text: string, filename: string, type = "application/json") {
  triggerDownload(new Blob([text], { type }), filename);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
```


## `football-analysis/src/lib/confidence.ts`

```ts
// Confidence display helpers.
//
// These bands are a DISPLAY aid over the detector's own confidence score — not
// a validated accuracy claim. Wording deliberately says "review recommended" /
// "verify" rather than implying calibrated precision (spec §9/§607).

export type ConfidenceBand = "high" | "medium" | "low" | "none";

export function confidenceBand(confidence: number | null): ConfidenceBand {
  if (confidence == null) return "none";
  if (confidence >= 0.75) return "high";
  if (confidence >= 0.5) return "medium";
  return "low";
}

export const BAND_LABEL: Record<ConfidenceBand, string> = {
  high: "High confidence",
  medium: "Review recommended",
  low: "Low — verify",
  none: "No confidence score",
};

/** Tailwind classes for a confidence chip. AI accent (violet) for the value,
 *  amber/red as the band lowers to signal "check this". */
export const BAND_CLASS: Record<ConfidenceBand, string> = {
  high: "bg-teal-500/15 text-teal-300",
  medium: "bg-amber-500/15 text-amber-300",
  low: "bg-rose-500/15 text-rose-300",
  none: "bg-ink-600 text-mist-400",
};

export function confidencePct(confidence: number | null): string {
  if (confidence == null) return "—";
  return `${Math.round(confidence * 100)}%`;
}
```


## `football-analysis/src/lib/platform.ts`

```ts
// Platform helpers. The app runs both as a packaged Tauri desktop app and,
// during development, in a plain browser (npm run dev:web). The file picker
// differs, so we detect the environment and degrade gracefully.

export const isTauri = (): boolean =>
  typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

/**
 * Open a native file picker for a video and return its absolute path.
 * In the browser we can't get a real filesystem path, so callers fall back
 * to manual path entry.
 */
export async function pickVideoFile(): Promise<string | null> {
  if (!isTauri()) return null;
  const { open } = await import("@tauri-apps/plugin-dialog");
  const selected = await open({
    multiple: false,
    filters: [
      { name: "Video", extensions: ["mp4", "mov", "mkv", "avi", "m4v", "webm"] },
    ],
  });
  return typeof selected === "string" ? selected : null;
}

export function baseName(path: string): string {
  const parts = path.split(/[\\/]/);
  return parts[parts.length - 1] || path;
}

/**
 * Open a URL in the user's default browser. In the packaged app the Tauri
 * shell plugin launches the system browser; in dev we fall back to a new tab.
 */
export async function openExternal(url: string): Promise<void> {
  if (isTauri()) {
    try {
      const { open } = await import("@tauri-apps/plugin-shell");
      await open(url);
      return;
    } catch {
      /* fall through to window.open */
    }
  }
  window.open(url, "_blank", "noopener,noreferrer");
}
```


## `football-analysis/src/lib/time.ts`

```ts
// Time formatting helpers (milliseconds <-> mm:ss.d).

export function fmtClock(ms: number): string {
  if (!isFinite(ms) || ms < 0) ms = 0;
  const totalSec = ms / 1000;
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function fmtClockPrecise(ms: number): string {
  if (!isFinite(ms) || ms < 0) ms = 0;
  const totalSec = ms / 1000;
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  const d = Math.floor((totalSec - Math.floor(totalSec)) * 10);
  return `${m}:${s.toString().padStart(2, "0")}.${d}`;
}
```


## `football-analysis/src/lib/tracks.ts`

```ts
// Helpers for reading player positions out of the ByteTrack tracks file.
//
// Detections are stored in native video pixels (top-left origin); the Studio
// telestration layer works in normalized [0..1] coordinates over the video box,
// so these helpers return normalized feet points. Follow-the-player graphics
// interpolate a track's position between the two sampled frames bracketing a
// timestamp (tracks are sampled at ~5 fps).

import type { TrackDet, TrackFrame, TracksData } from "./types";

const BALL_CLS = 32;

/** Nearest sampled frame to a timestamp (binary search over sorted frames). */
export function nearestFrame(frames: TrackFrame[], ms: number): TrackFrame | null {
  if (!frames.length) return null;
  let lo = 0;
  let hi = frames.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (frames[mid].t_ms < ms) lo = mid + 1;
    else hi = mid;
  }
  const cand = [frames[lo], frames[Math.max(0, lo - 1)]];
  return cand.reduce((a, b) =>
    Math.abs(a.t_ms - ms) <= Math.abs(b.t_ms - ms) ? a : b,
  );
}

/** The two frames bracketing `ms`: the last at/below it and the first above. */
function bracket(frames: TrackFrame[], ms: number): [TrackFrame | null, TrackFrame | null] {
  if (!frames.length) return [null, null];
  let lo = 0;
  let hi = frames.length; // first index with t_ms > ms
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (frames[mid].t_ms <= ms) lo = mid + 1;
    else hi = mid;
  }
  return [frames[lo - 1] ?? null, frames[lo] ?? null];
}

function playerDet(frame: TrackFrame | null, id: number): TrackDet | null {
  if (!frame) return null;
  for (const d of frame.dets) {
    if (d.cls !== BALL_CLS && d.id === id) return d;
  }
  return null;
}

/** Normalized feet point (bottom-centre of the box) for a detection. */
function feet(d: TrackDet, tracks: TracksData): [number, number] {
  return [(d.x + d.w / 2) / tracks.width, (d.y + d.h) / tracks.height];
}

// A tracked position more than this far (in time) from the requested moment is
// treated as absent, so a pinned graphic hides rather than snapping to a stale
// spot when its track drops out.
const MAX_GAP_MS = 500;

/**
 * Normalized feet position of the player `trackId` at `ms`, linearly
 * interpolated between the bracketing sampled frames. Returns null when the
 * track is absent near that moment (the caller should hide the graphic).
 */
export function trackPosAt(
  tracks: TracksData,
  trackId: number,
  ms: number,
): [number, number] | null {
  const [prev, next] = bracket(tracks.frames, ms);
  const dp = playerDet(prev, trackId);
  const dn = playerDet(next, trackId);
  if (dp && dn && prev && next) {
    const span = next.t_ms - prev.t_ms;
    const f = span > 0 ? (ms - prev.t_ms) / span : 0;
    const a = feet(dp, tracks);
    const b = feet(dn, tracks);
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  }
  if (dp && prev && Math.abs(ms - prev.t_ms) <= MAX_GAP_MS) return feet(dp, tracks);
  if (dn && next && Math.abs(next.t_ms - ms) <= MAX_GAP_MS) return feet(dn, tracks);
  return null;
}

/**
 * The tracked player nearest a normalized point at `ms`, for pin-to-player.
 * Returns null when no player is within a reasonable radius.
 */
export function nearestPlayerAt(
  tracks: TracksData,
  ms: number,
  nx: number,
  ny: number,
): { id: number; pos: [number, number] } | null {
  const frame = nearestFrame(tracks.frames, ms);
  if (!frame) return null;
  let best: { id: number; pos: [number, number] } | null = null;
  let bestD = Infinity;
  for (const d of frame.dets) {
    if (d.cls === BALL_CLS) continue;
    const p = feet(d, tracks);
    const dd = (p[0] - nx) ** 2 + (p[1] - ny) ** 2;
    if (dd < bestD) {
      bestD = dd;
      best = { id: d.id, pos: p };
    }
  }
  // ~0.09 of the frame diagonal — generous enough to click near a marker.
  return best && bestD <= 0.09 ** 2 ? best : null;
}
```


## `football-analysis/src/lib/types.ts`

```ts
// Shared types mirroring the backend models.

export interface Project {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface Video {
  id: number;
  project_id: number;
  name: string;
  path: string;
  duration_ms: number | null;
  fps: number | null;
  width: number | null;
  height: number | null;
  created_at: string;
}

export interface Category {
  id: number;
  project_id: number;
  name: string;
  color: string;
  hotkey: string | null;
  lead_ms: number;
  lag_ms: number;
  sort_order: number;
}

export interface Descriptor {
  id: number;
  group_id: number;
  label: string;
  color: string | null;
  sort_order: number;
}

export interface DescriptorGroup {
  id: number;
  project_id: number;
  name: string;
  sort_order: number;
  descriptors: Descriptor[];
}

export type EventSource = "manual" | "ai";

export interface MatchEvent {
  id: number;
  video_id: number;
  category_id: number | null;
  label: string;
  start_ms: number;
  end_ms: number;
  notes: string;
  descriptors: string[];
  source: EventSource;
  confidence: number | null;
  reviewed: boolean;
  detector: string | null;
  analysis_run_id: number | null;
  created_at: string;
  updated_at: string;
}

/** One recorded change to an event (before/after), for the provenance trail. */
export interface EventRevision {
  id: number;
  event_id: number;
  previous_values: Record<string, unknown>;
  new_values: Record<string, unknown>;
  actor_type: "manual" | "system";
  reason: string;
  created_at: string;
}

export type EventRelationType =
  | "follows"
  | "causes"
  | "assist_for"
  | "shot_from"
  | "turnover_to"
  | "possession_start"
  | "possession_end"
  | "same_sequence"
  | "related_clip";

/** A typed link between two events (powers sequence queries). */
export interface EventRelation {
  id: number;
  from_event_id: number;
  to_event_id: number;
  relation_type: EventRelationType | string;
  created_at: string;
}

/** An analyst observation linked to its supporting events + time range. */
export interface Finding {
  id: number;
  video_id: number;
  title: string;
  description: string;
  event_ids: number[];
  start_ms: number | null;
  end_ms: number | null;
  created_at: string;
}

/** Structured report payload (spec §56) — findings + resolved evidence clips. */
export interface ReportPayload {
  title: string;
  generated_at: string;
  match: Record<string, unknown> | null;
  findings: {
    id: number;
    title: string;
    description: string;
    start_ms: number | null;
    end_ms: number | null;
    clips: { event_id: number; label: string; start_ms: number; end_ms: number; source: string }[];
  }[];
  notes: string;
}

// Portable coding template (categories + descriptor groups).
export interface CodingTemplate {
  name: string;
  categories: {
    name: string;
    color: string;
    hotkey: string | null;
    lead_ms: number;
    lag_ms: number;
  }[];
  descriptor_groups: { name: string; descriptors: string[] }[];
}

export interface Filter {
  categoryIds: number[];
  descriptors: string[];
  source: "all" | "manual" | "ai";
  text: string;
}

// --- Phase 2: CV analysis ---

export interface TrackDet {
  id: number;
  cls: number; // COCO: 0 person, 32 sports ball
  team: number; // 0/1 for players, -1 ball/unclustered
  conf: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface TrackFrame {
  t_ms: number;
  dets: TrackDet[];
}

export interface TracksData {
  video: string;
  src_fps: number;
  stride: number;
  width: number;
  height: number;
  target_fps: number;
  n_tracks: number;
  teams: number;
  frames: TrackFrame[];
}

/** A time-windowed slice of tracks (spec §18): metadata + only the frames in
 *  [window[0], window[1]], to avoid loading the whole match into memory. */
export interface TracksWindow extends TracksData {
  window: [number, number];
  n_total: number;
}

/** Video overlay mode (spec §19). "analysis" adds the spatial layer on top of
 *  players+ball where available. */
export type OverlayMode = "off" | "players" | "ball" | "both" | "analysis";

// --- Studio: telestration graphics drawn over the video ---

export type StudioTool =
  | "arrow"
  | "highlight"
  | "zone"
  | "path"
  | "shape"
  | "box"
  | "text"
  | "link";

/**
 * A telestration graphic. `geom` is a list of normalized [0..1] points over the
 * video box.
 *
 * - When `pinnedTrackId`/`pinPos` are set, the WHOLE shape translates each frame
 *   by that tracked player's displacement (rigid follow).
 * - When `vertexTracks` is set (one entry per geom point), each vertex follows
 *   its own tracked player, so a shape connecting several players deforms as
 *   they move relative to each other. A null entry keeps that vertex fixed.
 */
export interface StudioShape {
  id: string;
  type: StudioTool;
  color: string;
  geom: [number, number][];
  label?: string;
  pinnedTrackId?: number;
  pinPos?: [number, number];
  vertexTracks?: (number | null)[];
}

export interface StudioDoc {
  shapes: StudioShape[];
}

// --- Per-player statistics (API-Football, real named players) ---

export interface PlayerStat {
  id: number | null;
  name: string | null;
  photo?: string | null;
  number?: number | null;
  position?: string | null;
  minutes?: number | null;
  rating?: number | null;
  captain?: boolean;
  goals: number;
  assists: number;
  shots: number;
  shots_on: number;
  passes: number;
  pass_accuracy?: string | number | null;
  key_passes: number;
  tackles: number;
  interceptions: number;
  duels_won: number;
  duels_total: number;
  dribbles: number;
  yellow: number;
  red: number;
}

export interface PlayerStatsDoc {
  fixture_id: number;
  by_team: Record<string, { name: string | null; players: PlayerStat[] }>;
}

/** Per-player heatmap from CV tracks (pitch space if calibrated, else image). */
export interface PlayerHeatmap {
  track_id: number;
  space: "pitch" | "image";
  length: number;
  width: number;
  bins_x: number;
  bins_y: number;
  grid: number[][];
  n_points: number;
}

export interface PitchData {
  length: number;
  width: number;
  bins_x: number;
  bins_y: number;
  heatmaps: { "0": number[][]; "1": number[][] };
  team_distance_m: { "0": number; "1": number };
  track_distance_m: Record<string, number>;
  ball_positions: number[][]; // [t_ms, X, Y]
  img_points: number[][];
}

export interface PassEdge {
  team: number;
  from: number;
  to: number;
  count: number;
}

export interface Analytics {
  possession_pct: { "0": number; "1": number };
  held_frames: { "0": number; "1": number };
  passes: { "0": number; "1": number };
  turnovers: number;
  pass_edges: PassEdge[];
  pass_events: { t_ms: number; team: number; from: number; to: number }[];
  turnover_events: { t_ms: number; from_team: number; to_team: number }[];
  n_touches: number;
}

export interface Shot {
  t_ms: number;
  X: number;
  Y: number;
  goal: "left" | "right";
  team: number;
  distance_m: number;
  angle_rad: number;
  xg: number;
}

export interface ShotsData {
  shots: Shot[];
  team_xg: { "0": number; "1": number };
  team_shots: { "0": number; "1": number };
  length: number;
  width: number;
}

export interface Segment {
  start_ms: number;
  end_ms: number;
  class: string; // "main" | "other"
  confidence: number | null;
}

export interface SegmentMap {
  placeholder: boolean;
  segments: Segment[];
  summary?: {
    segments: number;
    main_segments: number;
    main_ms: number;
    total_ms: number;
    main_fraction: number;
  };
}

export interface QueryClip {
  event_id: number;
  start_ms: number;
  end_ms: number;
  label: string;
  reason: string;
}

export interface QueryResult {
  summary: string;
  clips: QueryClip[];
  question: string;
}

// --- Structured, evidence-grounded query (deterministic engine) ---

export type QueryIntent =
  | "metric_comparison"
  | "event_lookup"
  | "event_count"
  | "event_filter"
  | "sequence_lookup"
  | "shot_analysis"
  | "possession_analysis"
  | "pass_analysis"
  | "turnover_analysis"
  | "zone_analysis"
  | "player_analysis"
  | "time_range_analysis"
  | "clip_lookup";

export interface StructuredQuery {
  intent: QueryIntent;
  team: "home" | "away" | "both" | null;
  period: number | null;
  zones: string[];
  event_types: string[];
  source: EventSource | null;
  reviewed: boolean | null;
  time_range_ms: [number, number] | null;
  metric: string | null;
  wants_clips: boolean;
  limit: number;
}

export interface EvidenceMetric {
  label: string;
  value: number | string;
  /** e.g. cuddy_video_analysis | heuristic | approximate_cv | official_match_data */
  source: string;
}

export interface EvidenceClip {
  event_id: number;
  start_ms: number;
  end_ms: number;
  label: string;
  reason: string;
}

/** Deterministic evidence package; `explanation` is optional LLM prose over it. */
export interface EvidencePackage {
  question: string;
  query: StructuredQuery;
  summary: string;
  metrics: EvidenceMetric[];
  events: number[];
  clips: EvidenceClip[];
  warnings: string[];
  explanation: string | null;
}

export interface ValidationResult {
  video_id: number;
  events: {
    reference: number;
    predicted: number;
    tp: number;
    fp: number;
    fn: number;
    precision: number;
    recall: number;
    f1: number;
    boundary_error_ms: number;
    boundary_adjustments: number;
    corrections_required: number;
  };
  xg: { n: number; goals: number; sum_xg: number; brier: number } | null;
  report: string;
}

export interface AnalysisJob {
  id: string;
  kind: string;
  status: "pending" | "running" | "done" | "error";
  progress: number;
  message: string;
  result: Record<string, unknown> | null;
  error: string | null;
  meta: Record<string, unknown>;
  // Staged pipeline (durable): current stage + completed set + full ordered list.
  stage?: string;
  completed_stages?: string[];
  stages?: string[];
  // Wall-clock ms since the run started (for an ETA estimate).
  elapsed_ms?: number;
}

export interface SettingsStatus {
  anthropic_api_key_set: boolean;
  groq_api_key_set: boolean;
  provider: "groq" | "anthropic";
  model: string;
  key_source: "env" | "stored" | "none";
  apifootball_key_set: boolean;
}

export interface MatchTeam {
  id: number | null;
  name: string | null;
  logo: string | null;
  formation: string | null;
  start_xi: string[];
  stats: Record<string, string | number | null>;
}

export interface MatchDataEvent {
  minute: number | null;
  team: string | null;
  player: string | null;
  type: string | null;
  detail: string | null;
}

/** A fixture card in the browser (before loading full stats). */
export interface MatchFixtureSummary {
  fixture_id: number;
  date: string | null;
  status: string | null;
  competition: string | null;
  season: number | null;
  home: string | null;
  away: string | null;
  home_logo: string | null;
  away_logo: string | null;
  score: string | null;
}

/** Real match data from API-Football (validated, not CV/LLM-derived). */
export interface MatchData {
  query: string;
  fixture_id: number | null;
  competition: string | null;
  date: string | null;
  score: string | null;
  home: MatchTeam;
  away: MatchTeam;
  events: MatchDataEvent[];
}
```


## `football-analysis/src/main.tsx`

```ts
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```


## `football-analysis/src/store.ts`

```ts
// Central app state (Zustand). Keeps the workspace — current project, video,
// categories, descriptors, events, filtering and playlist selection — in sync
// with the Python sidecar.

import { useMemo } from "react";
import { create } from "zustand";
import { api } from "./lib/api";
import { pickVideoFile } from "./lib/platform";
import type {
  AnalysisJob,
  Analytics,
  Category,
  CodingTemplate,
  DescriptorGroup,
  Filter,
  Finding,
  MatchData,
  OverlayMode,
  MatchEvent,
  MatchFixtureSummary,
  PitchData,
  PlayerStatsDoc,
  Project,
  SegmentMap,
  ShotsData,
  StudioShape,
  StudioTool,
  TracksData,
  Video,
} from "./lib/types";

// Debounce Studio saves so rapid edits collapse into one PUT.
let studioSaveTimer: ReturnType<typeof setTimeout> | null = null;
function queueStudioSave(get: () => AppState) {
  if (studioSaveTimer) clearTimeout(studioSaveTimer);
  studioSaveTimer = setTimeout(() => {
    const { currentVideoId, studioShapes } = get();
    if (currentVideoId != null) {
      api.putStudio(currentVideoId, { shapes: studioShapes }).catch(() => {});
    }
  }, 600);
}

/** Pure filter — kept out of the store so selectors stay reference-stable. */
export function applyFilter(events: MatchEvent[], filter: Filter): MatchEvent[] {
  const text = filter.text.trim().toLowerCase();
  return events.filter((e) => {
    if (filter.source !== "all" && e.source !== filter.source) return false;
    if (
      filter.categoryIds.length &&
      (!e.category_id || !filter.categoryIds.includes(e.category_id))
    )
      return false;
    if (
      filter.descriptors.length &&
      !filter.descriptors.some((d) => e.descriptors.includes(d))
    )
      return false;
    if (text) {
      const hay = `${e.label} ${e.notes} ${e.descriptors.join(" ")}`.toLowerCase();
      if (!hay.includes(text)) return false;
    }
    return true;
  });
}

type Health = "checking" | "online" | "offline" | "failed";

const RM_KEY = "cuddy.reducedMotion";

/** Initial reduced-motion: a stored choice wins, else the OS preference. */
function initialReducedMotion(): boolean {
  try {
    const stored = localStorage.getItem(RM_KEY);
    if (stored != null) return stored === "1";
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

const EMPTY_FILTER: Filter = {
  categoryIds: [],
  descriptors: [],
  source: "all",
  text: "",
};

interface AppState {
  health: Health;
  healthAttempts: number;
  projects: Project[];
  categories: Category[];
  descriptorGroups: DescriptorGroup[];
  videos: Video[];
  events: MatchEvent[];

  currentProjectId: number | null;
  currentVideoId: number | null;
  selectedEventId: number | null;
  videoMissing: boolean; // source file not found at its recorded path

  filter: Filter;
  playlist: number[]; // selected event ids for the highlight reel

  // Phase 2: CV analysis
  analysisJob: AnalysisJob | null;
  tracks: TracksData | null;
  overlayMode: OverlayMode; // off | players | ball | both | analysis
  segments: SegmentMap | null; // triage: main-camera vs filler

  // Phase 2b: pitch calibration
  calibrationMode: boolean;
  calibrationPoints: number[][];
  pitch: PitchData | null;

  // Phase 3a: possession & passing
  analytics: Analytics | null;

  // Phase 3b: shots & xG
  shots: ShotsData | null;

  // derived getters (return existing references, safe in selectors)
  currentProject: () => Project | undefined;
  currentVideo: () => Video | undefined;
  selectedEvent: () => MatchEvent | undefined;

  checkHealth: () => Promise<void>;
  resetHealthCheck: () => void;
  loadProjects: () => Promise<void>;
  addProject: (name: string) => Promise<void>;
  selectProject: (id: number) => Promise<void>;

  addCategory: (name: string, color: string, hotkey?: string) => Promise<void>;
  removeCategory: (id: number) => Promise<void>;

  loadDescriptorGroups: () => Promise<void>;
  addDescriptorGroup: (name: string) => Promise<void>;
  removeDescriptorGroup: (id: number) => Promise<void>;
  addDescriptor: (groupId: number, label: string) => Promise<void>;
  removeDescriptor: (id: number) => Promise<void>;

  registerVideo: (name: string, path: string) => Promise<Video | undefined>;
  selectVideo: (id: number) => Promise<void>;
  setVideoMeta: (id: number, meta: Partial<Video>) => Promise<void>;
  relinkVideo: () => Promise<void>;

  loadEvents: () => Promise<void>;
  addEvent: (input: Parameters<typeof api.createEvent>[0]) => Promise<void>;
  updateEvent: (id: number, patch: Partial<MatchEvent>) => Promise<void>;
  removeEvent: (id: number) => Promise<void>;
  toggleEventDescriptor: (id: number, label: string) => Promise<void>;

  // AI review actions (same canonical Event; provenance kept on the backend).
  acceptEvent: (id: number) => Promise<void>;
  rejectEvent: (id: number) => Promise<void>;

  // Findings (analyst observations linked to evidence)
  findings: Finding[];
  loadFindings: () => Promise<void>;
  addFinding: (input: {
    title: string;
    description?: string;
    event_ids?: number[];
    start_ms?: number | null;
    end_ms?: number | null;
  }) => Promise<void>;
  removeFinding: (id: number) => Promise<void>;

  selectEvent: (id: number | null) => void;

  // Add-event compose seed: clicking a timeline/list item prefills the form.
  composeSeed: { ms: number; label?: string; categoryId?: number | null } | null;
  setComposeSeed: (seed: AppState["composeSeed"]) => void;

  setFilter: (patch: Partial<Filter>) => void;
  clearFilter: () => void;

  togglePlaylist: (id: number) => void;
  clearPlaylist: () => void;
  setPlaylist: (ids: number[]) => void;

  // Deep-link seek request (e.g. clicking a clip in a query result).
  requestSeekMs: number | null;
  requestSeek: (ms: number) => void;

  saveTemplate: () => Promise<CodingTemplate | undefined>;
  applyTemplate: (template: CodingTemplate) => Promise<void>;

  analyzeVideo: (targetFps?: number) => Promise<void>;
  loadTracks: () => Promise<void>;
  loadSegments: () => Promise<void>;
  setOverlayMode: (mode: OverlayMode) => void;

  setCalibrationMode: (on: boolean) => void;
  addCalibrationPoint: (x: number, y: number) => void;
  clearCalibrationPoints: () => void;
  calibratePitch: (length: number, width: number) => Promise<void>;
  loadPitch: () => Promise<void>;
  runAutotag: () => Promise<number>;

  computeAnalytics: () => Promise<void>;
  loadAnalytics: () => Promise<void>;
  tagTurnovers: () => Promise<number>;

  computeShots: () => Promise<void>;
  loadShots: () => Promise<void>;
  tagShots: () => Promise<number>;

  // Studio: telestration graphics (drawn over the video, follow tracked players)
  studioShapes: StudioShape[];
  studioTool: StudioTool | null;
  studioColor: string;
  selectedShapeId: string | null;
  studioPinArm: boolean;
  studioHistory: StudioShape[][];
  loadStudio: () => Promise<void>;
  setStudioTool: (tool: StudioTool | null) => void;
  setStudioColor: (color: string) => void;
  addShape: (shape: StudioShape) => void;
  updateShape: (id: string, patch: Partial<StudioShape>) => void;
  deleteShape: (id: string) => void;
  selectShape: (id: string | null) => void;
  clearStudio: () => void;
  armPin: (on: boolean) => void;
  pinShapeToTrack: (id: string, trackId: number, pinPos: [number, number]) => void;
  pushStudioHistory: () => void;
  undoStudio: () => void;

  // Settings (API keys)
  apiKeySet: boolean; // Anthropic key configured
  groqKeySet: boolean; // Groq key configured
  aiProvider: "groq" | "anthropic";
  aiKeySet: boolean; // the active provider has a usable key
  keySource: "env" | "stored" | "none";
  apifootballKeySet: boolean;
  settingsOpen: boolean;
  // UI preference: reduce/remove animation (accessibility + performance).
  reducedMotion: boolean;
  setReducedMotion: (on: boolean) => void;
  refreshSettings: () => Promise<void>;
  saveApiKey: (key: string, model?: string) => Promise<void>;
  saveGroqKey: (key: string) => Promise<void>;
  setProvider: (provider: "groq" | "anthropic") => Promise<void>;
  saveApiFootballKey: (key: string) => Promise<void>;
  openSettings: () => void;
  closeSettings: () => void;

  // Real match data (API-Football)
  matchData: MatchData | null;
  matchDataLoading: boolean;
  matchDataError: string | null;
  loadMatchData: () => Promise<void>;
  fetchMatchData: (description: string) => Promise<void>;

  // Fixture browser (pick the exact match)
  fixtureResults: MatchFixtureSummary[];
  fixtureSearchLoading: boolean;
  fixtureSearchError: string | null;
  searchFixtures: (query: string) => Promise<void>;
  loadFixture: (fixtureId: number) => Promise<void>;
  clearFixtureResults: () => void;

  // Per-player statistics (API-Football) + the selected player card
  playerStats: PlayerStatsDoc | null;
  playerStatsLoading: boolean;
  playerStatsError: string | null;
  selectedPlayerName: string | null;
  loadPlayerStats: () => Promise<void>;
  fetchPlayerStats: () => Promise<void>;
  selectPlayer: (name: string | null) => void;

  // Player name -> CV track id (for per-player heatmaps)
  assignments: Record<string, number>;
  loadAssignments: () => Promise<void>;
  assignPlayer: (name: string, trackId: number) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  health: "checking",
  healthAttempts: 0,
  projects: [],
  categories: [],
  descriptorGroups: [],
  videos: [],
  events: [],
  currentProjectId: null,
  currentVideoId: null,
  selectedEventId: null,
  videoMissing: false,
  filter: EMPTY_FILTER,
  playlist: [],
  requestSeekMs: null,
  analysisJob: null,
  tracks: null,
  overlayMode: "off", // overlay off by default; choose a mode in the Analyse panel
  segments: null,
  calibrationMode: false,
  calibrationPoints: [],
  pitch: null,
  analytics: null,
  shots: null,
  studioShapes: [],
  studioTool: null,
  studioColor: "#F5C24B",
  selectedShapeId: null,
  studioPinArm: false,
  studioHistory: [],
  apiKeySet: false,
  groqKeySet: false,
  aiProvider: "groq",
  aiKeySet: false,
  keySource: "none",
  apifootballKeySet: false,
  settingsOpen: false,
  reducedMotion: initialReducedMotion(),
  composeSeed: null,
  matchData: null,
  matchDataLoading: false,
  matchDataError: null,
  fixtureResults: [],
  fixtureSearchLoading: false,
  fixtureSearchError: null,
  playerStats: null,
  playerStatsLoading: false,
  playerStatsError: null,
  selectedPlayerName: null,
  assignments: {},

  currentProject: () => get().projects.find((p) => p.id === get().currentProjectId),
  currentVideo: () => get().videos.find((v) => v.id === get().currentVideoId),
  selectedEvent: () => get().events.find((e) => e.id === get().selectedEventId),

  checkHealth: async () => {
    try {
      await api.health();
      set({ health: "online", healthAttempts: 0 });
    } catch {
      const attempts = get().healthAttempts + 1;
      // Give the sidecar ~60s before declaring failure: on first launch the
      // onefile exe unpacks its ~430MB CV bundle to temp and cold-imports torch,
      // which measured ~24s here and is slower on modest disks/hardware.
      set({ health: attempts > 40 ? "failed" : "offline", healthAttempts: attempts });
    }
  },

  resetHealthCheck: () => set({ health: "checking", healthAttempts: 0 }),

  refreshSettings: async () => {
    try {
      const s = await api.getSettings();
      set({
        apiKeySet: s.anthropic_api_key_set,
        groqKeySet: s.groq_api_key_set,
        aiProvider: s.provider,
        aiKeySet:
          s.provider === "groq" ? s.groq_api_key_set : s.anthropic_api_key_set,
        keySource: s.key_source,
        apifootballKeySet: s.apifootball_key_set,
      });
    } catch {
      /* backend not ready yet; leave defaults */
    }
  },
  saveApiKey: async (key: string, model?: string) => {
    const s = await api.saveSettings({ anthropic_api_key: key, model });
    set({
      apiKeySet: s.anthropic_api_key_set,
      aiKeySet:
        s.provider === "groq" ? s.groq_api_key_set : s.anthropic_api_key_set,
      keySource: s.key_source,
    });
  },
  saveGroqKey: async (key: string) => {
    const s = await api.saveSettings({ groq_api_key: key });
    set({
      groqKeySet: s.groq_api_key_set,
      aiKeySet:
        s.provider === "groq" ? s.groq_api_key_set : s.anthropic_api_key_set,
      keySource: s.key_source,
    });
  },
  setProvider: async (provider: "groq" | "anthropic") => {
    const s = await api.saveSettings({ provider });
    set({
      aiProvider: s.provider,
      aiKeySet:
        s.provider === "groq" ? s.groq_api_key_set : s.anthropic_api_key_set,
      keySource: s.key_source,
    });
  },
  saveApiFootballKey: async (key: string) => {
    const s = await api.saveSettings({ apifootball_key: key });
    set({ apifootballKeySet: s.apifootball_key_set });
  },
  openSettings: () => set({ settingsOpen: true }),
  closeSettings: () => set({ settingsOpen: false }),

  setReducedMotion: (on) => {
    try {
      localStorage.setItem(RM_KEY, on ? "1" : "0");
    } catch {
      /* private mode / storage blocked — keep the in-memory choice */
    }
    set({ reducedMotion: on });
  },

  loadMatchData: async () => {
    const vid = get().currentVideoId;
    if (!vid) {
      set({ matchData: null });
      return;
    }
    try {
      const data = await api.getMatchData(vid);
      if (get().currentVideoId === vid) set({ matchData: data });
    } catch {
      if (get().currentVideoId === vid) set({ matchData: null });
    }
  },
  fetchMatchData: async (description: string) => {
    const vid = get().currentVideoId;
    if (!vid || !description.trim()) return;
    set({ matchDataLoading: true, matchDataError: null });
    try {
      const data = await api.fetchMatchData(vid, description.trim());
      if (get().currentVideoId === vid) set({ matchData: data });
    } catch (e) {
      if (get().currentVideoId === vid) {
        set({ matchDataError: e instanceof Error ? e.message : "Lookup failed" });
      }
    } finally {
      if (get().currentVideoId === vid) set({ matchDataLoading: false });
    }
  },

  searchFixtures: async (query: string) => {
    const vid = get().currentVideoId;
    if (!vid || !query.trim()) return;
    set({ fixtureSearchLoading: true, fixtureSearchError: null, fixtureResults: [] });
    try {
      const rows = await api.searchMatches(vid, query.trim());
      if (get().currentVideoId === vid) set({ fixtureResults: rows });
    } catch (e) {
      if (get().currentVideoId === vid) {
        set({ fixtureSearchError: e instanceof Error ? e.message : "Search failed" });
      }
    } finally {
      if (get().currentVideoId === vid) set({ fixtureSearchLoading: false });
    }
  },
  loadFixture: async (fixtureId: number) => {
    const vid = get().currentVideoId;
    if (!vid) return;
    set({ matchDataLoading: true, matchDataError: null });
    try {
      const data = await api.fetchMatchDataById(vid, fixtureId);
      if (get().currentVideoId === vid) {
        set({ matchData: data, fixtureResults: [] });
      }
    } catch (e) {
      if (get().currentVideoId === vid) {
        set({ matchDataError: e instanceof Error ? e.message : "Could not load fixture" });
      }
    } finally {
      if (get().currentVideoId === vid) set({ matchDataLoading: false });
    }
  },
  clearFixtureResults: () => set({ fixtureResults: [], fixtureSearchError: null }),

  loadPlayerStats: async () => {
    const vid = get().currentVideoId;
    if (!vid) {
      set({ playerStats: null });
      return;
    }
    try {
      const data = await api.getPlayerStats(vid);
      if (get().currentVideoId === vid) set({ playerStats: data });
    } catch {
      if (get().currentVideoId === vid) set({ playerStats: null });
    }
  },
  fetchPlayerStats: async () => {
    const vid = get().currentVideoId;
    if (!vid) return;
    set({ playerStatsLoading: true, playerStatsError: null });
    try {
      const data = await api.fetchPlayerStats(vid);
      if (get().currentVideoId === vid) set({ playerStats: data });
    } catch (e) {
      if (get().currentVideoId === vid) {
        set({ playerStatsError: e instanceof Error ? e.message : "Could not load player stats" });
      }
    } finally {
      if (get().currentVideoId === vid) set({ playerStatsLoading: false });
    }
  },
  selectPlayer: (name) => set({ selectedPlayerName: name }),

  loadAssignments: async () => {
    const vid = get().currentVideoId;
    if (!vid) {
      set({ assignments: {} });
      return;
    }
    try {
      const doc = await api.getAssignments(vid);
      if (get().currentVideoId === vid) set({ assignments: doc.map ?? {} });
    } catch {
      if (get().currentVideoId === vid) set({ assignments: {} });
    }
  },
  assignPlayer: async (name, trackId) => {
    const vid = get().currentVideoId;
    if (!vid) return;
    const map = { ...get().assignments, [name]: trackId };
    set({ assignments: map });
    try {
      await api.putAssignments(vid, map);
    } catch {
      /* keep the optimistic local assignment */
    }
  },

  setComposeSeed: (seed) => set({ composeSeed: seed }),

  loadProjects: async () => {
    const projects = await api.listProjects();
    set({ projects });
    if (!get().currentProjectId && projects.length) {
      await get().selectProject(projects[0].id);
    }
  },

  addProject: async (name) => {
    const project = await api.createProject(name);
    set({ projects: [...get().projects, project] });
    await get().selectProject(project.id);
  },

  selectProject: async (id) => {
    set({
      currentProjectId: id,
      currentVideoId: null,
      events: [],
      selectedEventId: null,
      playlist: [],
      filter: EMPTY_FILTER,
    });
    const [categories, videos, descriptorGroups] = await Promise.all([
      api.listCategories(id),
      api.listVideos(id),
      api.listDescriptorGroups(id),
    ]);
    set({ categories, videos, descriptorGroups });
    if (videos.length) await get().selectVideo(videos[0].id);
  },

  addCategory: async (name, color, hotkey) => {
    const pid = get().currentProjectId;
    if (!pid) return;
    const category = await api.createCategory({
      project_id: pid,
      name,
      color,
      hotkey: hotkey || null,
      sort_order: get().categories.length,
    });
    set({ categories: [...get().categories, category] });
  },

  removeCategory: async (id) => {
    await api.deleteCategory(id);
    set({ categories: get().categories.filter((c) => c.id !== id) });
  },

  loadDescriptorGroups: async () => {
    const pid = get().currentProjectId;
    if (!pid) return;
    set({ descriptorGroups: await api.listDescriptorGroups(pid) });
  },

  addDescriptorGroup: async (name) => {
    const pid = get().currentProjectId;
    if (!pid) return;
    await api.createDescriptorGroup(pid, name, get().descriptorGroups.length);
    await get().loadDescriptorGroups();
  },

  removeDescriptorGroup: async (id) => {
    await api.deleteDescriptorGroup(id);
    await get().loadDescriptorGroups();
  },

  addDescriptor: async (groupId, label) => {
    const group = get().descriptorGroups.find((g) => g.id === groupId);
    await api.createDescriptor(groupId, label, undefined, group?.descriptors.length ?? 0);
    await get().loadDescriptorGroups();
  },

  removeDescriptor: async (id) => {
    await api.deleteDescriptor(id);
    await get().loadDescriptorGroups();
  },

  registerVideo: async (name, path) => {
    const pid = get().currentProjectId;
    if (!pid) return undefined;
    const video = await api.registerVideo(pid, name, path);
    set({ videos: [...get().videos, video] });
    await get().selectVideo(video.id);
    return video;
  },

  selectVideo: async (id) => {
    set({
      currentVideoId: id,
      selectedEventId: null,
      playlist: [],
      tracks: null,
      analysisJob: null,
      pitch: null,
      calibrationMode: false,
      calibrationPoints: [],
      analytics: null,
      shots: null,
      segments: null,
      studioShapes: [],
      studioTool: null,
      selectedShapeId: null,
      studioPinArm: false,
      studioHistory: [],
      composeSeed: null,
      matchData: null,
      matchDataError: null,
      fixtureResults: [],
      fixtureSearchError: null,
      playerStats: null,
      playerStatsError: null,
      selectedPlayerName: null,
      assignments: {},
      videoMissing: false,
      findings: [],
    });
    await Promise.all([
      get().loadEvents(),
      get().loadFindings(),
      get().loadTracks(),
      get().loadSegments(),
      get().loadPitch(),
      get().loadAnalytics(),
      get().loadShots(),
      get().loadStudio(),
      get().loadMatchData(),
      get().loadPlayerStats(),
      get().loadAssignments(),
    ]);
    // Managed-media check: flag if the source file has moved/renamed.
    try {
      const st = await api.videoStatus(id);
      set({ videoMissing: !st.exists });
    } catch {
      /* leave as-is */
    }
  },

  relinkVideo: async () => {
    const vid = get().currentVideoId;
    if (!vid) return;
    const path = await pickVideoFile(); // native picker (Tauri); null in browser
    if (!path) return;
    const video = await api.relinkVideo(vid, path);
    set({
      videos: get().videos.map((v) => (v.id === vid ? video : v)),
      videoMissing: false,
    });
  },

  setVideoMeta: async (id, meta) => {
    const updated = await api.updateVideoMeta(id, meta);
    set({ videos: get().videos.map((v) => (v.id === id ? updated : v)) });
  },

  loadEvents: async () => {
    const vid = get().currentVideoId;
    if (!vid) {
      set({ events: [] });
      return;
    }
    set({ events: await api.listEvents(vid) });
  },

  addEvent: async (input) => {
    const event = await api.createEvent(input);
    set({
      events: [...get().events, event].sort((a, b) => a.start_ms - b.start_ms),
      selectedEventId: event.id,
    });
  },

  updateEvent: async (id, patch) => {
    const event = await api.updateEvent(id, patch);
    set({
      events: get()
        .events.map((e) => (e.id === id ? event : e))
        .sort((a, b) => a.start_ms - b.start_ms),
    });
  },

  removeEvent: async (id) => {
    await api.deleteEvent(id);
    set({
      events: get().events.filter((e) => e.id !== id),
      selectedEventId: get().selectedEventId === id ? null : get().selectedEventId,
      playlist: get().playlist.filter((p) => p !== id),
    });
  },

  findings: [],
  loadFindings: async () => {
    const vid = get().currentVideoId;
    if (!vid) {
      set({ findings: [] });
      return;
    }
    try {
      const f = await api.listFindings(vid);
      if (get().currentVideoId === vid) set({ findings: f });
    } catch {
      if (get().currentVideoId === vid) set({ findings: [] });
    }
  },
  addFinding: async (input) => {
    const vid = get().currentVideoId;
    if (!vid) return;
    const finding = await api.createFinding(vid, input);
    set({ findings: [finding, ...get().findings] });
  },
  removeFinding: async (id) => {
    await api.deleteFinding(id);
    set({ findings: get().findings.filter((f) => f.id !== id) });
  },

  acceptEvent: async (id) => {
    const event = await api.acceptEvent(id);
    set({
      events: get().events.map((e) => (e.id === id ? event : e)),
    });
  },

  rejectEvent: async (id) => {
    await api.rejectEvent(id);
    set({
      events: get().events.filter((e) => e.id !== id),
      selectedEventId: get().selectedEventId === id ? null : get().selectedEventId,
      playlist: get().playlist.filter((p) => p !== id),
    });
  },

  toggleEventDescriptor: async (id, label) => {
    const ev = get().events.find((e) => e.id === id);
    if (!ev) return;
    const next = ev.descriptors.includes(label)
      ? ev.descriptors.filter((d) => d !== label)
      : [...ev.descriptors, label];
    await get().updateEvent(id, { descriptors: next });
  },

  selectEvent: (id) => set({ selectedEventId: id }),

  setFilter: (patch) => set({ filter: { ...get().filter, ...patch } }),
  clearFilter: () => set({ filter: EMPTY_FILTER }),

  togglePlaylist: (id) => {
    const current = get().playlist;
    set({
      playlist: current.includes(id)
        ? current.filter((p) => p !== id)
        : [...current, id],
    });
  },
  clearPlaylist: () => set({ playlist: [] }),
  setPlaylist: (ids) => set({ playlist: ids }),

  requestSeek: (ms) => set({ requestSeekMs: ms }),

  saveTemplate: async () => {
    const pid = get().currentProjectId;
    if (!pid) return undefined;
    return api.getTemplate(pid);
  },

  applyTemplate: async (template) => {
    const pid = get().currentProjectId;
    if (!pid) return;
    await api.applyTemplate(pid, template);
    const [categories, descriptorGroups] = await Promise.all([
      api.listCategories(pid),
      api.listDescriptorGroups(pid),
    ]);
    set({ categories, descriptorGroups });
  },

  analyzeVideo: async (targetFps = 5) => {
    const vid = get().currentVideoId;
    if (!vid) return;
    const job = await api.startAnalysis(vid, targetFps);
    set({ analysisJob: job });

    // Poll until the job finishes. Surface partial results: as soon as the
    // 'events' stage completes, load the tracks so the overlay appears before
    // the later stages finish (progressive delivery).
    const poll = async () => {
      const current = get().analysisJob;
      if (!current || current.meta.video_id !== vid) return; // switched video
      try {
        const updated = await api.getJob(current.id);
        set({ analysisJob: updated });
        if (updated.completed_stages?.includes("triage") && !get().segments) {
          await get().loadSegments(); // surface the filler-removed timeline early
        }
        if (updated.completed_stages?.includes("events") && !get().tracks) {
          await get().loadTracks();
          await get().loadEvents(); // surface the auto-detected candidate events
        }
        if (updated.status === "done") {
          await get().loadTracks();
          await get().loadEvents();
          // Best-effort: pull real match data (score, formations, stats) from
          // API-Football using the project name to identify the game. Only when
          // a key is configured and nothing has been fetched yet.
          if (get().apifootballKeySet && !get().matchData) {
            const project = get().currentProject();
            if (project) {
              get()
                .fetchMatchData(project.name)
                .catch(() => {
                  /* non-fatal; the dashboard lets the user look it up manually */
                });
            }
          }
          return;
        }
        if (updated.status === "error") return;
      } catch {
        return;
      }
      setTimeout(poll, 700);
    };
    setTimeout(poll, 700);
  },

  loadTracks: async () => {
    const vid = get().currentVideoId;
    if (!vid) {
      set({ tracks: null });
      return;
    }
    try {
      const { exists } = await api.tracksExist(vid);
      set({ tracks: exists ? await api.getTracks(vid) : null });
    } catch {
      set({ tracks: null });
    }
  },

  loadSegments: async () => {
    const vid = get().currentVideoId;
    if (!vid) {
      set({ segments: null });
      return;
    }
    try {
      set({ segments: await api.getSegments(vid) });
    } catch {
      set({ segments: null });
    }
  },

  setOverlayMode: (mode) => set({ overlayMode: mode }),

  setCalibrationMode: (on) =>
    set({ calibrationMode: on, calibrationPoints: on ? [] : get().calibrationPoints }),

  addCalibrationPoint: (x, y) => {
    const pts = get().calibrationPoints;
    if (pts.length >= 4) return;
    set({ calibrationPoints: [...pts, [x, y]] });
  },

  clearCalibrationPoints: () => set({ calibrationPoints: [] }),

  calibratePitch: async (length, width) => {
    const vid = get().currentVideoId;
    const pts = get().calibrationPoints;
    if (!vid || pts.length !== 4) return;
    const pitch = await api.calibrate(vid, pts, length, width);
    set({ pitch, calibrationMode: false });
  },

  loadPitch: async () => {
    const vid = get().currentVideoId;
    if (!vid) {
      set({ pitch: null });
      return;
    }
    try {
      set({ pitch: await api.getPitch(vid) });
    } catch {
      set({ pitch: null });
    }
  },

  runAutotag: async () => {
    const vid = get().currentVideoId;
    if (!vid) return 0;
    const { created } = await api.autotag(vid);
    await get().loadEvents();
    return created;
  },

  computeAnalytics: async () => {
    const vid = get().currentVideoId;
    if (!vid) return;
    set({ analytics: await api.computeAnalytics(vid) });
  },

  loadAnalytics: async () => {
    const vid = get().currentVideoId;
    if (!vid) {
      set({ analytics: null });
      return;
    }
    try {
      set({ analytics: await api.getAnalytics(vid) });
    } catch {
      set({ analytics: null });
    }
  },

  tagTurnovers: async () => {
    const vid = get().currentVideoId;
    if (!vid) return 0;
    const { created } = await api.tagTurnovers(vid);
    await get().loadEvents();
    return created;
  },

  computeShots: async () => {
    const vid = get().currentVideoId;
    if (!vid) return;
    set({ shots: await api.computeShots(vid) });
  },

  loadShots: async () => {
    const vid = get().currentVideoId;
    if (!vid) {
      set({ shots: null });
      return;
    }
    try {
      set({ shots: await api.getShots(vid) });
    } catch {
      set({ shots: null });
    }
  },

  tagShots: async () => {
    const vid = get().currentVideoId;
    if (!vid) return 0;
    const { created } = await api.tagShots(vid);
    await get().loadEvents();
    return created;
  },

  loadStudio: async () => {
    const vid = get().currentVideoId;
    if (!vid) {
      set({ studioShapes: [] });
      return;
    }
    try {
      const doc = await api.getStudio(vid);
      if (get().currentVideoId === vid) set({ studioShapes: doc.shapes ?? [] });
    } catch {
      if (get().currentVideoId === vid) set({ studioShapes: [] });
    }
  },
  setStudioTool: (tool) =>
    set({ studioTool: tool, studioPinArm: false }),
  setStudioColor: (color) => set({ studioColor: color }),
  pushStudioHistory: () =>
    set((s) => ({ studioHistory: [...s.studioHistory.slice(-49), s.studioShapes] })),
  undoStudio: () => {
    const hist = get().studioHistory;
    if (!hist.length) return;
    set({
      studioShapes: hist[hist.length - 1],
      studioHistory: hist.slice(0, -1),
      selectedShapeId: null,
    });
    queueStudioSave(get);
  },
  addShape: (shape) => {
    get().pushStudioHistory();
    set({ studioShapes: [...get().studioShapes, shape], selectedShapeId: shape.id });
    queueStudioSave(get);
  },
  updateShape: (id, patch) => {
    set({
      studioShapes: get().studioShapes.map((s) =>
        s.id === id ? { ...s, ...patch } : s,
      ),
    });
    queueStudioSave(get);
  },
  deleteShape: (id) => {
    get().pushStudioHistory();
    set({
      studioShapes: get().studioShapes.filter((s) => s.id !== id),
      selectedShapeId: get().selectedShapeId === id ? null : get().selectedShapeId,
    });
    queueStudioSave(get);
  },
  selectShape: (id) => set({ selectedShapeId: id }),
  clearStudio: () => {
    get().pushStudioHistory();
    set({ studioShapes: [], selectedShapeId: null, studioPinArm: false });
    queueStudioSave(get);
  },
  armPin: (on) => set({ studioPinArm: on }),
  pinShapeToTrack: (id, trackId, pinPos) => {
    get().pushStudioHistory();
    set({
      studioShapes: get().studioShapes.map((s) =>
        s.id === id ? { ...s, pinnedTrackId: trackId, pinPos } : s,
      ),
      studioPinArm: false,
    });
    queueStudioSave(get);
  },
}));

/** Memoized filtered-events selector — stable across renders. */
export function useFilteredEvents(): MatchEvent[] {
  const events = useStore((s) => s.events);
  const filter = useStore((s) => s.filter);
  return useMemo(() => applyFilter(events, filter), [events, filter]);
}
```


## `football-analysis/src/vite-env.d.ts`

```ts
/// <reference types="vite/client" />
```


## `football-analysis/tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Nocturne: a sharp, high-contrast dark blue-grey — not the old
        // low-contrast charcoal. Cooler and deeper, with clearer steps.
        ink: {
          // Nocturne, lightened ~20% for a less heavy ground.
          900: "#14161F", // app background
          800: "#1C2029", // panels
          700: "#262B37", // raised cards
          600: "#343B4F", // hover / strong border
          500: "#444C66", // hairline borders
        },
        mist: {
          100: "#F5F7FB", // primary text (crisp)
          200: "#CBD1E0", // secondary text
          300: "#949CB4", // muted text
          400: "#646C86", // disabled
        },
        // Blurple accent — used as fill, line and glow.
        teal: {
          300: "#8E93FF",
          400: "#6E75F5",
          500: "#565CE0",
        },
        violet: {
          300: "#B7A6F0",
          400: "#9B84E8",
        },
        signal: {
          ai: "#B7A6F0", // AI-generated events
          live: "#FF6B8A", // live/recording accent (sharper)
        },
      },
      borderRadius: {
        xl: "10px",
        "2xl": "12px",
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.4), 0 10px 30px rgba(0,0,0,0.35)",
        glow: "0 0 0 1px rgba(110,117,245,0.35), 0 0 28px rgba(110,117,245,0.18)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)", // gentle ease-out, no bounce
      },
    },
  },
  plugins: [],
};
```


## `football-analysis/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "useDefineForClassFields": true,
    "lib": ["ES2021", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```


## `football-analysis/tsconfig.node.json`

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```


## `football-analysis/vite.config.ts`

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Tauri expects a fixed dev port and a relative base for the packaged webview.
export default defineConfig({
  plugins: [react()],
  base: "./",
  clearScreen: false,
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    target: "es2021",
    outDir: "dist",
    sourcemap: true,
  },
});
```

