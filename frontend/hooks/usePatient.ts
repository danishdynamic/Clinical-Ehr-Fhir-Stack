import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function usePatient(id: string) {
  return useQuery({
    queryKey: ["patient", id],

    queryFn: async () => {
      const response =
        await api.get(
          `/patients/${id}/`
        );

      return response.data;
    },
  });
}