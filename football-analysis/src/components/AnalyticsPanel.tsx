import { useState } from "react";
import { useStore } from "../store";
import { TEAM_COLORS } from "./AnalyzePanel";
import { fmtClock } from "../lib/time";

/** Possession % + passing network + turnovers (Phase 3a). */
export default function AnalyticsPanel() {
  const tracks = useStore((s) => s.tracks);
  const analytics = useStore((s) => s.analytics);
  const computeAnalytics = useStore((s) => s.computeAnalytics);
  const tagTurnovers = useStore((s) => s.tagTurnovers);
  const focusMoment = useStore((s) => s.focusMoment);

  // Jump to the first pass of a given combination (evidence from a pass edge).
  const focusEdge = (team: number, from: number, to: number) => {
    const p = (analytics?.pass_events ?? []).find(
      (e) => e.team === team && e.from === from && e.to === to,
    );
    if (p) focusMoment(p.t_ms);
  };

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
                  <button
                    key={i}
                    onClick={() => focusEdge(e.team, e.from, e.to)}
                    title="Seek to the first pass of this combination"
                    className="flex items-center gap-2 text-xs text-mist-200 px-1.5 py-0.5 rounded-md hover:bg-ink-700 transition-colors text-left"
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: TEAM_COLORS[e.team] }}
                    />
                    #{e.from} → #{e.to}
                    <span className="text-mist-400">×{e.count}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* turnover moments — click to seek (metric -> moment -> video) */}
          {analytics.turnover_events.length > 0 && (
            <div>
              <div className="text-[11px] uppercase text-mist-400 mb-1">
                Turnover moments
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {analytics.turnover_events.slice(0, 12).map((t, i) => (
                  <button
                    key={i}
                    onClick={() => focusMoment(t.t_ms)}
                    title={`Team ${t.from_team === 0 ? "A" : "B"} lost the ball`}
                    className="px-1.5 py-0.5 rounded-md text-[10px] tabular-nums text-teal-200 border border-teal-300/30 hover:bg-teal-300/10 transition-colors"
                  >
                    {fmtClock(t.t_ms)}
                  </button>
                ))}
              </div>
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
