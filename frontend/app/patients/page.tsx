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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PatientsPage() {
  const { data, isLoading } =
    usePatients();

  if (isLoading) {
    return <div>Loading...</div>;
  }

   return (
    <AppShell>

    <div className="flex items-center justify-between mb-6">

      <h1 className="text-2xl font-bold">
        Patients
      </h1>

      <Link href="/patients/new">
        <Button className="bg-gray-500 text-white">
          New Patient
        </Button>
      </Link>

    </div>
    
    <Card>

  <CardContent className="p-6">
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
            DOB
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
              {patient.date_of_birth}
              </TableCell>

              <TableCell>
                {patient.gender}
              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>
     

      </CardContent>

</Card>
    </AppShell>
  );
}