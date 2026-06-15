"use client";

import { AppShell } from "@/components/layout/AppShell";
import { useCompositions } from "@/hooks/useCompositions";

export default function CompositionsPage() {
  const { data, isLoading } =
    useCompositions();

  if (isLoading) {
    return (
      <AppShell>
        <div>Loading...</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <h1 className="text-2xl font-bold mb-4">
        Compositions
      </h1>

      <div className="space-y-4">
        {data?.map((composition: any) => (
          <div
            key={composition.id}
            className="border rounded p-4"
          >
            <div>
              Template:
              {" "}
              {composition.template_id}
            </div>

            <div>
              Archetype:
              {" "}
              {composition.archetype_id}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}