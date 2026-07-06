"""
ScoutAI - Club and Competition models.
"""

import uuid
from sqlalchemy import String, Integer, Float, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base
from app.models.base import TimestampMixin


class Competition(TimestampMixin, Base):
    """Football competitions / leagues (e.g., Premier League, La Liga)."""

    __tablename__ = "competitions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    country: Mapped[str] = mapped_column(String(100), nullable=False)
    tier: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    logo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # Relationships
    clubs = relationship("Club", back_populates="competition")

    def __repr__(self) -> str:
        return f"<Competition {self.name}>"


class Club(TimestampMixin, Base):
    """Football clubs participating in competitions."""

    __tablename__ = "clubs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    short_name: Mapped[str | None] = mapped_column(String(10), nullable=True)
    country: Mapped[str] = mapped_column(String(100), nullable=False)
    competition_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("competitions.id"), nullable=True
    )
    logo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    stadium: Mapped[str | None] = mapped_column(String(255), nullable=True)
    budget: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    wage_budget: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    primary_color: Mapped[str | None] = mapped_column(String(7), nullable=True)
    secondary_color: Mapped[str | None] = mapped_column(String(7), nullable=True)

    # Relationships
    competition = relationship("Competition", back_populates="clubs")
    players = relationship("Player", back_populates="club")
    staff = relationship("User", back_populates="club")
    transfers_in = relationship(
        "Transfer", foreign_keys="Transfer.to_club_id", back_populates="to_club"
    )
    transfers_out = relationship(
        "Transfer", foreign_keys="Transfer.from_club_id", back_populates="from_club"
    )

    def __repr__(self) -> str:
        return f"<Club {self.name}>"
