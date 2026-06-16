import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">

      <div className="text-center max-w-2xl">

        <h1 className="text-5xl font-bold mb-4">
          Clinical EHR
        </h1>

        <p className="text-lg text-slate-600 mb-8">
          FHIR + openEHR Healthcare Platform
        </p>

        <div className="flex gap-4 justify-center">

          <Link href="/login">
            <Button size="lg">
              Login
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button
              variant="outline"
              size="lg"
            >
              Dashboard
            </Button>
          </Link>

        </div>

      </div>

    </main>
  );
}