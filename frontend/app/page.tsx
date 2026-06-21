import Link from "next/link";
import { ArrowRight, ShieldCheck, Stethoscope } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f8fafc_0%,#eef4ff_45%,#f8fafc_100%)]">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <section className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col justify-center p-10 sm:p-14">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700">
                <ShieldCheck className="h-4 w-4" />
                Clinical Intelligence
              </div>

              <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
                Clinical EHR
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-7 text-slate-600">
                FHIR + openEHR healthcare platform for secure patient records,
                observations, and care coordination.
              </p>

              {/* ACTION CALL TO ACTION (CTA) REGION */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" className="h-11 w-full rounded-xl px-6 text-base">
                    Login
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                
                {/* Secondary Signup Option Route Link */}
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="h-11 w-full rounded-xl px-6 text-base border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  >
                    Register Account
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative hidden bg-slate-950 p-10 lg:flex lg:flex-col lg:justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_24%)]" />
              <div className="relative space-y-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                  <Stethoscope className="h-8 w-8 text-sky-200" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-300">
                    CareFlow
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-white">
                    Unified clinical data access
                  </h2>
                </div>
                <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>Patient records</span>
                    <span className="font-semibold text-white">24/7</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>FHIR exports</span>
                    <span className="font-semibold text-white">Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}