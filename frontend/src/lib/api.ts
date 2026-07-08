/**
 * ScoutAI API Client
 *
 * Centralized Axios-based HTTP client with JWT auth,
 * request/response interceptors, and error handling.
 */

import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor: Attach JWT token ──────────────────────────────────

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("scoutai_access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Handle auth errors ───────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("scoutai_access_token");
        localStorage.removeItem("scoutai_refresh_token");
        localStorage.removeItem("scoutai_user");
        // Redirect to login if not already there
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth Helpers ────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  register: (data: { email: string; password: string; full_name: string; role?: string }) =>
    api.post("/auth/register", data),

  guestLogin: () => api.post("/auth/guest"),

  getProfile: () => api.get("/auth/me"),
};

// ─── Player Helpers ──────────────────────────────────────────────────────────

export const playerApi = {
  list: (params?: Record<string, unknown>) =>
    api.get("/players", { params }),

  getById: (id: string) => api.get(`/players/${id}`),

  getPositions: () => api.get("/players/positions"),

  getNationalities: () => api.get("/players/nationalities"),

  getOverviewStats: () => api.get("/players/stats/overview"),
};

// ─── AI Helpers ──────────────────────────────────────────────────────────────

export const aiApi = {
  parseBrief: (brief: string) =>
    api.post("/ai/parse-brief", { brief }),

  recommend: (requirements: Record<string, any>) =>
    api.post("/ai/recommend", requirements),

  getSimilarity: (playerId: string) =>
    api.get(`/ai/similarity/${playerId}`),

  getRoleClassification: (playerId: string) =>
    api.get(`/ai/role-classification/${playerId}`),

  // Phase 4: Analysis
  getMedicalRisk: (playerId: string) =>
    api.get(`/ai/medical-risk/${playerId}`),

  getFinancialROI: (playerId: string) =>
    api.get(`/ai/financial-roi/${playerId}`),

  getAgeTrajectory: (playerId: string) =>
    api.get(`/ai/age-trajectory/${playerId}`),

  getSquadDepth: () =>
    api.get("/ai/squad-depth"),

  // Phase 5: Reports & Exports
  getExplainableAI: (playerId: string) =>
    api.get(`/ai/explain/${playerId}`),

  downloadPDFReport: (playerId: string) =>
    api.get(`/ai/report/pdf/${playerId}`, { responseType: "blob" }),

  exportPlayers: (params?: { position?: string; max_results?: number }) =>
    api.get("/ai/export/players", { params, responseType: "blob" }),

  exportAnalysis: (playerId: string) =>
    api.get(`/ai/export/analysis/${playerId}`, { responseType: "blob" }),
};

export default api;

