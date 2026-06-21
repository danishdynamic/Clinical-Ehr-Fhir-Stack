"use client";

import { PatientCompositionsView } from "@/components/compositions/PatientCompositionsView";
import { AppShell } from "@/components/layout/AppShell";

export default function CompositionsPage() {
  // Safe test patient lookup ID
  const testPatientId = "1";

  return (
    <AppShell>
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-zinc-950">EHR Document Management Architecture</h1>
        <p className="text-xs text-zinc-500">Global Clinical Compositions Ledger</p>
      </div>

      <PatientCompositionsView patientId={testPatientId} />
    </div>
    </AppShell>
  );
}