/**
 * Router raíz tRPC.
 * Agrupa auth, article, user, search.
 */

import { ensureIndexes, getMongoClient } from "@/db";
import { publicProcedure, router } from "../init";
import { authRouter } from "./authRouter";
import { articleRouter } from "./articleRouter";
import { userRouter } from "./userRouter";
import { searchRouter } from "./searchRouter";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => ({ ok: true })),

  dbPing: publicProcedure.query(async () => {
    const client = await getMongoClient();
    await client.db("blog-app").command({ ping: 1 });
    await ensureIndexes();
    return { ok: true } as const;
  }),

  auth: authRouter,
  article: articleRouter,
  user: userRouter,
  search: searchRouter,
});

export type AppRouter = typeof appRouter;
