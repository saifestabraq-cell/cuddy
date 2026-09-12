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
