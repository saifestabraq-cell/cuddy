import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store";

function readCollapsed(): boolean {
  try {
    return localStorage.getItem("cuddy.sidebarCollapsed") === "1";
  } catch {
    return false;
  }
}

export default function Sidebar() {
  const { projects, currentProjectId, selectProject, addProject } = useStore();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [collapsed, setCollapsed] = useState(readCollapsed);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem("cuddy.sidebarCollapsed", next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const submit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    await addProject(trimmed);
    setName("");
    setAdding(false);
  };

  // Collapsed: a thin rail with just an expand button.
  if (collapsed) {
    return (
      <aside className="w-10 shrink-0 border-r border-ink-500/60 bg-ink-800/40 sticky top-11 self-start h-[calc(100vh-2.75rem)] flex flex-col items-center pt-3">
        <button
          className="text-mist-300 hover:text-teal-300 transition-colors p-1 rounded-lg hover:bg-ink-700"
          onClick={toggleCollapsed}
          title="Show projects"
          aria-label="Show projects"
        >
          »
        </button>
        <span className="mt-3 text-[10px] uppercase tracking-[0.14em] text-mist-500 [writing-mode:vertical-rl]">
          Projects
        </span>
      </aside>
    );
  }

  return (
    <aside className="w-60 shrink-0 border-r border-ink-500/60 bg-ink-800/40 p-3 sticky top-11 self-start h-[calc(100vh-2.75rem)] flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs uppercase tracking-wider text-mist-400">Projects</span>
        <div className="flex items-center gap-1.5">
          <button
            className="text-mist-300 hover:text-teal-300 transition-colors text-lg leading-none"
            onClick={() => setAdding((v) => !v)}
            title="New project"
          >
            +
          </button>
          <button
            className="text-mist-400 hover:text-teal-300 transition-colors text-sm leading-none px-1"
            onClick={toggleCollapsed}
            title="Collapse"
            aria-label="Collapse projects"
          >
            «
          </button>
        </div>
      </div>

      {adding && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="px-1 flex flex-col gap-2 overflow-hidden"
        >
          <input
            autoFocus
            className="input w-full"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              if (e.key === "Escape") setAdding(false);
            }}
          />
          {name.trim() && (
            <motion.button
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="btn-accent w-full justify-center"
              onClick={submit}
            >
              Start project
            </motion.button>
          )}
        </motion.div>
      )}

      <div className="flex-1 overflow-y-auto flex flex-col gap-1 min-h-0">
        {projects.length === 0 && (
          <p className="text-mist-400 text-sm px-1 leading-relaxed">
            No projects yet. Create one to start analysing.
          </p>
        )}
        {projects.map((p) => {
          const active = p.id === currentProjectId;
          return (
            <button
              key={p.id}
              onClick={() => selectProject(p.id)}
              className={`text-left px-3 py-2 rounded-xl text-sm transition-colors duration-200 ease-smooth ${
                active
                  ? "bg-ink-600 text-mist-100 shadow-soft"
                  : "text-mist-200 hover:bg-ink-700"
              }`}
            >
              {p.name}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
