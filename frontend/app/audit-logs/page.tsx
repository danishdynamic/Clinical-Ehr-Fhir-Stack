"use client";

import { AppShell }
from "@/components/layout/AppShell";

import {
  useAuditLogs
} from "@/hooks/useAuditLogs";

export default function AuditPage() {

  const { data } =
    useAuditLogs();

  return (
    <AppShell>

      <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>

      {data?.map((log: any) => (

        <div key={log.id} className="border p-3 mb-2 rounded">

          <p>
            {log.action}
          </p>

          <p>
            {log.resource_type}
          </p>

          <p>
            {log.created_at}
          </p>

        </div>

      ))}

    </AppShell>
  );
}