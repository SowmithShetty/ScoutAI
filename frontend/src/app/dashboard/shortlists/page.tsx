"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  BookmarkCheck,
  Plus,
  Trash2,
  Eye,
  Users,
  Star,
  ChevronRight,
  MoreVertical,
  Calendar,
  Target,
  Search,
} from "lucide-react";
import { formatCurrency, POSITION_COLORS } from "@/lib/types";

const MOCK_SHORTLISTS = [
  {
    id: "sl1",
    name: "Priority Targets — Summer 2025",
    description: "Top candidates for the upcoming transfer window",
    created: "2025-05-10",
    playerCount: 5,
    players: [
      { id: "1", name: "Erling Haaland", position: "ST", club: "Manchester City", age: 25, overall: 91, value: 180000000, score: 88, notes: "Primary target. Agent contacted." },
      { id: "4", name: "Lautaro Martínez", position: "ST", club: "Inter Milan", age: 27, overall: 89, value: 110000000, score: 83, notes: "Alternative. Better value." },
      { id: "6", name: "Bukayo Saka", position: "RW", club: "Arsenal", age: 23, overall: 88, value: 120000000, score: 78, notes: "Excellent fit, Arsenal unlikely to sell." },
      { id: "3", name: "Florian Wirtz", position: "CAM", club: "Bayer Leverkusen", age: 22, overall: 88, value: 130000000, score: 82, notes: "World class potential. Release clause check needed." },
      { id: "16", name: "Xavi Simons", position: "CAM", club: "RB Leipzig", age: 22, overall: 84, value: 80000000, score: 75, notes: "PSG recall clause. Monitoring situation." },
    ],
  },
  {
    id: "sl2",
    name: "Young Talent Pipeline",
    description: "Under-21 prospects for development squad",
    created: "2025-04-15",
    playerCount: 3,
    players: [
      { id: "4l", name: "Lamine Yamal", position: "RW", club: "FC Barcelona", age: 18, overall: 86, value: 150000000, score: 90, notes: "Generational. €1B release clause." },
      { id: "13", name: "Gavi", position: "CM", club: "FC Barcelona", age: 21, overall: 84, value: 80000000, score: 76, notes: "Injury concerns, but immense talent." },
      { id: "15", name: "Alejandro Garnacho", position: "LW", club: "Manchester United", age: 21, overall: 80, value: 50000000, score: 68, notes: "Transfer listed. Good value buy." },
    ],
  },
  {
    id: "sl3",
    name: "Budget Alternatives",
    description: "Cost-effective options under €60M",
    created: "2025-06-01",
    playerCount: 2,
    players: [
      { id: "15", name: "Alejandro Garnacho", position: "LW", club: "Manchester United", age: 21, overall: 80, value: 50000000, score: 68, notes: "Best value option available." },
      { id: "16", name: "Xavi Simons", position: "CAM", club: "RB Leipzig", age: 22, overall: 84, value: 80000000, score: 75, notes: "Slightly above budget but worth stretching." },
    ],
  },
];

export default function ShortlistsPage() {
  const [selectedList, setSelectedList] = useState(MOCK_SHORTLISTS[0].id);
  const [searchQuery, setSearchQuery] = useState("");

  const activeList = MOCK_SHORTLISTS.find((l) => l.id === selectedList)!;
  const filteredPlayers = activeList.players.filter((p) =>
    searchQuery === "" || p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
            <BookmarkCheck className="w-7 h-7 text-amber" />
            Shortlists
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage your recruitment shortlists and target rankings
          </p>
        </div>
        <button className="btn-primary py-2 text-sm">
          <Plus className="w-4 h-4" /> New Shortlist
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Shortlist Sidebar */}
        <div className="space-y-2">
          {MOCK_SHORTLISTS.map((list) => (
            <button
              key={list.id}
              onClick={() => setSelectedList(list.id)}
              className={`w-full text-left p-3 rounded-xl transition-all ${
                selectedList === list.id
                  ? "glass-card border-electric/40"
                  : "bg-surface/20 hover:bg-surface/40 border border-transparent"
              }`}
            >
              <h3 className="text-sm font-semibold text-text-primary truncate">{list.name}</h3>
              <p className="text-xs text-text-muted mt-0.5 truncate">{list.description}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {list.playerCount}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {list.created}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Shortlist Content */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-text-primary">{activeList.name}</h2>
              <p className="text-xs text-text-secondary">{activeList.description}</p>
            </div>
            <div className="relative w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-9 py-2 text-sm"
              />
            </div>
          </div>

          {filteredPlayers.map((player, i) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-4 flex items-center gap-4"
            >
              {/* Rank */}
              <div className="w-8 h-8 rounded-full bg-amber/20 flex items-center justify-center text-amber font-bold text-sm shrink-0">
                {i + 1}
              </div>

              {/* Player Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-text-primary">{player.name}</h3>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold"
                    style={{ backgroundColor: `${POSITION_COLORS[player.position] || "#64748b"}20`, color: POSITION_COLORS[player.position] }}
                  >
                    {player.position}
                  </span>
                </div>
                <p className="text-xs text-text-muted">{player.club} · Age {player.age} · OVR {player.overall}</p>
                {player.notes && (
                  <p className="text-xs text-text-secondary mt-1 italic">&quot;{player.notes}&quot;</p>
                )}
              </div>

              {/* Score & Value */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-center">
                  <span className={`text-lg font-black ${player.score >= 80 ? "text-emerald" : player.score >= 65 ? "text-electric-bright" : "text-amber"}`}>
                    {player.score}
                  </span>
                  <p className="text-[10px] text-text-muted">AI Score</p>
                </div>
                <div className="text-center">
                  <span className="text-sm font-bold text-emerald">{formatCurrency(player.value)}</span>
                  <p className="text-[10px] text-text-muted">Value</p>
                </div>
                <div className="flex gap-1">
                  <Link
                    href={`/dashboard/players/${player.id}`}
                    className="w-7 h-7 rounded-md bg-electric/10 flex items-center justify-center text-electric-bright hover:bg-electric/20 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                  <button className="w-7 h-7 rounded-md bg-coral/10 flex items-center justify-center text-coral hover:bg-coral/20 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
