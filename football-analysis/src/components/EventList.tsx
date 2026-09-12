import { AnimatePresence, motion } from "framer-motion";
import { useStore, useFilteredEvents } from "../store";
import type { Category } from "../lib/types";
import { fmtClock } from "../lib/time";

interface Props {
  onSeek: (ms: number) => void;
}

/** Coded-events list — click to select+seek, checkbox to add to the playlist. */
export default function EventList({ onSeek }: Props) {
  const events = useFilteredEvents();
  const categories = useStore((s) => s.categories);
  const selectedId = useStore((s) => s.selectedEventId);
  const selectEvent = useStore((s) => s.selectEvent);
  const playlist = useStore((s) => s.playlist);
  const togglePlaylist = useStore((s) => s.togglePlaylist);
  const catById = new Map<number, Category>(categories.map((c) => [c.id, c]));

  return (
    <div className="panel p-3 flex-1 min-h-0 flex flex-col">
      <span className="text-xs uppercase tracking-wider text-mist-400 px-1 mb-2">
        Coded events ({events.length})
      </span>
      <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-1">
        <AnimatePresence initial={false}>
          {events.map((ev) => {
            const cat = ev.category_id ? catById.get(ev.category_id) : undefined;
            const color = cat?.color ?? "#8A90A0";
            const selected = ev.id === selectedId;
            const inPlaylist = playlist.includes(ev.id);
            return (
              <motion.div
                key={ev.id}
                layout
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className={`group card px-2.5 py-2 flex items-center gap-2.5 cursor-pointer transition-colors ${
                  selected ? "bg-ink-600 ring-1 ring-white/20" : "hover:bg-ink-600"
                }`}
                onClick={() => {
                  selectEvent(ev.id);
                  onSeek(ev.start_ms);
                }}
              >
                <input
                  type="checkbox"
                  checked={inPlaylist}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => togglePlaylist(ev.id)}
                  title="Add to playlist"
                />
                <span
                  className="w-1.5 h-8 rounded-full shrink-0"
                  style={{ background: color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-mist-100 truncate flex items-center gap-1.5">
                    {cat?.name ?? ev.label ?? "Event"}
                    {ev.source === "ai" && (
                      <span className="text-[10px] text-violet-300 uppercase">
                        AI {Math.round((ev.confidence ?? 0) * 100)}%
                      </span>
                    )}
                    {ev.reviewed && (
                      <span className="text-[10px] text-teal-400" title="Reviewed">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-mist-400 tabular-nums flex items-center gap-1.5">
                    {fmtClock(ev.start_ms)} – {fmtClock(ev.end_ms)}
                    {ev.descriptors.length > 0 && (
                      <span className="text-violet-300 truncate">
                        · {ev.descriptors.join(", ")}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {events.length === 0 && (
          <p className="text-mist-400 text-xs px-1">No events match the filter.</p>
        )}
      </div>
    </div>
  );
}
