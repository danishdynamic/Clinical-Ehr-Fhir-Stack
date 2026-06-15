import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useCompositions() {
  return useQuery({
    queryKey: ["compositions"],

    queryFn: async () => {
      const response = await api.get(
        "/compositions/"
      );

      return response.data;
    },
  });
}