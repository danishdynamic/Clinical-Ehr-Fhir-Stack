import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useFhirBundle(patientId?: string) {
  return useQuery({
    queryKey: ["fhir", patientId],

    queryFn: async () => {
      if (!patientId) {
        throw new Error(
          "Patient ID is required"
        );
      }

      const response =
        await api.get(
          `/fhir/patient/${patientId}/bundle/`
        );

      return response.data;
    },

    enabled: !!patientId,
  });
}