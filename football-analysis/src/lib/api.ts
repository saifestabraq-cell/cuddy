// Typed client for the Python sidecar API.

import type {
  AnalysisJob,
  Analytics,
  Category,
  CodingTemplate,
  Descriptor,
  DescriptorGroup,
  EventRelation,
  EventRevision,
  EvidencePackage,
  Finding,
  MatchData,
  MatchEvent,
  MatchFixtureSummary,
  PitchData,
  PlayerHeatmap,
  PlayerStatsDoc,
  Project,
  QueryResult,
  SegmentMap,
  SettingsStatus,
  ShotsData,
  StudioDoc,
  TracksData,
  ValidationResult,
  Video,
} from "./types";

export const API_BASE = "http://127.0.0.1:8765";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} — ${text}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const streamUrl = (videoId: number) =>
  `${API_BASE}/videos/${videoId}/stream`;

export const exportUrl = (videoId: number, fmt: "xml" | "csv") =>
  `${API_BASE}/export/videos/${videoId}/${fmt}`;

export const api = {
  health: () => request<{ status: string; version: string }>("/health"),

  // Projects
  listProjects: () => request<Project[]>("/projects"),
  createProject: (name: string, description = "") =>
    request<Project>("/projects", {
      method: "POST",
      body: JSON.stringify({ name, description }),
    }),
  deleteProject: (id: number) =>
    request<void>(`/projects/${id}`, { method: "DELETE" }),

  // Videos
  listVideos: (projectId: number) =>
    request<Video[]>(`/videos?project_id=${projectId}`),
  registerVideo: (projectId: number, name: string, path: string) =>
    request<Video>("/videos", {
      method: "POST",
      body: JSON.stringify({ project_id: projectId, name, path }),
    }),
  updateVideoMeta: (id: number, meta: Partial<Video>) =>
    request<Video>(`/videos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(meta),
    }),
  videoStatus: (id: number) =>
    request<{ exists: boolean; path: string }>(`/videos/${id}/status`),
  relinkVideo: (id: number, path: string) =>
    request<Video>(`/videos/${id}/relink`, {
      method: "POST",
      body: JSON.stringify({ path }),
    }),
  deleteVideo: (id: number) =>
    request<void>(`/videos/${id}`, { method: "DELETE" }),

  // Categories
  listCategories: (projectId: number) =>
    request<Category[]>(`/categories?project_id=${projectId}`),
  createCategory: (input: Partial<Category> & { project_id: number; name: string }) =>
    request<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  deleteCategory: (id: number) =>
    request<void>(`/categories/${id}`, { method: "DELETE" }),

  // Events
  listEvents: (videoId: number, source?: "manual" | "ai") =>
    request<MatchEvent[]>(
      `/events?video_id=${videoId}${source ? `&source=${source}` : ""}`,
    ),
  createEvent: (input: {
    video_id: number;
    category_id?: number | null;
    label?: string;
    start_ms: number;
    end_ms: number;
    descriptors?: string[];
    source?: "manual" | "ai";
    confidence?: number | null;
  }) =>
    request<MatchEvent>("/events", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateEvent: (id: number, patch: Partial<MatchEvent>) =>
    request<MatchEvent>(`/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    }),
  deleteEvent: (id: number) =>
    request<void>(`/events/${id}`, { method: "DELETE" }),

  // Review actions on AI suggestions (same canonical Event model)
  acceptEvent: (id: number) =>
    request<MatchEvent>(`/events/${id}/accept`, { method: "POST" }),
  rejectEvent: (id: number) =>
    request<void>(`/events/${id}/reject`, { method: "POST" }),

  // Provenance trail (before/after values per edit), newest first
  listRevisions: (id: number) =>
    request<EventRevision[]>(`/events/${id}/revisions`),

  // Event relations (sequences)
  listRelations: (eventId: number) =>
    request<EventRelation[]>(`/events/${eventId}/relations`),
  createRelation: (
    fromEventId: number,
    toEventId: number,
    relationType: string,
  ) =>
    request<EventRelation>(`/events/relations`, {
      method: "POST",
      body: JSON.stringify({
        from_event_id: fromEventId,
        to_event_id: toEventId,
        relation_type: relationType,
      }),
    }),
  deleteRelation: (relationId: number) =>
    request<void>(`/events/relations/${relationId}`, { method: "DELETE" }),

  // Findings (analyst observations linked to evidence)
  listFindings: (videoId: number) =>
    request<Finding[]>(`/videos/${videoId}/findings`),
  createFinding: (
    videoId: number,
    input: {
      title: string;
      description?: string;
      event_ids?: number[];
      start_ms?: number | null;
      end_ms?: number | null;
    },
  ) =>
    request<Finding>(`/videos/${videoId}/findings`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  deleteFinding: (id: number) =>
    request<void>(`/findings/${id}`, { method: "DELETE" }),

  // Descriptors
  listDescriptorGroups: (projectId: number) =>
    request<DescriptorGroup[]>(`/descriptor-groups?project_id=${projectId}`),
  createDescriptorGroup: (projectId: number, name: string, sortOrder = 0) =>
    request<DescriptorGroup>("/descriptor-groups", {
      method: "POST",
      body: JSON.stringify({ project_id: projectId, name, sort_order: sortOrder }),
    }),
  deleteDescriptorGroup: (id: number) =>
    request<void>(`/descriptor-groups/${id}`, { method: "DELETE" }),
  createDescriptor: (groupId: number, label: string, color?: string, sortOrder = 0) =>
    request<Descriptor>("/descriptors", {
      method: "POST",
      body: JSON.stringify({ group_id: groupId, label, color, sort_order: sortOrder }),
    }),
  deleteDescriptor: (id: number) =>
    request<void>(`/descriptors/${id}`, { method: "DELETE" }),

  // Templates
  getTemplate: (projectId: number) =>
    request<CodingTemplate>(`/projects/${projectId}/coding-template`),
  applyTemplate: (projectId: number, template: CodingTemplate) =>
    request<{ applied: boolean }>(`/projects/${projectId}/apply-template`, {
      method: "POST",
      body: JSON.stringify(template),
    }),

  // Analysis (Phase 2)
  startAnalysis: (videoId: number, targetFps = 5, model = "yolov8n.pt") =>
    request<AnalysisJob>(
      `/videos/${videoId}/analyze?target_fps=${targetFps}&model=${model}`,
      { method: "POST" },
    ),
  getJob: (jobId: string) => request<AnalysisJob>(`/jobs/${jobId}`),
  tracksExist: (videoId: number) =>
    request<{ exists: boolean }>(`/videos/${videoId}/tracks/exists`),
  pickVideoFile: () =>
    request<{ path: string | null }>("/videos/pick", { method: "POST" }),
  getTracks: (videoId: number) => request<TracksData>(`/videos/${videoId}/tracks`),
  getSegments: (videoId: number) =>
    request<SegmentMap>(`/videos/${videoId}/segments`),

  // Studio telestration graphics (persisted per video)
  getStudio: (videoId: number) => request<StudioDoc>(`/videos/${videoId}/studio`),
  putStudio: (videoId: number, doc: StudioDoc) =>
    request<StudioDoc>(`/videos/${videoId}/studio`, {
      method: "PUT",
      body: JSON.stringify(doc),
    }),

  // Pitch calibration / heatmaps / auto-tag (Phase 2b)
  calibrate: (videoId: number, imgPoints: number[][], length = 105, width = 68) =>
    request<PitchData>(`/videos/${videoId}/calibrate`, {
      method: "POST",
      body: JSON.stringify({ img_points: imgPoints, length, width }),
    }),
  getPitch: (videoId: number) => request<PitchData>(`/videos/${videoId}/pitch`),
  autotag: (videoId: number) =>
    request<{ created: number }>(`/videos/${videoId}/autotag`, { method: "POST" }),

  // Possession & passing analytics (Phase 3a)
  computeAnalytics: (videoId: number) =>
    request<Analytics>(`/videos/${videoId}/analytics`, { method: "POST" }),
  getAnalytics: (videoId: number) => request<Analytics>(`/videos/${videoId}/analytics`),
  tagTurnovers: (videoId: number) =>
    request<{ created: number }>(`/videos/${videoId}/tag-turnovers`, { method: "POST" }),

  // Shots & xG (Phase 3b)
  computeShots: (videoId: number) =>
    request<ShotsData>(`/videos/${videoId}/shots`, { method: "POST" }),
  getShots: (videoId: number) => request<ShotsData>(`/videos/${videoId}/shots`),
  tagShots: (videoId: number) =>
    request<{ created: number }>(`/videos/${videoId}/tag-shots`, { method: "POST" }),

  // Natural-language query (Phase 3c)
  ask: (videoId: number, question: string) =>
    request<{ answer: string; question: string }>(`/videos/${videoId}/ask`, {
      method: "POST",
      body: JSON.stringify({ question }),
    }),
  query: (videoId: number, question: string) =>
    request<QueryResult>(`/videos/${videoId}/query`, {
      method: "POST",
      body: JSON.stringify({ question }),
    }),
  // Structured, evidence-grounded query: deterministic clips/metrics first,
  // optional LLM explanation. Works with no AI key.
  investigate: (videoId: number, question: string) =>
    request<EvidencePackage>(`/videos/${videoId}/investigate`, {
      method: "POST",
      body: JSON.stringify({ question }),
    }),

  // Validation harness (Phase 1): score AI events vs the manual reference
  getValidation: (videoId: number) =>
    request<ValidationResult>(`/videos/${videoId}/validation`),

  // Real match data (API-Football)
  getMatchData: (videoId: number) =>
    request<MatchData | null>(`/videos/${videoId}/match-data`),
  fetchMatchData: (videoId: number, description: string) =>
    request<MatchData>(`/videos/${videoId}/match-data`, {
      method: "POST",
      body: JSON.stringify({ question: description }),
    }),
  fetchMatchDataById: (videoId: number, fixtureId: number) =>
    request<MatchData>(`/videos/${videoId}/match-data`, {
      method: "POST",
      body: JSON.stringify({ fixture_id: fixtureId }),
    }),
  searchMatches: (videoId: number, query: string) =>
    request<MatchFixtureSummary[]>(`/videos/${videoId}/match-search`, {
      method: "POST",
      body: JSON.stringify({ query }),
    }),

  // Per-player statistics (API-Football)
  getPlayerStats: (videoId: number) =>
    request<PlayerStatsDoc | null>(`/videos/${videoId}/player-stats`),
  fetchPlayerStats: (videoId: number) =>
    request<PlayerStatsDoc>(`/videos/${videoId}/player-stats`, { method: "POST" }),

  // Per-player heatmap (from CV tracks) + player↔track assignments
  getPlayerHeatmap: (videoId: number, trackId: number) =>
    request<PlayerHeatmap>(`/videos/${videoId}/player-heatmap?track_id=${trackId}`),
  getAssignments: (videoId: number) =>
    request<{ map: Record<string, number> }>(`/videos/${videoId}/assignments`),
  putAssignments: (videoId: number, map: Record<string, number>) =>
    request<{ map: Record<string, number> }>(`/videos/${videoId}/assignments`, {
      method: "PUT",
      body: JSON.stringify({ map }),
    }),

  // User settings (API keys / model)
  getSettings: () => request<SettingsStatus>("/settings"),
  saveSettings: (input: {
    anthropic_api_key?: string;
    groq_api_key?: string;
    provider?: "groq" | "anthropic";
    model?: string;
    apifootball_key?: string;
  }) =>
    request<SettingsStatus>("/settings", {
      method: "POST",
      body: JSON.stringify(input),
    }),
};

/** Download a selection (playlist) export as a file via a Blob. */
export async function downloadSelection(
  videoId: number,
  eventIds: number[],
  fmt: "xml" | "csv",
  filename: string,
): Promise<void> {
  const res = await fetch(`${API_BASE}/export/selection/${fmt}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ video_id: videoId, event_ids: eventIds }),
  });
  if (!res.ok) throw new Error(`Export failed: ${res.status}`);
  const blob = await res.blob();
  triggerDownload(blob, filename);
}

/** Download arbitrary text as a file (used for template JSON export). */
export function downloadText(text: string, filename: string, type = "application/json") {
  triggerDownload(new Blob([text], { type }), filename);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
