"""
ScoutAI - AI Schemas

Pydantic schemas for AI recommendations, NLP parsing, similarity search,
and tactical role classification request/response validation.
"""

from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from uuid import UUID
from app.schemas.player import PlayerBriefResponse

class NLPBriefRequest(BaseModel):
    brief: str = Field(..., description="Natural language recruitment brief from sporting director or manager")

class NLPBriefResponse(BaseModel):
    position: Optional[str] = None
    budget: Optional[float] = None
    min_age: Optional[int] = None
    max_age: Optional[int] = None
    style: Optional[str] = None
    formation: Optional[str] = None
    preferred_foot: Optional[str] = None
    attributes: Dict[str, int] = {}
    raw_priorities: List[str] = []

class ScoutingRequirementsRequest(BaseModel):
    position: Optional[str] = None
    min_age: Optional[int] = 16
    max_age: Optional[int] = 35
    budget: Optional[float] = None
    style: Optional[str] = None
    formation: Optional[str] = None
    preferred_foot: Optional[str] = None
    attributes: Dict[str, int] = {}

class DimensionScores(BaseModel):
    performance: float
    tactical_fit: float
    medical: float
    age_potential: float
    financial: float
    availability: float

class RecommendationCandidate(BaseModel):
    player: PlayerBriefResponse
    final_score: float
    dimension_scores: DimensionScores
    explanations: Dict[str, str]
    summary: str
    recommendation: str

class RecommendationResponse(BaseModel):
    requirements: ScoutingRequirementsRequest
    candidates: List[RecommendationCandidate]

class SimilarityCandidate(BaseModel):
    player: PlayerBriefResponse
    similarity_score: float
    similarity_breakdown: Dict[str, float]

class SimilarityResponse(BaseModel):
    target_player_id: UUID
    similar_players: List[SimilarityCandidate]

class RoleClassification(BaseModel):
    role: str
    score: float
    explanation: str

class RoleClassificationResponse(BaseModel):
    player_id: UUID
    player_name: str
    primary_role: str
    confidence: float
    classifications: List[RoleClassification]
