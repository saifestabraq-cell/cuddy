import { useStore } from "../store";
import { downloadSelection } from "../lib/api";

interface Props {
  presenting: boolean;
  onPlay: () => void;
  onStop: () => void;
}

/** Highlight-reel controls: play the selection back-to-back, or export it. */
export default function PlaylistBar({ presenting, onPlay, onStop }: Props) {
  const playlist = useStore((s) => s.playlist);
  const clearPlaylist = useStore((s) => s.clearPlaylist);
  const currentVideo = useStore((s) => s.currentVideo());

  const count = playlist.length;
  const disabled = count === 0 || !currentVideo;

  const doExport = async (fmt: "xml" | "csv") => {
    if (!currentVideo) return;
    await downloadSelection(
      currentVideo.id,
      playlist,
      fmt,
      `${currentVideo.name}_playlist.${fmt}`,
    );
  };

  return (
    <div className="panel px-3 py-2 flex items-center gap-2">
      <span className="text-xs uppercase tracking-wider text-mist-400">
        Playlist
      </span>
      <span className="text-sm text-mist-200 tabular-nums">{count} selected</span>
      <div className="flex-1" />
      {presenting ? (
        <button className="btn" onClick={onStop}>
          Stop
        </button>
      ) : (
        <button className="btn-accent" disabled={disabled} onClick={onPlay}>
          ▶ Play reel
        </button>
      )}
      <button className="btn" disabled={disabled} onClick={() => doExport("xml")}>
        Export XML
      </button>
      <button className="btn" disabled={disabled} onClick={() => doExport("csv")}>
        Export CSV
      </button>
      <button className="btn" disabled={count === 0} onClick={clearPlaylist}>
        Clear
      </button>
    </div>
  );
}
