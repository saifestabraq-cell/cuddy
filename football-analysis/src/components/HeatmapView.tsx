import { useEffect, useRef } from "react";
import type { PitchData } from "../lib/types";

interface Props {
  pitch: PitchData;
  team: "0" | "1";
}

/** Top-down pitch: green turf with mowing stripes and a smooth red heat bloom. */
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

    const sx = cw / pitch.length;
    const sy = ch / pitch.width;

    // --- turf with mowing stripes ---------------------------------------
    const stripes = 12;
    for (let i = 0; i < stripes; i++) {
      ctx.fillStyle = i % 2 === 0 ? "#1f6a41" : "#1a5c39";
      ctx.fillRect((i * cw) / stripes, 0, cw / stripes + 1, ch);
    }
    // corner vignette
    const vg = ctx.createRadialGradient(
      cw / 2,
      ch / 2,
      ch * 0.25,
      cw / 2,
      ch / 2,
      cw * 0.72,
    );
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.32)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, cw, ch);

    // --- red heat bloom -------------------------------------------------
    const grid = pitch.heatmaps[team];
    const cellW = cw / pitch.bins_x;
    const cellH = ch / pitch.bins_y;
    ctx.globalCompositeOperation = "lighter";
    for (let gy = 0; gy < pitch.bins_y; gy++) {
      for (let gx = 0; gx < pitch.bins_x; gx++) {
        const v = grid[gy]?.[gx] ?? 0;
        if (v <= 0) continue;
        const px = (gx + 0.5) * cellW;
        const py = (gy + 0.5) * cellH;
        const rad = Math.max(cellW, cellH) * 1.25;
        const a = Math.min(0.9, 0.12 + v * 0.85);
        const g = ctx.createRadialGradient(px, py, 0, px, py, rad);
        g.addColorStop(0, `rgba(255,64,42,${a})`);
        g.addColorStop(0.6, `rgba(255,96,48,${a * 0.5})`);
        g.addColorStop(1, "rgba(255,96,48,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalCompositeOperation = "source-over";

    // --- markings (crisp white) -----------------------------------------
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 1.5;
    const pad = 4;
    const L = cw - pad * 2;
    const W = ch - pad * 2;
    const round = (fn: () => void) => {
      ctx.save();
      ctx.lineJoin = "round";
      fn();
      ctx.restore();
    };

    round(() => ctx.strokeRect(pad, pad, L, W));
    // halfway line + centre circle + spot
    ctx.beginPath();
    ctx.moveTo(cw / 2, pad);
    ctx.lineTo(cw / 2, ch - pad);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cw / 2, ch / 2, 9.15 * sx, 0, Math.PI * 2);
    ctx.stroke();
    dot(ctx, cw / 2, ch / 2, 2);

    const boxD = 16.5 * sx;
    const boxW = 40.32 * sy;
    const goalD = 5.5 * sx;
    const goalW = 18.32 * sy;
    const penDist = 11 * sx;
    const arcR = 9.15 * sx;

    for (const side of [0, 1]) {
      const dir = side === 0 ? 1 : -1;
      const edge = side === 0 ? pad : cw - pad;
      // penalty box
      round(() =>
        ctx.strokeRect(
          side === 0 ? pad : cw - pad - boxD,
          (ch - boxW) / 2,
          boxD,
          boxW,
        ),
      );
      // goal box
      round(() =>
        ctx.strokeRect(
          side === 0 ? pad : cw - pad - goalD,
          (ch - goalW) / 2,
          goalD,
          goalW,
        ),
      );
      // penalty spot + arc (the "D") — only the portion outside the box
      const spotX = edge + dir * penDist;
      dot(ctx, spotX, ch / 2, 2);
      const theta = Math.acos(Math.min(1, (boxD - penDist) / arcR));
      ctx.beginPath();
      if (side === 0) ctx.arc(spotX, ch / 2, arcR, -theta, theta);
      else ctx.arc(spotX, ch / 2, arcR, Math.PI - theta, Math.PI + theta);
      ctx.stroke();
    }
  }, [pitch, team]);

  return <canvas ref={canvasRef} className="w-full rounded-lg" />;
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
