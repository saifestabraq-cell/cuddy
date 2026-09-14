import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store";

/**
 * Match facts: final score + both starting formations, looked up for the
 * identified game (a result that already happened, not a CV measurement).
 */
export default function MatchInfoPanel() {
  const currentVideo = useStore((s) => s.currentVideo());
  const currentProject = useStore((s) => s.currentProject());
  const info = useStore((s) => s.matchInfo);
  const loading = useStore((s) => s.matchInfoLoading);
  const apiKeySet = useStore((s) => s.apiKeySet);
  const openSettings = useStore((s) => s.openSettings);
  const lookupMatchInfo = useStore((s) => s.lookupMatchInfo);

  const [query, setQuery] = useState("");
  const [err, setErr] = useState<string | null>(null);

  if (!currentVideo) return null;

  const run = async (q: string) => {
    if (!q.trim()) return;
    setErr(null);
    try {
      await lookupMatchInfo(q.trim());
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Lookup failed");
    }
  };

  const hasResult =
    info && (info.score || info.home_team || info.home_formation);

  return (
    <div className="panel p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          Match info
        </span>
      </div>

      {!apiKeySet && (
        <button
          onClick={openSettings}
          className="w-full text-left card px-3 py-2 text-xs text-mist-300 hover:bg-ink-600 transition-colors flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
          Add your Anthropic API key in Settings to look up the score & formations.
        </button>
      )}

      {apiKeySet && loading && (
        <div className="flex items-center gap-2 text-xs text-mist-400 py-3">
          <span className="w-3 h-3 rounded-full border-2 border-teal-300/40 border-t-teal-300 animate-spin" />
          Identifying the match…
        </div>
      )}

      {apiKeySet && !loading && hasResult && info && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3"
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <TeamSide
              name={info.home_team ?? "Home"}
              formation={info.home_formation}
              align="right"
            />
            <div className="text-center px-2">
              <div className="text-2xl font-semibold tabular-nums text-mist-100 leading-none">
                {info.score ?? "—"}
              </div>
            </div>
            <TeamSide
              name={info.away_team ?? "Away"}
              formation={info.away_formation}
              align="left"
            />
          </div>

          {(info.competition || info.date) && (
            <div className="text-center text-[11px] text-mist-400">
              {[info.competition, info.date].filter(Boolean).join(" · ")}
            </div>
          )}

          <div className="flex items-center justify-end text-[11px]">
            <button
              className="text-mist-400 hover:text-teal-300 transition-colors"
              onClick={() => run(currentProject?.name ?? info.query ?? "")}
              disabled={loading}
            >
              Refresh
            </button>
          </div>
        </motion.div>
      )}

      {apiKeySet && !loading && !hasResult && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-mist-400 leading-relaxed">
            Name the match to fetch its final score and both formations.
          </p>
          <div className="flex items-center gap-2">
            <input
              className="input flex-1"
              placeholder="e.g. Chelsea vs Arsenal, Premier League 2024"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run(query)}
            />
            <button
              className="btn-accent"
              disabled={!query.trim()}
              onClick={() => run(query)}
            >
              Look up
            </button>
          </div>
          {currentProject && (
            <button
              className="text-[11px] text-mist-400 hover:text-teal-300 transition-colors self-start"
              onClick={() => run(currentProject.name)}
            >
              Use project name: "{currentProject.name}"
            </button>
          )}
          {err && <p className="text-xs text-signal-live">{err}</p>}
        </div>
      )}
    </div>
  );
}

function TeamSide({
  name,
  formation,
  align,
}: {
  name: string;
  formation?: string | null;
  align: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <div className="text-sm text-mist-100 font-medium truncate">{name}</div>
      {formation && (
        <div className="text-xs text-teal-300 tabular-nums mt-0.5">{formation}</div>
      )}
    </div>
  );
}
