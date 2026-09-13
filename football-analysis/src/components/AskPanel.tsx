import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store";
import { api } from "../lib/api";

const SUGGESTIONS = [
  "Which team had more possession?",
  "How many shots did each team have?",
  "Summarise the key moments.",
];

/** Ask questions about the match in plain English (Claude API, Phase 3c). */
export default function AskPanel() {
  const videoId = useStore((s) => s.currentVideoId);
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
      const res = await api.ask(videoId, q.trim());
      setAnswer(res.answer);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="panel p-3">
      <span className="text-xs uppercase tracking-wider text-mist-400">
        Ask about this match
      </span>

      <div className="flex items-center gap-2 mt-2">
        <input
          className="input flex-1"
          placeholder="e.g. Which team created more xG?"
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
