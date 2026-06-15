import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function usePatients(id: string) {
  return useQuery({
    queryKey: ["patient", id],

    queryFn: async () => {
      const response = await api.get(
        `/patients/${id}/`
      );

      return response.data;
    },

    enabled: !!id,
  });
}