import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "../store";

/** Define descriptor groups and their buttons (collapsible). */
export default function DescriptorManager() {
  const {
    descriptorGroups,
    addDescriptorGroup,
    removeDescriptorGroup,
    addDescriptor,
    removeDescriptor,
  } = useStore();
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [drafts, setDrafts] = useState<Record<number, string>>({});

  return (
    <div className="panel p-3">
      <button
        className="w-full flex items-center justify-between text-xs uppercase tracking-wider text-mist-400"
        onClick={() => setOpen((v) => !v)}
      >
        <span>Descriptors</span>
        <span className="text-mist-500">{open ? "▾" : "▸"}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 flex flex-col gap-3">
              {descriptorGroups.map((g) => (
                <div key={g.id} className="card p-2.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-mist-100">{g.name}</span>
                    <button
                      className="text-mist-500 hover:text-signal-live text-xs"
                      onClick={() => removeDescriptorGroup(g.id)}
                    >
                      remove
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {g.descriptors.map((d) => (
                      <span
                        key={d.id}
                        className="group px-2 py-0.5 rounded-lg text-xs bg-ink-700 border border-ink-500/60 text-mist-200 flex items-center gap-1"
                      >
                        {d.label}
                        <button
                          className="text-mist-500 hover:text-signal-live"
                          onClick={() => removeDescriptor(d.id)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    className="input h-7 py-0 w-full"
                    placeholder="Add button + Enter"
                    value={drafts[g.id] ?? ""}
                    onChange={(e) =>
                      setDrafts({ ...drafts, [g.id]: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const label = (drafts[g.id] ?? "").trim();
                        if (label) {
                          addDescriptor(g.id, label);
                          setDrafts({ ...drafts, [g.id]: "" });
                        }
                      }
                    }}
                  />
                </div>
              ))}

              <div className="flex items-center gap-2">
                <input
                  className="input h-8 py-0 flex-1"
                  placeholder="New group (e.g. Outcome, Zone)"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && groupName.trim()) {
                      addDescriptorGroup(groupName.trim());
                      setGroupName("");
                    }
                  }}
                />
                <button
                  className="btn h-8 py-0"
                  onClick={() => {
                    if (groupName.trim()) {
                      addDescriptorGroup(groupName.trim());
                      setGroupName("");
                    }
                  }}
                >
                  Add group
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
