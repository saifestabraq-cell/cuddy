import { useMemo } from "react";
import { useStore } from "../store";

interface Props {
  playheadMs: number;
}

export default function PlayerTrajectory({ playheadMs }: Props) {
  const selectedTrackId = useStore((s) => s.selectedTrackId);
  const tracks = useStore((s) => s.tracks);

  const path = useMemo(() => {
    if (selectedTrackId == null || !tracks) return [];
    return tracks.frames
      .map((frame) => {
        const d = frame.dets.find(
          (det) => det.id === selectedTrackId && det.cls !== 32,
        );
        if (!d) return null;
        return {
          t: frame.t_ms,
          x: (d.x + d.w / 2) / tracks.width,
          y: (d.y + d.h) / tracks.height,
        };
      })
      .filter((p): p is { t: number; x: number; y: number } => p !== null);
  }, [selectedTrackId, tracks]);

  if (selectedTrackId == null) return null;

  if (!path.length) {
    return (
      <div className="panel p-3">
        <div className="text-xs uppercase tracking-wider text-mist-400">
          Player movement
        </div>
        <div className="text-sm text-mist-400 mt-2">
          No trajectory samples are available for #{selectedTrackId}.
        </div>
      </div>
    );
  }

  const currentIndex = path.reduce(
    (best, point, i) =>
      Math.abs(point.t - playheadMs) < Math.abs(path[best].t - playheadMs)
        ? i
        : best,
    0,
  );

  const visible = path.slice(
    Math.max(0, currentIndex - 180),
    Math.min(path.length, currentIndex + 1),
  );

  const points = visible
    .map((p) => `${p.x * 100},${p.y * 100}`)
    .join(" ");

  const current = path[currentIndex];

  return (
    <div className="panel p-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-xs uppercase tracking-wider text-mist-400">
            Player movement
          </div>
          <div className="text-sm text-mist-100 mt-0.5">
            #{selectedTrackId}
          </div>
        </div>
        <div className="text-[10px] text-mist-500">Recent trajectory</div>
      </div>

      <div className="relative aspect-[16/8] rounded-lg overflow-hidden border border-ink-500/50 bg-ink-900/70">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          aria-label="Selected player movement trajectory"
        >
          <rect x="2" y="4" width="96" height="92" rx="3" fill="none" stroke="#30343F" strokeWidth="0.6" />
          <line x1="50" y1="4" x2="50" y2="96" stroke="#30343F" strokeWidth="0.4" />
          <circle cx="50" cy="50" r="9" fill="none" stroke="#30343F" strokeWidth="0.4" />
          {visible.length > 1 && (
            <polyline
              points={points}
              fill="none"
              stroke="#6EE7D6"
              strokeWidth="0.9"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.8"
            />
          )}
          <circle
            cx={current.x * 100}
            cy={current.y * 100}
            r="2.2"
            fill="#6EE7D6"
            stroke="#0E0F13"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="flex items-center justify-between mt-2 text-[10px] text-mist-500">
        <span>{path.length} tracking samples</span>
        <span>
          Current: {Math.round(current.x * 100)}% / {Math.round(current.y * 100)}%
        </span>
      </div>
    </div>
  );
}
