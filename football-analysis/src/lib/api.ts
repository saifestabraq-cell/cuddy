// Typed client for the Python sidecar API.

import type {
  AnalysisJob,
  Category,
  CodingTemplate,
  Descriptor,
  DescriptorGroup,
  MatchEvent,
  PitchData,
  Project,
  TracksData,
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
  getTracks: (videoId: number) => request<TracksData>(`/videos/${videoId}/tracks`),

  // Pitch calibration / heatmaps / auto-tag (Phase 2b)
  calibrate: (videoId: number, imgPoints: number[][], length = 105, width = 68) =>
    request<PitchData>(`/videos/${videoId}/calibrate`, {
      method: "POST",
      body: JSON.stringify({ img_points: imgPoints, length, width }),
    }),
  getPitch: (videoId: number) => request<PitchData>(`/videos/${videoId}/pitch`),
  autotag: (videoId: number) =>
    request<{ created: number }>(`/videos/${videoId}/autotag`, { method: "POST" }),
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
