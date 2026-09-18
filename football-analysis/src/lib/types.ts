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
  detector: string | null;
  analysis_run_id: number | null;
  created_at: string;
  updated_at: string;
}

/** One recorded change to an event (before/after), for the provenance trail. */
export interface EventRevision {
  id: number;
  event_id: number;
  previous_values: Record<string, unknown>;
  new_values: Record<string, unknown>;
  actor_type: "manual" | "system";
  reason: string;
  created_at: string;
}

export type EventRelationType =
  | "follows"
  | "causes"
  | "assist_for"
  | "shot_from"
  | "turnover_to"
  | "possession_start"
  | "possession_end"
  | "same_sequence"
  | "related_clip";

/** A typed link between two events (powers sequence queries). */
export interface EventRelation {
  id: number;
  from_event_id: number;
  to_event_id: number;
  relation_type: EventRelationType | string;
  created_at: string;
}

/** An analyst observation linked to its supporting events + time range. */
export interface Finding {
  id: number;
  video_id: number;
  title: string;
  description: string;
  event_ids: number[];
  start_ms: number | null;
  end_ms: number | null;
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

// --- Studio: telestration graphics drawn over the video ---

export type StudioTool =
  | "arrow"
  | "highlight"
  | "zone"
  | "path"
  | "shape"
  | "box"
  | "text"
  | "link";

/**
 * A telestration graphic. `geom` is a list of normalized [0..1] points over the
 * video box.
 *
 * - When `pinnedTrackId`/`pinPos` are set, the WHOLE shape translates each frame
 *   by that tracked player's displacement (rigid follow).
 * - When `vertexTracks` is set (one entry per geom point), each vertex follows
 *   its own tracked player, so a shape connecting several players deforms as
 *   they move relative to each other. A null entry keeps that vertex fixed.
 */
export interface StudioShape {
  id: string;
  type: StudioTool;
  color: string;
  geom: [number, number][];
  label?: string;
  pinnedTrackId?: number;
  pinPos?: [number, number];
  vertexTracks?: (number | null)[];
}

export interface StudioDoc {
  shapes: StudioShape[];
}

// --- Per-player statistics (API-Football, real named players) ---

export interface PlayerStat {
  id: number | null;
  name: string | null;
  photo?: string | null;
  number?: number | null;
  position?: string | null;
  minutes?: number | null;
  rating?: number | null;
  captain?: boolean;
  goals: number;
  assists: number;
  shots: number;
  shots_on: number;
  passes: number;
  pass_accuracy?: string | number | null;
  key_passes: number;
  tackles: number;
  interceptions: number;
  duels_won: number;
  duels_total: number;
  dribbles: number;
  yellow: number;
  red: number;
}

export interface PlayerStatsDoc {
  fixture_id: number;
  by_team: Record<string, { name: string | null; players: PlayerStat[] }>;
}

/** Per-player heatmap from CV tracks (pitch space if calibrated, else image). */
export interface PlayerHeatmap {
  track_id: number;
  space: "pitch" | "image";
  length: number;
  width: number;
  bins_x: number;
  bins_y: number;
  grid: number[][];
  n_points: number;
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

// --- Structured, evidence-grounded query (deterministic engine) ---

export type QueryIntent =
  | "metric_comparison"
  | "event_lookup"
  | "event_count"
  | "event_filter"
  | "sequence_lookup"
  | "shot_analysis"
  | "possession_analysis"
  | "pass_analysis"
  | "turnover_analysis"
  | "zone_analysis"
  | "player_analysis"
  | "time_range_analysis"
  | "clip_lookup";

export interface StructuredQuery {
  intent: QueryIntent;
  team: "home" | "away" | "both" | null;
  period: number | null;
  zones: string[];
  event_types: string[];
  source: EventSource | null;
  reviewed: boolean | null;
  time_range_ms: [number, number] | null;
  metric: string | null;
  wants_clips: boolean;
  limit: number;
}

export interface EvidenceMetric {
  label: string;
  value: number | string;
  /** e.g. cuddy_video_analysis | heuristic | approximate_cv | official_match_data */
  source: string;
}

export interface EvidenceClip {
  event_id: number;
  start_ms: number;
  end_ms: number;
  label: string;
  reason: string;
}

/** Deterministic evidence package; `explanation` is optional LLM prose over it. */
export interface EvidencePackage {
  question: string;
  query: StructuredQuery;
  summary: string;
  metrics: EvidenceMetric[];
  events: number[];
  clips: EvidenceClip[];
  warnings: string[];
  explanation: string | null;
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
  // Wall-clock ms since the run started (for an ETA estimate).
  elapsed_ms?: number;
}

export interface SettingsStatus {
  anthropic_api_key_set: boolean;
  groq_api_key_set: boolean;
  provider: "groq" | "anthropic";
  model: string;
  key_source: "env" | "stored" | "none";
  apifootball_key_set: boolean;
}

export interface MatchTeam {
  id: number | null;
  name: string | null;
  logo: string | null;
  formation: string | null;
  start_xi: string[];
  stats: Record<string, string | number | null>;
}

export interface MatchDataEvent {
  minute: number | null;
  team: string | null;
  player: string | null;
  type: string | null;
  detail: string | null;
}

/** A fixture card in the browser (before loading full stats). */
export interface MatchFixtureSummary {
  fixture_id: number;
  date: string | null;
  status: string | null;
  competition: string | null;
  season: number | null;
  home: string | null;
  away: string | null;
  home_logo: string | null;
  away_logo: string | null;
  score: string | null;
}

/** Real match data from API-Football (validated, not CV/LLM-derived). */
export interface MatchData {
  query: string;
  fixture_id: number | null;
  competition: string | null;
  date: string | null;
  score: string | null;
  home: MatchTeam;
  away: MatchTeam;
  events: MatchDataEvent[];
}
