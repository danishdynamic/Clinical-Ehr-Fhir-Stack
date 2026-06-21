import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// 1. Keep this here! Exporting it allows components to import it for prop types.
export interface Observation {
  id: number;
  patient: string;
  category: string;     // e.g., "vital-signs", "laboratory"
  code: string;         // e.g., "heart_rate", "blood_pressure"
  display_name: string; // e.g., "Heart Rate", "Body Temperature"
  value: string;        // e.g., "72", "120/80"
  unit: string;         // e.g., "bpm", "mmHg", "°C"
  issued_at: string;
}

// 2. Added the '?' back to patientId so it supports both global and specific patient charts
export function useObservations(patientId?: string) {
  return useQuery<Observation[]>({
    queryKey: ["observations", patientId],
    queryFn: async () => {
      const url = patientId 
        ? `/observations/?patient=${patientId}` 
        : "/observations/";
        
      const response = await api.get(url);
      return response.data;
    },
  });
}

export function useCreateObservation() {
  const queryClient = useQueryClient();

  return useMutation({
    // Using Omit<> here is brilliant—it correctly prevents passing backend-generated fields
    mutationFn: async (payload: Omit<Observation, "id" | "issued_at">) => {
      const response = await api.post("/compositions/", payload); // or /observations/ depending on backend endpoint
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidates the specific patient cache stream
      queryClient.invalidateQueries({ queryKey: ["observations", variables.patient] });
    },
  });
}