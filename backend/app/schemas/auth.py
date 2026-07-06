"""
ScoutAI - Authentication schemas.
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from uuid import UUID
from datetime import datetime


class LoginRequest(BaseModel):
    """Login request with email and password."""
    email: str = Field(..., example="scout@scoutai.com")
    password: str = Field(..., min_length=6, example="password123")


class RegisterRequest(BaseModel):
    """Registration request for new users."""
    email: str = Field(..., example="scout@scoutai.com")
    password: str = Field(..., min_length=6, example="password123")
    full_name: str = Field(..., min_length=2, example="James Scout")
    role: str = Field(default="guest", example="scout")
    club_id: Optional[UUID] = None


class TokenResponse(BaseModel):
    """JWT token response after successful authentication."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = Field(description="Token expiry in seconds")
    user: "UserResponse"


class UserResponse(BaseModel):
    """User profile response."""
    id: UUID
    email: str
    full_name: str
    role: str
    avatar_url: Optional[str] = None
    club_id: Optional[UUID] = None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    """Update user profile."""
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
