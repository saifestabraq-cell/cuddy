import type { ReactNode } from "react";

/**
 * The "■ SECTION LABEL" header used across the workspace panels — a small
 * blurple square bullet + an uppercase, letter-spaced label, with optional
 * right-aligned content (a control or meta text).
 */
export default function SectionHeader({
  label,
  right,
  className = "",
}: {
  label: string;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-2 h-2 rounded-[3px] bg-teal-400 shrink-0" />
        <span className="text-[11px] uppercase tracking-[0.14em] text-mist-300 font-medium truncate">
          {label}
        </span>
      </div>
      {right}
    </div>
  );
}
