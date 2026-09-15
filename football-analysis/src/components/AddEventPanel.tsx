import { useEffect, useState } from "react";
import { useStore } from "../store";
import { fmtClock } from "../lib/time";

interface Props {
  playheadMs: number;
  disabled: boolean;
}

/** Parse "m:ss" or seconds into ms; returns null if unparseable. */
function parseClock(v: string): number | null {
  const t = v.trim();
  if (!t) return null;
  if (t.includes(":")) {
    const [m, s] = t.split(":");
    const mm = parseInt(m, 10);
    const ss = parseFloat(s);
    if (isNaN(mm) || isNaN(ss)) return null;
    return Math.round((mm * 60 + ss) * 1000);
  }
  const secs = parseFloat(t);
  return isNaN(secs) ? null : Math.round(secs * 1000);
}

/**
 * Field-based event entry — replaces the tag-button pad. Enter a time, type,
 * optional category and note; the time defaults to (and can snap to) the
 * current playhead.
 */
export default function AddEventPanel({ playheadMs, disabled }: Props) {
  const categories = useStore((s) => s.categories);
  const addEvent = useStore((s) => s.addEvent);
  const updateEvent = useStore((s) => s.updateEvent);
  const addCategory = useStore((s) => s.addCategory);
  const currentVideoId = useStore((s) => s.currentVideoId);

  const [time, setTime] = useState(fmtClock(playheadMs));
  const [touchedTime, setTouchedTime] = useState(false);
  const [label, setLabel] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [duration, setDuration] = useState(8);
  const [notes, setNotes] = useState("");
  const [flash, setFlash] = useState(false);

  // Follow the playhead until the user edits the time field themselves.
  useEffect(() => {
    if (!touchedTime) setTime(fmtClock(playheadMs));
  }, [playheadMs, touchedTime]);

  const snap = () => {
    setTime(fmtClock(playheadMs));
    setTouchedTime(false);
  };

  const submit = async () => {
    if (!currentVideoId) return;
    const startMs = parseClock(time);
    if (startMs == null) return;
    if (categoryId === "" && !label.trim()) return;
    await addEvent({
      video_id: currentVideoId,
      category_id: categoryId === "" ? null : categoryId,
      label: label.trim() || undefined,
      start_ms: Math.max(0, startMs),
      end_ms: Math.max(0, startMs) + Math.max(1, duration) * 1000,
      source: "manual",
    });
    // notes aren't part of the create payload — set them on the new event.
    const newId = useStore.getState().selectedEventId;
    if (newId && notes.trim()) await updateEvent(newId, { notes: notes.trim() });
    setLabel("");
    setNotes("");
    setFlash(true);
    setTimeout(() => setFlash(false), 700);
  };

  const canAdd =
    !disabled && !!currentVideoId && (categoryId !== "" || !!label.trim());

  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-mist-400">
          Add event
        </span>
        {flash && <span className="text-[11px] text-teal-300">Added ✓</span>}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <Field label="Time">
          <div className="flex gap-1.5">
            <input
              className="input flex-1 tabular-nums"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                setTouchedTime(true);
              }}
              placeholder="0:00"
            />
            <button
              className="btn shrink-0 px-2"
              title="Snap to current playhead"
              onClick={snap}
            >
              Now
            </button>
          </div>
        </Field>

        <Field label="Duration (s)">
          <input
            type="number"
            min={1}
            className="input w-full tabular-nums"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value, 10) || 1)}
          />
        </Field>

        <Field label="Category">
          <select
            className="input w-full"
            value={categoryId}
            onChange={(e) =>
              setCategoryId(e.target.value === "" ? "" : Number(e.target.value))
            }
          >
            <option value="">— none —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Type / label">
          <input
            className="input w-full"
            placeholder="e.g. Shot, Foul"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </Field>

        <div className="col-span-2">
          <Field label="Note">
            <input
              className="input w-full"
              placeholder="optional"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </Field>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <button
          className="text-[11px] text-mist-400 hover:text-teal-300 transition-colors"
          onClick={() => {
            const name = label.trim();
            if (name) {
              addCategory(name, "#6E75F5");
              setLabel("");
            }
          }}
          title="Save the typed label as a reusable category"
        >
          + save as category
        </button>
        <button className="btn-accent" disabled={!canAdd} onClick={submit}>
          Add event
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wide text-mist-400">{label}</span>
      {children}
    </label>
  );
}
