"use client";

import { usePatients } from "@/hooks/usePatients";
import Link from "next/link";

export default function PatientsPage({ params }: { params: { id: string } }) {
  const { data, isLoading } =
    usePatients(params.id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Patients
      </h1>

      <div className="space-y-2">
        {data?.map((patient: any) => (
          <Link
            key={patient.id}
            href={`/patients/${patient.id}`}
            className="block border p-2 rounded"
          >
            {patient.first_name}
            {" "}
            {patient.last_name}
          </Link>
        ))}
      </div>
    </div>
  );
}