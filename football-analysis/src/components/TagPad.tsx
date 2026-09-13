import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store";

// Pressing the same coding button again within this window extends the
// in-progress event to the current playhead instead of starting a new one.
const EXTEND_WINDOW_MS = 12000;

interface Props {
  playheadMs: number;
  disabled: boolean;
}

const SWATCHES = ["#6EE7D6", "#9B84E8", "#F0A6C0", "#F2C879", "#7FB4F0", "#8AE29A"];

/**
 * The coding pad — Nacsport's core interaction. Each button is a category;
 * clicking it drops an event around the current playhead using the category's
 * lead/lag window. Hotkeys fire the matching button while the video plays.
 */
export default function TagPad({ playheadMs, disabled }: Props) {
  const { categories, addCategory, removeCategory, addEvent, updateEvent, currentVideoId } =
    useStore();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(SWATCHES[0]);
  // last event tagged per category, for second-press-extends
  const lastTag = useRef<Record<number, { id: number; at: number }>>({});

  const code = async (categoryId: number, lead = 5000, lag = 3000) => {
    if (!currentVideoId) return;
    const prev = lastTag.current[categoryId];
    const now = performance.now();
    if (prev && now - prev.at < EXTEND_WINDOW_MS) {
      // second press: extend the unfolding phase to the current playhead
      await updateEvent(prev.id, { end_ms: Math.round(playheadMs + lag) });
      lastTag.current[categoryId] = { id: prev.id, at: now };
      return;
    }
    await addEvent({
      video_id: currentVideoId,
      category_id: categoryId,
      start_ms: Math.max(0, Math.round(playheadMs - lead)),
      end_ms: Math.round(playheadMs + lag),
      source: "manual",
    });
    const newId = useStore.getState().selectedEventId;
    if (newId) lastTag.current[categoryId] = { id: newId, at: now };
  };

  // Hotkey coding.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (disabled) return;
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      const cat = categories.find(
        (c) => c.hotkey && c.hotkey.toLowerCase() === e.key.toLowerCase(),
      );
      if (cat) {
        e.preventDefault();
        code(cat.id, cat.lead_ms, cat.lag_ms);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, disabled, playheadMs, currentVideoId]);

  const submit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    await addCategory(trimmed, color);
    setName("");
    setCreating(false);
  };

  return (
    <div className="panel p-3">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          Tag pad
        </span>
        <button
          className="text-mist-300 hover:text-teal-300 transition-colors text-sm"
          onClick={() => setCreating((v) => !v)}
        >
          + button
        </button>
      </div>

      {creating && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-3 mb-3 flex items-center gap-2"
        >
          <input
            autoFocus
            className="input flex-1"
            placeholder="e.g. Shot, Pass, Corner"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <div className="flex gap-1">
            {SWATCHES.map((s) => (
              <button
                key={s}
                onClick={() => setColor(s)}
                className={`w-6 h-6 rounded-lg transition-transform ${
                  color === s ? "scale-110 ring-2 ring-white/60" : ""
                }`}
                style={{ background: s }}
              />
            ))}
          </div>
          <button className="btn-accent" onClick={submit}>
            Add
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {categories.length === 0 && (
          <p className="text-mist-400 text-sm col-span-full px-1">
            Add coding buttons to start tagging events.
          </p>
        )}
        {categories.map((c) => (
          <motion.button
            key={c.id}
            whileTap={{ scale: 0.96 }}
            disabled={disabled}
            onClick={() => code(c.id, c.lead_ms, c.lag_ms)}
            onContextMenu={(e) => {
              e.preventDefault();
              removeCategory(c.id);
            }}
            title={
              c.hotkey ? `Hotkey: ${c.hotkey} · right-click to remove` : "Right-click to remove"
            }
            className="group relative h-16 rounded-xl border text-sm font-medium
                       transition-all duration-200 ease-smooth disabled:opacity-40
                       hover:shadow-glow"
            style={{
              background: `${c.color}1A`,
              borderColor: `${c.color}66`,
              color: c.color,
            }}
          >
            {c.name}
            {c.hotkey && (
              <span className="absolute top-1.5 right-2 text-[10px] text-mist-400 uppercase">
                {c.hotkey}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
