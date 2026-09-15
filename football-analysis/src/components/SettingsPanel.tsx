import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "../store";

/** Modal to configure the AI provider key (Groq/Anthropic) and API-Football key. */
export default function SettingsPanel() {
  const open = useStore((s) => s.settingsOpen);
  const close = useStore((s) => s.closeSettings);
  const apiKeySet = useStore((s) => s.apiKeySet);
  const groqKeySet = useStore((s) => s.groqKeySet);
  const provider = useStore((s) => s.aiProvider);
  const keySource = useStore((s) => s.keySource);
  const apifootballKeySet = useStore((s) => s.apifootballKeySet);
  const saveApiKey = useStore((s) => s.saveApiKey);
  const saveGroqKey = useStore((s) => s.saveGroqKey);
  const setProvider = useStore((s) => s.setProvider);
  const saveApiFootballKey = useStore((s) => s.saveApiFootballKey);
  const refreshSettings = useStore((s) => s.refreshSettings);

  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [fbKey, setFbKey] = useState("");
  const [fbBusy, setFbBusy] = useState(false);
  const [fbSaved, setFbSaved] = useState(false);
  const [fbErr, setFbErr] = useState<string | null>(null);

  const activeKeySet = provider === "groq" ? groqKeySet : apiKeySet;

  useEffect(() => {
    if (open) {
      setKey("");
      setSaved(false);
      setErr(null);
      setFbKey("");
      setFbSaved(false);
      setFbErr(null);
      refreshSettings();
    }
  }, [open, refreshSettings]);

  const saveFootball = async () => {
    if (!fbKey.trim()) return;
    setFbBusy(true);
    setFbErr(null);
    try {
      await saveApiFootballKey(fbKey.trim());
      setFbSaved(true);
      setFbKey("");
    } catch (e) {
      setFbErr(e instanceof Error ? e.message : "Could not save the key.");
    } finally {
      setFbBusy(false);
    }
  };

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
      if (provider === "groq") await saveGroqKey(key.trim());
      else await saveApiKey(key.trim());
      setSaved(true);
      setKey("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not save the key.");
    } finally {
      setBusy(false);
    }
  };

  const switchProvider = async (p: "groq" | "anthropic") => {
    if (p === provider) return;
    setKey("");
    setSaved(false);
    setErr(null);
    try {
      await setProvider(p);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not switch provider.");
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

            {/* Match data — API-Football (the primary data source) */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    apifootballKeySet ? "bg-teal-400" : "bg-mist-500"
                  }`}
                />
                <label className="text-xs font-medium text-mist-200">
                  Match data — API-Football
                </label>
              </div>
              <p className="text-[11px] text-mist-400 mb-2 leading-relaxed">
                Real scores, lineups, formations and team stats. Get a free key at{" "}
                <span className="text-mist-300">api-sports.io</span> (dashboard →
                API key). Stored locally.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  className="input flex-1"
                  placeholder={apifootballKeySet ? "•••••• (configured)" : "your api-sports key"}
                  value={fbKey}
                  onChange={(e) => {
                    setFbKey(e.target.value);
                    setFbSaved(false);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && saveFootball()}
                />
                <button
                  className="btn-accent"
                  disabled={fbBusy || !fbKey.trim()}
                  onClick={saveFootball}
                >
                  {fbBusy ? "Saving…" : apifootballKeySet ? "Update" : "Save"}
                </button>
              </div>
              {fbSaved && (
                <span className="text-xs text-teal-300 mt-1 inline-block">Saved ✓</span>
              )}
              {fbErr && <span className="text-xs text-signal-live mt-1 inline-block">{fbErr}</span>}
            </div>

            <div className="border-t border-ink-500/50 my-4" />

            {/* AI chat — provider (Groq is free; Anthropic optional) */}
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-mist-200">AI chat</label>
              <div className="flex items-center gap-1 rounded-lg bg-ink-900/60 p-0.5">
                <ProviderTab
                  label="Groq · free"
                  active={provider === "groq"}
                  onClick={() => switchProvider("groq")}
                />
                <ProviderTab
                  label="Anthropic"
                  active={provider === "anthropic"}
                  onClick={() => switchProvider("anthropic")}
                />
              </div>
            </div>

            <p className="text-[11px] text-mist-400 mb-3 leading-relaxed">
              {provider === "groq" ? (
                <>
                  Natural-language questions run on Groq&apos;s free, fast API. Get a
                  free key at <span className="text-mist-300">console.groq.com</span>{" "}
                  (API Keys). Stored locally, only sent to Groq.
                </>
              ) : (
                <>
                  Uses the Anthropic API — a separate paid key (your Claude
                  subscription does not apply). Stored locally, only sent to
                  Anthropic.
                </>
              )}
            </p>

            <div className="flex items-center gap-2 mb-3 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  activeKeySet ? "bg-teal-400" : "bg-mist-500"
                }`}
              />
              <span className="text-mist-300">
                {activeKeySet
                  ? keySource === "env"
                    ? "Key active (from environment)"
                    : "Key configured"
                  : "No key configured"}
              </span>
            </div>

            {keySource === "env" ? (
              <p className="text-xs text-mist-400 leading-relaxed">
                A{" "}
                <code className="text-teal-300">
                  {provider === "groq" ? "GROQ_API_KEY" : "ANTHROPIC_API_KEY"}
                </code>{" "}
                environment variable is set and takes precedence. Unset it to
                manage the key here instead.
              </p>
            ) : (
              <>
                <label className="text-xs text-mist-300">
                  {provider === "groq" ? "Groq API key" : "Anthropic API key"}
                </label>
                <input
                  type="password"
                  autoFocus
                  className="input w-full mt-1"
                  placeholder={provider === "groq" ? "gsk_…" : "sk-ant-…"}
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
                    {busy ? "Saving…" : activeKeySet ? "Update key" : "Save key"}
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
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProviderTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
        active ? "bg-ink-600 text-mist-100" : "text-mist-400 hover:text-mist-200"
      }`}
    >
      {label}
    </button>
  );
}
