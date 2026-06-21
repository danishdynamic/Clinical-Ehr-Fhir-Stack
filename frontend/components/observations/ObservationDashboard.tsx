"use client";

import { useState } from "react";
import { useObservations, useCreateObservation } from "@/hooks/useObservations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Preset configurations mimicking a clinical data dictionary
const METRIC_PRESETS = {
  heart_rate: { name: "Heart Rate", category: "vital-signs", unit: "bpm", placeholder: "e.g. 72" },
  blood_pressure: { name: "Blood Pressure", category: "vital-signs", unit: "mmHg", placeholder: "e.g. 120/80" },
  temperature: { name: "Body Temperature", category: "vital-signs", unit: "°C", placeholder: "e.g. 36.6" },
  oxygen_saturation: { name: "SpO2", category: "vital-signs", unit: "%", placeholder: "e.g. 98" },
};

export function ObservationDashboard({ patientId }: { patientId: string }) {
  const { data: observations, isLoading } = useObservations(patientId);
  const createObservation = useCreateObservation();

  const [metricCode, setMetricCode] = useState<keyof typeof METRIC_PRESETS>("heart_rate");
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    const preset = METRIC_PRESETS[metricCode];

    createObservation.mutate({
      patient: patientId,
      code: metricCode,
      display_name: preset.name,
      category: preset.category,
      value: value,
      unit: preset.unit,
    }, {
      onSuccess: () => setValue(""),
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* COLUMN 1: Log Vital Sign Observation Form */}
      <div className="md:col-span-1">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Record Observation</h3>
            <p className="text-[11px] text-zinc-400">Capture direct point-of-care clinical vitals</p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-600">Observation Type</label>
              <select
                value={metricCode}
                onChange={(e) => setMetricCode(e.target.value as any)}
                className="w-full h-8 rounded-md border border-zinc-200 bg-zinc-50 p-1 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              >
                {Object.entries(METRIC_PRESETS).map(([code, preset]) => (
                  <option key={code} value={code}>{preset.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-600">Recorded Metric Value</label>
              <div className="relative flex items-center">
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={METRIC_PRESETS[metricCode].placeholder}
                  className="h-8 pr-12 text-xs border-zinc-200 text-zinc-800"
                />
                <span className="absolute right-3 text-[10px] font-mono text-zinc-400">
                  {METRIC_PRESETS[metricCode].unit}
                </span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={createObservation.isPending}
            className="w-full h-8 bg-zinc-950 text-zinc-50 hover:bg-zinc-800 text-xs font-semibold"
          >
            {createObservation.isPending ? "Recording Vitals..." : "Record Metric"}
          </Button>
        </form>
      </div>

      {/* COLUMN 2 & 3: Historical Observations Flow Grid */}
      <div className="md:col-span-2 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Observations History</h3>

        {isLoading ? (
          <p className="text-xs text-zinc-500">Loading metrics stream...</p>
        ) : !observations || observations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center">
            <p className="text-xs text-zinc-500 font-medium">No recorded observation packets found for this chart sequence.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {observations.map((obs) => (
              <div key={obs.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex flex-col justify-between space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-800">{obs.display_name}</h4>
                    <span className="inline-block text-[9px] font-mono tracking-wide uppercase bg-zinc-100 text-zinc-500 px-1 rounded mt-0.5">
                      {obs.category}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {obs.issued_at ? new Date(obs.issued_at).toLocaleDateString() : "Just Now"}
                  </span>
                </div>

                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl font-bold tracking-tight text-zinc-950">{obs.value}</span>
                  <span className="text-xs font-medium text-zinc-400">{obs.unit}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}