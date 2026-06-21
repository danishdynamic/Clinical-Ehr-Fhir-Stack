import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface DBClinicalRule {
  element_code: string;
  display_name: string;
  min_value: number | null;
  max_value: number | null;
  unit: string;
  alert_message_template: string;
  severity: "normal" | "warning" | "critical";
}

export function useClinicalRules() {
  return useQuery<DBClinicalRule[]>({
    queryKey: ["clinical-rules"],
    queryFn: async () => {
      // Points right to your new Django endpoint
      // (Assumes your Axios/fetch instance base URL already includes '/api')
      const response = await api.get("/clinical_rules/");
      return response.data;
    },
    staleTime: 1000 * 60 * 15, // Cache rules for 15 minutes to save network bandwidth
  });
}