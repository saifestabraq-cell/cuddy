import { useCallback, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useStore, useFilteredEvents } from "../store";
import type { Category } from "../lib/types";
import { fmtClock } from "../lib/time";

interface Props {
  durationMs: number;
  playheadMs: number;
  onSeek: (ms: number) => void;
}

type Drag = { id: number; edge: "start" | "end"; start: number; end: number } | null;

/**
 * Horizontal timeline of coded events. Click a block to select + seek; drag its
 * edges to adjust the event boundaries. AI events are dashed/tinted for review.
 */
export default function Timeline({ durationMs, playheadMs, onSeek }: Props) {
  const events = useFilteredEvents();
  const categories = useStore((s) => s.categories);
  const selectedId = useStore((s) => s.selectedEventId);
  const selectedTrackId = useStore((s) => s.selectedTrackId);
  const selectEvent = useStore((s) => s.selectEvent);
  const updateEvent = useStore((s) => s.updateEvent);
  // Rebuild the category lookup only when categories change, not every render.
  const catById = useMemo(
    () => new Map<number, Category>(categories.map((c) => [c.id, c])),
    [categories],
  );

  const trackRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<Drag>(null);

  const dur = durationMs || 1;
  const pct = useCallback(
    (ms: number) => `${Math.min(100, Math.max(0, (ms / dur) * 100))}%`,
    [dur],
  );

  const msFromClientX = useCallback(
    (clientX: number) => {
      const rect = trackRef.current!.getBoundingClientRect();
      const ratio = (clientX - rect.left) / rect.width;
      return Math.max(0, Math.min(dur, ratio * dur));
    },
    [dur],
  );

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (drag) return;
    onSeek(msFromClientX(e.clientX));
  };

  const beginDrag = useCallback((
    e: React.MouseEvent,
    id: number,
    edge: "start" | "end",
    start: number,
    end: number,
  ) => {
    e.stopPropagation();
    const state: Drag = { id, edge, start, end };
    setDrag(state);

    const onMove = (me: MouseEvent) => {
      const ms = Math.round(msFromClientX(me.clientX));
      if (edge === "start") state!.start = Math.min(ms, state!.end - 100);
      else state!.end = Math.max(ms, state!.start + 100);
      setDrag({ ...state! });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      updateEvent(id, { start_ms: state!.start, end_ms: state!.end });
      setDrag(null);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [msFromClientX, updateEvent]);

  // Event blocks depend on everything EXCEPT the playhead, so memoising them
  // keeps playback (which ticks playheadMs every frame) from re-rendering the
  // whole event list each frame — only the playhead line moves.
  const blocks = useMemo(
    () =>
      events.map((ev) => {
        const cat = ev.category_id ? catById.get(ev.category_id) : undefined;
        const color = cat?.color ?? "#8A90A0";
        const isAi = ev.source === "ai";
        const selected = ev.id === selectedId;
        const playerLinked =
          selectedTrackId != null &&
          (ev.player_track_ids ?? []).includes(selectedTrackId);
        const start = drag?.id === ev.id ? drag.start : ev.start_ms;
        const end = drag?.id === ev.id ? drag.end : ev.end_ms;
        return (
          <div
            key={ev.id}
            onClick={(e) => {
              e.stopPropagation();
              selectEvent(ev.id);
              onSeek(start);
            }}
            title={`${cat?.name ?? ev.label} — ${fmtClock(start)}`}
            className="absolute top-2 bottom-2 rounded-md group"
            style={{
              left: pct(start),
              width: `${Math.max(0.6, ((end - start) / dur) * 100)}%`,
              background: isAi ? `${color}44` : `${color}CC`,
              border: `${selected ? 2 : playerLinked ? 2 : 1}px ${isAi ? "dashed" : "solid"} ${
                selected ? "#EAECF2" : playerLinked ? "#6EE7D6" : color
              }`,
              boxShadow: playerLinked ? "0 0 0 1px rgba(110,231,214,0.18)" : undefined,
            }}
          >
            <span
              onMouseDown={(e) => beginDrag(e, ev.id, "start", ev.start_ms, ev.end_ms)}
              className="absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize opacity-0 group-hover:opacity-100 bg-white/70 rounded-l"
            />
            <span
              onMouseDown={(e) => beginDrag(e, ev.id, "end", ev.start_ms, ev.end_ms)}
              className="absolute right-0 top-0 bottom-0 w-1.5 cursor-ew-resize opacity-0 group-hover:opacity-100 bg-white/70 rounded-r"
            />
          </div>
        );
      }),
    [events, catById, selectedId, selectedTrackId, drag, dur, pct, onSeek, selectEvent, beginDrag],
  );

  return (
    <div className="panel p-3">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          Timeline
        </span>
        <span className="text-xs text-mist-400 tabular-nums">
          {fmtClock(playheadMs)} / {fmtClock(durationMs)}
        </span>
      </div>

      <div
        ref={trackRef}
        className="relative h-16 rounded-xl bg-ink-900/70 border border-ink-500/50 cursor-pointer overflow-hidden select-none"
        onClick={handleTrackClick}
      >
        {blocks}

        <motion.div
          className="absolute top-0 bottom-0 w-0.5 bg-teal-300 shadow-glow pointer-events-none"
          style={{ left: pct(playheadMs) }}
          animate={{ left: pct(playheadMs) }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>

      {events.length === 0 && (
        <p className="text-mist-400 text-xs mt-2 px-1">
          No events match — code the match below, or adjust the filter.
        </p>
      )}
    </div>
  );
}
