import { useQuery } from
"@tanstack/react-query";

import { api } from "@/lib/api";

export function useObservations(patientId: string) {

  return useQuery({

    queryKey: ["observations", patientId],

    queryFn: async () => {

      const response =
        await api.get(
          `/observations/?patient=${patientId}`
        );

      return response.data;
    },
  });
}