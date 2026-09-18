import { useState } from "react";
import { useStore } from "../store";
import { api, downloadText } from "../lib/api";
import { fmtClock } from "../lib/time";
import SectionHeader from "./SectionHeader";

/**
 * Findings: save an observation tied to its evidence. The currently selected
 * playlist events become the supporting events, and the time range is derived
 * from them. Clicking a finding loads its events as the reel and seeks to the
 * start — evidence you can always get back to.
 */
export default function FindingsPanel() {
  const findings = useStore((s) => s.findings);
  const addFinding = useStore((s) => s.addFinding);
  const removeFinding = useStore((s) => s.removeFinding);
  const events = useStore((s) => s.events);
  const playlist = useStore((s) => s.playlist);
  const setPlaylist = useStore((s) => s.setPlaylist);
  const requestSeek = useStore((s) => s.requestSeek);
  const selectEvent = useStore((s) => s.selectEvent);
  const videoId = useStore((s) => s.currentVideoId);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [busy, setBusy] = useState(false);

  const supporting = events.filter((e) => playlist.includes(e.id));
  const range =
    supporting.length > 0
      ? {
          start_ms: Math.min(...supporting.map((e) => e.start_ms)),
          end_ms: Math.max(...supporting.map((e) => e.end_ms)),
        }
      : { start_ms: null, end_ms: null };

  const save = async () => {
    if (!title.trim()) return;
    setBusy(true);
    try {
      await addFinding({
        title: title.trim(),
        description: desc.trim(),
        event_ids: playlist,
        start_ms: range.start_ms,
        end_ms: range.end_ms,
      });
      setTitle("");
      setDesc("");
    } finally {
      setBusy(false);
    }
  };

  const openFinding = (eventIds: number[], startMs: number | null) => {
    if (eventIds.length) setPlaylist(eventIds);
    if (startMs != null) {
      selectEvent(eventIds[0] ?? null);
      requestSeek(startMs);
    }
  };

  if (!videoId) return null;

  return (
    <div className="panel p-3">
      <SectionHeader
        label="Findings"
        className="mb-2"
        right={
          <div className="flex items-center gap-2">
            {findings.length > 0 && (
              <button
                className="text-[11px] text-mist-400 hover:text-teal-300 transition-colors"
                onClick={async () => {
                  const report = await api.getReport(videoId);
                  downloadText(
                    JSON.stringify(report, null, 2),
                    `${report.title || "match"}-report.json`,
                  );
                }}
              >
                Export report
              </button>
            )}
            <span className="text-[11px] text-mist-400 tabular-nums">
              {findings.length}
            </span>
          </div>
        }
      />

      <div className="flex flex-col gap-2 mb-3">
        <input
          className="input"
          placeholder="Finding title — e.g. Left-side turnovers in the first phase"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
        />
        <textarea
          className="input resize-none"
          rows={2}
          placeholder="Notes (optional)"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-mist-400">
            {supporting.length > 0
              ? `${supporting.length} supporting event${supporting.length === 1 ? "" : "s"} · ${fmtClock(range.start_ms ?? 0)}–${fmtClock(range.end_ms ?? 0)}`
              : "Select events (▶ playlist) to attach evidence"}
          </span>
          <button
            className="btn-accent h-7 py-0"
            disabled={busy || !title.trim()}
            onClick={save}
          >
            Save finding
          </button>
        </div>
      </div>

      {findings.length === 0 ? (
        <p className="text-xs text-mist-400">
          No findings yet. Capture what the evidence shows so you can return to it.
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {findings.map((f) => (
            <div key={f.id} className="card px-2.5 py-2">
              <div className="flex items-start justify-between gap-2">
                <button
                  className="text-left flex-1 min-w-0"
                  onClick={() => openFinding(f.event_ids, f.start_ms)}
                >
                  <div className="text-sm text-mist-100 flex items-center gap-2">
                    {f.start_ms != null && (
                      <span className="tabular-nums text-teal-300 text-xs shrink-0">
                        {fmtClock(f.start_ms)}
                      </span>
                    )}
                    <span className="truncate">{f.title}</span>
                  </div>
                  {f.description && (
                    <div className="text-xs text-mist-400 mt-0.5">{f.description}</div>
                  )}
                  {f.event_ids.length > 0 && (
                    <div className="text-[11px] text-mist-500 mt-0.5">
                      {f.event_ids.length} event{f.event_ids.length === 1 ? "" : "s"} · click to load reel
                    </div>
                  )}
                </button>
                <button
                  className="text-mist-500 hover:text-signal-live text-sm shrink-0"
                  onClick={() => removeFinding(f.id)}
                  aria-label="Delete finding"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
