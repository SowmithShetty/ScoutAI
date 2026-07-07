"""
ScoutAI AI Module - Player Feature Engineering

Normalizes raw player statistics into ML-ready feature vectors.
Supports per-90 normalization, z-score standardization, and
positional percentile computation.
"""

import numpy as np
from typing import Dict, List, Optional, Tuple

# ─── Attribute Groups ─────────────────────────────────────────────────────────

ATTACKING_ATTRS = ["pace", "shooting", "finishing", "dribbling", "creativity"]
DEFENDING_ATTRS = ["defending", "aggression", "heading", "strength", "leadership"]
PLAYMAKING_ATTRS = ["passing", "vision", "creativity", "dribbling"]
PHYSICAL_ATTRS = ["pace", "strength", "physical", "heading", "aggression"]
TECHNICAL_ATTRS = ["shooting", "passing", "dribbling", "finishing", "vision"]

ALL_ATTRIBUTES = [
    "pace", "shooting", "passing", "dribbling", "defending", "physical",
    "vision", "creativity", "aggression", "leadership", "heading",
    "finishing", "strength",
]

STAT_FEATURES = [
    "goals", "assists", "xg", "xg_assist", "progressive_passes",
    "progressive_carries", "key_passes", "successful_dribbles",
    "tackles", "interceptions", "aerial_wins", "pressures",
    "pass_completion_pct", "shot_creating_actions", "average_rating",
]


def normalize_attributes(player: Dict, attrs: List[str] = ALL_ATTRIBUTES) -> np.ndarray:
    """
    Extract and normalize player attributes to 0-1 range.
    Attributes are assumed to be on a 0-100 scale.
    """
    values = [player.get(attr, 50) / 100.0 for attr in attrs]
    return np.array(values, dtype=np.float64)


def compute_per90_stats(stats: Dict, minutes: int) -> Dict[str, float]:
    """
    Normalize counting stats to per-90-minute rates.
    Returns a dictionary with per90 suffixed keys.
    """
    if minutes <= 0:
        return {f"{k}_per90": 0.0 for k in STAT_FEATURES if k != "pass_completion_pct" and k != "average_rating"}

    nineties = minutes / 90.0
    result = {}
    for key in STAT_FEATURES:
        val = stats.get(key, 0)
        if key in ("pass_completion_pct", "average_rating"):
            result[key] = float(val)
        else:
            result[f"{key}_per90"] = round(float(val) / nineties, 3)
    return result


def build_feature_vector(player: Dict, stats: Optional[Dict] = None) -> np.ndarray:
    """
    Build a comprehensive feature vector combining:
    - Normalized attributes (13 features)
    - Age factor (1 feature)
    - Potential gap (1 feature)
    - Per-90 stats if available (13 features)

    Total: 15 or 28 features depending on stats availability.
    """
    # Core attributes
    attr_vec = normalize_attributes(player)

    # Age factor: peaks at 27, declines symmetrically
    age = player.get("age", 25)
    age_factor = max(0, 1 - abs(age - 27) * 0.04)

    # Potential gap
    overall = player.get("overall_rating", 70)
    potential = player.get("potential", 75)
    potential_gap = (potential - overall) / 100.0

    base = np.append(attr_vec, [age_factor, potential_gap])

    if stats:
        minutes = stats.get("minutes", 0)
        per90 = compute_per90_stats(stats, minutes)
        stat_values = list(per90.values())
        # Normalize stat values (simple min-max with reasonable bounds)
        stat_arr = np.array(stat_values, dtype=np.float64)
        # Clip to prevent extreme values
        stat_arr = np.clip(stat_arr, 0, 10)
        stat_arr = stat_arr / 10.0  # rough normalization
        base = np.append(base, stat_arr)

    return base


def compute_positional_percentile(
    player_value: float,
    all_values: List[float],
) -> int:
    """
    Compute the percentile rank of a player's metric among peers.
    Returns integer 0-99.
    """
    if not all_values:
        return 50
    sorted_vals = sorted(all_values)
    rank = sum(1 for v in sorted_vals if v <= player_value)
    return min(99, int((rank / len(sorted_vals)) * 100))


def compute_similarity_score(vec_a: np.ndarray, vec_b: np.ndarray) -> float:
    """
    Compute cosine similarity between two feature vectors.
    Returns float between 0.0 and 1.0.
    """
    norm_a = np.linalg.norm(vec_a)
    norm_b = np.linalg.norm(vec_b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(vec_a, vec_b) / (norm_a * norm_b))


def weighted_similarity(
    vec_a: np.ndarray,
    vec_b: np.ndarray,
    weights: Optional[np.ndarray] = None,
) -> float:
    """
    Compute weighted cosine similarity.
    Weights emphasize specific feature dimensions.
    """
    if weights is None:
        return compute_similarity_score(vec_a, vec_b)

    w_a = vec_a * weights
    w_b = vec_b * weights
    return compute_similarity_score(w_a, w_b)
