"""
ScoutAI - Abstract Base Data Connector

Defines pluggable interface for football data sources (FBref, Understat, Transfermarkt, Opta).
"""

from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional

class BaseDataConnector(ABC):
    """Abstract interface for all football data connectors."""

    def __init__(self, name: str, base_url: str):
        self.name = name
        self.base_url = base_url

    @abstractmethod
    async def fetch_player_stats(self, player_name: str) -> Optional[Dict[str, Any]]:
        """Fetch raw player performance statistics."""
        pass

    @abstractmethod
    async def fetch_market_value(self, player_name: str) -> Optional[Dict[str, Any]]:
        """Fetch market value and contract info."""
        pass

    @abstractmethod
    async def fetch_match_events(self, match_id: str) -> List[Dict[str, Any]]:
        """Fetch match event logs (shots, passes, xG)."""
        pass
