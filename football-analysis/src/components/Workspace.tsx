import { useEffect, useRef, useState } from "react";
import { useStore } from "../store";
import { streamUrl } from "../lib/api";
import type { MatchEvent } from "../lib/types";
import VideoBar from "./VideoBar";
import VideoPlayer from "./VideoPlayer";
import FilterBar from "./FilterBar";
import Timeline from "./Timeline";
import AnalyzePanel from "./AnalyzePanel";
import StatsDashboard from "./StatsDashboard";
import DescriptorManager from "./DescriptorManager";
import Dashboard from "./Dashboard";
import EventList from "./EventList";
import EventEditPanel from "./EventEditPanel";
import PlaylistBar from "./PlaylistBar";
import AnalysisTabs from "./AnalysisTabs";
import AIPanel from "./AIPanel";
import ReviewQueue from "./ReviewQueue";
import FindingsPanel from "./FindingsPanel";
import AddEventPanel from "./AddEventPanel";
import StudioToolbar from "./StudioToolbar";
import MatchHero from "./MatchHero";
import ValidationPanel from "./ValidationPanel";

export default function Workspace() {
  const currentProject = useStore((s) => s.currentProject());
  const currentVideo = useStore((s) => s.currentVideo());
  const setVideoMeta = useStore((s) => s.setVideoMeta);
  const selectedEventId = useStore((s) => s.selectedEventId);
  const updateEvent = useStore((s) => s.updateEvent);
  const tracksFps = useStore((s) => s.tracks?.src_fps);
  const analyzed = useStore((s) => s.tracks != null);
  const requestSeekMs = useStore((s) => s.requestSeekMs);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [playheadMs, setPlayheadMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);

  // Presentation (highlight reel) playback state.
  const [presenting, setPresenting] = useState(false);
  const queueRef = useRef<MatchEvent[]>([]);
  const idxRef = useRef(0);

  const seek = (ms: number) => {
    if (videoRef.current) videoRef.current.currentTime = ms / 1000;
    setPlayheadMs(ms);
  };

  // Consume deep-link seek requests (e.g. clicking a clip in a query result).
  useEffect(() => {
    if (requestSeekMs != null) {
      seek(requestSeekMs);
      useStore.setState({ requestSeekMs: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestSeekMs]);

  const stopPresentation = () => {
    setPresenting(false);
    videoRef.current?.pause();
  };

  const playPlaylist = () => {
    const { playlist, events } = useStore.getState();
    const queue = events
      .filter((e) => playlist.includes(e.id))
      .sort((a, b) => a.start_ms - b.start_ms);
    if (!queue.length || !videoRef.current) return;
    queueRef.current = queue;
    idxRef.current = 0;
    setPresenting(true);
    videoRef.current.currentTime = queue[0].start_ms / 1000;
    videoRef.current.play();
  };

  const handleTime = (ms: number) => {
    setPlayheadMs(ms);
    if (!presenting) return;
    const item = queueRef.current[idxRef.current];
    if (item && ms >= item.end_ms - 30) {
      const next = idxRef.current + 1;
      if (next < queueRef.current.length && videoRef.current) {
        idxRef.current = next;
        videoRef.current.currentTime = queueRef.current[next].start_ms / 1000;
      } else {
        stopPresentation();
      }
    }
  };

  // Phase 4: keyboard transport + frame-accurate editing.
  //  J = reverse, K/Space = pause/play, L = play (repeat toggles 2x),
  //  , / . = step one frame, [ / ] = nudge selected event start/end by a frame
  //  (hold Shift to nudge the other way).
  useEffect(() => {
    const fps = currentVideo?.fps || tracksFps || 25;
    const frameSec = 1 / fps;
    let reverse: number | null = null;
    const stopReverse = () => {
      if (reverse !== null) {
        window.clearInterval(reverse);
        reverse = null;
      }
    };
    const v = () => videoRef.current;

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA") return;

      // One-keystroke review of a selected, unreviewed AI event.
      const sel = useStore.getState().selectedEvent();
      if (sel && sel.source === "ai" && !sel.reviewed) {
        if (e.key === "y" || e.key === "Y" || e.key === "Enter") {
          e.preventDefault();
          updateEvent(sel.id, { reviewed: true });
          return;
        }
        if (e.key === "n" || e.key === "N") {
          e.preventDefault();
          useStore.getState().removeEvent(sel.id);
          return;
        }
      }

      const vid = v();
      switch (e.key) {
        case " ":
        case "k":
        case "K":
          if (!vid) return;
          e.preventDefault();
          stopReverse();
          vid.paused ? vid.play() : vid.pause();
          break;
        case "l":
        case "L":
          if (!vid) return;
          e.preventDefault();
          stopReverse();
          if (vid.paused) {
            vid.playbackRate = 1;
            vid.play();
          } else {
            vid.playbackRate = vid.playbackRate >= 2 ? 1 : 2;
          }
          break;
        case "j":
        case "J":
          if (!vid) return;
          e.preventDefault();
          vid.pause();
          if (reverse === null) {
            reverse = window.setInterval(() => {
              const vv = v();
              if (vv) vv.currentTime = Math.max(0, vv.currentTime - frameSec * 2);
            }, 1000 / 30);
          }
          break;
        case ",":
          if (!vid) return;
          e.preventDefault();
          stopReverse();
          vid.pause();
          vid.currentTime = Math.max(0, vid.currentTime - frameSec);
          break;
        case ".":
          if (!vid) return;
          e.preventDefault();
          stopReverse();
          vid.pause();
          vid.currentTime = vid.currentTime + frameSec;
          break;
        case "[":
        case "]": {
          const ev = useStore.getState().selectedEvent();
          if (!ev) return;
          e.preventDefault();
          const deltaMs = (e.shiftKey ? -1 : 1) * frameSec * 1000;
          if (e.key === "[") {
            updateEvent(ev.id, { start_ms: Math.max(0, Math.round(ev.start_ms + deltaMs)) });
          } else {
            updateEvent(ev.id, { end_ms: Math.round(ev.end_ms + deltaMs) });
          }
          break;
        }
        default:
          return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      stopReverse();
    };
  }, [currentVideo, tracksFps, updateEvent]);

  if (!currentProject) {
    return (
      <div className="min-h-[70vh] grid place-items-center text-mist-300">
        Select or create a project to begin.
      </div>
    );
  }

  const src = currentVideo ? streamUrl(currentVideo.id) : null;

  return (
    <div className="flex flex-col gap-3">
      <VideoBar />
      <FilterBar />
      <MatchHero />

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 items-start">
        {/* left: video + timeline + coding */}
        <div className="flex flex-col gap-3">
          <VideoPlayer
            ref={videoRef}
            src={src}
            onTime={handleTime}
            onMeta={(meta) => {
              setDurationMs(meta.duration_ms);
              if (currentVideo) setVideoMeta(currentVideo.id, meta);
            }}
          />
          {currentVideo && <StudioToolbar />}
          <AnalyzePanel />
          {analyzed && <AnalysisTabs />}
          <Timeline
            durationMs={durationMs || currentVideo?.duration_ms || 0}
            playheadMs={playheadMs}
            onSeek={seek}
          />
          <AddEventPanel playheadMs={playheadMs} disabled={!currentVideo} />
          <DescriptorManager />
        </div>

        {/* right: playlist + edit + dashboard + events */}
        <div className="flex flex-col gap-3">
          <StatsDashboard />
          <PlaylistBar
            presenting={presenting}
            onPlay={playPlaylist}
            onStop={stopPresentation}
          />
          <AIPanel />
          <ReviewQueue />
          <FindingsPanel />
          {analyzed && <ValidationPanel />}
          {selectedEventId && (
            <EventEditPanel playheadMs={playheadMs} onSeek={seek} />
          )}
          <Dashboard />
          <EventList onSeek={seek} />
        </div>
      </div>
    </div>
  );
}
