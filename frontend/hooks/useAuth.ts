export function useAuth() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access")
      : null;

  return {
    isAuthenticated: !!token,
  };
}