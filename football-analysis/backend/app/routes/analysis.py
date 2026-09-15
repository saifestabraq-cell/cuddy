"""Video analysis endpoints (Phase 2a).

POST /videos/{id}/analyze   -> start a background detection+tracking job
GET  /jobs/{job_id}         -> poll job status/progress
GET  /videos/{id}/tracks    -> fetch the tracking result (boxes per frame)
GET  /videos/{id}/tracks/exists -> lightweight check
"""

from __future__ import annotations

import json
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlmodel import Session, select

from .. import user_settings
from ..config import settings
from ..cv.analytics import compute_analytics
from ..cv.pitch import autotag_final_third, build_pitch_data, build_player_heatmap
from ..cv.shots import detect_shots
from ..db import get_session
from ..llm import answer_question, query_clips
from ..models import Category, Event, Video
from ..pipeline import get_run, run_as_dict, start_analysis as start_analysis_pipeline
from ..schemas import AskRequest, CalibrateRequest

router = APIRouter(tags=["analysis"])


def _tracks_path(video_id: int) -> Path:
    return settings.tracks_dir / f"{video_id}.json"


def _pitch_path(video_id: int) -> Path:
    return settings.tracks_dir / f"{video_id}_pitch.json"


def _analytics_path(video_id: int) -> Path:
    return settings.tracks_dir / f"{video_id}_analytics.json"


def _shots_path(video_id: int) -> Path:
    return settings.tracks_dir / f"{video_id}_shots.json"


def _matchdata_path(video_id: int) -> Path:
    return settings.tracks_dir / f"{video_id}_matchdata.json"


def _studio_path(video_id: int) -> Path:
    return settings.tracks_dir / f"{video_id}_studio.json"


def _playerstats_path(video_id: int) -> Path:
    return settings.tracks_dir / f"{video_id}_playerstats.json"


def _assign_path(video_id: int) -> Path:
    return settings.tracks_dir / f"{video_id}_assign.json"


@router.post("/videos/{video_id}/analyze")
def start_analysis(video_id: int, session: Session = Depends(get_session)):
    """Start (or resume) the durable staged pipeline for this video."""
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(404, "Video not found")
    run = start_analysis_pipeline(session, video_id)
    return run_as_dict(run)


@router.get("/jobs/{job_id}")
def job_status(job_id: str, session: Session = Depends(get_session)):
    try:
        run_id = int(job_id)
    except ValueError:
        raise HTTPException(404, "Job not found")
    run = get_run(session, run_id)
    if not run:
        raise HTTPException(404, "Job not found")
    return run_as_dict(run)


@router.get("/videos/{video_id}/tracks/exists")
def tracks_exist(video_id: int):
    return {"exists": _tracks_path(video_id).is_file()}


@router.get("/videos/{video_id}/tracks")
def get_tracks(video_id: int):
    path = _tracks_path(video_id)
    if not path.is_file():
        raise HTTPException(404, "No analysis for this video yet")
    return FileResponse(path, media_type="application/json")


@router.get("/videos/{video_id}/segments")
def get_segments(video_id: int):
    """Triage output: the camera-run segment map (main vs other)."""
    path = settings.tracks_dir / f"{video_id}_segments.json"
    if not path.is_file():
        raise HTTPException(404, "No segmentation for this video yet")
    return json.loads(path.read_text())


# --- Studio: telestration graphics drawn over the video ---


class StudioShape(BaseModel):
    id: str
    type: str
    color: str
    geom: list[list[float]]
    label: str | None = None
    pinnedTrackId: int | None = None
    pinPos: list[float] | None = None


class StudioDoc(BaseModel):
    shapes: list[StudioShape] = []


@router.get("/videos/{video_id}/studio")
def get_studio(video_id: int, session: Session = Depends(get_session)):
    """Return the saved telestration graphics for this video (or an empty set)."""
    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    path = _studio_path(video_id)
    if path.is_file():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except (ValueError, OSError):
            pass
    return {"shapes": []}


@router.put("/videos/{video_id}/studio")
def put_studio(
    video_id: int, payload: StudioDoc, session: Session = Depends(get_session)
):
    """Persist the telestration graphics as a JSON file in the tracks dir."""
    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    data = payload.model_dump(exclude_none=True)
    try:
        settings.ensure_dirs()
        _studio_path(video_id).write_text(json.dumps(data, indent=2), encoding="utf-8")
    except OSError as exc:
        raise HTTPException(500, f"Could not save studio graphics: {exc}") from exc
    return data


@router.get("/videos/{video_id}/tracks/summary")
def tracks_summary(video_id: int):
    """Lightweight summary without the (potentially large) per-frame data."""
    path = _tracks_path(video_id)
    if not path.is_file():
        raise HTTPException(404, "No analysis for this video yet")
    data = json.loads(path.read_text())
    return {k: v for k, v in data.items() if k != "frames"} | {
        "n_frames": len(data.get("frames", []))
    }


# --- Phase 2b: pitch calibration / heatmaps / auto-tagging ---


@router.post("/videos/{video_id}/calibrate")
def calibrate(video_id: int, payload: CalibrateRequest):
    """Compute homography from 4 image points and build heatmaps + distances."""
    tracks_path = _tracks_path(video_id)
    if not tracks_path.is_file():
        raise HTTPException(400, "Analyse the video before calibrating")
    tracks = json.loads(tracks_path.read_text())
    try:
        pitch = build_pitch_data(
            tracks, payload.img_points, payload.length, payload.width
        )
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc
    _pitch_path(video_id).write_text(json.dumps(pitch))
    return pitch


@router.get("/videos/{video_id}/pitch")
def get_pitch(video_id: int):
    path = _pitch_path(video_id)
    if not path.is_file():
        raise HTTPException(404, "No calibration for this video yet")
    return json.loads(path.read_text())


@router.post("/videos/{video_id}/autotag")
def autotag(video_id: int, session: Session = Depends(get_session)):
    """Generate reviewable AI events (ball in a final third) from the pitch data."""
    path = _pitch_path(video_id)
    if not path.is_file():
        raise HTTPException(400, "Calibrate the pitch before auto-tagging")
    pitch = json.loads(path.read_text())
    suggestions = autotag_final_third(pitch)

    created = 0
    for s in suggestions:
        session.add(Event(
            video_id=video_id, category_id=None, label=s["label"],
            start_ms=s["start_ms"], end_ms=s["end_ms"],
            source="ai", confidence=0.5,
        ))
        created += 1
    session.commit()
    return {"created": created}


# --- Phase 3a: possession & passing analytics ---


@router.post("/videos/{video_id}/analytics")
def compute_video_analytics(video_id: int):
    tracks_path = _tracks_path(video_id)
    if not tracks_path.is_file():
        raise HTTPException(400, "Analyse the video before computing analytics")
    tracks = json.loads(tracks_path.read_text())
    result = compute_analytics(tracks)
    _analytics_path(video_id).write_text(json.dumps(result))
    return result


@router.get("/videos/{video_id}/analytics")
def get_video_analytics(video_id: int):
    path = _analytics_path(video_id)
    if not path.is_file():
        raise HTTPException(404, "No analytics for this video yet")
    return json.loads(path.read_text())


@router.post("/videos/{video_id}/tag-turnovers")
def tag_turnovers(
    video_id: int, window_ms: int = 2000, session: Session = Depends(get_session)
):
    path = _analytics_path(video_id)
    if not path.is_file():
        raise HTTPException(400, "Compute analytics before tagging turnovers")
    data = json.loads(path.read_text())
    created = 0
    for ev in data.get("turnover_events", []):
        t = ev["t_ms"]
        label = f"Turnover (Team {'A' if ev['from_team'] == 0 else 'B'} lost ball)"
        session.add(Event(
            video_id=video_id, category_id=None, label=label,
            start_ms=max(0, t - window_ms), end_ms=t + window_ms,
            source="ai", confidence=0.5,
        ))
        created += 1
    session.commit()
    return {"created": created}


# --- Phase 3b: shots & xG ---


@router.post("/videos/{video_id}/shots")
def compute_shots(video_id: int):
    tracks_path = _tracks_path(video_id)
    pitch_path = _pitch_path(video_id)
    if not tracks_path.is_file():
        raise HTTPException(400, "Analyse the video first")
    if not pitch_path.is_file():
        raise HTTPException(400, "Calibrate the pitch before detecting shots")
    tracks = json.loads(tracks_path.read_text())
    pitch = json.loads(pitch_path.read_text())
    result = detect_shots(tracks, pitch)
    _shots_path(video_id).write_text(json.dumps(result))
    return result


@router.get("/videos/{video_id}/shots")
def get_shots(video_id: int):
    path = _shots_path(video_id)
    if not path.is_file():
        raise HTTPException(404, "No shots computed for this video yet")
    return json.loads(path.read_text())


@router.post("/videos/{video_id}/tag-shots")
def tag_shots(
    video_id: int, window_ms: int = 2500, session: Session = Depends(get_session)
):
    path = _shots_path(video_id)
    if not path.is_file():
        raise HTTPException(400, "Detect shots before tagging them")
    data = json.loads(path.read_text())
    created = 0
    for s in data.get("shots", []):
        t = s["t_ms"]
        team = "A" if s["team"] == 0 else "B" if s["team"] == 1 else "?"
        label = f"Shot (Team {team}, xG {s['xg']:.2f})"
        session.add(Event(
            video_id=video_id, category_id=None, label=label,
            start_ms=max(0, t - window_ms), end_ms=t + window_ms,
            source="ai", confidence=round(min(0.99, 0.4 + s["xg"]), 2),
        ))
        created += 1
    session.commit()
    return {"created": created}


# --- Phase 3c: natural-language query (Claude API) ---


def _build_context(video_id: int, session: Session) -> str:
    """Compact JSON of the match's data for grounding the LLM answer."""
    cats = {c.id: c.name for c in session.exec(select(Category)).all()}
    events = session.exec(
        select(Event).where(Event.video_id == video_id).order_by(Event.start_ms)
    ).all()
    ctx: dict = {
        "events": [
            {
                "code": cats.get(e.category_id) or e.label or "Event",
                "start_s": round(e.start_ms / 1000, 1),
                "end_s": round(e.end_ms / 1000, 1),
                "descriptors": e.descriptors,
                "source": e.source,
            }
            for e in events
        ],
        "n_events": len(events),
    }
    ap = _analytics_path(video_id)
    if ap.is_file():
        a = json.loads(ap.read_text())
        ctx["possession_pct"] = a.get("possession_pct")
        ctx["passes"] = a.get("passes")
        ctx["turnovers"] = a.get("turnovers")
    pp = _pitch_path(video_id)
    if pp.is_file():
        ctx["team_distance_m"] = json.loads(pp.read_text()).get("team_distance_m")
    sp = _shots_path(video_id)
    if sp.is_file():
        s = json.loads(sp.read_text())
        ctx["team_xg"] = s.get("team_xg")
        ctx["team_shots"] = s.get("team_shots")
    ctx["teams"] = {"0": "Team A", "1": "Team B"}
    return json.dumps(ctx)


@router.post("/videos/{video_id}/ask")
def ask(video_id: int, payload: AskRequest, session: Session = Depends(get_session)):
    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    if not user_settings.has_llm_key():
        raise HTTPException(
            400,
            "No AI provider key configured. Add a free Groq key in Settings to use AI chat.",
        )
    context = _build_context(video_id, session)
    try:
        answer = answer_question(payload.question, context)
    except Exception as exc:  # noqa: BLE001 - surface the LLM error to the client
        raise HTTPException(502, f"LLM request failed: {type(exc).__name__}: {exc}") from exc
    return {"answer": answer, "question": payload.question}


# --- Phase 5: clip-returning natural-language query ---


@router.post("/videos/{video_id}/query")
def query_video(video_id: int, payload: AskRequest, session: Session = Depends(get_session)):
    """Return a playable reel (event clips) + a one-line grounded summary."""
    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    if not user_settings.has_llm_key():
        raise HTTPException(
            400,
            "No AI provider key configured. Add a free Groq key in Settings to use AI chat.",
        )
    cats = {c.id: c.name for c in session.exec(select(Category)).all() if c.id}
    events = session.exec(
        select(Event).where(Event.video_id == video_id).order_by(Event.start_ms)
    ).all()

    def code_of(e: Event) -> str:
        return (cats.get(e.category_id) if e.category_id else None) or e.label or "Event"

    ev_list = [
        {
            "id": e.id, "code": code_of(e),
            "start_s": round(e.start_ms / 1000, 1), "end_s": round(e.end_ms / 1000, 1),
            "source": e.source, "descriptors": e.descriptors,
        }
        for e in events
    ]
    try:
        result = query_clips(payload.question, json.dumps(ev_list))
    except Exception as exc:  # noqa: BLE001 - surface the LLM error
        raise HTTPException(502, f"LLM request failed: {type(exc).__name__}: {exc}") from exc

    by_id = {e.id: e for e in events}
    clips = []
    for c in result.get("clips", []):
        ev = by_id.get(c.get("event_id"))
        if ev:
            clips.append({
                "event_id": ev.id, "start_ms": ev.start_ms, "end_ms": ev.end_ms,
                "label": code_of(ev), "reason": str(c.get("reason", "")),
            })
    return {"summary": result.get("summary", ""), "clips": clips, "question": payload.question}


# --- Real match data from API-Football (score, formations, lineups, stats) ---


@router.get("/videos/{video_id}/match-data")
def get_match_data(video_id: int, session: Session = Depends(get_session)):
    """Return previously-fetched real match data, or null if none saved."""
    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    path = _matchdata_path(video_id)
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except (ValueError, OSError):
            pass
    return None


class MatchSearchRequest(BaseModel):
    query: str


class MatchDataRequest(BaseModel):
    # Either a free-text description, or a precise fixture id from the browser.
    question: str = ""
    fixture_id: int | None = None


@router.post("/videos/{video_id}/match-search")
def search_matches(
    video_id: int, payload: MatchSearchRequest, session: Session = Depends(get_session)
):
    """Return candidate fixtures for a description so the user picks the exact one."""
    from ..providers import apifootball

    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    query = payload.query.strip()
    if not query:
        raise HTTPException(400, "Enter a team or 'Home vs Away' to search.")
    try:
        return apifootball.search_fixtures(query)
    except apifootball.ProviderError as exc:
        raise HTTPException(400, str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(502, f"Fixture search failed: {type(exc).__name__}: {exc}") from exc


@router.post("/videos/{video_id}/match-data")
def fetch_match_data(
    video_id: int, payload: MatchDataRequest, session: Session = Depends(get_session)
):
    """Load real match data (lineups, formations, stats, events) from
    API-Football and persist it — by exact fixture id, or from a description."""
    from ..providers import apifootball

    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    try:
        if payload.fixture_id is not None:
            data = apifootball.fetch_match_by_id(payload.fixture_id)
        else:
            description = payload.question.strip()
            if not description:
                raise HTTPException(400, "Provide a match description or a fixture id.")
            data = apifootball.fetch_match(description)
    except apifootball.ProviderError as exc:
        raise HTTPException(400, str(exc)) from exc
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001 - surface unexpected provider errors
        raise HTTPException(502, f"Match-data lookup failed: {type(exc).__name__}: {exc}") from exc
    try:
        _matchdata_path(video_id).write_text(json.dumps(data, indent=2), encoding="utf-8")
    except OSError:
        pass
    return data


# --- Per-player statistics (API-Football, real named players) ---


@router.get("/videos/{video_id}/player-stats")
def get_player_stats(video_id: int, session: Session = Depends(get_session)):
    """Return cached per-player stats for this video, or null if none saved."""
    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    path = _playerstats_path(video_id)
    if path.is_file():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except (ValueError, OSError):
            pass
    return None


@router.post("/videos/{video_id}/player-stats")
def fetch_player_stats(video_id: int, session: Session = Depends(get_session)):
    """Fetch per-player stats for the fixture already loaded on this video.

    Uses the fixture id from the saved match data, so the user loads a fixture
    first (via the match browser) and this pulls the named player stat lines.
    """
    from ..providers import apifootball

    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    md_path = _matchdata_path(video_id)
    if not md_path.is_file():
        raise HTTPException(400, "Load a match fixture first, then fetch player stats.")
    try:
        fixture_id = json.loads(md_path.read_text(encoding="utf-8")).get("fixture_id")
    except (ValueError, OSError):
        fixture_id = None
    if not fixture_id:
        raise HTTPException(400, "The loaded match has no fixture id to look up.")
    try:
        data = apifootball.fetch_player_stats(int(fixture_id))
    except apifootball.ProviderError as exc:
        raise HTTPException(400, str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(502, f"Player-stats lookup failed: {type(exc).__name__}: {exc}") from exc
    try:
        _playerstats_path(video_id).write_text(json.dumps(data, indent=2), encoding="utf-8")
    except OSError:
        pass
    return data


# --- Per-player heatmap (from CV tracks) + player↔track assignments ---


@router.get("/videos/{video_id}/player-heatmap")
def player_heatmap(video_id: int, track_id: int, session: Session = Depends(get_session)):
    """Heatmap for a single tracked player, in pitch space if the video is
    calibrated, else normalized image space (approximate)."""
    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    tpath = _tracks_path(video_id)
    if not tpath.is_file():
        raise HTTPException(400, "Analyse the video first to produce tracks.")
    tracks = json.loads(tpath.read_text(encoding="utf-8"))
    img_pts = None
    ppath = _pitch_path(video_id)
    if ppath.is_file():
        try:
            img_pts = json.loads(ppath.read_text(encoding="utf-8")).get("img_points")
        except (ValueError, OSError):
            img_pts = None
    return build_player_heatmap(tracks, track_id, img_pts)


class Assignments(BaseModel):
    # player full name -> CV track id
    map: dict[str, int] = {}


@router.get("/videos/{video_id}/assignments")
def get_assignments(video_id: int, session: Session = Depends(get_session)):
    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    path = _assign_path(video_id)
    if path.is_file():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except (ValueError, OSError):
            pass
    return {"map": {}}


@router.put("/videos/{video_id}/assignments")
def put_assignments(
    video_id: int, payload: Assignments, session: Session = Depends(get_session)
):
    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    data = payload.model_dump()
    try:
        settings.ensure_dirs()
        _assign_path(video_id).write_text(json.dumps(data, indent=2), encoding="utf-8")
    except OSError as exc:
        raise HTTPException(500, f"Could not save assignments: {exc}") from exc
    return data


# --- Phase 1: validation harness (score AI events vs the manual reference) ---


@router.get("/videos/{video_id}/validation")
def validate_video(video_id: int, session: Session = Depends(get_session)):
    if not session.get(Video, video_id):
        raise HTTPException(404, "Video not found")
    from validation.service import build_validation, write_report  # sibling package

    result = build_validation(video_id, session)
    try:
        write_report(result)
    except Exception:  # noqa: BLE001 - report persistence is best-effort
        pass
    return result
