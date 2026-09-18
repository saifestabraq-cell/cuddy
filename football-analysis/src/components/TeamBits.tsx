import type { MatchTeam } from "../lib/types";

/** Short 3-letter team code from an explicit abbrev, else the name. */
export function teamCode(name?: string | null): string {
  if (!name) return "—";
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0] + (words[1][1] ?? "")).toUpperCase();
  return name.slice(0, 3).toUpperCase();
}

/** Team badge: the crest if available, else a blurple rounded-square code chip. */
export function TeamBadge({ team, size = 8 }: { team: MatchTeam; size?: number }) {
  const dim = `${size * 4}px`;
  if (team.logo) {
    return (
      <img
        src={team.logo}
        alt=""
        style={{ width: dim, height: dim }}
        className="object-contain shrink-0"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
    );
  }
  return (
    <span
      style={{ width: dim, height: dim }}
      className="shrink-0 grid place-items-center rounded-lg bg-teal-400/20 text-teal-200 text-[11px] font-semibold tabular-nums"
    >
      {teamCode(team.name)}
    </span>
  );
}

/** Scoreline team block: badge + name + "formation · Home/Away". */
export function TeamHead({
  team,
  align,
  size = 8,
}: {
  team: MatchTeam;
  align: "left" | "right";
  size?: number;
}) {
  const side = align === "right" ? "Home" : "Away";
  const meta = [team.formation, side].filter(Boolean).join(" · ");
  return (
    <div
      className={`flex items-center gap-2.5 ${
        align === "right" ? "flex-row-reverse text-right" : "text-left"
      }`}
    >
      <TeamBadge team={team} size={size} />
      <div className="min-w-0">
        <div className="text-base font-semibold text-mist-100 truncate leading-tight">
          {team.name}
        </div>
        {meta && (
          <div className="text-[11px] text-mist-400 tabular-nums truncate">{meta}</div>
        )}
      </div>
    </div>
  );
}
