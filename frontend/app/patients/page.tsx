"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Lock } from "lucide-react";
import { api } from "@/lib/api"; // Adjust based on your Axios instances setup location
import { useAuth } from "@/hooks/useAuth"; // Assuming your user state is managed here

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent} from "@/components/ui/card";
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
  const { user } = useAuth(); // Read role matrix from authentication state context
  const isInsurer = user?.role === "INSURER";

  // Clinical Staff Hooks Data Stream
  const { data: globalData, isLoading: clinicalLoading } = usePatients();

  // Insurance Specific State Triggers
  const [searchQuery, setSearchQuery] = useState("");
  const [insurerResults, setInsurerResults] = useState<Patient[]>([]);
  const [insurerLoading, setInsurerLoading] = useState(false);
  const [insurerError, setInsurerError] = useState("");

  const handleInsurerSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setInsurerLoading(true);
    setInsurerError("");
    try {
      // Calls our refactored, query-gated ViewSet endpoint
      const response = await api.get(`/patients/?q=${encodeURIComponent(searchQuery)}`);
      setInsurerResults(response.data);
      if (response.data.length === 0) {
        setInsurerError("No matched entries found inside system registry maps.");
      }
    } catch (err: any) {
      setInsurerError(err.response?.data?.detail || "Authorization verification check failure.");
    } finally {
      setInsurerLoading(false);
    }
  };

  // Determine what data array template maps layout views
  const displayPatients = isInsurer ? insurerResults : ((globalData ?? []) as Patient[]);
  const isCurrentlyLoading = isInsurer ? insurerLoading : clinicalLoading;

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-sky-600">
            {isInsurer ? "Verification Portal" : "Directory"}
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">
            Patients
          </h1>
        </div>

        {/* HIDE ACTION SCHEDULER COMPLETELY FROM INSURER USERS */}
        {!isInsurer && (
          <Link href="/patients/new">
            <Button className="bg-slate-900 text-white hover:bg-slate-800">
              New Patient
            </Button>
          </Link>
        )}
      </div>

      {/* RENDER CONDITIONAL SEARCH INTERFACE FOR INSURERS */}
      {isInsurer && (
        <Card className="mb-6 border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <form onSubmit={handleInsurerSearch} className="flex gap-3 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by exact MRN, ID, or Full Name..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-slate-950"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isCurrentlyLoading} className="bg-slate-900 text-white">
                {isCurrentlyLoading ? "Searching..." : "Lookup"}
              </Button>
            </form>
            {insurerError && (
              <p className="mt-3 text-xs font-medium text-red-600">{insurerError}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* RESULTS DISPLAY GRID */}
      <Card>
        <CardContent className="p-6">
          {isCurrentlyLoading ? (
            <div className="text-sm text-slate-500 py-4 animate-pulse">
              Parsing platform security clearances...
            </div>
          ) : isInsurer && insurerResults.length === 0 && !insurerError ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-slate-500">
              <Lock className="h-8 w-8 text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-700">Database Search Required</p>
              <p className="text-xs text-slate-400 max-w-xs mt-0.5">
                Global index reading is restricted. Please input an explicit query criteria above to load data.
              </p>
            </div>
          ) : (
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
                {displayPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-mono text-xs font-semibold">{patient.mrn}</TableCell>
                    <TableCell>
                      {isInsurer ? (
                        <span className="font-medium text-slate-900">
                          {patient.first_name} {patient.last_name}
                        </span>
                      ) : (
                        <Link
                          href={`/patients/${patient.id}`}
                          className="font-medium text-slate-900 hover:underline"
                        >
                          {patient.first_name} {patient.last_name}
                        </Link>
                      )}
                    </TableCell>
                    <TableCell>{patient.date_of_birth}</TableCell>
                    <TableCell className="capitalize">{patient.gender.toLowerCase()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}