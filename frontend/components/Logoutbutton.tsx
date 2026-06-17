"use client";

import { useRouter }
from "next/navigation";

export function LogoutButton() {

  const router =
    useRouter();

  const logout = () => {

    localStorage.removeItem(
      "access"
    );

    localStorage.removeItem(
      "refresh"
    );

    router.push("/login");
  };

  return (
    <button
      onClick={logout}
    >
      Logout
    </button>
  );
}