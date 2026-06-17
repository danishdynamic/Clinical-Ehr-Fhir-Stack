"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/layout/AppShell";

export default function NewPatientPage() {
  const router = useRouter();

  const [mrn, setMrn] = useState("");
  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [gender, setGender] =
  useState("");

const [dateOfBirth, setDateOfBirth] =
  useState("");

  const createPatient = async () => {
    await api.post("/patients/", {
      mrn,
      first_name: firstName,
      last_name: lastName,
      gender,
      date_of_birth: dateOfBirth,
    });

    router.push("/patients");
  };

  return (
  <AppShell>

    <div className="max-w-xl mx-auto">

      <div className="bg-white rounded-lg border p-6">

        <h1 className="text-2xl font-bold mb-6">
          New Patient
        </h1>

        <div className="space-y-4">

          <Input
            placeholder="MRN"
            onChange={(e) =>
              setMrn(e.target.value)
            }
          />

          <Input
            placeholder="First Name"
            onChange={(e) =>
              setFirstName(e.target.value)
            }
          />

          <Input
            placeholder="Last Name"
            onChange={(e) =>
              setLastName(e.target.value)
            }
          />

          <Input
            type="date"
            onChange={(e) =>
              setDateOfBirth(
                e.target.value
              )
            }
          />

          <select
            className="w-full border rounded-md p-2"
            aria-label="Gender"
            onChange={(e) =>
              setGender(
                e.target.value
              )
            }
          >
            <option value="">
              Select Gender
            </option>

            <option value="male">
              Male
            </option>

            <option value="female">
              Female
            </option>

            <option value="other">
              Other
            </option>

          </select>

          <Button
            variant="outline"
            className="w-full"
            onClick={createPatient}
          >
            Create Patient
          </Button>

          <Button
            variant="outline"
            onClick={() =>
            router.push("/patients")
            }
        >
            Cancel
        </Button>


        </div>

      </div>

    </div>

  </AppShell>
);
}