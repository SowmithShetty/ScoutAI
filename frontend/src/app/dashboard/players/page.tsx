"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Star,
  X,
  Filter,
  ArrowUpDown,
  Eye,
  BookmarkPlus,
  TrendingUp,
} from "lucide-react";
import { formatCurrency, POSITION_COLORS } from "@/lib/types";

// ─── Mock Player Data ────────────────────────────────────────────────────────

const MOCK_PLAYERS = [
  { id: "1", name: "Erling Haaland", age: 25, nationality: "Norway", position: "ST", club: "Manchester City", league: "Premier League", market_value: 180000000, overall_rating: 91, potential: 95, preferred_foot: "Left", availability: "Available", image_url: null, is_transfer_listed: false, salary: 375000 },
  { id: "2", name: "Jude Bellingham", age: 22, nationality: "England", position: "CAM", club: "Real Madrid", league: "La Liga", market_value: 150000000, overall_rating: 89, potential: 94, preferred_foot: "Right", availability: "Available", image_url: null, is_transfer_listed: false, salary: 320000 },
  { id: "3", name: "Florian Wirtz", age: 22, nationality: "Germany", position: "CAM", club: "Bayer Leverkusen", league: "Bundesliga", market_value: 130000000, overall_rating: 88, potential: 94, preferred_foot: "Right", availability: "Available", image_url: null, is_transfer_listed: false, salary: 200000 },
  { id: "4", name: "Lamine Yamal", age: 18, nationality: "Spain", position: "RW", club: "FC Barcelona", league: "La Liga", market_value: 150000000, overall_rating: 86, potential: 96, preferred_foot: "Left", availability: "Available", image_url: null, is_transfer_listed: false, salary: 180000 },
  { id: "5", name: "Jamal Musiala", age: 22, nationality: "Germany", position: "CAM", club: "Bayern Munich", league: "Bundesliga", market_value: 120000000, overall_rating: 87, potential: 93, preferred_foot: "Right", availability: "Available", image_url: null, is_transfer_listed: false, salary: 250000 },
  { id: "6", name: "Bukayo Saka", age: 23, nationality: "England", position: "RW", club: "Arsenal", league: "Premier League", market_value: 120000000, overall_rating: 88, potential: 92, preferred_foot: "Left", availability: "Available", image_url: null, is_transfer_listed: false, salary: 300000 },
  { id: "7", name: "Vinícius Júnior", age: 25, nationality: "Brazil", position: "LW", club: "Real Madrid", league: "La Liga", market_value: 150000000, overall_rating: 90, potential: 93, preferred_foot: "Right", availability: "Available", image_url: null, is_transfer_listed: false, salary: 400000 },
  { id: "8", name: "Phil Foden", age: 25, nationality: "England", position: "CAM", club: "Manchester City", league: "Premier League", market_value: 110000000, overall_rating: 88, potential: 91, preferred_foot: "Left", availability: "Available", image_url: null, is_transfer_listed: false, salary: 300000 },
  { id: "9", name: "Pedri", age: 22, nationality: "Spain", position: "CM", club: "FC Barcelona", league: "La Liga", market_value: 100000000, overall_rating: 87, potential: 92, preferred_foot: "Right", availability: "Injured", image_url: null, is_transfer_listed: false, salary: 220000 },
  { id: "10", name: "William Saliba", age: 24, nationality: "France", position: "CB", club: "Arsenal", league: "Premier League", market_value: 90000000, overall_rating: 87, potential: 91, preferred_foot: "Right", availability: "Available", image_url: null, is_transfer_listed: false, salary: 200000 },
  { id: "11", name: "Rodri", age: 28, nationality: "Spain", position: "CDM", club: "Manchester City", league: "Premier League", market_value: 110000000, overall_rating: 91, potential: 91, preferred_foot: "Right", availability: "Injured", image_url: null, is_transfer_listed: false, salary: 350000 },
  { id: "12", name: "Kylian Mbappé", age: 26, nationality: "France", position: "ST", club: "Real Madrid", league: "La Liga", market_value: 180000000, overall_rating: 91, potential: 94, preferred_foot: "Right", availability: "Available", image_url: null, is_transfer_listed: false, salary: 500000 },
  { id: "13", name: "Gavi", age: 21, nationality: "Spain", position: "CM", club: "FC Barcelona", league: "La Liga", market_value: 80000000, overall_rating: 84, potential: 92, preferred_foot: "Right", availability: "Available", image_url: null, is_transfer_listed: false, salary: 170000 },
  { id: "14", name: "Declan Rice", age: 26, nationality: "England", position: "CDM", club: "Arsenal", league: "Premier League", market_value: 100000000, overall_rating: 87, potential: 89, preferred_foot: "Right", availability: "Available", image_url: null, is_transfer_listed: false, salary: 280000 },
  { id: "15", name: "Alejandro Garnacho", age: 21, nationality: "Argentina", position: "LW", club: "Manchester United", league: "Premier League", market_value: 50000000, overall_rating: 80, potential: 89, preferred_foot: "Right", availability: "Available", image_url: null, is_transfer_listed: true, salary: 120000 },
  { id: "16", name: "Xavi Simons", age: 22, nationality: "Netherlands", position: "CAM", club: "RB Leipzig", league: "Bundesliga", market_value: 80000000, overall_rating: 84, potential: 90, preferred_foot: "Right", availability: "Available", image_url: null, is_transfer_listed: false, salary: 180000 },
];

const POSITIONS = ["ST", "CF", "LW", "RW", "CAM", "CM", "CDM", "LM", "RM", "LB", "RB", "LWB", "RWB", "CB", "GK"];
const LEAGUES = ["Premier League", "La Liga", "Bundesliga", "Serie A", "Ligue 1"];
const FEET = ["Right", "Left", "Both"];

// ═══════════════════════════════════════════════════════════════════════════════
// PLAYER DATABASE PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function PlayersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("overall_rating");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState({
    position: "",
    league: "",
    preferred_foot: "",
    min_age: "",
    max_age: "",
    availability: "",
  });

  // Filter and sort players
  const filteredPlayers = useMemo(() => {
    let result = [...MOCK_PLAYERS];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nationality.toLowerCase().includes(q) ||
          p.club.toLowerCase().includes(q)
      );
    }

    // Filters
    if (filters.position) result = result.filter((p) => p.position === filters.position);
    if (filters.league) result = result.filter((p) => p.league === filters.league);
    if (filters.preferred_foot) result = result.filter((p) => p.preferred_foot === filters.preferred_foot);
    if (filters.min_age) result = result.filter((p) => p.age >= parseInt(filters.min_age));
    if (filters.max_age) result = result.filter((p) => p.age <= parseInt(filters.max_age));
    if (filters.availability) result = result.filter((p) => p.availability === filters.availability);

    // Sort
    result.sort((a, b) => {
      const aVal = a[sortBy as keyof typeof a] as number;
      const bVal = b[sortBy as keyof typeof b] as number;
      return sortOrder === "desc" ? (bVal ?? 0) - (aVal ?? 0) : (aVal ?? 0) - (bVal ?? 0);
    });

    return result;
  }, [searchQuery, filters, sortBy, sortOrder]);

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const clearFilters = () => {
    setFilters({ position: "", league: "", preferred_foot: "", min_age: "", max_age: "", availability: "" });
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      {/* ─── Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Player Database</h1>
          <p className="text-sm text-text-secondary mt-1">
            {filteredPlayers.length} players found
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-9 py-2 text-sm"
            />
          </div>
          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary py-2 relative ${showFilters ? "border-electric/50" : ""}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-electric rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ─── Filter Panel ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Advanced Filters
                </h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-coral hover:text-coral-bright transition-colors flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Clear all
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Position</label>
                  <select
                    value={filters.position}
                    onChange={(e) => setFilters({ ...filters, position: e.target.value })}
                    className="input-field py-2 text-sm"
                  >
                    <option value="">All</option>
                    {POSITIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-muted mb-1 block">League</label>
                  <select
                    value={filters.league}
                    onChange={(e) => setFilters({ ...filters, league: e.target.value })}
                    className="input-field py-2 text-sm"
                  >
                    <option value="">All</option>
                    {LEAGUES.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Foot</label>
                  <select
                    value={filters.preferred_foot}
                    onChange={(e) => setFilters({ ...filters, preferred_foot: e.target.value })}
                    className="input-field py-2 text-sm"
                  >
                    <option value="">All</option>
                    {FEET.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Min Age</label>
                  <input
                    type="number"
                    placeholder="15"
                    value={filters.min_age}
                    onChange={(e) => setFilters({ ...filters, min_age: e.target.value })}
                    className="input-field py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Max Age</label>
                  <input
                    type="number"
                    placeholder="40"
                    value={filters.max_age}
                    onChange={(e) => setFilters({ ...filters, max_age: e.target.value })}
                    className="input-field py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Availability</label>
                  <select
                    value={filters.availability}
                    onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                    className="input-field py-2 text-sm"
                  >
                    <option value="">All</option>
                    <option value="Available">Available</option>
                    <option value="Injured">Injured</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Player Table ──────────────────────────────────────────────── */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {[
                  { key: "name", label: "Player", align: "left" },
                  { key: "age", label: "Age", align: "center" },
                  { key: "position", label: "Pos", align: "center" },
                  { key: "club", label: "Club", align: "left" },
                  { key: "nationality", label: "Nation", align: "left" },
                  { key: "overall_rating", label: "OVR", align: "center" },
                  { key: "potential", label: "POT", align: "center" },
                  { key: "market_value", label: "Value", align: "right" },
                  { key: "availability", label: "Status", align: "center" },
                  { key: "actions", label: "", align: "center" },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.key !== "actions" && toggleSort(col.key)}
                    className={`px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider cursor-pointer hover:text-text-secondary transition-colors ${
                      col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {sortBy === col.key && (
                        sortOrder === "desc" ? (
                          <ChevronDown className="w-3 h-3 text-electric" />
                        ) : (
                          <ChevronUp className="w-3 h-3 text-electric" />
                        )
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((player, i) => (
                <motion.tr
                  key={player.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.02 }}
                  className="border-b border-border/50 hover:bg-surface/30 transition-colors group"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/players/${player.id}`}
                      className="flex items-center gap-3"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-navy-lighter to-surface flex items-center justify-center text-sm font-bold text-text-secondary shrink-0">
                        {player.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary group-hover:text-electric-bright transition-colors">
                          {player.name}
                        </p>
                        <p className="text-xs text-text-muted">{player.preferred_foot} foot</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-text-secondary">
                    {player.age}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className="inline-block px-2 py-0.5 rounded text-xs font-bold"
                      style={{
                        backgroundColor: `${POSITION_COLORS[player.position] || "#64748b"}20`,
                        color: POSITION_COLORS[player.position] || "#64748b",
                      }}
                    >
                      {player.position}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {player.club}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {player.nationality}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-sm font-bold ${
                        player.overall_rating >= 88
                          ? "text-emerald"
                          : player.overall_rating >= 84
                          ? "text-electric-bright"
                          : "text-text-primary"
                      }`}
                    >
                      {player.overall_rating}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-amber">
                      {player.potential}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-text-primary">
                    {formatCurrency(player.market_value)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        player.availability === "Available"
                          ? "bg-emerald/10 text-emerald"
                          : player.availability === "Injured"
                          ? "bg-coral/10 text-coral"
                          : "bg-amber/10 text-amber"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {player.availability}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/dashboard/players/${player.id}`}
                        className="w-7 h-7 rounded-md bg-electric/10 flex items-center justify-center text-electric-bright hover:bg-electric/20 transition-colors"
                        title="View Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        className="w-7 h-7 rounded-md bg-emerald/10 flex items-center justify-center text-emerald-bright hover:bg-emerald/20 transition-colors"
                        title="Add to Shortlist"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPlayers.length === 0 && (
          <div className="py-16 text-center">
            <Search className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary">No players found matching your criteria</p>
            <button
              onClick={clearFilters}
              className="text-sm text-electric-bright mt-2 hover:text-electric transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
