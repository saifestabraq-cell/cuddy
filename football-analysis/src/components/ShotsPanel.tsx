import { useState } from "react";
import { useStore } from "../store";
import ShotMap from "./ShotMap";
import { TEAM_COLORS } from "./AnalyzePanel";
import { fmtClock } from "../lib/time";
import type { Shot } from "../lib/types";

/** Shot detection + simple xG (Phase 3b). Requires pitch calibration. */
export default function ShotsPanel() {
  const tracks = useStore((s) => s.tracks);
  const pitch = useStore((s) => s.pitch);
  const shots = useStore((s) => s.shots);
  const computeShots = useStore((s) => s.computeShots);
  const tagShots = useStore((s) => s.tagShots);
  const focusMoment = useStore((s) => s.focusMoment);

  // Jump to a team's biggest chance (evidence chain from the xG tile).
  const focusTeamTopShot = (team: number) => {
    const best = (shots?.shots ?? [])
      .filter((s) => s.team === team)
      .sort((a, b) => b.xg - a.xg)[0];
    if (best) focusMoment(best.t_ms);
  };

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
              onClick={() => focusTeamTopShot(0)}
            />
            <Stat
              label="Team B xG"
              value={shots.team_xg["1"].toFixed(2)}
              sub={`${shots.team_shots["1"]} shots`}
              color={TEAM_COLORS[1]}
              onClick={() => focusTeamTopShot(1)}
            />
          </div>

          <ShotMap shots={shots} onPick={(s) => focusMoment(s.t_ms)} />
          <p className="text-[11px] text-mist-500">
            Dot size ∝ xG. Click a shot to seek the video. Heuristic estimate —
            not a trained model.
          </p>

          {/* shot list: metric -> event -> timestamp -> video */}
          <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
            {[...shots.shots]
              .sort((a, b) => a.t_ms - b.t_ms)
              .map((s, i) => (
                <ShotRow key={i} shot={s} onClick={() => focusMoment(s.t_ms)} />
              ))}
          </div>

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
  onClick,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      title={onClick ? "Jump to this team's biggest chance" : undefined}
      className={`card p-2.5 text-center ${
        onClick ? "cursor-pointer hover:border-teal-300/40 transition-colors" : ""
      }`}
    >
      <div className="text-2xl font-semibold tabular-nums" style={{ color }}>
        {value}
      </div>
      <div className="text-[11px] uppercase tracking-wide text-mist-400">{label}</div>
      <div className="text-[11px] text-mist-500">{sub}</div>
    </button>
  );
}

/** One shot as a clickable evidence row (time · team · xG · distance). */
function ShotRow({ shot, onClick }: { shot: Shot; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-left px-2 py-1 rounded-md hover:bg-ink-700 transition-colors"
    >
      <span className="text-[10px] tabular-nums text-teal-300 w-10">
        {fmtClock(shot.t_ms)}
      </span>
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ background: TEAM_COLORS[shot.team] ?? "#8A90A0" }}
      />
      <span className="text-xs text-mist-200">xG {shot.xg.toFixed(2)}</span>
      <span className="text-[11px] text-mist-500 ml-auto">
        {shot.distance_m.toFixed(0)}m
      </span>
    </button>
  );
}
