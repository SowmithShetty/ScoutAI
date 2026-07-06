"""
ScoutAI - Transfer model for tracking player transfers.
"""

import uuid
from datetime import date
from sqlalchemy import String, Float, Date, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base
from app.models.base import TimestampMixin


class Transfer(TimestampMixin, Base):
    """Historical transfer records linking players between clubs."""

    __tablename__ = "transfers"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    player_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("players.id"), nullable=False, index=True
    )
    from_club_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("clubs.id"), nullable=True
    )
    to_club_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("clubs.id"), nullable=True
    )
    from_club_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    to_club_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    fee: Mapped[float] = mapped_column(
        Float, default=0.0, nullable=False, comment="Transfer fee in EUR"
    )
    transfer_type: Mapped[str] = mapped_column(
        String(50), nullable=False, default="Permanent",
        comment="Permanent, Loan, Free Transfer, End of Loan, Youth"
    )
    season: Mapped[str | None] = mapped_column(String(20), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    player = relationship("Player", back_populates="transfers")
    from_club = relationship("Club", foreign_keys=[from_club_id], back_populates="transfers_out")
    to_club = relationship("Club", foreign_keys=[to_club_id], back_populates="transfers_in")

    def __repr__(self) -> str:
        return f"<Transfer {self.from_club_name} → {self.to_club_name} ({self.fee}€)>"
