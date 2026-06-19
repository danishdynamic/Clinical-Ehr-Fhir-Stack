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

      <h1 className="text-2xl font-bold mb-6">
        Compositions
      </h1>

      {data?.map((c: any) => (
        <div
          key={c.id}
          className="border p-4 rounded mb-3"
        >
          <h3>
            {c.title}
          </h3>

          <p>
            {c.content}
          </p>
        </div>
      ))}

    </AppShell>
  );
}