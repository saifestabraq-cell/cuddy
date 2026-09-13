import { useState } from "react";
import { useStore } from "../store";
import { TEAM_COLORS } from "./AnalyzePanel";

/** Possession % + passing network + turnovers (Phase 3a). */
export default function AnalyticsPanel() {
  const tracks = useStore((s) => s.tracks);
  const analytics = useStore((s) => s.analytics);
  const computeAnalytics = useStore((s) => s.computeAnalytics);
  const tagTurnovers = useStore((s) => s.tagTurnovers);

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  if (!tracks) {
    return (
      <div className="panel p-3">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          Possession &amp; passing
        </span>
        <p className="text-mist-400 text-sm mt-2">Analyse the video first.</p>
      </div>
    );
  }

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };

  const pA = analytics?.possession_pct["0"] ?? 0;
  const pB = analytics?.possession_pct["1"] ?? 0;

  return (
    <div className="panel p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          Possession &amp; passing
        </span>
        <button
          className="text-mist-300 hover:text-teal-300 transition-colors text-xs"
          disabled={busy}
          onClick={() => run(computeAnalytics)}
        >
          {analytics ? "Recompute" : "Compute"}
        </button>
      </div>

      {!analytics ? (
        <p className="text-mist-400 text-sm">
          Compute possession share, passes, and turnovers from the tracking data.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {/* possession bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: TEAM_COLORS[0] }}>Team A {pA}%</span>
              <span className="text-mist-400">Possession</span>
              <span style={{ color: TEAM_COLORS[1] }}>{pB}% Team B</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden flex bg-ink-900/70">
              <div style={{ width: `${pA}%`, background: TEAM_COLORS[0] }} />
              <div style={{ width: `${pB}%`, background: TEAM_COLORS[1] }} />
            </div>
          </div>

          {/* stat tiles */}
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Passes A" value={analytics.passes["0"]} color={TEAM_COLORS[0]} />
            <Stat label="Passes B" value={analytics.passes["1"]} color={TEAM_COLORS[1]} />
            <Stat label="Turnovers" value={analytics.turnovers} />
          </div>

          {/* top pass combinations */}
          {analytics.pass_edges.length > 0 && (
            <div>
              <div className="text-[11px] uppercase text-mist-400 mb-1">
                Top pass combinations
              </div>
              <div className="flex flex-col gap-1">
                {analytics.pass_edges.slice(0, 5).map((e, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-xs text-mist-200"
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: TEAM_COLORS[e.team] }}
                    />
                    #{e.from} → #{e.to}
                    <span className="text-mist-400">×{e.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analytics.turnover_events.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                className="btn-accent"
                disabled={busy}
                onClick={() =>
                  run(async () => {
                    const n = await tagTurnovers();
                    setMsg(`Added ${n} turnover event${n === 1 ? "" : "s"}.`);
                  })
                }
              >
                Tag turnovers on timeline
              </button>
              {msg && <span className="text-xs text-teal-300">{msg}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="card p-2 text-center">
      <div
        className="text-xl font-semibold tabular-nums"
        style={{ color: color ?? "#EAECF2" }}
      >
        {value}
      </div>
      <div className="text-[11px] uppercase tracking-wide text-mist-400">{label}</div>
    </div>
  );
}
