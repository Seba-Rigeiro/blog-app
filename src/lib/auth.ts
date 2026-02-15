/**
 * Instancia de BetterAuth (servidor).
 * Conexión MongoDB lazy para compatibilidad con serverless.
 */

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getMongoClient } from "@/db";
import { nextCookies } from "better-auth/next-js";

const DB_NAME = "blog-app";

let cachedAuth: ReturnType<typeof betterAuth> | null = null;

export async function getAuth() {
  if (cachedAuth) return cachedAuth;

  const client = await getMongoClient();
  const db = client.db(DB_NAME);

  // Sin { client } se desactivan transacciones → compatible con MongoDB standalone (localhost).
  // Si usas replica set o Atlas, puedes pasar { client } para habilitar transacciones.
  cachedAuth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: { enabled: true },
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL:
      process.env.BETTER_AUTH_BASE_URL ??
      process.env.BETTER_AUTH_URL ??
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000",
    trustedOrigins: [
      process.env.NEXT_PUBLIC_APP_URL,
      process.env.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
    ].filter((o): o is string => Boolean(o)),
    user: {
      additionalFields: {
        firstName: { type: "string", required: true },
        lastName: { type: "string", required: true },
      },
    },
    plugins: [nextCookies()],
  });

  return cachedAuth;
}
