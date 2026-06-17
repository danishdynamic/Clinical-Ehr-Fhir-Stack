import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";

export function useCreateObservation() {
  return useMutation({
    mutationFn: async (data: any) => {

      const response =
        await api.post(
          "/observations/",
          data,
        );

      return response.data;
    },
  });
}