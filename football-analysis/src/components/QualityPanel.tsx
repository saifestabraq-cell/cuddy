import { useStore } from "../store";
import type { QualityMetric } from "../lib/types";

// Metrics where a HIGHER value is worse (fewer = better tracking).
const LOWER_IS_BETTER = new Set(["gap_rate", "occlusion_proxy"]);

const BAND_COLOR: Record<string, string> = {
  good: "#6EE7D6",
  fair: "#F2C879",
  poor: "#F0A6C0",
};

function goodness(m: QualityMetric): number {
  return LOWER_IS_BETTER.has(m.key) ? 1 - m.value : m.value;
}

function colorFor(m: QualityMetric): string {
  const g = goodness(m);
  return g >= 0.75 ? BAND_COLOR.good : g >= 0.5 ? BAND_COLOR.fair : BAND_COLOR.poor;
}

/** Runtime tracking-quality diagnostic (§6): how much to trust the spatial
 *  layer for THIS footage. Descriptive of the tracking signal, not ground
 *  truth (that's Validation). Only shows once a video has been analysed. */
export default function QualityPanel() {
  const quality = useStore((s) => s.quality);
  if (!quality || !quality.assessable) return null;

  const bandColor = BAND_COLOR[quality.overall.band] ?? "#8A90A0";

  return (
    <div className="panel p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          Tracking quality
        </span>
        <span
          className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-md border"
          style={{
            color: bandColor,
            borderColor: `${bandColor}66`,
            background: `${bandColor}14`,
          }}
          title={`Heuristic overall score ${Math.round(quality.overall.score * 100)}%`}
        >
          {quality.overall.band} · {Math.round(quality.overall.score * 100)}%
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {quality.metrics.map((m) => {
          const color = colorFor(m);
          const pct = Math.round(m.value * 100);
          return (
            <div key={m.key} className="card p-2" title={m.label}>
              <div className="flex items-baseline justify-between">
                <span
                  className="text-lg font-semibold tabular-nums"
                  style={{ color }}
                >
                  {pct}%
                </span>
                {LOWER_IS_BETTER.has(m.key) && (
                  <span className="text-[9px] text-mist-500" title="lower is better">
                    ↓ better
                  </span>
                )}
              </div>
              <div className="h-1 rounded-full bg-ink-900/70 overflow-hidden mt-1">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
              <div className="text-[10px] uppercase tracking-wide text-mist-400 mt-1 leading-tight">
                {m.label}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-mist-500 mt-2 leading-snug">
        {quality.n_tracks != null && (
          <>
            {quality.n_tracks} tracks
            {quality.fragment_tracks
              ? ` · ${quality.fragment_tracks} fragmentary`
              : ""}{" "}
            ·{" "}
          </>
        )}
        {quality.note}
      </p>
    </div>
  );
}
