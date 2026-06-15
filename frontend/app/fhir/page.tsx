"use client";

import { useState } from "react";

import { api } from "@/lib/api";

export default function FHIRPage() {

  const [bundle, setBundle] =
    useState<any>(null);

  const loadBundle =
    async () => {

      const response =
        await api.get(
          "/fhir/patient/1/bundle/"
        );

      setBundle(
        response.data
      );
    };

  return (
    <div>

      <button
        onClick={loadBundle}
      >
        Load Bundle
      </button>

      <pre>
        {JSON.stringify(
          bundle,
          null,
          2
        )}
      </pre>

    </div>
  );
}