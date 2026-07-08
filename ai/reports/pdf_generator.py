"""
ScoutAI - PDF Scout Report Generator

Generates professional-quality PDF scouting reports with player profile,
statistics, AI analysis, radar charts, and risk assessments.
"""

import io
import math
from datetime import datetime
from typing import Dict, Any, List, Optional

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm, cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable,
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.graphics.shapes import Drawing, Circle, Line, String, Rect
from reportlab.graphics import renderPDF


# ─── Color Palette (matches ScoutAI dark theme) ──────────────────────────────
NAVY = colors.HexColor("#0a0f1e")
NAVY_LIGHT = colors.HexColor("#121a2e")
ELECTRIC = colors.HexColor("#3b82f6")
EMERALD = colors.HexColor("#10b981")
CORAL = colors.HexColor("#ef4444")
AMBER = colors.HexColor("#f59e0b")
PURPLE = colors.HexColor("#8b5cf6")
TEXT_PRIMARY = colors.HexColor("#f1f5f9")
TEXT_SECONDARY = colors.HexColor("#94a3b8")
TEXT_MUTED = colors.HexColor("#64748b")
BORDER = colors.HexColor("#1e293b")


def _build_styles():
    """Create custom paragraph styles for the PDF."""
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        name="ReportTitle",
        fontSize=22, leading=26, textColor=ELECTRIC,
        fontName="Helvetica-Bold", spaceAfter=4,
    ))
    styles.add(ParagraphStyle(
        name="SectionHeader",
        fontSize=13, leading=16, textColor=ELECTRIC,
        fontName="Helvetica-Bold", spaceBefore=14, spaceAfter=6,
        borderWidth=0, borderPadding=0,
    ))
    styles.add(ParagraphStyle(
        name="SubHeader",
        fontSize=10, leading=13, textColor=TEXT_SECONDARY,
        fontName="Helvetica", spaceAfter=8,
    ))
    styles.add(ParagraphStyle(
        name="BodyText2",
        fontSize=9, leading=12, textColor=colors.HexColor("#334155"),
        fontName="Helvetica", spaceAfter=4,
    ))
    styles.add(ParagraphStyle(
        name="StatLabel",
        fontSize=8, leading=10, textColor=TEXT_MUTED,
        fontName="Helvetica",
    ))
    styles.add(ParagraphStyle(
        name="StatValue",
        fontSize=11, leading=14, textColor=colors.HexColor("#1e293b"),
        fontName="Helvetica-Bold",
    ))
    return styles


def _draw_mini_radar(attributes: Dict[str, int], size: float = 120) -> Drawing:
    """Draw a mini radar chart as a ReportLab Drawing."""
    d = Drawing(size + 40, size + 40)
    cx, cy = (size + 40) / 2, (size + 40) / 2
    r = size / 2 - 10

    labels = list(attributes.keys())
    values = list(attributes.values())
    n = len(labels)
    if n == 0:
        return d

    # Draw background rings
    for ring in [0.25, 0.5, 0.75, 1.0]:
        ring_r = r * ring
        for i in range(n):
            angle1 = (2 * math.pi * i / n) - math.pi / 2
            angle2 = (2 * math.pi * ((i + 1) % n) / n) - math.pi / 2
            x1 = cx + ring_r * math.cos(angle1)
            y1 = cy + ring_r * math.sin(angle1)
            x2 = cx + ring_r * math.cos(angle2)
            y2 = cy + ring_r * math.sin(angle2)
            d.add(Line(x1, y1, x2, y2, strokeColor=colors.HexColor("#e2e8f0"), strokeWidth=0.3))

    # Draw axis lines
    for i in range(n):
        angle = (2 * math.pi * i / n) - math.pi / 2
        x = cx + r * math.cos(angle)
        y = cy + r * math.sin(angle)
        d.add(Line(cx, cy, x, y, strokeColor=colors.HexColor("#e2e8f0"), strokeWidth=0.3))

    # Draw data polygon as connected lines
    points = []
    for i in range(n):
        val = min(values[i] / 100.0, 1.0)
        angle = (2 * math.pi * i / n) - math.pi / 2
        x = cx + r * val * math.cos(angle)
        y = cy + r * val * math.sin(angle)
        points.append((x, y))

    for i in range(n):
        x1, y1 = points[i]
        x2, y2 = points[(i + 1) % n]
        d.add(Line(x1, y1, x2, y2, strokeColor=ELECTRIC, strokeWidth=1.5))
        d.add(Circle(x1, y1, 2, fillColor=ELECTRIC, strokeColor=ELECTRIC))

    # Draw labels
    for i, label in enumerate(labels):
        angle = (2 * math.pi * i / n) - math.pi / 2
        lx = cx + (r + 12) * math.cos(angle)
        ly = cy + (r + 12) * math.sin(angle)
        short_label = label[:3].upper()
        d.add(String(lx - 6, ly - 3, short_label, fontSize=6, fillColor=colors.HexColor("#64748b")))

    return d


def _rating_color(rating: float) -> colors.HexColor:
    """Return a color based on the rating value."""
    if rating >= 85:
        return EMERALD
    elif rating >= 70:
        return ELECTRIC
    elif rating >= 55:
        return AMBER
    else:
        return CORAL


def generate_scout_report_pdf(
    player: Dict[str, Any],
    statistics: Optional[List[Dict[str, Any]]] = None,
    medical_risk: Optional[Dict[str, Any]] = None,
    financial_roi: Optional[Dict[str, Any]] = None,
    role_classification: Optional[Dict[str, Any]] = None,
    age_trajectory: Optional[Dict[str, Any]] = None,
    recommendation_score: Optional[float] = None,
) -> bytes:
    """
    Generate a complete PDF scouting report for a player.
    Returns the PDF as bytes.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        leftMargin=18 * mm, rightMargin=18 * mm,
        topMargin=15 * mm, bottomMargin=15 * mm,
    )
    styles = _build_styles()
    story = []

    # ─── Page 1: Header & Overview ─────────────────────────────────────────
    story.append(Paragraph("SCOUTAI", ParagraphStyle(
        "Logo", fontSize=10, textColor=ELECTRIC, fontName="Helvetica-Bold",
        spaceAfter=2,
    )))
    story.append(Paragraph("SCOUTING REPORT", styles["ReportTitle"]))
    story.append(Paragraph(
        f"Generated {datetime.now().strftime('%d %B %Y')} | Confidential",
        styles["SubHeader"]
    ))
    story.append(HRFlowable(width="100%", thickness=1, color=ELECTRIC, spaceAfter=12))

    # Player headline
    name = player.get("name", "Unknown Player")
    position = player.get("position", "N/A")
    age = player.get("age", "N/A")
    nationality = player.get("nationality", "N/A")
    club_name = player.get("club", {}).get("name", "Free Agent") if isinstance(player.get("club"), dict) else player.get("club_name", "Free Agent")

    story.append(Paragraph(name, ParagraphStyle(
        "PlayerName", fontSize=20, leading=24, textColor=colors.HexColor("#0f172a"),
        fontName="Helvetica-Bold", spaceAfter=4,
    )))
    story.append(Paragraph(
        f"{position} | Age {age} | {nationality} | {club_name}",
        styles["SubHeader"]
    ))
    story.append(Spacer(1, 8))

    # Key ratings table
    overall = player.get("overall_rating", 0)
    potential = player.get("potential", 0)
    market_val = player.get("market_value", 0)
    salary = player.get("salary", 0)

    ratings_data = [
        ["OVERALL", "POTENTIAL", "MARKET VALUE", "WEEKLY WAGE"],
        [
            Paragraph(f"<font color='#{_rating_color(overall).hexval()[2:]}'><b>{overall:.0f}</b></font>", styles["StatValue"]),
            Paragraph(f"<font color='#{_rating_color(potential).hexval()[2:]}'><b>{potential:.0f}</b></font>", styles["StatValue"]),
            Paragraph(f"<b>{_format_currency(market_val)}</b>", styles["StatValue"]),
            Paragraph(f"<b>{_format_currency(salary)}/wk</b>", styles["StatValue"]),
        ]
    ]
    ratings_table = Table(ratings_data, colWidths=[120, 120, 120, 120])
    ratings_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f1f5f9")),
        ("TEXTCOLOR", (0, 0), (-1, 0), TEXT_MUTED),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, 0), 7),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(ratings_table)
    story.append(Spacer(1, 12))

    # ─── Attributes Radar ──────────────────────────────────────────────────
    story.append(Paragraph("ATTRIBUTE PROFILE", styles["SectionHeader"]))
    attributes = {
        "Pace": player.get("pace", 50),
        "Shooting": player.get("shooting", 50),
        "Passing": player.get("passing", 50),
        "Dribbling": player.get("dribbling", 50),
        "Defending": player.get("defending", 50),
        "Physical": player.get("physical", 50),
        "Vision": player.get("vision", 50),
        "Creativity": player.get("creativity", 50),
    }
    radar = _draw_mini_radar(attributes, size=140)
    story.append(radar)
    story.append(Spacer(1, 8))

    # Attribute details table
    attr_keys = list(attributes.keys())
    attr_vals = list(attributes.values())
    half = len(attr_keys) // 2
    attr_data = []
    for i in range(half):
        attr_data.append([
            attr_keys[i], f"{attr_vals[i]}/99",
            attr_keys[i + half] if i + half < len(attr_keys) else "",
            f"{attr_vals[i + half]}/99" if i + half < len(attr_vals) else "",
        ])

    attr_table = Table(attr_data, colWidths=[100, 60, 100, 60])
    attr_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("TEXTCOLOR", (0, 0), (0, -1), TEXT_MUTED),
        ("TEXTCOLOR", (2, 0), (2, -1), TEXT_MUTED),
        ("FONTNAME", (1, 0), (1, -1), "Helvetica-Bold"),
        ("FONTNAME", (3, 0), (3, -1), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#e2e8f0")),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    story.append(attr_table)
    story.append(Spacer(1, 12))

    # ─── Season Statistics ─────────────────────────────────────────────────
    if statistics:
        story.append(Paragraph("SEASON STATISTICS", styles["SectionHeader"]))
        stat_headers = ["Season", "Apps", "Goals", "Assists", "xG", "xA", "Avg Rating"]
        stat_rows = [stat_headers]
        for s in statistics[:3]:  # Last 3 seasons
            stat_rows.append([
                s.get("season", ""),
                str(s.get("matches", 0)),
                str(s.get("goals", 0)),
                str(s.get("assists", 0)),
                f"{s.get('xg', 0):.1f}",
                f"{s.get('xg_assist', 0):.1f}",
                f"{s.get('average_rating', 0):.1f}",
            ])

        stat_table = Table(stat_rows, colWidths=[80, 50, 50, 50, 50, 50, 70])
        stat_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f1f5f9")),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 8),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#475569")),
            ("ALIGN", (1, 0), (-1, -1), "CENTER"),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ]))
        story.append(stat_table)
        story.append(Spacer(1, 12))

    # ─── AI Analysis Section ───────────────────────────────────────────────
    story.append(PageBreak())
    story.append(Paragraph("AI ANALYSIS", styles["ReportTitle"]))
    story.append(HRFlowable(width="100%", thickness=1, color=ELECTRIC, spaceAfter=12))

    # Role Classification
    if role_classification:
        story.append(Paragraph("TACTICAL ROLE CLASSIFICATION", styles["SectionHeader"]))
        primary = role_classification.get("primary_role", "Unknown")
        conf = role_classification.get("confidence", 0)
        story.append(Paragraph(
            f"Primary Role: <b>{primary}</b> (Confidence: {conf:.0%})",
            styles["BodyText2"]
        ))
        classifications = role_classification.get("classifications", [])[:5]
        if classifications:
            role_data = [["Role", "Fit Score", "Explanation"]]
            for c in classifications:
                role_data.append([
                    c.get("role", ""),
                    f"{c.get('score', 0):.0%}",
                    c.get("explanation", "")[:60],
                ])
            role_table = Table(role_data, colWidths=[120, 60, 300])
            role_table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f1f5f9")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 7),
                ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#e2e8f0")),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ]))
            story.append(role_table)
        story.append(Spacer(1, 12))

    # Medical Risk Assessment
    if medical_risk:
        story.append(Paragraph("MEDICAL RISK ASSESSMENT", styles["SectionHeader"]))
        risk_level = medical_risk.get("risk_level", "Unknown")
        risk_color = "#10b981" if risk_level == "Low" else "#f59e0b" if risk_level == "Medium" else "#ef4444"
        story.append(Paragraph(
            f"Risk Level: <font color='{risk_color}'><b>{risk_level}</b></font> "
            f"(Score: {medical_risk.get('risk_score', 0):.0f}/100)",
            styles["BodyText2"]
        ))
        story.append(Paragraph(
            f"Expected Days Out Per Season: {medical_risk.get('expected_days_out_per_season', 0):.0f}",
            styles["BodyText2"]
        ))
        recurring = medical_risk.get("recurring_injuries", [])
        if recurring:
            story.append(Paragraph(
                f"Recurring Vulnerabilities: {', '.join(recurring)}",
                styles["BodyText2"]
            ))
        story.append(Paragraph(medical_risk.get("explanation", ""), styles["BodyText2"]))
        story.append(Spacer(1, 12))

    # Financial ROI
    if financial_roi:
        story.append(Paragraph("FINANCIAL & FFP ANALYSIS", styles["SectionHeader"]))
        ffp_class = financial_roi.get("ffp_impact_rating", "Unknown")
        ffp_color = "#10b981" if ffp_class == "Low" else "#f59e0b" if ffp_class in ("Moderate", "High") else "#ef4444"

        fin_data = [
            ["Metric", "Value"],
            ["Estimated Fee", _format_currency(financial_roi.get("purchase_fee_est", 0))],
            ["Annual Amortization", _format_currency(financial_roi.get("annual_amortization", 0))],
            ["Annual Wage Cost", _format_currency(financial_roi.get("annual_wage_est", 0))],
            ["FFP Annual Book Cost", _format_currency(financial_roi.get("ffp_annual_book_cost", 0))],
            ["FFP Impact Rating", ffp_class],
            ["3-Year Projected Value", _format_currency(financial_roi.get("projected_market_value_3yr", 0))],
            ["Net ROI", f"{financial_roi.get('projected_net_roi_pct', 0):.1f}%"],
        ]
        fin_table = Table(fin_data, colWidths=[180, 200])
        fin_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f1f5f9")),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 8),
            ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#e2e8f0")),
            ("TOPPADDING", (0, 0), (-1, -1), 3),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ]))
        story.append(fin_table)
        story.append(Spacer(1, 8))
        story.append(Paragraph(financial_roi.get("explanation", ""), styles["BodyText2"]))
        story.append(Spacer(1, 12))

    # Age Trajectory
    if age_trajectory:
        story.append(Paragraph("AGE-CURVE PERFORMANCE TRAJECTORY", styles["SectionHeader"]))
        story.append(Paragraph(
            f"Positional Peak Window: {age_trajectory.get('positional_peak_range', 'N/A')}",
            styles["BodyText2"]
        ))
        trajectory = age_trajectory.get("projected_trajectory", [])
        if trajectory:
            traj_data = [["Year", "Age", "Projected OVR", "Proj. Goals", "Proj. Assists"]]
            for t in trajectory:
                traj_data.append([
                    f"+{t['year']}",
                    str(t["age"]),
                    f"{t['overall_rating']:.1f}",
                    f"{t['projected_goals']:.1f}",
                    f"{t['projected_assists']:.1f}",
                ])
            traj_table = Table(traj_data, colWidths=[50, 50, 100, 90, 90])
            traj_table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f1f5f9")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#e2e8f0")),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ]))
            story.append(traj_table)
        story.append(Paragraph(age_trajectory.get("explanation", ""), styles["BodyText2"]))
        story.append(Spacer(1, 12))

    # Recommendation Score
    if recommendation_score is not None:
        story.append(Paragraph("RECOMMENDATION", styles["SectionHeader"]))
        rec_label = "Strong Buy" if recommendation_score >= 80 else "Buy" if recommendation_score >= 60 else "Monitor" if recommendation_score >= 40 else "Pass"
        rec_color = "#10b981" if recommendation_score >= 60 else "#f59e0b" if recommendation_score >= 40 else "#ef4444"
        story.append(Paragraph(
            f"AI Recommendation Score: <font color='{rec_color}'><b>{recommendation_score:.0f}/100 — {rec_label}</b></font>",
            styles["BodyText2"]
        ))

    # ─── Footer ────────────────────────────────────────────────────────────
    story.append(Spacer(1, 30))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#cbd5e1"), spaceAfter=6))
    story.append(Paragraph(
        "This report was generated by ScoutAI Intelligence Platform. "
        "All analysis is AI-assisted and should be validated by professional scouts.",
        ParagraphStyle("Footer", fontSize=7, textColor=TEXT_MUTED, fontName="Helvetica", alignment=TA_CENTER),
    ))

    doc.build(story)
    return buffer.getvalue()


def _format_currency(value: float) -> str:
    """Format a number as a currency string."""
    if value >= 1_000_000:
        return f"\u20ac{value / 1_000_000:.1f}M"
    elif value >= 1_000:
        return f"\u20ac{value / 1_000:.0f}K"
    else:
        return f"\u20ac{value:.0f}"
