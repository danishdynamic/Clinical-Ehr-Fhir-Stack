import { useQuery } from
"@tanstack/react-query";

import { api } from "@/lib/api";

export function useObservations() {

  return useQuery({

    queryKey: ["observations"],

    queryFn: async () => {

      const response =
        await api.get(
          "/observations/"
        );

      return response.data;
    },
  });
}