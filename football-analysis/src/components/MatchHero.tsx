import { motion } from "framer-motion";
import { useStore } from "../store";
import SectionHeader from "./SectionHeader";
import { TeamHead } from "./TeamBits";

/** Full-width match band: the validated-match strip, scoreline, and a KPI row
 *  (possession / shots / xG / pass accuracy) — artboard 1's hero. */
export default function MatchHero() {
  const data = useStore((s) => s.matchData);
  if (!data) return null;

  const sub = [data.competition, data.date].filter(Boolean).join(" · ");
  const kpis = [
    { label: "Possession", ...pick(data, ["Ball Possession"]), suffix: "%" },
    { label: "Shots", ...pick(data, ["Total Shots"]), suffix: undefined as string | undefined },
    { label: "Expected Goals", ...pick(data, ["expected_goals", "Expected Goals"]), suffix: undefined as string | undefined },
    { label: "Pass Accuracy", ...pick(data, ["Passes %"]), suffix: "%" },
  ];

  return (
    <motion.div
      className="panel p-4 shrink-0"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <SectionHeader
        label="Match — API-Football · Validated"
        right={
          <div className="flex items-center gap-3 min-w-0">
            {sub && <span className="text-[11px] text-mist-400 truncate">{sub}</span>}
            <button
              className="text-[11px] text-mist-400 hover:text-teal-300 transition-colors shrink-0"
              onClick={() => useStore.setState({ matchData: null })}
            >
              Change fixture
            </button>
          </div>
        }
      />

      {/* Scoreline */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 mt-3 mb-4">
        <TeamHead team={data.home} align="right" size={9} />
        <div className="text-center px-2">
          <div className="text-4xl font-bold tabular-nums text-mist-100 leading-none tracking-tight">
            {data.score ?? "—"}
          </div>
          <div className="text-[10px] uppercase tracking-[0.16em] text-mist-500 mt-1.5">
            Full time
          </div>
        </div>
        <TeamHead team={data.away} align="left" size={9} />
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 pt-3 border-t border-ink-500/40">
        {kpis.map((k) => (
          <Kpi key={k.label} label={k.label} home={k.home} away={k.away} suffix={k.suffix} />
        ))}
      </div>
    </motion.div>
  );
}

function Kpi({
  label,
  home,
  away,
  suffix,
}: {
  label: string;
  home: string | number | null;
  away: string | number | null;
  suffix?: string;
}) {
  const h = num(home);
  const a = num(away);
  const total = (h ?? 0) + (a ?? 0);
  const hPct = total > 0 ? ((h ?? 0) / total) * 100 : 50;
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="tabular-nums text-mist-100 font-medium">{fmt(home, suffix)}</span>
        <span className="text-[10px] uppercase tracking-[0.12em] text-mist-400">{label}</span>
        <span className="tabular-nums text-mist-100 font-medium">{fmt(away, suffix)}</span>
      </div>
      <div className="flex items-center gap-1 mt-1.5 h-1.5">
        <div className="flex-1 flex justify-end">
          <div className="h-full rounded-full bg-teal-400/80" style={{ width: `${hPct}%` }} />
        </div>
        <div className="flex-1">
          <div className="h-full rounded-full bg-violet-400/80" style={{ width: `${100 - hPct}%` }} />
        </div>
      </div>
    </div>
  );
}

/** Find a stat value on both teams by trying candidate keys (case-insensitive). */
function pick(
  data: { home: { stats: Record<string, unknown> }; away: { stats: Record<string, unknown> } },
  keys: string[],
): { home: string | number | null; away: string | number | null } {
  const get = (stats: Record<string, unknown>) => {
    for (const k of keys) {
      if (k in stats) return stats[k] as string | number | null;
      const hit = Object.keys(stats).find((s) => s.toLowerCase() === k.toLowerCase());
      if (hit) return stats[hit] as string | number | null;
    }
    return null;
  };
  return { home: get(data.home.stats), away: get(data.away.stats) };
}

function num(v: string | number | null): number | null {
  if (v == null) return null;
  if (typeof v === "number") return v;
  const m = String(v).match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}

function fmt(v: string | number | null, suffix?: string): string {
  if (v == null || v === "") return "—";
  const s = String(v);
  if (suffix && !s.includes(suffix)) return s + suffix;
  return s;
}
