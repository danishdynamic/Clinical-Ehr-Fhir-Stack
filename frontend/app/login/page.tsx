"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

    localStorage.setItem(
      "refresh",
      response.data.refresh
    );

    router.push("/dashboard");
  };

 return (
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
  );
}