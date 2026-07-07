"""
ScoutAI AI Module - Natural Language Requirement Parser

Extracts structured recruitment requirements from natural language text.
Example input:
  "We play a high pressing 4-3-3. Need a striker. Strong aerially.
   Excellent pressing. Maximum €70M. Below 24 years. Must attack space."

Extracts:
  position, budget, age range, style, formation, attribute priorities.
"""

import re
from typing import Dict, List, Optional, Tuple


# ─── Position Keywords ────────────────────────────────────────────────────────

POSITION_MAP = {
    "striker": "ST", "forward": "ST", "centre forward": "CF",
    "centre-forward": "CF", "number 9": "ST", "number nine": "ST",
    "attacking midfielder": "CAM", "number 10": "CAM", "playmaker": "CAM",
    "central midfielder": "CM", "midfielder": "CM",
    "defensive midfielder": "CDM", "holding midfielder": "CDM",
    "anchor": "CDM", "dm": "CDM", "cdm": "CDM",
    "left winger": "LW", "right winger": "RW", "winger": "RW",
    "left back": "LB", "right back": "RB", "full-back": "RB",
    "fullback": "RB", "wing-back": "RWB", "wingback": "RWB",
    "centre back": "CB", "centre-back": "CB", "central defender": "CB",
    "defender": "CB", "goalkeeper": "GK", "keeper": "GK", "gk": "GK",
}

# ─── Attribute Keywords ──────────────────────────────────────────────────────

ATTRIBUTE_KEYWORDS = {
    "pace": ["pace", "speed", "fast", "quick", "rapid", "explosive"],
    "shooting": ["shooting", "shot", "long range", "distance shooting"],
    "passing": ["passing", "distribution", "passing range", "ball distribution"],
    "dribbling": ["dribbling", "dribble", "ball carrier", "carries the ball", "technical"],
    "defending": ["defending", "defensive", "tackler", "tackles well"],
    "physical": ["physical", "strong", "powerful", "robust", "dominant"],
    "vision": ["vision", "awareness", "reading the game", "game intelligence"],
    "creativity": ["creative", "creativity", "inventive", "unpredictable"],
    "aggression": ["aggressive", "aggression", "pressing", "tenacious", "combative", "warrior"],
    "leadership": ["leader", "leadership", "captain material", "vocal", "experienced"],
    "heading": ["aerial", "heading", "head", "dominant in the air", "wins headers"],
    "finishing": ["finishing", "clinical", "finisher", "lethal", "scores goals"],
    "strength": ["strong", "strength", "holds up play", "hold-up", "powerful"],
}

# ─── Playing Style Keywords ──────────────────────────────────────────────────

STYLE_MAP = {
    "high press": "High Pressing",
    "high pressing": "High Pressing",
    "gegenpressing": "High Pressing",
    "possession": "Possession-Based",
    "tiki-taka": "Possession-Based",
    "counter": "Counter-Attacking",
    "counter-attack": "Counter-Attacking",
    "direct": "Direct",
    "long ball": "Direct",
    "wing play": "Wing Play",
    "wide play": "Wing Play",
}

# ─── Formation Keywords ─────────────────────────────────────────────────────

FORMATION_PATTERN = re.compile(r"\b(\d-\d-\d(?:-\d)?)\b")


def parse_requirements(text: str) -> Dict:
    """
    Parse natural language text into structured recruitment requirements.

    Returns dict with:
      position, budget, min_age, max_age, style, formation,
      attributes (dict of attr -> priority 0-100),
      raw_priorities (list of extracted keyword matches)
    """
    text_lower = text.lower()
    result = {
        "position": None,
        "budget": None,
        "min_age": None,
        "max_age": None,
        "style": None,
        "formation": None,
        "preferred_foot": None,
        "attributes": {},
        "raw_priorities": [],
    }

    # ─── Extract Position ──────────────────────────────────────────────
    for keyword, pos in sorted(POSITION_MAP.items(), key=lambda x: -len(x[0])):
        if keyword in text_lower:
            result["position"] = pos
            break

    # ─── Extract Budget ────────────────────────────────────────────────
    budget_patterns = [
        r"(?:maximum|max|budget|under|below|up to|less than)\s*[€$£]?\s*(\d+)\s*(m|million|M)",
        r"[€$£]\s*(\d+)\s*(m|million|M)",
        r"(\d+)\s*(m|million|M)\s*(?:budget|max|maximum|euros?|pounds?)",
    ]
    for pattern in budget_patterns:
        match = re.search(pattern, text_lower)
        if match:
            result["budget"] = int(match.group(1)) * 1_000_000
            break

    # ─── Extract Age ───────────────────────────────────────────────────
    age_max = re.search(r"(?:below|under|younger than|max(?:imum)?\s*age)\s*(\d{2})", text_lower)
    if age_max:
        result["max_age"] = int(age_max.group(1))

    age_min = re.search(r"(?:above|over|older than|min(?:imum)?\s*age)\s*(\d{2})", text_lower)
    if age_min:
        result["min_age"] = int(age_min.group(1))

    age_range = re.search(r"(?:between|aged?)\s*(\d{2})\s*(?:and|-|to)\s*(\d{2})", text_lower)
    if age_range:
        result["min_age"] = int(age_range.group(1))
        result["max_age"] = int(age_range.group(2))

    # ─── Extract Formation ─────────────────────────────────────────────
    formation_match = FORMATION_PATTERN.search(text)
    if formation_match:
        result["formation"] = formation_match.group(1)

    # ─── Extract Playing Style ─────────────────────────────────────────
    for keyword, style in STYLE_MAP.items():
        if keyword in text_lower:
            result["style"] = style
            break

    # ─── Extract Preferred Foot ────────────────────────────────────────
    if "left foot" in text_lower or "left-footed" in text_lower:
        result["preferred_foot"] = "Left"
    elif "right foot" in text_lower or "right-footed" in text_lower:
        result["preferred_foot"] = "Right"

    # ─── Extract Attribute Priorities ──────────────────────────────────
    for attr, keywords in ATTRIBUTE_KEYWORDS.items():
        for kw in keywords:
            if kw in text_lower:
                # Determine priority based on emphasis words
                priority = 70  # default
                # Check for emphasis modifiers near the keyword
                for emphasis in ["excellent", "exceptional", "world class", "elite", "must have", "essential", "critical"]:
                    if emphasis in text_lower:
                        # Check proximity (within 50 chars)
                        kw_pos = text_lower.find(kw)
                        em_pos = text_lower.find(emphasis)
                        if abs(kw_pos - em_pos) < 60:
                            priority = 90

                for emphasis in ["strong", "good", "solid", "important"]:
                    if emphasis in text_lower:
                        kw_pos = text_lower.find(kw)
                        em_pos = text_lower.find(emphasis)
                        if abs(kw_pos - em_pos) < 60:
                            priority = max(priority, 80)

                result["attributes"][attr] = priority
                result["raw_priorities"].append(f"{attr}: {priority}")
                break

    return result


def format_parsed_requirements(parsed: Dict) -> str:
    """Format parsed requirements into human-readable text."""
    lines = []
    if parsed["position"]:
        lines.append(f"Position: {parsed['position']}")
    if parsed["budget"]:
        lines.append(f"Budget: €{parsed['budget']/1e6:.0f}M")
    if parsed["max_age"]:
        lines.append(f"Maximum Age: {parsed['max_age']}")
    if parsed["min_age"]:
        lines.append(f"Minimum Age: {parsed['min_age']}")
    if parsed["formation"]:
        lines.append(f"Formation: {parsed['formation']}")
    if parsed["style"]:
        lines.append(f"Playing Style: {parsed['style']}")
    if parsed["preferred_foot"]:
        lines.append(f"Preferred Foot: {parsed['preferred_foot']}")
    if parsed["attributes"]:
        lines.append("Key Attributes:")
        for attr, priority in sorted(parsed["attributes"].items(), key=lambda x: -x[1]):
            lines.append(f"  - {attr.title()}: Priority {priority}/100")
    return "\n".join(lines)
