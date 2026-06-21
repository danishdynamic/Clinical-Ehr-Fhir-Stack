"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppShell } from "@/components/layout/AppShell";
import { useAuditLogs } from "@/hooks/useAuditLogs";

interface AuditLog {
  id: number;
  user?: string;
  action: string;
  resource_type?: string;
  resource_id?: string | number;
  timestamp?: string;
  created_at?: string;
}

export default function AuditPage() {
  const { data, isLoading } = useAuditLogs();

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-sky-600">Security</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">
            Audit Logs
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-slate-500">Loading audit traces...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.map((log: AuditLog) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium text-slate-900">
                        {log.user || "System"}
                      </TableCell>
                      <TableCell>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          {log.action}
                        </span>
                      </TableCell>
                      <TableCell>
                        {log.resource_type}#{log.resource_id}
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {log.timestamp || log.created_at
                          ? formatDate((log.timestamp || log.created_at) as string)
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}