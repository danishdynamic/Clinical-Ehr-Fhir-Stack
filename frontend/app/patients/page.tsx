"use client";

import Link from "next/link";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePatients } from "@/hooks/usePatients";
import type { Patient } from "@/types/patient";


export default function PatientsPage() {
  const { data, isLoading } = usePatients();
  const patients = (data ?? []) as Patient[];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-sky-600">Directory</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">
            Patients
          </h1>
        </div>

        <Link href="/patients/new">
          <Button className="bg-slate-900 text-white hover:bg-slate-800">
            New Patient
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>MRN</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>DOB</TableHead>
                <TableHead>Gender</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.mrn}</TableCell>
                  <TableCell>
                    <Link
                      href={`/patients/${patient.id}`}
                      className="font-medium text-slate-900 hover:underline"
                    >
                      {patient.first_name} {patient.last_name}
                    </Link>
                  </TableCell>
                  <TableCell>{patient.date_of_birth}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppShell>
  );
}