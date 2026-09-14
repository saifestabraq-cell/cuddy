import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "./store";
import TitleBar from "./components/TitleBar";
import Sidebar from "./components/Sidebar";
import Workspace from "./components/Workspace";
import SettingsPanel from "./components/SettingsPanel";

const STAGE_MESSAGE: Record<string, string> = {
  checking: "Starting Cuddy Engine…",
  offline: "Connecting to Analysis Engine…",
};

export default function App() {
  const { checkHealth, loadProjects, health, resetHealthCheck, refreshSettings } =
    useStore();

  useEffect(() => {
    // Poll health until online, then load projects. Stops polling once the
    // sidecar is declared "failed" (see checkHealth's attempt budget) so a
    // genuinely dead backend doesn't spin forever; Retry restarts polling.
    let cancelled = false;
    let loaded = false;
    // Load projects + settings the first time health becomes online — whether
    // that's the initial check or a later poll. In the packaged app the sidecar
    // takes 24-60s to start, so the first checkHealth almost always fails; if we
    // only loaded on that first attempt the app would show "Engine ready" with
    // an empty sidebar and no stored key applied.
    const loadOnce = async () => {
      if (loaded || cancelled) return;
      loaded = true;
      await Promise.all([loadProjects(), refreshSettings()]);
    };
    const tick = async () => {
      await checkHealth();
      if (cancelled) return;
      if (useStore.getState().health === "online") await loadOnce();
    };
    tick();
    const interval = setInterval(() => {
      const h = useStore.getState().health;
      if (h !== "online" && h !== "failed") tick();
    }, 1500);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [checkHealth, loadProjects, refreshSettings]);

  const retry = () => {
    resetHealthCheck();
  };

  return (
    <div className="h-full flex flex-col bg-ink-900 text-mist-100">
      <TitleBar />
      <div className="flex-1 flex min-h-0">
        <Sidebar />
        <main className="flex-1 min-w-0 p-4">
          <AnimatePresence mode="wait">
            {health === "failed" ? (
              <motion.div
                key="failed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full grid place-items-center"
              >
                <div className="text-center max-w-sm">
                  <div className="text-signal-live text-lg mb-2">
                    Analysis Engine failed to start.
                  </div>
                  <p className="text-mist-300 text-sm leading-relaxed mb-4">
                    The backend didn't come up in time. In development, start it
                    with <code className="text-teal-300">npm run dev:api</code>.
                    In the installed app, check the log file for details.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button className="btn-accent" onClick={retry}>
                      Retry
                    </button>
                    <span
                      className="text-xs text-mist-400"
                      title="%LOCALAPPDATA%\Cuddy\logs\backend.log"
                    >
                      View Logs: %LOCALAPPDATA%\Cuddy\logs\backend.log
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : health !== "online" ? (
              <motion.div
                key="offline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full grid place-items-center"
              >
                <div className="text-center max-w-sm">
                  <div className="text-mist-200 text-lg mb-2">
                    {STAGE_MESSAGE[health] ?? "Connecting…"}
                  </div>
                  <p className="text-mist-300 text-sm leading-relaxed">
                    In development, start the backend with{" "}
                    <code className="text-teal-300">npm run dev:api</code>.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="workspace"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                <Workspace />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      <SettingsPanel />
    </div>
  );
}
