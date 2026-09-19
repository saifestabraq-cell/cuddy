import { useStore } from "../store";
import { fmtClock } from "../lib/time";

export default function PlayerInspector() {
  const selectedTrackId = useStore((s) => s.selectedTrackId);
  const player = useStore((s) => s.playerProfile);
  const events = useStore((s) => s.events);
  const selectEvent = useStore((s) => s.selectEvent);
  const requestSeek = useStore((s) => s.requestSeek);

  if (selectedTrackId == null) return null;

  if (!player) {
    return (
      <div className="panel px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-mist-500">Player</div>
            <div className="text-sm text-mist-200 mt-0.5">#{selectedTrackId}</div>
          </div>
          <button className="btn" onClick={() => useStore.getState().selectPlayer(null)}>Clear</button>
        </div>
        <div className="text-xs text-mist-500 mt-2">Loading player profile…</div>
      </div>
    );
  }

  const teamLabel =
    player.team === 0 ? "Team 1" : player.team === 1 ? "Team 2" : String(player.team);

  const linkedEvents = events
    .filter((event) => (event.player_track_ids ?? []).includes(selectedTrackId))
    .sort((a, b) => a.start_ms - b.start_ms);

  return (
    <div className="panel px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-mist-500">Selected player</div>
          <div className="text-base font-semibold text-mist-100 mt-0.5">#{selectedTrackId}</div>
        </div>
        <button className="btn" onClick={() => useStore.getState().selectPlayer(null)}>Clear</button>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-3">
        <Stat label="Team" value={teamLabel} />
        <Stat label="Confidence" value={Math.round(player.avg_confidence * 100) + "%"} />
        <Stat label="Visible" value={Math.round(player.visibility_fraction * 100) + "%"} />
        <Stat label="Samples" value={player.samples} />
      </div>

      <div className="grid grid-cols-4 gap-2 mt-2">
        <Stat label="Distance" value={player.distance_m != null ? player.distance_m.toFixed(1) + "m" : "Calibrate"} />
        <Stat label="Passes made" value={player.passes_made} />
        <Stat label="Received" value={player.passes_received} />
        <Stat label="Events" value={linkedEvents.length} />
      </div>

      <div className="mt-3 text-[11px] text-mist-500">
        Tracking span: {Math.max(0, player.duration_ms / 1000).toFixed(1)}s
        {player.avg_speed_mps != null && (
          <>
            <span className="mx-1.5">·</span>
            Avg movement: {player.avg_speed_mps.toFixed(2)} m/s
          </>
        )}
        <span className="mx-1.5">·</span>
        Current image position: {Math.round(player.latest.x + player.latest.w / 2)},
        {Math.round(player.latest.y + player.latest.h)}
      </div>

      {linkedEvents.length > 0 && (
        <div className="mt-3">
          <div className="text-[10px] uppercase tracking-wider text-mist-500 mb-1.5">
            Linked events
          </div>
          <div className="flex flex-col gap-1 max-h-28 overflow-y-auto">
            {linkedEvents.slice(0, 8).map((event) => (
              <button
                key={event.id}
                className="flex items-center gap-2 text-left px-2 py-1 rounded-md hover:bg-ink-700 transition-colors"
                onClick={() => {
                  selectEvent(event.id);
                  requestSeek(event.start_ms);
                }}
              >
                <span className="text-[10px] tabular-nums text-teal-300">
                  {fmtClock(event.start_ms)}
                </span>
                <span className="text-xs text-mist-200 truncate">{event.label || "Event"}</span>
                {event.source === "ai" && (
                  <span className="text-[9px] uppercase text-violet-300 ml-auto">AI</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md bg-ink-800/70 px-2.5 py-2">
      <div className="text-[10px] text-mist-500 uppercase">{label}</div>
      <div className="text-xs text-mist-200 mt-0.5 tabular-nums">{value}</div>
    </div>
  );
}
