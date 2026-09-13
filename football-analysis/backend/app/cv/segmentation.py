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
