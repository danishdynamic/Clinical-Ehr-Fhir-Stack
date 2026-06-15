import Link from "next/link";

export function Sidebar() {
  return (
    <div className="w-64 p-4 border-r">
      <nav className="space-y-4">

        <Link href="/dashboard">
          Dashboard
        </Link>

        <Link href="/patients">
          Patients
        </Link>

        <Link href="/observations">
          Observations
        </Link>

        <Link href="/compositions">
          Compositions
        </Link>

        <Link href="/audit-logs">
          Audit Logs
        </Link>

        <Link href="/fhir">
          FHIR Viewer
        </Link>

      </nav>
    </div>
  );
}