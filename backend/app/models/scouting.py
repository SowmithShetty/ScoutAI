"""
ScoutAI - Scouting report and shortlist models.
"""

import uuid
from sqlalchemy import String, Integer, Float, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base
from app.models.base import TimestampMixin


class ScoutingReport(TimestampMixin, Base):
    """
    Individual scouting reports created by scouts or analysts
    for evaluated players.
    """

    __tablename__ = "scouting_reports"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    player_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("players.id"), nullable=False, index=True
    )
    scout_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )

    # ─── Assessment ────────────────────────────────────────────────────────
    overall_rating: Mapped[float] = mapped_column(
        Float, nullable=False, comment="Overall scout rating 1-10"
    )
    technical_rating: Mapped[float] = mapped_column(Float, default=7.0, nullable=False)
    tactical_rating: Mapped[float] = mapped_column(Float, default=7.0, nullable=False)
    physical_rating: Mapped[float] = mapped_column(Float, default=7.0, nullable=False)
    mental_rating: Mapped[float] = mapped_column(Float, default=7.0, nullable=False)

    # ─── Written Assessment ────────────────────────────────────────────────
    strengths: Mapped[str | None] = mapped_column(Text, nullable=True)
    weaknesses: Mapped[str | None] = mapped_column(Text, nullable=True)
    tactical_fit: Mapped[str | None] = mapped_column(Text, nullable=True)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)

    # ─── Recommendation ───────────────────────────────────────────────────
    recommendation: Mapped[str] = mapped_column(
        String(50), nullable=False, default="Monitor",
        comment="Sign, Monitor, Reject, Loan, Future Target"
    )
    risk_level: Mapped[str] = mapped_column(
        String(50), nullable=False, default="Medium",
        comment="Low, Medium, High"
    )
    match_context: Mapped[str | None] = mapped_column(
        Text, nullable=True,
        comment="Context of match(es) watched"
    )
    priority: Mapped[int] = mapped_column(
        Integer, default=3, nullable=False,
        comment="Priority 1 (highest) to 5 (lowest)"
    )

    # ─── Relationships ─────────────────────────────────────────────────────
    player = relationship("Player", back_populates="scouting_reports")
    scout = relationship("User", back_populates="scouting_reports")

    def __repr__(self) -> str:
        return f"<ScoutingReport player={self.player_id} rating={self.overall_rating}>"


class Shortlist(TimestampMixin, Base):
    """User-created shortlists for organizing scouted players."""

    __tablename__ = "shortlists"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    position_focus: Mapped[str | None] = mapped_column(String(50), nullable=True)
    is_shared: Mapped[bool] = mapped_column(default=False, nullable=False)

    # Relationships
    user = relationship("User", back_populates="shortlists")
    players = relationship(
        "ShortlistPlayer", back_populates="shortlist",
        cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Shortlist '{self.name}' by user={self.user_id}>"


class ShortlistPlayer(TimestampMixin, Base):
    """Association table linking players to shortlists with metadata."""

    __tablename__ = "shortlist_players"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    shortlist_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("shortlists.id"), nullable=False
    )
    player_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("players.id"), nullable=False
    )
    rank: Mapped[int | None] = mapped_column(Integer, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    score: Mapped[float | None] = mapped_column(Float, nullable=True)

    # Relationships
    shortlist = relationship("Shortlist", back_populates="players")
    player = relationship("Player")

    def __repr__(self) -> str:
        return f"<ShortlistPlayer shortlist={self.shortlist_id} player={self.player_id}>"
