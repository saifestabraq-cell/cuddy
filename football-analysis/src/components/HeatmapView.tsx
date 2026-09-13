import { useEffect, useRef } from "react";
import type { PitchData } from "../lib/types";
import { TEAM_COLORS } from "./AnalyzePanel";

interface Props {
  pitch: PitchData;
  team: "0" | "1";
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Renders a top-down pitch with the team's position heatmap. */
export default function HeatmapView({ pitch, team }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.clientWidth;
    const ch = Math.round((cw * pitch.width) / pitch.length);
    canvas.width = cw;
    canvas.height = ch;
    canvas.style.height = `${ch}px`;

    // pitch background
    ctx.fillStyle = "#12241C";
    ctx.fillRect(0, 0, cw, ch);

    // heatmap cells
    const grid = pitch.heatmaps[team];
    const [r, g, b] = hexToRgb(TEAM_COLORS[Number(team)]);
    const cellW = cw / pitch.bins_x;
    const cellH = ch / pitch.bins_y;
    for (let gy = 0; gy < pitch.bins_y; gy++) {
      for (let gx = 0; gx < pitch.bins_x; gx++) {
        const v = grid[gy]?.[gx] ?? 0;
        if (v <= 0) continue;
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(0.85, 0.15 + v * 0.85)})`;
        ctx.fillRect(gx * cellW, gy * cellH, cellW + 0.5, cellH + 0.5);
      }
    }

    // pitch lines
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1.5;
    const sx = cw / pitch.length;
    const sy = ch / pitch.width;
    ctx.strokeRect(1, 1, cw - 2, ch - 2);
    ctx.beginPath();
    ctx.moveTo(cw / 2, 0);
    ctx.lineTo(cw / 2, ch);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cw / 2, ch / 2, 9.15 * sx, 0, Math.PI * 2);
    ctx.stroke();
    // penalty boxes (16.5m deep, 40.32m wide)
    const boxD = 16.5 * sx;
    const boxW = 40.32 * sy;
    const boxY = (ch - boxW) / 2;
    ctx.strokeRect(0, boxY, boxD, boxW);
    ctx.strokeRect(cw - boxD, boxY, boxD, boxW);
  }, [pitch, team]);

  return <canvas ref={canvasRef} className="w-full rounded-lg" />;
}
