"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/types";

const MOCK_TRANSFERS = [
  { id: "t1", player: "Xavi Simons", from: "RB Leipzig", to: "FC Barcelona", fee: 80000000, date: "2025-07-15", type: "Permanent", status: "Confirmed" },
  { id: "t2", player: "Marcus Rashford", from: "Manchester United", to: "Paris Saint-Germain", fee: 65000000, date: "2025-07-10", type: "Permanent", status: "Confirmed" },
  { id: "t3", player: "Nico Williams", from: "Athletic Bilbao", to: "Arsenal", fee: 55000000, date: "2025-07-08", type: "Release Clause", status: "Confirmed" },
  { id: "t4", player: "Benjamin Šeško", from: "RB Leipzig", to: "Manchester City", fee: 75000000, date: "2025-07-05", type: "Permanent", status: "Confirmed" },
  { id: "t5", player: "Joao Neves", from: "PSG", to: "Liverpool", fee: 70000000, date: "2025-06-28", type: "Permanent", status: "Medical" },
  { id: "t6", player: "Adam Wharton", from: "Crystal Palace", to: "Real Madrid", fee: 45000000, date: "2025-06-25", type: "Permanent", status: "Negotiation" },
  { id: "t7", player: "Evan Ferguson", from: "Brighton", to: "Chelsea", fee: 40000000, date: "2025-06-20", type: "Permanent", status: "Rumour" },
  { id: "t8", player: "Jamie Bynoe-Gittens", from: "Borussia Dortmund", to: "Tottenham", fee: 35000000, date: "2025-06-15", type: "Permanent", status: "Rumour" },
];

const MARKET_TRENDS = [
  { label: "Total Transfer Spend (Summer)", value: "€3.8B", change: "+12%", trend: "up" as const },
  { label: "Average Fee", value: "€28.5M", change: "+8%", trend: "up" as const },
  { label: "Free Transfers", value: "42", change: "-5%", trend: "down" as const },
  { label: "Loan Deals", value: "89", change: "+15%", trend: "up" as const },
];

export default function TransferMarketPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransfers = MOCK_TRANSFERS.filter((t) => {
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    const matchesSearch = searchQuery === "" || t.player.toLowerCase().includes(searchQuery.toLowerCase()) || t.from.toLowerCase().includes(searchQuery.toLowerCase()) || t.to.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmed": return "bg-emerald/20 text-emerald-bright border-emerald/30";
      case "Medical": return "bg-amber/20 text-amber border-amber/30";
      case "Negotiation": return "bg-electric/20 text-electric-bright border-electric/30";
      case "Rumour": return "bg-purple/20 text-purple-bright border-purple/30";
      default: return "bg-surface/50 text-text-muted";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
          <ArrowLeftRight className="w-7 h-7 text-emerald" />
          Transfer Market Intelligence
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Real-time transfer activity, market trends, and deal tracker
        </p>
      </div>

      {/* Market Trend Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {MARKET_TRENDS.map((trend, i) => (
          <motion.div
            key={trend.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4"
          >
            <p className="text-xs text-text-muted mb-1">{trend.label}</p>
            <p className="text-xl font-bold text-text-primary">{trend.value}</p>
            <span className={`text-xs font-medium flex items-center gap-0.5 mt-1 ${trend.trend === "up" ? "text-emerald" : "text-coral"}`}>
              {trend.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend.change} vs last window
            </span>
          </motion.div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search transfers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9 py-2 text-sm"
          />
        </div>
        {["All", "Confirmed", "Medical", "Negotiation", "Rumour"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              statusFilter === status
                ? "bg-electric/20 text-electric-bright border-electric/30"
                : "bg-surface/20 text-text-muted border-transparent hover:border-border"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Transfer Feed */}
      <div className="space-y-3">
        {filteredTransfers.map((transfer, i) => (
          <motion.div
            key={transfer.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass-card p-4 flex items-center gap-4"
          >
            {/* Arrow Icon */}
            <div className="w-10 h-10 rounded-full bg-emerald/10 flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-5 h-5 text-emerald" />
            </div>

            {/* Transfer Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-text-primary">{transfer.player}</h3>
              <p className="text-xs text-text-muted flex items-center gap-1">
                {transfer.from}
                <ArrowLeftRight className="w-3 h-3 text-electric" />
                {transfer.to}
              </p>
            </div>

            {/* Fee */}
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-emerald">{formatCurrency(transfer.fee)}</p>
              <p className="text-[10px] text-text-muted">{transfer.type}</p>
            </div>

            {/* Status */}
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 ${getStatusBadge(transfer.status)}`}>
              {transfer.status}
            </span>

            {/* Date */}
            <span className="text-xs text-text-muted shrink-0 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {transfer.date}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
