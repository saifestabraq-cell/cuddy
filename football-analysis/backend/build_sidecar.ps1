$ErrorActionPreference = "Stop"

Set-Location $PSScriptRoot

if (-not (Test-Path ".venv")) {
  py -3.12 -m venv .venv
}

& .venv\Scripts\python.exe -m pip install --upgrade pip
& .venv\Scripts\python.exe -m pip install -r requirements.txt pyinstaller
& .venv\Scripts\python.exe -m pip install --index-url https://download.pytorch.org/whl/cpu "torch==2.8.0" "torchvision==0.23.0"

& .venv\Scripts\python.exe -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"

$root = (Get-Location).Path
$dist = Join-Path $root "dist"
$work = Join-Path $root "build"
$spec = Join-Path $root "cuddy_sidecar.spec"

if (Test-Path $dist) { Remove-Item $dist -Recurse -Force }
if (Test-Path $work) { Remove-Item $work -Recurse -Force }

& .venv\Scripts\pyinstaller.exe --noconfirm --clean $spec

$target = Join-Path $root "..\src-tauri\binaries\fa-sidecar-x86_64-pc-windows-msvc.exe"
New-Item -ItemType Directory -Force -Path (Split-Path $target) | Out-Null
Copy-Item (Join-Path $dist "fa-sidecar.exe") $target -Force

Write-Host "Sidecar ready: $target"
