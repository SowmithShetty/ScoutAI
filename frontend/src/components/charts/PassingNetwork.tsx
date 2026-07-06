"use client";

import React from "react";

interface Node {
  id: string;
  name: string;
  pos: string;
  x: number;
  y: number;
  passes: number;
}

interface Connection {
  from: string;
  to: string;
  count: number;
}

const NODES: Node[] = [
  { id: "CB1", name: "Saliba", pos: "CB", x: 25, y: 35, passes: 65 },
  { id: "CB2", name: "Gabriel", pos: "CB", x: 25, y: 65, passes: 60 },
  { id: "CDM", name: "Rice", pos: "CDM", x: 45, y: 50, passes: 85 },
  { id: "CM", name: "Odegaard", pos: "CM", x: 65, y: 40, passes: 75 },
  { id: "RW", name: "Saka", pos: "RW", x: 80, y: 25, passes: 45 },
  { id: "ST", name: "Haaland", pos: "ST", x: 85, y: 50, passes: 30 },
];

const CONNECTIONS: Connection[] = [
  { from: "CB1", to: "CB2", count: 25 },
  { from: "CB1", to: "CDM", count: 35 },
  { from: "CB2", to: "CDM", count: 30 },
  { from: "CDM", to: "CM", count: 42 },
  { from: "CM", to: "RW", count: 28 },
  { from: "CM", to: "ST", count: 20 },
  { from: "RW", to: "ST", count: 15 },
];

export function PassingNetwork() {
  const getNode = (id: string) => NODES.find((n) => n.id === id);

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-text-primary">Passing Network & Combination Web</h4>
      <div className="relative w-full aspect-[105/68] bg-[#0c1c10] border border-emerald/30 rounded-xl overflow-hidden shadow-inner">
        <svg className="absolute inset-0 w-full h-full stroke-emerald/20 fill-none" strokeWidth="1.5">
          <rect x="3%" y="4%" width="94%" height="92%" rx="4" />
          <line x1="50%" y1="4%" x2="50%" y2="96%" />
          <circle cx="50%" cy="50%" r="14%" />
        </svg>

        {/* Lines */}
        <svg className="absolute inset-0 w-full h-full">
          {CONNECTIONS.map((conn, i) => {
            const n1 = getNode(conn.from);
            const n2 = getNode(conn.to);
            if (!n1 || !n2) return null;
            return (
              <line
                key={i}
                x1={`${n1.x}%`}
                y1={`${n1.y}%`}
                x2={`${n2.x}%`}
                y2={`${n2.y}%`}
                stroke="#60a5fa"
                strokeWidth={Math.max(1, conn.count / 8)}
                strokeOpacity={0.6}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {NODES.map((node) => (
          <div
            key={node.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div className="w-8 h-8 rounded-full bg-electric-dim border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-md group-hover:scale-125 transition-transform">
              {node.pos}
            </div>
            <span className="text-[10px] text-text-primary font-semibold mt-1 bg-midnight/80 px-1.5 py-0.5 rounded border border-border">
              {node.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
