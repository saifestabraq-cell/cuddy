import { useMemo } from "react";
import { useStore } from "../store";

/** Live counts derived from the coded events — the seed of a full dashboard. */
export default function Dashboard() {
  const events = useStore((s) => s.events);
  const categories = useStore((s) => s.categories);

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

  return (
    <div className="panel p-3">
      <span className="text-xs uppercase tracking-wider text-mist-400 px-1">
        Dashboard
      </span>

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
