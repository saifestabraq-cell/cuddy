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
  player_track_ids: number[];
  reviewed: boolean;
  // Pitch position (metres) for the interactive-pitch spatial filter.
  // coord_source: "cv" = approximate (from the tracked ball), "manual" =
  // analyst-placed (authoritative), null = unlocated.
  pitch_x: number | null;
  pitch_y: number | null;
  coord_source: "cv" | "manual" | null;
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
  // Canonical pitch zones (thirds + channels) toggled from the interactive
  // pitch. Matching is per-dimension: a selected third AND a selected channel
  // both constrain; empty = no spatial filter.
  zones: string[];
  // Filter to events linked to this tracked player (player_track_ids); null =
  // no player filter. Set by clicking a player on the interactive pitch or in
  // the Player inspector.
  playerTrackId: number | null;
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

export interface PlayerProfile {
  track_id: number;
  team: number;
  samples: number;
  avg_confidence: number;
  visibility_fraction: number;
  tracking_start_ms: number;
  tracking_end_ms: number;
  duration_ms: number;
  distance_m: number | null;
  avg_speed_mps: number | null;
  passes_made: number;
  passes_received: number;
  latest: {
    t_ms: number;
    team: number;
    conf: number;
    x: number;
    y: number;
    w: number;
    h: number;
  };
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

export interface Segment {
  start_ms: number;
  end_ms: number;
  class: string; // "main" | "other"
  confidence: number | null;
}

export interface SegmentMap {
  placeholder: boolean;
  segments: Segment[];
  summary?: {
    segments: number;
    main_segments: number;
    main_ms: number;
    total_ms: number;
    main_fraction: number;
  };
}

export interface QueryClip {
  event_id: number;
  start_ms: number;
  end_ms: number;
  label: string;
  reason: string;
}

export interface QueryResult {
  summary: string;
  clips: QueryClip[];
  question: string;
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
  status: "pending" | "running" | "done" | "error" | "cancelled";
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
