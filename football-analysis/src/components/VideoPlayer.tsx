import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { fmtClockPrecise } from "../lib/time";
import { useStore } from "../store";
import { TEAM_COLORS, BALL_COLOR } from "./AnalyzePanel";
import type { TrackFrame } from "../lib/types";

interface Props {
  src: string | null;
  onTime: (ms: number) => void;
  onMeta: (meta: { duration_ms: number; width: number; height: number }) => void;
}

/** Nearest track frame to a timestamp (binary search over sorted frames). */
function nearestFrame(frames: TrackFrame[], ms: number): TrackFrame | null {
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

const VideoPlayer = forwardRef<HTMLVideoElement, Props>(
  ({ src, onTime, onMeta }, ref) => {
    const [playing, setPlaying] = useState(false);
    const [time, setTime] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const tracks = useStore((s) => s.tracks);
    const overlay = useStore((s) => s.overlay);

    const el = () =>
      (ref as React.MutableRefObject<HTMLVideoElement | null>)?.current ?? null;

    const draw = useCallback(
      (ms: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const cw = canvas.clientWidth;
        const ch = canvas.clientHeight;
        if (canvas.width !== cw) canvas.width = cw;
        if (canvas.height !== ch) canvas.height = ch;
        ctx.clearRect(0, 0, cw, ch);
        if (!overlay || !tracks) return;

        const frame = nearestFrame(tracks.frames, ms);
        if (!frame) return;
        const sx = cw / tracks.width;
        const sy = ch / tracks.height;
        ctx.lineWidth = 2;
        ctx.font = "11px Inter, system-ui, sans-serif";

        for (const d of frame.dets) {
          const isBall = d.cls === 32;
          const color = isBall
            ? BALL_COLOR
            : TEAM_COLORS[d.team] ?? "#8A90A0";
          const x = d.x * sx;
          const y = d.y * sy;
          const w = d.w * sx;
          const h = d.h * sy;
          if (isBall) {
            ctx.beginPath();
            ctx.arc(x + w / 2, y + h / 2, Math.max(5, w / 2), 0, Math.PI * 2);
            ctx.strokeStyle = color;
            ctx.stroke();
          } else {
            ctx.strokeStyle = color;
            ctx.strokeRect(x, y, w, h);
            ctx.fillStyle = color;
            ctx.fillRect(x, y - 12, 18, 12);
            ctx.fillStyle = "#0E0F13";
            ctx.fillText(String(d.id), x + 3, y - 2);
          }
        }
      },
      [overlay, tracks],
    );

    // Redraw when overlay/tracks change (even while paused).
    useEffect(() => {
      const v = el();
      draw(v ? v.currentTime * 1000 : 0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draw, src]);

    useEffect(() => {
      setTime(0);
      setPlaying(false);
    }, [src]);

    const toggle = () => {
      const v = el();
      if (!v) return;
      if (v.paused) v.play();
      else v.pause();
    };

    return (
      <div className="panel overflow-hidden flex flex-col">
        <div className="relative bg-black aspect-video">
          {src ? (
            <>
              <video
                ref={ref}
                src={src}
                className="absolute inset-0 w-full h-full"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onTimeUpdate={(e) => {
                  const ms = e.currentTarget.currentTime * 1000;
                  setTime(ms);
                  onTime(ms);
                  draw(ms);
                }}
                onLoadedMetadata={(e) => {
                  const v = e.currentTarget;
                  onMeta({
                    duration_ms: Math.round(v.duration * 1000),
                    width: v.videoWidth,
                    height: v.videoHeight,
                  });
                }}
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
            </>
          ) : (
            <div className="absolute inset-0 grid place-items-center text-mist-400 text-sm">
              No video loaded
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 px-4 py-2.5 border-t border-ink-500/50">
          <button className="btn-accent w-16" onClick={toggle} disabled={!src}>
            {playing ? "Pause" : "Play"}
          </button>
          <span className="text-sm tabular-nums text-mist-200">
            {fmtClockPrecise(time)}
          </span>
          <div className="flex-1" />
          {[-5, -1, 1, 5].map((sec) => (
            <button
              key={sec}
              className="btn"
              disabled={!src}
              onClick={() => {
                const v = el();
                if (v) v.currentTime = Math.max(0, v.currentTime + sec);
              }}
            >
              {sec > 0 ? `+${sec}s` : `${sec}s`}
            </button>
          ))}
        </div>
      </div>
    );
  },
);

VideoPlayer.displayName = "VideoPlayer";
export default VideoPlayer;
