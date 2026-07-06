"""
ScoutAI - Player and PlayerStatistics models.

The Player model is the central entity of the platform.
PlayerStatistics stores per-season performance data.
"""

import uuid
from datetime import date
from sqlalchemy import (
    String, Integer, Float, Date, Text, Boolean,
    ForeignKey, Index,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, ARRAY

from app.core.database import Base
from app.models.base import TimestampMixin


class Player(TimestampMixin, Base):
    """
    Football player profile with biographical data, contract details,
    and market information.
    """

    __tablename__ = "players"

    # ─── Identity ──────────────────────────────────────────────────────────
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    full_name: Mapped[str | None] = mapped_column(String(500), nullable=True)
    date_of_birth: Mapped[date | None] = mapped_column(Date, nullable=True)
    age: Mapped[int] = mapped_column(Integer, nullable=False, default=25)
    nationality: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    second_nationality: Mapped[str | None] = mapped_column(String(100), nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # ─── Physical ──────────────────────────────────────────────────────────
    height: Mapped[int | None] = mapped_column(
        Integer, nullable=True, comment="Height in centimeters"
    )
    weight: Mapped[int | None] = mapped_column(
        Integer, nullable=True, comment="Weight in kilograms"
    )
    preferred_foot: Mapped[str] = mapped_column(
        String(10), nullable=False, default="Right"
    )

    # ─── Position & Playing Style ──────────────────────────────────────────
    position: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    secondary_positions: Mapped[str | None] = mapped_column(
        Text, nullable=True, comment="Comma-separated secondary positions"
    )
    playing_style: Mapped[str | None] = mapped_column(String(100), nullable=True)
    tactical_role: Mapped[str | None] = mapped_column(String(100), nullable=True)

    # ─── Club & Contract ───────────────────────────────────────────────────
    club_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("clubs.id"), nullable=True
    )
    jersey_number: Mapped[int | None] = mapped_column(Integer, nullable=True)
    contract_start: Mapped[date | None] = mapped_column(Date, nullable=True)
    contract_expiry: Mapped[date | None] = mapped_column(Date, nullable=True)
    on_loan: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    loan_club: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # ─── Market & Financial ────────────────────────────────────────────────
    market_value: Mapped[float] = mapped_column(
        Float, default=0.0, nullable=False, comment="Market value in EUR"
    )
    salary: Mapped[float] = mapped_column(
        Float, default=0.0, nullable=False, comment="Weekly salary in EUR"
    )
    release_clause: Mapped[float | None] = mapped_column(
        Float, nullable=True, comment="Release clause in EUR"
    )
    agent: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # ─── Ratings & Potential ───────────────────────────────────────────────
    overall_rating: Mapped[float] = mapped_column(
        Float, default=70.0, nullable=False
    )
    potential: Mapped[float] = mapped_column(
        Float, default=75.0, nullable=False
    )
    form: Mapped[float] = mapped_column(
        Float, default=7.0, nullable=False, comment="Current form rating 1-10"
    )

    # ─── Availability ──────────────────────────────────────────────────────
    availability: Mapped[str] = mapped_column(
        String(50), default="Available", nullable=False,
        comment="Available, Injured, Suspended, International Duty"
    )
    is_transfer_listed: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )

    # ─── Attributes (0-100 scale) ──────────────────────────────────────────
    pace: Mapped[int] = mapped_column(Integer, default=70, nullable=False)
    shooting: Mapped[int] = mapped_column(Integer, default=65, nullable=False)
    passing: Mapped[int] = mapped_column(Integer, default=70, nullable=False)
    dribbling: Mapped[int] = mapped_column(Integer, default=68, nullable=False)
    defending: Mapped[int] = mapped_column(Integer, default=50, nullable=False)
    physical: Mapped[int] = mapped_column(Integer, default=70, nullable=False)
    vision: Mapped[int] = mapped_column(Integer, default=65, nullable=False)
    creativity: Mapped[int] = mapped_column(Integer, default=60, nullable=False)
    aggression: Mapped[int] = mapped_column(Integer, default=55, nullable=False)
    leadership: Mapped[int] = mapped_column(Integer, default=50, nullable=False)
    heading: Mapped[int] = mapped_column(Integer, default=60, nullable=False)
    finishing: Mapped[int] = mapped_column(Integer, default=60, nullable=False)
    strength: Mapped[int] = mapped_column(Integer, default=65, nullable=False)
    weak_foot: Mapped[int] = mapped_column(
        Integer, default=3, nullable=False, comment="Weak foot ability 1-5"
    )
    skill_moves: Mapped[int] = mapped_column(
        Integer, default=3, nullable=False, comment="Skill moves rating 1-5"
    )

    # ─── Summary Text ──────────────────────────────────────────────────────
    strengths: Mapped[str | None] = mapped_column(
        Text, nullable=True, comment="Comma-separated strengths"
    )
    weaknesses: Mapped[str | None] = mapped_column(
        Text, nullable=True, comment="Comma-separated weaknesses"
    )
    ai_summary: Mapped[str | None] = mapped_column(
        Text, nullable=True, comment="AI-generated player summary"
    )

    # ─── Relationships ─────────────────────────────────────────────────────
    club = relationship("Club", back_populates="players")
    statistics = relationship(
        "PlayerStatistics", back_populates="player",
        cascade="all, delete-orphan", order_by="PlayerStatistics.season.desc()"
    )
    transfers = relationship(
        "Transfer", back_populates="player",
        cascade="all, delete-orphan", order_by="Transfer.date.desc()"
    )
    medical_records = relationship(
        "MedicalRecord", back_populates="player",
        cascade="all, delete-orphan", order_by="MedicalRecord.start_date.desc()"
    )
    scouting_reports = relationship(
        "ScoutingReport", back_populates="player",
        cascade="all, delete-orphan"
    )

    # ─── Indexes ───────────────────────────────────────────────────────────
    __table_args__ = (
        Index("idx_player_position_age", "position", "age"),
        Index("idx_player_nationality", "nationality"),
        Index("idx_player_market_value", "market_value"),
        Index("idx_player_club", "club_id"),
    )

    def __repr__(self) -> str:
        return f"<Player {self.name} ({self.position})>"


class PlayerStatistics(TimestampMixin, Base):
    """
    Per-season performance statistics for a player.
    Includes standard metrics and advanced analytics (xG, xA, etc.).
    """

    __tablename__ = "player_statistics"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    player_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("players.id"), nullable=False, index=True
    )
    season: Mapped[str] = mapped_column(
        String(20), nullable=False, comment="e.g., 2024-25"
    )
    competition: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # ─── Appearances ───────────────────────────────────────────────────────
    matches: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    starts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    minutes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # ─── Goals & Assists ───────────────────────────────────────────────────
    goals: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    assists: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    penalties_scored: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    penalties_missed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # ─── Expected Metrics ──────────────────────────────────────────────────
    xg: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    xg_assist: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    xg_per_90: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    xa_per_90: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    # ─── Passing ───────────────────────────────────────────────────────────
    passes_completed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    passes_attempted: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    pass_completion_pct: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    progressive_passes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    key_passes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    through_balls: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    long_passes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    crosses: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # ─── Carrying & Dribbling ──────────────────────────────────────────────
    progressive_carries: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    successful_dribbles: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    dribbles_attempted: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    touches: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    touches_in_box: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # ─── Shooting ──────────────────────────────────────────────────────────
    shots: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    shots_on_target: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    shot_creating_actions: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    goal_creating_actions: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # ─── Defending ─────────────────────────────────────────────────────────
    tackles: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    tackles_won: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    interceptions: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    blocks: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    clearances: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    aerial_wins: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    aerial_losses: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # ─── Pressing ──────────────────────────────────────────────────────────
    pressures: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    successful_pressures: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    defensive_actions: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # ─── Discipline ────────────────────────────────────────────────────────
    yellow_cards: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    red_cards: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    fouls_committed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    fouls_won: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # ─── Rating ────────────────────────────────────────────────────────────
    average_rating: Mapped[float] = mapped_column(
        Float, default=6.5, nullable=False, comment="Average match rating 1-10"
    )

    # ─── Relationships ─────────────────────────────────────────────────────
    player = relationship("Player", back_populates="statistics")

    __table_args__ = (
        Index("idx_stats_player_season", "player_id", "season"),
    )

    def __repr__(self) -> str:
        return f"<PlayerStatistics player={self.player_id} season={self.season}>"
