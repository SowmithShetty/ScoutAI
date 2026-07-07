"""
ScoutAI AI Module - Recommendation Engine

Multi-criteria scoring engine that evaluates player candidates against
manager requirements. Every score is explained with natural language reasoning.

Scoring Dimensions:
  - Performance (30%): Goals, assists, xG, progressive actions, ratings
  - Tactical Fit (20%): Attribute match to requirements, playing style
  - Medical Risk (10%): Injury history, recurring patterns, availability
  - Age & Potential (15%): Age curve, potential ceiling, growth trajectory
  - Financial (15%): Market value vs budget, salary fit, ROI potential
  - Availability (10%): Contract situation, transfer listed, loan status
"""

from typing import Dict, List, Optional, Tuple
import math


class RecommendationEngine:
    """
    Multi-factor recommendation engine with explainable scoring.
    Generates ranked candidate lists with detailed natural language explanations.
    """

    # Default dimension weights
    DEFAULT_WEIGHTS = {
        "performance": 0.30,
        "tactical_fit": 0.20,
        "medical": 0.10,
        "age_potential": 0.15,
        "financial": 0.15,
        "availability": 0.10,
    }

    def __init__(self, weights: Optional[Dict[str, float]] = None):
        self.weights = weights or self.DEFAULT_WEIGHTS

    def score_candidate(
        self,
        player: Dict,
        requirements: Dict,
        stats: Optional[Dict] = None,
    ) -> Dict:
        """
        Score a single candidate against manager requirements.

        Returns:
            Dict with final_score, dimension_scores, and explanations.
        """
        scores = {}
        explanations = {}

        # 1. Performance Score
        scores["performance"], explanations["performance"] = (
            self._score_performance(player, stats)
        )

        # 2. Tactical Fit Score
        scores["tactical_fit"], explanations["tactical_fit"] = (
            self._score_tactical_fit(player, requirements)
        )

        # 3. Medical Risk Score
        scores["medical"], explanations["medical"] = (
            self._score_medical(player)
        )

        # 4. Age & Potential Score
        scores["age_potential"], explanations["age_potential"] = (
            self._score_age_potential(player, requirements)
        )

        # 5. Financial Score
        scores["financial"], explanations["financial"] = (
            self._score_financial(player, requirements)
        )

        # 6. Availability Score
        scores["availability"], explanations["availability"] = (
            self._score_availability(player)
        )

        # Weighted final score
        final_score = sum(
            scores[dim] * self.weights[dim] for dim in self.weights
        )

        # Overall summary explanation
        summary = self._generate_summary(player, final_score, scores, requirements)

        return {
            "player_id": player.get("id"),
            "player_name": player.get("name"),
            "final_score": round(final_score, 1),
            "dimension_scores": {k: round(v, 1) for k, v in scores.items()},
            "explanations": explanations,
            "summary": summary,
            "recommendation": self._get_recommendation_label(final_score),
        }

    def rank_candidates(
        self,
        players: List[Dict],
        requirements: Dict,
        stats_map: Optional[Dict[str, Dict]] = None,
        top_k: int = 20,
    ) -> List[Dict]:
        """
        Score and rank all candidates, returning top-K results.
        """
        results = []
        for player in players:
            pid = str(player.get("id", ""))
            stats = stats_map.get(pid) if stats_map else None
            result = self.score_candidate(player, requirements, stats)
            results.append(result)

        results.sort(key=lambda x: x["final_score"], reverse=True)
        return results[:top_k]

    # ─── Scoring Functions ────────────────────────────────────────────────

    def _score_performance(
        self, player: Dict, stats: Optional[Dict]
    ) -> Tuple[float, str]:
        """Score based on current form, ratings, and output."""
        overall = player.get("overall_rating", 70)
        form = player.get("form", 6.5)

        # Base from overall rating (normalize 60-95 range to 0-100)
        base = max(0, min(100, (overall - 60) * 2.86))

        # Form bonus/penalty
        form_factor = (form - 6.0) * 10  # 7.0 form = +10, 8.0 = +20

        score = min(100, max(0, base + form_factor))

        # Add stats bonus if available
        if stats:
            goals = stats.get("goals", 0)
            assists = stats.get("assists", 0)
            rating = stats.get("average_rating", 6.5)
            stat_bonus = min(15, (goals + assists) * 0.5 + (rating - 6.5) * 5)
            score = min(100, score + stat_bonus)

        # Generate explanation
        parts = [f"Overall rating of {overall} indicates {'elite' if overall >= 85 else 'strong' if overall >= 78 else 'developing'} quality"]
        if form >= 7.5:
            parts.append(f"Currently in excellent form ({form}/10)")
        elif form < 6.5:
            parts.append(f"Recent form has been inconsistent ({form}/10)")
        if stats and stats.get("goals", 0) > 10:
            parts.append(f"Strong goal output ({stats['goals']} goals this season)")

        return score, ". ".join(parts) + "."

    def _score_tactical_fit(
        self, player: Dict, requirements: Dict
    ) -> Tuple[float, str]:
        """Score based on how well attributes match the manager's requirements."""
        score = 50.0
        parts = []

        # Position match
        req_position = requirements.get("position")
        if req_position and player.get("position") == req_position:
            score += 15
            parts.append(f"Plays in the required {req_position} position")
        elif req_position:
            score -= 10
            parts.append(f"Plays {player.get('position')}, not the required {req_position}")

        # Attribute requirements
        attr_requirements = requirements.get("attributes", {})
        match_count = 0
        miss_count = 0

        for attr, min_val in attr_requirements.items():
            player_val = player.get(attr, 50)
            if player_val >= min_val:
                match_count += 1
                score += 5
            else:
                miss_count += 1
                score -= 3
                if player_val < min_val - 15:
                    parts.append(f"{attr.title()} ({player_val}) falls well short of requirement ({min_val})")

        if match_count > 0:
            parts.append(f"Meets {match_count} of {match_count + miss_count} tactical attribute requirements")

        # Playing style match
        req_style = requirements.get("style")
        player_style = player.get("playing_style", "")
        if req_style and req_style.lower() in player_style.lower():
            score += 10
            parts.append(f"Playing style ({player_style}) aligns with tactical system")

        score = min(100, max(0, score))
        explanation = ". ".join(parts) + "." if parts else "General tactical profile evaluated."

        return score, explanation

    def _score_medical(self, player: Dict) -> Tuple[float, str]:
        """Score based on injury history and availability."""
        availability = player.get("availability", "Available")
        medical_records = player.get("medical_records", [])

        score = 85.0  # Start optimistic
        parts = []

        if availability == "Injured":
            score -= 30
            parts.append("Currently injured and unavailable")
        elif availability == "Available":
            parts.append("Currently fit and available for selection")

        # Injury count penalty
        injury_count = len(medical_records) if isinstance(medical_records, list) else 0
        if injury_count > 5:
            score -= 25
            parts.append(f"Concerning injury history with {injury_count} recorded injuries")
        elif injury_count > 2:
            score -= 10
            parts.append(f"Moderate injury history ({injury_count} injuries on record)")
        elif injury_count == 0:
            score += 10
            parts.append("Clean injury record")

        score = min(100, max(0, score))
        return score, ". ".join(parts) + "."

    def _score_age_potential(
        self, player: Dict, requirements: Dict
    ) -> Tuple[float, str]:
        """Score based on age, potential ceiling, and growth trajectory."""
        age = player.get("age", 25)
        overall = player.get("overall_rating", 70)
        potential = player.get("potential", 75)
        gap = potential - overall

        parts = []

        # Age preferences
        max_age = requirements.get("max_age", 35)
        min_age = requirements.get("min_age", 16)

        if age > max_age:
            score = max(20, 70 - (age - max_age) * 10)
            parts.append(f"At {age}, exceeds the maximum age requirement of {max_age}")
        elif age < min_age:
            score = 60
            parts.append(f"At {age}, below the preferred minimum of {min_age}")
        elif 21 <= age <= 25:
            score = 85
            parts.append(f"At {age}, in the ideal development-to-prime age window")
        elif 26 <= age <= 29:
            score = 80
            parts.append(f"At {age}, currently in peak performance years")
        elif age <= 20:
            score = 75
            parts.append(f"At {age}, a young talent with significant room for development")
        else:
            score = max(40, 80 - (age - 29) * 8)
            parts.append(f"At {age}, approaching the latter stages of peak performance")

        # Potential bonus
        if gap >= 8:
            score += 15
            parts.append(f"Exceptional growth potential (POT {potential}, +{gap} ceiling)")
        elif gap >= 4:
            score += 8
            parts.append(f"Good potential for improvement (POT {potential}, +{gap})")
        elif gap <= 0:
            parts.append("Has reached or is near ceiling potential")

        score = min(100, max(0, score))
        return score, ". ".join(parts) + "."

    def _score_financial(
        self, player: Dict, requirements: Dict
    ) -> Tuple[float, str]:
        """Score based on market value, salary, and budget fit."""
        market_value = player.get("market_value", 0)
        salary = player.get("salary", 0)
        budget = requirements.get("budget", float("inf"))

        parts = []
        score = 70.0

        # Value vs budget
        if budget and budget > 0:
            ratio = market_value / budget
            if ratio <= 0.5:
                score += 20
                parts.append(f"Market value (€{market_value/1e6:.0f}M) is well within budget (€{budget/1e6:.0f}M)")
            elif ratio <= 0.8:
                score += 10
                parts.append(f"Market value (€{market_value/1e6:.0f}M) fits within budget")
            elif ratio <= 1.0:
                score += 0
                parts.append(f"Market value (€{market_value/1e6:.0f}M) near the budget limit")
            else:
                score -= 25
                parts.append(f"Market value (€{market_value/1e6:.0f}M) exceeds the €{budget/1e6:.0f}M budget")

        # Salary consideration
        if salary > 300000:
            score -= 10
            parts.append(f"High weekly salary of €{salary/1000:.0f}K may strain wage structure")
        elif salary < 100000:
            score += 10
            parts.append(f"Modest wage demands (€{salary/1000:.0f}K/week) offer good value")

        # Transfer listed bonus
        if player.get("is_transfer_listed"):
            score += 10
            parts.append("Currently transfer listed, potentially negotiable price")

        score = min(100, max(0, score))
        return score, ". ".join(parts) + "."

    def _score_availability(self, player: Dict) -> Tuple[float, str]:
        """Score based on contract situation and transfer availability."""
        availability = player.get("availability", "Available")
        contract_expiry = player.get("contract_expiry", "")
        is_listed = player.get("is_transfer_listed", False)
        on_loan = player.get("on_loan", False)

        score = 60.0
        parts = []

        if availability == "Available":
            score += 15
            parts.append("Currently available for selection")
        elif availability == "Injured":
            score -= 15
            parts.append("Currently injured — recovery timeline uncertain")

        if is_listed:
            score += 20
            parts.append("Actively transfer listed by current club")

        if on_loan:
            score += 5
            parts.append("Currently on loan — parent club may consider permanent sale")

        # Contract expiry proximity
        if contract_expiry:
            try:
                from datetime import date
                exp = date.fromisoformat(str(contract_expiry))
                days_left = (exp - date.today()).days
                if days_left < 365:
                    score += 15
                    parts.append(f"Contract expiring soon ({days_left} days) — strong negotiating position")
                elif days_left < 730:
                    score += 5
                    parts.append("Contract entering final 2 years")
            except (ValueError, TypeError):
                pass

        score = min(100, max(0, score))
        return score, ". ".join(parts) + "." if parts else "Standard availability."

    # ─── Explanation Generation ────────────────────────────────────────────

    def _generate_summary(
        self,
        player: Dict,
        final_score: float,
        scores: Dict[str, float],
        requirements: Dict,
    ) -> str:
        """Generate a natural language summary of the recommendation."""
        name = player.get("name", "This player")
        position = player.get("position", "")

        # Find strongest and weakest dimensions
        sorted_dims = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        strongest = sorted_dims[0]
        weakest = sorted_dims[-1]

        dim_labels = {
            "performance": "performance output",
            "tactical_fit": "tactical fit",
            "medical": "medical profile",
            "age_potential": "age and development potential",
            "financial": "financial viability",
            "availability": "transfer availability",
        }

        if final_score >= 80:
            verdict = f"{name} is an excellent candidate"
        elif final_score >= 65:
            verdict = f"{name} is a strong candidate worth pursuing"
        elif final_score >= 50:
            verdict = f"{name} is a viable option with some reservations"
        else:
            verdict = f"{name} may not be the ideal fit"

        summary = (
            f"{verdict} for the {requirements.get('position', position)} role "
            f"with an overall score of {final_score:.0f}/100. "
            f"Key strength is {dim_labels.get(strongest[0], strongest[0])} ({strongest[1]:.0f}/100). "
        )

        if weakest[1] < 50:
            summary += f"Main concern: {dim_labels.get(weakest[0], weakest[0])} ({weakest[1]:.0f}/100)."

        return summary

    def _get_recommendation_label(self, score: float) -> str:
        """Convert score to a categorical recommendation."""
        if score >= 80:
            return "Highly Recommended"
        elif score >= 65:
            return "Recommended"
        elif score >= 50:
            return "Worth Monitoring"
        elif score >= 35:
            return "Low Priority"
        else:
            return "Not Recommended"
