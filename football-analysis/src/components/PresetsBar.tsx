import { useState } from "react";
import { useStore } from "../store";
import type { Filter } from "../lib/types";

// Universal built-in presets (project-agnostic — they use source/zones only).
const BUILT_IN: { name: string; filter: Partial<Filter> }[] = [
  { name: "All", filter: {} },
  { name: "AI to review", filter: { source: "ai" } },
  { name: "Final third", filter: { zones: ["final_third"] } },
  { name: "Left attacks", filter: { zones: ["final_third", "left"] } },
  { name: "Right attacks", filter: { zones: ["final_third", "right"] } },
];

/** Workspace presets (§3): one click snaps the timeline, event list and pitch
 *  into an analysis task. Built-ins plus project-scoped saved snapshots. */
export default function PresetsBar() {
  const presets = useStore((s) => s.presets);
  const applyPreset = useStore((s) => s.applyPreset);
  const savePreset = useStore((s) => s.savePreset);
  const deletePreset = useStore((s) => s.deletePreset);
  const currentProjectId = useStore((s) => s.currentProjectId);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");

  if (!currentProjectId) return null;

  const save = async () => {
    if (!name.trim()) return;
    await savePreset(name);
    setName("");
    setSaving(false);
  };

  return (
    <div className="panel px-3 py-2 flex items-center gap-2 flex-wrap">
      <span className="text-xs uppercase tracking-wider text-mist-400 mr-1">
        Presets
      </span>

      {BUILT_IN.map((p) => (
        <button
          key={p.name}
          onClick={() => applyPreset(p.filter)}
          className="px-2.5 py-1 rounded-lg text-xs border border-ink-500/60 text-mist-200 hover:bg-ink-700 transition-colors"
        >
          {p.name}
        </button>
      ))}

      {presets.map((p) => (
        <span
          key={p.id}
          className="inline-flex items-center rounded-lg border border-teal-300/40 bg-teal-300/10"
        >
          <button
            onClick={() => applyPreset(p.filter)}
            className="px-2.5 py-1 text-xs text-teal-200 hover:text-teal-100"
          >
            {p.name}
          </button>
          <button
            onClick={() => deletePreset(p.id)}
            title="Delete preset"
            className="px-1.5 text-teal-300/60 hover:text-signal-live"
          >
            ×
          </button>
        </span>
      ))}

      {saving ? (
        <span className="inline-flex items-center gap-1 ml-auto">
          <input
            autoFocus
            className="input h-7 py-0 w-36"
            placeholder="Preset name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") setSaving(false);
            }}
          />
          <button className="btn-accent h-7 py-0" onClick={save}>
            Save
          </button>
          <button className="btn h-7 py-0" onClick={() => setSaving(false)}>
            Cancel
          </button>
        </span>
      ) : (
        <button className="btn h-7 py-0 ml-auto" onClick={() => setSaving(true)}>
          Save current filter
        </button>
      )}
    </div>
  );
}
