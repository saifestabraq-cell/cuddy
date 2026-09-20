import { useMemo, useState } from "react";
import { applyFilter, useStore } from "../store";
import { fmtClock } from "../lib/time";
import {
  CHANNELS,
  THIRDS,
  ZONE_LABELS,
  type Channel,
  type Third,
} from "../lib/pitch-zones";

// Rows run top->bottom in pitch y; channelOfY maps low y -> right.
const ROW_CHANNELS: Channel[] = ["right", "center", "left"];

const MANUAL_COLOR = "#6EE7D6"; // teal — analyst-placed
const AI_COLOR = "#B7A6F0"; // violet — CV / AI origin
const LINE = "rgba(255,255,255,0.26)";

/** Interactive top-down pitch: click a zone (cell or band) to spatially filter
 *  the event list + timeline; click a player to filter their events; click a
 *  dot to select and seek to it (spec §22). Dots dim when they fall outside the
 *  active filter so the pitch mirrors what the timeline shows.
 *
 *  Coordinates are approximate (tracked ball) or analyst-placed — a review
 *  surface, never presented as measured data. */
export default function PitchFilter() {
  const pitch = useStore((s) => s.pitch);
  const events = useStore((s) => s.events);
  const filter = useStore((s) => s.filter);
  const setFilter = useStore((s) => s.setFilter);
  const selectEvent = useStore((s) => s.selectEvent);
  const selectedEventId = useStore((s) => s.selectedEventId);
  const selectPlayer = useStore((s) => s.selectPlayer);
  const requestSeek = useStore((s) => s.requestSeek);
  const locateEvents = useStore((s) => s.locateEvents);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<number | null>(null);

  // Event ids that pass the whole active filter — used to dim non-matching dots.
  const matchedIds = useMemo(
    () => new Set(applyFilter(events, filter, pitch).map((e) => e.id)),
    [events, filter, pitch],
  );

  // Players referenced by any event, for the click-to-filter chips.
  const playerIds = useMemo(() => {
    const set = new Set<number>();
    for (const e of events) for (const id of e.player_track_ids ?? []) set.add(id);
    return [...set].sort((a, b) => a - b);
  }, [events]);

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
  const yc = width / 2;
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
    // Click the already-focused single cell to clear; otherwise focus it.
    if (isSoleCell(third, channel)) setFilter({ zones: [] });
    else setFilter({ zones: [third, channel] });
  };

  const toggleToken = (token: string) =>
    setFilter({
      zones: filter.zones.includes(token)
        ? filter.zones.filter((z) => z !== token)
        : [...filter.zones, token],
    });

  const clickPlayer = (trackId: number) => {
    const on = filter.playerTrackId === trackId;
    setFilter({ playerTrackId: on ? null : trackId });
    if (!on) selectPlayer(trackId); // load the profile in the inspector too
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

  // Standard pitch markings (metres), drawn in the viewBox's own units.
  const penD = 16.5, penHW = 20.16, goalD = 5.5, goalHW = 9.16, penSpot = 11, goalHM = 3.66;

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

      {/* band toggles: whole thirds / channels (OR within a dimension) */}
      <div className="flex flex-wrap items-center gap-1.5 mb-2 text-[10px]">
        <span className="uppercase tracking-wider text-mist-500 mr-0.5">Thirds</span>
        {THIRDS.map((t) => (
          <BandChip
            key={t}
            label={ZONE_LABELS[t]}
            on={selThirds.includes(t)}
            onClick={() => toggleToken(t)}
          />
        ))}
        <span className="uppercase tracking-wider text-mist-500 mx-0.5 ml-2">Channels</span>
        {CHANNELS.map((c) => (
          <BandChip
            key={c}
            label={ZONE_LABELS[c]}
            on={selChannels.includes(c)}
            onClick={() => toggleToken(c)}
          />
        ))}
      </div>

      <svg
        viewBox={`-1 -1 ${length + 2} ${width + 2}`}
        className="w-full rounded-lg"
        style={{ background: "#12241C" }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* markings */}
        <g fill="none" stroke={LINE} strokeWidth={0.3}>
          <rect x={0} y={0} width={length} height={width} />
          <line x1={length / 2} y1={0} x2={length / 2} y2={width} />
          <circle cx={length / 2} cy={yc} r={9.15} />
          {/* penalty + goal areas, both ends */}
          <rect x={0} y={yc - penHW} width={penD} height={penHW * 2} />
          <rect x={length - penD} y={yc - penHW} width={penD} height={penHW * 2} />
          <rect x={0} y={yc - goalHW} width={goalD} height={goalHW * 2} />
          <rect x={length - goalD} y={yc - goalHW} width={goalD} height={goalHW * 2} />
          {/* penalty arcs (the part outside the box) */}
          <path d={`M ${penD} ${yc - 7.31} A 9.15 9.15 0 0 1 ${penD} ${yc + 7.31}`} />
          <path
            d={`M ${length - penD} ${yc - 7.31} A 9.15 9.15 0 0 0 ${length - penD} ${yc + 7.31}`}
          />
        </g>
        <g fill={LINE}>
          <circle cx={length / 2} cy={yc} r={0.5} />
          <circle cx={penSpot} cy={yc} r={0.4} />
          <circle cx={length - penSpot} cy={yc} r={0.4} />
        </g>
        {/* goals */}
        <g stroke="rgba(255,255,255,0.5)" strokeWidth={0.6}>
          <line x1={-0.6} y1={yc - goalHM} x2={-0.6} y2={yc + goalHM} />
          <line x1={length + 0.6} y1={yc - goalHM} x2={length + 0.6} y2={yc + goalHM} />
        </g>

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
                stroke="rgba(255,255,255,0.08)"
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
          const hovered = e.id === hoverId;
          const dim = matchedIds.size > 0 && !matchedIds.has(e.id);
          const color = e.source === "ai" ? AI_COLOR : MANUAL_COLOR;
          const r = selected || hovered ? 1.8 : 1.1;
          return (
            <circle
              key={e.id}
              cx={e.pitch_x as number}
              cy={e.pitch_y as number}
              r={r}
              fill={color}
              fillOpacity={dim ? 0.2 : 1}
              stroke={selected ? "#fff" : color}
              strokeOpacity={dim ? 0.3 : 1}
              strokeWidth={selected ? 0.5 : 0.2}
              className="cursor-pointer"
              onMouseEnter={() => setHoverId(e.id)}
              onMouseLeave={() => setHoverId((h) => (h === e.id ? null : h))}
              onClick={() => {
                selectEvent(e.id);
                requestSeek(e.start_ms);
              }}
            >
              <title>{`${e.label || "Event"} · ${fmtClock(e.start_ms)} · ${
                e.source === "ai" ? "AI" : "manual"
              } · ${e.coord_source === "manual" ? "placed" : "approx. CV"}`}</title>
            </circle>
          );
        })}
      </svg>

      {/* players referenced by events — click to filter to that player */}
      {playerIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10px]">
          <span className="uppercase tracking-wider text-mist-500 mr-0.5">Players</span>
          {playerIds.slice(0, 16).map((id) => (
            <button
              key={id}
              onClick={() => clickPlayer(id)}
              className={`px-2 py-0.5 rounded-md border transition-colors ${
                filter.playerTrackId === id
                  ? "bg-violet-400 text-ink-900 border-violet-400"
                  : "text-violet-300 border-violet-400/40 hover:bg-ink-700"
              }`}
            >
              #{id}
            </button>
          ))}
        </div>
      )}

      <div className="mt-2 flex items-center justify-between text-xs text-mist-400">
        <span>
          {located.length}/{events.length} located
          {(filter.zones.length > 0 || filter.playerTrackId != null) &&
            ` · ${matchedIds.size} match filter`}
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

function BandChip({
  label,
  on,
  onClick,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-0.5 rounded-md border transition-colors ${
        on
          ? "bg-teal-300 text-ink-900 border-teal-300"
          : "text-teal-200 border-teal-300/40 hover:bg-ink-700"
      }`}
    >
      {label}
    </button>
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
