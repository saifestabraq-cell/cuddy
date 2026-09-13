"""Scoring functions (pure, DB-agnostic) for the validation harness.

Events are compared as dicts: {"code": str, "start_ms": int, "end_ms": int}.
An auto (predicted) event matches a manual (reference) event when they share a
code and their time intervals overlap by at least ``iou_tol`` (temporal IoU).
Matching is greedy one-to-one, best overlap first.

The headline number is ``corrections_required`` — the estimated human actions to
turn the AI output into the reference: one *reject* per false positive, one *add*
per false negative, one *adjust* per matched pair whose boundaries are off by
more than ``boundary_tol_ms``. Fewer corrections = a better model.
"""

from __future__ import annotations

from typing import Any


def _iou(a: dict, b: dict) -> float:
    start = max(a["start_ms"], b["start_ms"])
    end = min(a["end_ms"], b["end_ms"])
    inter = max(0, end - start)
    union = (a["end_ms"] - a["start_ms"]) + (b["end_ms"] - b["start_ms"]) - inter
    return inter / union if union > 0 else 0.0


def score_events(
    reference: list[dict],
    predicted: list[dict],
    iou_tol: float = 0.3,
    boundary_tol_ms: int = 500,
) -> dict[str, Any]:
    """Precision/recall/boundary error + corrections-required for event detection."""
    ref = list(reference)
    pred = list(predicted)

    candidates: list[tuple[float, int, int]] = []
    for i, r in enumerate(ref):
        for j, p in enumerate(pred):
            if r["code"] == p["code"]:
                v = _iou(r, p)
                if v >= iou_tol:
                    candidates.append((v, i, j))
    candidates.sort(reverse=True)  # best overlap first

    used_ref: set[int] = set()
    used_pred: set[int] = set()
    matched: list[tuple[int, int]] = []
    for _v, i, j in candidates:
        if i in used_ref or j in used_pred:
            continue
        used_ref.add(i)
        used_pred.add(j)
        matched.append((i, j))

    tp = len(matched)
    fp = len(pred) - len(used_pred)
    fn = len(ref) - len(used_ref)
    precision = tp / (tp + fp) if (tp + fp) else 0.0
    recall = tp / (tp + fn) if (tp + fn) else 0.0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) else 0.0

    boundary_errs = [
        (abs(ref[i]["start_ms"] - pred[j]["start_ms"])
         + abs(ref[i]["end_ms"] - pred[j]["end_ms"])) / 2
        for i, j in matched
    ]
    boundary_error_ms = sum(boundary_errs) / len(boundary_errs) if boundary_errs else 0.0
    adjustments = sum(1 for e in boundary_errs if e > boundary_tol_ms)

    return {
        "reference": len(ref),
        "predicted": len(pred),
        "tp": tp,
        "fp": fp,
        "fn": fn,
        "precision": round(precision, 3),
        "recall": round(recall, 3),
        "f1": round(f1, 3),
        "boundary_error_ms": round(boundary_error_ms, 1),
        "boundary_adjustments": adjustments,
        "corrections_required": fp + fn + adjustments,
        "params": {"iou_tol": iou_tol, "boundary_tol_ms": boundary_tol_ms},
    }


def score_xg(shots: list[dict]) -> dict[str, Any] | None:
    """Calibration of xG against known outcomes (Brier score), when outcomes exist.

    shots: [{"xg": float, "goal": bool}]. Returns None if no labeled outcomes.
    """
    labeled = [s for s in shots if "goal" in s]
    if not labeled:
        return None
    n = len(labeled)
    brier = sum((s["xg"] - (1.0 if s["goal"] else 0.0)) ** 2 for s in labeled) / n
    return {
        "n": n,
        "goals": sum(1 for s in labeled if s["goal"]),
        "sum_xg": round(sum(s["xg"] for s in labeled), 2),
        "brier": round(brier, 4),
    }


def format_report(event_scores: dict, xg_scores: dict | None = None) -> str:
    """A compact, comparable text report for a run."""
    e = event_scores
    lines = [
        "== Validation report ==",
        f"events   ref={e['reference']}  pred={e['predicted']}  "
        f"tp={e['tp']} fp={e['fp']} fn={e['fn']}",
        f"quality  precision={e['precision']}  recall={e['recall']}  f1={e['f1']}",
        f"bounds   mean_error={e['boundary_error_ms']}ms  "
        f"adjustments={e['boundary_adjustments']}",
        f"EFFORT   corrections_required={e['corrections_required']}",
    ]
    if xg_scores:
        lines.append(
            f"xG       n={xg_scores['n']} goals={xg_scores['goals']} "
            f"sum_xg={xg_scores['sum_xg']} brier={xg_scores['brier']}"
        )
    return "\n".join(lines)
