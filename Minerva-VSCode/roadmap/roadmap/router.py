"""
roadmap/roadmap/router.py

Exposes MINERVA's generate_roadmap() as REST endpoints, following the
same module pattern as the Assessment module (see
"Member 1 - Backend Handoff.md"):

    Frontend -> Backend (this router) -> roadmap_engine.py -> DB -> Frontend

Mount this in main.py with:

    from roadmap.roadmap.router import router as roadmap_router
    app.include_router(roadmap_router, prefix="/api/roadmap", tags=["roadmap"])

Endpoints:
    POST /api/roadmap/generate   -> run the engine, return + (optionally) persist
    GET  /api/roadmap/result/{id} -> fetch a previously generated roadmap
"""

import json
import os
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any, Dict, Optional, Union, List
import uuid

from .roadmap_engine import generate_roadmap

router = APIRouter()

# --- Persistent file-based roadmap store --------------------------------
# Roadmaps are saved to disk so they survive service restarts (e.g. Render).
_STORE_DIR = Path(__file__).resolve().parent / "roadmap_store"
_STORE_DIR.mkdir(exist_ok=True)

_ROADMAP_STORE: Dict[str, Any] = {}


def _save_roadmap(roadmap_id: str, result: Any) -> None:
    _ROADMAP_STORE[roadmap_id] = result
    path = _STORE_DIR / f"{roadmap_id}.json"
    path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")


def _get_roadmap(roadmap_id: str):
    if roadmap_id in _ROADMAP_STORE:
        return _ROADMAP_STORE[roadmap_id]
    path = _STORE_DIR / f"{roadmap_id}.json"
    if path.exists():
        data = json.loads(path.read_text(encoding="utf-8"))
        _ROADMAP_STORE[roadmap_id] = data
        return data
    return None
# --------------------------------------------------------------------------


class RoadmapGenerateRequest(BaseModel):
    journey: int                      # 1, 2, or 3
    journey_output: Dict[str, Any]    # raw Journey JSON (from assessment/career matching)
    weekly_hours: Optional[float] = None
    goal: Optional[str] = None
    target_role: Optional[str] = None
    career: Optional[str] = None
    preferred_days: Optional[int] = None
    use_model: bool = True            # False = deterministic, no Groq call
    user_id: Optional[str] = None     # so .NET can tag/track whose roadmap this is


class RoadmapGenerateResponse(BaseModel):
    roadmap_id: str
    result: Union[Dict[str, Any], List[Dict[str, Any]]]
    engine_version: str = "j1-all-careers-v1"


@router.post("/generate", response_model=RoadmapGenerateResponse)
def generate(req: RoadmapGenerateRequest) -> RoadmapGenerateResponse:
    if req.journey not in (1, 2, 3):
        raise HTTPException(status_code=400, detail="journey must be 1, 2, or 3")

    try:
        result = generate_roadmap(
            journey=req.journey,
            journey_output=req.journey_output,
            weekly_hours=req.weekly_hours,
            goal=req.goal,
            target_role=req.target_role,
            career=req.career,
            preferred_days=req.preferred_days,
            use_model=req.use_model,
        )
    except (ValueError, TypeError) as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        # Groq failures are already handled internally via fallback
        # (BACKEND_INTEGRATION_GUIDE.md section 7) - unexpected error.
        raise HTTPException(status_code=500, detail=f"roadmap generation failed: {e}")

    # persist - unique id per call, avoids the output/roadmap.json
    # filename-collision issue called out in the integration guide
    roadmap_id = str(uuid.uuid4())
    _save_roadmap(roadmap_id, result)

    return RoadmapGenerateResponse(
        roadmap_id=roadmap_id,
        result=result,
        engine_version="j1-all-careers-v1",
    )


@router.get("/result/{roadmap_id}")
def get_result(roadmap_id: str):
    result = _get_roadmap(roadmap_id)
    if result is None:
        raise HTTPException(status_code=404, detail="roadmap not found")
    return result