"""
ScoutAI - Data Export Utilities

Export player data, shortlists, and analysis results to CSV and Excel formats.
"""

import io
import csv
from typing import Dict, List, Any, Optional
from datetime import datetime


def export_players_csv(players: List[Dict[str, Any]], columns: Optional[List[str]] = None) -> bytes:
    """Export a list of player dicts to CSV bytes."""
    if not players:
        return b""

    if columns is None:
        columns = [
            "name", "age", "nationality", "position", "club_name",
            "overall_rating", "potential", "market_value", "salary",
            "pace", "shooting", "passing", "dribbling", "defending", "physical",
            "vision", "creativity", "availability", "preferred_foot",
        ]

    buffer = io.StringIO()
    writer = csv.DictWriter(buffer, fieldnames=columns, extrasaction="ignore")
    writer.writeheader()

    for p in players:
        # Flatten club name if needed
        row = dict(p)
        if isinstance(row.get("club"), dict):
            row["club_name"] = row["club"].get("name", "")
        writer.writerow(row)

    return buffer.getvalue().encode("utf-8")


def export_shortlist_csv(
    shortlist_name: str,
    players: List[Dict[str, Any]],
    scores: Optional[List[float]] = None,
) -> bytes:
    """Export a shortlist with optional recommendation scores to CSV bytes."""
    if not players:
        return b""

    columns = [
        "rank", "name", "age", "nationality", "position", "club_name",
        "overall_rating", "potential", "market_value", "recommendation_score",
    ]

    buffer = io.StringIO()
    writer = csv.DictWriter(buffer, fieldnames=columns, extrasaction="ignore")
    writer.writeheader()

    for i, p in enumerate(players):
        row = dict(p)
        row["rank"] = i + 1
        if isinstance(row.get("club"), dict):
            row["club_name"] = row["club"].get("name", "")
        row["recommendation_score"] = scores[i] if scores and i < len(scores) else ""
        writer.writerow(row)

    return buffer.getvalue().encode("utf-8")


def export_comparison_csv(
    players: List[Dict[str, Any]],
    attributes: Optional[List[str]] = None,
) -> bytes:
    """Export player comparison data as CSV with attributes as rows and players as columns."""
    if not players:
        return b""

    if attributes is None:
        attributes = [
            "overall_rating", "potential", "pace", "shooting", "passing",
            "dribbling", "defending", "physical", "vision", "creativity",
            "aggression", "leadership", "heading", "finishing", "strength",
        ]

    buffer = io.StringIO()
    writer = csv.writer(buffer)

    # Header row: Attribute + player names
    header = ["Attribute"] + [p.get("name", f"Player {i+1}") for i, p in enumerate(players)]
    writer.writerow(header)

    # Data rows
    for attr in attributes:
        row = [attr.replace("_", " ").title()]
        for p in players:
            row.append(p.get(attr, ""))
        writer.writerow(row)

    return buffer.getvalue().encode("utf-8")


def export_analysis_report_csv(
    player: Dict[str, Any],
    medical_risk: Optional[Dict[str, Any]] = None,
    financial_roi: Optional[Dict[str, Any]] = None,
    age_trajectory: Optional[Dict[str, Any]] = None,
) -> bytes:
    """Export a comprehensive analysis report for a single player as CSV."""
    buffer = io.StringIO()
    writer = csv.writer(buffer)

    # Header
    writer.writerow(["ScoutAI Analysis Report"])
    writer.writerow(["Generated", datetime.now().strftime("%Y-%m-%d %H:%M")])
    writer.writerow([])

    # Player Info
    writer.writerow(["PLAYER PROFILE"])
    writer.writerow(["Name", player.get("name", "")])
    writer.writerow(["Age", player.get("age", "")])
    writer.writerow(["Position", player.get("position", "")])
    writer.writerow(["Nationality", player.get("nationality", "")])
    writer.writerow(["Overall", player.get("overall_rating", "")])
    writer.writerow(["Potential", player.get("potential", "")])
    writer.writerow(["Market Value", player.get("market_value", "")])
    writer.writerow([])

    # Medical Risk
    if medical_risk:
        writer.writerow(["MEDICAL RISK ASSESSMENT"])
        writer.writerow(["Risk Level", medical_risk.get("risk_level", "")])
        writer.writerow(["Risk Score", medical_risk.get("risk_score", "")])
        writer.writerow(["Expected Days Out/Season", medical_risk.get("expected_days_out_per_season", "")])
        writer.writerow(["Primary Vulnerability", medical_risk.get("primary_vulnerability", "")])
        writer.writerow(["Recurring Injuries", ", ".join(medical_risk.get("recurring_injuries", []))])
        writer.writerow([])

    # Financial ROI
    if financial_roi:
        writer.writerow(["FINANCIAL ANALYSIS"])
        writer.writerow(["Purchase Fee Est.", financial_roi.get("purchase_fee_est", "")])
        writer.writerow(["Annual Amortization", financial_roi.get("annual_amortization", "")])
        writer.writerow(["FFP Annual Cost", financial_roi.get("ffp_annual_book_cost", "")])
        writer.writerow(["FFP Impact Rating", financial_roi.get("ffp_impact_rating", "")])
        writer.writerow(["3-Year Projected Value", financial_roi.get("projected_market_value_3yr", "")])
        writer.writerow(["Net ROI %", financial_roi.get("projected_net_roi_pct", "")])
        writer.writerow([])

    # Age Trajectory
    if age_trajectory:
        writer.writerow(["AGE TRAJECTORY (5-Year Projection)"])
        writer.writerow(["Year", "Age", "Projected OVR", "Projected Goals", "Projected Assists"])
        for t in age_trajectory.get("projected_trajectory", []):
            writer.writerow([
                f"+{t['year']}", t["age"],
                f"{t['overall_rating']:.1f}",
                f"{t['projected_goals']:.1f}",
                f"{t['projected_assists']:.1f}",
            ])

    return buffer.getvalue().encode("utf-8")
