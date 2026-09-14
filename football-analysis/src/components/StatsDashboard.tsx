import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store";
import type { MatchTeam } from "../lib/types";

/**
 * Post-analysis match dashboard: real score, formations and a side-by-side
 * team stats table, plus a Team A / Team B switch for lineups — all from
 * API-Football (validated data, not CV/LLM-derived).
 */
export default function StatsDashboard() {
  const currentVideo = useStore((s) => s.currentVideo());
  const project = useStore((s) => s.currentProject());
  const data = useStore((s) => s.matchData);
  const loading = useStore((s) => s.matchDataLoading);
  const error = useStore((s) => s.matchDataError);
  const keySet = useStore((s) => s.apifootballKeySet);
  const openSettings = useStore((s) => s.openSettings);
  const fetchMatchData = useStore((s) => s.fetchMatchData);

  const [query, setQuery] = useState("");
  const [side, setSide] = useState<"home" | "away">("home");

  if (!currentVideo) return null;

  const run = (q: string) => q.trim() && fetchMatchData(q.trim());

  // --- empty / prompt states ------------------------------------------------
  if (!data) {
    return (
      <div className="panel p-4">
        <Header />
        {!keySet ? (
          <button
            onClick={openSettings}
            className="mt-1 w-full text-left card px-3 py-2.5 text-xs text-mist-300 hover:bg-ink-600 transition-colors flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
            Add a free API-Football key in Settings to pull real match stats,
            lineups and formations.
          </button>
        ) : (
          <div className="mt-1 flex flex-col gap-2">
            <p className="text-xs text-mist-400">
              Name the match to load its real stats and formations.
            </p>
            <div className="flex items-center gap-2">
              <input
                className="input flex-1"
                placeholder="e.g. Chelsea vs Arsenal 2024"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && run(query)}
              />
              <button
                className="btn-accent"
                disabled={loading || !query.trim()}
                onClick={() => run(query)}
              >
                {loading ? "Loading…" : "Load"}
              </button>
            </div>
            {project && (
              <button
                className="text-[11px] text-mist-400 hover:text-teal-300 transition-colors self-start"
                onClick={() => run(project.name)}
              >
                Use project name: "{project.name}"
              </button>
            )}
            {error && <p className="text-xs text-signal-live">{error}</p>}
          </div>
        )}
      </div>
    );
  }

  // --- populated dashboard --------------------------------------------------
  const focus = side === "home" ? data.home : data.away;
  const statKeys = orderedStatKeys(data.home.stats, data.away.stats);

  return (
    <motion.div
      className="panel p-4"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Header competition={data.competition} date={data.date} />

      {/* Scoreline + formations */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mt-1 mb-4">
        <TeamHead team={data.home} align="right" />
        <div className="text-center">
          <div className="text-3xl font-semibold tabular-nums text-mist-100 leading-none">
            {data.score ?? "—"}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-mist-500 mt-1">
            Full time
          </div>
        </div>
        <TeamHead team={data.away} align="left" />
      </div>

      {/* Side-by-side stats table */}
      {statKeys.length > 0 && (
        <div className="flex flex-col gap-2">
          {statKeys.map((k) => (
            <StatRow
              key={k}
              label={k}
              home={data.home.stats[k]}
              away={data.away.stats[k]}
            />
          ))}
        </div>
      )}

      {/* Team A / B switch → lineup */}
      {(data.home.start_xi.length > 0 || data.away.start_xi.length > 0) && (
        <div className="mt-4">
          <div className="flex items-center gap-1 rounded-lg bg-ink-900/60 p-0.5 w-fit mb-2">
            <SideTab
              label={data.home.name ?? "Home"}
              active={side === "home"}
              onClick={() => setSide("home")}
            />
            <SideTab
              label={data.away.name ?? "Away"}
              active={side === "away"}
              onClick={() => setSide("away")}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-mist-400 mb-1.5">
            <span className="text-teal-300 tabular-nums">{focus.formation ?? "—"}</span>
            <span>{focus.name}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {focus.start_xi.map((p) => (
              <span
                key={p}
                className="px-2 py-0.5 rounded-md text-[11px] text-mist-200 bg-ink-700/60 border border-ink-500/50"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function Header({
  competition,
  date,
}: {
  competition?: string | null;
  date?: string | null;
}) {
  const sub = [competition, date].filter(Boolean).join(" · ");
  return (
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs uppercase tracking-wider text-mist-400">Match</span>
      {sub && <span className="text-[11px] text-mist-400">{sub}</span>}
    </div>
  );
}

function TeamHead({ team, align }: { team: MatchTeam; align: "left" | "right" }) {
  return (
    <div
      className={`flex items-center gap-2 ${
        align === "right" ? "justify-end text-right" : "justify-start text-left"
      }`}
    >
      {align === "left" && <TeamLogo team={team} />}
      <div>
        <div className="text-sm font-medium text-mist-100 truncate">{team.name}</div>
        {team.formation && (
          <div className="text-[11px] text-teal-300 tabular-nums">{team.formation}</div>
        )}
      </div>
      {align === "right" && <TeamLogo team={team} />}
    </div>
  );
}

function TeamLogo({ team }: { team: MatchTeam }) {
  if (!team.logo) return null;
  return (
    <img
      src={team.logo}
      alt=""
      className="w-6 h-6 object-contain shrink-0"
      onError={(e) => (e.currentTarget.style.display = "none")}
    />
  );
}

function StatRow({
  label,
  home,
  away,
}: {
  label: string;
  home: string | number | null;
  away: string | number | null;
}) {
  const h = num(home);
  const a = num(away);
  const total = (h ?? 0) + (a ?? 0);
  const hPct = total > 0 ? ((h ?? 0) / total) * 100 : 50;
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="tabular-nums text-mist-100 w-12">{fmt(home)}</span>
        <span className="text-mist-400 text-[11px] uppercase tracking-wide">{label}</span>
        <span className="tabular-nums text-mist-100 w-12 text-right">{fmt(away)}</span>
      </div>
      <div className="flex items-center gap-1 mt-1 h-1.5">
        <div className="flex-1 flex justify-end">
          <div className="h-full rounded-full bg-teal-400/80" style={{ width: `${hPct}%` }} />
        </div>
        <div className="flex-1">
          <div
            className="h-full rounded-full bg-violet-400/80"
            style={{ width: `${100 - hPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function SideTab({
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
      className={`px-2.5 py-1 rounded-md text-xs transition-colors max-w-[9rem] truncate ${
        active ? "bg-ink-600 text-mist-100" : "text-mist-400 hover:text-mist-200"
      }`}
    >
      {label}
    </button>
  );
}

// Preferred stat order; anything else follows in first-seen order.
const PREFERRED = [
  "Ball Possession",
  "Total Shots",
  "Shots on Goal",
  "Shots off Goal",
  "Total passes",
  "Passes accurate",
  "Passes %",
  "Fouls",
  "Corner Kicks",
  "Offsides",
  "Yellow Cards",
  "Red Cards",
];

function orderedStatKeys(
  home: Record<string, unknown>,
  away: Record<string, unknown>,
): string[] {
  const keys = new Set([...Object.keys(home), ...Object.keys(away)]);
  const preferred = PREFERRED.filter((k) => keys.has(k));
  const rest = [...keys].filter((k) => !PREFERRED.includes(k));
  return [...preferred, ...rest];
}

function num(v: string | number | null): number | null {
  if (v == null) return null;
  if (typeof v === "number") return v;
  const m = String(v).match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}

function fmt(v: string | number | null): string {
  if (v == null || v === "") return "—";
  return String(v);
}
