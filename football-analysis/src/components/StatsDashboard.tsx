import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store";
import SectionHeader from "./SectionHeader";
import type { MatchFixtureSummary, MatchTeam } from "../lib/types";

/** Short 3-letter team code from an explicit abbrev, else the name. */
function teamCode(name?: string | null): string {
  if (!name) return "—";
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0] + (words[1][1] ?? "")).toUpperCase();
  return name.slice(0, 3).toUpperCase();
}

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
  const results = useStore((s) => s.fixtureResults);
  const searching = useStore((s) => s.fixtureSearchLoading);
  const searchError = useStore((s) => s.fixtureSearchError);
  const searchFixtures = useStore((s) => s.searchFixtures);
  const loadFixture = useStore((s) => s.loadFixture);

  const [query, setQuery] = useState("");
  const [side, setSide] = useState<"both" | "home" | "away">("both");

  if (!currentVideo) return null;

  const search = (q: string) => q.trim() && searchFixtures(q.trim());

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
              Search for the match, then pick the exact fixture.
            </p>
            <div className="flex items-center gap-2">
              <input
                className="input flex-1"
                placeholder="e.g. Arsenal vs Chelsea"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search(query)}
              />
              <button
                className="btn-accent"
                disabled={searching || !query.trim()}
                onClick={() => search(query)}
              >
                {searching ? "Searching…" : "Search"}
              </button>
            </div>
            {project && !results.length && (
              <button
                className="text-[11px] text-mist-400 hover:text-teal-300 transition-colors self-start"
                onClick={() => search(project.name)}
              >
                Search project name: "{project.name}"
              </button>
            )}
            {searchError && <p className="text-xs text-signal-live">{searchError}</p>}

            {results.length > 0 && (
              <div className="flex flex-col gap-1 mt-1 max-h-72 overflow-y-auto pr-1">
                {results.map((fx) => (
                  <FixtureRow
                    key={fx.fixture_id}
                    fx={fx}
                    disabled={loading}
                    onClick={() => loadFixture(fx.fixture_id)}
                  />
                ))}
              </div>
            )}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-mist-400 mt-1">
                <span className="w-3 h-3 rounded-full border-2 border-teal-300/40 border-t-teal-300 animate-spin" />
                Loading fixture…
              </div>
            )}
            {error && <p className="text-xs text-signal-live">{error}</p>}
          </div>
        )}
      </div>
    );
  }

  // --- populated dashboard --------------------------------------------------
  const statKeys = orderedStatKeys(data.home.stats, data.away.stats);
  const hasLineups =
    data.home.start_xi.length > 0 || data.away.start_xi.length > 0;

  const homeCode = teamCode(data.home.name);
  const awayCode = teamCode(data.away.name);

  return (
    <motion.div
      className="panel p-4"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Header
        competition={data.competition}
        date={data.date}
        onChange={() => useStore.setState({ matchData: null })}
      />

      {/* Scoreline + formations */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mt-3 mb-4">
        <TeamHead team={data.home} align="right" />
        <div className="text-center px-2">
          <div className="text-4xl font-bold tabular-nums text-mist-100 leading-none tracking-tight">
            {data.score ?? "—"}
          </div>
          <div className="text-[10px] uppercase tracking-[0.16em] text-mist-500 mt-1.5">
            Full time
          </div>
        </div>
        <TeamHead team={data.away} align="left" />
      </div>

      {/* Team statistics */}
      <SectionHeader
        label="Team Statistics"
        className="mt-5 mb-2.5"
        right={
          <div className="flex items-center gap-0.5 rounded-lg bg-ink-900/70 p-0.5">
            <SideTab label="Both" active={side === "both"} onClick={() => setSide("both")} />
            <SideTab label={homeCode} active={side === "home"} onClick={() => setSide("home")} />
            <SideTab label={awayCode} active={side === "away"} onClick={() => setSide("away")} />
          </div>
        }
      />

      {statKeys.length > 0 && side === "both" && (
        <>
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-mist-400 mb-1.5 px-0.5">
            <span className="text-teal-300 font-medium">{homeCode}</span>
            <span>Metric</span>
            <span className="text-violet-300 font-medium">{awayCode}</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {statKeys.map((k) => (
              <StatRow key={k} label={k} home={data.home.stats[k]} away={data.away.stats[k]} />
            ))}
          </div>
        </>
      )}
      {statKeys.length > 0 && side !== "both" && (
        <div className="flex flex-col gap-2.5">
          {statKeys.map((k) => (
            <StatLine
              key={k}
              label={k}
              value={(side === "home" ? data.home : data.away).stats[k]}
              accent={side === "home" ? "teal" : "violet"}
            />
          ))}
        </div>
      )}

      {/* Lineups — both XIs for "Both", one otherwise */}
      {hasLineups && (
        <>
          <SectionHeader label="Lineups" className="mt-5 mb-2.5" />
          <div className="grid gap-4">
            {(side === "both" || side === "home") &&
              data.home.start_xi.length > 0 && (
                <Lineup team={data.home} accent="teal" />
              )}
            {(side === "both" || side === "away") &&
              data.away.start_xi.length > 0 && (
                <Lineup team={data.away} accent="violet" />
              )}
          </div>
        </>
      )}
    </motion.div>
  );
}

function Lineup({ team, accent }: { team: MatchTeam; accent: "teal" | "violet" }) {
  const dot = accent === "teal" ? "bg-teal-400" : "bg-violet-400";
  const form = accent === "teal" ? "text-teal-300" : "text-violet-300";
  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-mist-400 mb-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
        <span className={`tabular-nums ${form}`}>{team.formation ?? "—"}</span>
        <span className="truncate">{team.name}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {team.start_xi.map((p) => (
          <span
            key={p}
            className="px-2 py-0.5 rounded-md text-[11px] text-mist-200 bg-ink-700/60 border border-ink-500/50"
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Single-team stat line with a proportional bar (0–100 scaled or share). */
function StatLine({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number | null;
  accent: "teal" | "violet";
}) {
  const bar = accent === "teal" ? "bg-teal-400/80" : "bg-violet-400/80";
  const n = num(value);
  // Percent-like values fill by magnitude; others just show a full subtle bar.
  const pct =
    n != null && n >= 0 && n <= 100 && /%|Possession|Passes %/i.test(label)
      ? n
      : null;
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-mist-400 text-[11px] uppercase tracking-wide">{label}</span>
        <span className="tabular-nums text-mist-100">{fmt(value)}</span>
      </div>
      {pct != null && (
        <div className="mt-1 h-1.5">
          <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  );
}

function FixtureRow({
  fx,
  disabled,
  onClick,
}: {
  fx: MatchFixtureSummary;
  disabled: boolean;
  onClick: () => void;
}) {
  const meta = [fx.competition, fx.date].filter(Boolean).join(" · ");
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="card px-2.5 py-2 text-left hover:bg-ink-600 transition-colors disabled:opacity-50"
    >
      <div className="flex items-center gap-2 text-sm text-mist-100">
        <span className="flex-1 truncate">{fx.home}</span>
        <span className="tabular-nums text-teal-300 shrink-0">{fx.score ?? "vs"}</span>
        <span className="flex-1 truncate text-right">{fx.away}</span>
      </div>
      {meta && <div className="text-[11px] text-mist-500 mt-0.5">{meta}</div>}
    </button>
  );
}

function Header({
  competition,
  date,
  onChange,
}: {
  competition?: string | null;
  date?: string | null;
  onChange?: () => void;
}) {
  const sub = [competition, date].filter(Boolean).join(" · ");
  return (
    <SectionHeader
      label="Match — API-Football · Validated"
      right={
        <div className="flex items-center gap-3 min-w-0">
          {sub && <span className="text-[11px] text-mist-400 truncate">{sub}</span>}
          {onChange && (
            <button
              className="text-[11px] text-mist-400 hover:text-teal-300 transition-colors shrink-0"
              onClick={onChange}
            >
              Change fixture
            </button>
          )}
        </div>
      }
    />
  );
}

function TeamHead({ team, align }: { team: MatchTeam; align: "left" | "right" }) {
  const side = align === "right" ? "Home" : "Away";
  const meta = [team.formation, side].filter(Boolean).join(" · ");
  return (
    <div
      className={`flex items-center gap-2.5 ${
        align === "right" ? "flex-row-reverse text-right" : "text-left"
      }`}
    >
      <TeamBadge team={team} />
      <div className="min-w-0">
        <div className="text-base font-semibold text-mist-100 truncate leading-tight">
          {team.name}
        </div>
        {meta && (
          <div className="text-[11px] text-mist-400 tabular-nums truncate">{meta}</div>
        )}
      </div>
    </div>
  );
}

/** Team badge: the crest if available, else a blurple rounded-square code chip. */
function TeamBadge({ team }: { team: MatchTeam }) {
  if (team.logo) {
    return (
      <img
        src={team.logo}
        alt=""
        className="w-8 h-8 object-contain shrink-0"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
    );
  }
  return (
    <span className="w-8 h-8 shrink-0 grid place-items-center rounded-lg bg-teal-400/20 text-teal-200 text-[11px] font-semibold tabular-nums">
      {teamCode(team.name)}
    </span>
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
