import { useState } from "react";
import { useStore } from "../store";
import {
  THIRDS,
  ZONE_LABELS,
  type Channel,
  type Third,
} from "../lib/pitch-zones";

// Rows run top->bottom in pitch y; channelOfY maps low y -> right.
const ROW_CHANNELS: Channel[] = ["right", "center", "left"];

const MANUAL_COLOR = "#6EE7D6"; // teal — analyst-placed
const AI_COLOR = "#B7A6F0"; // violet — CV / AI origin

/** Interactive top-down pitch: click a zone cell to spatially filter the event
 *  list + timeline; click an event dot to select and seek to it (spec §22).
 *
 *  Events are located approximately from the tracked ball (or placed by hand),
 *  so this is a review surface, not measured data. */
export default function PitchFilter() {
  const pitch = useStore((s) => s.pitch);
  const events = useStore((s) => s.events);
  const filter = useStore((s) => s.filter);
  const setFilter = useStore((s) => s.setFilter);
  const selectEvent = useStore((s) => s.selectEvent);
  const selectedEventId = useStore((s) => s.selectedEventId);
  const requestSeek = useStore((s) => s.requestSeek);
  const locateEvents = useStore((s) => s.locateEvents);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  if (!pitch) {
    return (
      <div className="panel p-3">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          Pitch zones
        </span>
        <p className="text-mist-400 text-sm mt-2">
          Calibrate the pitch (in Pitch &amp; heatmaps) to filter events by zone
          on an interactive pitch.
        </p>
      </div>
    );
  }

  const { length, width } = pitch;
  const located = events.filter((e) => e.pitch_x != null && e.pitch_y != null);

  const selThirds = filter.zones.filter((z) =>
    (THIRDS as readonly string[]).includes(z),
  );
  const selChannels = filter.zones.filter((z) => ROW_CHANNELS.includes(z as Channel));

  const cellActive = (third: Third, channel: Channel) =>
    filter.zones.length > 0 &&
    (!selThirds.length || selThirds.includes(third)) &&
    (!selChannels.length || selChannels.includes(channel));

  const isSoleCell = (third: Third, channel: Channel) =>
    filter.zones.length === 2 &&
    filter.zones.includes(third) &&
    filter.zones.includes(channel);

  const clickCell = (third: Third, channel: Channel) => {
    // Click the already-selected single cell to clear; otherwise focus it.
    if (isSoleCell(third, channel)) setFilter({ zones: [] });
    else setFilter({ zones: [third, channel] });
  };

  const doLocate = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const n = await locateEvents();
      setMsg(`Located ${n} event${n === 1 ? "" : "s"} from the ball track.`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="panel p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          Pitch zones
        </span>
        <div className="flex items-center gap-2">
          {filter.zones.length > 0 && (
            <button
              className="text-mist-300 hover:text-teal-300 transition-colors text-xs"
              onClick={() => setFilter({ zones: [] })}
            >
              Clear zones
            </button>
          )}
          <button
            className="text-mist-300 hover:text-teal-300 transition-colors text-xs disabled:opacity-50"
            onClick={doLocate}
            disabled={busy}
            title="Approximate each event's pitch position from the tracked ball"
          >
            {busy ? "Locating…" : "Locate events"}
          </button>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${length} ${width}`}
        className="w-full rounded-lg"
        style={{ background: "#12241C" }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* pitch outline + halfway line + centre circle */}
        <rect
          x={0.4}
          y={0.4}
          width={length - 0.8}
          height={width - 0.8}
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth={0.4}
        />
        <line
          x1={length / 2}
          y1={0}
          x2={length / 2}
          y2={width}
          stroke="rgba(255,255,255,0.28)"
          strokeWidth={0.3}
        />
        <circle
          cx={length / 2}
          cy={width / 2}
          r={9.15}
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth={0.3}
        />

        {/* clickable zone cells (3 thirds x 3 channels) */}
        {THIRDS.map((third, i) =>
          ROW_CHANNELS.map((channel, j) => {
            const on = cellActive(third, channel);
            return (
              <rect
                key={`${third}-${channel}`}
                x={(i * length) / 3}
                y={(j * width) / 3}
                width={length / 3}
                height={width / 3}
                fill={on ? "rgba(110,231,214,0.18)" : "transparent"}
                stroke="rgba(255,255,255,0.10)"
                strokeWidth={0.2}
                className="cursor-pointer"
                onClick={() => clickCell(third, channel)}
              >
                <title>{`${ZONE_LABELS[third]} · ${ZONE_LABELS[channel]}`}</title>
              </rect>
            );
          }),
        )}

        {/* event dots at their located pitch position */}
        {located.map((e) => {
          const selected = e.id === selectedEventId;
          const color = e.source === "ai" ? AI_COLOR : MANUAL_COLOR;
          return (
            <circle
              key={e.id}
              cx={e.pitch_x as number}
              cy={e.pitch_y as number}
              r={selected ? 1.7 : 1.1}
              fill={`${color}${selected ? "" : "cc"}`}
              stroke={selected ? "#fff" : color}
              strokeWidth={selected ? 0.5 : 0.2}
              className="cursor-pointer"
              onClick={() => {
                selectEvent(e.id);
                requestSeek(e.start_ms);
              }}
            >
              <title>{`${e.label || "Event"} — ${
                e.coord_source === "manual" ? "placed" : "approx. CV"
              }`}</title>
            </circle>
          );
        })}
      </svg>

      <div className="mt-2 flex items-center justify-between text-xs text-mist-400">
        <span>
          {located.length}/{events.length} events located
          {filter.zones.length > 0 && " · zone filter active"}
        </span>
        <span className="flex items-center gap-2">
          <Dot color={MANUAL_COLOR} label="Placed" />
          <Dot color={AI_COLOR} label="Approx. CV" />
        </span>
      </div>
      {msg && <p className="text-xs text-teal-300 mt-1">{msg}</p>}
    </div>
  );
}

function Dot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span
        className="inline-block w-2 h-2 rounded-full"
        style={{ background: color }}
      />
      {label}
    </span>
  );
}
