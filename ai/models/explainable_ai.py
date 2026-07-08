"""
ScoutAI AI Module - Explainable AI (XAI) Engine

Provides SHAP-style feature importance breakdowns for AI recommendations.
Decomposes multi-criteria decision scores into human-interpretable factors
so scouts and directors understand WHY a player was recommended.
"""

from typing import Dict, List, Any, Optional
import math


class ExplainableAI:
    """
    Simulated SHAP-style explainer for the recommendation engine.
    Breaks down the final score into individual feature contributions
    with direction (positive/negative) and magnitude.
    """

    # Feature groups and their constituent attributes
    FEATURE_GROUPS = {
        "Performance": [
            "overall_rating", "form", "goals_per_90", "assists_per_90",
            "xg_per_90", "pass_completion_pct", "average_rating"
        ],
        "Tactical Fit": [
            "position_match", "playing_style_match", "formation_fit",
            "attribute_alignment"
        ],
        "Physical Profile": [
            "pace", "physical", "strength", "heading", "aggression"
        ],
        "Technical Ability": [
            "shooting", "passing", "dribbling", "vision", "creativity",
            "finishing", "skill_moves"
        ],
        "Age & Potential": [
            "age", "potential", "growth_margin", "years_to_peak"
        ],
        "Medical Risk": [
            "injury_count", "severe_injuries", "recurring_issues",
            "days_out_per_season"
        ],
        "Financial Value": [
            "market_value", "salary", "ffp_impact", "resale_roi",
            "contract_length"
        ],
        "Availability": [
            "transfer_listed", "contract_expiry", "release_clause",
            "current_availability"
        ],
    }

    @staticmethod
    def explain_recommendation(
        player: Dict[str, Any],
        requirements: Dict[str, Any],
        dimension_scores: Dict[str, float],
        final_score: float,
    ) -> Dict[str, Any]:
        """
        Generate a SHAP-style explanation for why this player received their score.
        Returns feature contributions sorted by absolute impact.
        """
        contributions = []
        base_score = 50.0  # baseline "average" player score

        # ─── Performance Contribution ──────────────────────────────────────
        ovr = player.get("overall_rating", 70)
        perf_score = dimension_scores.get("performance", 0.5)
        perf_impact = (perf_score - 0.5) * 30  # scale to ±15
        contributions.append({
            "feature": "Performance Rating",
            "group": "Performance",
            "value": f"{ovr:.0f}/99",
            "impact": round(perf_impact, 2),
            "direction": "positive" if perf_impact >= 0 else "negative",
            "explanation": f"Overall {ovr:.0f} rating {'exceeds' if ovr >= 80 else 'meets' if ovr >= 70 else 'falls below'} the benchmark"
        })

        # ─── Form & Current Output ─────────────────────────────────────────
        form = player.get("form", 70)
        form_impact = (form - 70) * 0.15
        contributions.append({
            "feature": "Current Form",
            "group": "Performance",
            "value": f"{form:.0f}/100",
            "impact": round(form_impact, 2),
            "direction": "positive" if form_impact >= 0 else "negative",
            "explanation": f"Form of {form:.0f} indicates {'excellent' if form >= 80 else 'solid' if form >= 65 else 'poor'} recent output"
        })

        # ─── Tactical Fit ──────────────────────────────────────────────────
        tac_score = dimension_scores.get("tactical_fit", 0.5)
        tac_impact = (tac_score - 0.5) * 25
        req_pos = requirements.get("position", "Any")
        player_pos = player.get("position", "N/A")
        contributions.append({
            "feature": "Tactical Fit",
            "group": "Tactical Fit",
            "value": f"{player_pos} for {req_pos}",
            "impact": round(tac_impact, 2),
            "direction": "positive" if tac_impact >= 0 else "negative",
            "explanation": f"Position {'matches' if player_pos == req_pos else 'partially fits'} the tactical requirement"
        })

        # ─── Attribute Alignment ───────────────────────────────────────────
        req_attrs = requirements.get("attributes", {})
        if req_attrs:
            total_diff = 0
            for attr, target in req_attrs.items():
                actual = player.get(attr, 50)
                total_diff += (actual - target)
            attr_impact = total_diff / max(1, len(req_attrs)) * 0.2
            contributions.append({
                "feature": "Attribute Alignment",
                "group": "Technical Ability",
                "value": f"{len(req_attrs)} attrs evaluated",
                "impact": round(attr_impact, 2),
                "direction": "positive" if attr_impact >= 0 else "negative",
                "explanation": f"Player attributes {'exceed' if attr_impact > 0 else 'fall short of'} specified targets"
            })

        # ─── Age & Potential ───────────────────────────────────────────────
        age = player.get("age", 25)
        potential = player.get("potential", ovr)
        growth = potential - ovr
        age_score = dimension_scores.get("age_potential", 0.5)
        age_impact = (age_score - 0.5) * 20
        contributions.append({
            "feature": "Age & Growth Potential",
            "group": "Age & Potential",
            "value": f"Age {age}, +{growth:.0f} growth",
            "impact": round(age_impact, 2),
            "direction": "positive" if age_impact >= 0 else "negative",
            "explanation": f"{'Young with high ceiling' if age < 24 and growth > 5 else 'Peak age' if 24 <= age <= 29 else 'Declining trajectory'}"
        })

        # ─── Medical Risk ──────────────────────────────────────────────────
        med_score = dimension_scores.get("medical", 0.5)
        med_impact = (med_score - 0.5) * 15
        contributions.append({
            "feature": "Medical History",
            "group": "Medical Risk",
            "value": f"Risk score {med_score:.0%}",
            "impact": round(med_impact, 2),
            "direction": "positive" if med_impact >= 0 else "negative",
            "explanation": f"{'Clean bill of health' if med_score >= 0.8 else 'Some injury concerns' if med_score >= 0.5 else 'Significant injury risks'}"
        })

        # ─── Financial Value ───────────────────────────────────────────────
        fin_score = dimension_scores.get("financial", 0.5)
        fin_impact = (fin_score - 0.5) * 20
        mv = player.get("market_value", 0)
        budget = requirements.get("budget")
        contributions.append({
            "feature": "Financial Viability",
            "group": "Financial Value",
            "value": f"EUR {mv/1e6:.1f}M" if mv >= 1e6 else f"EUR {mv/1e3:.0f}K",
            "impact": round(fin_impact, 2),
            "direction": "positive" if fin_impact >= 0 else "negative",
            "explanation": f"{'Within budget' if budget and mv <= budget else 'Exceeds budget' if budget else 'Good value'}"
        })

        # ─── Availability ─────────────────────────────────────────────────
        avail_score = dimension_scores.get("availability", 0.5)
        avail_impact = (avail_score - 0.5) * 10
        is_listed = player.get("is_transfer_listed", False)
        contributions.append({
            "feature": "Transfer Availability",
            "group": "Availability",
            "value": "Listed" if is_listed else "Not Listed",
            "impact": round(avail_impact, 2),
            "direction": "positive" if avail_impact >= 0 else "negative",
            "explanation": f"{'Transfer listed - high availability' if is_listed else 'Not listed - negotiation needed'}"
        })

        # Sort by absolute impact descending
        contributions.sort(key=lambda x: abs(x["impact"]), reverse=True)

        # Calculate explained score
        explained_sum = base_score + sum(c["impact"] for c in contributions)

        # Generate overall narrative
        top_positive = [c for c in contributions if c["impact"] > 0][:3]
        top_negative = [c for c in contributions if c["impact"] < 0][:2]

        strengths_text = ", ".join([c["feature"].lower() for c in top_positive])
        concerns_text = ", ".join([c["feature"].lower() for c in top_negative]) if top_negative else "none identified"

        narrative = (
            f"This player scores {final_score:.0f}/100 in our AI assessment. "
            f"The key drivers are {strengths_text}. "
            f"Areas of concern include {concerns_text}."
        )

        return {
            "final_score": final_score,
            "base_score": base_score,
            "explained_score": round(explained_sum, 1),
            "contributions": contributions,
            "narrative": narrative,
            "top_strengths": [c["feature"] for c in top_positive],
            "top_concerns": [c["feature"] for c in top_negative],
        }
