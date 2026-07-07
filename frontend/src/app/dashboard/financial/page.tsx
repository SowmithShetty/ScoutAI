"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { formatCurrency } from "@/lib/types";

const FINANCIAL_KPIS = [
  { label: "Transfer Budget", value: "€120M", used: "€77.5M", remaining: "€42.5M", pct: 65, color: "text-electric-bright" },
  { label: "Annual Wage Bill", value: "€285M", used: "€248M", remaining: "€37M", pct: 87, color: "text-amber" },
  { label: "Revenue (Projected)", value: "€620M", used: "", remaining: "", pct: 0, color: "text-emerald" },
  { label: "FFP Headroom", value: "€45M", used: "", remaining: "", pct: 0, color: "text-coral" },
];

const WAGE_BREAKDOWN = [
  { name: "Forwards", value: 35, color: "#ef4444" },
  { name: "Midfielders", value: 28, color: "#3b82f6" },
  { name: "Defenders", value: 22, color: "#10b981" },
  { name: "Goalkeepers", value: 8, color: "#f59e0b" },
  { name: "Staff", value: 7, color: "#8b5cf6" },
];

const REVENUE_TREND = [
  { year: "2020", revenue: 380, costs: 410 },
  { year: "2021", revenue: 420, costs: 390 },
  { year: "2022", revenue: 510, costs: 470 },
  { year: "2023", revenue: 560, costs: 520 },
  { year: "2024", revenue: 590, costs: 555 },
  { year: "2025", revenue: 620, costs: 580 },
];

const TOP_EARNERS = [
  { name: "Erling Haaland", salary: 375000, pctBudget: 7.9 },
  { name: "Kylian Mbappé", salary: 500000, pctBudget: 10.5 },
  { name: "Jude Bellingham", salary: 320000, pctBudget: 6.7 },
  { name: "Declan Rice", salary: 280000, pctBudget: 5.9 },
  { name: "Phil Foden", salary: 300000, pctBudget: 6.3 },
];

const ROI_ANALYSIS = [
  { player: "Haaland", bought: 60, current: 180, roi: 200 },
  { player: "Bellingham", bought: 103, current: 150, roi: 46 },
  { player: "Saka", bought: 0, current: 120, roi: 999 },
  { player: "Saliba", bought: 30, current: 90, roi: 200 },
  { player: "Rice", bought: 105, current: 100, roi: -5 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card-solid px-3 py-2 text-sm">
      <p className="text-text-secondary text-xs">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: €{p.value}M</p>
      ))}
    </div>
  );
}

export default function FinancialPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
          <DollarSign className="w-7 h-7 text-emerald" />
          Financial Analytics & FFP Dashboard
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Budget tracking, wage structure analysis, ROI calculations, and FFP compliance
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {FINANCIAL_KPIS.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <p className="text-xs text-text-muted mb-1">{kpi.label}</p>
            <p className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</p>
            {kpi.used && (
              <>
                <div className="mt-2 h-2 bg-navy-lighter rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${kpi.pct}%` }} transition={{ duration: 0.8 }} className={`h-full rounded-full ${kpi.pct > 80 ? "bg-coral" : kpi.pct > 60 ? "bg-amber" : "bg-emerald"}`} />
                </div>
                <div className="flex justify-between text-[10px] text-text-muted mt-1">
                  <span>Used: {kpi.used}</span>
                  <span>Left: {kpi.remaining}</span>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Costs Trend */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Revenue vs Operating Costs (€M)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={REVENUE_TREND}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.07)" />
              <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" fill="url(#revGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="costs" name="Costs" stroke="#ef4444" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Wage Breakdown Pie */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Wage Structure Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={WAGE_BREAKDOWN} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                {WAGE_BREAKDOWN.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 justify-center">
            {WAGE_BREAKDOWN.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-text-muted">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name} ({item.value}%)
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Earners */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Top Earners (Weekly Wage)</h3>
          <div className="space-y-2">
            {TOP_EARNERS.map((player, i) => (
              <div key={player.name} className="flex items-center justify-between p-3 bg-navy-light rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-text-muted w-5">{i + 1}</span>
                  <span className="text-sm font-medium text-text-primary">{player.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-emerald">{formatCurrency(player.salary)}/wk</span>
                  <span className="text-xs text-text-muted w-16 text-right">{player.pctBudget}% budget</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROI Analysis */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Transfer ROI Analysis</h3>
          <div className="space-y-2">
            {ROI_ANALYSIS.map((item) => (
              <div key={item.player} className="flex items-center justify-between p-3 bg-navy-light rounded-lg">
                <span className="text-sm font-medium text-text-primary">{item.player}</span>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-text-muted">Bought: €{item.bought}M</span>
                  <span className="text-xs text-text-muted">Current: €{item.current}M</span>
                  <span className={`text-sm font-bold flex items-center gap-0.5 ${item.roi >= 0 ? "text-emerald" : "text-coral"}`}>
                    {item.roi >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {item.roi > 500 ? "∞" : `${item.roi}%`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
