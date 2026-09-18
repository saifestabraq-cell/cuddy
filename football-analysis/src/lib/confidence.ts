// Confidence display helpers.
//
// These bands are a DISPLAY aid over the detector's own confidence score — not
// a validated accuracy claim. Wording deliberately says "review recommended" /
// "verify" rather than implying calibrated precision (spec §9/§607).

export type ConfidenceBand = "high" | "medium" | "low" | "none";

export function confidenceBand(confidence: number | null): ConfidenceBand {
  if (confidence == null) return "none";
  if (confidence >= 0.75) return "high";
  if (confidence >= 0.5) return "medium";
  return "low";
}

export const BAND_LABEL: Record<ConfidenceBand, string> = {
  high: "High confidence",
  medium: "Review recommended",
  low: "Low — verify",
  none: "No confidence score",
};

/** Tailwind classes for a confidence chip. AI accent (violet) for the value,
 *  amber/red as the band lowers to signal "check this". */
export const BAND_CLASS: Record<ConfidenceBand, string> = {
  high: "bg-teal-500/15 text-teal-300",
  medium: "bg-amber-500/15 text-amber-300",
  low: "bg-rose-500/15 text-rose-300",
  none: "bg-ink-600 text-mist-400",
};

export function confidencePct(confidence: number | null): string {
  if (confidence == null) return "—";
  return `${Math.round(confidence * 100)}%`;
}
