"""
ScoutAI AI Module - Tactical Role Classification

Automatically classifies players into tactical roles based on their
attributes and statistical profiles using a rule-based + scoring approach.
"""

from typing import Dict, List, Tuple

# ─── Role Definitions ─────────────────────────────────────────────────────────
# Each role has weighted attribute requirements.
# Format: { role_name: { attribute: weight, ... } }

ROLE_PROFILES: Dict[str, Dict[str, float]] = {
    # Strikers
    "Target Man": {
        "heading": 0.25, "strength": 0.20, "physical": 0.15,
        "finishing": 0.15, "aggression": 0.10, "leadership": 0.05,
        "pace": -0.05, "dribbling": -0.05,
    },
    "Poacher": {
        "finishing": 0.30, "shooting": 0.20, "pace": 0.15,
        "dribbling": 0.10, "creativity": -0.10, "passing": -0.10,
        "defending": -0.10,
    },
    "Pressing Forward": {
        "aggression": 0.20, "pace": 0.20, "physical": 0.15,
        "finishing": 0.15, "strength": 0.10, "leadership": 0.10,
        "creativity": -0.05,
    },
    "False Nine": {
        "creativity": 0.25, "passing": 0.20, "vision": 0.20,
        "dribbling": 0.15, "shooting": 0.10, "heading": -0.10,
        "strength": -0.05,
    },
    "Deep Lying Forward": {
        "passing": 0.20, "vision": 0.20, "creativity": 0.15,
        "shooting": 0.15, "dribbling": 0.10, "strength": 0.10,
        "pace": -0.05,
    },

    # Midfielders
    "Ball Winning Midfielder": {
        "defending": 0.25, "aggression": 0.20, "physical": 0.15,
        "strength": 0.15, "leadership": 0.10, "passing": 0.05,
        "creativity": -0.10,
    },
    "Deep Playmaker": {
        "passing": 0.25, "vision": 0.25, "creativity": 0.15,
        "dribbling": 0.10, "leadership": 0.10, "defending": 0.05,
        "pace": -0.05,
    },
    "Box-to-Box": {
        "physical": 0.15, "pace": 0.15, "passing": 0.15,
        "defending": 0.15, "shooting": 0.10, "aggression": 0.10,
        "strength": 0.10, "leadership": 0.05,
    },
    "Advanced Playmaker": {
        "creativity": 0.25, "vision": 0.25, "passing": 0.20,
        "dribbling": 0.15, "shooting": 0.10, "defending": -0.15,
    },

    # Wingers
    "Inverted Winger": {
        "dribbling": 0.25, "pace": 0.20, "shooting": 0.15,
        "creativity": 0.15, "finishing": 0.10, "defending": -0.10,
        "heading": -0.05,
    },
    "Wide Playmaker": {
        "passing": 0.25, "creativity": 0.20, "vision": 0.20,
        "dribbling": 0.15, "pace": 0.05, "defending": -0.10,
    },

    # Defenders
    "Ball Playing Defender": {
        "defending": 0.20, "passing": 0.20, "vision": 0.15,
        "heading": 0.10, "strength": 0.10, "leadership": 0.10,
        "dribbling": 0.05, "creativity": 0.05,
    },
    "Stopper": {
        "defending": 0.25, "heading": 0.20, "strength": 0.20,
        "aggression": 0.15, "physical": 0.10, "leadership": 0.05,
        "creativity": -0.10,
    },
    "Wing Back": {
        "pace": 0.25, "passing": 0.15, "dribbling": 0.15,
        "physical": 0.15, "defending": 0.10, "creativity": 0.10,
        "heading": -0.05,
    },

    # Goalkeeper
    "Sweeper Keeper": {
        "passing": 0.30, "vision": 0.20, "leadership": 0.15,
        "pace": 0.10, "physical": 0.10, "defending": 0.10,
    },
}

# Map positions to eligible roles
POSITION_ELIGIBLE_ROLES: Dict[str, List[str]] = {
    "ST": ["Target Man", "Poacher", "Pressing Forward", "False Nine", "Deep Lying Forward"],
    "CF": ["False Nine", "Deep Lying Forward", "Pressing Forward", "Target Man"],
    "LW": ["Inverted Winger", "Wide Playmaker"],
    "RW": ["Inverted Winger", "Wide Playmaker"],
    "CAM": ["Advanced Playmaker", "False Nine", "Deep Lying Forward"],
    "CM": ["Box-to-Box", "Deep Playmaker", "Ball Winning Midfielder", "Advanced Playmaker"],
    "CDM": ["Ball Winning Midfielder", "Deep Playmaker", "Box-to-Box"],
    "LM": ["Wide Playmaker", "Inverted Winger"],
    "RM": ["Wide Playmaker", "Inverted Winger"],
    "LB": ["Wing Back", "Ball Playing Defender"],
    "RB": ["Wing Back", "Ball Playing Defender"],
    "LWB": ["Wing Back"],
    "RWB": ["Wing Back"],
    "CB": ["Ball Playing Defender", "Stopper"],
    "GK": ["Sweeper Keeper"],
}


def classify_role(player: Dict) -> List[Dict]:
    """
    Classify a player into tactical roles.

    Returns a list of role matches sorted by fit score, each containing:
      - role: str
      - score: float (0-100)
      - explanation: str
    """
    position = player.get("position", "CM")
    eligible_roles = POSITION_ELIGIBLE_ROLES.get(position, list(ROLE_PROFILES.keys()))

    results = []
    for role_name in eligible_roles:
        profile = ROLE_PROFILES.get(role_name)
        if not profile:
            continue

        score = 0.0
        explanations = []

        for attr, weight in profile.items():
            player_val = player.get(attr, 50) / 100.0
            contribution = player_val * weight * 100

            if weight > 0 and player_val > 0.7:
                explanations.append(f"Strong {attr} ({player.get(attr, 50)})")
            elif weight > 0 and player_val < 0.5:
                explanations.append(f"Weak {attr} ({player.get(attr, 50)})")

            score += contribution

        # Normalize to 0-100 range
        normalized = min(100, max(0, score + 50))

        results.append({
            "role": role_name,
            "score": round(normalized, 1),
            "explanation": "; ".join(explanations[:4]) if explanations else "Balanced profile",
        })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results


def get_primary_role(player: Dict) -> Tuple[str, float]:
    """
    Get the single best-fitting role for a player.
    Returns (role_name, confidence_score).
    """
    roles = classify_role(player)
    if roles:
        return roles[0]["role"], roles[0]["score"]
    return "General", 50.0
