"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    router.push("/login");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={logout}
      className="w-full justify-start gap-2 rounded-xl px-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}