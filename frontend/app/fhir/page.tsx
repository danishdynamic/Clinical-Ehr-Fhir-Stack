"use client";

import { AppShell } from "@/components/layout/AppShell";
import { useFhirBundle } from "@/hooks/useFhirbundle";

export default function FhirPage() {
  const { data } =
    useFhirBundle();

  return (
    <AppShell>

      <h1 className="text-2xl font-bold mb-6">
        FHIR Bundle
      </h1>

      <pre>
        {JSON.stringify(
          data,
          null,
          2
        )}
      </pre>

    </AppShell>
  );
}