"use client";

import { AppShell }
from "@/components/layout/AppShell";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useDashboard } from "@/hooks/useDashboard";

export default function Dashboard() {
  const { data: dashboardData, isLoading } = useDashboard();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AppShell>

      <h1 className="text-3xl font-bold mb-6">
        Clinical EHR Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <Card>
          <CardHeader>
            <CardTitle>
              Patients
            </CardTitle>
          </CardHeader>

          <CardContent>
            {dashboardData?.patients || 0}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Observations
            </CardTitle>
          </CardHeader>

          <CardContent>
            {dashboardData?.observations || 0}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Audit Logs
            </CardTitle>
          </CardHeader>

          <CardContent>
            {dashboardData?.audit_logs || 0}
          </CardContent>
        </Card>

      </div>

    </AppShell>
  );
}