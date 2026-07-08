"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  Calendar,
  Eye,
  Plus,
  Star,
  Sparkles,
  FileSpreadsheet,
  FileDown,
  Search,
  Filter,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Brain,
  BarChart3,
  HeartPulse,
  DollarSign,
  TrendingUp,
} from "lucide-react";

const MOCK_REPORTS = [
  { id: "r1", title: "Summer 2025 Striker Shortlist Report", type: "Scouting", date: "2025-07-01", pages: 12, status: "Complete", icon: "scout" },
  { id: "r2", title: "Xavi Simons — Detailed Assessment", type: "Player Profile", date: "2025-06-28", pages: 8, status: "Complete", icon: "player" },
  { id: "r3", title: "U-21 Talent Pipeline Analysis", type: "Analytics", date: "2025-06-20", pages: 15, status: "Complete", icon: "analytics" },
  { id: "r4", title: "FFP Compliance Review Q2 2025", type: "Financial", date: "2025-06-15", pages: 6, status: "Draft", icon: "financial" },
  { id: "r5", title: "Medical Risk Assessment — Transfer Targets", type: "Medical", date: "2025-06-10", pages: 10, status: "Complete", icon: "medical" },
  { id: "r6", title: "AI Explainability Audit — Top 10 Targets", type: "AI/XAI", date: "2025-06-05", pages: 4, status: "Complete", icon: "ai" },
];

const EXPORT_OPTIONS = [
  { label: "Export Players (CSV)", description: "Full player database with attributes", icon: FileSpreadsheet, color: "text-emerald" },
  { label: "Export Shortlist (CSV)", description: "Current shortlist with AI scores", icon: FileDown, color: "text-electric-bright" },
  { label: "Export Comparison (CSV)", description: "Side-by-side player comparison data", icon: BarChart3, color: "text-purple-bright" },
];

function getIconForType(icon: string) {
  switch (icon) {
    case "scout": return <Search className="w-5 h-5 text-electric-bright" />;
    case "player": return <Star className="w-5 h-5 text-amber" />;
    case "analytics": return <BarChart3 className="w-5 h-5 text-emerald" />;
    case "financial": return <DollarSign className="w-5 h-5 text-electric-bright" />;
    case "medical": return <HeartPulse className="w-5 h-5 text-coral" />;
    case "ai": return <Brain className="w-5 h-5 text-purple-bright" />;
    default: return <FileText className="w-5 h-5 text-text-muted" />;
  }
}

export default function ReportsPage() {
  const [generating, setGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const filteredReports = MOCK_REPORTS.filter((r) => {
    const matchesSearch = searchQuery === "" || r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "All" || r.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const reportTypes = ["All", ...new Set(MOCK_REPORTS.map((r) => r.type))];

  const handleGenerateReport = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
            <FileText className="w-7 h-7 text-purple-bright" />
            Reports & Exports
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            AI-generated scouting reports, SHAP explanations, and data exports
          </p>
        </div>
        <button onClick={handleGenerateReport} disabled={generating} className="btn-primary py-2.5 text-sm disabled:opacity-50">
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {generating ? "Generating..." : "Generate Report"}
        </button>
      </div>

      {/* Quick Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {EXPORT_OPTIONS.map((opt, i) => (
          <motion.button
            key={opt.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4 text-left group hover:border-electric/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-surface/50 flex items-center justify-center">
                <opt.icon className={`w-5 h-5 ${opt.color}`} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-primary">{opt.label}</h4>
                <p className="text-[10px] text-text-muted">{opt.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-electric-bright opacity-0 group-hover:opacity-100 transition-opacity">
              <Download className="w-3 h-3" /> Download
            </div>
          </motion.button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9 py-2 text-sm"
          />
        </div>
        {reportTypes.map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              typeFilter === type
                ? "bg-electric/20 text-electric-bright border-electric/30"
                : "bg-surface/20 text-text-muted border-transparent hover:border-border"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Report Feed */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredReports.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ delay: i * 0.04 }}
              className="glass-card p-4 flex items-center gap-4 group"
            >
              <div className="w-10 h-10 rounded-lg bg-surface/30 flex items-center justify-center shrink-0">
                {getIconForType(report.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-text-primary truncate">{report.title}</h3>
                <p className="text-xs text-text-muted flex items-center gap-2">
                  <span className="flex items-center gap-0.5"><Calendar className="w-3 h-3" />{report.date}</span>
                  <span>·</span>
                  <span>{report.type}</span>
                  <span>·</span>
                  <span>{report.pages} pages</span>
                </p>
              </div>

              <span className={`text-xs px-2.5 py-1 rounded-full font-bold border shrink-0 ${
                report.status === "Complete"
                  ? "bg-emerald/20 text-emerald-bright border-emerald/30"
                  : "bg-amber/20 text-amber border-amber/30"
              }`}>
                {report.status === "Complete" ? <CheckCircle2 className="w-3 h-3 inline mr-0.5" /> : <AlertCircle className="w-3 h-3 inline mr-0.5" />}
                {report.status}
              </span>

              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-8 h-8 rounded-lg bg-electric/10 flex items-center justify-center text-electric-bright hover:bg-electric/20 transition-colors" title="View">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald-bright hover:bg-emerald/20 transition-colors" title="Download PDF">
                  <Download className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-lg bg-purple/10 flex items-center justify-center text-purple-bright hover:bg-purple/20 transition-colors" title="AI Explanation">
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* SHAP Explainability Preview */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-4">
          <Brain className="w-4 h-4 text-purple-bright" />
          Explainable AI — Feature Impact Preview
        </h3>
        <p className="text-xs text-text-muted mb-4">
          Every AI recommendation includes a SHAP-style breakdown showing which factors
          drove the score. Select any player to see their full explanation.
        </p>
        <div className="space-y-2">
          {[
            { feature: "Performance Rating", impact: 8.5, direction: "positive" },
            { feature: "Age & Growth Potential", impact: 6.2, direction: "positive" },
            { feature: "Tactical Fit", impact: 4.1, direction: "positive" },
            { feature: "Financial Viability", impact: -2.3, direction: "negative" },
            { feature: "Medical History", impact: -3.8, direction: "negative" },
            { feature: "Transfer Availability", impact: -1.5, direction: "negative" },
          ].map((factor) => (
            <div key={factor.feature} className="flex items-center gap-3">
              <span className="text-xs text-text-secondary w-44 shrink-0">{factor.feature}</span>
              <div className="flex-1 flex items-center gap-1">
                {factor.direction === "positive" ? (
                  <div className="flex-1 flex justify-end">
                    <div className="h-1" />
                  </div>
                ) : null}
                <div className="w-px h-4 bg-border shrink-0" />
                {factor.direction === "positive" ? (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.abs(factor.impact) * 8}%` }}
                    transition={{ duration: 0.6 }}
                    className="h-5 rounded-r bg-emerald/30 border border-emerald/40"
                  />
                ) : (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.abs(factor.impact) * 8}%` }}
                    transition={{ duration: 0.6 }}
                    className="h-5 rounded-r bg-coral/30 border border-coral/40 order-first"
                    style={{ marginRight: 0 }}
                  />
                )}
              </div>
              <span className={`text-xs font-bold w-12 text-right ${factor.direction === "positive" ? "text-emerald" : "text-coral"}`}>
                {factor.direction === "positive" ? "+" : ""}{factor.impact.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-text-muted mt-3 italic">
          Baseline score: 50.0 · Bars show additive contribution to the final recommendation score
        </p>
      </div>
    </div>
  );
}
