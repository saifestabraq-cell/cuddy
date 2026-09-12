import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store";

export default function Sidebar() {
  const { projects, currentProjectId, selectProject, addProject } = useStore();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");

  const submit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    await addProject(trimmed);
    setName("");
    setAdding(false);
  };

  return (
    <aside className="w-60 shrink-0 border-r border-ink-500/60 bg-ink-800/40 p-3 flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          Projects
        </span>
        <button
          className="text-mist-300 hover:text-teal-300 transition-colors text-lg leading-none"
          onClick={() => setAdding((v) => !v)}
          title="New project"
        >
          +
        </button>
      </div>

      {adding && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="px-1"
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
        </motion.div>
      )}

      <div className="flex-1 overflow-y-auto flex flex-col gap-1">
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
