"use client";

import { useSession } from "@/lib/auth-client";

/**
 * Hook que expone el usuario actual (y sesión).
 * Útil para mostrar nombre, email y para ownership checks.
 */
export function useCurrentUser() {
  const { data: session, isPending, error } = useSession();
  const user = session?.user ?? null;
  return {
    user,
    session,
    isPending,
    error,
    isAuthenticated: !!user,
  };
}
