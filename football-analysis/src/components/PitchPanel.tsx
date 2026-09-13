import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "../store";
import HeatmapView from "./HeatmapView";
import { TEAM_COLORS } from "./AnalyzePanel";

/** Manual pitch calibration -> heatmaps, team distances, and auto-tagging. */
export default function PitchPanel() {
  const tracks = useStore((s) => s.tracks);
  const pitch = useStore((s) => s.pitch);
  const calibrationMode = useStore((s) => s.calibrationMode);
  const calibrationPoints = useStore((s) => s.calibrationPoints);
  const setCalibrationMode = useStore((s) => s.setCalibrationMode);
  const clearCalibrationPoints = useStore((s) => s.clearCalibrationPoints);
  const calibratePitch = useStore((s) => s.calibratePitch);
  const runAutotag = useStore((s) => s.runAutotag);

  const [length, setLength] = useState(105);
  const [width, setWidth] = useState(68);
  const [team, setTeam] = useState<"0" | "1">("0");
  const [busy, setBusy] = useState(false);
  const [tagMsg, setTagMsg] = useState<string | null>(null);

  if (!tracks) {
    return (
      <div className="panel p-3">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          Pitch &amp; heatmaps
        </span>
        <p className="text-mist-400 text-sm mt-2">
          Analyse the video first, then calibrate the pitch here.
        </p>
      </div>
    );
  }

  const compute = async () => {
    setBusy(true);
    try {
      await calibratePitch(length, width);
    } finally {
      setBusy(false);
    }
  };

  const doAutotag = async () => {
    setBusy(true);
    try {
      const n = await runAutotag();
      setTagMsg(`Added ${n} AI event${n === 1 ? "" : "s"} to the timeline.`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="panel p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          Pitch &amp; heatmaps
        </span>
        {!calibrationMode && (
          <button
            className="text-mist-300 hover:text-teal-300 transition-colors text-xs"
            onClick={() => setCalibrationMode(true)}
          >
            {pitch ? "Re-calibrate" : "Calibrate pitch"}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {calibrationMode ? (
          <motion.div
            key="calib"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-2"
          >
            <p className="text-xs text-mist-300 leading-relaxed">
              Click the four pitch corners on the video, in order:{" "}
              <span className="text-teal-300">
                top-left → top-right → bottom-right → bottom-left
              </span>
              .
            </p>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`w-6 h-6 grid place-items-center rounded-lg text-xs border ${
                    calibrationPoints.length > i
                      ? "bg-teal-300 text-ink-900 border-teal-300"
                      : "text-mist-400 border-ink-500/60"
                  }`}
                >
                  {i + 1}
                </span>
              ))}
              <span className="text-xs text-mist-400 ml-1">
                {calibrationPoints.length}/4 points
              </span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-mist-300">Length</label>
              <input
                type="number"
                className="input h-7 py-0 w-16"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
              />
              <label className="text-xs text-mist-300">Width</label>
              <input
                type="number"
                className="input h-7 py-0 w-16"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
              />
              <span className="text-xs text-mist-500">m</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="btn-accent"
                disabled={calibrationPoints.length !== 4 || busy}
                onClick={compute}
              >
                {busy ? "Computing…" : "Compute heatmaps"}
              </button>
              <button className="btn" onClick={clearCalibrationPoints}>
                Clear points
              </button>
              <button className="btn" onClick={() => setCalibrationMode(false)}>
                Cancel
              </button>
            </div>
          </motion.div>
        ) : pitch ? (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-mist-400">Heatmap:</span>
              {(["0", "1"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTeam(t)}
                  className="px-2.5 py-1 rounded-lg text-xs border transition-all"
                  style={{
                    color: team === t ? "#0E0F13" : TEAM_COLORS[Number(t)],
                    background: team === t ? TEAM_COLORS[Number(t)] : "transparent",
                    borderColor: `${TEAM_COLORS[Number(t)]}66`,
                  }}
                >
                  Team {t === "0" ? "A" : "B"}
                </button>
              ))}
            </div>

            <HeatmapView pitch={pitch} team={team} />

            <div className="grid grid-cols-2 gap-2">
              <Stat
                label="Team A distance"
                value={`${(pitch.team_distance_m["0"] / 1000).toFixed(2)} km`}
                color={TEAM_COLORS[0]}
              />
              <Stat
                label="Team B distance"
                value={`${(pitch.team_distance_m["1"] / 1000).toFixed(2)} km`}
                color={TEAM_COLORS[1]}
              />
            </div>

            <div className="flex items-center gap-2">
              <button className="btn-accent" onClick={doAutotag} disabled={busy}>
                {busy ? "Working…" : "Auto-tag (ball in final third)"}
              </button>
              {tagMsg && <span className="text-xs text-teal-300">{tagMsg}</span>}
            </div>
          </motion.div>
        ) : (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-mist-400 text-sm"
          >
            Calibrate the pitch to unlock heatmaps, team distances, and
            auto-tagging.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="card p-2">
      <div className="text-lg font-semibold tabular-nums" style={{ color }}>
        {value}
      </div>
      <div className="text-[11px] uppercase tracking-wide text-mist-400">{label}</div>
    </div>
  );
}
