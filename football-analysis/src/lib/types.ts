// Shared types mirroring the backend models.

export interface Project {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface Video {
  id: number;
  project_id: number;
  name: string;
  path: string;
  duration_ms: number | null;
  fps: number | null;
  width: number | null;
  height: number | null;
  created_at: string;
}

export interface Category {
  id: number;
  project_id: number;
  name: string;
  color: string;
  hotkey: string | null;
  lead_ms: number;
  lag_ms: number;
  sort_order: number;
}

export interface Descriptor {
  id: number;
  group_id: number;
  label: string;
  color: string | null;
  sort_order: number;
}

export interface DescriptorGroup {
  id: number;
  project_id: number;
  name: string;
  sort_order: number;
  descriptors: Descriptor[];
}

export type EventSource = "manual" | "ai";

export interface MatchEvent {
  id: number;
  video_id: number;
  category_id: number | null;
  label: string;
  start_ms: number;
  end_ms: number;
  notes: string;
  descriptors: string[];
  source: EventSource;
  confidence: number | null;
  reviewed: boolean;
  created_at: string;
}

// Portable coding template (categories + descriptor groups).
export interface CodingTemplate {
  name: string;
  categories: {
    name: string;
    color: string;
    hotkey: string | null;
    lead_ms: number;
    lag_ms: number;
  }[];
  descriptor_groups: { name: string; descriptors: string[] }[];
}

export interface Filter {
  categoryIds: number[];
  descriptors: string[];
  source: "all" | "manual" | "ai";
  text: string;
}

// --- Phase 2: CV analysis ---

export interface TrackDet {
  id: number;
  cls: number; // COCO: 0 person, 32 sports ball
  team: number; // 0/1 for players, -1 ball/unclustered
  conf: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface TrackFrame {
  t_ms: number;
  dets: TrackDet[];
}

export interface TracksData {
  video: string;
  src_fps: number;
  stride: number;
  width: number;
  height: number;
  target_fps: number;
  n_tracks: number;
  teams: number;
  frames: TrackFrame[];
}

export interface PitchData {
  length: number;
  width: number;
  bins_x: number;
  bins_y: number;
  heatmaps: { "0": number[][]; "1": number[][] };
  team_distance_m: { "0": number; "1": number };
  track_distance_m: Record<string, number>;
  ball_positions: number[][]; // [t_ms, X, Y]
  img_points: number[][];
}

export interface PassEdge {
  team: number;
  from: number;
  to: number;
  count: number;
}

export interface Analytics {
  possession_pct: { "0": number; "1": number };
  held_frames: { "0": number; "1": number };
  passes: { "0": number; "1": number };
  turnovers: number;
  pass_edges: PassEdge[];
  pass_events: { t_ms: number; team: number; from: number; to: number }[];
  turnover_events: { t_ms: number; from_team: number; to_team: number }[];
  n_touches: number;
}

export interface Shot {
  t_ms: number;
  X: number;
  Y: number;
  goal: "left" | "right";
  team: number;
  distance_m: number;
  angle_rad: number;
  xg: number;
}

export interface ShotsData {
  shots: Shot[];
  team_xg: { "0": number; "1": number };
  team_shots: { "0": number; "1": number };
  length: number;
  width: number;
}

export interface ValidationResult {
  video_id: number;
  events: {
    reference: number;
    predicted: number;
    tp: number;
    fp: number;
    fn: number;
    precision: number;
    recall: number;
    f1: number;
    boundary_error_ms: number;
    boundary_adjustments: number;
    corrections_required: number;
  };
  xg: { n: number; goals: number; sum_xg: number; brier: number } | null;
  report: string;
}

export interface AnalysisJob {
  id: string;
  kind: string;
  status: "pending" | "running" | "done" | "error";
  progress: number;
  message: string;
  result: Record<string, unknown> | null;
  error: string | null;
  meta: Record<string, unknown>;
  // Staged pipeline (durable): current stage + completed set + full ordered list.
  stage?: string;
  completed_stages?: string[];
  stages?: string[];
}
