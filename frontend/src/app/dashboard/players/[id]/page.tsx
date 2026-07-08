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
import { formatCurrency, PlayerDetail } from "@/lib/types";
import { playerApi } from "@/lib/api";
import { useState, useEffect } from "react";

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
  const [player, setPlayer] = useState<PlayerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      setLoading(true);
      try {
        const res = await playerApi.getById(id);
        setPlayer(res.data);
      } catch (err) {
        console.error(err);
        setError("Player not found");
      } finally {
        setLoading(false);
      }
    };
    fetchPlayer();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-electric/30 border-t-electric rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="min-h-screen bg-midnight flex flex-col items-center justify-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-coral" />
        <h2 className="text-xl font-bold text-text-primary">{error || "Player not found"}</h2>
        <Link href="/dashboard/players" className="btn-primary py-2 text-sm">
          Back to Players
        </Link>
      </div>
    );
  }

  const latestStats = player.statistics?.[0] || {
    goals: 0, assists: 0, matches: 0, minutes: 0,
    average_rating: 6.0, xg: 0, xg_assist: 0
  };

  const RADAR_DATA = [
    { stat: "Pace", value: player.pace },
    { stat: "Shooting", value: player.shooting },
    { stat: "Passing", value: player.passing },
    { stat: "Dribbling", value: player.dribbling },
    { stat: "Defending", value: player.defending },
    { stat: "Physical", value: player.physical },
    { stat: "Vision", value: player.vision },
    { stat: "Heading", value: player.heading },
  ];

  const PERFORMANCE_TREND = player.statistics
    ?.map(s => ({
      season: s.season,
      goals: s.goals,
      assists: s.assists,
      rating: s.average_rating
    }))
    .sort((a, b) => a.season.localeCompare(b.season)) || [];

  const minFraction = player.statistics?.[0]?.minutes ? player.statistics[0].minutes / 90 : 1;

  const ADVANCED_STATS = [
    { label: "xG", value: latestStats.xg?.toFixed(1) || "0.0", per90: latestStats.xg_per_90?.toFixed(2) || "0.00" },
    { label: "xA", value: latestStats.xg_assist?.toFixed(1) || "0.0", per90: latestStats.xa_per_90?.toFixed(2) || "0.00" },
    { label: "Progressive Passes", value: latestStats.progressive_passes?.toString() || "0", per90: (latestStats.progressive_passes / minFraction).toFixed(2) },
    { label: "Progressive Carries", value: latestStats.progressive_carries?.toString() || "0", per90: (latestStats.progressive_carries / minFraction).toFixed(2) },
    { label: "Defensive Actions", value: latestStats.defensive_actions?.toString() || "0", per90: (latestStats.defensive_actions / minFraction).toFixed(2) },
    { label: "Pressures", value: latestStats.pressures?.toString() || "0", per90: (latestStats.pressures / minFraction).toFixed(2) },
    { label: "Aerial Wins", value: latestStats.aerial_wins?.toString() || "0", per90: (latestStats.aerial_wins / minFraction).toFixed(2) },
    { label: "Touches", value: latestStats.touches?.toString() || "0", per90: (latestStats.touches / minFraction).toFixed(2) },
    { label: "Pass %", value: `${latestStats.pass_completion_pct?.toFixed(1) || "0.0"}%`, per90: "-" },
    { label: "Shot Creating Actions", value: latestStats.shot_creating_actions?.toString() || "0", per90: (latestStats.shot_creating_actions / minFraction).toFixed(2) },
    { label: "Dribbles", value: latestStats.successful_dribbles?.toString() || "0", per90: (latestStats.successful_dribbles / minFraction).toFixed(2) },
    { label: "Tackles", value: latestStats.tackles?.toString() || "0", per90: (latestStats.tackles / minFraction).toFixed(2) },
    { label: "Interceptions", value: latestStats.interceptions?.toString() || "0", per90: (latestStats.interceptions / minFraction).toFixed(2) },
    { label: "Shots on Target", value: latestStats.shots_on_target?.toString() || "0", per90: (latestStats.shots_on_target / minFraction).toFixed(2) },
  ];

  const TRANSFER_HISTORY = player.transfers?.map(t => ({
    season: t.season || (t.date ? t.date.split("-")[0] : "N/A"),
    from: t.from_club_name || "Unknown",
    to: t.to_club_name || "Unknown",
    fee: t.fee,
    type: t.transfer_type
  })) || [];

  const INJURIES = player.medical_records?.map(m => ({
    type: m.injury_type,
    body: m.body_part,
    severity: m.severity,
    start: m.start_date,
    end: m.end_date || "Present",
    missed: m.matches_missed
  })) || [];

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
              {player.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-text-primary">
                  {player.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-electric/10 text-electric-bright">
                  {player.position}
                </span>
                {player.jersey_number && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald/10 text-emerald">
                    #{player.jersey_number}
                  </span>
                )}
              </div>
              <p className="text-sm text-text-secondary mb-3">
                {player.club?.name || "Free Agent"} · {player.club?.country || "N/A"} · {player.playing_style || "N/A"} ({player.tactical_role || "N/A"})
              </p>

              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <span className="flex items-center gap-1.5 text-text-muted">
                  <Calendar className="w-3.5 h-3.5" /> {player.age} years
                </span>
                <span className="flex items-center gap-1.5 text-text-muted">
                  <Flag className="w-3.5 h-3.5" /> {player.nationality}
                </span>
                {player.height && (
                  <span className="flex items-center gap-1.5 text-text-muted">
                    <Ruler className="w-3.5 h-3.5" /> {player.height} cm
                  </span>
                )}
                {player.weight && (
                  <span className="flex items-center gap-1.5 text-text-muted">
                    <Weight className="w-3.5 h-3.5" /> {player.weight} kg
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-text-muted">
                  <Zap className="w-3.5 h-3.5" /> {player.preferred_foot} foot
                </span>
                {player.contract_expiry && (
                  <span className="flex items-center gap-1.5 text-text-muted">
                    <FileText className="w-3.5 h-3.5" /> Until {new Date(player.contract_expiry).toLocaleDateString()}
                  </span>
                )}
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
                  {formatCurrency(player.market_value)}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Weekly Salary</p>
                <p className="text-lg font-bold text-text-primary">
                  {formatCurrency(player.salary)}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Overall</p>
                <p className="text-lg font-bold text-electric-bright">
                  {player.overall_rating}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Potential</p>
                <p className="text-lg font-bold text-amber">
                  {player.potential}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Season Summary Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: "Goals", value: latestStats.goals, color: "text-emerald" },
          { label: "Assists", value: latestStats.assists, color: "text-electric-bright" },
          { label: "Matches", value: latestStats.matches, color: "text-text-primary" },
          { label: "Minutes", value: latestStats.minutes.toLocaleString(), color: "text-text-primary" },
          { label: "Rating", value: latestStats.average_rating?.toFixed(1) || latestStats.rating?.toFixed(1), color: "text-amber" },
          { label: "xG", value: latestStats.xg?.toFixed(1), color: "text-purple-bright" },
          { label: "xA", value: latestStats.xg_assist?.toFixed(1), color: "text-cyan-bright" },
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
            {(player.strengths || "").split(", ").filter(Boolean).map((s) => (
              <span
                key={s}
                className="px-2.5 py-1 rounded-full text-xs bg-emerald/10 text-emerald-bright border border-emerald/20"
              >
                {s}
              </span>
            ))}
            {!(player.strengths) && (
              <span className="text-xs text-text-muted">None documented</span>
            )}
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
            {(player.weaknesses || "").split(", ").filter(Boolean).map((w) => (
              <span
                key={w}
                className="px-2.5 py-1 rounded-full text-xs bg-coral/10 text-coral-bright border border-coral/20"
              >
                {w}
              </span>
            ))}
            {!(player.weaknesses) && (
              <span className="text-xs text-text-muted">None documented</span>
            )}
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
            {player.ai_summary || "No AI summary generated for this player yet."}
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
          {TRANSFER_HISTORY.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-4 bg-navy-light rounded-lg">No transfer history documented.</p>
          ) : (
            TRANSFER_HISTORY.map((t, i) => (
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
            ))
          )}
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
          {INJURIES.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-4 bg-navy-light rounded-lg">No injury history documented.</p>
          ) : (
            INJURIES.map((inj, i) => (
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
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
