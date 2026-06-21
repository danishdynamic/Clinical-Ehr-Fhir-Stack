"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface TemplateField {
  id: string;
  name: string;
  type: "text" | "number" | "textarea" | "group";
  placeholder?: string;
}

const mockTemplate = {
  templateId: "general_encounter.v1",
  name: "General Patient Encounter",
  fields: [
    { id: "subjective", name: "Chief Complaint", type: "text", placeholder: "Reason for visit..." },
    { id: "assessment", name: "Clinical Assessment", type: "textarea", placeholder: "Diagnosis details..." }
  ] as TemplateField[]
};

export function CreateCompositionDialog({ patientId }: { patientId: string }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Record<string, any>>({});

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await api.post("/compositions/", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compositions", patientId] });
      setFormData({});
    }
  });

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const compositionPayload = {
      patient: patientId,
      template_id: mockTemplate.templateId,
      archetype_id: "openEHR-EHR-COMPOSITION.encounter.v1",
      content: formData,
    };
    mutation.mutate(compositionPayload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="text-sm font-bold text-zinc-900">{mockTemplate.name}</h3>
        <p className="text-[11px] text-zinc-400">Schema: {mockTemplate.templateId}</p>
      </div>

      <div className="space-y-3">
        {mockTemplate.fields.map((field) => (
          <div key={field.id} className="space-y-1">
            <label className="text-xs font-medium text-zinc-600">{field.name}</label>
            {field.type === "textarea" ? (
              <textarea
                className="w-full rounded-md border border-zinc-200 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900 text-zinc-800"
                placeholder={field.placeholder}
                value={formData[field.id] || ""}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                rows={3}
              />
            ) : (
              <Input
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.id] || ""}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className="h-8 text-xs border-zinc-200 text-zinc-800 focus-visible:ring-zinc-900"
              />
            )}
          </div>
        ))}
      </div>

      <Button 
        type="submit" 
        disabled={mutation.isPending}
        className="w-full h-8 bg-zinc-950 text-zinc-50 hover:bg-zinc-800 text-xs font-semibold"
      >
        {mutation.isPending ? "Committing..." : "Commit Document"}
      </Button>
    </form>
  );
}