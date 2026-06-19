import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useFhirBundle() {
  return useQuery({
    queryKey: ["fhir"],

    queryFn: async () => {
      const response =
        await api.get(
          "/fhir/bundle/"
        );

      return response.data;
    },
  });
}