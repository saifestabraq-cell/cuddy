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

export interface AnalysisJob {
  id: string;
  kind: string;
  status: "pending" | "running" | "done" | "error";
  progress: number;
  message: string;
  result: Record<string, unknown> | null;
  error: string | null;
  meta: Record<string, unknown>;
}
