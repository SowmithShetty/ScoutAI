"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Layers,
  Target,
  Activity,
  MapPin,
  GitBranch,
  Shield,
} from "lucide-react";
import { HeatMap } from "@/components/charts/HeatMap";
import { ShotMap } from "@/components/charts/ShotMap";
import { PassingNetwork } from "@/components/charts/PassingNetwork";
import { PercentileBar } from "@/components/charts/PercentileBar";
import { InjuryTimeline } from "@/components/charts/InjuryTimeline";
import { PlayerRadarChart } from "@/components/charts/RadarChart";

// ─── Tabs ────────────────────────────────────────────────────────────────────

const TABS = [
  { id: "heatmap", label: "Heatmap", icon: MapPin },
  { id: "shots", label: "Shot Map", icon: Target },
  { id: "passing", label: "Passing Network", icon: GitBranch },
  { id: "percentiles", label: "Percentiles", icon: BarChart3 },
  { id: "radar", label: "Radar", icon: Activity },
  { id: "medical", label: "Medical", icon: Shield },
];

// ─── Mock Data ───────────────────────────────────────────────────────────────

const PERCENTILE_DATA = [
  { metric: "Goals", value: "27", percentile: 98 },
  { metric: "xG", value: "24.2", percentile: 96 },
  { metric: "Assists", value: "5", percentile: 42 },
  { metric: "Shots per 90", value: "4.2", percentile: 95 },
  { metric: "Shots on Target %", value: "56%", percentile: 92 },
  { metric: "xG per Shot", value: "0.19", percentile: 88 },
  { metric: "Progressive Carries", value: "62", percentile: 55 },
  { metric: "Key Passes", value: "38", percentile: 35 },
  { metric: "Pass Completion", value: "78.2%", percentile: 28 },
  { metric: "Pressures per 90", value: "14.5", percentile: 72 },
  { metric: "Aerial Wins", value: "89", percentile: 96 },
  { metric: "Tackles", value: "15", percentile: 22 },
];

const RADAR_DATA = [
  { attribute: "Finishing", p1: 96, p2: 90 },
  { attribute: "Heading", p1: 92, p2: 68 },
  { attribute: "Pace", p1: 89, p2: 97 },
  { attribute: "Strength", p1: 90, p2: 78 },
  { attribute: "Dribbling", p1: 78, p2: 92 },
  { attribute: "Passing", p1: 65, p2: 80 },
  { attribute: "Vision", p1: 62, p2: 75 },
  { attribute: "Pressing", p1: 75, p2: 85 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ANALYTICS PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("heatmap");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-emerald" />
          Advanced Analytics Suite
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Tactical visualizations, positional percentile analysis, and performance deep dives
        </p>
      </div>

      {/* Tab Bar */}
      <div className="flex flex-wrap gap-2 glass-card p-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-electric/20 text-electric-bright"
                : "text-text-muted hover:text-text-primary hover:bg-surface/30"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "heatmap" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-5">
              <HeatMap title="Touch Heatmap — Erling Haaland" />
            </div>
            <div className="glass-card p-5">
              <HeatMap
                title="Touch Heatmap — Kylian Mbappé"
                points={[
                  { x: 65, y: 20, intensity: 0.7 },
                  { x: 75, y: 25, intensity: 0.8 },
                  { x: 80, y: 15, intensity: 0.9 },
                  { x: 85, y: 30, intensity: 0.6 },
                  { x: 70, y: 35, intensity: 0.5 },
                  { x: 90, y: 20, intensity: 0.85 },
                  { x: 60, y: 25, intensity: 0.55 },
                  { x: 78, y: 40, intensity: 0.4 },
                ]}
              />
            </div>
          </div>
        )}

        {activeTab === "shots" && (
          <div className="glass-card p-5">
            <ShotMap />
          </div>
        )}

        {activeTab === "passing" && (
          <div className="glass-card p-5">
            <PassingNetwork />
          </div>
        )}

        {activeTab === "percentiles" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-5">
              <PercentileBar
                title="Haaland — Positional Percentile Ranks (vs. Strikers)"
                items={PERCENTILE_DATA}
              />
            </div>
            <div className="glass-card p-5">
              <PercentileBar
                title="Mbappé — Positional Percentile Ranks (vs. Strikers)"
                items={[
                  { metric: "Goals", value: "35", percentile: 99 },
                  { metric: "xG", value: "28.1", percentile: 97 },
                  { metric: "Assists", value: "12", percentile: 88 },
                  { metric: "Dribbles per 90", value: "5.8", percentile: 99 },
                  { metric: "Progressive Carries", value: "110", percentile: 98 },
                  { metric: "Key Passes", value: "55", percentile: 72 },
                  { metric: "Pass Completion", value: "82.5%", percentile: 58 },
                  { metric: "Pressures per 90", value: "16.2", percentile: 82 },
                  { metric: "Aerial Wins", value: "22", percentile: 32 },
                  { metric: "Shots per 90", value: "4.8", percentile: 97 },
                  { metric: "Sprint Speed", value: "36.5 km/h", percentile: 99 },
                  { metric: "xA", value: "10.5", percentile: 85 },
                ]}
              />
            </div>
          </div>
        )}

        {activeTab === "radar" && (
          <div className="glass-card p-5">
            <h4 className="text-sm font-semibold text-text-primary mb-4">
              Attribute Radar Comparison — Haaland vs Mbappé
            </h4>
            <PlayerRadarChart
              data={RADAR_DATA}
              players={[
                { key: "p1", name: "Haaland", color: "#3b82f6" },
                { key: "p2", name: "Mbappé", color: "#10b981" },
              ]}
              height={400}
            />
          </div>
        )}

        {activeTab === "medical" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-5">
              <InjuryTimeline />
            </div>
            <div className="glass-card p-5">
              <h4 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald" /> Medical Risk Summary
              </h4>
              <div className="space-y-3">
                {[
                  { label: "Total Injuries (3 years)", value: "3", risk: "Low", color: "text-emerald" },
                  { label: "Recurring Injuries", value: "0", risk: "None", color: "text-emerald" },
                  { label: "Average Recovery (days)", value: "20", risk: "Normal", color: "text-electric-bright" },
                  { label: "Matches Missed (season)", value: "8", risk: "Moderate", color: "text-amber" },
                  { label: "Injury Prone Rating", value: "2/10", risk: "Low", color: "text-emerald" },
                  { label: "Availability Rate", value: "91%", risk: "Good", color: "text-emerald" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 bg-navy-light rounded-lg">
                    <span className="text-sm text-text-secondary">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-text-primary">{item.value}</span>
                      <span className={`text-xs font-bold ${item.color}`}>{item.risk}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
