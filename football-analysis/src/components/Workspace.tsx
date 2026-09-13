import { useRef, useState } from "react";
import { useStore } from "../store";
import { streamUrl } from "../lib/api";
import type { MatchEvent } from "../lib/types";
import VideoBar from "./VideoBar";
import VideoPlayer from "./VideoPlayer";
import FilterBar from "./FilterBar";
import Timeline from "./Timeline";
import TagPad from "./TagPad";
import AnalyzePanel from "./AnalyzePanel";
import DescriptorManager from "./DescriptorManager";
import Dashboard from "./Dashboard";
import EventList from "./EventList";
import EventEditPanel from "./EventEditPanel";
import PlaylistBar from "./PlaylistBar";
import PitchPanel from "./PitchPanel";
import AnalyticsPanel from "./AnalyticsPanel";

export default function Workspace() {
  const currentProject = useStore((s) => s.currentProject());
  const currentVideo = useStore((s) => s.currentVideo());
  const setVideoMeta = useStore((s) => s.setVideoMeta);
  const selectedEventId = useStore((s) => s.selectedEventId);

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

  if (!currentProject) {
    return (
      <div className="h-full grid place-items-center text-mist-300">
        Select or create a project to begin.
      </div>
    );
  }

  const src = currentVideo ? streamUrl(currentVideo.id) : null;

  return (
    <div className="h-full flex flex-col gap-3">
      <VideoBar />
      <FilterBar />

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4">
        {/* left: video + timeline + coding */}
        <div className="flex flex-col gap-3 min-h-0 overflow-y-auto pr-1">
          <VideoPlayer
            ref={videoRef}
            src={src}
            onTime={handleTime}
            onMeta={(meta) => {
              setDurationMs(meta.duration_ms);
              if (currentVideo) setVideoMeta(currentVideo.id, meta);
            }}
          />
          <AnalyzePanel />
          <PitchPanel />
          <AnalyticsPanel />
          <Timeline
            durationMs={durationMs || currentVideo?.duration_ms || 0}
            playheadMs={playheadMs}
            onSeek={seek}
          />
          <TagPad playheadMs={playheadMs} disabled={!currentVideo} />
          <DescriptorManager />
        </div>

        {/* right: playlist + edit + dashboard + events */}
        <div className="flex flex-col gap-3 min-h-0">
          <PlaylistBar
            presenting={presenting}
            onPlay={playPlaylist}
            onStop={stopPresentation}
          />
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
