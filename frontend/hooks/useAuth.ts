// useAuth.ts
"use client";

export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: "ADMIN" | "DOCTOR" | "NURSE" | "AUDITOR" | "INSURER";
}

export function useAuth() {
  // Prevent SSR execution crashes in Next.js
  if (typeof window === "undefined") {
    return {
      isAuthenticated: false,
      user: null,
    };
  }

  const token = localStorage.getItem("access");
  const userString = localStorage.getItem("user");

  let user: AuthUser | null = null;

  if (userString) {
    try {
      user = JSON.parse(userString) as AuthUser;
    } catch (error) {
      console.error("Failed to parse authenticated session user structure:", error);
    }
  }

  return {
    isAuthenticated: !!token,
    user, 
  };
}