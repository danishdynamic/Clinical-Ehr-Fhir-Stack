"use client";

import { ObservationDashboard } from "@/components/observations/ObservationDashboard";
import { AppShell } from "@/components/layout/AppShell";

export default function ObservationsPage() {
  // Stable target lookup index anchor
  const testPatientId = "1";

  return (
    <AppShell>
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-zinc-950">Clinical Metrics Verification Engine</h1>
        <p className="text-xs text-zinc-500">Observation Data Elements Registry</p>
      </div>

      {/* Renders the internal metrics capturing dashboard grid directly */}
      <ObservationDashboard patientId={testPatientId} />
    </div>
    </AppShell>
  );
}