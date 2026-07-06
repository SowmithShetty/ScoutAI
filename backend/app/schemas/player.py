"""
ScoutAI - Player schemas for API serialization.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import date, datetime


# ─── Filter Parameters ────────────────────────────────────────────────────────

class PlayerFilterParams(BaseModel):
    """Query parameters for filtering the player database."""

    # Text search
    search: Optional[str] = Field(None, description="Search by player name")

    # Position & Role
    position: Optional[str] = Field(None, description="Filter by position")
    tactical_role: Optional[str] = None
    playing_style: Optional[str] = None

    # Demographics
    nationality: Optional[str] = None
    min_age: Optional[int] = Field(None, ge=15, le=45)
    max_age: Optional[int] = Field(None, ge=15, le=45)
    preferred_foot: Optional[str] = None

    # Physical
    min_height: Optional[int] = Field(None, ge=150, le=210)
    max_height: Optional[int] = Field(None, ge=150, le=210)

    # Club & League
    club_id: Optional[UUID] = None
    league: Optional[str] = None

    # Financial
    min_market_value: Optional[float] = None
    max_market_value: Optional[float] = None
    min_salary: Optional[float] = None
    max_salary: Optional[float] = None

    # Contract
    contract_expiry_before: Optional[date] = None

    # Ratings
    min_overall: Optional[float] = None
    max_overall: Optional[float] = None
    min_potential: Optional[float] = None

    # Availability
    availability: Optional[str] = None
    is_transfer_listed: Optional[bool] = None

    # Pagination
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)

    # Sorting
    sort_by: str = Field(default="overall_rating", description="Field to sort by")
    sort_order: str = Field(default="desc", pattern="^(asc|desc)$")


# ─── Response Schemas ──────────────────────────────────────────────────────────

class ClubBrief(BaseModel):
    """Brief club info for embedding in player responses."""
    id: UUID
    name: str
    logo_url: Optional[str] = None
    country: str

    model_config = {"from_attributes": True}


class PlayerBriefResponse(BaseModel):
    """Compact player representation for lists and tables."""
    id: UUID
    name: str
    age: int
    nationality: str
    position: str
    club: Optional[ClubBrief] = None
    market_value: float
    overall_rating: float
    potential: float
    image_url: Optional[str] = None
    preferred_foot: str
    availability: str
    is_transfer_listed: bool

    model_config = {"from_attributes": True}


class PlayerStatisticsResponse(BaseModel):
    """Per-season statistics for a player."""
    id: UUID
    season: str
    competition: Optional[str] = None
    matches: int
    starts: int
    minutes: int
    goals: int
    assists: int
    xg: float
    xg_assist: float
    xg_per_90: float
    xa_per_90: float
    pass_completion_pct: float
    progressive_passes: int
    progressive_carries: int
    key_passes: int
    successful_dribbles: int
    touches: int
    shots: int
    shots_on_target: int
    shot_creating_actions: int
    tackles: int
    tackles_won: int
    interceptions: int
    blocks: int
    aerial_wins: int
    pressures: int
    successful_pressures: int
    defensive_actions: int
    yellow_cards: int
    red_cards: int
    average_rating: float

    model_config = {"from_attributes": True}


class TransferResponse(BaseModel):
    """Transfer history entry."""
    id: UUID
    from_club_name: Optional[str] = None
    to_club_name: Optional[str] = None
    date: date
    fee: float
    transfer_type: str
    season: Optional[str] = None

    model_config = {"from_attributes": True}


class MedicalRecordResponse(BaseModel):
    """Medical/injury record."""
    id: UUID
    injury_type: str
    body_part: str
    severity: str
    start_date: date
    end_date: Optional[date] = None
    matches_missed: int
    days_out: int
    is_recurring: bool

    model_config = {"from_attributes": True}


class PlayerDetailResponse(BaseModel):
    """Full player profile with all details, stats, and history."""
    # Identity
    id: UUID
    name: str
    full_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    age: int
    nationality: str
    second_nationality: Optional[str] = None
    image_url: Optional[str] = None

    # Physical
    height: Optional[int] = None
    weight: Optional[int] = None
    preferred_foot: str

    # Position
    position: str
    secondary_positions: Optional[str] = None
    playing_style: Optional[str] = None
    tactical_role: Optional[str] = None

    # Club & Contract
    club: Optional[ClubBrief] = None
    jersey_number: Optional[int] = None
    contract_start: Optional[date] = None
    contract_expiry: Optional[date] = None
    on_loan: bool
    loan_club: Optional[str] = None

    # Financial
    market_value: float
    salary: float
    release_clause: Optional[float] = None
    agent: Optional[str] = None

    # Ratings
    overall_rating: float
    potential: float
    form: float

    # Availability
    availability: str
    is_transfer_listed: bool

    # Attributes
    pace: int
    shooting: int
    passing: int
    dribbling: int
    defending: int
    physical: int
    vision: int
    creativity: int
    aggression: int
    leadership: int
    heading: int
    finishing: int
    strength: int
    weak_foot: int
    skill_moves: int

    # Text
    strengths: Optional[str] = None
    weaknesses: Optional[str] = None
    ai_summary: Optional[str] = None

    # Nested data
    statistics: List[PlayerStatisticsResponse] = []
    transfers: List[TransferResponse] = []
    medical_records: List[MedicalRecordResponse] = []

    model_config = {"from_attributes": True}


class PlayerListResponse(BaseModel):
    """Paginated player list response."""
    players: List[PlayerBriefResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
