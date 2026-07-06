"use client";

import React from "react";
import { Activity, AlertTriangle, CheckCircle2 } from "lucide-react";

export interface Injury {
  id: string;
  injury: string;
  bodyPart: string;
  severity: "Minor" | "Moderate" | "Severe";
  startDate: string;
  endDate: string;
  daysMissed: number;
  matchesMissed: number;
}

const DEFAULT_INJURIES: Injury[] = [
  { id: "1", injury: "Hamstring Strain", bodyPart: "Thigh", severity: "Moderate", startDate: "2024-11-10", endDate: "2024-12-15", daysMissed: 35, matchesMissed: 6 },
  { id: "2", injury: "Ankle Sprain", bodyPart: "Ankle", severity: "Minor", startDate: "2024-03-02", endDate: "2024-03-18", daysMissed: 16, matchesMissed: 3 },
  { id: "3", injury: "Knee Contusion", bodyPart: "Knee", severity: "Minor", startDate: "2023-09-15", endDate: "2023-09-25", daysMissed: 10, matchesMissed: 2 },
];

export function InjuryTimeline({ injuries = DEFAULT_INJURIES }: { injuries?: Injury[] }) {
  const getSeverityBadge = (sev: Injury["severity"]) => {
    switch (sev) {
      case "Severe":
        return "bg-coral/20 text-coral border-coral/30";
      case "Moderate":
        return "bg-amber/20 text-amber border-amber/30";
      case "Minor":
        return "bg-emerald/20 text-emerald-bright border-emerald/30";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <Activity className="w-4 h-4 text-coral" /> Medical History & Injury Timeline
        </h4>
        <span className="text-xs text-text-muted">Total Missed: {injuries.reduce((a, b) => a + b.daysMissed, 0)} days</span>
      </div>

      <div className="relative border-l-2 border-border pl-4 space-y-4 ml-2">
        {injuries.map((inj) => (
          <div key={inj.id} className="relative group">
            {/* Timeline node */}
            <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-navy-light border-2 border-electric group-hover:scale-125 transition-transform" />
            
            <div className="glass-card-solid p-3 rounded-lg flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="text-sm font-semibold text-text-primary">{inj.injury}</h5>
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${getSeverityBadge(inj.severity)}`}>
                    {inj.severity}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Body Part: <span className="text-text-secondary">{inj.bodyPart}</span> • Duration: {inj.startDate} to {inj.endDate}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs font-bold text-coral">{inj.daysMissed} Days Out</p>
                <p className="text-[10px] text-text-muted">{inj.matchesMissed} Matches Missed</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
