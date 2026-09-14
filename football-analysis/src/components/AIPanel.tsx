import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store";
import { api } from "../lib/api";
import type { QueryResult } from "../lib/types";
import { fmtClock } from "../lib/time";

type Mode = "ask" | "find";

const SUGGESTIONS: Record<Mode, string[]> = {
  ask: [
    "Which team had more possession?",
    "How many shots did each team have?",
    "Summarise the key moments.",
  ],
  find: [
    "Every turnover in the second half",
    "All shot attempts",
    "Show the counter-attacks",
  ],
};

const PLACEHOLDER: Record<Mode, string> = {
  ask: "e.g. Which team created more xG?",
  find: "e.g. every turnover in the second half",
};

/**
 * Unified AI panel: ask a grounded question about the match, or find a reel of
 * clips — both answer over coded events only (never raw video), via Claude.
 */
export default function AIPanel() {
  const videoId = useStore((s) => s.currentVideoId);
  const apiKeySet = useStore((s) => s.apiKeySet);
  const openSettings = useStore((s) => s.openSettings);
  const requestSeek = useStore((s) => s.requestSeek);
  const selectEvent = useStore((s) => s.selectEvent);
  const setPlaylist = useStore((s) => s.setPlaylist);

  const [mode, setMode] = useState<Mode>("ask");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  // Monotonic token: results from a superseded request (mode switch or a newer
  // submit) are dropped so an in-flight Ask answer never lands under Find clips.
  const reqId = useRef(0);

  const switchMode = (m: Mode) => {
    if (m === mode) return;
    reqId.current += 1;
    setBusy(false);
    setMode(m);
    setAnswer(null);
    setResult(null);
    setErr(null);
  };

  const run = async (q: string) => {
    if (!videoId || !q.trim()) return;
    const myId = (reqId.current += 1);
    const myMode = mode;
    setBusy(true);
    setErr(null);
    setAnswer(null);
    setResult(null);
    try {
      if (myMode === "ask") {
        const res = await api.ask(videoId, q.trim());
        if (reqId.current === myId) setAnswer(res.answer);
      } else {
        const res = await api.query(videoId, q.trim());
        if (reqId.current === myId) setResult(res);
      }
    } catch (e) {
      if (reqId.current === myId) setErr(e instanceof Error ? e.message : "Request failed");
    } finally {
      if (reqId.current === myId) setBusy(false);
    }
  };

  const openClip = (eventId: number, startMs: number) => {
    selectEvent(eventId);
    requestSeek(startMs);
  };

  return (
    <div className="panel p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-mist-400">Ask AI</span>
        <div className="flex items-center gap-1 rounded-lg bg-ink-900/60 p-0.5">
          <ModeTab label="Ask" active={mode === "ask"} onClick={() => switchMode("ask")} />
          <ModeTab
            label="Find clips"
            active={mode === "find"}
            onClick={() => switchMode("find")}
          />
        </div>
      </div>

      {!apiKeySet && (
        <button
          onClick={openSettings}
          className="mb-2 w-full text-left card px-3 py-2 text-xs text-mist-300 hover:bg-ink-600 transition-colors flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
          Add your Anthropic API key in Settings to use AI.
        </button>
      )}

      <div className="flex items-center gap-2">
        <input
          className="input flex-1"
          placeholder={PLACEHOLDER[mode]}
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
          {busy ? (mode === "ask" ? "Thinking…" : "Finding…") : mode === "ask" ? "Ask" : "Find"}
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-2">
        {SUGGESTIONS[mode].map((s) => (
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

      {answer && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-3 mt-3 text-sm text-mist-100 whitespace-pre-wrap leading-relaxed"
        >
          {answer}
        </motion.div>
      )}

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
                <button
                  className="btn h-7 py-0"
                  onClick={() => setPlaylist(result.clips.map((c) => c.event_id))}
                >
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

function ModeTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
        active ? "bg-ink-600 text-mist-100" : "text-mist-400 hover:text-mist-200"
      }`}
    >
      {label}
    </button>
  );
}
