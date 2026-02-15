/**
 * Schemas Zod para artículos.
 * Reutilizados en tRPC (input) y frontend (formularios).
 */

import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string().min(1, "Título requerido").max(200),
  content: z.string().min(1, "Contenido requerido"),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export const updateArticleSchema = createArticleSchema.partial();

export const getArticleByIdSchema = z.object({
  id: z.string().min(1, "ID requerido"),
});

export const deleteArticleSchema = z.object({
  id: z.string().min(1, "ID requerido"),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
export type GetArticleByIdInput = z.infer<typeof getArticleByIdSchema>;
export type DeleteArticleInput = z.infer<typeof deleteArticleSchema>;
