import { useRef, useState } from "react";
import { useStore } from "../store";
import { exportUrl, downloadText, api } from "../lib/api";
import { pickVideoFile, isTauri, baseName } from "../lib/platform";
import type { CodingTemplate } from "../lib/types";

/** Video selector + import, coding-template save/apply, and export controls. */
export default function VideoBar() {
  const { videos, currentVideoId, selectVideo, registerVideo, saveTemplate, applyTemplate } =
    useStore();
  const [manualPath, setManualPath] = useState("");
  const [importing, setImporting] = useState(false);
  const [menu, setMenu] = useState<"tpl" | "exp" | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const doImport = async () => {
    if (isTauri()) {
      const path = await pickVideoFile();
      if (path) await registerVideo(baseName(path), path);
      return;
    }
    // Browser/dev: ask the local backend to open a native OS file dialog.
    try {
      const { path } = await api.pickVideoFile();
      if (path) await registerVideo(baseName(path), path);
    } catch {
      // Fallback to the manual path input if the picker isn't available.
      setImporting((v) => !v);
    }
  };

  const submitManual = async () => {
    const p = manualPath.trim();
    if (!p) return;
    await registerVideo(baseName(p), p);
    setManualPath("");
    setImporting(false);
  };

  const doSaveTemplate = async () => {
    const tmpl = await saveTemplate();
    if (tmpl) downloadText(JSON.stringify(tmpl, null, 2), `${tmpl.name}.json`);
  };

  const onTemplateFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const tmpl = JSON.parse(await file.text()) as CodingTemplate;
      await applyTemplate(tmpl);
    } catch {
      alert("Could not read that template file.");
    }
    e.target.value = "";
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <select
        className="input min-w-[12rem]"
        value={currentVideoId ?? ""}
        onChange={(e) => selectVideo(Number(e.target.value))}
        disabled={videos.length === 0}
      >
        {videos.length === 0 && <option value="">No videos</option>}
        {videos.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>

      <button className="btn-accent" onClick={doImport}>
        Import video
      </button>

      {importing && !isTauri() && (
        <div className="flex items-center gap-2">
          <input
            autoFocus
            className="input w-80"
            placeholder="Absolute path to a video file (dev mode)"
            value={manualPath}
            onChange={(e) => setManualPath(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitManual()}
          />
          <button className="btn" onClick={submitManual}>
            Add
          </button>
        </div>
      )}

      <div className="flex-1" />

      {/* Templates menu */}
      <div className="relative">
        <button
          className="btn"
          onClick={() => setMenu((m) => (m === "tpl" ? null : "tpl"))}
        >
          Templates ▾
        </button>
        {menu === "tpl" && (
          <div
            className="absolute right-0 mt-1 z-20 card p-1 flex flex-col min-w-[10rem] shadow-soft"
            onMouseLeave={() => setMenu(null)}
          >
            <button
              className="text-left px-3 py-1.5 rounded-lg text-sm text-mist-200 hover:bg-ink-600"
              onClick={() => {
                setMenu(null);
                doSaveTemplate();
              }}
            >
              Save template
            </button>
            <button
              className="text-left px-3 py-1.5 rounded-lg text-sm text-mist-200 hover:bg-ink-600"
              onClick={() => {
                setMenu(null);
                fileRef.current?.click();
              }}
            >
              Apply template
            </button>
          </div>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={onTemplateFile}
      />

      {/* Export menu */}
      <div className="relative">
        <button
          className="btn"
          onClick={() => setMenu((m) => (m === "exp" ? null : "exp"))}
        >
          Export ▾
        </button>
        {menu === "exp" && (
          <div
            className="absolute right-0 mt-1 z-20 card p-1 flex flex-col min-w-[9rem] shadow-soft"
            onMouseLeave={() => setMenu(null)}
          >
            <a
              className="px-3 py-1.5 rounded-lg text-sm text-mist-200 hover:bg-ink-600"
              href={currentVideoId ? exportUrl(currentVideoId, "xml") : undefined}
              aria-disabled={!currentVideoId}
              onClick={(e) => {
                if (!currentVideoId) e.preventDefault();
                setMenu(null);
              }}
            >
              Export XML
            </a>
            <a
              className="px-3 py-1.5 rounded-lg text-sm text-mist-200 hover:bg-ink-600"
              href={currentVideoId ? exportUrl(currentVideoId, "csv") : undefined}
              aria-disabled={!currentVideoId}
              onClick={(e) => {
                if (!currentVideoId) e.preventDefault();
                setMenu(null);
              }}
            >
              Export CSV
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
