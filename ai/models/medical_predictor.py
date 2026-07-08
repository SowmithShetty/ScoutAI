"""
ScoutAI AI Module - Medical Risk Predictor

Analyzes player medical records to classify injury risk,
identify recurring patterns, and calculate expected days out.
"""

from typing import Dict, List, Any
from datetime import datetime

class MedicalRiskPredictor:
    """
    Evaluates player injury risks using historical injury records.
    """

    @staticmethod
    def predict_risk(medical_records: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Predict medical risk level, recurring injuries, and expected availability.
        """
        if not medical_records:
            return {
                "risk_level": "Low",
                "risk_score": 10.0,
                "expected_days_out_per_season": 0.0,
                "recurring_injuries": [],
                "primary_vulnerability": "None",
                "explanation": "No prior injury history recorded. Excellent durability profile."
            }

        total_days_out = 0
        total_injuries = len(medical_records)
        body_part_counts = {}
        severity_weights = {"Minor": 1, "Moderate": 3, "Severe": 8}
        severity_score = 0
        recurring_parts = []
        is_current_injured = False

        # Parse records
        for record in medical_records:
            days = record.get("days_out", 0)
            total_days_out += days
            
            part = record.get("body_part", "Other")
            body_part_counts[part] = body_part_counts.get(part, 0) + 1
            if body_part_counts[part] >= 2 and part not in recurring_parts:
                recurring_parts.append(part)
                
            severity = record.get("severity", "Minor")
            severity_score += severity_weights.get(severity, 1)

            # Check if currently active injury (end_date is None or in the future)
            end_date_str = record.get("end_date")
            if not end_date_str:
                is_current_injured = True

        # Calculate average days out per year (assuming 3-year observation window)
        days_per_season = total_days_out / 3.0

        # Calculate risk score (0 to 100)
        base_score = (total_injuries * 8) + (severity_score * 5)
        if recurring_parts:
            base_score += len(recurring_parts) * 15
        if is_current_injured:
            base_score += 20
            
        risk_score = min(100.0, max(0.0, base_score))

        # Risk Classification
        if risk_score >= 70:
            risk_level = "High"
        elif risk_score >= 35:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        # Determine primary vulnerability
        primary_vulnerability = "None"
        if body_part_counts:
            primary_vulnerability = max(body_part_counts, key=body_part_counts.get)

        # Generate explanation
        explanation_parts = []
        if risk_level == "High":
            explanation_parts.append("High risk profile due to frequent or severe injuries")
        elif risk_level == "Medium":
            explanation_parts.append("Moderate risk profile with normal recovery patterns")
        else:
            explanation_parts.append("Low risk profile indicating good general physical robustness")

        if recurring_parts:
            explanation_parts.append(f"Flagged recurring vulnerabilities in: {', '.join(recurring_parts)}")
        if primary_vulnerability != "None":
            explanation_parts.append(f"Most affected area is {primary_vulnerability}")

        return {
            "risk_level": risk_level,
            "risk_score": round(risk_score, 1),
            "expected_days_out_per_season": round(days_per_season, 1),
            "recurring_injuries": recurring_parts,
            "primary_vulnerability": primary_vulnerability,
            "explanation": ". ".join(explanation_parts) + "."
        }
