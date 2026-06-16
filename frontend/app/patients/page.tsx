"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePatients } from "@/hooks/usePatients";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export default function PatientsPage() {
  const { data, isLoading } =
    usePatients("");

  if (isLoading) {
    return <div>Loading...</div>;
  }

   return (
    <AppShell>

      <h1 className="text-2xl font-bold mb-6">
        Patients
      </h1>

      <Table>

        <TableHeader>

          <TableRow>

            <TableHead>
              MRN
            </TableHead>

            <TableHead>
              Name
            </TableHead>

            <TableHead>
              Gender
            </TableHead>

          </TableRow>

        </TableHeader>

        <TableBody>

          {data?.map((patient: any) => (

            <TableRow key={patient.id}>

              <TableCell>
                {patient.mrn}
              </TableCell>

              <TableCell>

                <Link
                  href={`/patients/${patient.id}`}
                  className="font-medium hover:underline"
                >
                  {patient.first_name}
                  {" "}
                  {patient.last_name}
                </Link>

              </TableCell>

              <TableCell>
                {patient.gender}
              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </AppShell>
  );
}