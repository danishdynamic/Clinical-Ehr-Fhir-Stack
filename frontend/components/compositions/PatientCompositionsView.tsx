"use client";

import { useCompositions } from "@/hooks/useCompositions";
import { CreateCompositionDialog } from "./CreateCompositionDialog";

export function PatientCompositionsView({ patientId }: { patientId: string }) {
  const { data: compositions, isLoading } = useCompositions(patientId);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* LEFT COLUMN: Cleanly Nested Form Engine */}
      <div className="md:col-span-1">
        <CreateCompositionDialog patientId={patientId} />
      </div>

      {/* RIGHT COLUMN: Scannable OpenEHR Composition Log */}
      <div className="md:col-span-2 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Compositions Registry</h3>
        
        {isLoading ? (
          <p className="text-xs text-zinc-500">Loading electronic health record tree...</p>
        ) : !compositions || compositions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center">
            <p className="text-xs text-zinc-500 font-medium">No openEHR compositions committed yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {compositions.map((comp: any) => (
              <div key={comp.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm space-y-2">
                <div className="flex justify-between items-start border-b border-zinc-100 pb-2">
                  <div>
                    <span className="inline-block bg-zinc-100 text-zinc-800 text-[10px] font-mono px-1.5 py-0.5 rounded">
                      {comp.template_id}
                    </span>
                    <p className="text-[11px] text-zinc-400 mt-1">Recorded by: {comp.composer_name || "System"}</p>
                  </div>
                  <span className="text-[10px] text-zinc-400">
                    {new Date(comp.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Dynamic Content Node Extraction */}
                <div className="space-y-1.5 pt-1">
                  {Object.entries(comp.content || {}).map(([key, value]) => (
                    <div key={key} className="text-xs">
                      <span className="font-semibold text-zinc-500 capitalize">{key}: </span>
                      <span className="text-zinc-800 font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}