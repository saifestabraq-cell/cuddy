import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "./store";
import TitleBar from "./components/TitleBar";
import Sidebar from "./components/Sidebar";
import Workspace from "./components/Workspace";

export default function App() {
  const { checkHealth, loadProjects, health } = useStore();

  useEffect(() => {
    // Poll health until online, then load projects.
    let cancelled = false;
    const boot = async () => {
      await checkHealth();
      if (cancelled) return;
      if (useStore.getState().health === "online") {
        await loadProjects();
      }
    };
    boot();
    const interval = setInterval(() => {
      if (useStore.getState().health !== "online") checkHealth();
    }, 1500);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [checkHealth, loadProjects]);

  return (
    <div className="h-full flex flex-col bg-ink-900 text-mist-100">
      <TitleBar />
      <div className="flex-1 flex min-h-0">
        <Sidebar />
        <main className="flex-1 min-w-0 p-4">
          <AnimatePresence mode="wait">
            {health === "offline" ? (
              <motion.div
                key="offline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full grid place-items-center"
              >
                <div className="text-center max-w-sm">
                  <div className="text-mist-200 text-lg mb-2">
                    Waiting for the analysis engine…
                  </div>
                  <p className="text-mist-300 text-sm leading-relaxed">
                    The Python sidecar isn't responding yet. In development, start
                    it with{" "}
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
    </div>
  );
}
