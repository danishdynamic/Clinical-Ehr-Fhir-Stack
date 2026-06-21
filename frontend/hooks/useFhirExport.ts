import { useCallback, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function useFhirExport(
  patientId: string | number | undefined, 
  mrn: string | undefined, 
  lastName: string | undefined
) {
  const [isExporting, setIsExporting] = useState(false);

  const exportRecord = useCallback(async () => {
    if (!patientId || !mrn || !lastName) {
      toast.error("Cannot export: Patient records are still compiling.");
      return;
    }

    setIsExporting(true);
    
    try {
      // --- LIVE DATA PATH ALIGNED TO YOUR DJANGO VIEW MATRIX ---
      const response = await api.get(`/fhir/patient/${patientId}/bundle/`, {
        responseType: "blob", 
      });

      const blob = new Blob([response.data], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `fhir_record_${lastName.toLowerCase()}_mrn_${mrn}.json`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Universal FHIR bundle downloaded successfully.");
    } catch (error) {
      console.error("FHIR serialization fetch failed:", error);
      toast.error("Interoperability Engine Error", {
        description: "Could not safely retrieve standardized FHIR schema from server.",
      });
    } finally {
      setIsExporting(false);
    }
  }, [patientId, mrn, lastName]);

  return { exportRecord, isExporting };
}