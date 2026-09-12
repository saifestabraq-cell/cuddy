import { motion } from "framer-motion";
import { useStore } from "../store";

export const TEAM_COLORS = ["#6EE7D6", "#F0A6C0"]; // team 0, team 1
export const BALL_COLOR = "#F2C879";

/** Runs CV analysis on the current video and controls the detection overlay. */
export default function AnalyzePanel() {
  const currentVideo = useStore((s) => s.currentVideo());
  const job = useStore((s) => s.analysisJob);
  const tracks = useStore((s) => s.tracks);
  const overlay = useStore((s) => s.overlay);
  const analyzeVideo = useStore((s) => s.analyzeVideo);
  const setOverlay = useStore((s) => s.setOverlay);

  const running = job?.status === "running" || job?.status === "pending";
  const pct = Math.round((job?.progress ?? 0) * 100);

  return (
    <div className="panel p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          AI analysis
        </span>
        {tracks && (
          <label className="flex items-center gap-1.5 text-xs text-mist-300">
            <input
              type="checkbox"
              checked={overlay}
              onChange={(e) => setOverlay(e.target.checked)}
            />
            Overlay
          </label>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          className="btn-accent"
          disabled={!currentVideo || running}
          onClick={() => analyzeVideo(5)}
        >
          {running ? "Analysing…" : tracks ? "Re-analyse" : "Analyse video"}
        </button>
        {tracks && (
          <span className="text-xs text-mist-300">
            {tracks.n_tracks} tracks · {tracks.teams} teams · {tracks.frames.length}{" "}
            frames
          </span>
        )}
      </div>

      {running && (
        <div className="mt-3">
          <div className="h-2 rounded-full bg-ink-900/70 overflow-hidden">
            <motion.div
              className="h-full bg-teal-300"
              animate={{ width: `${pct}%` }}
              transition={{ ease: "linear", duration: 0.3 }}
            />
          </div>
          <div className="text-xs text-mist-400 mt-1 flex justify-between">
            <span>{job?.message}</span>
            <span className="tabular-nums">{pct}%</span>
          </div>
        </div>
      )}

      {job?.status === "error" && (
        <p className="text-xs text-signal-live mt-2">{job.error}</p>
      )}

      {tracks && (
        <div className="flex items-center gap-3 mt-3 text-xs text-mist-300">
          <Legend color={TEAM_COLORS[0]} label="Team A" />
          <Legend color={TEAM_COLORS[1]} label="Team B" />
          <Legend color={BALL_COLOR} label="Ball" />
        </div>
      )}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded" style={{ background: color }} />
      {label}
    </span>
  );
}
