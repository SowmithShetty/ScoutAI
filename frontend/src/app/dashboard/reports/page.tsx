"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Calendar,
  Eye,
  Plus,
  Star,
} from "lucide-react";

const MOCK_REPORTS = [
  { id: "r1", title: "Summer 2025 Striker Shortlist Report", type: "Scouting", date: "2025-07-01", pages: 12, status: "Complete" },
  { id: "r2", title: "Xavi Simons — Detailed Assessment", type: "Player Profile", date: "2025-06-28", pages: 8, status: "Complete" },
  { id: "r3", title: "U-21 Talent Pipeline Analysis", type: "Analytics", date: "2025-06-20", pages: 15, status: "Complete" },
  { id: "r4", title: "FFP Compliance Review Q2 2025", type: "Financial", date: "2025-06-15", pages: 6, status: "Draft" },
  { id: "r5", title: "Medical Risk Assessment — Transfer Targets", type: "Medical", date: "2025-06-10", pages: 10, status: "Complete" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
            <FileText className="w-7 h-7 text-purple-bright" /> Reports
          </h1>
          <p className="text-sm text-text-secondary mt-1">Generated scouting reports and analytical documents</p>
        </div>
        <button className="btn-primary py-2 text-sm"><Plus className="w-4 h-4" /> Generate Report</button>
      </div>

      <div className="space-y-3">
        {MOCK_REPORTS.map((report, i) => (
          <motion.div key={report.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-purple/10 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-purple-bright" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-text-primary">{report.title}</h3>
              <p className="text-xs text-text-muted">{report.type} · {report.pages} pages · {report.date}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded font-bold ${report.status === "Complete" ? "bg-emerald/20 text-emerald-bright" : "bg-amber/20 text-amber"}`}>{report.status}</span>
            <div className="flex gap-1">
              <button className="w-7 h-7 rounded-md bg-electric/10 flex items-center justify-center text-electric-bright hover:bg-electric/20 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
              <button className="w-7 h-7 rounded-md bg-emerald/10 flex items-center justify-center text-emerald-bright hover:bg-emerald/20 transition-colors"><Download className="w-3.5 h-3.5" /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
