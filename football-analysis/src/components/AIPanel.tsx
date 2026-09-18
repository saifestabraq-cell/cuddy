import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store";
import { api } from "../lib/api";
import type { EvidencePackage } from "../lib/types";
import { fmtClock } from "../lib/time";
import SectionHeader from "./SectionHeader";

type Mode = "ask" | "show";

const SUGGESTIONS: Record<Mode, string[]> = {
  ask: [
    "Which team had more possession?",
    "Which team created more xG?",
    "How many turnovers in the first half?",
  ],
  show: [
    "Show me every turnover in the middle third",
    "Show me all shots",
    "Show me our attacks in the final third",
  ],
};

const PLACEHOLDER: Record<Mode, string> = {
  ask: "e.g. Which team created more xG?",
  show: "e.g. show me every turnover in the second half",
};

// How a metric's data was produced — drives an honest source badge.
const SOURCE_LABEL: Record<string, string> = {
  official_match_data: "Official",
  cuddy_video_analysis: "Cuddy CV",
  approximate_cv: "Approx. CV",
  heuristic: "Heuristic",
};

/**
 * Unified AI surface. Both "Ask" and "Show me" run the SAME grounded engine
 * (/investigate): deterministic evidence (metrics + real event clips) computed
 * from coded data, with optional LLM prose over it. The model never invents a
 * clip or a metric, and the panel works with no AI key (explanation is just
 * omitted).
 */
export default function AIPanel() {
  const videoId = useStore((s) => s.currentVideoId);
  const aiKeySet = useStore((s) => s.aiKeySet);
  const openSettings = useStore((s) => s.openSettings);
  const requestSeek = useStore((s) => s.requestSeek);
  const selectEvent = useStore((s) => s.selectEvent);
  const setPlaylist = useStore((s) => s.setPlaylist);

  const [mode, setMode] = useState<Mode>("ask");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<EvidencePackage | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  // Monotonic token: a superseded request's result is dropped.
  const reqId = useRef(0);

  const switchMode = (m: Mode) => {
    if (m === mode) return;
    reqId.current += 1;
    setBusy(false);
    setMode(m);
    setResult(null);
    setErr(null);
  };

  const run = async (q: string) => {
    if (!videoId || !q.trim()) return;
    const myId = (reqId.current += 1);
    setBusy(true);
    setErr(null);
    setResult(null);
    try {
      const res = await api.investigate(videoId, q.trim());
      if (reqId.current === myId) setResult(res);
    } catch (e) {
      if (reqId.current === myId)
        setErr(e instanceof Error ? e.message : "Request failed");
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
      <SectionHeader
        label="Ask AI"
        className="mb-2"
        right={
          <div className="flex items-center gap-1 rounded-lg bg-ink-900/60 p-0.5">
            <ModeTab label="Ask" active={mode === "ask"} onClick={() => switchMode("ask")} />
            <ModeTab label="Show me" active={mode === "show"} onClick={() => switchMode("show")} />
          </div>
        }
      />

      {!aiKeySet && (
        <button
          onClick={openSettings}
          className="mb-2 w-full text-left card px-3 py-2 text-xs text-mist-300 hover:bg-ink-600 transition-colors flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
          Evidence &amp; clips work without a key. Add a free Groq key in Settings for written answers.
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
          {busy ? "Working…" : mode === "ask" ? "Ask" : "Show me"}
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

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex flex-col gap-2"
        >
          <p className="text-sm text-mist-100 leading-relaxed">{result.summary}</p>

          {result.explanation && (
            <div className="card p-2.5 text-sm text-mist-200 whitespace-pre-wrap leading-relaxed">
              {result.explanation}
            </div>
          )}

          {result.metrics.length > 0 && (
            <div className="flex flex-col gap-1">
              {result.metrics.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between card px-2.5 py-1.5 text-sm"
                >
                  <span className="text-mist-200">{m.label}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-mist-100 tabular-nums">{m.value}</span>
                    <SourceBadge source={m.source} />
                  </span>
                </div>
              ))}
            </div>
          )}

          {result.clips.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase text-mist-400">
                  {result.clips.length} clip{result.clips.length === 1 ? "" : "s"}
                </span>
                <button
                  className="btn h-7 py-0"
                  onClick={() => setPlaylist(result.clips.map((c) => c.event_id))}
                >
                  Play all →
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
                  </button>
                ))}
              </div>
            </>
          )}

          {result.warnings.length > 0 && (
            <div className="flex flex-col gap-1">
              {result.warnings.map((w, i) => (
                <p key={i} className="text-xs text-amber-300/90 leading-relaxed">
                  ⚠ {w}
                </p>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {err && <p className="text-xs text-signal-live mt-2 leading-relaxed">{err}</p>}
    </div>
  );
}

function SourceBadge({ source }: { source: string }) {
  const label = SOURCE_LABEL[source] ?? source;
  const approx = source === "approximate_cv" || source === "heuristic";
  return (
    <span
      className={`px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide ${
        approx ? "bg-amber-500/15 text-amber-300" : "bg-teal-500/15 text-teal-300"
      }`}
      title={approx ? "Approximate — derived from video analysis" : "From match/video data"}
    >
      {label}
    </span>
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
