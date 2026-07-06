"use client";

import { motion } from "framer-motion";
import { use } from "react";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Ruler,
  Weight,
  Flag,
  DollarSign,
  FileText,
  Heart,
  TrendingUp,
  Star,
  Shield,
  Target,
  Zap,
  BookmarkPlus,
  Share2,
  Download,
  ChevronRight,
  Activity,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { formatCurrency } from "@/lib/types";

// ─── Mock Player Detail Data ─────────────────────────────────────────────────

const PLAYER = {
  id: "1",
  name: "Erling Haaland",
  full_name: "Erling Braut Haaland",
  age: 25,
  nationality: "Norway",
  position: "ST",
  club: "Manchester City",
  league: "Premier League",
  height: 194,
  weight: 88,
  preferred_foot: "Left",
  market_value: 180000000,
  salary: 375000,
  contract_expiry: "2028-06-30",
  jersey_number: 9,
  agent: "Rafaela Pimenta",
  overall_rating: 91,
  potential: 95,
  form: 8.5,
  availability: "Available",
  tactical_role: "Target Man / Pressing Forward",
  playing_style: "Direct, Powerful, Clinical",
  // Attributes
  pace: 89, shooting: 94, passing: 65, dribbling: 78,
  defending: 45, physical: 88, vision: 62, creativity: 55,
  aggression: 75, leadership: 70, heading: 92, finishing: 96,
  strength: 90, weak_foot: 3, skill_moves: 3,
  // Text
  strengths: "Clinical Finishing, Aerial Dominance, Pace, Positioning, Counter-Attacking, Hold-Up Play",
  weaknesses: "Passing Range, Creativity, First Touch Under Pressure, Build-Up Involvement",
  ai_summary: "Erling Haaland is a generational striker combining explosive pace with exceptional aerial ability and clinical finishing. His movement in the penalty area is elite, consistently finding space behind defensive lines. While his technical involvement in build-up play is limited, his output as a pure goal scorer is unmatched in world football. An ideal signing for teams that create chances through wide play and direct passing into the forward line.",
};

const SEASON_STATS = {
  goals: 27, assists: 5, matches: 31, minutes: 2580,
  rating: 7.8, xg: 24.2, xg_assist: 3.8,
};

const RADAR_DATA = [
  { stat: "Pace", value: 89 },
  { stat: "Shooting", value: 94 },
  { stat: "Passing", value: 65 },
  { stat: "Dribbling", value: 78 },
  { stat: "Defending", value: 45 },
  { stat: "Physical", value: 88 },
  { stat: "Vision", value: 62 },
  { stat: "Heading", value: 92 },
];

const PERFORMANCE_TREND = [
  { season: "20/21", goals: 41, assists: 12, rating: 7.9 },
  { season: "21/22", goals: 29, assists: 8, rating: 7.6 },
  { season: "22/23", goals: 52, assists: 9, rating: 8.2 },
  { season: "23/24", goals: 38, assists: 7, rating: 7.8 },
  { season: "24/25", goals: 27, assists: 5, rating: 7.8 },
];

const ADVANCED_STATS = [
  { label: "xG", value: "24.2", per90: "0.85" },
  { label: "xA", value: "3.8", per90: "0.13" },
  { label: "Progressive Passes", value: "45", per90: "1.57" },
  { label: "Progressive Carries", value: "62", per90: "2.16" },
  { label: "Defensive Actions", value: "38", per90: "1.33" },
  { label: "Pressures", value: "215", per90: "7.50" },
  { label: "Aerial Wins", value: "89", per90: "3.10" },
  { label: "Touches", value: "820", per90: "28.6" },
  { label: "Pass %", value: "78.2%", per90: "-" },
  { label: "Shot Creating Actions", value: "42", per90: "1.47" },
  { label: "Dribbles", value: "28", per90: "0.98" },
  { label: "Tackles", value: "15", per90: "0.52" },
  { label: "Interceptions", value: "8", per90: "0.28" },
  { label: "Shots on Target", value: "68", per90: "2.37" },
];

const TRANSFER_HISTORY = [
  { season: "2022", from: "Borussia Dortmund", to: "Manchester City", fee: 60000000, type: "Permanent" },
  { season: "2019", from: "RB Salzburg", to: "Borussia Dortmund", fee: 20000000, type: "Permanent" },
  { season: "2019", from: "Molde FK", to: "RB Salzburg", fee: 5000000, type: "Permanent" },
];

const INJURIES = [
  { type: "Foot Stress Fracture", body: "Foot", severity: "Moderate", start: "2024-01-15", end: "2024-03-01", missed: 8 },
  { type: "Groin Strain", body: "Groin", severity: "Minor", start: "2023-10-05", end: "2023-10-28", missed: 4 },
  { type: "Ankle Ligament", body: "Ankle", severity: "Moderate", start: "2023-04-12", end: "2023-05-15", missed: 5 },
];

// ─── Custom Tooltip ──────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card-solid px-3 py-2 text-sm">
      <p className="text-text-secondary text-xs">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-text-primary font-semibold" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PLAYER PROFILE PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function PlayerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="space-y-6">
      {/* ─── Back Button ───────────────────────────────────────────────── */}
      <Link
        href="/dashboard/players"
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Players
      </Link>

      {/* ─── Player Header ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Photo & Basic Info */}
          <div className="flex items-start gap-5">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-electric/20 to-emerald/20 flex items-center justify-center text-4xl font-bold text-text-secondary shrink-0 border border-border">
              {PLAYER.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-text-primary">
                  {PLAYER.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-electric/10 text-electric-bright">
                  {PLAYER.position}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald/10 text-emerald">
                  #{PLAYER.jersey_number}
                </span>
              </div>
              <p className="text-sm text-text-secondary mb-3">
                {PLAYER.club} · {PLAYER.league} · {PLAYER.tactical_role}
              </p>

              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <span className="flex items-center gap-1.5 text-text-muted">
                  <Calendar className="w-3.5 h-3.5" /> {PLAYER.age} years
                </span>
                <span className="flex items-center gap-1.5 text-text-muted">
                  <Flag className="w-3.5 h-3.5" /> {PLAYER.nationality}
                </span>
                <span className="flex items-center gap-1.5 text-text-muted">
                  <Ruler className="w-3.5 h-3.5" /> {PLAYER.height} cm
                </span>
                <span className="flex items-center gap-1.5 text-text-muted">
                  <Weight className="w-3.5 h-3.5" /> {PLAYER.weight} kg
                </span>
                <span className="flex items-center gap-1.5 text-text-muted">
                  <Zap className="w-3.5 h-3.5" /> {PLAYER.preferred_foot} foot
                </span>
                <span className="flex items-center gap-1.5 text-text-muted">
                  <FileText className="w-3.5 h-3.5" /> Until {PLAYER.contract_expiry}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats & Actions */}
          <div className="lg:ml-auto flex flex-col items-end gap-3">
            <div className="flex items-center gap-2">
              <button className="btn-primary py-2 text-sm">
                <BookmarkPlus className="w-4 h-4" /> Shortlist
              </button>
              <button className="btn-secondary py-2 text-sm">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="btn-secondary py-2 text-sm">
                <Download className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-4 text-right">
              <div>
                <p className="text-xs text-text-muted">Market Value</p>
                <p className="text-lg font-bold text-emerald">
                  {formatCurrency(PLAYER.market_value)}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Weekly Salary</p>
                <p className="text-lg font-bold text-text-primary">
                  {formatCurrency(PLAYER.salary)}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Overall</p>
                <p className="text-lg font-bold text-electric-bright">
                  {PLAYER.overall_rating}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Potential</p>
                <p className="text-lg font-bold text-amber">
                  {PLAYER.potential}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Season Summary Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: "Goals", value: SEASON_STATS.goals, color: "text-emerald" },
          { label: "Assists", value: SEASON_STATS.assists, color: "text-electric-bright" },
          { label: "Matches", value: SEASON_STATS.matches, color: "text-text-primary" },
          { label: "Minutes", value: SEASON_STATS.minutes.toLocaleString(), color: "text-text-primary" },
          { label: "Rating", value: SEASON_STATS.rating.toFixed(1), color: "text-amber" },
          { label: "xG", value: SEASON_STATS.xg.toFixed(1), color: "text-purple-bright" },
          { label: "xA", value: SEASON_STATS.xg_assist.toFixed(1), color: "text-cyan-bright" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.03 }}
            className="glass-card p-3 text-center"
          >
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ─── Main Content Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5"
        >
          <h3 className="text-sm font-semibold text-text-primary mb-4">
            Attribute Radar
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="rgba(148,163,184,0.1)" />
              <PolarAngleAxis
                dataKey="stat"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: "#64748b", fontSize: 10 }}
              />
              <Radar
                name="Attributes"
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Performance Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-5"
        >
          <h3 className="text-sm font-semibold text-text-primary mb-4">
            Performance Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={PERFORMANCE_TREND}>
              <defs>
                <linearGradient id="goalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.07)" />
              <XAxis dataKey="season" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="goals" stroke="#10b981" fill="url(#goalGrad)" strokeWidth={2} name="Goals" />
              <Area type="monotone" dataKey="assists" stroke="#3b82f6" fill="transparent" strokeWidth={2} strokeDasharray="5 5" name="Assists" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ─── Advanced Statistics Grid ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-5"
      >
        <h3 className="text-sm font-semibold text-text-primary mb-4">
          Advanced Statistics (2024-25 Season)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {ADVANCED_STATS.map((stat) => (
            <div key={stat.label} className="bg-navy-light rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
              {stat.per90 !== "-" && (
                <p className="text-[10px] text-electric-bright mt-0.5">
                  {stat.per90}/90
                </p>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── Strengths & Weaknesses + AI Summary ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-5"
        >
          <h3 className="text-sm font-semibold text-emerald mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Strengths
          </h3>
          <div className="flex flex-wrap gap-2">
            {PLAYER.strengths.split(", ").map((s) => (
              <span
                key={s}
                className="px-2.5 py-1 rounded-full text-xs bg-emerald/10 text-emerald-bright border border-emerald/20"
              >
                {s}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5"
        >
          <h3 className="text-sm font-semibold text-coral mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Weaknesses
          </h3>
          <div className="flex flex-wrap gap-2">
            {PLAYER.weaknesses.split(", ").map((w) => (
              <span
                key={w}
                className="px-2.5 py-1 rounded-full text-xs bg-coral/10 text-coral-bright border border-coral/20"
              >
                {w}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-card p-5"
        >
          <h3 className="text-sm font-semibold text-electric-bright mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" /> AI Summary
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            {PLAYER.ai_summary}
          </p>
        </motion.div>
      </div>

      {/* ─── Transfer History ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-5"
      >
        <h3 className="text-sm font-semibold text-text-primary mb-4">
          Transfer History
        </h3>
        <div className="space-y-3">
          {TRANSFER_HISTORY.map((t, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 rounded-lg bg-navy-light"
            >
              <span className="text-sm text-text-muted w-12">{t.season}</span>
              <span className="text-sm text-text-secondary flex-1">{t.from}</span>
              <ChevronRight className="w-4 h-4 text-electric" />
              <span className="text-sm text-text-primary flex-1">{t.to}</span>
              <span className="text-sm font-semibold text-emerald w-24 text-right">
                {formatCurrency(t.fee)}
              </span>
              <span className="text-xs text-text-muted w-20 text-right">
                {t.type}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── Injury History ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="glass-card p-5"
      >
        <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Heart className="w-4 h-4 text-coral" /> Injury History
        </h3>
        <div className="space-y-2">
          {INJURIES.map((inj, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 rounded-lg bg-navy-light"
            >
              <div
                className={`w-2 h-8 rounded-full ${
                  inj.severity === "Severe"
                    ? "bg-coral"
                    : inj.severity === "Moderate"
                    ? "bg-amber"
                    : "bg-emerald"
                }`}
              />
              <div className="flex-1">
                <p className="text-sm text-text-primary">{inj.type}</p>
                <p className="text-xs text-text-muted">
                  {inj.body} · {inj.start} to {inj.end}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  inj.severity === "Severe"
                    ? "bg-coral/10 text-coral"
                    : inj.severity === "Moderate"
                    ? "bg-amber/10 text-amber"
                    : "bg-emerald/10 text-emerald"
                }`}
              >
                {inj.severity}
              </span>
              <span className="text-sm text-text-muted w-24 text-right">
                {inj.missed} matches
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
