import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store";
import { api } from "../lib/api";

const SUGGESTIONS = [
  "Which team had more possession?",
  "How many shots did each team have?",
  "Summarise the key moments.",
];

const PLAYER_SUGGESTIONS = [
  "How much did this player move?",
  "How many passes did this player make and receive?",
];

export default function AskPanel() {
  const videoId = useStore((s) => s.currentVideoId);
  const selectedTrackId = useStore((s) => s.selectedTrackId);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const ask = async (q: string) => {
    if (!videoId || !q.trim()) return;
    setBusy(true);
    setError(null);
    setAnswer(null);
    try {
      const res = await api.ask(videoId, q.trim(), selectedTrackId);
      setAnswer(res.answer);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="panel p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          Ask about this match
        </span>
        {selectedTrackId != null && (
          <span className="text-[10px] text-teal-300">
            Player #{selectedTrackId} in context
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mt-2">
        <input
          className="input flex-1"
          placeholder={
            selectedTrackId != null
              ? "Ask about the selected player or the match…"
              : "e.g. Which team created more xG?"
          }
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask(question)}
          disabled={busy || !videoId}
        />
        <button
          className="btn-accent"
          disabled={busy || !videoId || !question.trim()}
          onClick={() => ask(question)}
        >
          {busy ? "Thinking…" : "Ask"}
        </button>
      </div>

      {selectedTrackId != null && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {PLAYER_SUGGESTIONS.map((s) => (
            <button
              key={s}
              className="px-2 py-0.5 rounded-lg text-xs text-teal-200 border border-teal-300/30 hover:bg-teal-300/10 transition-colors"
              disabled={busy || !videoId}
              onClick={() => {
                setQuestion(s);
                ask(s);
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mt-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            className="px-2 py-0.5 rounded-lg text-xs text-mist-300 border border-ink-500/60 hover:bg-ink-700 transition-colors"
            disabled={busy || !videoId}
            onClick={() => {
              setQuestion(s);
              ask(s);
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
      {error && (
        <p className="text-xs text-signal-live mt-2 leading-relaxed">{error}</p>
      )}
    </div>
  );
}
