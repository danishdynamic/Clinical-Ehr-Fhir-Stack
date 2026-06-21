"use client";

import { Lock } from "lucide-react"; // Added for clear visualization of restrictions
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
  // 1. Extracted 'error' from your custom data fetching hook
  const { data, isLoading, error } = useAuditLogs();

  // 2. Safely parse if the network payload returned a 403 Forbidden status
  const isForbidden = 
    (error as any)?.response?.status === 403 || 
    (error as any)?.status === 403;

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

        {/* 3. Conditional Branch: Render Access Restriction Message if 403 hits */}
        {isForbidden ? (
          <Card className="border-amber-200 bg-amber-50/20">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mb-4">
                <Lock className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Access Restriction Enforced
              </CardTitle>
              <p className="mt-2 max-w-sm text-sm text-slate-600 leading-relaxed">
                Your account domain role lacks administrative clearance to inspect system ledger mutation trails.
              </p>
              <div className="mt-4 rounded-lg bg-white border border-amber-200 px-3 py-1 text-xs font-mono text-amber-700 shadow-2xs">
                Error Code: 403 Forbidden (RBAC Guard)
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Standard Audit Data View */
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
        )}
      </div>
    </AppShell>
  );
}