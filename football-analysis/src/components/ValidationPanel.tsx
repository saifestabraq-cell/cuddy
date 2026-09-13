import { useState } from "react";
import { useStore } from "../store";
import { api } from "../lib/api";
import type { ValidationResult } from "../lib/types";

/**
 * Phase 1: score the AI's events against the analyst's manually-coded events.
 * The headline is "corrections required" — the estimated edits to turn the AI
 * output into the reference. Lower is a better model.
 */
export default function ValidationPanel() {
  const videoId = useStore((s) => s.currentVideoId);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const run = async () => {
    if (!videoId) return;
    setBusy(true);
    setErr(null);
    try {
      setResult(await api.getValidation(videoId));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  };

  const e = result?.events;

  return (
    <div className="panel p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          Validation
        </span>
        <button
          className="text-mist-300 hover:text-teal-300 transition-colors text-xs"
          disabled={busy || !videoId}
          onClick={run}
        >
          {result ? "Re-score" : "Score AI vs coding"}
        </button>
      </div>

      {!result ? (
        <p className="text-mist-400 text-sm">
          Compare AI-suggested events against your manually-coded ones —
          precision, recall, and the edits needed to reconcile them.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Precision" value={fmt(e!.precision)} color="#6EE7D6" />
            <Stat label="Recall" value={fmt(e!.recall)} color="#6EE7D6" />
            <Stat label="Corrections" value={String(e!.corrections_required)} color="#F0A6C0" />
          </div>
          <div className="text-xs text-mist-400 flex flex-wrap gap-x-4 gap-y-1">
            <span>matched {e!.tp}</span>
            <span>false+ {e!.fp}</span>
            <span>missed {e!.fn}</span>
            <span>bound err {e!.boundary_error_ms}ms</span>
            {result.xg && <span className="text-violet-300">xG brier {result.xg.brier}</span>}
          </div>
          <p className="text-[11px] text-mist-500">
            Scored against your {e!.reference} manual event
            {e!.reference === 1 ? "" : "s"}. Needs some hand-coded events to be
            meaningful.
          </p>
        </div>
      )}
      {err && <p className="text-xs text-signal-live mt-2">{err}</p>}
    </div>
  );
}

const fmt = (v: number) => `${Math.round(v * 100)}%`;

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="card p-2 text-center">
      <div className="text-xl font-semibold tabular-nums" style={{ color }}>
        {value}
      </div>
      <div className="text-[11px] uppercase tracking-wide text-mist-400">{label}</div>
    </div>
  );
}
