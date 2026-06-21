"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  FileText,
  Home,
  Shield,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { LogoutButton } from "../Logoutbutton";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/patients",
    label: "Patients",
    icon: Users,
  },
  {
    href: "/observations",
    label: "Observations",
    icon: Activity,
  },
  {
    href: "/compositions",
    label: "Compositions",
    icon: FileText,
  },
  {
    href: "/audit-logs",
    label: "Audit Logs",
    icon: Shield,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 border-r border-slate-200 bg-white/80 p-6 backdrop-blur md:block">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
          CE
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Platform
          </p>
          <h2 className="text-lg font-semibold text-slate-900">
            Clinical EHR
          </h2>
        </div>
      </div>

      <nav className="space-y-1.5">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}

        <div className="pt-4">
          <LogoutButton />
        </div>
      </nav>
    </aside>
  );
}