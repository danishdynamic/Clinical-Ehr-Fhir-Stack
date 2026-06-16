import { AppShell }
from "@/components/layout/AppShell";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Dashboard() {
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
            0
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Observations
            </CardTitle>
          </CardHeader>

          <CardContent>
            0
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Audit Logs
            </CardTitle>
          </CardHeader>

          <CardContent>
            0
          </CardContent>
        </Card>

      </div>

    </AppShell>
  );
}