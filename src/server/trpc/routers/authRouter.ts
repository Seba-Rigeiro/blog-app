/**
 * authRouter: sesión actual (desde context).
 */

import { publicProcedure, router } from "../init";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => ({ session: ctx.session })),
});
