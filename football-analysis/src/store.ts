// Central app state (Zustand). Keeps the workspace — current project, video,
// categories, descriptors, events, filtering and playlist selection — in sync
// with the Python sidecar.

import { useMemo } from "react";
import { create } from "zustand";
import { api } from "./lib/api";
import { pickVideoFile } from "./lib/platform";
import type {
  AnalysisJob,
  Analytics,
  Category,
  CodingTemplate,
  DescriptorGroup,
  Filter,
  MatchEvent,
  PitchData,
  PlayerProfile,
  Project,
  SegmentMap,
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
  selectedTrackId: number | null;
  playerProfile: PlayerProfile | null;
  videoMissing: boolean; // source file not found at its recorded path

  filter: Filter;
  playlist: number[]; // selected event ids for the highlight reel

  // Phase 2: CV analysis
  analysisJob: AnalysisJob | null;
  tracks: TracksData | null;
  overlay: boolean;
  segments: SegmentMap | null; // triage: main-camera vs filler

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
  relinkVideo: () => Promise<void>;

  loadEvents: () => Promise<void>;
  addEvent: (input: Parameters<typeof api.createEvent>[0]) => Promise<void>;
  updateEvent: (id: number, patch: Partial<MatchEvent>) => Promise<void>;
  removeEvent: (id: number) => Promise<void>;
  toggleEventDescriptor: (id: number, label: string) => Promise<void>;

  selectEvent: (id: number | null) => void;
  selectPlayer: (trackId: number | null) => void;

  setFilter: (patch: Partial<Filter>) => void;
  clearFilter: () => void;

  togglePlaylist: (id: number) => void;
  clearPlaylist: () => void;
  setPlaylist: (ids: number[]) => void;

  // Deep-link seek request (e.g. clicking a clip in a query result).
  requestSeekMs: number | null;
  requestSeek: (ms: number) => void;

  saveTemplate: () => Promise<CodingTemplate | undefined>;
  applyTemplate: (template: CodingTemplate) => Promise<void>;

  analyzeVideo: (targetFps?: number) => Promise<void>;
  loadTracks: () => Promise<void>;
  loadSegments: () => Promise<void>;
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
  selectedTrackId: null,
  playerProfile: null,
  videoMissing: false,
  filter: EMPTY_FILTER,
  playlist: [],
  requestSeekMs: null,
  analysisJob: null,
  tracks: null,
  overlay: true,
  segments: null,
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
      selectedTrackId: null,
      playerProfile: null,
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
      selectedTrackId: null,
      playerProfile: null,
      playlist: [],
      tracks: null,
      analysisJob: null,
      pitch: null,
      calibrationMode: false,
      calibrationPoints: [],
      analytics: null,
      shots: null,
      segments: null,
      videoMissing: false,
    });
    await Promise.all([
      get().loadEvents(),
      get().loadTracks(),
      get().loadSegments(),
      get().loadPitch(),
      get().loadAnalytics(),
      get().loadShots(),
    ]);
    // Managed-media check: flag if the source file has moved/renamed.
    try {
      const st = await api.videoStatus(id);
      set({ videoMissing: !st.exists });
    } catch {
      /* leave as-is */
    }
  },

  relinkVideo: async () => {
    const vid = get().currentVideoId;
    if (!vid) return;
    const path = await pickVideoFile(); // native picker (Tauri); null in browser
    if (!path) return;
    const video = await api.relinkVideo(vid, path);
    set({
      videos: get().videos.map((v) => (v.id === vid ? video : v)),
      videoMissing: false,
    });
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
  selectPlayer: (trackId) => {
    set({ selectedTrackId: trackId, playerProfile: null });
    const vid = get().currentVideoId;
    if (trackId == null || !vid) return;
    void api
      .getPlayerProfile(vid, trackId)
      .then((profile) => {
        if (get().currentVideoId === vid && get().selectedTrackId === trackId) {
          set({ playerProfile: profile });
        }
      })
      .catch(() => {
        if (get().currentVideoId === vid && get().selectedTrackId === trackId) {
          set({ playerProfile: null });
        }
      });
  },

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
  setPlaylist: (ids) => set({ playlist: ids }),

  requestSeek: (ms) => set({ requestSeekMs: ms }),

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

    // Poll until the job finishes. Surface partial results: as soon as the
    // 'events' stage completes, load the tracks so the overlay appears before
    // the later stages finish (progressive delivery).
    const poll = async () => {
      const current = get().analysisJob;
      if (!current || current.meta.video_id !== vid) return; // switched video
      try {
        const updated = await api.getJob(current.id);
        set({ analysisJob: updated });
        if (updated.completed_stages?.includes("triage") && !get().segments) {
          await get().loadSegments(); // surface the filler-removed timeline early
        }
        if (updated.completed_stages?.includes("events") && !get().tracks) {
          await get().loadTracks();
          await get().loadEvents(); // surface the auto-detected candidate events
        }
        if (updated.status === "done") {
          await get().loadTracks();
          await get().loadEvents();
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

  loadSegments: async () => {
    const vid = get().currentVideoId;
    if (!vid) {
      set({ segments: null });
      return;
    }
    try {
      set({ segments: await api.getSegments(vid) });
    } catch {
      set({ segments: null });
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
