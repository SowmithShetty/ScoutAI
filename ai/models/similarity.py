"""
ScoutAI AI Module - Player Similarity Engine

Uses cosine similarity and K-Nearest Neighbors to find
players with similar playing styles, attributes, and statistical profiles.
"""

import numpy as np
from typing import Dict, List, Tuple, Optional
from ai.features.player_features import (
    build_feature_vector,
    compute_similarity_score,
    normalize_attributes,
    ALL_ATTRIBUTES,
)


class PlayerSimilarityEngine:
    """
    Find players similar to a target player using vector-based similarity.

    Approach:
    1. Build feature vectors for all players in the database.
    2. Compute cosine similarity between the target and all candidates.
    3. Return top-K most similar players with similarity percentages.
    """

    def __init__(self):
        self._player_vectors: Dict[str, np.ndarray] = {}
        self._player_data: Dict[str, Dict] = {}

    def index_players(self, players: List[Dict], stats_map: Optional[Dict[str, Dict]] = None):
        """
        Build the similarity index from a list of player dictionaries.

        Args:
            players: List of player dicts with attributes.
            stats_map: Optional mapping of player_id -> season stats dict.
        """
        self._player_vectors = {}
        self._player_data = {}

        for player in players:
            pid = str(player.get("id", ""))
            stats = stats_map.get(pid) if stats_map else None
            vec = build_feature_vector(player, stats)
            self._player_vectors[pid] = vec
            self._player_data[pid] = player

    def find_similar(
        self,
        target_id: str,
        top_k: int = 10,
        position_filter: Optional[str] = None,
        exclude_same_club: bool = False,
    ) -> List[Dict]:
        """
        Find top-K players most similar to the target.

        Returns list of dicts with:
          - player data
          - similarity_score (0 to 100 percentage)
          - similarity_breakdown (per-dimension contributions)
        """
        if target_id not in self._player_vectors:
            return []

        target_vec = self._player_vectors[target_id]
        target_data = self._player_data[target_id]

        results = []
        for pid, vec in self._player_vectors.items():
            if pid == target_id:
                continue

            candidate = self._player_data[pid]

            # Apply filters
            if position_filter and candidate.get("position") != position_filter:
                continue
            if exclude_same_club and candidate.get("club_id") == target_data.get("club_id"):
                continue

            similarity = compute_similarity_score(target_vec, vec)
            pct = round(similarity * 100, 1)

            # Compute attribute-level breakdown
            breakdown = self._compute_breakdown(target_data, candidate)

            results.append({
                "player": candidate,
                "similarity_score": pct,
                "similarity_breakdown": breakdown,
            })

        # Sort by similarity descending
        results.sort(key=lambda x: x["similarity_score"], reverse=True)
        return results[:top_k]

    def _compute_breakdown(self, target: Dict, candidate: Dict) -> Dict[str, float]:
        """
        Compute per-attribute similarity percentage between two players.
        Returns dict mapping attribute name -> match percentage.
        """
        breakdown = {}
        for attr in ALL_ATTRIBUTES:
            t_val = target.get(attr, 50)
            c_val = candidate.get(attr, 50)
            diff = abs(t_val - c_val)
            match_pct = max(0, 100 - diff * 2)  # 0 diff = 100%, 50 diff = 0%
            breakdown[attr] = round(match_pct, 1)
        return breakdown

    def get_player_vector(self, player_id: str) -> Optional[np.ndarray]:
        """Retrieve the feature vector for a specific player."""
        return self._player_vectors.get(player_id)
