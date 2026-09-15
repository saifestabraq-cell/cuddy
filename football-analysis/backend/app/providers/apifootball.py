"""Real match data from API-Football (api-sports.io).

Given a free-text description ("Chelsea vs Arsenal", optionally with a season or
date), find the fixture and return a normalized bundle: both teams' names,
formations, starting lineups, team statistics and the event timeline — real,
provider-validated data rather than a CV estimate or an LLM guess.

Auth: the user's api-sports.io key (free tier ~100 requests/day), stored in
Settings. Docs: https://www.api-football.com/documentation-v3
"""

from __future__ import annotations

import re
from typing import Any

from .. import user_settings

BASE = "https://v3.football.api-sports.io"
_TIMEOUT = 15.0


class ProviderError(RuntimeError):
    """A recoverable provider problem (no key, not found, rate limited)."""


def _client():
    import httpx

    key = user_settings.get_apifootball_key()
    if not key:
        raise ProviderError(
            "No API-Football key configured. Add one in Settings (free at "
            "api-sports.io) to load real match data."
        )
    return httpx.Client(
        base_url=BASE, headers={"x-apisports-key": key}, timeout=_TIMEOUT
    )


def _get(client, path: str, params: dict) -> list[dict]:
    resp = client.get(path, params=params)
    if resp.status_code == 429:
        raise ProviderError("API-Football rate limit reached — try again later.")
    if resp.status_code in (401, 403):
        raise ProviderError("API-Football rejected the key. Check it in Settings.")
    resp.raise_for_status()
    body = resp.json()
    errors = body.get("errors")
    # api-sports returns errors as a dict (or [] when none).
    if isinstance(errors, dict) and errors:
        raise ProviderError("; ".join(str(v) for v in errors.values()))
    return body.get("response", []) or []


def _parse_teams(query: str) -> tuple[str, str] | None:
    """Pull two team names out of a description like 'Chelsea vs Arsenal 2024'."""
    cleaned = re.sub(r"\b(20\d{2}(?:[-/]\d{2,4})?)\b", " ", query)  # drop years
    parts = re.split(r"\s+(?:vs?\.?|v|[-–—]|x)\s+", cleaned, flags=re.IGNORECASE)
    parts = [p.strip(" .,-") for p in parts if p.strip(" .,-")]
    if len(parts) >= 2:
        return parts[0], parts[1]
    return None


def _team_id(client, name: str) -> dict | None:
    rows = _get(client, "/teams", {"search": name})
    if not rows:
        return None
    team = rows[0].get("team", {})
    return {"id": team.get("id"), "name": team.get("name"), "logo": team.get("logo")}


def _season_from(query: str) -> int | None:
    m = re.search(r"\b(20\d{2})\b", query)
    return int(m.group(1)) if m else None


def _pick_fixture(client, home_id: int, away_id: int, season: int | None) -> dict | None:
    params: dict[str, Any] = {"h2h": f"{home_id}-{away_id}"}
    if season:
        params["season"] = season
    rows = _get(client, "/fixtures/headtohead", params)
    if not rows:
        rows = _get(client, "/fixtures/headtohead", {"h2h": f"{home_id}-{away_id}"})
    if not rows:
        return None
    # Prefer finished matches, most recent first.
    def sort_key(r):
        return r.get("fixture", {}).get("timestamp", 0)

    finished = [
        r for r in rows if r.get("fixture", {}).get("status", {}).get("short") == "FT"
    ]
    chosen = max(finished or rows, key=sort_key)
    return chosen


def _normalize_stats(rows: list[dict]) -> dict[int, dict]:
    """team_id -> {stat label: value} from /fixtures/statistics."""
    out: dict[int, dict] = {}
    for entry in rows:
        tid = entry.get("team", {}).get("id")
        stats = {}
        for s in entry.get("statistics", []):
            stats[str(s.get("type"))] = s.get("value")
        if tid is not None:
            out[tid] = stats
    return out


def _normalize_lineups(rows: list[dict]) -> dict[int, dict]:
    out: dict[int, dict] = {}
    for entry in rows:
        tid = entry.get("team", {}).get("id")
        if tid is None:
            continue
        xi = [
            p.get("player", {}).get("name")
            for p in entry.get("startXI", [])
            if p.get("player", {}).get("name")
        ]
        out[tid] = {"formation": entry.get("formation"), "start_xi": xi}
    return out


def _fixture_summary(fx: dict) -> dict:
    """A lightweight fixture card for the browser (no stats/lineups)."""
    fixture = fx.get("fixture", {})
    goals = fx.get("goals", {})
    league = fx.get("league", {})
    home = fx.get("teams", {}).get("home", {})
    away = fx.get("teams", {}).get("away", {})
    return {
        "fixture_id": fixture.get("id"),
        "date": (fixture.get("date") or "")[:10] or None,
        "status": fixture.get("status", {}).get("short"),
        "competition": league.get("name"),
        "season": league.get("season"),
        "home": home.get("name"),
        "away": away.get("name"),
        "home_logo": home.get("logo"),
        "away_logo": away.get("logo"),
        "score": f'{goals.get("home")}-{goals.get("away")}'
        if goals.get("home") is not None
        else None,
    }


def search_fixtures(query: str, limit: int = 25) -> list[dict]:
    """Return candidate fixtures for a description, most recent first.

    Two teams ("Arsenal vs Chelsea") -> their head-to-head meetings. One team
    -> that team's recent fixtures. The caller picks the exact fixture, which is
    then loaded by id — far more reliable than free-text guessing.
    """
    with _client() as client:
        teams = _parse_teams(query)
        if teams:
            a = _team_id(client, teams[0])
            b = _team_id(client, teams[1])
            if not a or not a["id"]:
                raise ProviderError(f'Team not found: "{teams[0]}".')
            if not b or not b["id"]:
                raise ProviderError(f'Team not found: "{teams[1]}".')
            rows = _get(
                client, "/fixtures/headtohead", {"h2h": f'{a["id"]}-{b["id"]}'}
            )
        else:
            name = query.strip()
            if not name:
                raise ProviderError("Enter a team or 'Home vs Away' to search.")
            t = _team_id(client, name)
            if not t or not t["id"]:
                raise ProviderError(f'Team not found: "{name}".')
            rows = _get(client, "/fixtures", {"team": t["id"], "last": 30})

    rows.sort(key=lambda r: r.get("fixture", {}).get("timestamp", 0), reverse=True)
    return [_fixture_summary(r) for r in rows[:limit]]


def _bundle(client, fx: dict, query: str) -> dict:
    """Fetch stats/lineups/events for a fixture row and normalize everything."""
    fixture = fx.get("fixture", {})
    fid = fixture.get("id")
    goals = fx.get("goals", {})
    league = fx.get("league", {})
    f_home = fx.get("teams", {}).get("home", {})
    f_away = fx.get("teams", {}).get("away", {})

    stats = _normalize_stats(_get(client, "/fixtures/statistics", {"fixture": fid}))
    lineups = _normalize_lineups(_get(client, "/fixtures/lineups", {"fixture": fid}))
    events_raw = _get(client, "/fixtures/events", {"fixture": fid})

    def side(team: dict) -> dict:
        tid = team.get("id")
        lu = lineups.get(tid, {})
        return {
            "id": tid,
            "name": team.get("name"),
            "logo": team.get("logo"),
            "formation": lu.get("formation"),
            "start_xi": lu.get("start_xi", []),
            "stats": stats.get(tid, {}),
        }

    events = [
        {
            "minute": e.get("time", {}).get("elapsed"),
            "team": e.get("team", {}).get("name"),
            "player": e.get("player", {}).get("name"),
            "type": e.get("type"),
            "detail": e.get("detail"),
        }
        for e in events_raw
    ]

    return {
        "query": query,
        "fixture_id": fid,
        "competition": league.get("name"),
        "date": (fixture.get("date") or "")[:10] or None,
        "score": f'{goals.get("home")}-{goals.get("away")}'
        if goals.get("home") is not None
        else None,
        "home": side(f_home),
        "away": side(f_away),
        "events": events,
    }


def fetch_match_by_id(fixture_id: int) -> dict:
    """Load full match data for a specific fixture id (from the browser)."""
    with _client() as client:
        rows = _get(client, "/fixtures", {"id": fixture_id})
        if not rows:
            raise ProviderError(f"Fixture {fixture_id} not found.")
        return _bundle(client, rows[0], query=f"fixture:{fixture_id}")


def _player_line(entry: dict) -> dict:
    """Compact per-player stat line from a /fixtures/players player entry."""
    p = entry.get("player", {})
    s = (entry.get("statistics") or [{}])[0]
    games = s.get("games") or {}
    shots = s.get("shots") or {}
    goals = s.get("goals") or {}
    passes = s.get("passes") or {}
    tackles = s.get("tackles") or {}
    duels = s.get("duels") or {}
    dribbles = s.get("dribbles") or {}
    cards = s.get("cards") or {}
    rating = games.get("rating")
    return {
        "id": p.get("id"),
        "name": p.get("name"),
        "photo": p.get("photo"),
        "number": games.get("number"),
        "position": games.get("position"),
        "minutes": games.get("minutes"),
        "rating": round(float(rating), 1) if rating not in (None, "") else None,
        "captain": bool(games.get("captain")),
        "goals": goals.get("total") or 0,
        "assists": goals.get("assists") or 0,
        "shots": shots.get("total") or 0,
        "shots_on": shots.get("on") or 0,
        "passes": passes.get("total") or 0,
        "pass_accuracy": passes.get("accuracy"),
        "key_passes": passes.get("key") or 0,
        "tackles": tackles.get("total") or 0,
        "interceptions": tackles.get("interceptions") or 0,
        "duels_won": duels.get("won") or 0,
        "duels_total": duels.get("total") or 0,
        "dribbles": dribbles.get("success") or 0,
        "yellow": cards.get("yellow") or 0,
        "red": cards.get("red") or 0,
    }


def fetch_player_stats(fixture_id: int) -> dict:
    """Per-player match statistics for a fixture, grouped by team id.

    Returns ``{"fixture_id", "by_team": {team_id: {"name", "players": [...]}}}``
    from API-Football's ``/fixtures/players`` (real, provider-validated).
    """
    with _client() as client:
        rows = _get(client, "/fixtures/players", {"fixture": fixture_id})
    by_team: dict[str, dict] = {}
    for entry in rows:
        team = entry.get("team", {})
        tid = team.get("id")
        if tid is None:
            continue
        players = [_player_line(pe) for pe in entry.get("players", [])]
        # Keep only players who actually appeared, most involved first.
        players = [p for p in players if (p.get("minutes") or 0) > 0]
        players.sort(key=lambda p: (p.get("minutes") or 0), reverse=True)
        by_team[str(tid)] = {"name": team.get("name"), "players": players}
    return {"fixture_id": fixture_id, "by_team": by_team}


def fetch_match(query: str) -> dict:
    """Return normalized match data for the best-matching fixture (free-text)."""
    teams = _parse_teams(query)
    if not teams:
        raise ProviderError(
            'Could not read two team names from "%s". Try "Home vs Away".' % query
        )
    season = _season_from(query)
    with _client() as client:
        a = _team_id(client, teams[0])
        b = _team_id(client, teams[1])
        if not a or not a["id"]:
            raise ProviderError(f'Team not found: "{teams[0]}".')
        if not b or not b["id"]:
            raise ProviderError(f'Team not found: "{teams[1]}".')

        fx = _pick_fixture(client, a["id"], b["id"], season)
        if not fx:
            raise ProviderError(f'No fixture found between {a["name"]} and {b["name"]}.')
        return _bundle(client, fx, query=query)
