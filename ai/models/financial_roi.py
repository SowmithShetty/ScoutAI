"""
ScoutAI AI Module - Financial ROI & FFP Footprint Model

Calculates a transfer's Financial Fair Play (FFP) footprint,
projects future valuation based on age curves, and computes ROI.
"""

from typing import Dict, Any

class FinancialROIModel:
    """
Project future market value and FFP compliance metrics for transfer candidates.
    """

    @staticmethod
    def calculate_roi_and_ffp(
        market_value: float,
        salary: float,
        age: int,
        overall: int,
        potential: int,
        contract_years: int = 5,
        estimated_fee: float = None,
    ) -> Dict[str, Any]:
        """
        Evaluate FFP impact, amortized cost, and 3-year resale ROI projections.
        """
        fee = estimated_fee or (market_value * 1.1)  # standard transfer premium
        annual_amortization = fee / max(1, contract_years)
        annual_salary = salary * 52
        
        # FFP Book Cost = Amortization + Annual Wages
        ffp_annual_cost = annual_amortization + annual_salary

        # Projections based on age curve
        # Under 24: growth, 24-28: stable peak, 29+: decay
        resale_factor = 1.0
        if age < 23:
            # High potential growth
            potential_gap = potential - overall
            resale_factor = 1.25 + (potential_gap * 0.02)
        elif age <= 27:
            # Stable peak
            resale_factor = 1.10
        elif age <= 30:
            # Slow decline
            resale_factor = 0.85
        else:
            # Steep decline
            resale_factor = 0.50

        projected_value_3yr = market_value * resale_factor
        
        # Return on Investment calculation: (Resale Value - Purchase Fee) / Purchase Fee
        net_roi = ((projected_value_3yr - fee) / fee) * 100

        # Classification of FFP Footprint
        if ffp_annual_cost > 30_000_000:
            ffp_class = "Critical"
        elif ffp_annual_cost > 15_000_000:
            ffp_class = "High"
        elif ffp_annual_cost > 5_000_000:
            ffp_class = "Moderate"
        else:
            ffp_class = "Low"

        return {
            "purchase_fee_est": round(fee, 0),
            "annual_amortization": round(annual_amortization, 0),
            "annual_wage_est": round(annual_salary, 0),
            "ffp_annual_book_cost": round(ffp_annual_cost, 0),
            "ffp_impact_rating": ffp_class,
            "projected_market_value_3yr": round(projected_value_3yr, 0),
            "projected_net_roi_pct": round(net_roi, 1),
            "explanation": (
                f"Amortized over {contract_years} years, this signing costs €{ffp_annual_cost/1e6:.1f}M annually. "
                f"With a projected 3-year resale value of €{projected_value_3yr/1e6:.1f}M, "
                f"it represents a {net_roi:.1f}% net ROI."
            )
        }
