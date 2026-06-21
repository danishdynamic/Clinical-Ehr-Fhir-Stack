"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { Observation } from "@/hooks/useObservations";

interface VitalsChartProps {
  observations: Observation[];
}

// openEHR Archetype upper boundary safety guardrails
const CLINICAL_THRESHOLDS: Record<string, { max: number; label: string }> = {
  heart_rate: { max: 120, label: "Tachycardia Ceiling (>120 bpm)" },
  blood_pressure: { max: 140, label: "Hypertension Stage 2 (>140 mmHg)" },
  temperature: { max: 38.5, label: "High Fever Threshold (>38.5°C)" },
};

export function VitalsChart({ observations }: VitalsChartProps) {
  // 1. Find all unique observation codes available for this specific patient
  const availableMetrics = useMemo(() => {
    const codes = new Set(observations.map((obs) => obs.code));
    return Array.from(codes);
  }, [observations]);

  // 2. Default to the first available metric or fall back to an empty string
  const [selectedMetric, setSelectedMetric] = useState<string>(
    availableMetrics[0] || ""
  );

  // 3. Process, sort, and normalize the data stream for Recharts
  const chartData = useMemo(() => {
    if (!selectedMetric) return [];

    return observations
      .filter((obs) => obs.code === selectedMetric)
      .map((obs) => ({
        timestamp: obs.issued_at 
          ? new Date(obs.issued_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          : "Just Now",
        rawDate: obs.issued_at ? new Date(obs.issued_at).getTime() : Date.now(),
        value: parseFloat(obs.value) || 0,
        unit: obs.unit,
        displayName: obs.display_name,
      }))
      .sort((a, b) => a.rawDate - b.rawDate); // Ensure chronological left-to-right sorting
  }, [observations, selectedMetric]);

  if (observations.length === 0) return null;

  const activeMetricInfo = chartData[0];
  const threshold = CLINICAL_THRESHOLDS[selectedMetric];

  return (
    <div className="w-full rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-900">Longitudinal Vitals Flow</h3>
          <p className="text-[11px] text-zinc-400">Chronological telemetry stream analysis</p>
        </div>

        {/* Dynamic Metric Switcher Dropdown */}
        {availableMetrics.length > 1 && (
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="h-8 rounded-md border border-zinc-200 bg-zinc-50 px-2 text-xs font-medium text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-950"
          >
            {availableMetrics.map((code) => (
              <option key={code} value={code}>
                {observations.find((o) => o.code === code)?.display_name || code}
              </option>
            ))}
          </select>
        )}
      </div>

      {chartData.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-xs text-zinc-400 italic">
          Select an observation vector to populate timelines.
        </div>
      ) : (
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fontSize: 10, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{ background: "#18181b", borderRadius: "8px", border: "none" }}
                labelStyle={{ color: "#a1a1aa", fontSize: "10px", fontFamily: "monospace" }}
                itemStyle={{ color: "#fafafa", fontSize: "12px", fontWeight: "bold" }}
                formatter={(value: any) => [`${value} ${activeMetricInfo?.unit || ""}`, activeMetricInfo?.displayName]}
              />
              
              {/* Pro-tier openEHR Threshold Flag */}
              {threshold && (
                <ReferenceLine 
                  y={threshold.max} 
                  stroke="#ef4444" 
                  strokeDasharray="4 4"
                  label={{ 
                    value: threshold.label, 
                    position: "top", 
                    fill: "#ef4444", 
                    fontSize: 9, 
                    fontWeight: "semibold" 
                  }} 
                />
              )}

              <Line
                type="monotone"
                dataKey="value"
                stroke="#09090b"
                strokeWidth={2}
                dot={{ r: 3, stroke: "#09090b", strokeWidth: 1, fill: "#ffffff" }}
                activeDot={{ r: 5, stroke: "#09090b", strokeWidth: 2, fill: "#09090b" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}