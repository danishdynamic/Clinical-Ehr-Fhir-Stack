"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateObservation } from "@/hooks/useCreateObservation";
import { usePatients } from "@/hooks/usePatients";
import { usePatient } from "@/hooks/usePatient";
import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useObservations } from "@/hooks/useObservations";
import { useParams } from "next/navigation";

export default function PatientsPage() {
  const params = useParams();
  const id = params.id as string;

  const [code, setCode] =
    useState("");

  const [value, setValue] =
    useState("");

  const [unit, setUnit] =
  useState("");

  const {
    data: patient,
    isLoading: patientIsLoading,
  } = usePatient(id);

  const observations = useObservations(id);

  const createObservation =
    useCreateObservation();

  if (patientIsLoading ||
  !patient) {
    return <div>Loading...</div>;
  }

 
return (
    <AppShell>
    <div className="space-y-6">

      <div>

        <h1 className="text-2xl font-bold">
          {patient.first_name}
          {" "}
          {patient.last_name}
        </h1>

        <p>
          MRN: {patient.mrn}
        </p>

         <p>
            DOB:
            {" "}
            {patient.date_of_birth}
          </p>

        <p>
          Gender: {patient.gender}
        </p>

      </div>

      <div className="border p-4 rounded space-y-3">

        <h2 className="font-semibold">
          Add Observation
        </h2>

         <Button
            variant="outline"
          >
            Export FHIR
          </Button>

        <Input
          placeholder="Code"
          value={code}
          onChange={(e) =>
            setCode(e.target.value)
          }
        />

        <Input
          placeholder="Value"
          value={value}
          onChange={(e) =>
            setValue(e.target.value)
          }
        />

            <Input
          placeholder="Unit"
          onChange={(e) =>
            setUnit(
              e.target.value
            )
          }
        />

        <Button
      onClick={() =>
        createObservation.mutate({
          patient: id,
          code,
          value:Number(value),
          unit,
        })
      }
    >
          Save Observation
        </Button>

      </div>

      <div>

  <h2 className="text-xl font-semibold mb-4">
    Observations
  </h2>

  {observations.data?.map(
    (obs: any) => (

      <div
        key={obs.id}
        className="
          border
          rounded
          p-3
          mb-2
        "
      >

        <p>
          {obs.code}
        </p>

        <p>
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
      </div>

    )
  )}

</div>

    </div>
    </AppShell>
  );
}