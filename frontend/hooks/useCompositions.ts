import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface CompositionPayload {
  patient: string;
  archetype_id: string;
  template_id: string;
  content: Record<string, any>;
}

// Hook 1: Fetch compositions for a specific patient
export function useCompositions(patientId: string) {
  return useQuery({
    queryKey: ["compositions", patientId],
    queryFn: async () => {
      const response = await api.get(`/compositions/?patient=${patientId}`);
      return response.data;
    },
  });
}

// Hook 2: Create a new composition record
export function useCreateComposition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CompositionPayload) => {
      const response = await api.post("/compositions/", payload);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Refresh the query list cache automatically on success
      queryClient.invalidateQueries({ queryKey: ["compositions", variables.patient] });
    },
  });
}