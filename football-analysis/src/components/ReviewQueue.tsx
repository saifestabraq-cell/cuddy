import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "../store";
import type { Category, MatchEvent } from "../lib/types";
import { fmtClock } from "../lib/time";
import { BAND_CLASS, BAND_LABEL, confidenceBand, confidencePct } from "../lib/confidence";
import SectionHeader from "./SectionHeader";

type QueueFilter = "all" | "high" | "medium" | "low";

/**
 * AI Review Queue: process machine-generated suggestions fast.
 *
 * Shows the UNREVIEWED AI events (source="ai", reviewed=false). Accept keeps the
 * event on the timeline and marks it reviewed; reject removes it. Both auto-
 * advance to the next item. Keyboard (only while the queue is focused, never
 * while typing in a field):
 *   Enter = accept · Delete/Backspace = reject · ↑/↓ = prev/next · Space = seek
 */
export default function ReviewQueue() {
  const events = useStore((s) => s.events);
  const categories = useStore((s) => s.categories);
  const acceptEvent = useStore((s) => s.acceptEvent);
  const rejectEvent = useStore((s) => s.rejectEvent);
  const selectEvent = useStore((s) => s.selectEvent);
  const requestSeek = useStore((s) => s.requestSeek);
  const selectedEventId = useStore((s) => s.selectedEventId);

  const [filter, setFilter] = useState<QueueFilter>("all");
  const containerRef = useRef<HTMLDivElement>(null);

  const catName = useMemo(() => {
    const m = new Map<number, string>();
    categories.forEach((c: Category) => c.id && m.set(c.id, c.name));
    return m;
  }, [categories]);

  const codeOf = useCallback(
    (e: MatchEvent) =>
      (e.category_id ? catName.get(e.category_id) : null) || e.label || "Event",
    [catName],
  );

  // Unreviewed AI suggestions, sorted by time, optionally by confidence band.
  const queue = useMemo(() => {
    return events
      .filter((e) => e.source === "ai" && !e.reviewed)
      .filter((e) => filter === "all" || confidenceBand(e.confidence) === filter)
      .sort((a, b) => a.start_ms - b.start_ms);
  }, [events, filter]);

  // Track which queue item is the cursor. Default to the selected event if it's
  // in the queue, else the first item.
  const [cursor, setCursor] = useState(0);
  useEffect(() => {
    const idx = queue.findIndex((e) => e.id === selectedEventId);
    if (idx >= 0) setCursor(idx);
    else if (cursor >= queue.length) setCursor(Math.max(0, queue.length - 1));
  }, [queue, selectedEventId]); // eslint-disable-line react-hooks/exhaustive-deps

  const current = queue[cursor];

  const focusItem = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(idx, queue.length - 1));
      setCursor(clamped);
      const ev = queue[clamped];
      if (ev) selectEvent(ev.id);
    },
    [queue, selectEvent],
  );

  const doAccept = useCallback(async () => {
    if (!current) return;
    await acceptEvent(current.id); // leaves the queue -> next item shifts into `cursor`
    setCursor(Math.min(cursor, Math.max(0, queue.length - 2)));
  }, [current, cursor, acceptEvent, queue.length]);

  const doReject = useCallback(async () => {
    if (!current) return;
    await rejectEvent(current.id);
    setCursor(Math.min(cursor, Math.max(0, queue.length - 2)));
  }, [current, cursor, rejectEvent, queue.length]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    // Never hijack typing.
    const t = e.target as HTMLElement;
    if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;
    if (e.key === "Enter") {
      e.preventDefault();
      void doAccept();
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      void doReject();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      focusItem(cursor + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusItem(cursor - 1);
    } else if (e.key === " ") {
      e.preventDefault();
      if (current) requestSeek(current.start_ms);
    }
  };

  return (
    <div className="panel p-3">
      <SectionHeader
        label="Review queue"
        className="mb-2"
        right={
          <span className="text-[11px] text-mist-400 tabular-nums">
            {queue.length} to review
          </span>
        }
      />

      {events.some((e) => e.source === "ai") ? (
        <>
          <div className="flex items-center gap-1 mb-2 rounded-lg bg-ink-900/60 p-0.5 w-fit">
            {(["all", "high", "medium", "low"] as QueueFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-md text-xs capitalize transition-colors ${
                  filter === f ? "bg-ink-600 text-mist-100" : "text-mist-400 hover:text-mist-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {queue.length === 0 ? (
            <p className="text-xs text-mist-400 py-2">
              Nothing left to review in this filter. ✓
            </p>
          ) : (
            <div
              ref={containerRef}
              tabIndex={0}
              onKeyDown={onKeyDown}
              className="flex flex-col gap-1 outline-none focus:ring-1 focus:ring-violet-500/40 rounded-lg"
            >
              {queue.map((e, i) => {
                const band = confidenceBand(e.confidence);
                const active = i === cursor;
                return (
                  <div
                    key={e.id}
                    onClick={() => {
                      focusItem(i);
                      requestSeek(e.start_ms);
                    }}
                    className={`card px-2.5 py-1.5 cursor-pointer transition-colors ${
                      active ? "ring-1 ring-violet-500/50 bg-ink-600" : "hover:bg-ink-600"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm text-mist-100 min-w-0">
                        <span className="tabular-nums text-teal-300 text-xs shrink-0">
                          {fmtClock(e.start_ms)}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                        <span className="truncate">{codeOf(e)}</span>
                      </div>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] shrink-0 ${BAND_CLASS[band]}`}
                        title={BAND_LABEL[band]}
                      >
                        {confidencePct(e.confidence)}
                      </span>
                    </div>
                    {e.detector && (
                      <div className="text-[11px] text-mist-400 mt-0.5">
                        {e.detector} · {BAND_LABEL[band]}
                      </div>
                    )}
                    {active && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <button
                          onClick={(ev) => {
                            ev.stopPropagation();
                            void doAccept();
                          }}
                          className="btn h-7 py-0 text-teal-300"
                        >
                          Accept
                        </button>
                        <button
                          onClick={(ev) => {
                            ev.stopPropagation();
                            void doReject();
                          }}
                          className="btn h-7 py-0 text-rose-300"
                        >
                          Reject
                        </button>
                        <button
                          onClick={(ev) => {
                            ev.stopPropagation();
                            selectEvent(e.id);
                            requestSeek(e.start_ms);
                          }}
                          className="btn h-7 py-0"
                        >
                          Watch
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-[10px] text-mist-500 mt-2 leading-relaxed">
            Focus the list, then: <b>Enter</b> accept · <b>Del</b> reject ·{" "}
            <b>↑↓</b> move · <b>Space</b> seek
          </p>
        </>
      ) : (
        <p className="text-xs text-mist-400 py-2">
          No AI suggestions yet. Run analysis to generate reviewable events.
        </p>
      )}
    </div>
  );
}
