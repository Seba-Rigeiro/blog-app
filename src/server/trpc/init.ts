/**
 * Inicialización de tRPC.
 * Context con sesión (Better Auth), procedimientos públicos y protegidos.
 */

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { getAuth } from "@/lib/auth";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: opts.headers });
  return {
    headers: opts.headers,
    session,
    auth,
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

/** Requiere sesión; expone ctx.session. */
const enforceAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "No autenticado" });
  }
  return next({
    ctx: { ...ctx, session: ctx.session },
  });
});

export const protectedProcedure = t.procedure.use(enforceAuth);
