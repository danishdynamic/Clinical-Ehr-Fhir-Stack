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

      <h1>Audit Logs</h1>

      {data?.map((log: any) => (

        <div key={log.id}>

          {log.action}
          {" - "}
          {log.resource_type}

        </div>

      ))}

    </AppShell>
  );
}