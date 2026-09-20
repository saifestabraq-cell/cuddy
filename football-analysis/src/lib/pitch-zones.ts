// Pitch zone semantics — the frontend source of truth for the interactive
// pitch and the spatial event filter. Kept aligned with the backend zone words
// in `app/football.py` conventions (thirds run along +x for the home team).

export const THIRDS = ["defensive_third", "middle_third", "final_third"] as const;
export const CHANNELS = ["left", "center", "right"] as const;

export type Third = (typeof THIRDS)[number];
export type Channel = (typeof CHANNELS)[number];

export const ZONE_LABELS: Record<string, string> = {
  defensive_third: "Def. third",
  middle_third: "Mid. third",
  final_third: "Final third",
  left: "Left",
  center: "Center",
  right: "Right",
};

/** Classify a pitch x-coordinate (metres) into a third. Home attacks +x. */
export function thirdOfX(x: number, length: number, attackPositive = true): Third {
  let frac = length ? x / length : 0.5;
  if (!attackPositive) frac = 1 - frac;
  if (frac < 1 / 3) return "defensive_third";
  if (frac < 2 / 3) return "middle_third";
  return "final_third";
}

/** Classify a pitch y-coordinate (metres) into a channel. Low y = right. */
export function channelOfY(y: number, width: number): Channel {
  const frac = width ? y / width : 0.5;
  if (frac < 1 / 3) return "right";
  if (frac < 2 / 3) return "center";
  return "left";
}

/** The two zones (a third and a channel) a located point occupies. */
export function zonesOf(
  x: number,
  y: number,
  length: number,
  width: number,
): [Third, Channel] {
  return [thirdOfX(x, length, true), channelOfY(y, width)];
}

/** Does a located point satisfy the zone selection? Matching is per-dimension:
 *  within a dimension the selected zones are OR'd, across the two dimensions
 *  they are AND'd. An unselected dimension is unconstrained. Empty = match. */
export function pointInZones(
  x: number,
  y: number,
  length: number,
  width: number,
  zones: string[],
): boolean {
  if (!zones.length) return true;
  const [third, channel] = zonesOf(x, y, length, width);
  const selThirds = zones.filter((z) => (THIRDS as readonly string[]).includes(z));
  const selChannels = zones.filter((z) => (CHANNELS as readonly string[]).includes(z));
  if (selThirds.length && !selThirds.includes(third)) return false;
  if (selChannels.length && !selChannels.includes(channel)) return false;
  return true;
}
