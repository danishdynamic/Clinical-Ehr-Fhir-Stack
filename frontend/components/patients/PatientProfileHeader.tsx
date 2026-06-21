"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

interface PatientHeaderProps {
  patient: {
    id: number;
    first_name: string;
    last_name: string;
    mrn: string;
    dob: string;
    gender: string;
  };
  // Pass down the compositions associated with this patient to convert
  compositions?: any[]; 
}

export function PatientProfileHeader({ patient, compositions = [] }: PatientHeaderProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  // Mock openEHR Composition source payload from the DB
  const sampleOpenEhrSource = compositions[0]?.content ?? {
    ctx: { language: "en", territory: "US" },
    vital_signs: {
      body_temperature: [{ magnitude: 37.2, units: "°C" }]
    }
  };

  // The generated target HL7 FHIR compliant structural conversion output
  const generatedFhirBundle = {
    resourceType: "Bundle",
    type: "transaction",
    entry: [
      {
        resource: {
          resourceType: "Patient",
          id: String(patient.id),
          identifier: [{ system: "http://hospital.org/mrn", value: patient.mrn }],
          name: [{ use: "official", family: patient.last_name, given: [patient.first_name] }],
          gender: patient.gender,
          birthDate: patient.dob
        }
      },
      {
        resource: {
          resourceType: "Observation",
          status: "final",
          category: [{
            coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "vital-signs" }]
          }],
          code: {
            coding: [{ system: "http://loinc.org", code: "8310-5", display: "Body temperature" }]
          },
          subject: { reference: `Patient/${patient.id}` },
          valueQuantity: {
            value: sampleOpenEhrSource.vital_signs?.body_temperature?.[0]?.magnitude ?? 36.8,
            unit: "C",
            system: "http://unitsofmeasure.org",
            code: "Cel"
          }
        }
      }
    ]
  };

  const handleTransmitPayload = () => {
    setIsExporting(true);
    // Simulate pipeline pipeline dispatch over network
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
    }, 1600);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-6 bg-white">
      {/* Patient Demographic Information panel */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          {patient.first_name} {patient.last_name}
        </h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-zinc-500">
          <p>MRN: <span className="text-zinc-800 font-semibold">{patient.mrn}</span></p>
          <span>•</span>
          <p>DOB: <span className="text-zinc-800">{patient.dob}</span></p>
          <span>•</span>
          <p>Gender: <span className="text-zinc-800 uppercase">{patient.gender}</span></p>
        </div>
      </div>

      {/* Export FHIR Intermediary Pipeline Dialog */}
      <Dialog onOpenChange={(open) => { if(!open) setExportComplete(false); }}>
        <DialogTrigger asChild>
          <button className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-xs font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 hover:border-zinc-400 transition-all">
            Export FHIR
          </button>
        </DialogTrigger>
        
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-6 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl">
          <DialogHeader className="border-b border-zinc-100 pb-4">
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">Semantic Integration Pipeline</p>
            <DialogTitle className="text-xl font-bold text-zinc-900 font-mono tracking-tight">
              openEHR ➡️ FHIR Resource Mapping Engine
            </DialogTitle>
          </DialogHeader>

          {/* Side-by-Side Data Translation Comparator Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 flex-1 overflow-hidden min-h-[300px]">
            
            {/* Left Column: Source openEHR Object Payload */}
            <div className="flex flex-col h-full overflow-hidden border border-zinc-200 rounded-lg">
              <div className="bg-zinc-50 border-b border-zinc-200 px-3 py-2 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-600">Source: openEHR Composition</span>
                <span className="rounded bg-zinc-200/60 px-1.5 py-0.5 text-[10px] font-mono text-zinc-600">Archetype</span>
              </div>
              <pre className="p-3 overflow-y-auto font-mono text-[11px] text-zinc-600 bg-zinc-50/50 flex-1 max-h-[45vh]">
                {JSON.stringify(sampleOpenEhrSource, null, 2)}
              </pre>
            </div>

            {/* Right Column: Generated Target HL7 FHIR Bundle Package */}
            <div className="flex flex-col h-full overflow-hidden border border-zinc-900/10 rounded-lg">
              <div className="bg-zinc-900 border-b border-zinc-900 px-3 py-2 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-100">Target Output: FHIR Bundle</span>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-mono text-emerald-400 font-bold border border-emerald-500/30">Valid JSON Schema</span>
              </div>
              <pre className="p-3 overflow-y-auto font-mono text-[11px] text-zinc-700 bg-white flex-1 max-h-[45vh] selection:bg-zinc-900 selection:text-white">
                {JSON.stringify(generatedFhirBundle, null, 2)}
              </pre>
            </div>

          </div>

          {/* Action Footer Drawer */}
          <div className="border-t border-zinc-100 pt-4 flex items-center justify-between bg-white mt-auto">
            <p className="text-xs text-zinc-400 max-w-md hidden sm:block">
              Maps openEHR structured archetypes directly to clinical HL7 transaction boundaries matching strict FHIR R4 schema profiles.
            </p>
            <div className="flex items-center gap-2 ml-auto w-full sm:w-auto justify-end">
              {exportComplete ? (
                <div className="inline-flex h-9 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 tracking-tight animate-fade-in">
                  Transaction Committed Successfully ✅
                </div>
              ) : (
                <button
                  onClick={handleTransmitPayload}
                  disabled={isExporting}
                  className="w-full sm:w-auto inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-4 text-xs font-bold text-zinc-50 hover:bg-zinc-800 dynamic shadow transition-all disabled:opacity-50 font-mono"
                >
                  {isExporting ? "Streaming to HIE Gateway..." : "Confirm & Dispatch Bundle"}
                </button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}