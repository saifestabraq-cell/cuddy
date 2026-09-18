import { useState } from "react";
import { useStore } from "../store";
import ShotMap from "./ShotMap";
import { TEAM_COLORS } from "./AnalyzePanel";

/** Shot detection + simple xG (Phase 3b). Requires pitch calibration. */
export default function ShotsPanel() {
  const tracks = useStore((s) => s.tracks);
  const pitch = useStore((s) => s.pitch);
  const shots = useStore((s) => s.shots);
  const computeShots = useStore((s) => s.computeShots);
  const tagShots = useStore((s) => s.tagShots);
  const requestSeek = useStore((s) => s.requestSeek);

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  if (!tracks) return null;

  if (!pitch) {
    return (
      <div className="panel p-3">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          Shots &amp; xG
        </span>
        <p className="text-mist-400 text-sm mt-2">
          Calibrate the pitch (above) to detect shots and estimate xG.
        </p>
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

  return (
    <div className="panel p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          Shots &amp; xG
        </span>
        <button
          className="text-mist-300 hover:text-teal-300 transition-colors text-xs"
          disabled={busy}
          onClick={() => run(computeShots)}
        >
          {shots ? "Recompute" : "Detect shots"}
        </button>
      </div>

      {!shots ? (
        <p className="text-mist-400 text-sm">
          Detect shots (fast ball toward goal) and estimate xG from distance and
          angle.
        </p>
      ) : shots.shots.length === 0 ? (
        <p className="text-mist-400 text-sm">
          No shots detected — this depends on ball-tracking quality.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <Stat
              label="Team A xG"
              value={shots.team_xg["0"].toFixed(2)}
              sub={`${shots.team_shots["0"]} shots`}
              color={TEAM_COLORS[0]}
            />
            <Stat
              label="Team B xG"
              value={shots.team_xg["1"].toFixed(2)}
              sub={`${shots.team_shots["1"]} shots`}
              color={TEAM_COLORS[1]}
            />
          </div>

          <ShotMap shots={shots} onSeek={requestSeek} />
          <p className="text-[11px] text-mist-500">
            Dot size ∝ xG. Heuristic estimate — not a trained model.
          </p>

          <div className="flex items-center gap-2">
            <button
              className="btn-accent"
              disabled={busy}
              onClick={() =>
                run(async () => {
                  const n = await tagShots();
                  setMsg(`Added ${n} shot event${n === 1 ? "" : "s"}.`);
                })
              }
            >
              Tag shots on timeline
            </button>
            {msg && <span className="text-xs text-teal-300">{msg}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="card p-2.5 text-center">
      <div className="text-2xl font-semibold tabular-nums" style={{ color }}>
        {value}
      </div>
      <div className="text-[11px] uppercase tracking-wide text-mist-400">{label}</div>
      <div className="text-[11px] text-mist-500">{sub}</div>
    </div>
  );
}
