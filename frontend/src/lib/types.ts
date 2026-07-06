/**
 * ScoutAI — Type Definitions
 *
 * Shared TypeScript types mirroring the backend Pydantic schemas.
 */

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  avatar_url?: string;
  club_id?: string;
  is_active: boolean;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

// ─── Club ────────────────────────────────────────────────────────────────────

export interface ClubBrief {
  id: string;
  name: string;
  logo_url?: string;
  country: string;
}

// ─── Player ──────────────────────────────────────────────────────────────────

export interface PlayerBrief {
  id: string;
  name: string;
  age: number;
  nationality: string;
  position: string;
  club?: ClubBrief;
  market_value: number;
  overall_rating: number;
  potential: number;
  image_url?: string;
  preferred_foot: string;
  availability: string;
  is_transfer_listed: boolean;
}

export interface PlayerStatistics {
  id: string;
  season: string;
  competition?: string;
  matches: number;
  starts: number;
  minutes: number;
  goals: number;
  assists: number;
  xg: number;
  xg_assist: number;
  xg_per_90: number;
  xa_per_90: number;
  pass_completion_pct: number;
  progressive_passes: number;
  progressive_carries: number;
  key_passes: number;
  successful_dribbles: number;
  touches: number;
  shots: number;
  shots_on_target: number;
  shot_creating_actions: number;
  tackles: number;
  tackles_won: number;
  interceptions: number;
  blocks: number;
  aerial_wins: number;
  pressures: number;
  successful_pressures: number;
  defensive_actions: number;
  yellow_cards: number;
  red_cards: number;
  average_rating: number;
}

export interface TransferRecord {
  id: string;
  from_club_name?: string;
  to_club_name?: string;
  date: string;
  fee: number;
  transfer_type: string;
  season?: string;
}

export interface MedicalRecord {
  id: string;
  injury_type: string;
  body_part: string;
  severity: string;
  start_date: string;
  end_date?: string;
  matches_missed: number;
  days_out: number;
  is_recurring: boolean;
}

export interface PlayerDetail {
  id: string;
  name: string;
  full_name?: string;
  date_of_birth?: string;
  age: number;
  nationality: string;
  second_nationality?: string;
  image_url?: string;
  height?: number;
  weight?: number;
  preferred_foot: string;
  position: string;
  secondary_positions?: string;
  playing_style?: string;
  tactical_role?: string;
  club?: ClubBrief;
  jersey_number?: number;
  contract_start?: string;
  contract_expiry?: string;
  on_loan: boolean;
  loan_club?: string;
  market_value: number;
  salary: number;
  release_clause?: number;
  agent?: string;
  overall_rating: number;
  potential: number;
  form: number;
  availability: string;
  is_transfer_listed: boolean;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  vision: number;
  creativity: number;
  aggression: number;
  leadership: number;
  heading: number;
  finishing: number;
  strength: number;
  weak_foot: number;
  skill_moves: number;
  strengths?: string;
  weaknesses?: string;
  ai_summary?: string;
  statistics: PlayerStatistics[];
  transfers: TransferRecord[];
  medical_records: MedicalRecord[];
}

export interface PlayerListResponse {
  players: PlayerBrief[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface OverviewStats {
  total_players: number;
  average_age: number;
  average_market_value: number;
  total_market_value: number;
  position_distribution: { position: string; count: number }[];
  nationality_distribution: { nationality: string; count: number }[];
  age_distribution: { age: number; count: number }[];
}

// ─── Filter Params ───────────────────────────────────────────────────────────

export interface PlayerFilters {
  search?: string;
  position?: string;
  nationality?: string;
  min_age?: number;
  max_age?: number;
  preferred_foot?: string;
  min_market_value?: number;
  max_market_value?: number;
  min_overall?: number;
  min_potential?: number;
  availability?: string;
  is_transfer_listed?: boolean;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  page_size?: number;
}

// ─── Utility ─────────────────────────────────────────────────────────────────

export type Position =
  | "GK"
  | "CB"
  | "LB"
  | "RB"
  | "LWB"
  | "RWB"
  | "CDM"
  | "CM"
  | "CAM"
  | "LM"
  | "RM"
  | "LW"
  | "RW"
  | "CF"
  | "ST";

export const POSITION_COLORS: Record<string, string> = {
  GK: "#f59e0b",
  CB: "#3b82f6",
  LB: "#3b82f6",
  RB: "#3b82f6",
  LWB: "#06b6d4",
  RWB: "#06b6d4",
  CDM: "#8b5cf6",
  CM: "#8b5cf6",
  CAM: "#10b981",
  LM: "#10b981",
  RM: "#10b981",
  LW: "#ef4444",
  RW: "#ef4444",
  CF: "#ef4444",
  ST: "#ef4444",
};

/**
 * Format a number as currency (EUR).
 */
export function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `€${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `€${(value / 1_000).toFixed(0)}K`;
  }
  return `€${value.toFixed(0)}`;
}

/**
 * Format a number as a compact value.
 */
export function formatCompact(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
}

/**
 * Get color for availability status.
 */
export function getAvailabilityColor(status: string): string {
  switch (status) {
    case "Available":
      return "text-emerald";
    case "Injured":
      return "text-coral";
    case "Suspended":
      return "text-amber";
    case "International Duty":
      return "text-electric";
    default:
      return "text-text-secondary";
  }
}
