import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "../store";

/** Modal to configure the Anthropic API key used for AI chat & clip queries. */
export default function SettingsPanel() {
  const open = useStore((s) => s.settingsOpen);
  const close = useStore((s) => s.closeSettings);
  const apiKeySet = useStore((s) => s.apiKeySet);
  const keySource = useStore((s) => s.keySource);
  const saveApiKey = useStore((s) => s.saveApiKey);
  const refreshSettings = useStore((s) => s.refreshSettings);

  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setKey("");
      setSaved(false);
      setErr(null);
      refreshSettings();
    }
  }, [open, refreshSettings]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && close();
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, close]);

  const save = async () => {
    if (!key.trim()) return;
    setBusy(true);
    setErr(null);
    try {
      await saveApiKey(key.trim());
      setSaved(true);
      setKey("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not save the key.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-ink-900/70 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            className="panel w-full max-w-md p-5"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-medium text-mist-100">Settings</h2>
              <button
                className="text-mist-400 hover:text-mist-100 transition-colors text-lg leading-none"
                onClick={close}
                aria-label="Close settings"
              >
                ×
              </button>
            </div>
            <p className="text-xs text-mist-400 mb-4 leading-relaxed">
              AI chat and clip search use the Anthropic API. Your key is stored
              locally on this machine and is only sent to Anthropic — never to
              anyone else.
            </p>

            <div className="flex items-center gap-2 mb-3 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  apiKeySet ? "bg-teal-400" : "bg-mist-500"
                }`}
              />
              <span className="text-mist-300">
                {apiKeySet
                  ? keySource === "env"
                    ? "Key active (from environment)"
                    : "Key configured"
                  : "No key configured"}
              </span>
            </div>

            {keySource === "env" ? (
              <p className="text-xs text-mist-400 leading-relaxed">
                An <code className="text-teal-300">ANTHROPIC_API_KEY</code>{" "}
                environment variable is set and takes precedence. Unset it to
                manage the key here instead.
              </p>
            ) : (
              <>
                <label className="text-xs text-mist-300">Anthropic API key</label>
                <input
                  type="password"
                  autoFocus
                  className="input w-full mt-1"
                  placeholder="sk-ant-…"
                  value={key}
                  onChange={(e) => {
                    setKey(e.target.value);
                    setSaved(false);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && save()}
                />
                <div className="flex items-center gap-3 mt-4">
                  <button
                    className="btn-accent"
                    disabled={busy || !key.trim()}
                    onClick={save}
                  >
                    {busy ? "Saving…" : apiKeySet ? "Update key" : "Save key"}
                  </button>
                  {saved && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-teal-300"
                    >
                      Saved ✓
                    </motion.span>
                  )}
                  {err && <span className="text-xs text-signal-live">{err}</span>}
                </div>
                <p className="text-[11px] text-mist-500 mt-3 leading-relaxed">
                  Get a key at{" "}
                  <span className="text-mist-300">console.anthropic.com</span>.
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
