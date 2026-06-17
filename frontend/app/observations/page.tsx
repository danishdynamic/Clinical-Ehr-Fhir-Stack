"use client";

import { AppShell }
from "@/components/layout/AppShell";

import {
  useObservations,
} from "@/hooks/useObservations";

export default function ObservationsPage() {

  const { data } =
    useObservations();

  return (
    <AppShell>

      <h1 className="text-2xl font-bold mb-4">Observations</h1>

      {data?.map((obs: any) => (

        <div key={obs.id}>
          {obs.code}
        </div>

      ))}

    </AppShell>
  );
}