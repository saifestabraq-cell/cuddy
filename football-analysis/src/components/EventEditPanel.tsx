import { motion } from "framer-motion";
import { useStore } from "../store";
import { fmtClock } from "../lib/time";

interface Props {
  playheadMs: number;
  onSeek: (ms: number) => void;
}

/** Inline editor for the selected event: boundaries, label, notes, descriptors. */
export default function EventEditPanel({ playheadMs, onSeek }: Props) {
  const ev = useStore((s) => s.selectedEvent());
  const categories = useStore((s) => s.categories);
  const descriptorGroups = useStore((s) => s.descriptorGroups);
  const updateEvent = useStore((s) => s.updateEvent);
  const removeEvent = useStore((s) => s.removeEvent);
  const toggleEventDescriptor = useStore((s) => s.toggleEventDescriptor);
  const selectEvent = useStore((s) => s.selectEvent);
  const selectedTrackId = useStore((s) => s.selectedTrackId);

  if (!ev) return null;
  const cat = categories.find((c) => c.id === ev.category_id);

  const setSec = (field: "start_ms" | "end_ms", secText: string) => {
    const ms = Math.max(0, Math.round(parseFloat(secText) * 1000));
    if (!isNaN(ms)) updateEvent(ev.id, { [field]: ms } as never);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel p-3"
      style={{ borderColor: cat ? `${cat.color}55` : undefined }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: cat?.color ?? "#8A90A0" }}
          />
          <span className="text-sm font-medium text-mist-100">
            {cat?.name ?? "Event"}
          </span>
          {ev.source === "ai" && (
            <span className="text-[10px] text-violet-300 uppercase">
              AI {Math.round((ev.confidence ?? 0) * 100)}%
            </span>
          )}
        </div>
        <button
          className="text-mist-400 hover:text-mist-100 text-sm"
          onClick={() => selectEvent(null)}
        >
          ✕
        </button>
      </div>

      {/* boundaries */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {(["start_ms", "end_ms"] as const).map((field) => (
          <div key={field} className="card p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] uppercase text-mist-400">
                {field === "start_ms" ? "Start" : "End"}
              </span>
              <button
                className="text-[11px] text-teal-300 hover:text-teal-400"
                onClick={() => updateEvent(ev.id, { [field]: Math.round(playheadMs) } as never)}
                title="Set to current playhead"
              >
                ⇢ playhead
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                step="0.1"
                className="input h-7 py-0 w-full"
                value={(ev[field] / 1000).toFixed(1)}
                onChange={(e) => setSec(field, e.target.value)}
              />
              <button
                className="btn h-7 py-0 px-2"
                onClick={() => onSeek(ev[field])}
                title="Seek here"
              >
                {fmtClock(ev[field])}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* label + notes */}
      <input
        className="input w-full mb-2"
        placeholder="Label"
        value={ev.label}
        onChange={(e) => updateEvent(ev.id, { label: e.target.value })}
      />
      <textarea
        className="input w-full mb-3 resize-none"
        rows={2}
        placeholder="Notes"
        value={ev.notes}
        onChange={(e) => updateEvent(ev.id, { notes: e.target.value })}
      />

      {/* player linkage */}
      <div className="card p-2.5 mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] uppercase text-mist-400">Players</span>
          {selectedTrackId != null && (
            <button
              className="text-[11px] text-teal-300 hover:text-teal-400"
              onClick={() => {
                const ids = ev.player_track_ids ?? [];
                if (!ids.includes(selectedTrackId)) {
                  updateEvent(ev.id, { player_track_ids: [...ids, selectedTrackId] });
                }
              }}
            >
              + add selected #{selectedTrackId}
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(ev.player_track_ids ?? []).map((trackId) => (
            <button
              key={trackId}
              className="px-2 py-0.5 rounded-lg text-xs text-teal-200 border border-teal-300/30 hover:bg-teal-300/10"
              onClick={() =>
                updateEvent(ev.id, {
                  player_track_ids: (ev.player_track_ids ?? []).filter((id) => id !== trackId),
                })
              }
              title="Remove player from event"
            >
              Player #{trackId} ×
            </button>
          ))}
          {(!ev.player_track_ids || ev.player_track_ids.length === 0) && (
            <span className="text-xs text-mist-500">No players linked</span>
          )}
        </div>
      </div>

      {/* descriptors */}
      {descriptorGroups.length > 0 && (
        <div className="flex flex-col gap-2 mb-3">
          {descriptorGroups.map((g) => (
            <div key={g.id}>
              <div className="text-[11px] uppercase text-mist-400 mb-1">{g.name}</div>
              <div className="flex flex-wrap gap-1.5">
                {g.descriptors.map((d) => {
                  const on = ev.descriptors.includes(d.label);
                  return (
                    <button
                      key={d.id}
                      onClick={() => toggleEventDescriptor(ev.id, d.label)}
                      className={`px-2 py-0.5 rounded-lg text-xs border transition-colors ${
                        on
                          ? "bg-teal-300 text-ink-900 border-teal-300"
                          : "text-mist-200 border-ink-500/60 hover:bg-ink-700"
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
                {g.descriptors.length === 0 && (
                  <span className="text-xs text-mist-500">no buttons</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {ev.source === "ai" && !ev.reviewed && (
        <div className="card p-2.5 mb-3 flex items-center gap-2 border-violet-400/30">
          <span className="text-xs text-violet-300 flex-1">
            AI suggestion — confirm or reject
          </span>
          <button
            className="btn-accent"
            onClick={() => updateEvent(ev.id, { reviewed: true })}
          >
            Confirm (Y)
          </button>
          <button className="btn" onClick={() => removeEvent(ev.id)}>
            Reject (N)
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-mist-300">
          <input
            type="checkbox"
            checked={ev.reviewed}
            onChange={(e) => updateEvent(ev.id, { reviewed: e.target.checked })}
          />
          Reviewed
        </label>
        <button
          className="btn text-signal-live hover:text-signal-live"
          onClick={() => removeEvent(ev.id)}
        >
          Delete event
        </button>
      </div>
    </motion.div>
  );
}
