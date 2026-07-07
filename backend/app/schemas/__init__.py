"""
ScoutAI - Pydantic schemas for API request/response serialization.
"""

from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)
from app.schemas.player import (
    PlayerListResponse,
    PlayerDetailResponse,
    PlayerFilterParams,
    PlayerStatisticsResponse,
    PlayerBriefResponse,
)
from app.schemas.ai import (
    NLPBriefRequest,
    NLPBriefResponse,
    ScoutingRequirementsRequest,
    RecommendationResponse,
    SimilarityResponse,
    RoleClassificationResponse,
)

__all__ = [
    "LoginRequest",
    "RegisterRequest",
    "TokenResponse",
    "UserResponse",
    "PlayerListResponse",
    "PlayerDetailResponse", 
    "PlayerFilterParams",
    "PlayerStatisticsResponse",
    "PlayerBriefResponse",
    "NLPBriefRequest",
    "NLPBriefResponse",
    "ScoutingRequirementsRequest",
    "RecommendationResponse",
    "SimilarityResponse",
    "RoleClassificationResponse",
]

