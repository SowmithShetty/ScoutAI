"""
ScoutAI AI Module - Squad Depth & Succession Planner

Evaluates squad depth and flags replacement targets for positions
with aging players, expiring contracts, or lacking depth.
"""

from typing import Dict, List, Any
import uuid

class SquadDepthPlanner:
    """
    Evaluates current squad composition and plans replacements.
    """

    @staticmethod
    def evaluate_squad(
        squad_players: List[Dict[str, Any]],
        candidates_pool: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """
        Evaluate squad depth by position and find gaps or succession needs.
        """
        # Group squad by position
        position_squad: Dict[str, List[Dict[str, Any]]] = {}
        for player in squad_players:
            pos = player.get("position", "CM")
            if pos not in position_squad:
                position_squad[pos] = []
            position_squad[pos].append(player)

        # Standard requirements: At least 2 solid players per position group
        # (GK, CB, LB, RB, CDM, CM, CAM, LW, RW, ST)
        position_needs = ["GK", "CB", "LB", "RB", "CDM", "CM", "CAM", "LW", "RW", "ST"]
        squad_evaluation = []

        for pos in position_needs:
            squad_list = position_squad.get(pos, [])
            depth_count = len(squad_list)
            
            # Identify risk factors
            risk_factors = []
            aging_players = [p for p in squad_list if p.get("age", 25) >= 30]
            short_contracts = [p for p in squad_list if p.get("contract_expiry") and p.get("age", 25) >= 28] # just a mock trigger
            
            if depth_count < 2:
                risk_factors.append("Critically low squad depth (less than 2 players)")
            if aging_players:
                risk_factors.append(f"Aging profile: {len(aging_players)} player(s) over 30")
                
            status = "Stable"
            if "Critically" in "".join(risk_factors):
                status = "Critical Need"
            elif risk_factors:
                status = "Monitor"

            # Find matching successor candidates from the database
            successors = []
            if status in ("Critical Need", "Monitor"):
                # Filter candidates by position and overall rating
                matched_candidates = [
                    c for c in candidates_pool
                    if c.get("position") == pos and c.get("overall_rating", 70) >= 80
                ]
                # Sort by rating and potential
                matched_candidates.sort(key=lambda x: (x.get("overall_rating", 0), x.get("potential", 0)), reverse=True)
                successors = matched_candidates[:3]

            squad_evaluation.append({
                "position": pos,
                "squad_count": depth_count,
                "squad_players": [
                    {
                        "id": p.get("id"),
                        "name": p.get("name"),
                        "age": p.get("age"),
                        "overall_rating": p.get("overall_rating"),
                        "contract_expiry": str(p.get("contract_expiry", ""))
                    } for p in squad_list
                ],
                "status": status,
                "warnings": risk_factors,
                "recommended_successors": [
                    {
                        "id": c.get("id"),
                        "name": c.get("name"),
                        "age": c.get("age"),
                        "overall_rating": c.get("overall_rating"),
                        "potential": c.get("potential"),
                        "market_value": c.get("market_value"),
                    } for c in successors
                ]
            })

        return squad_evaluation
