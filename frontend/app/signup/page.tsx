"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "PATIENT",
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/users/signup/", formData);
      router.push("/login");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.username?.[0] || "Registration verification rejected.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-6">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-xl border border-zinc-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-zinc-950">Identity Registry</h1>
          <p className="text-xs text-zinc-500">Create your clinical ecosystem account profile</p>
        </div>

        {error && (
          <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-600 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {/* Linked using htmlFor + id */}
            <label htmlFor="username-input" className="block text-xs font-semibold text-zinc-700 mb-1">
              Username
            </label>
            <input
              id="username-input"
              type="text"
              name="username"
              required
              className="w-full p-2 border border-zinc-300 rounded text-sm focus:outline-none focus:border-zinc-950"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="email-input" className="block text-xs font-semibold text-zinc-700 mb-1">
              Email Address
            </label>
            <input
              id="email-input"
              type="email"
              name="email"
              required
              className="w-full p-2 border border-zinc-300 rounded text-sm focus:outline-none focus:border-zinc-950"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="password-input" className="block text-xs font-semibold text-zinc-700 mb-1">
              Password
            </label>
            <input
              id="password-input"
              type="password"
              name="password"
              required
              className="w-full p-2 border border-zinc-300 rounded text-sm focus:outline-none focus:border-zinc-950"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="role-select" className="block text-xs font-semibold text-zinc-700 mb-1">
              Assigned Domain Role
            </label>
            <select
              id="role-select"
              name="role"
              className="w-full p-2 border border-zinc-300 rounded bg-white text-sm focus:outline-none focus:border-zinc-950"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
              <option value="NURSE">Nurse</option>
              <option value="AUDITOR">Auditor</option>
              <option value="INSURER">Insurance Adjudicator</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-zinc-950 text-white font-medium text-sm hover:bg-zinc-900 transition-colors disabled:opacity-50"
          >
            {loading ? "Registering Record..." : "Complete Registration"}
          </Button>
        </form>

        <p className="text-center text-xs text-zinc-500">
          Already verified?{" "}
          <Link href="/login" className="text-zinc-950 underline font-medium">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}