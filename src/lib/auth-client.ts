/**
 * Cliente Better Auth para React.
 * Usado en hooks useAuth / useCurrentUser.
 */

import { createAuthClient } from "better-auth/react";

function getBaseUrl(): string {
  if (typeof window !== "undefined") return "";
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
