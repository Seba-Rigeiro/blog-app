"use client";

import {
  signIn as authSignIn,
  signOut as authSignOut,
  signUp as authSignUp,
  useSession,
} from "@/lib/auth-client";
import type { LoginInput, RegisterInput } from "@/schemas/auth";

/**
 * Hook de autenticación: sesión, login, registro y logout.
 */
export function useAuth() {
  const session = useSession();

  const signIn = async (input: LoginInput, callbackURL?: string) => {
    const result = await authSignIn.email({
      email: input.email,
      password: input.password,
      callbackURL: callbackURL ?? "/",
    });
    return result;
  };

  const signUp = async (input: RegisterInput, callbackURL?: string) => {
    const result = await authSignUp.email({
      email: input.email,
      password: input.password,
      name: `${input.firstName} ${input.lastName}`,
      callbackURL: callbackURL ?? "/",
      // Better Auth API acepta additionalFields; el tipo del cliente no los expone
      ...({ firstName: input.firstName, lastName: input.lastName } as Record<
        string,
        string
      >),
    });
    return result;
  };

  const signOut = async (callbackURL?: string) => {
    await authSignOut({
      fetchOptions: {
        onSuccess: () => {
          if (callbackURL && typeof window !== "undefined") {
            window.location.href = callbackURL;
          }
        },
      },
    });
  };

  return {
    ...session,
    signIn,
    signOut,
    signUp,
  };
}
