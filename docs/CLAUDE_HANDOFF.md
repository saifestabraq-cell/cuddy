# Cuddy — Claude Handoff Document

Generated: 2026-09-13, mid-task, because the originating chat context was
being exhausted. This file is the source of truth for continuing the work —
not the conversation that produced it.

---

## 1. PROJECT STATE

### What Cuddy currently is
Cuddy is an AI-assisted football (soccer) match-analysis **desktop app**. It
combines Nacsport-style manual video coding (tag buttons, timeline,
descriptors, XML/CSV export) with a CV/ML layer (player+ball detection &
tracking, team ID via jersey-colour clustering, pitch heatmaps via manual
homography, possession/passing/shots/xG analytics, footage triage,
candidate-event auto-detection with one-key review) and an LLM layer
(natural-language query that returns grounded clip reels, via the Claude API).

Governing principle (do not violate): **AI-assisted, not fully automated.**
Every machine output is a reviewable suggestion with visible confidence, on
the same timeline the analyst hand-corrects. Spatial CV is labelled
approximate, never presented as measured data. The app never fetches, hosts,
or redistributes footage — only reads files the user picked from their own
disk.

### Current architecture
```
React 18 + TypeScript + Vite + Tailwind + Zustand  (frontend)
        ↓
Tauri 2 (Rust shell)
        ↓  (dev: local venv backend spawned by `npm run dev`)
        ↓  (prod: bundled cuddy-backend.exe sidecar, IN PROGRESS)
Python 3.12 FastAPI sidecar (SQLModel over SQLite, Alembic migrations)
        ↓
CV stack: Ultralytics YOLO + ByteTrack + OpenCV + scikit-learn (lazy-imported)
LLM: Anthropic Claude API (backend/app/llm.py)
```

Repo root: `C:\Users\saiff\OneDrive\Documents\project`
App root: `football-analysis/` (everything below is relative to this unless
stated otherwise — e.g. `backend/app/main.py` = `football-analysis/backend/app/main.py`)

### Relevant technologies
Tauri 2 (Rust), React 18/TS/Vite/Tailwind/Framer Motion/Zustand, Python 3.12,
FastAPI, SQLModel, SQLite, Alembic, PyTorch (CPU build for production —
`torch==2.5.1+cpu` — CUDA build used only in the dev GPU venv), Ultralytics
YOLO, ByteTrack (via `supervision`), OpenCV, scikit-learn, Anthropic SDK,
PyInstaller 6.11.1.

### Current branch
`feat/production-packaging` (checked out from `main` at commit `53d3fc4`).
**Not merged. Not yet committed on this branch either** — see §13.

### Current git commit
`53d3fc4` — "Phase 2: footage triage (shot boundaries + main-camera
classification) (#7)" — this is `main`'s tip, and also the base this branch
started from. All work described below is **uncommitted working-tree changes**
on top of it.

### Current working tree status
```
 M CLAUDE.md
 M football-analysis/.gitignore
 M football-analysis/backend/app/__main__.py
 M football-analysis/backend/app/config.py
 M football-analysis/backend/app/main.py
 M football-analysis/backend/sidecar_entry.py
 M football-analysis/docs/architecture.md
 M football-analysis/package.json
 M football-analysis/src-tauri/capabilities/default.json
 M football-analysis/src-tauri/src/lib.rs
 M football-analysis/src-tauri/tauri.conf.json
 M football-analysis/src/App.tsx
 M football-analysis/src/components/TitleBar.tsx
 M football-analysis/src/store.ts
?? football-analysis/FEATURES.md            <- intentionally untracked, DO NOT COMMIT (user's explicit instruction, unrelated to this task)
?? football-analysis/backend/app/logging_setup.py
?? football-analysis/backend/cuddy-backend.spec
?? football-analysis/scripts/
```
A file `football-analysis/backend/fa-sidecar.spec` (an older, superseded spec
file, never committed since `.gitignore` blanket-ignored `backend/*.spec` at
the time) was deleted during this task — that's not shown in `git status`
because it was never tracked.

### What has already been implemented (merged to `main`, commit history)
Six PRs merged before this task, in order: foundational architecture (durable
resumable analysis pipeline, managed media + relink, Alembic migrations, real
root docs), Phase 1 (validation harness), Phase 4 (faster manual coding: JKL
transport, frame nudging, second-press-extends), Phase 3 (auto candidate-event
detection: turnover/shot/counter + one-key Y/N review), Phase 5
(clip-returning natural-language query), Phase 2 (footage triage: cut
detection + main-camera classification). Plus, earlier in the project's life:
Phases 0–3 of the original build (manual coding, CV detection/tracking/teams,
manual-homography heatmaps, possession/passing, shots/xG, NL query), and a
prior (now superseded) attempt at packaging as `fa-sidecar.exe`.

### What is currently being implemented
**Production Windows packaging** per a detailed external spec the user pasted
(reproduced faithfully in §5 below). This uproots the old `fa-sidecar` name in
favour of `cuddy-backend`, adds a proper PyInstaller `.spec` file, file-based
logging, clean process lifecycle (kill sidecar on window close — the old code
left orphaned processes), a staged frontend readiness UI, and a build script.
**A PyInstaller build of `cuddy-backend.exe` was in progress and had not yet
completed when this handoff was requested.** See §4 for exact state.

---

## 2. CURRENT TASK

### The exact task
Convert the existing Python FastAPI backend into a self-contained Windows
executable (`cuddy-backend.exe`) and bundle it into the Tauri app as a proper
Tauri sidecar, so the end-user installer needs no Python/pip/venv/Node/Rust/
backend source on the target machine. The user supplied a 20-phase spec
(entry point, health endpoint, PyInstaller, resource paths, Tauri sidecar
config, shell permissions, Rust lifecycle, dev-mode preservation, startup
sync, process management, logging, port handling, frontend API config, build
script, package.json scripts, then testing phases 16–19, then docs) and asked
that it be implemented **without rewriting Cuddy's architecture** and while
**preserving existing dev workflow**.

### Intended final behavior
```
Cuddy_<version>_x64-setup.exe
    ↓ installs Cuddy
User launches Cuddy
    ↓ Tauri spawns bundled cuddy-backend.exe (as a tracked child process)
cuddy-backend.exe starts FastAPI on 127.0.0.1:8765
    ↓ (frontend polls /health with a staged UI + a ~20s failure threshold)
React frontend communicates with FastAPI
    ↓ on window close, Tauri kills the cuddy-backend.exe child — no orphans
```
User needs none of: Python, pip, Node, Rust, a venv, backend source.

### Why we are implementing it
This is the last step to make Cuddy a genuinely standalone, distributable
desktop app (it was already published as a GitHub Release installer earlier,
but that installer used a **lean** sidecar without the CV stack, and
separately a **full CV** sidecar was built once with a hand-run PyInstaller
command — not a maintained `.spec`, not integrated into `lib.rs`'s naming, and
without the process-lifecycle/logging/readiness-UI hardening this task adds).

### The architecture we decided on
- Keep the **existing FastAPI app object** (`backend/app/main.py:app`) — never
  construct a second app for packaging.
- Two backend entry points, on purpose:
  - `backend/app/__main__.py` — **dev only** (`python -m app`), uses relative
    imports (`from .config import settings`), reads `CUDDY_HOST`/`CUDDY_PORT`.
  - `backend/sidecar_entry.py` — **production/frozen only**, uses **absolute**
    imports (`from app.config import settings`) because a frozen
    PyInstaller build cannot resolve a package's relative imports when that
    module is executed as `__main__`. This is the actual file
    `cuddy-backend.spec` points PyInstaller at.
- PyInstaller `.spec` file (not a one-line CLI command) so the build is
  reproducible and reviewable: `backend/cuddy-backend.spec`.
- CPU-only PyTorch for the production build (`torch==2.5.1+cpu`), not the
  CUDA build the dev GPU venv uses — this is intentional (spec calls for the
  installer to run on any Windows PC, not just ones with an NVIDIA GPU;
  CPU-only was also chosen in an earlier session to keep the installer under
  GitHub's 2 GB release-asset limit — the CUDA build made a ~2.6 GB exe).
- Rust `lib.rs`: sidecar renamed `fa-sidecar` → `cuddy-backend`; spawn now
  captures the `CommandChild` handle in managed Tauri state
  (`BackendProcess(Mutex<Option<CommandChild>>)`) and kills it in a
  `on_window_event` `CloseRequested` handler.
- Tauri capability tightened from broad `shell:default` to a scoped
  `shell:allow-execute` permission naming only
  `{ "name": "binaries/cuddy-backend", "sidecar": true }` — verified against
  the actual `tauri-plugin-shell` 2.3.6 source (see §7) that this scope shape
  is valid, though also confirmed the Rust-side `.sidecar().spawn()` call
  bypasses the ACL system entirely (permissions only gate JS `invoke` calls) —
  so this capability change is defense-in-depth/documentation of intent, not
  something the current spawn path actually depends on.
- Frontend readiness: extended the existing `Health` union
  (`"checking"|"online"|"offline"`) with a new `"failed"` state, reached after
  12 failed health-poll attempts (~20s at the existing 1.5s poll interval).
  `App.tsx` now shows three UI states instead of two, with Retry on failure.

---

## 3. WORK COMPLETED

All items below are **uncommitted** (working tree only). Each was reviewed by
reading the file after editing; only some were runtime-tested — see the
"tested" column honestly.

| # | File | What changed | Why | Tested? |
|---|---|---|---|---|
| 1 | `backend/app/main.py` | `/health` response gained a `"service": "cuddy-backend"` field (was `{"status","app","version"}`) | Spec Phase 2 wants a `service` field on health | **No** — not re-run after this specific edit; was fine before the edit (health endpoint pre-existed and worked in earlier sessions) |
| 2 | `backend/app/config.py` | Added `Settings.logs_dir` property (`data_dir/"logs"`) and added it to `ensure_dirs()` | Spec Phase 11 wants logs under `%LOCALAPPDATA%\Cuddy\logs\` | **No** |
| 3 | `backend/app/logging_setup.py` (NEW) | `setup_logging()`: attaches a `RotatingFileHandler` (2MB × 3 backups) writing to `logs_dir/backend.log`, keeps console handler, routes uvicorn's loggers through root | Spec Phase 11: user-troubleshootable logs without a terminal | **No** — written, not executed |
| 4 | `backend/sidecar_entry.py` | Rewritten: calls `setup_logging()` first (before any other import), reads `CUDDY_HOST`/`CUDDY_PORT` env overrides (falling back to `settings.host`/`settings.port`), wraps `main()` in try/except that logs a `logging.critical` with full traceback before `sys.exit(1)` on any startup failure | Spec Phase 1 (env overrides) + Phase 11 (log startup failures, e.g. missing DLL/model) | **No** — not yet run in this form; the *previous* version of this file (without logging/env-override) was proven to work in an earlier session |
| 5 | `backend/app/__main__.py` | Added the same `CUDDY_HOST`/`CUDDY_PORT` override logic (dev entry point), with a docstring explaining why it's a *separate* file from `sidecar_entry.py` (relative-import limitation when frozen) | Spec Phase 1 literally asks for this on `__main__.py`; kept dev/prod behaviourally consistent | **No** |
| 6 | `backend/cuddy-backend.spec` (NEW) | PyInstaller spec: `Analysis(["sidecar_entry.py"], ...)`, `collect_all()` for `numpy, scipy, pandas, matplotlib, torch, torchvision, ultralytics, cv2, supervision, sklearn`, explicit `datas=[("alembic.ini","."), ("alembic","alembic")]`, explicit `hiddenimports` for all `app.routes.*`, `validation.*`, uvicorn loop/protocol/lifespan submodules, `anthropic`, `alembic.runtime.migration`, `sqlalchemy.dialects.sqlite`, `pydantic_settings`. `EXE(..., name="cuddy-backend", console=True, upx=False)` | Spec Phase 3 — see §6 for full reasoning incl. the alembic-data-bundling gotcha | **Partially** — a build using this exact spec was **in progress, not finished** when this handoff was written (see §4). An *earlier, less complete* ad-hoc PyInstaller command (not this .spec, missing alembic/anthropic/collect_all coverage) was proven to build+run+pass a full-analysis test in a prior session — see §10. |
| 7 | `.gitignore` | Changed `backend/*.spec` (blanket-ignored) to only ignore `backend/build/` and `backend/dist/`, so `cuddy-backend.spec` itself is trackable | Spec wants the `.spec` file committed as source-of-truth build config | N/A (not a code change) |
| 8 | `src-tauri/src/lib.rs` | Rewritten: added `BackendProcess(Mutex<Option<tauri_plugin_shell::process::CommandChild>>)` managed state; `.sidecar("cuddy-backend")` (renamed from `"fa-sidecar"`); on successful spawn, stores the `CommandChild` in that state; added `.on_window_event(...)` handler that on `WindowEvent::CloseRequested` takes the child from state and calls `.kill()` | Spec Phase 7 (Rust lifecycle via shell plugin) + Phase 10 (no orphaned processes on close) | **No** — `cargo check` was run but **failed**, not because of this code, but because `tauri.conf.json`'s `externalBin` now points at `binaries/cuddy-backend-x86_64-pc-windows-msvc.exe` which doesn't exist yet (see §4, §7). The Rust code itself has not been confirmed to compile. |
| 9 | `src-tauri/tauri.conf.json` | `"externalBin": ["binaries/fa-sidecar"]` → `["binaries/cuddy-backend"]` | Match the renamed sidecar | Indirectly tested by the `cargo check` failure above — confirms Tauri is reading this value correctly (it's what produced the "doesn't exist" error) |
| 10 | `src-tauri/capabilities/default.json` | `"shell:default"` → a scoped permission object: `{"identifier":"shell:allow-execute","allow":[{"name":"binaries/cuddy-backend","sidecar":true}]}` | Spec Phase 6 — avoid broad shell permissions, explicit sidecar-only grant | **No build test** — but the JSON shape was manually verified correct by reading the actual `tauri-plugin-shell-2.3.6` source (`scope_entry.rs`, `scope.rs`) at `C:\Users\saiff\.cargo\registry\src\index.crates.io-1949cf8c6b5b557f\tauri-plugin-shell-2.3.6\`. Confirmed: `command`/`cmd` field is optional when `sidecar: true`; `name`+`sidecar` alone is a valid `Entry`. Also confirmed (same source read) that this permission is **not actually enforced** for our use case, since `Shell::sidecar()` → `Command::new_sidecar()` is called from pure Rust in `setup()`, which bypasses the ACL/scope system entirely (that system only gates JS `invoke()` calls, and the frontend never calls the shell plugin's JS API — confirmed via grep, only `@tauri-apps/plugin-shell` in `package.json`, zero imports of it in `src/`). |
| 11 | `src/store.ts` | `Health` type: `"checking"\|"online"\|"offline"` → added `"failed"`. Added `healthAttempts: number` state field. `checkHealth()` now increments `healthAttempts` on failure and sets `health: "failed"` once `attempts > 12`, else `"offline"`; resets `healthAttempts` to 0 on success. Added `resetHealthCheck()` action (sets `health:"checking", healthAttempts:0`) | Spec Phase 9 — distinguish "still starting" from "genuinely failed", enable Retry | **Yes, partially** — frontend build (`npm run build`) passed cleanly after this change |
| 12 | `src/App.tsx` | Added `STAGE_MESSAGE` map (`checking`→"Starting Cuddy Engine…", `offline`→"Connecting to Analysis Engine…"). Boot polling loop now stops once `health==="failed"` (was: poll forever). Added `retry()` calling `resetHealthCheck()`. Render logic: 3-way branch — `failed` (new "Analysis Engine failed to start." UI with Retry button + a "View Logs" text pointing at the log path) / `!online` (staged message) / `online` (Workspace) | Spec Phase 9 exactly | **Yes, partially** — `npm run build` passed cleanly |
| 13 | `src/components/TitleBar.tsx` | `dot` and `label` maps extended with a `failed` entry; wording changed to match the spec's suggested copy ("Starting Cuddy Engine…", "Connecting to Analysis Engine…", "Engine ready", "Engine failed to start") | Consistency with the new staged UI | **Yes, partially** — `npm run build` passed cleanly |
| 14 | `package.json` | Added two scripts: `"build:backend": "powershell ... scripts/build-windows.ps1 -BackendOnly"`, `"build:windows": "powershell ... scripts/build-windows.ps1"` (no existing scripts removed) | Spec Phase 15 | **No** — scripts not yet invoked; only the underlying `.ps1` file's *logic* was designed, not run end-to-end |
| 15 | `scripts/build-windows.ps1` (NEW) | Full build script: verifies npm/cargo/py, creates/updates `backend/.venv-cpu`, installs CPU torch + `requirements.txt` + the CV packages from `requirements-cv.txt` (hardcoded versions, matching that file) + PyInstaller, runs `pyinstaller cuddy-backend.spec --noconfirm --clean` from `backend/`, copies `backend/dist/cuddy-backend.exe` → `src-tauri/binaries/cuddy-backend-x86_64-pc-windows-msvc.exe`, then (unless `-BackendOnly`) runs `npm run app:build`, then finds and reports the newest `.exe` under `src-tauri/target/release/bundle/nsis/`. Supports `-SkipBackend` and `-BackendOnly` switches. | Spec Phase 14 | **No** — written, never executed even once (the manual build in §4 used direct PyInstaller CLI calls, not this script) |
| 16 | `docs/architecture.md` | Replaced the old "Production sidecar packaging (deferred)" section (which described the *original*, superseded `fa-sidecar` one-liner approach) with a new "Production backend packaging" section: dev vs prod architecture diagrams, build commands, what `cuddy-backend.spec` collects and why (incl. the alembic-data gotcha), a logging/troubleshooting table, and a security-notes paragraph | Spec Phase 20 | N/A (docs) |
| 17 | `CLAUDE.md` (repo root) | Commands section: added `build:backend`/`build:windows`, clarified `app:build` now expects an existing sidecar. Notes section: mentioned `logs_dir`, and that editing `backend/app/` does NOT reach an already-installed Cuddy without a rebuild | Keep root docs accurate per existing convention (`## Commands`/`## Notes` sections) | N/A (docs) |
| 18 | `backend/fa-sidecar.spec` | **Deleted** (was untracked, superseded by `cuddy-backend.spec`) | Cleanup — avoid confusion between two spec files | N/A |

---

## 4. WORK IN PROGRESS

> **UPDATE, written moments after the rest of this document:** the build
> described below **completed successfully (exit code 0) while this handoff
> was being written.** `backend/dist/cuddy-backend.exe` now exists, 430,238,900
> bytes (~410 MiB), timestamped 2026-09-13 21:18. The PyInstaller log's tail
> shows a normal successful finish (`Building EXE from EXE-00.toc completed
> successfully`), with no visible errors in the tail. **This has NOT been
> smoke-tested yet** (§4 step 2 below, spec Phase 16) — its existence and exit
> code are confirmed; whether it actually runs correctly is not. Per the
> explicit instruction that produced this handoff, no further implementation
> (copying it into `src-tauri/binaries/`, running `cargo check`, building
> Tauri) was performed after this was discovered — that is deliberately left
> for the next step. The rest of this section (§4's original text) describes
> the state as of just before the build finished; the "what remains" list is
> still accurate and is the correct next sequence — just start from step 2
> (standalone smoke test) instead of waiting for the build.

### The one in-progress item: building `cuddy-backend.exe`

- **File involved:** `backend/cuddy-backend.spec` (finished, believed correct)
  and its output `backend/dist/cuddy-backend.exe` (does not exist yet).
- **Current state:** A build was launched with:
  ```
  cd football-analysis/backend
  .venv-cpu/Scripts/python.exe -m PyInstaller cuddy-backend.spec --noconfirm --clean
  ```
  run as a background shell task (task id `bsbvs5ipf` in the original
  session — **that id is meaningless in a new chat/session**, it will not
  exist; you must re-launch the build). As of the last check before this
  handoff was written: the process (`python.exe`, was PID 19688 in the old
  session, ~818 MB RSS and climbing) was still running; `backend/dist/`
  contained only the **old** `fa-sidecar.exe` (430 MB, from a previous
  session's ad-hoc build — safe to delete, or leave, PyInstaller won't
  overwrite it since the new exe is named differently); `backend/build/`
  had only ~26 files (still in the dependency-collection phase — this is
  normal for a `collect_all(torch)` on the first run of a fresh spec, it is
  slow).
- **What remains:** Let the build finish (likely several more minutes; a
  previous ad-hoc CPU-torch PyInstaller build in an earlier session took
  long enough that exact timing wasn't recorded, but the resulting exe was
  ~377–410 MB). Then:
  1. Confirm `backend/dist/cuddy-backend.exe` exists.
  2. **Test it standalone** (spec Phase 16) — start it directly, `curl
     http://127.0.0.1:8765/health`, exercise a few real endpoints (create a
     project, register a tiny video, run `/videos/{id}/analyze`, confirm the
     tracks JSON gets written) **without any Python venv active** — this is
     the point of the whole exercise and was **not done yet** for this
     specific build.
  3. Copy it: `cp backend/dist/cuddy-backend.exe
     src-tauri/binaries/cuddy-backend-x86_64-pc-windows-msvc.exe` (create the
     `binaries/` dir if needed — it's gitignored, must exist locally for the
     Tauri build to find it).
  4. Re-run `cargo check` in `src-tauri/` — this previously failed with
     `resource path 'binaries\cuddy-backend-x86_64-pc-windows-msvc.exe'
     doesn't exist` (a Tauri build.rs validation, not a Rust code error) —
     should pass once the binary is in place.
  5. Run the full Tauri production build: `npm run app:build` (or
     `npm run build:windows` to also redo the backend — but the backend is
     already built at that point, so plain `npm run app:build` from
     `football-analysis/` is faster and sufficient once the binary is copied
     in).
  6. Locate the installer under
     `src-tauri/target/release/bundle/nsis/Cuddy_0.1.0_x64-setup.exe` and spot
     check timestamps/size.
  7. **Clean-install test** (spec Phase 18) is explicitly flagged as likely
     out of reach in this environment (no clean Windows VM available) — note
     it as untestable rather than skip it silently, per the spec's own "if
     something cannot be tested, clearly identify it" instruction.

### Known errors encountered so far (all resolved except the pending build)
- `cargo check` failed with `resource path
  'binaries\cuddy-backend-x86_64-pc-windows-msvc.exe' doesn't exist` — this
  is **expected and not a bug**; it will resolve itself once step 3 above is
  done. Do not "fix" this by reverting the `tauri.conf.json` externalBin
  rename.

### Last successful step
Frontend `npm run build` (tsc + vite build) completed cleanly after all the
`store.ts` / `App.tsx` / `TitleBar.tsx` changes — **416 modules, no type
errors**. This was the last thing verified working before the PyInstaller
build was kicked off and this handoff was requested.

### Exact next step for the next agent
1. `cd football-analysis/backend`
2. Check if a `cuddy-backend.exe` build is somehow already running/finished
   from this handoff's session (unlikely across a session boundary — the
   background task almost certainly died with the old process/session).
   Check: `ls dist/cuddy-backend.exe 2>/dev/null; tasklist | grep -i python`
   (Windows) to see if anything is still running.
3. If not present, **re-run the build**:
   `.venv-cpu/Scripts/python.exe -m PyInstaller cuddy-backend.spec --noconfirm --clean`
   (if `.venv-cpu` doesn't exist or lacks packages, see §6 for the exact
   dependency list, or just run `npm run build:backend` from
   `football-analysis/` which is supposed to set this venv up from scratch —
   **that script itself has never been run**, so treat its first execution
   as a test of the script, not a known-good path).
4. Continue from step 2 of "What remains" above.

---

## 5. PRODUCTION PACKAGING PLAN

The end-to-end target (verbatim from the task): a user runs
`Cuddy_<version>_x64-setup.exe`, installs Cuddy, launches it; Tauri starts the
bundled `cuddy-backend.exe`; that starts FastAPI on `127.0.0.1:8765`; the React
frontend talks to it; the user never needs Python, pip, Node, Rust, a venv, or
the backend source.

This repository's actual implementation of that:

- **Entry point split** (dev vs frozen) — see §2 "architecture we decided on"
  and §3 items 4–5.
- **PyInstaller spec, not a CLI one-liner** — `backend/cuddy-backend.spec`,
  see §6.
- **Resource paths already centralized** before this task started: 
  `backend/app/config.py`'s `Settings` class resolves `%LOCALAPPDATA%\Cuddy`
  (or `FA_DATA_DIR` env override) for `db_path`, `media_dir`, `tracks_dir`,
  and now `logs_dir` — all **outside** wherever the exe itself lives, so the
  install directory is never written into. This was already correct
  architecture from an earlier session; this task only added `logs_dir`.
- **Tauri sidecar wiring** — `tauri.conf.json` `externalBin`, `capabilities/default.json`
  scoped permission, `src-tauri/binaries/cuddy-backend-x86_64-pc-windows-msvc.exe`
  (the exact required filename per Tauri's target-triple convention) — see §7.
- **Rust lifecycle** — spawn + track + kill-on-close — see §3 item 8, §7.
- **Dev mode untouched** — `npm run dev` / `npm run app` still use the local
  venv backend via `beforeDevCommand` in `tauri.conf.json` (unchanged) and
  `#[cfg(not(debug_assertions))]` gating the sidecar spawn in `lib.rs`
  (unchanged from before this task — this gate already existed).
- **Readiness UI** — §3 items 11–13.
- **Build script + npm scripts** — §3 items 14–15.
- **Logging** — §3 item 3.
- **Docs** — §3 items 16–17.

---

## 6. PYINSTALLER

- **Current entry point:** `backend/sidecar_entry.py` (absolute imports;
  calls `setup_logging()` then `main()` which does
  `uvicorn.run(app, host=..., port=...)` reusing `app.main.app`).
- **Spec file:** `backend/cuddy-backend.spec` (full contents already written
  to disk — read it directly, don't reconstruct from this summary). Key
  contents:
  - `Analysis(["sidecar_entry.py"], pathex=["."], ...)` — **must be invoked
    with CWD = `backend/`**, or `pathex=["."]` and the relative `datas` paths
    (`"alembic.ini"`, `"alembic"`) will not resolve.
  - `COLLECT_ALL = ["numpy","scipy","pandas","matplotlib","torch",
    "torchvision","ultralytics","cv2","supervision","sklearn"]`, each run
    through `PyInstaller.utils.hooks.collect_all()` to gather
    datas+binaries+hiddenimports.
  - Explicit `datas=[("alembic.ini","."), ("alembic","alembic")]` — **critical
    and non-obvious**: `backend/app/migrations.py` does
    `Path(__file__).resolve().parent.parent / "alembic.ini"` to find these
    files. In a frozen PyInstaller build, `__file__` for a bundled pure-Python
    module resolves to a virtual path rooted at `sys._MEIPASS` (the onefile
    extraction temp dir) — `Path().resolve()` doesn't require the path to
    exist, it's pure string math, so this computes to
    `_MEIPASS/alembic.ini` and `_MEIPASS/alembic/...`. Those files must
    therefore be bundled at the **root** of the onefile archive, matching the
    `backend/` directory's own layout — which is exactly what
    `("alembic.ini", ".")` and `("alembic", "alembic")` do. **This was worked
    out by reading `migrations.py`'s source in this task, not assumed** — if
    the DB/migrations fail in the frozen exe, check this first.
  - Explicit `hiddenimports` list covering every `app.routes.*` module, the
    top-level `validation` package (used by
    `app/routes/analysis.py`'s `/videos/{id}/validation` endpoint via a
    runtime `from validation.service import ...` — this is a **sibling
    top-level package**, not under `app/`, so it needs its own hidden-import
    entries), uvicorn's loop/protocol/lifespan submodules, `anthropic`,
    `alembic.runtime.migration`, `sqlalchemy.dialects.sqlite`,
    `pydantic_settings`.
  - `EXE(..., name="cuddy-backend", console=True, upx=False, ...)`. `console=True`
    is deliberate (spec Phase 3 doesn't ask for windowless; keeping a console
    makes early debugging easier — **revisit this before a "final" ship** if
    a console flash on launch is undesirable; the spec doesn't explicitly
    forbid it but a polished product probably wants `console=False`
    eventually. Flagged here, not decided.)
- **Model files:** `yolov8n.pt` is **not bundled** — Ultralytics
  auto-downloads it on first `YOLO("yolov8n.pt")` call
  (`backend/app/cv/pipeline.py`) if not already cached. This preserves
  existing dynamic-download behaviour per the spec's explicit instruction
  ("if models are downloaded dynamically, preserve that"). **Caveat, not yet
  verified in the frozen exe:** confirm the download lands in a
  user-writable location, not inside the read-only extracted bundle — this
  wasn't specifically re-checked in this task; it worked in an earlier
  session's cruder build, but re-verify.
- **Build command (manual, what was actually run):**
  ```
  cd football-analysis/backend
  .venv-cpu/Scripts/python.exe -m PyInstaller cuddy-backend.spec --noconfirm --clean
  ```
  (The maintained/intended path is `npm run build:backend` from
  `football-analysis/`, which wraps venv setup + this same command — but that
  script has never been executed, see §4.)
- **Current PyInstaller errors:** none observed yet — the build simply had
  not finished when this handoff was written. No traceback was seen.

### The `backend/.venv-cpu` environment
A previous session created this venv with: `py -3.12 -m venv .venv-cpu`, then
`pip install torch==2.5.1 torchvision==0.20.1 --index-url
https://download.pytorch.org/whl/cpu`, then `pip install -r requirements.txt`,
then `pip install ultralytics==8.3.40 supervision==0.25.1
opencv-python-headless==4.10.0.84 scikit-learn==1.6.0 lapx==0.5.11`, then
`pip install pyinstaller==6.11.1`. **This venv should already exist and be
populated** on this machine (verify with `backend/.venv-cpu/Scripts/python.exe
-c "import torch, cv2, ultralytics, alembic, anthropic; print('ok')"`) — if it
doesn't exist or is incomplete, re-run those install commands (or run
`npm run build:backend`, untested but designed to do exactly this).

---

## 7. TAURI SIDECAR

- **`tauri.conf.json` changes:** `bundle.externalBin` changed from
  `["binaries/fa-sidecar"]` to `["binaries/cuddy-backend"]`. Everything else
  in that file (window config, icon list, NSIS target, `beforeDevCommand`)
  is **unchanged** from before this task.
- **Binaries directory:** `src-tauri/binaries/` — **gitignored**
  (`src-tauri/binaries/` is in `.gitignore`, unchanged by this task), must
  contain the platform-suffixed exe locally for both `cargo check` and
  `tauri build` to succeed.
- **Required executable name:** `cuddy-backend-x86_64-pc-windows-msvc.exe`
  (Tauri's sidecar convention: `<name-from-externalBin>-<target-triple>.exe`
  on Windows). Confirmed target triple on this machine in an earlier session:
  `x86_64-pc-windows-msvc` (via `rustc -vV`).
- **Target triple:** `x86_64-pc-windows-msvc` (Windows-only target; this repo
  has not been built for macOS/Linux).
- **Shell permissions:** see §3 item 10 for the exact JSON and the research
  behind it. File: `src-tauri/capabilities/default.json`.
- **Rust sidecar startup code:** `src-tauri/src/lib.rs`, full current
  contents (already written to disk, read directly). Summary: `setup()`
  spawns `cuddy-backend` sidecar only in release builds
  (`#[cfg(not(debug_assertions))]`), stores the `CommandChild` in managed
  state; a new `on_window_event` closure kills that child on
  `WindowEvent::CloseRequested`.
- **Backend process lifecycle:** spawn on app start (release only) → tracked
  in `BackendProcess` Tauri-managed state → killed on window close. **Not yet
  verified to compile** (blocked on the missing binary — see §4) — treat the
  Rust code as **unverified** until `cargo check` passes.
- **Current status:** blocked on §4's pending build. Nothing beyond that is
  known to be broken, but nothing beyond `cargo check`'s resource-path error
  has actually been observed either.

---

## 8. FRONTEND/BACKEND CONNECTION

- **Backend URL/port:** `http://127.0.0.1:8765`, hardcoded as
  `export const API_BASE = "http://127.0.0.1:8765";` in `src/lib/api.ts`
  (this predates this task, confirmed still centralized — grep shows it's the
  *only* place the literal URL appears; every other file imports `API_BASE`
  or the helper functions built on it). This satisfies spec Phase 13
  ("don't scatter the URL") **without needing a change** — it was already
  correct.
- **Health endpoint:** `GET /health` → now
  `{"status":"ok","service":"cuddy-backend","app":"Cuddy","version":"0.1.0"}`
  (see §3 item 1).
- **Startup/readiness detection:** `src/App.tsx` polls `checkHealth()` every
  1.5s (unchanged interval) until `health !== "checking" && health !== "failed"`
  is no longer true... precisely: the `setInterval` callback checks
  `if (h !== "online" && h !== "failed") checkHealth()` — so polling
  self-stops once either online or failed. Failure is declared after 12
  consecutive failed attempts (~20s wall-clock at the 1.5s interval, though
  the *first* check happens immediately in `boot()` before the interval
  starts, so it's closer to 12 intervals + 1 immediate ≈ still ~20s).
- **Frontend API configuration:** centralized in `src/lib/api.ts`
  (`API_BASE` const) — not modified in this task, confirmed already correct.
- **Development behavior:** `npm run dev` (or `npm run app` for the Tauri
  window) uses the local venv backend, started by `beforeDevCommand: "npm run
  dev"` in `tauri.conf.json` (which itself runs both the Vite dev server and
  `python -m app` — see the `dev`/`dev:api`/`dev:web` scripts in
  `package.json`, all unchanged by this task).
- **Production behavior:** the bundled `cuddy-backend.exe` sidecar, spawned
  by Rust (see §7), serving on the same `127.0.0.1:8765`.

---

## 9. FILES

### Created in this task
- `football-analysis/backend/app/logging_setup.py`
- `football-analysis/backend/cuddy-backend.spec`
- `football-analysis/scripts/build-windows.ps1`
- `docs/CLAUDE_HANDOFF.md` (this file)

### Modified in this task
- `CLAUDE.md` (repo root)
- `football-analysis/.gitignore`
- `football-analysis/backend/app/__main__.py`
- `football-analysis/backend/app/config.py`
- `football-analysis/backend/app/main.py`
- `football-analysis/backend/sidecar_entry.py`
- `football-analysis/docs/architecture.md`
- `football-analysis/package.json`
- `football-analysis/src-tauri/capabilities/default.json`
- `football-analysis/src-tauri/src/lib.rs`
- `football-analysis/src-tauri/tauri.conf.json`
- `football-analysis/src/App.tsx`
- `football-analysis/src/components/TitleBar.tsx`
- `football-analysis/src/store.ts`

### Deleted in this task
- `football-analysis/backend/fa-sidecar.spec` (untracked, superseded)

### Files that should NOT be modified (without explicit reason)
- `football-analysis/FEATURES.md` — **the user explicitly instructed, in an
  earlier unrelated part of this session, "don't commit features"**. It's
  untracked on purpose. Do not `git add` it, do not delete it.
- `football-analysis/backend/.venv/` and `.venv-cpu/` — gitignored dev/build
  environments; don't try to commit them, don't casually `rm -rf` them
  (`.venv-cpu` in particular took a long time to set up with CPU torch).
- `football-analysis/backend/dist/`, `backend/build/`,
  `src-tauri/binaries/`, `src-tauri/target/` — all gitignored build output.
- `football-analysis/backend/alembic/versions/000{1,2,3}_*.py` — these are
  **applied migrations against real user data** (the app has been distributed
  and installed already). Do not edit or renumber existing migration files;
  only ever add new ones.

### Files another agent should inspect first
1. This file.
2. `git status` and `git log --oneline -10` (confirm nothing changed
   underneath this handoff).
3. `football-analysis/backend/cuddy-backend.spec` — the actual current spec,
   don't trust this document's paraphrase for exact syntax.
4. `football-analysis/src-tauri/src/lib.rs` — same reasoning.
5. `football-analysis/backend/app/migrations.py` — to re-verify the
   alembic-path reasoning in §6 before trusting it.
6. `football-analysis/backend/dist/` and `football-analysis/backend/build/`
   — to see whether the pending build (§4) somehow completed or left a
   traceback.

---

## 10. TEST STATUS

### Tests run in this task
- `cd football-analysis && npm run build` (tsc + vite build) — **PASSED**,
  416 modules, no errors, run after the `store.ts`/`App.tsx`/`TitleBar.tsx`
  changes (§3 items 11–13).
- `cd football-analysis/src-tauri && cargo check` — **FAILED**, but with the
  *expected*, non-code error: `resource path
  'binaries\cuddy-backend-x86_64-pc-windows-msvc.exe' doesn't exist`. This is
  not a Rust compilation error — it's Tauri's build script validating the
  `externalBin` resource before compiling. Rust code correctness is therefore
  **unverified**, not confirmed-broken.
- PyInstaller build of `cuddy-backend.exe` via `cuddy-backend.spec` —
  **completed successfully (exit 0) during the writing of this handoff.**
  `backend/dist/cuddy-backend.exe` exists, ~410 MiB. See the update note at
  the top of §4. **Standalone smoke test was NOT run** — do that first.

### Tests explicitly NOT run in this task
- Standalone `cuddy-backend.exe` smoke test (health, DB init, video import,
  YOLO load, tracking, analysis jobs, AI query) — spec Phase 16. Blocked on
  the build finishing.
- `npm run tauri build` / `npm run app:build` full production build — spec
  Phase 17. Blocked on the binary existing.
- Clean-machine install test (spec Phase 18) — almost certainly out of reach
  in this environment (no clean Windows VM available); flag as such rather
  than skip silently, per the spec's own instruction.
- `scripts/build-windows.ps1` has **never been executed**, not even once.
  Treat its first run as a test of the script itself, not a known-good path
  — it may have bugs (e.g. untested PowerShell syntax, wrong relative paths
  when invoked from a different CWD than assumed).

### Context from an EARLIER, separate session (not this task, but relevant)
A cruder, hand-run PyInstaller command (not using `cuddy-backend.spec`,
missing the alembic-data bundling and the `validation`/`anthropic`/`alembic`
hidden imports this task added) was built, copied into
`src-tauri/binaries/`, and a full Tauri installer was produced and uploaded to
a GitHub release in an earlier session. That earlier build was reported
"tested" via a synthetic-clip analysis run that completed without import
errors after iterating on missing-module errors (numpy, then scipy). **That
build predates and does not reflect the current `cuddy-backend.spec`** — it
used the old `fa-sidecar` naming and lacked several of this task's hidden
imports (`alembic.runtime.migration`, `validation.*`, etc., which weren't
needed then because the validation harness and clip-query features didn't
exist yet at that point in the project's history). Do not assume the current
spec is proven just because a predecessor build once worked — the dependency
surface has grown (Alembic migrations were added since, the `validation`
package was added since).

### Warnings observed
None beyond the expected/explained `cargo check` resource-path error.

---

## 11. KNOWN PROBLEMS

1. **The build in progress may still fail** for reasons not yet seen — most
   likely candidates based on this project's own history: a missing hidden
   import for some dynamically-imported submodule (ultralytics and
   supervision both do plugin-style dynamic imports), or a native-binary
   (DLL) collection gap for torch/opencv. If it fails, read the actual
   PyInstaller traceback — don't guess.
2. **`console=True` in the `.spec`** means the packaged app will likely flash
   a console window on launch (typical PyInstaller/Windows behaviour for a
   sidecar with a console subsystem). Not addressed; flagged for a
   product-polish decision later, not a functional bug.
3. **Dynamic port fallback (spec Phase 12) was NOT implemented.** The spec
   explicitly permits documenting this as a limitation rather than building
   fragile dynamic-port logic, and that's what was done: the backend still
   only binds `127.0.0.1:8765` with no fallback if the port is taken. This is
   a deliberate, spec-sanctioned gap, not an oversight — but it IS a real gap
   if two Cuddy instances (or another app on 8765) ever collide.
4. **The `shell:allow-execute` capability change is unverified end-to-end**
   (blocked on the same pending build/`cargo check`). The source-code reading
   in §3 item 10 is confident but not runtime-proven.
5. **`scripts/build-windows.ps1` is entirely unexecuted.** Possible bugs:
   relative path assumptions, PowerShell quoting, whether `npm run app:build`
   correctly picks up a binary placed by an earlier step in the same script
   run vs. a stale one.
6. **YOLO model auto-download in the frozen exe** was not re-verified in this
   task (see §6) — carried over as an assumption from earlier work.
7. **The old `fa-sidecar.exe` (430 MB) sits in `backend/dist/`** alongside
   whatever `cuddy-backend.exe` eventually appears. Harmless (gitignored,
   different filename) but wastes disk; safe to delete once
   `cuddy-backend.exe` is confirmed working.
8. **UNKNOWN: exact wall-clock time for the `cuddy-backend.exe` PyInstaller
   build.** Not recorded from prior sessions with this exact spec. Budget at
   least 10–20 minutes based on the CV stack's size; if it's still running
   after 30+ minutes with no CPU activity (check `tasklist`/Task Manager for
   the python.exe process actually using CPU, not just existing), something
   is likely stuck and worth investigating rather than waiting indefinitely.

---

## 12. NEXT STEPS

Exact order:

1. Read this file fully. Then run `git status` and `git log --oneline -5` to
   confirm the repo matches §1's description (nothing should have changed —
   this is a fresh chat continuing the same uncommitted working tree).
2. Check whether `football-analysis/backend/dist/cuddy-backend.exe` already
   exists (the build may have finished after this handoff was written, if
   the background process survived — unlikely across a session boundary, but
   check before redoing work).
3. If it doesn't exist: ensure `backend/.venv-cpu` is populated (see §6's
   exact install commands if not), then run, from `football-analysis/backend/`:
   ```
   .venv-cpu/Scripts/python.exe -m PyInstaller cuddy-backend.spec --noconfirm --clean
   ```
   Wait for it to finish. If it errors, fix the specific missing
   import/data/binary the traceback names and re-run — don't restart from
   scratch unless the error is structural.
4. **Test the exe standalone** (spec Phase 16, never done for this build):
   run `backend/dist/cuddy-backend.exe` directly (no venv active), confirm
   `GET http://127.0.0.1:8765/health` responds, then exercise real endpoints:
   create a project, register a short video, POST `/videos/{id}/analyze`,
   poll `/jobs/{id}` to completion, confirm a tracks JSON was written under
   `%LOCALAPPDATA%\Cuddy\tracks\`. Also confirm
   `%LOCALAPPDATA%\Cuddy\logs\backend.log` was created and has sane content.
5. Copy the binary into place:
   ```
   mkdir -p football-analysis/src-tauri/binaries
   cp football-analysis/backend/dist/cuddy-backend.exe \
      football-analysis/src-tauri/binaries/cuddy-backend-x86_64-pc-windows-msvc.exe
   ```
6. `cd football-analysis/src-tauri && cargo check` — should now pass. If it
   doesn't, the error is real Rust code — read §3 item 8 / §7 and fix
   `lib.rs`.
7. `cd football-analysis && npm run app:build` — the full Tauri production
   build. Watch for build failures.
8. Confirm the installer exists under
   `football-analysis/src-tauri/target/release/bundle/nsis/` and sanity-check
   its size (earlier CPU-only full-CV builds were in the ~370–410 MB range;
   wildly different sizes deserve a second look).
9. If feasible, install it and click through: launch → confirm the staged
   readiness UI (Starting → Connecting → Ready) → import a video → run
   Analyse → confirm results appear → close the app → confirm (Task Manager)
   no `cuddy-backend.exe` process survives.
10. Update §10/§11 of this document (or a follow-up note) with what was
    actually observed, rather than silently fixing and moving on — the user
    asked for an honest paper trail.
11. Once the above is confirmed working, commit the working tree (see §13 —
    this handoff itself already includes a checkpoint commit of everything
    that was safe to checkpoint at write-time; anything changed in steps 3–10
    above needs its own follow-up commit).
12. Only after a working installer is confirmed: consider whether to open a
    PR (this repo's established pattern in earlier phases was
    feature-branch → PR → squash-merge to `main` via `gh pr create` /
    `gh pr merge`) — do this only if the user's workflow expects it; nothing
    in this task's instructions asked for a PR, so don't assume it.

---

## 13. GIT CHECKPOINT

At the time this handoff was written, `git status` showed the working tree
described in §1. A commit was made on the current branch
(`feat/production-packaging`) capturing everything **except**
`football-analysis/FEATURES.md`, per the user's standing instruction not to
commit that file. See the actual commit for the exact message and hash —
check `git log -1` on this branch after reading this document, since the
commit was made as part of writing this handoff (this document describes the
state as of just before that commit; the commit itself is the checkpoint).

**Nothing was reset, discarded, force-checked-out, or deleted** other than
the one untracked, superseded `fa-sidecar.spec` file noted in §3 item 18 and
§1.

---

## CONTINUATION INSTRUCTION

Read this file first. Then inspect the actual repository and git status.
Continue from the CURRENT STATE rather than rebuilding completed work. Do not
repeat completed steps unless verification shows they failed.
