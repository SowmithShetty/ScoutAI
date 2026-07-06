"""
ScoutAI Backend - Core Configuration

Re-export from __init__.py for convenience.
"""

from app.core import Settings, get_settings

__all__ = ["Settings", "get_settings"]
