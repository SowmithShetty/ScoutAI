"use client";

import { useState, useEffect } from "react";
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
import { formatCurrency, POSITION_COLORS, PlayerBrief } from "@/lib/types";
import { playerApi } from "@/lib/api";

const POSITIONS = ["ST", "CF", "LW", "RW", "CAM", "CM", "CDM", "LM", "RM", "LB", "RB", "LWB", "RWB", "CB", "GK"];
const LEAGUES = ["England", "Spain", "Germany", "Italy", "France"]; // country names in database country/league
const FEET = ["Right", "Left", "Both"];

export default function PlayersPage() {
  const [players, setPlayers] = useState<PlayerBrief[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

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

  // Debounced search query
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset page on search
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      try {
        const params: Record<string, any> = {
          page,
          page_size: 15,
          sort_by: sortBy,
          sort_order: sortOrder,
        };

        if (debouncedSearch) params.search = debouncedSearch;
        if (filters.position) params.position = filters.position;
        if (filters.league) params.league = filters.league;
        if (filters.preferred_foot) params.preferred_foot = filters.preferred_foot;
        if (filters.min_age) params.min_age = parseInt(filters.min_age);
        if (filters.max_age) params.max_age = parseInt(filters.max_age);
        if (filters.availability) params.availability = filters.availability;

        const res = await playerApi.list(params);
        setPlayers(res.data.players);
        setTotal(res.data.total);
        setTotalPages(res.data.total_pages);
      } catch (err) {
        console.error("Failed to fetch players:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [page, debouncedSearch, filters, sortBy, sortOrder]);

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
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
            {total} players found
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
                  <label className="text-xs text-text-muted mb-1 block">League (Country)</label>
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
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-20 text-center">
                    <div className="w-8 h-8 border-4 border-electric/30 border-t-electric rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : (
                players.map((player, i) => (
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
                      {player.club?.name || "Free Agent"}
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && players.length === 0 && (
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-navy/40">
            <div className="text-xs text-text-muted">
              Showing page {page} of {totalPages} ({total} players total)
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded bg-surface/50 border border-border text-xs text-text-secondary hover:text-text-primary disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded bg-surface/50 border border-border text-xs text-text-secondary hover:text-text-primary disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
