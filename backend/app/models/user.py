"""
ScoutAI - User model for authentication and role-based access.
"""

import uuid
from sqlalchemy import String, Boolean, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base
from app.models.base import TimestampMixin


class User(TimestampMixin, Base):
    """
    User accounts for scouts, analysts, managers, and other club staff.
    Each user has a role that determines their access permissions.
    """

    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=False, index=True
    )
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(
        String(50), nullable=False, default="guest"
    )
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    club_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("clubs.id"), nullable=True
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    club = relationship("Club", back_populates="staff")
    scouting_reports = relationship("ScoutingReport", back_populates="scout")
    shortlists = relationship("Shortlist", back_populates="user")

    def __repr__(self) -> str:
        return f"<User {self.email} ({self.role})>"
