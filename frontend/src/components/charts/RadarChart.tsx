"use client";

import React from "react";
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

export interface RadarStat {
  attribute: string;
  [key: string]: string | number;
}

interface RadarChartProps {
  data: RadarStat[];
  players: { key: string; name: string; color: string }[];
  height?: number;
}

export function PlayerRadarChart({ data, players, height = 350 }: RadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsRadarChart data={data}>
        <PolarGrid stroke="rgba(148,163,184,0.15)" />
        <PolarAngleAxis
          dataKey="attribute"
          tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: "#64748b", fontSize: 10 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0f1629",
            borderColor: "rgba(148,163,184,0.2)",
            borderRadius: "8px",
            color: "#f1f5f9",
          }}
        />
        <Legend
          wrapperStyle={{ paddingTop: "10px" }}
          formatter={(value) => <span className="text-xs text-text-secondary font-medium">{value}</span>}
        />
        {players.map((player) => (
          <Radar
            key={player.key}
            name={player.name}
            dataKey={player.key}
            stroke={player.color}
            fill={player.color}
            fillOpacity={0.25}
            strokeWidth={2}
          />
        ))}
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
