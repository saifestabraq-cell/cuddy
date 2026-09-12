import { motion } from "framer-motion";
import { useStore } from "../store";

const dot = {
  checking: "bg-mist-400",
  online: "bg-teal-400",
  offline: "bg-signal-live",
} as const;

const label = {
  checking: "Connecting",
  online: "Engine online",
  offline: "Engine offline",
} as const;

export default function TitleBar() {
  const health = useStore((s) => s.health);
  return (
    <header
      className="h-11 shrink-0 flex items-center justify-between px-4 border-b border-ink-500/60 bg-ink-800/80 backdrop-blur"
      // Lets the user drag the frameless Tauri window by the title bar.
      data-tauri-drag-region
    >
      <div className="flex items-center gap-2.5 pointer-events-none">
        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-teal-300 to-violet-400" />
        <span className="text-sm font-medium tracking-tight text-mist-100">
          Cuddy
        </span>
        <span className="text-xs text-mist-400">football analysis</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-mist-300">
        <motion.span
          key={health}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={`w-2 h-2 rounded-full ${dot[health]}`}
        />
        {label[health]}
      </div>
    </header>
  );
}
