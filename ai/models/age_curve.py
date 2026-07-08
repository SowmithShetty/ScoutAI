"""
ScoutAI AI Module - Age Curve Performance Trajectory Model

Projects player overall ratings and output (goals/assists)
across 1-5 year horizons based on historical age curves.
"""

from typing import Dict, List, Any

# Standard positional peak ages
# GK: 29-33, CB: 27-31, MID: 26-29, ATT: 25-28
POSITION_PEAKS = {
    "GK": (29, 33),
    "CB": (27, 31),
    "LB": (25, 29),
    "RB": (25, 29),
    "CDM": (26, 30),
    "CM": (26, 29),
    "CAM": (25, 28),
    "LW": (24, 27),
    "RW": (24, 27),
    "ST": (25, 28),
    "CF": (25, 28),
}

class AgeCurveModel:
    """
    Simulates age-curve performance growth and decay patterns.
    """

    @staticmethod
    def project_trajectory(
        age: int,
        position: str,
        overall: int,
        potential: int,
        current_goals: float = 0,
        current_assists: float = 0,
    ) -> Dict[str, Any]:
        """
        Project performance metric changes for the next 5 years.
        """
        peak_min, peak_max = POSITION_PEAKS.get(position, (26, 29))
        trajectory = []

        current_ovr = float(overall)
        current_g = float(current_goals)
        current_a = float(current_assists)

        for year in range(1, 6):
            future_age = age + year
            ovr_change = 0.0
            stat_multiplier = 1.0

            # Under peak age: Growth
            if future_age < peak_min:
                gap = potential - current_ovr
                growth_rate = max(0.5, gap * 0.3)
                ovr_change = min(growth_rate, potential - current_ovr)
                stat_multiplier = 1.05 + (growth_rate * 0.05)
            # In peak age: Stable or micro growth
            elif peak_min <= future_age <= peak_max:
                ovr_change = min(0.2, potential - current_ovr)
                stat_multiplier = 1.0
            # Past peak age: Decay
            else:
                years_past = future_age - peak_max
                decay = 0.5 + (years_past * 0.3)
                ovr_change = -decay
                stat_multiplier = max(0.4, 1.0 - (years_past * 0.08))

            current_ovr = round(max(40.0, min(99.0, current_ovr + ovr_change)), 1)
            projected_g = round(current_g * stat_multiplier, 1)
            projected_a = round(current_a * stat_multiplier, 1)

            trajectory.append({
                "year": year,
                "age": future_age,
                "overall_rating": current_ovr,
                "projected_goals": projected_g,
                "projected_assists": projected_a,
            })

        # Summary of peak timeline
        if age < peak_min:
            timeline_summary = f"Developing player. Projected to reach peak starting in {peak_min - age} years."
        elif peak_min <= age <= peak_max:
            timeline_summary = "Currently in physical and tactical peak performance window."
        else:
            timeline_summary = f"Past peak age. Projected overall decline of {overall - current_ovr:.1f} rating points over 5 years."

        return {
            "positional_peak_range": f"{peak_min}-{peak_max}",
            "current_age": age,
            "projected_trajectory": trajectory,
            "explanation": timeline_summary
        }
