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
    "app.routes.analysis",
    "app.routes.categories",
    "app.routes.descriptors",
    "app.routes.events",
    "app.routes.export",
    "app.routes.projects",
    "app.routes.settings",
    "app.routes.templates",
    "app.routes.videos",
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
