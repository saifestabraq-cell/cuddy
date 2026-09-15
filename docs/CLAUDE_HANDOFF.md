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
