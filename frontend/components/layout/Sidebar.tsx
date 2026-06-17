import Link from "next/link";

import {
  Home,
  Users,
  Activity,
  FileText,
  Shield,
} from "lucide-react";
import { LogoutButton } from "../Logoutbutton";

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-white p-6">

      <h2 className="font-bold text-xl mb-8">
        Clinical EHR
      </h2>

      <nav className="space-y-4">

        <Link
          href="/dashboard"
          className="flex gap-2"
        >
          <Home size={18} />
          Dashboard
        </Link>

        <Link
          href="/patients"
          className="flex gap-2"
        >
          <Users size={18} />
          Patients
        </Link>

        <Link
          href="/observations"
          className="flex gap-2"
        >
          <Activity size={18} />
          Observations
        </Link>

        <Link
          href="/compositions"
          className="flex gap-2"
        >
          <FileText size={18} />
          Compositions
        </Link>

        <Link
          href="/audit-logs"
          className="flex gap-2"
        >
          <Shield size={18} />
          Audit Logs
        </Link>
       <LogoutButton />
      </nav>
    </aside>
  );
}