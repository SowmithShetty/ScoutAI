"use client";

import { motion } from "framer-motion";
import {
  Users,
  Search,
  DollarSign,
  Clock,
  HeartPulse,
  FileText,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Activity,
  Target,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Area,
  AreaChart,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const KPI_CARDS = [
  {
    label: "Total Players",
    value: "14,832",
    change: "+247",
    trend: "up" as const,
    icon: Users,
    color: "from-electric to-electric-dim",
    bgColor: "bg-electric/10",
  },
  {
    label: "Players Scouted",
    value: "1,284",
    change: "+89",
    trend: "up" as const,
    icon: Search,
    color: "from-emerald to-emerald-dim",
    bgColor: "bg-emerald/10",
  },
  {
    label: "Budget Remaining",
    value: "€42.5M",
    change: "-€12.5M",
    trend: "down" as const,
    icon: DollarSign,
    color: "from-amber to-amber",
    bgColor: "bg-amber/10",
  },
  {
    label: "Transfer Window",
    value: "23 Days",
    change: "Closing Soon",
    trend: "down" as const,
    icon: Clock,
    color: "from-coral to-coral",
    bgColor: "bg-coral/10",
  },
  {
    label: "Medical Alerts",
    value: "4",
    change: "+1 new",
    trend: "up" as const,
    icon: HeartPulse,
    color: "from-purple to-purple",
    bgColor: "bg-purple/10",
  },
  {
    label: "Recent Reports",
    value: "28",
    change: "+5 this week",
    trend: "up" as const,
    icon: FileText,
    color: "from-cyan to-cyan",
    bgColor: "bg-cyan/10",
  },
];

const POSITION_DATA = [
  { position: "ST", count: 42, fill: "#ef4444" },
  { position: "CAM", count: 38, fill: "#10b981" },
  { position: "CM", count: 55, fill: "#8b5cf6" },
  { position: "CB", count: 48, fill: "#3b82f6" },
  { position: "LW", count: 35, fill: "#f59e0b" },
  { position: "RW", count: 32, fill: "#06b6d4" },
  { position: "CDM", count: 28, fill: "#ec4899" },
  { position: "GK", count: 20, fill: "#f97316" },
  { position: "LB", count: 25, fill: "#14b8a6" },
  { position: "RB", count: 22, fill: "#a855f7" },
];

const AGE_DATA = [
  { age: "17-19", count: 15 },
  { age: "20-22", count: 42 },
  { age: "23-25", count: 68 },
  { age: "26-28", count: 55 },
  { age: "29-31", count: 38 },
  { age: "32-34", count: 18 },
  { age: "35+", count: 6 },
];

const BUDGET_DATA = [
  { name: "Wages", value: 35, color: "#3b82f6" },
  { name: "Transfer Fees", value: 25, color: "#10b981" },
  { name: "Agent Fees", value: 10, color: "#f59e0b" },
  { name: "Remaining", value: 30, color: "#1e2a4a" },
];

const VALUE_TREND = [
  { month: "Jan", value: 82 },
  { month: "Feb", value: 78 },
  { month: "Mar", value: 85 },
  { month: "Apr", value: 92 },
  { month: "May", value: 88 },
  { month: "Jun", value: 95 },
  { month: "Jul", value: 102 },
  { month: "Aug", value: 98 },
  { month: "Sep", value: 110 },
  { month: "Oct", value: 108 },
  { month: "Nov", value: 115 },
  { month: "Dec", value: 120 },
];

const LEAGUE_DATA = [
  { league: "Premier League", players: 85 },
  { league: "La Liga", players: 72 },
  { league: "Bundesliga", players: 65 },
  { league: "Serie A", players: 58 },
  { league: "Ligue 1", players: 48 },
  { league: "Eredivisie", players: 35 },
  { league: "Liga Portugal", players: 28 },
];

const RECENT_ACTIVITY = [
  {
    type: "report",
    icon: FileText,
    color: "text-electric-bright",
    bg: "bg-electric/10",
    message: "New scouting report submitted for Marcus Thuram",
    time: "12 min ago",
  },
  {
    type: "shortlist",
    icon: Target,
    color: "text-emerald-bright",
    bg: "bg-emerald/10",
    message: "Xavi Simons added to Priority Targets shortlist",
    time: "1 hour ago",
  },
  {
    type: "medical",
    icon: HeartPulse,
    color: "text-coral-bright",
    bg: "bg-coral/10",
    message: "Medical alert: Recurring hamstring issue flagged for target player",
    time: "2 hours ago",
  },
  {
    type: "transfer",
    icon: ArrowUpRight,
    color: "text-amber-bright",
    bg: "bg-amber/10",
    message: "Transfer market update: 3 players from watchlist now available",
    time: "4 hours ago",
  },
  {
    type: "analysis",
    icon: Activity,
    color: "text-purple-bright",
    bg: "bg-purple/10",
    message: "AI analysis complete: 12 new candidates match current requirements",
    time: "6 hours ago",
  },
  {
    type: "calendar",
    icon: Calendar,
    color: "text-cyan-bright",
    bg: "bg-cyan/10",
    message: "Reminder: Recruitment meeting scheduled for tomorrow at 10:00 AM",
    time: "8 hours ago",
  },
];

// ─── Custom Tooltip ──────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card-solid px-3 py-2 text-sm">
      <p className="text-text-secondary text-xs">{label}</p>
      <p className="text-text-primary font-semibold">
        {payload[0].value}
        {payload[0].unit || ""}
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* ─── Page Header ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-secondary mt-1">
          Overview of your recruitment operations and key metrics
        </p>
      </div>

      {/* ─── KPI Cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {KPI_CARDS.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="glass-card p-4 group cursor-default"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-lg ${card.bgColor} flex items-center justify-center`}
              >
                <card.icon className="w-4 h-4 text-text-primary" />
              </div>
              <span
                className={`text-xs font-medium flex items-center gap-0.5 ${
                  card.trend === "up" ? "text-emerald" : "text-coral"
                }`}
              >
                {card.trend === "up" ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {card.change}
              </span>
            </div>
            <p className="text-xl font-bold text-text-primary">{card.value}</p>
            <p className="text-xs text-text-muted mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ─── Charts Row 1 ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Allocation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="glass-card p-5"
        >
          <h3 className="text-sm font-semibold text-text-primary mb-4">
            Budget Allocation
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={BUDGET_DATA}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {BUDGET_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {BUDGET_DATA.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-text-muted">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.name} ({item.value}%)
              </div>
            ))}
          </div>
        </motion.div>

        {/* Position Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="glass-card p-5"
        >
          <h3 className="text-sm font-semibold text-text-primary mb-4">
            Scouted by Position
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={POSITION_DATA} barSize={20}>
              <XAxis
                dataKey="position"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {POSITION_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Age Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="glass-card p-5"
        >
          <h3 className="text-sm font-semibold text-text-primary mb-4">
            Age Distribution
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={AGE_DATA}>
              <defs>
                <linearGradient id="ageGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="age"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                fill="url(#ageGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ─── Charts Row 2 ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transfer Value Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary">
              Squad Value Trend (€M)
            </h3>
            <span className="text-xs text-emerald font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +18.2%
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={VALUE_TREND}>
              <defs>
                <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.07)" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                fill="url(#valueGradient)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#10b981" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* League Coverage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="glass-card p-5"
        >
          <h3 className="text-sm font-semibold text-text-primary mb-4">
            League Coverage
          </h3>
          <div className="space-y-3">
            {LEAGUE_DATA.map((league, i) => (
              <div key={league.league} className="flex items-center gap-3">
                <span className="text-xs text-text-secondary w-28 shrink-0 truncate">
                  {league.league}
                </span>
                <div className="flex-1 h-2 bg-navy-lighter rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(league.players / 85) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }}
                    className="h-full rounded-full bg-gradient-to-r from-electric to-electric-bright"
                  />
                </div>
                <span className="text-xs text-text-muted w-8 text-right">
                  {league.players}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─── Recent Activity ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.55 }}
        className="glass-card p-5"
      >
        <h3 className="text-sm font-semibold text-text-primary mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {RECENT_ACTIVITY.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + i * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface/30 transition-colors cursor-default"
            >
              <div
                className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0 mt-0.5`}
              >
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary">{item.message}</p>
                <p className="text-xs text-text-muted mt-0.5">{item.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
