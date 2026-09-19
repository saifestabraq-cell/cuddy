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

const CALIB_LABELS = ["TL", "TR", "BR", "BL"];

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

function interpolatedTrackPosition(
  frames: TrackFrame[],
  ms: number,
  trackId: number,
): { x: number; y: number; w: number; h: number } | null {
  if (!frames.length) return null;

  let hi = 0;
  while (hi < frames.length && frames[hi].t_ms < ms) hi++;
  const before = frames[Math.max(0, hi - 1)]?.dets.find((d) => d.id === trackId && d.cls !== 32);
  const after = frames[Math.min(frames.length - 1, hi)]?.dets.find((d) => d.id === trackId && d.cls !== 32);

  if (before && after && frames[Math.max(0, hi - 1)].t_ms !== frames[Math.min(frames.length - 1, hi)].t_ms) {
    const t0 = frames[Math.max(0, hi - 1)].t_ms;
    const t1 = frames[Math.min(frames.length - 1, hi)].t_ms;
    const a = Math.max(0, Math.min(1, (ms - t0) / (t1 - t0)));
    return {
      x: before.x + (after.x - before.x) * a,
      y: before.y + (after.y - before.y) * a,
      w: before.w + (after.w - before.w) * a,
      h: before.h + (after.h - before.h) * a,
    };
  }

  const d = before ?? after;
  return d ? { x: d.x, y: d.y, w: d.w, h: d.h } : null;
}

const VideoPlayer = forwardRef<HTMLVideoElement, Props>(
  ({ src, onTime, onMeta }, ref) => {
    const [playing, setPlaying] = useState(false);
    const [time, setTime] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const tracks = useStore((s) => s.tracks);
    const overlay = useStore((s) => s.overlay);
    const selectedTrackId = useStore((s) => s.selectedTrackId);
    const selectPlayer = useStore((s) => s.selectPlayer);
    const calibrationMode = useStore((s) => s.calibrationMode);
    const calibrationPoints = useStore((s) => s.calibrationPoints);
    const addCalibrationPoint = useStore((s) => s.addCalibrationPoint);
    const videoMissing = useStore((s) => s.videoMissing);
    const relinkVideo = useStore((s) => s.relinkVideo);

    const el = () =>
      (ref as React.MutableRefObject<HTMLVideoElement | null>)?.current ?? null;

    const nativeW = tracks?.width ?? 1;
    const nativeH = tracks?.height ?? 1;

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

        // detection overlay
        if (overlay && tracks) {
          const frame = nearestFrame(tracks.frames, ms);
          if (frame) {
            const sx = cw / tracks.width;
            const sy = ch / tracks.height;
            ctx.lineWidth = 2;
            ctx.font = "11px Inter, system-ui, sans-serif";
            for (const d of frame.dets) {
              const isBall = d.cls === 32;
              const color = isBall ? BALL_COLOR : TEAM_COLORS[d.team] ?? "#8A90A0";
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

            if (selectedTrackId != null) {
              const selected = interpolatedTrackPosition(
                tracks.frames,
                ms,
                selectedTrackId,
              );
              if (selected) {
                const cx = (selected.x + selected.w / 2) * sx;
                const footY = (selected.y + selected.h) * sy;
                ctx.save();
                ctx.strokeStyle = "#6EE7D6";
                ctx.fillStyle = "#6EE7D6";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(cx, footY, 11, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(cx, footY, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.font = "600 11px Inter, system-ui, sans-serif";
                const label = "Player #" + selectedTrackId;
                const pad = 5;
                const tw = ctx.measureText(label).width;
                const lx = Math.max(4, Math.min(cw - tw - pad * 2 - 4, cx - tw / 2 - pad));
                const ly = Math.max(16, footY - 18);
                ctx.fillStyle = "#0E0F13";
                ctx.fillRect(lx, ly - 13, tw + pad * 2, 16);
                ctx.fillStyle = "#6EE7D6";
                ctx.fillText(label, lx + pad, ly - 1);
                ctx.restore();
              }
            }
          }
        }

        // calibration markers
        if (calibrationMode && calibrationPoints.length) {
          const sx = cw / nativeW;
          const sy = ch / nativeH;
          ctx.strokeStyle = "#6EE7D6";
          ctx.lineWidth = 2;
          ctx.beginPath();
          calibrationPoints.forEach(([px, py], i) => {
            const dx = px * sx;
            const dy = py * sy;
            if (i === 0) ctx.moveTo(dx, dy);
            else ctx.lineTo(dx, dy);
          });
          if (calibrationPoints.length === 4) ctx.closePath();
          ctx.stroke();
          calibrationPoints.forEach(([px, py], i) => {
            const dx = px * sx;
            const dy = py * sy;
            ctx.fillStyle = "#6EE7D6";
            ctx.beginPath();
            ctx.arc(dx, dy, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#0E0F13";
            ctx.font = "10px Inter, system-ui, sans-serif";
            ctx.fillText(CALIB_LABELS[i] ?? String(i + 1), dx - 7, dy - 9);
          });
        }
      },
      [overlay, tracks, selectedTrackId, calibrationMode, calibrationPoints, nativeW, nativeH],
    );

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

    const onCalibClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * nativeW;
      const ny = ((e.clientY - rect.top) / rect.height) * nativeH;
      addCalibrationPoint(nx, ny);
    };

    const onPlayerClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (calibrationMode || !overlay || !tracks) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const frame = nearestFrame(tracks.frames, time);
      if (!frame) return;

      const sx = rect.width / tracks.width;
      const sy = rect.height / tracks.height;
      const candidates = frame.dets
        .filter((d) => d.cls !== 32)
        .filter((d) => {
          const dx = d.x * sx;
          const dy = d.y * sy;
          const dw = d.w * sx;
          const dh = d.h * sy;
          return x >= dx && x <= dx + dw && y >= dy && y <= dy + dh;
        })
        .sort((a, b) => a.w * a.h - b.w * b.h);

      const hit = candidates[0];
      if (hit) selectPlayer(hit.id === selectedTrackId ? null : hit.id);
    };

    return (
      <div className="panel overflow-hidden flex flex-col shrink-0">
        <div className="relative bg-black aspect-video w-full">
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
                className="absolute inset-0 w-full h-full cursor-pointer"
                onClick={onPlayerClick}
                title={overlay && !calibrationMode ? "Click a tracked player to follow them" : undefined}
              />
              {calibrationMode && (
                <div
                  className="absolute inset-0 cursor-crosshair"
                  onClick={onCalibClick}
                  title="Click the pitch corners: TL, TR, BR, BL"
                />
              )}
              {videoMissing && (
                <div className="absolute inset-0 grid place-items-center bg-ink-900/92 text-center p-4">
                  <div className="max-w-xs">
                    <div className="text-mist-100 text-sm font-medium mb-1">
                      Source file not found
                    </div>
                    <p className="text-mist-400 text-xs mb-3 leading-relaxed">
                      The video moved or was renamed. Your coded events and
                      analysis are safe — relink the file to keep working.
                    </p>
                    <button className="btn-accent" onClick={relinkVideo}>
                      Relink file
                    </button>
                  </div>
                </div>
              )}
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
          <span
            className="text-[10px] text-mist-500 hidden md:inline"
            title="J reverse · K/Space pause-play · L play (repeat = 2x) · , . step frame · [ ] nudge selected event (Shift for the other way)"
          >
            J K L · , . frame · [ ] nudge
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
