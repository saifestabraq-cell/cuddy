from pathlib import Path
from PyInstaller.utils.hooks import collect_all

ROOT = Path(__file__).resolve().parent

datas = [
    (str(ROOT / "alembic"), "alembic"),
    (str(ROOT / "app"), "app"),
    (str(ROOT / "yolov8n.pt"), "."),
]

binaries = []
hiddenimports = []

for package in ("ultralytics", "torch", "torchvision", "cv2", "supervision", "sklearn"):
    try:
        d, b, h = collect_all(package)
        datas += d
        binaries += b
        hiddenimports += h
    except Exception:
        pass

a = Analysis(
    ["app/__main__.py"],
    pathex=[str(ROOT)],
    binaries=binaries,
    datas=datas,
    hiddenimports=hiddenimports,
    excludes=["torch.distributed"],
    noarchive=False,
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name="fa-sidecar",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=False,
    console=True,
)
