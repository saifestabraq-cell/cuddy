import { useStore } from "../store";
import type { StudioTool } from "../lib/types";

const TOOLS: { tool: StudioTool; label: string; hint: string }[] = [
  { tool: "arrow", label: "Arrow", hint: "Drag to draw an arrow" },
  { tool: "highlight", label: "Spotlight", hint: "Click to spotlight a player" },
  { tool: "box", label: "Box", hint: "Drag a bounding box" },
  { tool: "zone", label: "Zone", hint: "Drag a filled zone" },
  { tool: "path", label: "Path", hint: "Click points, double-click to finish" },
  { tool: "shape", label: "Shape", hint: "Click points, double-click to finish" },
  { tool: "text", label: "Text", hint: "Click to place a label" },
  {
    tool: "link",
    label: "Link players",
    hint: "Click players to connect them; double-click to finish. The shape follows and deforms as they move.",
  },
];

const COLORS = ["#F5C24B", "#6E75F5", "#F2555A", "#29E0C4", "#EAECF2", "#F59E42"];

/**
 * Studio telestration controls: pick a tool + colour, pin a graphic to a tracked
 * player so it follows them, and manage the current drawing.
 */
export default function StudioToolbar() {
  const tool = useStore((s) => s.studioTool);
  const setTool = useStore((s) => s.setStudioTool);
  const color = useStore((s) => s.studioColor);
  const setColor = useStore((s) => s.setStudioColor);
  const shapes = useStore((s) => s.studioShapes);
  const selectedId = useStore((s) => s.selectedShapeId);
  const deleteShape = useStore((s) => s.deleteShape);
  const updateShape = useStore((s) => s.updateShape);
  const clearStudio = useStore((s) => s.clearStudio);
  const armPin = useStore((s) => s.armPin);
  const pinArm = useStore((s) => s.studioPinArm);
  const tracks = useStore((s) => s.tracks);
  const undoStudio = useStore((s) => s.undoStudio);
  const canUndo = useStore((s) => s.studioHistory.length > 0);

  const selected = shapes.find((s) => s.id === selectedId) ?? null;
  const canPin = !!selected && !!tracks;
  const activeHint = pinArm
    ? "Click a player to pin the selected graphic to them."
    : tool
      ? TOOLS.find((t) => t.tool === tool)?.hint
      : selected
        ? "Drag to move · Delete to remove · Pin to a player to follow."
        : "Pick a tool to start drawing over the video.";

  return (
    <div className="panel p-3">
      <div className="flex items-center justify-between mb-2 px-0.5">
        <span className="text-xs uppercase tracking-wider text-mist-400">Studio</span>
        <div className="flex items-center gap-3">
          <button
            className="text-[11px] text-mist-400 hover:text-teal-300 transition-colors disabled:opacity-40 disabled:hover:text-mist-400"
            onClick={undoStudio}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            ↶ Undo
          </button>
          {shapes.length > 0 && (
            <button
              className="text-[11px] text-mist-400 hover:text-signal-live transition-colors"
              onClick={clearStudio}
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {TOOLS.map((t) => (
          <button
            key={t.tool}
            title={t.hint}
            onClick={() => setTool(tool === t.tool ? null : t.tool)}
            className={`px-2.5 py-1 rounded-lg text-xs transition-colors border ${
              tool === t.tool
                ? "bg-teal-500/20 border-teal-400/60 text-mist-100"
                : "border-ink-500/60 text-mist-300 hover:bg-ink-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-3">
        <span className="text-[11px] text-mist-400">Colour</span>
        <div className="flex items-center gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              aria-label={`Colour ${c}`}
              onClick={() => setColor(c)}
              className={`w-5 h-5 rounded-full transition-transform ${
                color === c ? "ring-2 ring-white/80 scale-110" : "ring-1 ring-black/30"
              }`}
              style={{ background: c }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <button
          className={`btn h-7 py-0 ${pinArm ? "bg-teal-500/25 text-mist-100" : ""}`}
          disabled={!canPin}
          title={
            tracks
              ? "Pin the selected graphic to a tracked player so it follows them"
              : "Analyse the video first to track players"
          }
          onClick={() => armPin(!pinArm)}
        >
          {pinArm ? "Click a player…" : "Pin to player"}
        </button>
        {selected?.pinnedTrackId != null && (
          <button
            className="btn h-7 py-0"
            onClick={() => updateShape(selected.id, { pinnedTrackId: undefined, pinPos: undefined })}
          >
            Unpin
          </button>
        )}
        {selected && (
          <button
            className="btn h-7 py-0 text-signal-live"
            onClick={() => deleteShape(selected.id)}
          >
            Delete
          </button>
        )}
      </div>

      <p className="text-[11px] text-mist-500 mt-2 leading-relaxed">{activeHint}</p>
    </div>
  );
}
