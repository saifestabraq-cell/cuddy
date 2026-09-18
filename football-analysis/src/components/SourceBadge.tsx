// A small, honest badge for where a number came from. Approximate/heuristic
// sources are amber (check me); validated/official sources are teal.
//
// Shared by the AI panel and the match overview so data provenance reads the
// same everywhere (spec §13/§58).

export const SOURCE_LABEL: Record<string, string> = {
  official_match_data: "Official",
  cuddy_video_analysis: "Cuddy CV",
  approximate_cv: "Approx. CV",
  heuristic: "Heuristic",
};

const APPROX = new Set(["approximate_cv", "heuristic"]);

const TITLE: Record<string, string> = {
  official_match_data: "Validated official match data (API-Football)",
  cuddy_video_analysis: "Derived from Cuddy's video analysis",
  approximate_cv: "Approximate — spatial CV, not measured data",
  heuristic: "Heuristic estimate from tracking",
};

export default function SourceBadge({ source }: { source: string }) {
  const label = SOURCE_LABEL[source] ?? source;
  const approx = APPROX.has(source);
  return (
    <span
      className={`px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide ${
        approx ? "bg-amber-500/15 text-amber-300" : "bg-teal-500/15 text-teal-300"
      }`}
      title={TITLE[source] ?? "Data source"}
    >
      {label}
    </span>
  );
}
