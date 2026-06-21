"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Stethoscope } from "lucide-react";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setIsSubmitting(true);

    try {
      const response = await api.post("/auth/login/", {
        username,
        password,
      });

      localStorage.setItem("access", response.data.access);
      router.push("/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f8fafc_0%,#eef4ff_45%,#f8fafc_100%)]`">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_22%)]" />
            <div className="relative space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold tracking-[0.24em] text-slate-300 uppercase">
                  CareFlow
                </span>
              </div>
              <div className="max-w-sm space-y-3">
                <p className="text-sm text-sky-200">Clinical operations</p>
                <h1 className="text-4xl font-semibold leading-tight">
                  Better visibility for every patient journey.
                </h1>
              </div>
            </div>
            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15">
                  <Stethoscope className="h-5 w-5 text-sky-200" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Today’s overview</p>
                  <p className="text-2xl font-semibold">128 patients</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-8 sm:p-10">
            <div className="w-full max-w-md space-y-6">
              <div className="space-y-2 text-center lg:text-left">
                <p className="text-sm font-medium text-sky-600">Welcome back</p>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                  Sign in to your account
                </h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium text-slate-700">
                    Username
                  </label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-sky-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-sky-500"
                  />
                </div>

                <Button
                  className="h-11 w-full rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                  onClick={handleLogin}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </div>

              <p className="text-center text-sm text-slate-500">
                Secure access to patient records and clinical insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}