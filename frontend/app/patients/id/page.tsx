"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateObservation } from "@/hooks/useCreateObservation";
import { usePatients } from "@/hooks/usePatients";
import { usePatient } from "@/hooks/usePatient";
import Link from "next/link";
import { useState } from "react";

export default function PatientsPage({ params }: { params: { id: string } }) {
  const { data, isLoading } =
    usePatients(params.id);

  const [code, setCode] =
    useState("");

  const [value, setValue] =
    useState("");

  const {
    data: patient,
    isLoading: patientIsLoading,
  } = usePatient(params.id);

  const createObservation =
    useCreateObservation();

  if (isLoading || patientIsLoading) {
    return <div>Loading...</div>;
  }

 
return (
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
          Gender: {patient.gender}
        </p>

      </div>

      <div className="border p-4 rounded space-y-3">

        <h2 className="font-semibold">
          Add Observation
        </h2>

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

        <Button
          onClick={() =>
            createObservation.mutate({
              patient: patient.id,
              code,
              value: parseFloat(value),
              unit: "bpm",
            })
          }
        >
          Add Observation
        </Button>

      </div>

    </div>
  );
}