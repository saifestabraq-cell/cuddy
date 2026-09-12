// Time formatting helpers (milliseconds <-> mm:ss.d).

export function fmtClock(ms: number): string {
  if (!isFinite(ms) || ms < 0) ms = 0;
  const totalSec = ms / 1000;
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function fmtClockPrecise(ms: number): string {
  if (!isFinite(ms) || ms < 0) ms = 0;
  const totalSec = ms / 1000;
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  const d = Math.floor((totalSec - Math.floor(totalSec)) * 10);
  return `${m}:${s.toString().padStart(2, "0")}.${d}`;
}
