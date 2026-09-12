import { useStore } from "../store";

/** Filter chips that drive the timeline, event list and dashboard together. */
export default function FilterBar() {
  const { categories, descriptorGroups, filter, setFilter, clearFilter } =
    useStore();
  const allDescriptors = descriptorGroups.flatMap((g) =>
    g.descriptors.map((d) => d.label),
  );

  const active =
    filter.categoryIds.length > 0 ||
    filter.descriptors.length > 0 ||
    filter.source !== "all" ||
    filter.text.trim() !== "";

  const toggleCat = (id: number) =>
    setFilter({
      categoryIds: filter.categoryIds.includes(id)
        ? filter.categoryIds.filter((c) => c !== id)
        : [...filter.categoryIds, id],
    });

  const toggleDesc = (label: string) =>
    setFilter({
      descriptors: filter.descriptors.includes(label)
        ? filter.descriptors.filter((d) => d !== label)
        : [...filter.descriptors, label],
    });

  return (
    <div className="panel px-3 py-2 flex items-center gap-2 flex-wrap">
      <span className="text-xs uppercase tracking-wider text-mist-400 mr-1">
        Filter
      </span>

      {/* source */}
      <div className="flex rounded-lg overflow-hidden border border-ink-500/60">
        {(["all", "manual", "ai"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter({ source: s })}
            className={`px-2.5 py-1 text-xs capitalize transition-colors ${
              filter.source === s
                ? "bg-ink-600 text-mist-100"
                : "text-mist-300 hover:bg-ink-700"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* categories */}
      {categories.map((c) => {
        const on = filter.categoryIds.includes(c.id);
        return (
          <button
            key={c.id}
            onClick={() => toggleCat(c.id)}
            className="px-2.5 py-1 rounded-lg text-xs border transition-all"
            style={{
              color: on ? "#0E0F13" : c.color,
              background: on ? c.color : `${c.color}1A`,
              borderColor: `${c.color}66`,
            }}
          >
            {c.name}
          </button>
        );
      })}

      {/* descriptors */}
      {allDescriptors.map((label) => {
        const on = filter.descriptors.includes(label);
        return (
          <button
            key={label}
            onClick={() => toggleDesc(label)}
            className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${
              on
                ? "bg-violet-400 text-ink-900 border-violet-400"
                : "text-violet-300 border-violet-400/40 hover:bg-ink-700"
            }`}
          >
            {label}
          </button>
        );
      })}

      <input
        className="input h-7 py-0 w-40 ml-auto"
        placeholder="Search…"
        value={filter.text}
        onChange={(e) => setFilter({ text: e.target.value })}
      />
      {active && (
        <button className="btn h-7 py-0" onClick={clearFilter}>
          Clear
        </button>
      )}
    </div>
  );
}
