import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useStore, useFilteredEvents } from "../store";
import type { Category, MatchEvent } from "../lib/types";
import { fmtClock } from "../lib/time";
import { confidencePct } from "../lib/confidence";
import SectionHeader from "./SectionHeader";

interface Props {
  durationMs: number;
  playheadMs: number;
  onSeek: (ms: number) => void;
}

type Drag = { id: number; edge: "start" | "end"; start: number; end: number } | null;

// Zoom presets: visible span in ms (0 = fit whole match).
const ZOOMS: { label: string; span: number }[] = [
  { label: "Fit", span: 0 },
  { label: "10m", span: 10 * 60_000 },
  { label: "5m", span: 5 * 60_000 },
  { label: "1m", span: 60_000 },
];

/**
 * The timeline spine. Two lanes separate manual coding from AI suggestions;
 * click empty space to seek + seed the composer, click a block to select+seek,
 * drag block edges to adjust boundaries, drag the playhead to scrub. Zoom scales
 * the track inside a horizontal scroller and the playhead auto-follows playback.
 */
export default function Timeline({ durationMs, playheadMs, onSeek }: Props) {
  const events = useFilteredEvents();
  const categories = useStore((s) => s.categories);
  const selectedId = useStore((s) => s.selectedEventId);
  const selectEvent = useStore((s) => s.selectEvent);
  const updateEvent = useStore((s) => s.updateEvent);
  const setComposeSeed = useStore((s) => s.setComposeSeed);
  const catById = new Map<number, Category>(categories.map((c) => [c.id, c]));

  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<Drag>(null);
  const [zoom, setZoom] = useState(0); // index into ZOOMS

  const dur = durationMs || 1;
  const span = ZOOMS[zoom].span || dur;
  const widthPct = Math.max(100, (dur / span) * 100); // track width vs viewport
  const pct = (ms: number) => `${Math.min(100, Math.max(0, (ms / dur) * 100))}%`;

  const manual = events.filter((e) => e.source !== "ai");
  const ai = events.filter((e) => e.source === "ai");

  const msFromClientX = (clientX: number) => {
    const rect = trackRef.current!.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(dur, ratio * dur));
  };

  // Keep the playhead in view when zoomed and playing.
  useLayoutEffect(() => {
    if (zoom === 0 || !scrollRef.current || !trackRef.current) return;
    const scroller = scrollRef.current;
    const x = (playheadMs / dur) * trackRef.current.scrollWidth;
    const margin = scroller.clientWidth * 0.15;
    if (x < scroller.scrollLeft + margin) scroller.scrollLeft = x - margin;
    else if (x > scroller.scrollLeft + scroller.clientWidth - margin)
      scroller.scrollLeft = x - scroller.clientWidth + margin;
  }, [playheadMs, zoom, dur]);

  // When switching to a zoomed level, center on the playhead once.
  useEffect(() => {
    if (zoom === 0 || !scrollRef.current || !trackRef.current) return;
    const scroller = scrollRef.current;
    const x = (playheadMs / dur) * trackRef.current.scrollWidth;
    scroller.scrollLeft = Math.max(0, x - scroller.clientWidth / 2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom]);

  const seekAndSeed = (clientX: number) => {
    const ms = msFromClientX(clientX);
    onSeek(ms);
    setComposeSeed({ ms: Math.round(ms) });
  };

  const beginBoundaryDrag = (
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
  };

  const beginPlayheadDrag = (e: React.MouseEvent) => {
    e.stopPropagation();
    const onMove = (me: MouseEvent) => onSeek(Math.round(msFromClientX(me.clientX)));
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const renderBlock = (ev: MatchEvent) => {
    const cat = ev.category_id ? catById.get(ev.category_id) : undefined;
    const color = cat?.color ?? "#8A90A0";
    const isAi = ev.source === "ai";
    const selected = ev.id === selectedId;
    const start = drag?.id === ev.id ? drag.start : ev.start_ms;
    const end = drag?.id === ev.id ? drag.end : ev.end_ms;
    const title = isAi
      ? `${cat?.name ?? ev.label} — ${fmtClock(start)} · AI ${confidencePct(ev.confidence)}`
      : `${cat?.name ?? ev.label} — ${fmtClock(start)}`;
    return (
      <div
        key={ev.id}
        onClick={(e) => {
          e.stopPropagation();
          selectEvent(ev.id);
          onSeek(start);
          setComposeSeed({
            ms: Math.round(start),
            label: ev.label ?? undefined,
            categoryId: ev.category_id ?? undefined,
          });
        }}
        title={title}
        className="absolute top-1 bottom-1 rounded-md group"
        style={{
          left: pct(start),
          width: `${Math.max(0.4, ((end - start) / dur) * 100)}%`,
          background: isAi ? `${color}44` : `${color}CC`,
          border: `${selected ? 2 : 1}px ${isAi ? "dashed" : "solid"} ${
            selected ? "#EAECF2" : isAi ? "#A78BFA" : color
          }`,
        }}
      >
        <span
          onMouseDown={(e) => beginBoundaryDrag(e, ev.id, "start", ev.start_ms, ev.end_ms)}
          className="absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize opacity-0 group-hover:opacity-100 bg-white/70 rounded-l"
        />
        <span
          onMouseDown={(e) => beginBoundaryDrag(e, ev.id, "end", ev.start_ms, ev.end_ms)}
          className="absolute right-0 top-0 bottom-0 w-1.5 cursor-ew-resize opacity-0 group-hover:opacity-100 bg-white/70 rounded-r"
        />
      </div>
    );
  };

  return (
    <div className="panel p-3">
      <SectionHeader
        label="Timeline"
        className="mb-2 px-1"
        right={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 rounded-lg bg-ink-900/60 p-0.5">
              {ZOOMS.map((z, i) => (
                <button
                  key={z.label}
                  onClick={() => setZoom(i)}
                  className={`px-2 py-0.5 rounded-md text-[11px] transition-colors ${
                    zoom === i ? "bg-ink-600 text-mist-100" : "text-mist-400 hover:text-mist-200"
                  }`}
                  disabled={z.span > 0 && z.span >= dur}
                >
                  {z.label}
                </button>
              ))}
            </div>
            <span className="text-xs text-mist-400 tabular-nums">
              {fmtClock(playheadMs)} / {fmtClock(durationMs)}
            </span>
          </div>
        }
      />

      <div ref={scrollRef} className="overflow-x-auto overflow-y-hidden">
        <div
          ref={trackRef}
          className="relative select-none"
          style={{ width: `${widthPct}%` }}
        >
          {/* lane labels */}
          <div className="flex flex-col gap-1">
            <Lane label="Manual" accent="#8A90A0">
              <div
                className="relative h-8 w-full cursor-pointer"
                onClick={(e) => !drag && seekAndSeed(e.clientX)}
              >
                {manual.map(renderBlock)}
              </div>
            </Lane>
            <Lane label="AI" accent="#A78BFA">
              <div
                className="relative h-8 w-full cursor-pointer"
                onClick={(e) => !drag && seekAndSeed(e.clientX)}
              >
                {ai.map(renderBlock)}
              </div>
            </Lane>
          </div>

          {/* playhead spans both lanes; drag to scrub */}
          <div
            onMouseDown={beginPlayheadDrag}
            className="absolute top-0 bottom-0 w-1 -ml-0.5 bg-teal-300 shadow-glow cursor-ew-resize transition-[left] duration-100 ease-linear"
            style={{ left: pct(playheadMs) }}
          />
        </div>
      </div>

      <p className="text-[10px] text-mist-500 px-1 mt-2">
        Click a lane to seek &amp; seed an event · drag block edges to trim · drag the playhead to scrub
      </p>

      {events.length === 0 && (
        <p className="text-mist-400 text-xs mt-1 px-1">
          No events match — code the match below, or adjust the filter.
        </p>
      )}
    </div>
  );
}

function Lane({
  label,
  accent,
  children,
}: {
  label: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-lg bg-ink-900/70 border border-ink-500/50">
      <span
        className="absolute left-1 top-1 z-10 text-[9px] uppercase tracking-wide px-1 rounded pointer-events-none"
        style={{ color: accent, background: "#0000004D" }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}
