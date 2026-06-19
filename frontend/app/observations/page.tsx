"use client";

import Link from "next/link";

import { AppShell } from "@/components/layout/AppShell";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  useObservations,
} from "@/hooks/useObservations";

export default function ObservationsPage() {
  const {
    data,
    isLoading,
  } = useObservations();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AppShell>

      <h1 className="text-2xl font-bold mb-6">
        Observations
      </h1>

      <div className="space-y-4">

        {data?.map((obs: any) => (

          <Card key={obs.id}>

            <CardContent className="p-4">

              <Link
                href={`/patients/${obs.patient}`}
                className="
                  font-semibold
                  text-lg
                  hover:underline
                "
              >
                {obs.patient_name}
              </Link>

              <p className="mt-2">
                <strong>Observation:</strong>
                {" "}
                {obs.code}
              </p>

              <p>
                <strong>Value:</strong>
                {" "}
                {obs.value}
                {" "}
                {obs.unit}
              </p>

              <p className="text-sm text-gray-500">
                Recorded:
                {" "}
                {new Date(
                  obs.observed_at
                ).toLocaleString()}
              </p>

            </CardContent>

          </Card>

        ))}

      </div>

    </AppShell>
  );
}