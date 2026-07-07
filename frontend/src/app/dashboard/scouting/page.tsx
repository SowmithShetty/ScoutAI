"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Brain,
  Search,
  Target,
  Zap,
  ChevronDown,
  ChevronUp,
  Sparkles,
  SlidersHorizontal,
  MessageSquareText,
  ArrowRight,
  Star,
  BookmarkPlus,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Shield,
  HeartPulse,
  DollarSign,
  TrendingUp,
  Activity,
  Info,
} from "lucide-react";
import { formatCurrency, POSITION_COLORS } from "@/lib/types";
import { PlayerRadarChart } from "@/components/charts/RadarChart";

// ─── MOCK DATA: AI Recommendation Results ────────────────────────────────────

const MOCK_CANDIDATES = [
  {
    id: "1", name: "Erling Haaland", age: 25, position: "ST", club: "Manchester City",
    value: 180000000, salary: 375000, overall: 91, potential: 95,
    final_score: 88.2, recommendation: "Highly Recommended",
    pace: 89, shooting: 94, passing: 65, dribbling: 78, defending: 45, physical: 88,
    dimension_scores: { performance: 95, tactical_fit: 90, medical: 82, age_potential: 88, financial: 72, availability: 85 },
    explanations: {
      performance: "Overall rating of 91 indicates elite quality. Currently in excellent form (8.5/10). Strong goal output (27 goals this season).",
      tactical_fit: "Plays in the required ST position. Meets 5 of 6 tactical attribute requirements. Playing style (Direct, Powerful) aligns with pressing system.",
      medical: "Currently fit and available for selection. Moderate injury history (3 injuries on record).",
      age_potential: "At 25, in the ideal development-to-prime age window. Good potential for improvement (POT 95, +4).",
      financial: "Market value (€180M) near the budget limit. High weekly salary of €375K may strain wage structure.",
      availability: "Currently available for selection.",
    },
    summary: "Erling Haaland is an excellent candidate for the ST role with an overall score of 88/100. Key strength is performance output (95/100). Main concern: financial viability (72/100).",
    role_classifications: [
      { role: "Target Man", score: 92, explanation: "Strong heading (92), strength (90), physical (88)" },
      { role: "Pressing Forward", score: 85, explanation: "Good aggression (75), pace (89), finishing (96)" },
      { role: "Poacher", score: 80, explanation: "Elite finishing (96), clinical shooting (94)" },
    ],
  },
  {
    id: "4", name: "Lautaro Martínez", age: 27, position: "ST", club: "Inter Milan",
    value: 110000000, salary: 250000, overall: 89, potential: 91,
    final_score: 82.5, recommendation: "Highly Recommended",
    pace: 82, shooting: 88, passing: 77, dribbling: 85, defending: 48, physical: 84,
    dimension_scores: { performance: 88, tactical_fit: 85, medical: 90, age_potential: 78, financial: 85, availability: 70 },
    explanations: {
      performance: "Overall rating of 89 indicates elite quality. Strong and consistent performer in Serie A.",
      tactical_fit: "Natural striker with excellent finishing and movement. Good pressing intensity.",
      medical: "Clean recent medical record with no significant injuries.",
      age_potential: "At 27, in peak performance years with limited ceiling growth remaining.",
      financial: "Market value (€110M) within budget. Reasonable salary of €250K/week.",
      availability: "Currently under contract at Inter Milan. Not transfer listed.",
    },
    summary: "Lautaro Martínez is an excellent candidate for the ST role with an overall score of 83/100. Balanced profile with strong medical record.",
    role_classifications: [
      { role: "Pressing Forward", score: 88, explanation: "High work rate, aggressive pressing, clinical finishing" },
      { role: "Poacher", score: 82, explanation: "Excellent movement, finishing, positional awareness" },
    ],
  },
  {
    id: "12", name: "Kylian Mbappé", age: 26, position: "ST", club: "Real Madrid",
    value: 180000000, salary: 500000, overall: 91, potential: 94,
    final_score: 79.8, recommendation: "Recommended",
    pace: 97, shooting: 90, passing: 80, dribbling: 92, defending: 36, physical: 78,
    dimension_scores: { performance: 93, tactical_fit: 82, medical: 85, age_potential: 82, financial: 55, availability: 60 },
    explanations: {
      performance: "World-class pace and dribbling. Elite goal scorer with 91 overall.",
      tactical_fit: "More of a wide forward than traditional striker. Outstanding in transition.",
      medical: "Generally fit. Minor injury concerns.",
      age_potential: "At 26, approaching peak with high potential ceiling.",
      financial: "Market value (€180M) and salary (€500K) present significant financial challenge.",
      availability: "Core player at Real Madrid. Extremely difficult to sign.",
    },
    summary: "Kylian Mbappé is a strong candidate but presents significant financial and availability challenges.",
    role_classifications: [
      { role: "Pressing Forward", score: 90, explanation: "Explosive pace (97), elite dribbling (92), direct running" },
      { role: "False Nine", score: 75, explanation: "Creative, vision, but limited playmaking role experience" },
    ],
  },
  {
    id: "15", name: "Alejandro Garnacho", age: 21, position: "LW", club: "Manchester United",
    value: 50000000, salary: 120000, overall: 80, potential: 89,
    final_score: 68.4, recommendation: "Recommended",
    pace: 90, shooting: 72, passing: 68, dribbling: 82, defending: 38, physical: 70,
    dimension_scores: { performance: 62, tactical_fit: 65, medical: 92, age_potential: 85, financial: 90, availability: 72 },
    explanations: {
      performance: "Overall rating of 80 — still developing. Shows flashes of brilliance but inconsistent.",
      tactical_fit: "Plays LW, not the required ST. Would need position adaptation.",
      medical: "Excellent injury record. Young and durable.",
      age_potential: "At 21, exceptional growth potential (POT 89, +9 ceiling).",
      financial: "Excellent value at €50M. Very manageable salary of €120K/week.",
      availability: "Transfer listed by Manchester United. Negotiable price likely.",
    },
    summary: "Garnacho is a financially attractive option with huge upside but requires tactical adaptation and patience.",
    role_classifications: [
      { role: "Inverted Winger", score: 82, explanation: "Pace, dribbling, cutting inside" },
    ],
  },
  {
    id: "3", name: "Harry Kane", age: 31, position: "ST", club: "Bayern Munich",
    value: 100000000, salary: 400000, overall: 90, potential: 90,
    final_score: 64.1, recommendation: "Worth Monitoring",
    pace: 68, shooting: 93, passing: 85, dribbling: 82, defending: 47, physical: 83,
    dimension_scores: { performance: 92, tactical_fit: 78, medical: 65, age_potential: 45, financial: 68, availability: 55 },
    explanations: {
      performance: "Elite finisher with 93 shooting. One of the best strikers of his generation.",
      tactical_fit: "Strong tactical understanding. Excellent link-up play and set pieces.",
      medical: "History of ankle issues. Some recurring injury concerns.",
      age_potential: "At 31, past peak with no potential growth remaining. Resale value will decline.",
      financial: "Market value (€100M) and salary (€400K/week) are significant commitments for a declining asset.",
      availability: "Core Bayern player. Would require record offer.",
    },
    summary: "Harry Kane is a proven elite striker but age, declining trajectory, and cost make this a risky long-term investment.",
    role_classifications: [
      { role: "Deep Lying Forward", score: 90, explanation: "Elite passing (85), vision, creativity from deep" },
      { role: "Target Man", score: 85, explanation: "Strong heading, physical presence, hold-up play" },
    ],
  },
];

const POSITIONS = ["ST", "CF", "LW", "RW", "CAM", "CM", "CDM", "CB", "LB", "RB", "GK"];

const EXAMPLE_PROMPTS = [
  "We play a high pressing 4-3-3. Need a striker under 26, excellent finishing, strong aerially, maximum €120M budget.",
  "Looking for a creative central midfielder aged 22-28, great passing and vision, possession-based style, budget €80M.",
  "Need a fast left winger who can dribble and cut inside. Under 24. Counter-attacking system. Budget €60M.",
  "Seeking a ball-playing centre-back with good distribution, strong in the air. Maximum 28 years. €70M budget.",
];

// ═══════════════════════════════════════════════════════════════════════════════
// SCOUTING HUB PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function ScoutingPage() {
  const [mode, setMode] = useState<"nlp" | "form">("nlp");
  const [nlpInput, setNlpInput] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Form mode state
  const [formData, setFormData] = useState({
    position: "ST",
    min_age: 18,
    max_age: 28,
    budget: 120,
    style: "High Pressing",
    pace: 70,
    shooting: 80,
    passing: 60,
    dribbling: 70,
    defending: 40,
    physical: 75,
    heading: 70,
    finishing: 85,
  });

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  const getDimensionColor = (score: number) => {
    if (score >= 85) return "text-emerald";
    if (score >= 70) return "text-electric-bright";
    if (score >= 50) return "text-amber";
    return "text-coral";
  };

  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case "Highly Recommended":
        return "bg-emerald/20 text-emerald-bright border-emerald/30";
      case "Recommended":
        return "bg-electric/20 text-electric-bright border-electric/30";
      case "Worth Monitoring":
        return "bg-amber/20 text-amber border-amber/30";
      default:
        return "bg-coral/20 text-coral border-coral/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* ─── Page Header ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
          <Brain className="w-7 h-7 text-electric-bright" />
          AI Scouting Hub
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Define your tactical requirements and let AI find the perfect signing
        </p>
      </div>

      {/* ─── Mode Selector ───────────────────────────────────────────────── */}
      <div className="flex gap-2">
        <button
          onClick={() => { setMode("nlp"); setShowResults(false); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            mode === "nlp"
              ? "bg-electric/20 text-electric-bright border border-electric/30"
              : "bg-surface/30 text-text-muted hover:text-text-primary border border-transparent"
          }`}
        >
          <MessageSquareText className="w-4 h-4" />
          Natural Language
        </button>
        <button
          onClick={() => { setMode("form"); setShowResults(false); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            mode === "form"
              ? "bg-electric/20 text-electric-bright border border-electric/30"
              : "bg-surface/30 text-text-muted hover:text-text-primary border border-transparent"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Structured Form
        </button>
      </div>

      {/* ─── NLP Mode ────────────────────────────────────────────────────── */}
      {mode === "nlp" && !showResults && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-electric-bright" />
              <h3 className="text-base font-semibold text-text-primary">
                Describe Your Ideal Signing
              </h3>
            </div>
            <p className="text-xs text-text-muted mb-4">
              Write naturally, as you would brief your scouts. Our NLP engine extracts position, attributes, age, budget, playing style, and tactical requirements.
            </p>
            <textarea
              value={nlpInput}
              onChange={(e) => setNlpInput(e.target.value)}
              placeholder="e.g., We play a high pressing 4-3-3. Need a striker under 26, excellent finishing, strong aerially, maximum €120M budget..."
              className="w-full h-36 bg-navy-light border border-border rounded-xl p-4 text-sm text-text-primary placeholder-text-muted resize-none focus:outline-none focus:border-electric/50 transition-colors"
            />
            <div className="flex items-center justify-between mt-4">
              <div className="text-xs text-text-muted">
                {nlpInput.length > 0 ? `${nlpInput.split(" ").filter(Boolean).length} words` : "Try an example below"}
              </div>
              <button
                onClick={handleAnalyze}
                disabled={nlpInput.length < 10}
                className="btn-primary py-2.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Brain className="w-4 h-4" />
                Analyze & Find Candidates
              </button>
            </div>
          </div>

          {/* Example Prompts */}
          <div className="glass-card p-5">
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Example Scouting Briefs
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {EXAMPLE_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setNlpInput(prompt)}
                  className="text-left p-3 rounded-lg bg-navy-light hover:bg-surface/50 border border-border/50 hover:border-electric/30 transition-all text-xs text-text-secondary leading-relaxed"
                >
                  &quot;{prompt}&quot;
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── Form Mode ───────────────────────────────────────────────────── */}
      {mode === "form" && !showResults && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald" />
              Define Requirements
            </h3>

            {/* Row 1: Position, Age, Budget, Style */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="text-xs text-text-muted mb-1 block">Position</label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="input-field py-2 text-sm"
                >
                  {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-text-muted mb-1 block">Age Range</label>
                <div className="flex items-center gap-2">
                  <input type="number" value={formData.min_age} onChange={(e) => setFormData({ ...formData, min_age: parseInt(e.target.value) || 16 })} className="input-field py-2 text-sm w-16" />
                  <span className="text-text-muted text-xs">to</span>
                  <input type="number" value={formData.max_age} onChange={(e) => setFormData({ ...formData, max_age: parseInt(e.target.value) || 35 })} className="input-field py-2 text-sm w-16" />
                </div>
              </div>
              <div>
                <label className="text-xs text-text-muted mb-1 block">Budget (€M)</label>
                <input type="number" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 50 })} className="input-field py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-text-muted mb-1 block">Playing Style</label>
                <select value={formData.style} onChange={(e) => setFormData({ ...formData, style: e.target.value })} className="input-field py-2 text-sm">
                  <option value="High Pressing">High Pressing</option>
                  <option value="Possession-Based">Possession-Based</option>
                  <option value="Counter-Attacking">Counter-Attacking</option>
                  <option value="Direct">Direct</option>
                  <option value="Wing Play">Wing Play</option>
                </select>
              </div>
            </div>

            {/* Row 2: Attribute Sliders */}
            <h4 className="text-sm font-semibold text-text-primary mb-3">Minimum Attribute Requirements</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
              {(["pace", "shooting", "passing", "dribbling", "defending", "physical", "heading", "finishing"] as const).map((attr) => (
                <div key={attr}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-text-secondary capitalize">{attr}</label>
                    <span className="text-xs font-bold text-text-primary">{formData[attr]}</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="99"
                    value={formData[attr]}
                    onChange={(e) => setFormData({ ...formData, [attr]: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-navy-lighter rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-electric [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={handleAnalyze} className="btn-primary py-2.5 text-sm">
                <Brain className="w-4 h-4" />
                Run AI Analysis
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── Analyzing Spinner ────────────────────────────────────────────── */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="w-16 h-16 border-4 border-electric/20 border-t-electric rounded-full animate-spin" />
            <Brain className="absolute inset-0 m-auto w-6 h-6 text-electric-bright" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">
            AI Analysis in Progress
          </h3>
          <p className="text-sm text-text-secondary">
            Evaluating 14,832 players across 6 scoring dimensions...
          </p>
          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-text-muted">
            {["Parsing requirements", "Building feature vectors", "Scoring candidates", "Ranking results"].map((step, i) => (
              <motion.span
                key={step}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                className="flex items-center gap-1"
              >
                <Activity className="w-3 h-3" /> {step}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* ─── Results ──────────────────────────────────────────────────────── */}
      {showResults && !isAnalyzing && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-electric-bright" />
                AI Ranked Candidates
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                {MOCK_CANDIDATES.length} candidates scored across 6 dimensions
              </p>
            </div>
            <button
              onClick={() => setShowResults(false)}
              className="btn-secondary py-2 text-sm"
            >
              Modify Requirements
            </button>
          </div>

          {/* Candidate Cards */}
          {MOCK_CANDIDATES.map((candidate, idx) => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="glass-card overflow-hidden"
            >
              {/* Main Row */}
              <div className="p-5 flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Rank */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric to-emerald flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {idx + 1}
                </div>

                {/* Player Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-text-primary">{candidate.name}</h3>
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold"
                      style={{ backgroundColor: `${POSITION_COLORS[candidate.position] || "#64748b"}20`, color: POSITION_COLORS[candidate.position] || "#64748b" }}
                    >
                      {candidate.position}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRecommendationBadge(candidate.recommendation)}`}>
                      {candidate.recommendation}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted">{candidate.club} · Age {candidate.age} · OVR {candidate.overall} · POT {candidate.potential}</p>
                </div>

                {/* Score Ring */}
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-center">
                    <div className={`text-3xl font-black ${getDimensionColor(candidate.final_score)}`}>
                      {candidate.final_score.toFixed(0)}
                    </div>
                    <p className="text-[10px] text-text-muted">AI Score</p>
                  </div>

                  {/* Mini Dimension Bars */}
                  <div className="hidden md:grid grid-cols-3 gap-x-4 gap-y-1">
                    {Object.entries(candidate.dimension_scores).map(([dim, score]) => (
                      <div key={dim} className="flex items-center gap-1.5">
                        <span className="text-[10px] text-text-muted w-14 capitalize">{dim.replace("_", " ")}</span>
                        <div className="w-12 h-1.5 bg-navy-lighter rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${score >= 85 ? "bg-emerald" : score >= 70 ? "bg-electric" : score >= 50 ? "bg-amber" : "bg-coral"}`} style={{ width: `${score}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-text-primary w-6 text-right">{score}</span>
                      </div>
                    ))}
                  </div>

                  {/* Value + Actions */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-emerald">{formatCurrency(candidate.value)}</span>
                    <button
                      onClick={() => setExpandedId(expandedId === candidate.id ? null : candidate.id)}
                      className="w-8 h-8 rounded-lg bg-surface/50 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
                    >
                      {expandedId === candidate.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Explanation Panel */}
              <AnimatePresence>
                {expandedId === candidate.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-0 space-y-4 border-t border-border">
                      {/* AI Summary */}
                      <div className="bg-electric/5 border border-electric/20 rounded-lg p-4 mt-4">
                        <h4 className="text-sm font-semibold text-electric-bright flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4" /> AI Assessment Summary
                        </h4>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {candidate.summary}
                        </p>
                      </div>

                      {/* Dimension Explanations Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          { key: "performance", icon: TrendingUp, label: "Performance", color: "text-emerald" },
                          { key: "tactical_fit", icon: Target, label: "Tactical Fit", color: "text-electric-bright" },
                          { key: "medical", icon: HeartPulse, label: "Medical", color: "text-coral" },
                          { key: "age_potential", icon: Star, label: "Age & Potential", color: "text-amber" },
                          { key: "financial", icon: DollarSign, label: "Financial", color: "text-emerald" },
                          { key: "availability", icon: Shield, label: "Availability", color: "text-purple-bright" },
                        ].map((dim) => (
                          <div key={dim.key} className="bg-navy-light rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className={`text-xs font-bold flex items-center gap-1.5 ${dim.color}`}>
                                <dim.icon className="w-3.5 h-3.5" /> {dim.label}
                              </h5>
                              <span className={`text-sm font-black ${getDimensionColor(candidate.dimension_scores[dim.key as keyof typeof candidate.dimension_scores])}`}>
                                {candidate.dimension_scores[dim.key as keyof typeof candidate.dimension_scores]}
                              </span>
                            </div>
                            <p className="text-[11px] text-text-secondary leading-relaxed">
                              {candidate.explanations[dim.key as keyof typeof candidate.explanations]}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Role Classification */}
                      <div>
                        <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                          <Target className="w-4 h-4 text-amber" /> Tactical Role Classification
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {candidate.role_classifications.map((role) => (
                            <div key={role.role} className="bg-navy-light rounded-lg px-3 py-2 border border-border/50">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-sm font-bold text-text-primary">{role.role}</span>
                                <span className={`text-xs font-bold ${getDimensionColor(role.score)}`}>
                                  {role.score}%
                                </span>
                              </div>
                              <p className="text-[10px] text-text-muted">{role.explanation}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link href={`/dashboard/players/${candidate.id}`} className="btn-primary py-2 text-sm">
                          <Eye className="w-4 h-4" /> Full Profile
                        </Link>
                        <button className="btn-secondary py-2 text-sm">
                          <BookmarkPlus className="w-4 h-4" /> Add to Shortlist
                        </button>
                        <Link href="/dashboard/players/compare" className="btn-secondary py-2 text-sm">
                          <ArrowRight className="w-4 h-4" /> Compare
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
