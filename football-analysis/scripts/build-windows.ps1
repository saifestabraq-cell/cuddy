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

  Run from the repository's football-analysis/ directory, or anywhere — the
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
    if ($LASTEXITCODE -ne 0) { throw "Backend dependency verification failed — a required package did not install." }

    # ---- 4. Build cuddy-backend.exe ---------------------------------------
    Write-Step "Building cuddy-backend.exe (PyInstaller — several minutes)"
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
        throw "No existing sidecar at $dest — run without -SkipBackend first."
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
