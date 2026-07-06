"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  X,
  Users,
  BarChart3,
  Shield,
  TrendingUp,
  HeartPulse,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";
import { PlayerRadarChart } from "@/components/charts/RadarChart";
import { PercentileBar } from "@/components/charts/PercentileBar";
import { formatCurrency, POSITION_COLORS } from "@/lib/types";

// Mock available players to pick for comparison
const ALL_PLAYERS = [
  { id: "1", name: "Erling Haaland", age: 25, position: "ST", club: "Manchester City", value: 180000000, salary: 375000, overall: 91, potential: 95, color: "#3b82f6", pace: 89, shooting: 94, passing: 65, dribbling: 78, defending: 45, physical: 88, medicalRisk: "Low", ffpImpact: "High" },
  { id: "2", name: "Kylian Mbappé", age: 26, position: "ST", club: "Real Madrid", value: 180000000, salary: 500000, overall: 91, potential: 94, color: "#10b981", pace: 97, shooting: 90, passing: 80, dribbling: 92, defending: 36, physical: 78, medicalRisk: "Low", ffpImpact: "Critical" },
  { id: "3", name: "Harry Kane", age: 31, position: "ST", club: "Bayern Munich", value: 100000000, salary: 400000, overall: 90, potential: 90, color: "#f59e0b", pace: 68, shooting: 93, passing: 85, dribbling: 82, defending: 47, physical: 83, medicalRisk: "Medium", ffpImpact: "Moderate" },
  { id: "4", name: "Lautaro Martínez", age: 27, position: "ST", club: "Inter Milan", value: 110000000, salary: 250000, overall: 89, potential: 91, color: "#8b5cf6", pace: 82, shooting: 88, passing: 77, dribbling: 85, defending: 48, physical: 84, medicalRisk: "Low", ffpImpact: "Moderate" },
];

export default function ComparePlayersPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["1", "2"]);
  const [searchOpen, setSearchOpen] = useState(false);

  const selectedPlayers = ALL_PLAYERS.filter((p) => selectedIds.includes(p.id));

  const removePlayer = (id: string) => {
    if (selectedIds.length > 1) {
      setSelectedIds(selectedIds.filter((pId) => pId !== id));
    }
  };

  const addPlayer = (id: string) => {
    if (selectedIds.length < 4 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
      setSearchOpen(false);
    }
  };

  // Build Radar Data
  const radarData = [
    { attribute: "Pace", ...Object.fromEntries(selectedPlayers.map((p) => [p.id, p.pace])) },
    { attribute: "Shooting", ...Object.fromEntries(selectedPlayers.map((p) => [p.id, p.shooting])) },
    { attribute: "Passing", ...Object.fromEntries(selectedPlayers.map((p) => [p.id, p.passing])) },
    { attribute: "Dribbling", ...Object.fromEntries(selectedPlayers.map((p) => [p.id, p.dribbling])) },
    { attribute: "Defending", ...Object.fromEntries(selectedPlayers.map((p) => [p.id, p.defending])) },
    { attribute: "Physical", ...Object.fromEntries(selectedPlayers.map((p) => [p.id, p.physical])) },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/dashboard/players"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Players
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">Side-by-Side Player Comparison</h1>
          <p className="text-sm text-text-secondary mt-1">
            Analyze key differences in tactical fit, physical attributes, finances, and injury risks
          </p>
        </div>

        {selectedIds.length < 4 && (
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="btn-primary py-2 text-sm"
            >
              <Plus className="w-4 h-4" /> Add Player to Compare
            </button>

            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-navy-light border border-border rounded-xl shadow-2xl z-50 p-2 space-y-1">
                <p className="text-xs font-semibold text-text-muted px-2 py-1">Select player:</p>
                {ALL_PLAYERS.filter((p) => !selectedIds.includes(p.id)).map((player) => (
                  <button
                    key={player.id}
                    onClick={() => addPlayer(player.id)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-surface/50 text-left transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-text-primary">{player.name}</p>
                      <p className="text-xs text-text-muted">{player.club} • {player.position}</p>
                    </div>
                    <span className="text-xs font-bold text-electric-bright">OVR {player.overall}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Players Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {selectedPlayers.map((player) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 relative"
            style={{ borderColor: `${player.color}40` }}
          >
            {selectedIds.length > 1 && (
              <button
                onClick={() => removePlayer(player.id)}
                className="absolute top-3 right-3 text-text-muted hover:text-coral transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md"
                style={{ backgroundColor: player.color }}
              >
                {player.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary leading-tight">{player.name}</h3>
                <p className="text-xs text-text-muted">{player.club} • Age {player.age}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-navy-light p-2 rounded-lg text-center text-xs">
              <div>
                <span className="text-text-muted block">OVR</span>
                <span className="font-bold text-text-primary">{player.overall}</span>
              </div>
              <div>
                <span className="text-text-muted block">POT</span>
                <span className="font-bold text-amber">{player.potential}</span>
              </div>
              <div>
                <span className="text-text-muted block">Value</span>
                <span className="font-bold text-emerald">{formatCurrency(player.value)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Comparison Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Comparison */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-electric-bright" /> Attribute Overlay Radar
          </h3>
          <PlayerRadarChart
            data={radarData}
            players={selectedPlayers.map((p) => ({ key: p.id, name: p.name, color: p.color }))}
            height={320}
          />
        </div>

        {/* Financial & Risk Comparison Table */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald" /> Financial & Medical Risk Comparison
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border text-xs text-text-muted uppercase">
                  <th className="py-2">Metric</th>
                  {selectedPlayers.map((p) => (
                    <th key={p.id} className="py-2" style={{ color: p.color }}>{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                <tr>
                  <td className="py-2 text-text-secondary font-medium">Market Value</td>
                  {selectedPlayers.map((p) => (
                    <td key={p.id} className="py-2 font-bold text-text-primary">{formatCurrency(p.value)}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 text-text-secondary font-medium">Weekly Wage</td>
                  {selectedPlayers.map((p) => (
                    <td key={p.id} className="py-2 font-semibold text-text-primary">{formatCurrency(p.salary)}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 text-text-secondary font-medium">Medical Risk</td>
                  {selectedPlayers.map((p) => (
                    <td key={p.id} className="py-2">
                      <span className={`text-xs px-2 py-0.5 rounded font-bold ${p.medicalRisk === 'Low' ? 'bg-emerald/20 text-emerald-bright' : 'bg-amber/20 text-amber'}`}>
                        {p.medicalRisk}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 text-text-secondary font-medium">FFP Impact</td>
                  {selectedPlayers.map((p) => (
                    <td key={p.id} className="py-2">
                      <span className={`text-xs px-2 py-0.5 rounded font-bold ${p.ffpImpact === 'Critical' || p.ffpImpact === 'High' ? 'bg-coral/20 text-coral' : 'bg-electric/20 text-electric-bright'}`}>
                        {p.ffpImpact}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Side-by-Side Detailed Breakdown */}
      <div className="glass-card p-5 space-y-4">
        <h3 className="text-base font-semibold text-text-primary">Key Attributes Percentile Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {selectedPlayers.map((player) => (
            <div key={player.id} className="space-y-3 bg-navy-light p-4 rounded-xl border border-border/50">
              <h4 className="text-sm font-bold" style={{ color: player.color }}>{player.name}</h4>
              <PercentileBar
                items={[
                  { metric: "Pace", value: player.pace, percentile: player.pace },
                  { metric: "Shooting", value: player.shooting, percentile: player.shooting },
                  { metric: "Passing", value: player.passing, percentile: player.passing },
                  { metric: "Dribbling", value: player.dribbling, percentile: player.dribbling },
                  { metric: "Physical", value: player.physical, percentile: player.physical },
                ]}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
