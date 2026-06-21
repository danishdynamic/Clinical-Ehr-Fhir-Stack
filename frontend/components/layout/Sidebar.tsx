"use client";

import Link from "next/link";
import { useRouter } from "next/navigation"; // 1. Import router for routing after logout
import { useAuth } from "@/hooks/useAuth";
import { LogOut, LayoutDashboard, Users, Activity, FileText, ShieldAlert } from "lucide-react"; // Optional UI icons

const allNavigation = [
  { name: "Dashboard", href: "/dashboard", roles: ["ADMIN", "DOCTOR", "NURSE", "AUDITOR", "INSURER"] },
  { name: "Patients", href: "/patients", roles: ["ADMIN", "DOCTOR", "NURSE", "INSURER"] },
  { name: "Observations", href: "/observations", roles: ["ADMIN", "DOCTOR", "NURSE"] }, 
  { name: "Compositions", href: "/compositions", roles: ["ADMIN", "DOCTOR", "NURSE"] }, // 2. Added Compositions link!
  { name: "Audit Logs", href: "/audit-logs", roles: ["ADMIN", "AUDITOR"] },               
];

export function Sidebar() {
  const { user } = useAuth();
  const router = useRouter();

  const allowedNav = allNavigation.filter(item => {
    const userRole = user?.role?.toUpperCase() || "";
    
    // Superuser admin bypass gets everything automatically
    if (userRole === "ADMIN") return true;
    
    return item.roles.includes(userRole);
  });

  // 3. Clear auth data from client memory on logout execution
  const handleLogout = () => {
    localStorage.clear(); // Wipes access token and user role profile payload cleanly
    router.push("/login"); // Redirects back to login gate
  };

  return (
    <aside className="w-64 border-r border-slate-200 bg-slate-50 p-4 h-screen flex flex-col justify-between">
      {/* Top Navigation Block */}
      <div className="space-y-1">
        <div className="px-3 py-2 mb-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Navigation</p>
        </div>
        
        {allowedNav.length > 0 ? (
          allowedNav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/60 hover:text-slate-900 transition"
            >
              {item.name}
            </Link>
          ))
        ) : (
          <p className="text-xs text-slate-400 p-3 italic">
            No active roles mapped.
          </p>
        )}
      </div>

      {/* 4. Bottom Logout Button Anchor Block */}
      <div className="border-t border-slate-200 pt-4">
        <div className="px-3 py-1 mb-2">
          <p className="text-[11px] font-medium text-slate-400 truncate">
            Logged in as:{" "}
            <span className="font-semibold text-slate-600">
              {user?.first_name 
                ? `${user.first_name} ${user.last_name}` 
                : user?.email || "Staff"}
            </span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50/80 transition"
        >
          <LogOut className="h-4 w-4 shrink-0 text-rose-500" />
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
}