import { useEffect, useRef, useState } from "react";
import { useStore } from "../store";
import { nearestPlayerAt, trackPosAt } from "../lib/tracks";
import type { StudioShape, StudioTool } from "../lib/types";

// The SVG works in a fixed 16:9 space; the container is `aspect-video` so the
// scale to the video box is uniform (no distortion). Geometry is stored
// normalized [0..1] and mapped into this space at render time.
const W = 1600;
const H = 900;
const STROKE = 5;

interface Props {
  getVideo: () => HTMLVideoElement | null;
  playing: boolean;
  ms: number;
}

type Draft = {
  type: StudioTool;
  geom: [number, number][];
  vertexTracks?: (number | null)[];
} | null;

const TWO_POINT: StudioTool[] = ["arrow", "box", "zone"];
const N_POINT: StudioTool[] = ["path", "shape"];

let shapeSeq = 0;
const newId = () => `s${Date.now().toString(36)}${(shapeSeq++).toString(36)}`;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Telestration drawing + rendering surface, overlaid on the video. */
export default function StudioLayer({ getVideo, playing, ms }: Props) {
  const shapes = useStore((s) => s.studioShapes);
  const tool = useStore((s) => s.studioTool);
  const color = useStore((s) => s.studioColor);
  const selectedId = useStore((s) => s.selectedShapeId);
  const pinArm = useStore((s) => s.studioPinArm);
  const tracks = useStore((s) => s.tracks);
  const addShape = useStore((s) => s.addShape);
  const updateShape = useStore((s) => s.updateShape);
  const selectShape = useStore((s) => s.selectShape);
  const deleteShape = useStore((s) => s.deleteShape);
  const pinShapeToTrack = useStore((s) => s.pinShapeToTrack);
  const armPin = useStore((s) => s.armPin);
  const undoStudio = useStore((s) => s.undoStudio);
  const pushStudioHistory = useStore((s) => s.pushStudioHistory);

  const svgRef = useRef<SVGSVGElement>(null);
  const [draft, setDraft] = useState<Draft>(null);
  // Smooth follow: while playing, drive the clock off the video via rAF; the
  // timeupdate-based `ms` prop is too coarse for graphics that track a player.
  const [liveMs, setLiveMs] = useState(ms);
  useEffect(() => {
    if (!playing) setLiveMs(ms);
  }, [ms, playing]);
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const loop = () => {
      const v = getVideo();
      if (v) setLiveMs(v.currentTime * 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, getVideo]);
  const curMs = playing ? liveMs : ms;

  // Delete the selected shape with Delete/Backspace (unless typing in a field).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA") return;
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        deleteShape(selectedId);
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        setDraft(null);
        undoStudio();
      }
      if (e.key === "Escape") {
        setDraft(null);
        armPin(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, deleteShape, armPin, undoStudio]);

  const drawing = tool !== null;
  const bgInteractive = drawing || pinArm;

  const toNorm = (clientX: number, clientY: number): [number, number] => {
    const rect = svgRef.current!.getBoundingClientRect();
    return [
      clamp01((clientX - rect.left) / rect.width),
      clamp01((clientY - rect.top) / rect.height),
    ];
  };

  const commitShape = (
    type: StudioTool,
    geom: [number, number][],
    label?: string,
    vertexTracks?: (number | null)[],
  ) => {
    addShape({ id: newId(), type, color, geom, label, vertexTracks });
  };

  const handlePin = (n: [number, number]) => {
    if (!selectedId || !tracks) {
      armPin(false);
      return;
    }
    const hit = nearestPlayerAt(tracks, curMs, n[0], n[1]);
    if (hit) pinShapeToTrack(selectedId, hit.id, hit.pos);
    else armPin(false);
  };

  // --- background interactions (draw / place / pin) ---
  const onBgMouseDown = (e: React.MouseEvent) => {
    if (!bgInteractive) return;
    e.preventDefault();
    const n = toNorm(e.clientX, e.clientY);
    if (pinArm) {
      handlePin(n);
      return;
    }
    if (!tool) return;
    if (tool === "highlight") {
      commitShape("highlight", [n]);
      return;
    }
    if (tool === "text") {
      const label = window.prompt("Label text");
      if (label && label.trim()) commitShape("text", [n], label.trim());
      return;
    }
    if (TWO_POINT.includes(tool)) {
      setDraft({ type: tool, geom: [n, n] });
      const move = (ev: MouseEvent) =>
        setDraft((d) => (d ? { ...d, geom: [d.geom[0], toNorm(ev.clientX, ev.clientY)] } : d));
      const up = (ev: MouseEvent) => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
        const end = toNorm(ev.clientX, ev.clientY);
        const [sx, sy] = n;
        const dist = Math.hypot(end[0] - sx, end[1] - sy);
        setDraft(null);
        if (dist > 0.012) commitShape(tool, [n, end]);
      };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    }
  };

  const onBgClick = (e: React.MouseEvent) => {
    if (!tool) return;
    const n = toNorm(e.clientX, e.clientY);
    if (tool === "link") {
      // Each click adds a vertex snapped to (and pinned to) the nearest player,
      // so the shape connects players and deforms as they move.
      const hit = tracks ? nearestPlayerAt(tracks, curMs, n[0], n[1]) : null;
      const pos = hit ? hit.pos : n;
      const tid = hit ? hit.id : null;
      setDraft((d) =>
        d && d.type === "link"
          ? { ...d, geom: [...d.geom, pos], vertexTracks: [...(d.vertexTracks ?? []), tid] }
          : { type: "link", geom: [pos], vertexTracks: [tid] },
      );
      return;
    }
    if (!N_POINT.includes(tool)) return;
    setDraft((d) =>
      d && d.type === tool ? { ...d, geom: [...d.geom, n] } : { type: tool, geom: [n] },
    );
  };

  const onBgDoubleClick = () => {
    setDraft((d) => {
      if (!d) return null;
      if (d.type === "link" && d.geom.length >= 3) {
        // drop the duplicate final point from the finishing double-click
        const geom = d.geom.slice(0, -1);
        const vt = (d.vertexTracks ?? []).slice(0, geom.length);
        if (geom.length >= 2) commitShape("link", geom, undefined, vt);
      } else if (N_POINT.includes(d.type) && d.geom.length >= 2) {
        const geom = d.geom.slice(0, -1);
        if (geom.length >= 2) commitShape(d.type, geom);
      }
      return null;
    });
  };

  // --- move a selected shape by dragging it ---
  const startMove = (e: React.MouseEvent, shape: StudioShape) => {
    e.stopPropagation();
    selectShape(shape.id);
    if (drawing || pinArm) return; // don't move while drawing/pinning
    pushStudioHistory();
    const start = toNorm(e.clientX, e.clientY);
    const orig = shape.geom;
    const move = (ev: MouseEvent) => {
      const p = toNorm(ev.clientX, ev.clientY);
      const dx = p[0] - start[0];
      const dy = p[1] - start[1];
      updateShape(shape.id, {
        geom: orig.map(([x, y]) => [clamp01(x + dx), clamp01(y + dy)] as [number, number]),
      });
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none", cursor: bgInteractive ? "crosshair" : "default" }}
    >
      {/* Background capture layer — active only when drawing or pinning. */}
      <rect
        x={0}
        y={0}
        width={W}
        height={H}
        fill="transparent"
        style={{ pointerEvents: bgInteractive ? "auto" : "none" }}
        onMouseDown={onBgMouseDown}
        onClick={onBgClick}
        onDoubleClick={onBgDoubleClick}
      />

      {shapes.map((shape) => {
        const geom = resolveGeom(shape, curMs, tracks);
        if (!geom) return null; // pinned track dropped out — hide
        return (
          <ShapeView
            key={shape.id}
            shape={shape}
            geom={geom}
            selected={shape.id === selectedId}
            onMouseDown={(e) => startMove(e, shape)}
          />
        );
      })}

      {draft && <ShapeView shape={{ ...DRAFT_META, type: draft.type, color }} geom={draft.geom} draft />}
    </svg>
  );
}

const DRAFT_META = { id: "draft", geom: [] as [number, number][] };

/** Live geometry: per-vertex player tracking, else rigid single-pin follow. */
function resolveGeom(
  shape: StudioShape,
  ms: number,
  tracks: ReturnType<typeof useStore.getState>["tracks"],
): [number, number][] | null {
  // Per-vertex: each point follows its own player (shape deforms).
  if (shape.vertexTracks && tracks) {
    return shape.geom.map(([x, y], i) => {
      const tid = shape.vertexTracks![i];
      if (tid == null) return [x, y] as [number, number];
      const cur = trackPosAt(tracks, tid, ms);
      return cur ?? ([x, y] as [number, number]); // hold last authored if lost
    });
  }
  // Rigid: whole shape translates with one pinned player.
  if (shape.pinnedTrackId != null && shape.pinPos && tracks) {
    const cur = trackPosAt(tracks, shape.pinnedTrackId, ms);
    if (!cur) return null;
    const dx = cur[0] - shape.pinPos[0];
    const dy = cur[1] - shape.pinPos[1];
    return shape.geom.map(([x, y]) => [x + dx, y + dy]);
  }
  return shape.geom;
}

const px = (p: [number, number]): [number, number] => [p[0] * W, p[1] * H];

function ShapeView({
  shape,
  geom,
  selected,
  draft,
  onMouseDown,
}: {
  shape: { id: string; type: StudioTool; color: string; label?: string; pinnedTrackId?: number };
  geom: [number, number][];
  selected?: boolean;
  draft?: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
}) {
  const c = shape.color;
  const fill = `${c}33`;
  const pts = geom.map(px);
  const interactive = !draft;
  const wrap = (children: React.ReactNode) => (
    <g
      style={{ pointerEvents: interactive ? "auto" : "none", cursor: interactive ? "move" : "inherit" }}
      onMouseDown={onMouseDown}
    >
      {children}
      {selected && pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={7} fill="#fff" stroke={c} strokeWidth={2} />
      ))}
      {shape.pinnedTrackId != null && pts[0] && (
        <circle cx={pts[0][0]} cy={pts[0][1]} r={4} fill={c} stroke="#0A0C12" strokeWidth={1.5} />
      )}
    </g>
  );

  if (shape.type === "arrow" && pts.length >= 2) {
    const [a, b] = [pts[0], pts[pts.length - 1]];
    return wrap(
      <>
        <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={c} strokeWidth={STROKE} strokeLinecap="round" />
        <polygon points={arrowHead(a[0], a[1], b[0], b[1], 26)} fill={c} />
      </>,
    );
  }
  if (shape.type === "path" && pts.length >= 2) {
    const last = pts[pts.length - 1];
    const prev = pts[pts.length - 2];
    return wrap(
      <>
        <polyline
          points={pts.map((p) => p.join(",")).join(" ")}
          fill="none"
          stroke={c}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polygon points={arrowHead(prev[0], prev[1], last[0], last[1], 24)} fill={c} />
      </>,
    );
  }
  if ((shape.type === "box" || shape.type === "zone") && pts.length >= 2) {
    const x = Math.min(pts[0][0], pts[1][0]);
    const y = Math.min(pts[0][1], pts[1][1]);
    const w = Math.abs(pts[1][0] - pts[0][0]);
    const h = Math.abs(pts[1][1] - pts[0][1]);
    return wrap(
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        fill={shape.type === "zone" ? fill : "transparent"}
        stroke={c}
        strokeWidth={STROKE}
        strokeDasharray={shape.type === "box" ? "12 8" : undefined}
      />,
    );
  }
  if (shape.type === "shape" && pts.length >= 2) {
    return wrap(
      <polygon
        points={pts.map((p) => p.join(",")).join(" ")}
        fill={fill}
        stroke={c}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />,
    );
  }
  if (shape.type === "link" && pts.length >= 1) {
    // Players connected by lines; ≥3 closes into a filled shape. Vertices show
    // a ring so it reads as "these players", and it deforms as they move.
    const closed = pts.length >= 3;
    return wrap(
      <>
        {closed ? (
          <polygon
            points={pts.map((p) => p.join(",")).join(" ")}
            fill={fill}
            stroke={c}
            strokeWidth={STROKE}
            strokeLinejoin="round"
          />
        ) : (
          <polyline
            points={pts.map((p) => p.join(",")).join(" ")}
            fill="none"
            stroke={c}
            strokeWidth={STROKE}
            strokeLinecap="round"
          />
        )}
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={9} fill={`${c}55`} stroke={c} strokeWidth={2.5} />
        ))}
      </>,
    );
  }
  if (shape.type === "highlight" && pts[0]) {
    const [x, y] = pts[0];
    return wrap(
      <>
        <ellipse cx={x} cy={y} rx={52} ry={24} fill={fill} stroke={c} strokeWidth={STROKE} />
        <ellipse cx={x} cy={y} rx={30} ry={14} fill="none" stroke={c} strokeWidth={2} opacity={0.6} />
      </>,
    );
  }
  if (shape.type === "text" && pts[0]) {
    const [x, y] = pts[0];
    return wrap(
      <text
        x={x}
        y={y}
        fontSize={34}
        fontWeight={700}
        fill={c}
        stroke="#0A0C12"
        strokeWidth={5}
        paintOrder="stroke"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      >
        {shape.label ?? ""}
      </text>,
    );
  }
  return null;
}

function arrowHead(x1: number, y1: number, x2: number, y2: number, size: number): string {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const a1 = angle + Math.PI - 0.42;
  const a2 = angle + Math.PI + 0.42;
  return [
    `${x2},${y2}`,
    `${x2 + size * Math.cos(a1)},${y2 + size * Math.sin(a1)}`,
    `${x2 + size * Math.cos(a2)},${y2 + size * Math.sin(a2)}`,
  ].join(" ");
}
