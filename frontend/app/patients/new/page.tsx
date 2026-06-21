"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/layout/AppShell";

export default function NewPatientPage() {
  const router = useRouter();

  // State Declarations
  const [mrn, setMrn] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mrn || !firstName || !lastName) return;

    try {
      setIsSubmitting(true);
      await api.post("/patients/", {
        mrn,
        first_name: firstName,
        last_name: lastName,
        gender,
        date_of_birth: dateOfBirth,
      });
      router.push("/patients");
    } catch (error) {
      console.error("Failed to register patient metadata:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-xl mx-auto py-8 px-4">
        <form 
          onSubmit={createPatient} 
          className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm space-y-6"
        >
          {/* Card Header Header */}
          <div className="border-b border-zinc-100 pb-4">
            <h1 className="text-xl font-bold text-zinc-950">Patient Admission Registry</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Initialize a new secure medical record sequence (EMR/EHR).</p>
          </div>

          {/* Form Fields Stack */}
          <div className="space-y-4">
            
            {/* Primary Identifier Row */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700">Medical Record Number (MRN)</label>
              <Input
                placeholder="e.g., MRN-2026-9482"
                value={mrn}
                onChange={(e) => setMrn(e.target.value)}
                className="border-zinc-200 focus-visible:ring-zinc-950 text-zinc-800 text-xs h-9"
                required
              />
            </div>

            {/* Two-Column Name Layout Split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700">First Name</label>
                <Input
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="border-zinc-200 focus-visible:ring-zinc-950 text-zinc-800 text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700">Last Name</label>
                <Input
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="border-zinc-200 focus-visible:ring-zinc-950 text-zinc-800 text-xs h-9"
                  required
                />
              </div>
            </div>

            {/* Demographics Split Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700">Date of Birth</label>
                <Input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="border-zinc-200 focus-visible:ring-zinc-950 text-zinc-800 text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700">Administrative Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full h-9 border border-zinc-200 rounded-md bg-transparent px-3 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-950 transition-all"
                >
                  <option value="" disabled hidden>Select Gender Identity</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

          </div>

          {/* Action Button Strip */}
          <div className="flex flex-row items-center justify-end space-x-3 pt-2 border-t border-zinc-100">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/patients")}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors h-9 px-4"
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-zinc-950 text-zinc-50 hover:bg-zinc-800 transition-all text-xs font-semibold h-9 px-5 shadow-sm"
            >
              {isSubmitting ? "Committing Record..." : "Register Patient"}
            </Button>
          </div>

        </form>
      </div>
    </AppShell>
  );
}