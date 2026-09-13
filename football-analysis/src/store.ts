// Central app state (Zustand). Keeps the workspace — current project, video,
// categories, descriptors, events, filtering and playlist selection — in sync
// with the Python sidecar.

import { useMemo } from "react";
import { create } from "zustand";
import { api } from "./lib/api";
import type {
  AnalysisJob,
  Analytics,
  Category,
  CodingTemplate,
  DescriptorGroup,
  Filter,
  MatchEvent,
  PitchData,
  Project,
  ShotsData,
  TracksData,
  Video,
} from "./lib/types";

/** Pure filter — kept out of the store so selectors stay reference-stable. */
export function applyFilter(events: MatchEvent[], filter: Filter): MatchEvent[] {
  const text = filter.text.trim().toLowerCase();
  return events.filter((e) => {
    if (filter.source !== "all" && e.source !== filter.source) return false;
    if (
      filter.categoryIds.length &&
      (!e.category_id || !filter.categoryIds.includes(e.category_id))
    )
      return false;
    if (
      filter.descriptors.length &&
      !filter.descriptors.some((d) => e.descriptors.includes(d))
    )
      return false;
    if (text) {
      const hay = `${e.label} ${e.notes} ${e.descriptors.join(" ")}`.toLowerCase();
      if (!hay.includes(text)) return false;
    }
    return true;
  });
}

type Health = "checking" | "online" | "offline";

const EMPTY_FILTER: Filter = {
  categoryIds: [],
  descriptors: [],
  source: "all",
  text: "",
};

interface AppState {
  health: Health;
  projects: Project[];
  categories: Category[];
  descriptorGroups: DescriptorGroup[];
  videos: Video[];
  events: MatchEvent[];

  currentProjectId: number | null;
  currentVideoId: number | null;
  selectedEventId: number | null;

  filter: Filter;
  playlist: number[]; // selected event ids for the highlight reel

  // Phase 2: CV analysis
  analysisJob: AnalysisJob | null;
  tracks: TracksData | null;
  overlay: boolean;

  // Phase 2b: pitch calibration
  calibrationMode: boolean;
  calibrationPoints: number[][];
  pitch: PitchData | null;

  // Phase 3a: possession & passing
  analytics: Analytics | null;

  // Phase 3b: shots & xG
  shots: ShotsData | null;

  // derived getters (return existing references, safe in selectors)
  currentProject: () => Project | undefined;
  currentVideo: () => Video | undefined;
  selectedEvent: () => MatchEvent | undefined;

  checkHealth: () => Promise<void>;
  loadProjects: () => Promise<void>;
  addProject: (name: string) => Promise<void>;
  selectProject: (id: number) => Promise<void>;

  addCategory: (name: string, color: string, hotkey?: string) => Promise<void>;
  removeCategory: (id: number) => Promise<void>;

  loadDescriptorGroups: () => Promise<void>;
  addDescriptorGroup: (name: string) => Promise<void>;
  removeDescriptorGroup: (id: number) => Promise<void>;
  addDescriptor: (groupId: number, label: string) => Promise<void>;
  removeDescriptor: (id: number) => Promise<void>;

  registerVideo: (name: string, path: string) => Promise<Video | undefined>;
  selectVideo: (id: number) => Promise<void>;
  setVideoMeta: (id: number, meta: Partial<Video>) => Promise<void>;

  loadEvents: () => Promise<void>;
  addEvent: (input: Parameters<typeof api.createEvent>[0]) => Promise<void>;
  updateEvent: (id: number, patch: Partial<MatchEvent>) => Promise<void>;
  removeEvent: (id: number) => Promise<void>;
  toggleEventDescriptor: (id: number, label: string) => Promise<void>;

  selectEvent: (id: number | null) => void;

  setFilter: (patch: Partial<Filter>) => void;
  clearFilter: () => void;

  togglePlaylist: (id: number) => void;
  clearPlaylist: () => void;

  saveTemplate: () => Promise<CodingTemplate | undefined>;
  applyTemplate: (template: CodingTemplate) => Promise<void>;

  analyzeVideo: (targetFps?: number) => Promise<void>;
  loadTracks: () => Promise<void>;
  setOverlay: (on: boolean) => void;

  setCalibrationMode: (on: boolean) => void;
  addCalibrationPoint: (x: number, y: number) => void;
  clearCalibrationPoints: () => void;
  calibratePitch: (length: number, width: number) => Promise<void>;
  loadPitch: () => Promise<void>;
  runAutotag: () => Promise<number>;

  computeAnalytics: () => Promise<void>;
  loadAnalytics: () => Promise<void>;
  tagTurnovers: () => Promise<number>;

  computeShots: () => Promise<void>;
  loadShots: () => Promise<void>;
  tagShots: () => Promise<number>;
}

export const useStore = create<AppState>((set, get) => ({
  health: "checking",
  projects: [],
  categories: [],
  descriptorGroups: [],
  videos: [],
  events: [],
  currentProjectId: null,
  currentVideoId: null,
  selectedEventId: null,
  filter: EMPTY_FILTER,
  playlist: [],
  analysisJob: null,
  tracks: null,
  overlay: true,
  calibrationMode: false,
  calibrationPoints: [],
  pitch: null,
  analytics: null,
  shots: null,

  currentProject: () => get().projects.find((p) => p.id === get().currentProjectId),
  currentVideo: () => get().videos.find((v) => v.id === get().currentVideoId),
  selectedEvent: () => get().events.find((e) => e.id === get().selectedEventId),

  checkHealth: async () => {
    try {
      await api.health();
      set({ health: "online" });
    } catch {
      set({ health: "offline" });
    }
  },

  loadProjects: async () => {
    const projects = await api.listProjects();
    set({ projects });
    if (!get().currentProjectId && projects.length) {
      await get().selectProject(projects[0].id);
    }
  },

  addProject: async (name) => {
    const project = await api.createProject(name);
    set({ projects: [...get().projects, project] });
    await get().selectProject(project.id);
  },

  selectProject: async (id) => {
    set({
      currentProjectId: id,
      currentVideoId: null,
      events: [],
      selectedEventId: null,
      playlist: [],
      filter: EMPTY_FILTER,
    });
    const [categories, videos, descriptorGroups] = await Promise.all([
      api.listCategories(id),
      api.listVideos(id),
      api.listDescriptorGroups(id),
    ]);
    set({ categories, videos, descriptorGroups });
    if (videos.length) await get().selectVideo(videos[0].id);
  },

  addCategory: async (name, color, hotkey) => {
    const pid = get().currentProjectId;
    if (!pid) return;
    const category = await api.createCategory({
      project_id: pid,
      name,
      color,
      hotkey: hotkey || null,
      sort_order: get().categories.length,
    });
    set({ categories: [...get().categories, category] });
  },

  removeCategory: async (id) => {
    await api.deleteCategory(id);
    set({ categories: get().categories.filter((c) => c.id !== id) });
  },

  loadDescriptorGroups: async () => {
    const pid = get().currentProjectId;
    if (!pid) return;
    set({ descriptorGroups: await api.listDescriptorGroups(pid) });
  },

  addDescriptorGroup: async (name) => {
    const pid = get().currentProjectId;
    if (!pid) return;
    await api.createDescriptorGroup(pid, name, get().descriptorGroups.length);
    await get().loadDescriptorGroups();
  },

  removeDescriptorGroup: async (id) => {
    await api.deleteDescriptorGroup(id);
    await get().loadDescriptorGroups();
  },

  addDescriptor: async (groupId, label) => {
    const group = get().descriptorGroups.find((g) => g.id === groupId);
    await api.createDescriptor(groupId, label, undefined, group?.descriptors.length ?? 0);
    await get().loadDescriptorGroups();
  },

  removeDescriptor: async (id) => {
    await api.deleteDescriptor(id);
    await get().loadDescriptorGroups();
  },

  registerVideo: async (name, path) => {
    const pid = get().currentProjectId;
    if (!pid) return undefined;
    const video = await api.registerVideo(pid, name, path);
    set({ videos: [...get().videos, video] });
    await get().selectVideo(video.id);
    return video;
  },

  selectVideo: async (id) => {
    set({
      currentVideoId: id,
      selectedEventId: null,
      playlist: [],
      tracks: null,
      analysisJob: null,
      pitch: null,
      calibrationMode: false,
      calibrationPoints: [],
      analytics: null,
      shots: null,
    });
    await Promise.all([
      get().loadEvents(),
      get().loadTracks(),
      get().loadPitch(),
      get().loadAnalytics(),
      get().loadShots(),
    ]);
  },

  setVideoMeta: async (id, meta) => {
    const updated = await api.updateVideoMeta(id, meta);
    set({ videos: get().videos.map((v) => (v.id === id ? updated : v)) });
  },

  loadEvents: async () => {
    const vid = get().currentVideoId;
    if (!vid) {
      set({ events: [] });
      return;
    }
    set({ events: await api.listEvents(vid) });
  },

  addEvent: async (input) => {
    const event = await api.createEvent(input);
    set({
      events: [...get().events, event].sort((a, b) => a.start_ms - b.start_ms),
      selectedEventId: event.id,
    });
  },

  updateEvent: async (id, patch) => {
    const event = await api.updateEvent(id, patch);
    set({
      events: get()
        .events.map((e) => (e.id === id ? event : e))
        .sort((a, b) => a.start_ms - b.start_ms),
    });
  },

  removeEvent: async (id) => {
    await api.deleteEvent(id);
    set({
      events: get().events.filter((e) => e.id !== id),
      selectedEventId: get().selectedEventId === id ? null : get().selectedEventId,
      playlist: get().playlist.filter((p) => p !== id),
    });
  },

  toggleEventDescriptor: async (id, label) => {
    const ev = get().events.find((e) => e.id === id);
    if (!ev) return;
    const next = ev.descriptors.includes(label)
      ? ev.descriptors.filter((d) => d !== label)
      : [...ev.descriptors, label];
    await get().updateEvent(id, { descriptors: next });
  },

  selectEvent: (id) => set({ selectedEventId: id }),

  setFilter: (patch) => set({ filter: { ...get().filter, ...patch } }),
  clearFilter: () => set({ filter: EMPTY_FILTER }),

  togglePlaylist: (id) => {
    const current = get().playlist;
    set({
      playlist: current.includes(id)
        ? current.filter((p) => p !== id)
        : [...current, id],
    });
  },
  clearPlaylist: () => set({ playlist: [] }),

  saveTemplate: async () => {
    const pid = get().currentProjectId;
    if (!pid) return undefined;
    return api.getTemplate(pid);
  },

  applyTemplate: async (template) => {
    const pid = get().currentProjectId;
    if (!pid) return;
    await api.applyTemplate(pid, template);
    const [categories, descriptorGroups] = await Promise.all([
      api.listCategories(pid),
      api.listDescriptorGroups(pid),
    ]);
    set({ categories, descriptorGroups });
  },

  analyzeVideo: async (targetFps = 5) => {
    const vid = get().currentVideoId;
    if (!vid) return;
    const job = await api.startAnalysis(vid, targetFps);
    set({ analysisJob: job });

    // Poll until the job finishes.
    const poll = async () => {
      const current = get().analysisJob;
      if (!current || current.meta.video_id !== vid) return; // switched video
      try {
        const updated = await api.getJob(current.id);
        set({ analysisJob: updated });
        if (updated.status === "done") {
          await get().loadTracks();
          return;
        }
        if (updated.status === "error") return;
      } catch {
        return;
      }
      setTimeout(poll, 700);
    };
    setTimeout(poll, 700);
  },

  loadTracks: async () => {
    const vid = get().currentVideoId;
    if (!vid) {
      set({ tracks: null });
      return;
    }
    try {
      const { exists } = await api.tracksExist(vid);
      set({ tracks: exists ? await api.getTracks(vid) : null });
    } catch {
      set({ tracks: null });
    }
  },

  setOverlay: (on) => set({ overlay: on }),

  setCalibrationMode: (on) =>
    set({ calibrationMode: on, calibrationPoints: on ? [] : get().calibrationPoints }),

  addCalibrationPoint: (x, y) => {
    const pts = get().calibrationPoints;
    if (pts.length >= 4) return;
    set({ calibrationPoints: [...pts, [x, y]] });
  },

  clearCalibrationPoints: () => set({ calibrationPoints: [] }),

  calibratePitch: async (length, width) => {
    const vid = get().currentVideoId;
    const pts = get().calibrationPoints;
    if (!vid || pts.length !== 4) return;
    const pitch = await api.calibrate(vid, pts, length, width);
    set({ pitch, calibrationMode: false });
  },

  loadPitch: async () => {
    const vid = get().currentVideoId;
    if (!vid) {
      set({ pitch: null });
      return;
    }
    try {
      set({ pitch: await api.getPitch(vid) });
    } catch {
      set({ pitch: null });
    }
  },

  runAutotag: async () => {
    const vid = get().currentVideoId;
    if (!vid) return 0;
    const { created } = await api.autotag(vid);
    await get().loadEvents();
    return created;
  },

  computeAnalytics: async () => {
    const vid = get().currentVideoId;
    if (!vid) return;
    set({ analytics: await api.computeAnalytics(vid) });
  },

  loadAnalytics: async () => {
    const vid = get().currentVideoId;
    if (!vid) {
      set({ analytics: null });
      return;
    }
    try {
      set({ analytics: await api.getAnalytics(vid) });
    } catch {
      set({ analytics: null });
    }
  },

  tagTurnovers: async () => {
    const vid = get().currentVideoId;
    if (!vid) return 0;
    const { created } = await api.tagTurnovers(vid);
    await get().loadEvents();
    return created;
  },

  computeShots: async () => {
    const vid = get().currentVideoId;
    if (!vid) return;
    set({ shots: await api.computeShots(vid) });
  },

  loadShots: async () => {
    const vid = get().currentVideoId;
    if (!vid) {
      set({ shots: null });
      return;
    }
    try {
      set({ shots: await api.getShots(vid) });
    } catch {
      set({ shots: null });
    }
  },

  tagShots: async () => {
    const vid = get().currentVideoId;
    if (!vid) return 0;
    const { created } = await api.tagShots(vid);
    await get().loadEvents();
    return created;
  },
}));

/** Memoized filtered-events selector — stable across renders. */
export function useFilteredEvents(): MatchEvent[] {
  const events = useStore((s) => s.events);
  const filter = useStore((s) => s.filter);
  return useMemo(() => applyFilter(events, filter), [events, filter]);
}
