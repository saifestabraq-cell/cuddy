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
