"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Unified hook and type imports
import { useObservations, useCreateObservation, type Observation } from "@/hooks/useObservations";
import { usePatient } from "@/hooks/usePatient";
import { useCompositions } from "@/hooks/useCompositions";
import { PatientProfileHeader } from "@/components/patients/PatientProfileHeader";
// 1. Import your new chart component here
import { VitalsChart } from "@/components/observations/VitalsChart";
import { toast } from "sonner";
import { useClinicalRules } from "@/hooks/useClinicalRules";
import { useFhirExport } from "@/hooks/useFhirExport";

export default function PatientDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const patientId = Number(id); 

  // Form Field Local State
  const [code, setCode] = useState("");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("");

  // Data Fetching Hooks
  const { data: patient, isLoading: patientIsLoading } = usePatient(id);
  const { data: observationsData, isLoading: observationsLoading } = useObservations(id);
  const { data: compositionsData, isLoading: compositionsLoading } = useCompositions(id);
  const createObservation = useCreateObservation();

  const observations = (observationsData ?? []) as Observation[];

  const { data: databaseRules = [], isLoading: rulesLoading } = useClinicalRules();

  const { exportRecord, isExporting } = useFhirExport(
  patient?.id, 
  patient?.mrn, 
  patient?.last_name
);

  // Compute the client-side dataset for this specific chart view
  const patientCompositions = (compositionsData ?? []).filter(
    (c: any) => c.patient === patientId
  );

  // Consolidated operational loading lifecycle
  const isLoading = patientIsLoading || observationsLoading || compositionsLoading || rulesLoading;

  if (isLoading || !patient) {
    return (
      <AppShell>
        <div className="flex h-[50vh] items-center justify-center text-sm font-medium text-zinc-500 animate-pulse font-mono">
          Loading clinical workspace...
        </div>
      </AppShell>
    );
  }

  const handleSaveObservation = () => {
    if (!code || !value) return;

    const numericValue = parseFloat(value);
    let activeAlertMessage: string | null = null;

      // 1. Scan your live PostgreSQL rules for a matching element_code
    const matchingRule = databaseRules.find(
      (rule) => rule.element_code.toLowerCase() === code.trim().toLowerCase()
    );

    // 2. Perform automated validation checks if a database constraint rule exists
    if (matchingRule && !isNaN(numericValue)) {
      if (matchingRule.max_value !== null && numericValue > matchingRule.max_value) {
        activeAlertMessage = matchingRule.alert_message_template
          .replace("{value}", value)
          .replace("{bound}", matchingRule.max_value.toString());
      } else if (matchingRule.min_value !== null && numericValue < matchingRule.min_value) {
        activeAlertMessage = matchingRule.alert_message_template
          .replace("{value}", value)
          .replace("{bound}", matchingRule.min_value.toString());
      }
    }

    createObservation.mutate(
      {
        patient: id,
        code: code.trim().toLowerCase(),
        display_name: matchingRule ? matchingRule.display_name : code.replace("_", " ").toUpperCase(), // Formats "heart_rate" to "heart rate" cleanly
        category: "vital-signs",
        value: value,
        unit: matchingRule ? matchingRule.unit : unit,
      },
      {
        onSuccess: () => {
          if (activeAlertMessage) {
          toast.error("⚠️ Physiological Alert Flagged", {
            description: activeAlertMessage,
            duration: 8000, // Persistent view time for urgent flags
          });
        } else {
          toast.success("Observation committed to EMR securely.");
        }

          setCode("");
          setValue("");
          setUnit("");
        },
        onError: () => {
        toast.error("Network sync mutation failed. Check local state records.");
      },
      }
    );
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 md:py-10">
        
        {/* Unified Header Component */}
        <PatientProfileHeader 
          patient={patient} 
          compositions={patientCompositions}
        />

        {/* 2. Drop the chart right here, running full width across the top of the workspace */}
        <VitalsChart observations={observations} />

        {/* Dashboard Grid Split */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
          
          {/* Left Column: Form Action Card */}
          <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">Add Observation</h2>
              <p className="text-xs text-zinc-500">Record a new clinical metric for this patient.</p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-600">Observation Code</label>
                <Input
                  placeholder="e.g., heart_rate, blood_pressure"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="border-zinc-200 focus-visible:ring-zinc-950 text-sm text-zinc-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-600">Value</label>
                  <Input
                    placeholder="e.g., 72"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="border-zinc-200 focus-visible:ring-zinc-950 text-sm text-zinc-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-600">Unit</label>
                  <Input
                    placeholder="e.g., bpm, mmHg"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="border-zinc-200 focus-visible:ring-zinc-950 text-sm text-zinc-800"
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveObservation}
                disabled={createObservation.isPending}
                className="w-full bg-zinc-900 text-zinc-50 hover:bg-zinc-800 transition-colors mt-2 text-xs font-bold"
              >
                {createObservation.isPending ? "Saving..." : "Save Observation"}
              </Button>
            </div>
          </div>

          {/* Right Column: Historical Observations Log */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <h2 className="text-lg font-semibold text-zinc-900">Observations History</h2>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 font-mono">
                {observations.length} Total
              </span>
            </div>
             
            
            <div> {observations.length > 0 && (
                <Button
                  onClick={exportRecord}
                  disabled={isExporting}
                  className="h-8 rounded-lg bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  {isExporting ? "Compiling Bundle..." : "Export FHIR Record"}
                </Button>
              )}
            </div>

            {observations.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-12 text-center">
                <p className="text-sm font-medium text-zinc-900">No observations found</p>
                <p className="text-xs text-zinc-500 mt-1">Fill out the form to add the first data point.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {observations.map((obs) => (
                  <div 
                    key={obs.id} 
                    className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-400 shadow-sm"
                  >
                    <div className="space-y-1">
                      <p className="text-xs font-mono font-semibold tracking-tight text-zinc-500 uppercase">
                        {obs.code}
                      </p>
                      <p className="text-sm text-zinc-400">
                        Recorded: <span className="text-zinc-600 font-medium">
                          {obs.issued_at ? new Date(obs.issued_at).toLocaleString() : "Just Now"}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold tracking-tight text-zinc-900">
                        {obs.value} <span className="text-sm font-normal text-zinc-500">{obs.unit}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </AppShell>
  );
}