"use client";

import React from "react";

export interface Shot {
  id: string;
  x: number; // 50 to 100 (attacking half)
  y: number; // 0 to 100
  xg: number;
  result: "Goal" | "Saved" | "Off Target" | "Blocked";
}

const DEFAULT_SHOTS: Shot[] = [
  { id: "s1", x: 92, y: 48, xg: 0.65, result: "Goal" },
  { id: "s2", x: 88, y: 38, xg: 0.42, result: "Goal" },
  { id: "s3", x: 85, y: 62, xg: 0.28, result: "Saved" },
  { id: "s4", x: 78, y: 45, xg: 0.12, result: "Blocked" },
  { id: "s5", x: 94, y: 55, xg: 0.72, result: "Goal" },
  { id: "s6", x: 72, y: 30, xg: 0.05, result: "Off Target" },
  { id: "s7", x: 89, y: 42, xg: 0.55, result: "Saved" },
];

export function ShotMap({ shots = DEFAULT_SHOTS }: { shots?: Shot[] }) {
  const getResultColor = (res: Shot["result"]) => {
    switch (res) {
      case "Goal":
        return "#10b981"; // Emerald
      case "Saved":
        return "#3b82f6"; // Blue
      case "Blocked":
        return "#f59e0b"; // Amber
      case "Off Target":
        return "#ef4444"; // Red
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-text-primary">Shot Map & Expected Goals (xG)</h4>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald" /> Goal</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-electric" /> Saved</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber" /> Blocked</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-coral" /> Missed</span>
        </div>
      </div>

      <div className="relative w-full aspect-[105/68] bg-[#0c1c10] border border-emerald/30 rounded-xl overflow-hidden shadow-inner">
        <svg className="absolute inset-0 w-full h-full stroke-emerald/30 fill-none" strokeWidth="1.5">
          <rect x="3%" y="4%" width="94%" height="92%" rx="4" />
          <line x1="50%" y1="4%" x2="50%" y2="96%" />
          <circle cx="50%" cy="50%" r="14%" />
          <rect x="81%" y="22%" width="16%" height="56%" />
          <rect x="91%" y="35%" width="6%" height="30%" />
        </svg>

        {/* Shot Dots */}
        {shots.map((shot) => {
          const size = Math.max(10, shot.xg * 30);
          return (
            <div
              key={shot.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 flex items-center justify-center transition-transform hover:scale-150 cursor-pointer shadow-lg group"
              style={{
                left: `${shot.x}%`,
                top: `${shot.y}%`,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: getResultColor(shot.result),
              }}
            >
              <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-1 bg-navy-light text-text-primary text-[10px] px-2 py-0.5 rounded border border-border whitespace-nowrap z-20 pointer-events-none">
                {shot.result} (xG: {shot.xg.toFixed(2)})
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
