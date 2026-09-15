import { motion } from "framer-motion";
import { useStore } from "../store";

const dot = {
  checking: "bg-mist-400",
  online: "bg-teal-400",
  offline: "bg-mist-400",
  failed: "bg-signal-live",
} as const;

const label = {
  checking: "Starting Cuddy Engine…",
  online: "Engine ready",
  offline: "Connecting to Analysis Engine…",
  failed: "Engine failed to start",
} as const;

/** Short 3-letter code for a team (from an explicit abbrev, else the name). */
function teamCode(name?: string | null): string {
  if (!name) return "";
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0] + (words[1][1] ?? "")).toUpperCase();
  return name.slice(0, 3).toUpperCase();
}

export default function TitleBar() {
  const health = useStore((s) => s.health);
  const openSettings = useStore((s) => s.openSettings);
  const apiKeySet = useStore((s) => s.apiKeySet);
  const match = useStore((s) => s.matchData);

  const fixture = match
    ? [
        match.competition || undefined,
        `${teamCode(match.home?.name)} v ${teamCode(match.away?.name)}`,
      ]
        .filter(Boolean)
        .join(" · ")
    : null;

  return (
    <header
      className="h-11 shrink-0 flex items-center justify-between px-4 border-b border-ink-500/60 bg-ink-800/80 backdrop-blur"
      // Lets the user drag the frameless Tauri window by the title bar.
      data-tauri-drag-region
    >
      <div className="flex items-center gap-2.5 pointer-events-none">
        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-teal-300 to-violet-400" />
        <span className="text-sm font-semibold tracking-tight text-mist-100">
          Cuddy
        </span>
        <span className="text-[11px] uppercase tracking-[0.14em] text-mist-400">
          Match Analysis
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs text-mist-300">
        <div className="flex items-center gap-2">
          <motion.span
            key={health}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`w-2 h-2 rounded-full ${dot[health]}`}
          />
          {label[health]}
        </div>
        {fixture && (
          <>
            <span className="text-ink-500">|</span>
            <span className="text-mist-200 tabular-nums">{fixture}</span>
          </>
        )}
        <button
          onClick={openSettings}
          title="Settings"
          aria-label="Settings"
          className="relative pointer-events-auto text-mist-400 hover:text-teal-300 transition-colors p-1 -mr-1 rounded-lg hover:bg-ink-700"
        >
          <GearIcon />
          {!apiKeySet && (
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-violet-400" />
          )}
        </button>
      </div>
    </header>
  );
}

function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 15a3 3 0 100-6 3 3 0 000 6z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M19.4 13a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}
