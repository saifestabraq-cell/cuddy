import { useMemo } from "react";
import { useStore } from "../store";

export default function PlayerInspector() {
  const selectedTrackId = useStore((s) => s.selectedTrackId);
  const tracks = useStore((s) => s.tracks);

  const player = useMemo(() => {
    if (selectedTrackId == null || !tracks) return null;

    const samples = tracks.frames.flatMap((frame) =>
      frame.dets
        .filter((d) => d.id === selectedTrackId && d.cls !== 32)
        .map((d) => ({ ...d, t_ms: frame.t_ms })),
    );

    if (!samples.length) return null;

    const latest = samples[samples.length - 1];
    const team = latest.team ?? "unknown";
    const avgConf =
      samples.reduce((sum, d) => sum + d.conf, 0) / samples.length;

    return {
      latest,
      team,
      avgConf,
      samples: samples.length,
      durationMs: samples[samples.length - 1].t_ms - samples[0].t_ms,
    };
  }, [selectedTrackId, tracks]);

  if (selectedTrackId == null) return null;

  if (!player) {
    return (
      <div className="panel px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-mist-500">
              Player
            </div>
            <div className="text-sm text-mist-200 mt-0.5">
              #{selectedTrackId}
            </div>
          </div>
          <button className="btn" onClick={() => useStore.getState().selectPlayer(null)}>
            Clear
          </button>
        </div>
        <div className="text-xs text-mist-500 mt-2">
          Player is not visible in the available tracking samples.
        </div>
      </div>
    );
  }

  const teamLabel =
    player.team === 0 ? "Team 1" : player.team === 1 ? "Team 2" : String(player.team);

  return (
    <div className="panel px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-mist-500">
            Selected player
          </div>
          <div className="text-base font-semibold text-mist-100 mt-0.5">
            #{selectedTrackId}
          </div>
        </div>
        <button
          className="btn"
          onClick={() => useStore.getState().selectPlayer(null)}
        >
          Clear
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3">
        <div className="rounded-md bg-ink-800/70 px-2.5 py-2">
          <div className="text-[10px] text-mist-500 uppercase">Team</div>
          <div className="text-xs text-mist-200 mt-0.5">{teamLabel}</div>
        </div>
        <div className="rounded-md bg-ink-800/70 px-2.5 py-2">
          <div className="text-[10px] text-mist-500 uppercase">Confidence</div>
          <div className="text-xs text-mist-200 mt-0.5">
            {Math.round(player.avgConf * 100)}%
          </div>
        </div>
        <div className="rounded-md bg-ink-800/70 px-2.5 py-2">
          <div className="text-[10px] text-mist-500 uppercase">Samples</div>
          <div className="text-xs text-mist-200 mt-0.5">{player.samples}</div>
        </div>
      </div>

      <div className="mt-3 text-[11px] text-mist-500">
        Tracking span: {Math.max(0, player.durationMs / 1000).toFixed(1)}s
        <span className="mx-1.5">·</span>
        Current image position: {Math.round(player.latest.x + player.latest.w / 2)},
        {Math.round(player.latest.y + player.latest.h)}
      </div>
    </div>
  );
}
