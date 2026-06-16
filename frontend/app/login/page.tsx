"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async () => {
    const response = await api.post(
      "/auth/login/",
      {
        username,
        password,
      }
    );

    localStorage.setItem(
      "access",
      response.data.access
    );

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">

      <Card className="w-105">

        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Clinical EHR Login
          </CardTitle>
        </CardHeader>

        <CardContent>

          <div className="space-y-4">

            <Input
              placeholder="Username"
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />

            <Input
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <Button
              className="w-full"
              onClick={handleLogin}
            >
              Login
            </Button>

          </div>

        </CardContent>

      </Card>

    </div>
  );
}