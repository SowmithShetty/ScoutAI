"""
ScoutAI Backend - SQLAlchemy ORM Models

All database models for the ScoutAI platform.
Uses SQLAlchemy 2.0 mapped_column style for type safety.
"""

from app.models.base import TimestampMixin
from app.models.user import User
from app.models.club import Club, Competition
from app.models.player import Player, PlayerStatistics
from app.models.transfer import Transfer
from app.models.medical import MedicalRecord
from app.models.scouting import ScoutingReport, Shortlist, ShortlistPlayer

__all__ = [
    "TimestampMixin",
    "User",
    "Club",
    "Competition",
    "Player",
    "PlayerStatistics",
    "Transfer",
    "MedicalRecord",
    "ScoutingReport",
    "Shortlist",
    "ShortlistPlayer",
]
