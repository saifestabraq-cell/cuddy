import { useState } from "react";
import PitchPanel from "./PitchPanel";
import AnalyticsPanel from "./AnalyticsPanel";
import ShotsPanel from "./ShotsPanel";

type Tab = "heat" | "passing" | "shots";

const TABS: { key: Tab; label: string }[] = [
  { key: "heat", label: "Heatmap" },
  { key: "passing", label: "Passing" },
  { key: "shots", label: "Shots" },
];

/** Consolidates the pitch heatmap, passing and shots panels behind tabs so the
 * left column shows one at a time instead of three stacked panels. */
export default function AnalysisTabs() {
  const [tab, setTab] = useState<Tab>("heat");
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1 rounded-lg bg-ink-800 border border-ink-500/60 p-0.5 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
              tab === t.key
                ? "bg-ink-600 text-mist-100"
                : "text-mist-400 hover:text-mist-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div hidden={tab !== "heat"}>
        <PitchPanel />
      </div>
      <div hidden={tab !== "passing"}>
        <AnalyticsPanel />
      </div>
      <div hidden={tab !== "shots"}>
        <ShotsPanel />
      </div>
    </div>
  );
}
