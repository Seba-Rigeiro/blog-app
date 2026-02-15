/**
 * Schema Zod para búsqueda server-side.
 */

import { z } from "zod";
import { paginationInputSchema } from "./pagination";

export const searchArticlesSchema = paginationInputSchema.extend({
  q: z.string().min(1, "Texto de búsqueda requerido").max(200),
  authorId: z.string().optional(),
});

export type SearchArticlesInput = z.infer<typeof searchArticlesSchema>;
