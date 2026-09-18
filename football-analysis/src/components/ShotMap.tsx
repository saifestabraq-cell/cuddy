import { useEffect, useRef } from "react";
import type { Shot, ShotsData } from "../lib/types";
import { TEAM_COLORS } from "./AnalyzePanel";

/** Top-down pitch with shot markers sized by xG. Clicking a marker seeks the
 *  video to that shot (spec §25) — pitch becomes a control surface. */
export default function ShotMap({
  shots,
  onSeek,
}: {
  shots: ShotsData;
  onSeek?: (ms: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Screen-space marker geometry, kept for click hit-testing.
  const hitsRef = useRef<{ x: number; y: number; r: number; shot: Shot }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.clientWidth;
    const ch = Math.round((cw * shots.width) / shots.length);
    canvas.width = cw;
    canvas.height = ch;
    canvas.style.height = `${ch}px`;

    // pitch
    ctx.fillStyle = "#12241C";
    ctx.fillRect(0, 0, cw, ch);
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(1, 1, cw - 2, ch - 2);
    ctx.beginPath();
    ctx.moveTo(cw / 2, 0);
    ctx.lineTo(cw / 2, ch);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cw / 2, ch / 2, (9.15 * cw) / shots.length, 0, Math.PI * 2);
    ctx.stroke();

    // shots
    const sx = cw / shots.length;
    const sy = ch / shots.width;
    const hits: { x: number; y: number; r: number; shot: Shot }[] = [];
    for (const s of shots.shots) {
      const x = s.X * sx;
      const y = s.Y * sy;
      const r = 3 + s.xg * 14;
      const color = TEAM_COLORS[s.team] ?? "#8A90A0";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `${color}55`;
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      hits.push({ x, y, r: Math.max(r, 8), shot: s });
    }
    hitsRef.current = hits;
  }, [shots]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    // Nearest marker within its radius.
    let best: { d: number; shot: Shot } | null = null;
    for (const h of hitsRef.current) {
      const d = Math.hypot(px - h.x, py - h.y);
      if (d <= h.r && (!best || d < best.d)) best = { d, shot: h.shot };
    }
    if (best) onSeek(best.shot.t_ms);
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      className={`w-full rounded-lg ${onSeek ? "cursor-pointer" : ""}`}
    />
  );
}
