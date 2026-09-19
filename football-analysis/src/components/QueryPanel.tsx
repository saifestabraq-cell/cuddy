import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store";
import { api } from "../lib/api";
import type { QueryResult } from "../lib/types";
import { fmtClock } from "../lib/time";

const SUGGESTIONS = [
  "Every turnover in the second half",
  "All shot attempts",
  "Show the counter-attacks",
];

/**
 * Phase 5: a natural-language query returns a playable reel of clips + a
 * one-line grounded summary, each clip carrying the reason it was included.
 * Grounded entirely in coded events — never raw video.
 */
export default function QueryPanel() {
  const videoId = useStore((s) => s.currentVideoId);
  const selectedTrackId = useStore((s) => s.selectedTrackId);
  const requestSeek = useStore((s) => s.requestSeek);
  const selectEvent = useStore((s) => s.selectEvent);
  const setPlaylist = useStore((s) => s.setPlaylist);

  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const run = async (q: string) => {
    if (!videoId || !q.trim()) return;
    setBusy(true);
    setErr(null);
    setResult(null);
    try {
      setResult(await api.query(videoId, q.trim(), selectedTrackId));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Query failed");
    } finally {
      setBusy(false);
    }
  };

  const openClip = (eventId: number, startMs: number) => {
    selectEvent(eventId);
    requestSeek(startMs);
  };

  const loadReel = () => {
    if (result) setPlaylist(result.clips.map((c) => c.event_id));
  };

  return (
    <div className="panel p-3">
      <div className="flex items-center justify-between"><span className="text-xs uppercase tracking-wider text-mist-400">Find clips</span>{selectedTrackId != null && <span className="text-[10px] text-teal-300">Player #{selectedTrackId} in context</span>}</div>

      <div className="flex items-center gap-2 mt-2">
        <input
          className="input flex-1"
          placeholder="e.g. every turnover in the second half"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run(question)}
          disabled={busy || !videoId}
        />
        <button
          className="btn-accent"
          disabled={busy || !videoId || !question.trim()}
          onClick={() => run(question)}
        >
          {busy ? "Finding…" : "Find"}
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            className="px-2 py-0.5 rounded-lg text-xs text-mist-300 border border-ink-500/60 hover:bg-ink-700 transition-colors"
            disabled={busy || !videoId}
            onClick={() => {
              setQuestion(s);
              run(s);
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex flex-col gap-2"
        >
          <p className="text-sm text-mist-100 leading-relaxed">{result.summary}</p>
          {result.clips.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase text-mist-400">
                  {result.clips.length} clip{result.clips.length === 1 ? "" : "s"}
                </span>
                <button className="btn h-7 py-0" onClick={loadReel}>
                  Load as reel →
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {result.clips.map((c) => (
                  <button
                    key={c.event_id}
                    onClick={() => openClip(c.event_id, c.start_ms)}
                    className="card px-2.5 py-1.5 text-left hover:bg-ink-600 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-sm text-mist-100">
                      <span className="tabular-nums text-teal-300 text-xs">
                        {fmtClock(c.start_ms)}
                      </span>
                      {c.label}
                    </div>
                    {c.reason && (
                      <div className="text-xs text-mist-400 mt-0.5">{c.reason}</div>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-mist-500">
                Click a clip to jump there; "Load as reel" fills the playlist —
                play it back-to-back with ▶ Play reel above.
              </p>
            </>
          ) : (
            <p className="text-xs text-mist-400">No matching clips.</p>
          )}
        </motion.div>
      )}
      {err && <p className="text-xs text-signal-live mt-2 leading-relaxed">{err}</p>}
    </div>
  );
}
