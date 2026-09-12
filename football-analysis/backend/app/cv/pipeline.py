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
