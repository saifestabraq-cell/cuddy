import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store";
import { api } from "../lib/api";
import SectionHeader from "./SectionHeader";
import { teamCode } from "./TeamBits";
import type {
  MatchFixtureSummary,
  MatchTeam,
  PlayerHeatmap,
  PlayerStat,
  TracksData,
} from "../lib/types";

/** Lowercase, strip accents/punctuation for loose name matching. */
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z\s.]/g, "")
    .trim();
}

/** The surname-ish last token of a name, ignoring initials like "W.". */
function lastToken(s: string): string {
  const parts = norm(s)
    .replace(/\b[a-z]\.\s*/g, "") // drop "w. " style initials
    .split(/\s+/)
    .filter(Boolean);
  return parts[parts.length - 1] ?? "";
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
  const playerStats = useStore((s) => s.playerStats);
  const playerStatsLoading = useStore((s) => s.playerStatsLoading);
  const playerStatsError = useStore((s) => s.playerStatsError);
  const fetchPlayerStats = useStore((s) => s.fetchPlayerStats);
  const selectedPlayerName = useStore((s) => s.selectedPlayerName);
  const selectPlayer = useStore((s) => s.selectPlayer);
  const tracks = useStore((s) => s.tracks);
  const currentVideoId = useStore((s) => s.currentVideoId);
  const assignments = useStore((s) => s.assignments);
  const assignPlayer = useStore((s) => s.assignPlayer);

  const [query, setQuery] = useState("");
  const [side, setSide] = useState<"both" | "home" | "away">("both");

  if (!currentVideo) return null;

  // Resolve a lineup name (often abbreviated, e.g. "W. Saliba") to a stat line
  // (full name, e.g. "William Saliba"). Match on the surname / shared token so
  // the two API-Football name formats line up.
  const allStats: PlayerStat[] = playerStats
    ? Object.values(playerStats.by_team).flatMap((t) => t.players)
    : [];
  const resolveStat = (lineupName: string): PlayerStat | undefined => {
    if (!allStats.length) return undefined;
    const key = lastToken(lineupName);
    if (!key) return undefined;
    // Prefer a real surname match; fall back to a name that contains the token.
    return (
      allStats.find((p) => p.name && lastToken(p.name) === key) ??
      allStats.find((p) => p.name && norm(p.name).includes(key))
    );
  };
  const selectedStat = selectedPlayerName ? resolveStat(selectedPlayerName) : undefined;

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
      {/* Team statistics (scoreline + KPIs live in the full-width MatchHero) */}
      <SectionHeader
        label="Team Statistics"
        className="mb-2.5"
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

      {/* Lineups — both XIs for "Both", one otherwise. Names are clickable to
          show that player's real match stats (once loaded). */}
      {hasLineups && (
        <>
          <SectionHeader
            label="Lineups"
            className="mt-5 mb-2.5"
            right={
              !playerStats ? (
                <button
                  className="text-[11px] text-mist-400 hover:text-teal-300 transition-colors disabled:opacity-50"
                  disabled={playerStatsLoading}
                  onClick={() => fetchPlayerStats()}
                >
                  {playerStatsLoading ? "Loading…" : "Load player stats"}
                </button>
              ) : (
                <span className="text-[10px] uppercase tracking-wide text-mist-500">
                  Tap a player
                </span>
              )
            }
          />
          {playerStatsError && (
            <p className="text-xs text-signal-live mb-2">{playerStatsError}</p>
          )}
          {selectedStat && (
            <PlayerStatCard
              stat={selectedStat}
              videoId={currentVideoId}
              tracks={tracks}
              assignedTrackId={
                selectedStat.name ? assignments[selectedStat.name] : undefined
              }
              onAssign={(trackId) =>
                selectedStat.name && assignPlayer(selectedStat.name, trackId)
              }
              onClose={() => selectPlayer(null)}
            />
          )}
          <div className="grid gap-4">
            {(side === "both" || side === "home") &&
              data.home.start_xi.length > 0 && (
                <Lineup
                  team={data.home}
                  accent="teal"
                  resolveStat={resolveStat}
                  hasStats={allStats.length > 0}
                  selectedName={selectedPlayerName}
                  onPick={selectPlayer}
                />
              )}
            {(side === "both" || side === "away") &&
              data.away.start_xi.length > 0 && (
                <Lineup
                  team={data.away}
                  accent="violet"
                  resolveStat={resolveStat}
                  hasStats={allStats.length > 0}
                  selectedName={selectedPlayerName}
                  onPick={selectPlayer}
                />
              )}
          </div>
        </>
      )}
    </motion.div>
  );
}

/** Compact card of a player's real match stats (API-Football) + a per-player
 *  heatmap from CV tracks once the player is assigned to a tracked number. */
function PlayerStatCard({
  stat,
  videoId,
  tracks,
  assignedTrackId,
  onAssign,
  onClose,
}: {
  stat: PlayerStat;
  videoId: number | null;
  tracks: TracksData | null;
  assignedTrackId?: number;
  onAssign: (trackId: number) => void;
  onClose: () => void;
}) {
  // API-Football reports passes.accuracy as the COUNT of accurate passes;
  // derive the completion percentage from total rather than mislabelling it.
  const acc =
    typeof stat.pass_accuracy === "number" &&
    stat.passes > 0 &&
    stat.pass_accuracy <= stat.passes
      ? Math.round((stat.pass_accuracy / stat.passes) * 100)
      : null;
  const cells: [string, string | number][] = [
    ["Rating", stat.rating ?? "—"],
    ["Mins", stat.minutes ?? "—"],
    ["Goals", stat.goals],
    ["Assists", stat.assists],
    ["Shots", `${stat.shots}${stat.shots_on ? ` (${stat.shots_on})` : ""}`],
    ["Passes", stat.passes],
    ["Pass %", acc != null ? `${acc}%` : "—"],
    ["Key passes", stat.key_passes],
    ["Tackles", stat.tackles],
    ["Interc.", stat.interceptions],
    ["Duels won", `${stat.duels_won}/${stat.duels_total}`],
    ["Dribbles", stat.dribbles],
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-3 mb-3"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {stat.number != null && (
            <span className="w-5 h-5 grid place-items-center rounded-md bg-teal-400/20 text-teal-200 text-[10px] font-semibold tabular-nums shrink-0">
              {stat.number}
            </span>
          )}
          <span className="text-sm font-medium text-mist-100 truncate">{stat.name}</span>
          {stat.position && (
            <span className="text-[10px] uppercase text-mist-500">{stat.position}</span>
          )}
          {stat.rating != null && (
            <span className="text-[11px] tabular-nums text-teal-300">{stat.rating}</span>
          )}
        </div>
        <button
          className="text-mist-500 hover:text-mist-200 transition-colors text-sm leading-none"
          onClick={onClose}
          aria-label="Close player stats"
        >
          ×
        </button>
      </div>
      <div className="grid grid-cols-3 gap-x-3 gap-y-1.5">
        {cells.map(([k, v]) => (
          <div key={k} className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wide text-mist-500">{k}</span>
            <span className="text-sm tabular-nums text-mist-100">{v}</span>
          </div>
        ))}
      </div>

      <PlayerHeatmapSection
        videoId={videoId}
        tracks={tracks}
        assignedTrackId={assignedTrackId}
        onAssign={onAssign}
      />
    </motion.div>
  );
}

/** Heatmap block inside the player card: assign the named player to a CV track
 *  number, then render that track's heatmap (approximate — from footage). */
function PlayerHeatmapSection({
  videoId,
  tracks,
  assignedTrackId,
  onAssign,
}: {
  videoId: number | null;
  tracks: TracksData | null;
  assignedTrackId?: number;
  onAssign: (trackId: number) => void;
}) {
  const [hm, setHm] = useState<PlayerHeatmap | null>(null);
  const [loading, setLoading] = useState(false);
  const [reassign, setReassign] = useState(false);

  // Track ids present in the analysis (person detections), sorted by how often
  // they appear so the most-tracked players are offered first.
  const trackIds = useMemo(() => {
    if (!tracks) return [] as number[];
    const counts = new Map<number, number>();
    for (const f of tracks.frames) {
      for (const d of f.dets) {
        if (d.cls === 32) continue;
        counts.set(d.id, (counts.get(d.id) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id)
      .slice(0, 40);
  }, [tracks]);

  useEffect(() => {
    let cancelled = false;
    if (videoId == null || assignedTrackId == null) {
      setHm(null);
      return;
    }
    setLoading(true);
    api
      .getPlayerHeatmap(videoId, assignedTrackId)
      .then((d) => !cancelled && setHm(d))
      .catch(() => !cancelled && setHm(null))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [videoId, assignedTrackId]);

  if (!tracks) {
    return (
      <p className="text-[11px] text-mist-500 mt-3">
        Analyse the video to enable a per-player heatmap.
      </p>
    );
  }

  const showPicker = assignedTrackId == null || reassign;

  return (
    <div className="mt-3 pt-3 border-t border-ink-500/40">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-wide text-mist-500">
          Heatmap{" "}
          <span className="text-mist-600 normal-case">
            {hm?.space === "image" ? "· camera view (approx.)" : hm?.space === "pitch" ? "· pitch" : ""}
          </span>
        </span>
        {assignedTrackId != null && !reassign && (
          <button
            className="text-[11px] text-mist-400 hover:text-teal-300 transition-colors"
            onClick={() => setReassign(true)}
          >
            #{assignedTrackId} · reassign
          </button>
        )}
      </div>

      {showPicker ? (
        <div>
          <p className="text-[11px] text-mist-400 mb-1.5">
            Link this player to their tracked number (hover a marker on the video
            to read numbers):
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {trackIds.map((id) => (
              <button
                key={id}
                className={`px-2 py-0.5 rounded-md text-[11px] tabular-nums border transition-colors ${
                  id === assignedTrackId
                    ? "bg-teal-400/20 border-teal-400/60 text-mist-100"
                    : "border-ink-500/60 text-mist-300 hover:bg-ink-600"
                }`}
                onClick={() => {
                  onAssign(id);
                  setReassign(false);
                }}
              >
                #{id}
              </button>
            ))}
            {trackIds.length === 0 && (
              <span className="text-[11px] text-mist-500">No tracked players found.</span>
            )}
          </div>
        </div>
      ) : loading ? (
        <div className="h-28 grid place-items-center text-[11px] text-mist-500">
          Building heatmap…
        </div>
      ) : hm && hm.n_points > 0 ? (
        <MiniHeatmap hm={hm} />
      ) : (
        <p className="text-[11px] text-mist-500">
          No positions tracked for #{assignedTrackId}. Try another number.
        </p>
      )}
    </div>
  );
}

/** Renders a normalized heat grid as red blooms over a pitch/camera rectangle. */
function MiniHeatmap({ hm }: { hm: PlayerHeatmap }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = (canvas.width = canvas.clientWidth);
    const ch = (canvas.height = canvas.clientHeight);
    const cols = hm.bins_x;
    const rows = hm.bins_y;
    // Ground.
    if (hm.space === "pitch") {
      ctx.fillStyle = "#14352a";
      ctx.fillRect(0, 0, cw, ch);
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1;
      ctx.strokeRect(3, 3, cw - 6, ch - 6);
      ctx.beginPath();
      ctx.moveTo(cw / 2, 3);
      ctx.lineTo(cw / 2, ch - 3);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cw / 2, ch / 2, Math.min(cw, ch) * 0.12, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = "#0C0E16";
      ctx.fillRect(0, 0, cw, ch);
    }
    // Heat blooms.
    ctx.globalCompositeOperation = "lighter";
    const bw = cw / cols;
    const bh = ch / rows;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const v = hm.grid[y]?.[x] ?? 0;
        if (v <= 0.02) continue;
        const cx = (x + 0.5) * bw;
        const cy = (y + 0.5) * bh;
        const r = Math.max(bw, bh) * 1.6;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `rgba(255,80,60,${Math.min(0.9, v)})`);
        g.addColorStop(1, "rgba(255,80,60,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalCompositeOperation = "source-over";
  }, [hm]);
  return (
    <div>
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg border border-ink-500/50"
        style={{ aspectRatio: hm.space === "pitch" ? "105 / 68" : "16 / 9" }}
      />
      <p className="text-[10px] text-mist-500 mt-1">
        {hm.n_points} tracked positions · approximate spatial layer, not measured data.
      </p>
    </div>
  );
}

function Lineup({
  team,
  accent,
  resolveStat,
  hasStats,
  selectedName,
  onPick,
}: {
  team: MatchTeam;
  accent: "teal" | "violet";
  resolveStat?: (name: string) => PlayerStat | undefined;
  hasStats?: boolean;
  selectedName?: string | null;
  onPick?: (name: string | null) => void;
}) {
  const dot = accent === "teal" ? "bg-teal-400" : "bg-violet-400";
  const form = accent === "teal" ? "text-teal-300" : "text-violet-300";
  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-mist-400 mb-1.5">
        {team.logo ? (
          <img src={team.logo} alt="" className="w-4 h-4 object-contain shrink-0" />
        ) : (
          <span className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
        )}
        <span className={`tabular-nums ${form}`}>{team.formation ?? "—"}</span>
        <span className="truncate">{team.name}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {team.start_xi.map((p) => {
          const hasStat = hasStats ? !!resolveStat?.(p) : false;
          const selected = selectedName === p;
          const cls = `px-2 py-0.5 rounded-md text-[11px] border transition-colors ${
            selected
              ? "bg-teal-400/20 border-teal-400/60 text-mist-100"
              : "text-mist-200 bg-ink-700/60 border-ink-500/50"
          } ${hasStat ? "hover:bg-ink-600 cursor-pointer" : ""}`;
          return hasStat && onPick ? (
            <button
              key={p}
              className={cls}
              onClick={() => onPick(selected ? null : p)}
              title="Show match stats"
            >
              {p}
            </button>
          ) : (
            <span key={p} className={cls}>
              {p}
            </span>
          );
        })}
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
        <span className="flex-1 min-w-0 flex items-center gap-1.5 justify-end">
          <span className="truncate text-right">{fx.home}</span>
          <FixtureLogo src={fx.home_logo} />
        </span>
        <span className="tabular-nums text-teal-300 shrink-0 px-1">{fx.score ?? "vs"}</span>
        <span className="flex-1 min-w-0 flex items-center gap-1.5">
          <FixtureLogo src={fx.away_logo} />
          <span className="truncate">{fx.away}</span>
        </span>
      </div>
      {meta && <div className="text-[11px] text-mist-500 mt-0.5">{meta}</div>}
    </button>
  );
}

function FixtureLogo({ src }: { src?: string | null }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      className="w-4 h-4 object-contain shrink-0"
      onError={(e) => (e.currentTarget.style.display = "none")}
    />
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
