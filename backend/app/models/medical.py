"""
ScoutAI - Medical records model for injury tracking.
"""

import uuid
from datetime import date
from sqlalchemy import String, Integer, Float, Date, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base
from app.models.base import TimestampMixin


class MedicalRecord(TimestampMixin, Base):
    """
    Medical/injury records for players. Used to calculate injury risk,
    availability, and recurring injury patterns.
    """

    __tablename__ = "medical_records"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    player_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("players.id"), nullable=False, index=True
    )
    injury_type: Mapped[str] = mapped_column(
        String(255), nullable=False,
        comment="e.g., ACL Tear, Hamstring Strain, Ankle Sprain"
    )
    body_part: Mapped[str] = mapped_column(
        String(100), nullable=False,
        comment="e.g., Knee, Hamstring, Ankle, Groin, Shoulder"
    )
    severity: Mapped[str] = mapped_column(
        String(50), nullable=False, default="Moderate",
        comment="Minor, Moderate, Severe, Career-Threatening"
    )
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    matches_missed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    days_out: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_recurring: Mapped[bool] = mapped_column(
        default=False, nullable=False,
        comment="Whether this is a recurring injury"
    )
    treatment: Mapped[str | None] = mapped_column(Text, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    player = relationship("Player", back_populates="medical_records")

    def __repr__(self) -> str:
        return f"<MedicalRecord {self.injury_type} ({self.severity})>"
