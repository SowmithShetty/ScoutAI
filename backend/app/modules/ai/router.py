"""
ScoutAI - AI Router

FastAPI endpoints for NLP requirement parsing, candidate recommendation,
player similarity search, and tactical role classification.
"""

import sys
from pathlib import Path
# Dynamically add workspace root to PYTHONPATH so we can import 'ai' package
sys.path.append(str(Path(__file__).resolve().parents[4]))

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from uuid import UUID
from typing import List, Dict, Any

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.player import Player, PlayerStatistics
from app.models.club import Club
from app.schemas.ai import (
    NLPBriefRequest,
    NLPBriefResponse,
    ScoutingRequirementsRequest,
    RecommendationResponse,
    RecommendationCandidate,
    DimensionScores,
    SimilarityResponse,
    SimilarityCandidate,
    RoleClassificationResponse,
    RoleClassification,
)
from app.schemas.player import PlayerBriefResponse, ClubBrief

# Import AI models from the workspace root 'ai' folder
from ai.models.nlp_parser import parse_requirements
from ai.models.recommendation_engine import RecommendationEngine
from ai.models.similarity import PlayerSimilarityEngine
from ai.models.role_classifier import classify_role, get_primary_role
from ai.models.medical_predictor import MedicalRiskPredictor
from ai.models.financial_roi import FinancialROIModel
from ai.models.age_curve import AgeCurveModel
from ai.models.squad_depth import SquadDepthPlanner


router = APIRouter(prefix="/ai", tags=["AI Engine"])

@router.post("/parse-brief", response_model=NLPBriefResponse)
async def parse_scouting_brief(
    request: NLPBriefRequest,
    current_user: Any = Depends(get_current_user),
):
    """
    Parse a natural language scouting brief to extract structured requirements.
    For example: "Looking for a striker under 25, high pressing style, max €80M budget."
    """
    try:
        parsed = parse_requirements(request.brief)
        return NLPBriefResponse(**parsed)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error parsing scouting brief: {str(e)}"
        )

@router.post("/recommend", response_model=RecommendationResponse)
async def get_player_recommendations(
    requirements: ScoutingRequirementsRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    """
    Get ranked player recommendations matching structured scouting requirements.
    Uses multi-criteria decision models across 6 dimensions.
    """
    # 1. Fetch candidates from database
    # For performance, we fetch all players and filter/rank them in memory
    query = select(Player).options(
        selectinload(Player.club),
        selectinload(Player.statistics),
        selectinload(Player.medical_records),
    )
    
    # Filter by position if specified
    if requirements.position:
        query = query.where(Player.position == requirements.position)
        
    # Filter by age if specified
    if requirements.max_age:
        query = query.where(Player.age <= requirements.max_age)
    if requirements.min_age:
        query = query.where(Player.age >= requirements.min_age)

    # Filter by budget if specified
    if requirements.budget:
        query = query.where(Player.market_value <= requirements.budget)

    result = await db.execute(query)
    players = result.scalars().all()

    # 2. Score candidates using the RecommendationEngine
    engine = RecommendationEngine()
    candidates_scored = []
    
    for p in players:
        # Convert SQLAlchemy object to dict for the engine
        p_dict = p.to_dict() if hasattr(p, "to_dict") else {
            "id": p.id,
            "name": p.name,
            "age": p.age,
            "position": p.position,
            "overall_rating": p.overall_rating,
            "potential": p.potential,
            "form": p.form,
            "market_value": p.market_value,
            "salary": p.salary,
            "availability": p.availability,
            "is_transfer_listed": p.is_transfer_listed,
            "contract_expiry": p.contract_expiry,
            "medical_records": [m.__dict__ for m in p.medical_records] if p.medical_records else [],
            # Core attributes
            "pace": p.pace, "shooting": p.shooting, "passing": p.passing, "dribbling": p.dribbling,
            "defending": p.defending, "physical": p.physical, "vision": p.vision, "creativity": p.creativity,
            "aggression": p.aggression, "leadership": p.leadership, "heading": p.heading, "finishing": p.finishing,
            "strength": p.strength,
        }
        
        # Get latest statistics
        latest_stats = None
        if p.statistics:
            # Sort stats by season descending and pick latest
            sorted_stats = sorted(p.statistics, key=lambda s: s.season, reverse=True)
            latest_stats = sorted_stats[0].__dict__ if hasattr(sorted_stats[0], "__dict__") else sorted_stats[0]
            
        req_dict = requirements.model_dump()
        scored = engine.score_candidate(p_dict, req_dict, latest_stats)
        
        # Build Pydantic response models
        club_brief = None
        if p.club:
            club_brief = ClubBrief(
                id=p.club.id,
                name=p.club.name,
                logo_url=p.club.logo_url,
                country=p.club.country,
            )
            
        player_brief = PlayerBriefResponse(
            id=p.id,
            name=p.name,
            age=p.age,
            nationality=p.nationality,
            position=p.position,
            club=club_brief,
            market_value=p.market_value,
            overall_rating=p.overall_rating,
            potential=p.potential,
            image_url=p.image_url,
            preferred_foot=p.preferred_foot,
            availability=p.availability,
            is_transfer_listed=p.is_transfer_listed,
        )
        
        dim_scores = DimensionScores(
            performance=scored["dimension_scores"]["performance"],
            tactical_fit=scored["dimension_scores"]["tactical_fit"],
            medical=scored["dimension_scores"]["medical"],
            age_potential=scored["dimension_scores"]["age_potential"],
            financial=scored["dimension_scores"]["financial"],
            availability=scored["dimension_scores"]["availability"],
        )
        
        candidates_scored.append(
            RecommendationCandidate(
                player=player_brief,
                final_score=scored["final_score"],
                dimension_scores=dim_scores,
                explanations=scored["explanations"],
                summary=scored["summary"],
                recommendation=scored["recommendation"],
            )
        )

    # Sort candidates by final score descending
    candidates_scored.sort(key=lambda x: x.final_score, reverse=True)

    # Limit to top 20 candidates
    return RecommendationResponse(
        requirements=requirements,
        candidates=candidates_scored[:20],
    )

@router.get("/similarity/{player_id}", response_model=SimilarityResponse)
async def get_similar_players(
    player_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    """
    Find players with similar attributes and profile to the target player using Cosine Similarity.
    """
    # 1. Fetch all players
    query = select(Player).options(
        selectinload(Player.club),
        selectinload(Player.statistics),
    )
    result = await db.execute(query)
    all_players = result.scalars().all()
    
    # 2. Check if target player exists
    target_player = next((p for p in all_players if p.id == player_id), None)
    if not target_player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target player not found",
        )

    # Helper to serialize player object to dict
    def player_to_dict(p):
        return {
            "id": str(p.id),
            "name": p.name,
            "age": p.age,
            "position": p.position,
            "overall_rating": p.overall_rating,
            "potential": p.potential,
            "market_value": p.market_value,
            "club_id": str(p.club_id) if p.club_id else None,
            "pace": p.pace, "shooting": p.shooting, "passing": p.passing, "dribbling": p.dribbling,
            "defending": p.defending, "physical": p.physical, "vision": p.vision, "creativity": p.creativity,
            "aggression": p.aggression, "leadership": p.leadership, "heading": p.heading, "finishing": p.finishing,
            "strength": p.strength,
        }

    players_list = [player_to_dict(p) for p in all_players]
    
    # Get latest statistics maps
    stats_map = {}
    for p in all_players:
        if p.statistics:
            sorted_stats = sorted(p.statistics, key=lambda s: s.season, reverse=True)
            stats_map[str(p.id)] = sorted_stats[0].__dict__ if hasattr(sorted_stats[0], "__dict__") else sorted_stats[0]

    # 3. Compute similarities
    engine = PlayerSimilarityEngine()
    engine.index_players(players_list, stats_map)
    similar = engine.find_similar(str(player_id), top_k=10, position_filter=target_player.position)

    # 4. Map back to schema format
    similar_candidates = []
    for s in similar:
        # Find original player object to get full detail/club
        p_obj = next((p for p in all_players if str(p.id) == s["player"]["id"]), None)
        if not p_obj:
            continue
            
        club_brief = None
        if p_obj.club:
            club_brief = ClubBrief(
                id=p_obj.club.id,
                name=p_obj.club.name,
                logo_url=p_obj.club.logo_url,
                country=p_obj.club.country,
            )
            
        player_brief = PlayerBriefResponse(
            id=p_obj.id,
            name=p_obj.name,
            age=p_obj.age,
            nationality=p_obj.nationality,
            position=p_obj.position,
            club=club_brief,
            market_value=p_obj.market_value,
            overall_rating=p_obj.overall_rating,
            potential=p_obj.potential,
            image_url=p_obj.image_url,
            preferred_foot=p_obj.preferred_foot,
            availability=p_obj.availability,
            is_transfer_listed=p_obj.is_transfer_listed,
        )
        
        similar_candidates.append(
            SimilarityCandidate(
                player=player_brief,
                similarity_score=s["similarity_score"],
                similarity_breakdown=s["similarity_breakdown"],
            )
        )

    return SimilarityResponse(
        target_player_id=player_id,
        similar_players=similar_candidates,
    )

@router.get("/role-classification/{player_id}", response_model=RoleClassificationResponse)
async def get_player_role_classification(
    player_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    """
    Get tactical role classification fit metrics for a player.
    Classifies players into specialized roles such as "Sweeper Keeper", "Inverted Winger", etc.
    """
    query = select(Player).where(Player.id == player_id)
    result = await db.execute(query)
    player = result.scalar_one_or_none()
    
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found",
        )

    player_dict = {
        "id": str(player.id),
        "name": player.name,
        "position": player.position,
        "pace": player.pace, "shooting": player.shooting, "passing": player.passing, "dribbling": player.dribbling,
        "defending": player.defending, "physical": player.physical, "vision": player.vision, "creativity": player.creativity,
        "aggression": player.aggression, "leadership": player.leadership, "heading": player.heading, "finishing": player.finishing,
        "strength": player.strength,
    }

    classifications_raw = classify_role(player_dict)
    primary_role, confidence = get_primary_role(player_dict)

    classifications = [
        RoleClassification(
            role=c["role"],
            score=c["score"],
            explanation=c["explanation"],
        ) for c in classifications_raw
    ]

    return RoleClassificationResponse(
        player_id=player.id,
        player_name=player.name,
        primary_role=primary_role,
        confidence=confidence,
        classifications=classifications,
    )

@router.get("/medical-risk/{player_id}")
async def get_player_medical_risk(
    player_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    """Assess injury risk category, expected days out, and recurrence patterns."""
    query = select(Player).options(selectinload(Player.medical_records)).where(Player.id == player_id)
    result = await db.execute(query)
    player = result.scalar_one_or_none()
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
        
    records = [m.__dict__ for m in player.medical_records] if player.medical_records else []
    return MedicalRiskPredictor.predict_risk(records)

@router.get("/financial-roi/{player_id}")
async def get_player_financial_roi(
    player_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    """Compute annual FFP cost amortizations and 3-year resale ROI predictions."""
    query = select(Player).where(Player.id == player_id)
    result = await db.execute(query)
    player = result.scalar_one_or_none()
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
        
    return FinancialROIModel.calculate_roi_and_ffp(
        market_value=player.market_value,
        salary=player.salary,
        age=player.age,
        overall=player.overall_rating,
        potential=player.potential,
    )

@router.get("/age-trajectory/{player_id}")
async def get_player_age_trajectory(
    player_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    """Project player OVR ratings, goals, and assists values for the next 5 years."""
    query = select(Player).options(selectinload(Player.statistics)).where(Player.id == player_id)
    result = await db.execute(query)
    player = result.scalar_one_or_none()
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
        
    # Get average goals and assists from statistics
    goals = 0.0
    assists = 0.0
    if player.statistics:
        sorted_stats = sorted(player.statistics, key=lambda s: s.season, reverse=True)
        latest = sorted_stats[0]
        goals = float(latest.goals)
        assists = float(latest.assists)

    return AgeCurveModel.project_trajectory(
        age=player.age,
        position=player.position,
        overall=player.overall_rating,
        potential=player.potential,
        current_goals=goals,
        current_assists=assists,
    )

@router.get("/squad-depth")
async def get_squad_depth_and_successors(
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    """Evaluate squad depth per position and list recommended successor candidates."""
    # Fetch all players
    query = select(Player).options(selectinload(Player.club))
    result = await db.execute(query)
    all_players = result.scalars().all()
    
    # We'll mock the 'squad_players' as players of one specific club (e.g. Manchester City or Arsenal)
    # and the 'candidates' as the rest of the players in the database.
    if not all_players:
        return []
        
    # Pick the most common club as the user's squad
    clubs_list = list(set([p.club_name for p in all_players if p.club_name]))
    target_club = clubs_list[0] if clubs_list else None
    
    squad = [p.to_dict() if hasattr(p, "to_dict") else p.__dict__ for p in all_players if p.club_name == target_club]
    candidates = [p.to_dict() if hasattr(p, "to_dict") else p.__dict__ for p in all_players if p.club_name != target_club]
    
    # Simple formatting cleanup for dictionary conversion
    def clean_p(p):
        return {
            "id": str(p.get("id")),
            "name": p.get("name"),
            "age": p.get("age"),
            "position": p.get("position"),
            "overall_rating": p.get("overall_rating"),
            "potential": p.get("potential"),
            "market_value": p.get("market_value"),
            "club_name": p.get("club_name"),
            "contract_expiry": str(p.get("contract_expiry", "")),
        }
        
    clean_squad = [clean_p(p) for p in squad]
    clean_candidates = [clean_p(p) for p in candidates]
    
    return SquadDepthPlanner.evaluate_squad(clean_squad, clean_candidates)

