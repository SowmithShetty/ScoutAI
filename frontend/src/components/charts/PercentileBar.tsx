"use client";

import React from "react";
import { motion } from "framer-motion";

interface PercentileItem {
  metric: string;
  value: number | string;
  percentile: number; // 0 to 100
  category?: string;
}

interface PercentileBarProps {
  items: PercentileItem[];
  title?: string;
}

export function PercentileBar({ items, title }: PercentileBarProps) {
  const getPercentileColor = (pct: number) => {
    if (pct >= 90) return "bg-emerald text-emerald-bright";
    if (pct >= 75) return "bg-electric text-electric-bright";
    if (pct >= 50) return "bg-amber text-amber-bright";
    return "bg-coral text-coral-bright";
  };

  return (
    <div className="space-y-4">
      {title && <h4 className="text-sm font-semibold text-text-primary">{title}</h4>}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary font-medium">{item.metric}</span>
              <div className="flex items-center gap-2">
                <span className="text-text-muted">{item.value}</span>
                <span className="font-bold text-text-primary w-8 text-right">{item.percentile}th</span>
              </div>
            </div>
            <div className="h-2 w-full bg-navy-lighter rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percentile}%` }}
                transition={{ duration: 0.8, delay: idx * 0.05 }}
                className={`h-full rounded-full ${getPercentileColor(item.percentile).split(" ")[0]}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
