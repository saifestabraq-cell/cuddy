// Platform helpers. The app runs both as a packaged Tauri desktop app and,
// during development, in a plain browser (npm run dev:web). The file picker
// differs, so we detect the environment and degrade gracefully.

export const isTauri = (): boolean =>
  typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

/**
 * Open a native file picker for a video and return its absolute path.
 * In the browser we can't get a real filesystem path, so callers fall back
 * to manual path entry.
 */
export async function pickVideoFile(): Promise<string | null> {
  if (!isTauri()) return null;
  const { open } = await import("@tauri-apps/plugin-dialog");
  const selected = await open({
    multiple: false,
    filters: [
      { name: "Video", extensions: ["mp4", "mov", "mkv", "avi", "m4v", "webm"] },
    ],
  });
  return typeof selected === "string" ? selected : null;
}

export function baseName(path: string): string {
  const parts = path.split(/[\\/]/);
  return parts[parts.length - 1] || path;
}

/**
 * Open a URL in the user's default browser. In the packaged app the Tauri
 * shell plugin launches the system browser; in dev we fall back to a new tab.
 */
export async function openExternal(url: string): Promise<void> {
  if (isTauri()) {
    try {
      const { open } = await import("@tauri-apps/plugin-shell");
      await open(url);
      return;
    } catch {
      /* fall through to window.open */
    }
  }
  window.open(url, "_blank", "noopener,noreferrer");
}
