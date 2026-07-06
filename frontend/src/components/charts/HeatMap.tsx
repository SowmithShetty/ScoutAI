"use client";

import React from "react";

interface HeatPoint {
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
  intensity: number; // 0.1 to 1
}

interface HeatMapProps {
  points?: HeatPoint[];
  title?: string;
}

const DEFAULT_POINTS: HeatPoint[] = [
  { x: 75, y: 30, intensity: 0.9 },
  { x: 80, y: 35, intensity: 0.95 },
  { x: 78, y: 45, intensity: 0.85 },
  { x: 85, y: 40, intensity: 1.0 },
  { x: 70, y: 50, intensity: 0.7 },
  { x: 65, y: 35, intensity: 0.6 },
  { x: 82, y: 60, intensity: 0.75 },
  { x: 90, y: 45, intensity: 0.9 },
  { x: 88, y: 52, intensity: 0.8 },
  { x: 60, y: 40, intensity: 0.5 },
];

export function HeatMap({ points = DEFAULT_POINTS, title = "Heatmap & Touch Distribution" }: HeatMapProps) {
  return (
    <div className="space-y-3">
      {title && <h4 className="text-sm font-semibold text-text-primary">{title}</h4>}
      <div className="relative w-full aspect-[105/68] bg-[#0c1c10] border border-emerald/30 rounded-xl overflow-hidden shadow-inner">
        {/* Pitch Lines */}
        <svg className="absolute inset-0 w-full h-full stroke-emerald/30 fill-none" strokeWidth="1.5">
          {/* Outer Boundary */}
          <rect x="3%" y="4%" width="94%" height="92%" rx="4" />
          {/* Halfway Line */}
          <line x1="50%" y1="4%" x2="50%" y2="96%" />
          {/* Center Circle */}
          <circle cx="50%" cy="50%" r="14%" />
          <circle cx="50%" cy="50%" r="1" fill="#10b981" />
          {/* Left Penalty Area */}
          <rect x="3%" y="22%" width="16%" height="56%" />
          <rect x="3%" y="35%" width="6%" height="30%" />
          {/* Right Penalty Area */}
          <rect x="81%" y="22%" width="16%" height="56%" />
          <rect x="91%" y="35%" width="6%" height="30%" />
          {/* Attack Direction Arrow */}
          <path d="M 45% 90% L 55% 90% M 52% 87% L 55% 90% L 52% 93%" stroke="#10b981" strokeWidth="2" opacity="0.6" />
        </svg>

        {/* Heat Map Glowing Points */}
        {points.map((pt, idx) => (
          <div
            key={idx}
            className="absolute rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 blur-md transition-all duration-500"
            style={{
              left: `${pt.x}%`,
              top: `${pt.y}%`,
              width: `${pt.intensity * 60 + 20}px`,
              height: `${pt.intensity * 60 + 20}px`,
              background: `radial-gradient(circle, rgba(239,68,68,${pt.intensity}) 0%, rgba(245,158,11,${pt.intensity * 0.7}) 50%, rgba(16,185,129,0) 100%)`,
            }}
          />
        ))}

        {/* Attack Direction Overlay */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-emerald-bright/80 font-mono tracking-widest uppercase bg-midnight/80 px-2 py-0.5 rounded border border-emerald/20">
          Attacking Direction →
        </div>
      </div>
    </div>
  );
}
