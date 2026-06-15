import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useAuditLogs() {
  return useQuery({
    queryKey: ["audit"],

    queryFn: async () => {
      const response = await api.get(
        "/audit-logs/"
      );

      return response.data;
    },
  });
}