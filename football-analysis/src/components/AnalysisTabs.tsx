import { useState } from "react";
import { useStore } from "../store";
import AnalyzePanel from "./AnalyzePanel";
import QualityPanel from "./QualityPanel";
import PitchPanel from "./PitchPanel";
import PitchFilter from "./PitchFilter";
import AnalyticsPanel from "./AnalyticsPanel";
import ShotsPanel from "./ShotsPanel";

type Tab = "analyse" | "pitch" | "passing" | "shots";

const TABS: { key: Tab; label: string }[] = [
  { key: "analyse", label: "Analyse" },
  { key: "pitch", label: "Pitch" },
  { key: "passing", label: "Passing" },
  { key: "shots", label: "Shots" },
];

/** Consolidates the six analysis panels into one tabbed surface so the
 *  workspace shows a single analysis view at a time instead of a long stack
 *  of independent panels (spec §4 — reduce fragmentation). Panels are grouped,
 *  not changed; each still cross-wires into the rest of the workspace. */
export default function AnalysisTabs() {
  const [tab, setTab] = useState<Tab>("analyse");
  // A small dot hints which tabs currently have data, so the analyst doesn't
  // hunt through empty views.
  const tracks = useStore((s) => s.tracks);
  const pitch = useStore((s) => s.pitch);
  const analytics = useStore((s) => s.analytics);
  const shots = useStore((s) => s.shots);
  const hasData: Record<Tab, boolean> = {
    analyse: !!tracks,
    pitch: !!pitch,
    passing: !!analytics,
    shots: !!shots,
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1 rounded-lg bg-ink-800 border border-ink-500/60 p-0.5 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-md text-xs transition-colors flex items-center gap-1.5 ${
              tab === t.key
                ? "bg-ink-600 text-mist-100"
                : "text-mist-400 hover:text-mist-200"
            }`}
          >
            {t.label}
            {hasData[t.key] && (
              <span className="w-1.5 h-1.5 rounded-full bg-teal-300/80" />
            )}
          </button>
        ))}
      </div>

      {/* Toggle via the class, not the `hidden` attribute: Tailwind's `flex`
          utility would override `[hidden]` and show every panel at once. */}
      <div className={tab === "analyse" ? "flex flex-col gap-3" : "hidden"}>
        <AnalyzePanel />
        <QualityPanel />
      </div>
      <div className={tab === "pitch" ? "flex flex-col gap-3" : "hidden"}>
        <PitchPanel />
        <PitchFilter />
      </div>
      <div className={tab === "passing" ? "block" : "hidden"}>
        <AnalyticsPanel />
      </div>
      <div className={tab === "shots" ? "block" : "hidden"}>
        <ShotsPanel />
      </div>
    </div>
  );
}
