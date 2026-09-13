import { useEffect, useRef } from "react";
import type { ShotsData } from "../lib/types";
import { TEAM_COLORS } from "./AnalyzePanel";

/** Top-down pitch with shot markers sized by xG. */
export default function ShotMap({ shots }: { shots: ShotsData }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    }
  }, [shots]);

  return <canvas ref={canvasRef} className="w-full rounded-lg" />;
}
