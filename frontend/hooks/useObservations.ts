import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useObservations(
  patientId?: string
) {
  return useQuery({
    queryKey: [
      "observations",
      patientId,
    ],

    queryFn: async () => {
      const url = patientId
        ? `/observations/?patient=${patientId}`
        : "/observations/";

      const response =
        await api.get(url);

      return response.data;
    },
  });
}