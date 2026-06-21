"use client";

import { useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFhirBundle } from "@/hooks/useFhirbundle";
import { usePatients } from "@/hooks/usePatients";
import type { Patient } from "@/types/patient";

export default function FhirPage() {
  const { data: patients, isLoading: patientsLoading } = usePatients();
  const [selectedPatientId, setSelectedPatientId] = useState("");

  const patientList = (patients ?? []) as Patient[];
  const selectedPatient =
    patientList.find((patient) => patient.id === Number(selectedPatientId)) ||
    patientList[0];
  const activePatientId = selectedPatient?.id?.toString() || "";

  const { data: bundle, isLoading: bundleLoading } = useFhirBundle(
    activePatientId
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-sky-600">Data Export</p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-900">
              FHIR Bundle
            </h1>
          </div>
          <div className="w-full sm:w-72">
            <label htmlFor="patient-select" className="mb-1 block text-sm font-medium text-slate-700">
              Patient
            </label>
            <select
              id="patient-select"
              value={selectedPatientId || activePatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-sky-500"
            >
              {patientList.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.first_name} {patient.last_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Patient</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-slate-900">
                {selectedPatient
                  ? `${selectedPatient.first_name} ${selectedPatient.last_name}`
                  : "—"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Bundle Type</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-slate-900">
                {bundle?.type || "Collection"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-slate-900">
                {bundle?.entry?.length || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bundle Payload</CardTitle>
          </CardHeader>
          <CardContent>
            {patientsLoading || bundleLoading ? (
              <p className="text-sm text-slate-500">Loading bundle...</p>
            ) : (
              <pre className="max-h-[70vh] overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
                {JSON.stringify(bundle, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}