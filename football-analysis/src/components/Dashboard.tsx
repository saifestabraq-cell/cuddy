import { useMemo } from "react";
import { useStore } from "../store";
import { openExternal } from "../lib/platform";

/** Live counts derived from the coded events — the seed of a full dashboard. */
export default function Dashboard() {
  const events = useStore((s) => s.events);
  const categories = useStore((s) => s.categories);
  const project = useStore((s) => s.currentProject());
  const info = useStore((s) => s.matchData);

  const stats = useMemo(() => {
    const byCat = new Map<number, number>();
    let manual = 0;
    let ai = 0;
    for (const ev of events) {
      if (ev.category_id) byCat.set(ev.category_id, (byCat.get(ev.category_id) ?? 0) + 1);
      if (ev.source === "ai") ai++;
      else manual++;
    }
    const max = Math.max(1, ...byCat.values());
    return { byCat, manual, ai, max };
  }, [events]);

  const shareOnX = () => {
    const lines: string[] = [];
    if (info?.score && (info.home.name || info.away.name)) {
      lines.push(
        `${info.home.name ?? "Home"} ${info.score} ${info.away.name ?? "Away"}`.trim(),
      );
      const formations = [info.home.formation, info.away.formation].filter(Boolean);
      if (formations.length) lines.push(`Formations: ${formations.join(" vs ")}`);
    } else if (project) {
      lines.push(`${project.name} — match analysis`);
    }
    lines.push(
      `${events.length} events coded${stats.ai ? ` (${stats.ai} AI-assisted)` : ""}.`,
    );
    lines.push("Analysed with Cuddy ⚽ #footballanalysis");
    const text = lines.join("\n");
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    openExternal(url);
  };

  return (
    <div className="panel p-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          Dashboard
        </span>
        <button
          onClick={shareOnX}
          title="Share this project on X"
          className="flex items-center gap-1.5 text-xs text-mist-300 hover:text-mist-100 border border-ink-500/60 hover:border-ink-400 rounded-lg px-2 py-1 transition-colors"
        >
          <XLogo />
          Share
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3">
        <Stat label="Events" value={events.length} />
        <Stat label="Manual" value={stats.manual} accent="#6EE7D6" />
        <Stat label="AI" value={stats.ai} accent="#B7A6F0" />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {categories.map((c) => {
          const count = stats.byCat.get(c.id) ?? 0;
          return (
            <div key={c.id} className="flex items-center gap-2">
              <span className="w-20 shrink-0 text-xs text-mist-200 truncate">
                {c.name}
              </span>
              <div className="flex-1 h-2.5 rounded-full bg-ink-900/70 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-smooth"
                  style={{
                    width: `${(count / stats.max) * 100}%`,
                    background: c.color,
                  }}
                />
              </div>
              <span className="w-6 text-right text-xs tabular-nums text-mist-300">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function XLogo() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="card p-2.5 text-center">
      <div
        className="text-2xl font-semibold tabular-nums"
        style={{ color: accent ?? "#EAECF2" }}
      >
        {value}
      </div>
      <div className="text-[11px] uppercase tracking-wide text-mist-400">
        {label}
      </div>
    </div>
  );
}
