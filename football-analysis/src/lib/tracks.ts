// Helpers for reading player positions out of the ByteTrack tracks file.
//
// Detections are stored in native video pixels (top-left origin); the Studio
// telestration layer works in normalized [0..1] coordinates over the video box,
// so these helpers return normalized feet points. Follow-the-player graphics
// interpolate a track's position between the two sampled frames bracketing a
// timestamp (tracks are sampled at ~5 fps).

import type { TrackDet, TrackFrame, TracksData } from "./types";

const BALL_CLS = 32;

/** Nearest sampled frame to a timestamp (binary search over sorted frames). */
export function nearestFrame(frames: TrackFrame[], ms: number): TrackFrame | null {
  if (!frames.length) return null;
  let lo = 0;
  let hi = frames.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (frames[mid].t_ms < ms) lo = mid + 1;
    else hi = mid;
  }
  const cand = [frames[lo], frames[Math.max(0, lo - 1)]];
  return cand.reduce((a, b) =>
    Math.abs(a.t_ms - ms) <= Math.abs(b.t_ms - ms) ? a : b,
  );
}

/** The two frames bracketing `ms`: the last at/below it and the first above. */
function bracket(frames: TrackFrame[], ms: number): [TrackFrame | null, TrackFrame | null] {
  if (!frames.length) return [null, null];
  let lo = 0;
  let hi = frames.length; // first index with t_ms > ms
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (frames[mid].t_ms <= ms) lo = mid + 1;
    else hi = mid;
  }
  return [frames[lo - 1] ?? null, frames[lo] ?? null];
}

function playerDet(frame: TrackFrame | null, id: number): TrackDet | null {
  if (!frame) return null;
  for (const d of frame.dets) {
    if (d.cls !== BALL_CLS && d.id === id) return d;
  }
  return null;
}

/** Normalized feet point (bottom-centre of the box) for a detection. */
function feet(d: TrackDet, tracks: TracksData): [number, number] {
  return [(d.x + d.w / 2) / tracks.width, (d.y + d.h) / tracks.height];
}

// A tracked position more than this far (in time) from the requested moment is
// treated as absent, so a pinned graphic hides rather than snapping to a stale
// spot when its track drops out.
const MAX_GAP_MS = 500;

/**
 * Normalized feet position of the player `trackId` at `ms`, linearly
 * interpolated between the bracketing sampled frames. Returns null when the
 * track is absent near that moment (the caller should hide the graphic).
 */
export function trackPosAt(
  tracks: TracksData,
  trackId: number,
  ms: number,
): [number, number] | null {
  const [prev, next] = bracket(tracks.frames, ms);
  const dp = playerDet(prev, trackId);
  const dn = playerDet(next, trackId);
  if (dp && dn && prev && next) {
    const span = next.t_ms - prev.t_ms;
    const f = span > 0 ? (ms - prev.t_ms) / span : 0;
    const a = feet(dp, tracks);
    const b = feet(dn, tracks);
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  }
  if (dp && prev && Math.abs(ms - prev.t_ms) <= MAX_GAP_MS) return feet(dp, tracks);
  if (dn && next && Math.abs(next.t_ms - ms) <= MAX_GAP_MS) return feet(dn, tracks);
  return null;
}

/**
 * The tracked player nearest a normalized point at `ms`, for pin-to-player.
 * Returns null when no player is within a reasonable radius.
 */
export function nearestPlayerAt(
  tracks: TracksData,
  ms: number,
  nx: number,
  ny: number,
): { id: number; pos: [number, number] } | null {
  const frame = nearestFrame(tracks.frames, ms);
  if (!frame) return null;
  let best: { id: number; pos: [number, number] } | null = null;
  let bestD = Infinity;
  for (const d of frame.dets) {
    if (d.cls === BALL_CLS) continue;
    const p = feet(d, tracks);
    const dd = (p[0] - nx) ** 2 + (p[1] - ny) ** 2;
    if (dd < bestD) {
      bestD = dd;
      best = { id: d.id, pos: p };
    }
  }
  // ~0.09 of the frame diagonal — generous enough to click near a marker.
  return best && bestD <= 0.09 ** 2 ? best : null;
}
