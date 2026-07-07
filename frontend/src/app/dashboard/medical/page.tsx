"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Activity,
  Calendar,
  Users,
  Shield,
} from "lucide-react";
import { InjuryTimeline, type Injury } from "@/components/charts/InjuryTimeline";

const SQUAD_HEALTH = [
  { label: "Fit Players", value: 24, total: 28, color: "text-emerald" },
  { label: "Currently Injured", value: 3, total: 28, color: "text-coral" },
  { label: "Suspended", value: 1, total: 28, color: "text-amber" },
];

const INJURY_ALERTS = [
  { player: "Pedri", injury: "Hamstring Strain", severity: "Moderate" as const, returnDate: "2025-08-15", daysOut: 28 },
  { player: "Rodri", injury: "ACL Reconstruction", severity: "Severe" as const, returnDate: "2025-10-01", daysOut: 180 },
  { player: "Gavi", injury: "Knee Ligament", severity: "Moderate" as const, returnDate: "2025-08-20", daysOut: 35 },
];

const BODY_PARTS = [
  { part: "Hamstring", count: 12, pct: 28, color: "#ef4444" },
  { part: "Knee", count: 8, pct: 19, color: "#f59e0b" },
  { part: "Ankle", count: 7, pct: 17, color: "#3b82f6" },
  { part: "Groin", count: 5, pct: 12, color: "#8b5cf6" },
  { part: "Calf", count: 4, pct: 10, color: "#06b6d4" },
  { part: "Thigh", count: 3, pct: 7, color: "#10b981" },
  { part: "Other", count: 3, pct: 7, color: "#64748b" },
];

const RECENT_INJURIES: Injury[] = [
  { id: "1", injury: "Hamstring Strain", bodyPart: "Hamstring", severity: "Moderate", startDate: "2025-06-15", endDate: "2025-07-10", daysMissed: 25, matchesMissed: 4 },
  { id: "2", injury: "Ankle Sprain", bodyPart: "Ankle", severity: "Minor", startDate: "2025-05-20", endDate: "2025-06-02", daysMissed: 13, matchesMissed: 2 },
  { id: "3", injury: "ACL Tear", bodyPart: "Knee", severity: "Severe", startDate: "2025-03-01", endDate: "2025-09-01", daysMissed: 184, matchesMissed: 28 },
  { id: "4", injury: "Calf Strain", bodyPart: "Calf", severity: "Minor", startDate: "2025-04-10", endDate: "2025-04-24", daysMissed: 14, matchesMissed: 2 },
];

export default function MedicalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
          <HeartPulse className="w-7 h-7 text-coral" />
          Medical Intelligence Dashboard
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Squad health monitoring, injury tracking, and risk analysis
        </p>
      </div>

      {/* Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SQUAD_HEALTH.map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-text-muted">{item.label}</p>
              {item.label === "Fit Players" ? <CheckCircle2 className="w-4 h-4 text-emerald" /> : item.label === "Currently Injured" ? <AlertTriangle className="w-4 h-4 text-coral" /> : <Shield className="w-4 h-4 text-amber" />}
            </div>
            <p className={`text-3xl font-black ${item.color}`}>{item.value}</p>
            <div className="mt-2 h-2 bg-navy-lighter rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(item.value / item.total) * 100}%` }} transition={{ duration: 0.8 }} className={`h-full rounded-full ${item.label === "Fit Players" ? "bg-emerald" : item.label === "Currently Injured" ? "bg-coral" : "bg-amber"}`} />
            </div>
            <p className="text-[10px] text-text-muted mt-1">{item.value} of {item.total} squad players</p>
          </motion.div>
        ))}
      </div>

      {/* Current Injuries & Body Part Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-coral" /> Active Injury Alerts
          </h3>
          <div className="space-y-3">
            {INJURY_ALERTS.map((alert, i) => (
              <div key={i} className="bg-navy-light rounded-lg p-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-text-primary">{alert.player}</h4>
                  <p className="text-xs text-text-muted">{alert.injury}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-0.5 rounded font-bold ${alert.severity === "Severe" ? "bg-coral/20 text-coral" : alert.severity === "Moderate" ? "bg-amber/20 text-amber" : "bg-emerald/20 text-emerald-bright"}`}>{alert.severity}</span>
                  <p className="text-[10px] text-text-muted mt-1">Return: {alert.returnDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Injury Distribution by Body Part</h3>
          <div className="space-y-3">
            {BODY_PARTS.map((bp, i) => (
              <div key={bp.part} className="flex items-center gap-3">
                <span className="text-xs text-text-secondary w-20 shrink-0">{bp.part}</span>
                <div className="flex-1 h-3 bg-navy-lighter rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${bp.pct}%` }} transition={{ duration: 0.8, delay: i * 0.05 }} className="h-full rounded-full" style={{ backgroundColor: bp.color }} />
                </div>
                <span className="text-xs text-text-muted w-8 text-right">{bp.pct}%</span>
                <span className="text-xs font-bold text-text-primary w-6 text-right">{bp.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Injury Timeline */}
      <div className="glass-card p-5">
        <InjuryTimeline injuries={RECENT_INJURIES} />
      </div>
    </div>
  );
}
