/**
 * Schema compartido para paginación (cursor o offset).
 * Reutilizado en tRPC y frontend.
 */

import { z } from "zod";

const defaultLimit = 10;
const maxLimit = 50;

export const paginationInputSchema = z.object({
  limit: z.coerce.number().int().min(1).max(maxLimit).default(defaultLimit),
  cursor: z.string().optional(),
});

export type PaginationInput = z.infer<typeof paginationInputSchema>;

export function getSkipTake(input: PaginationInput): {
  skip: number;
  take: number;
} {
  const take = input.limit;
  const skip = input.cursor ? parseInt(input.cursor, 10) : 0;
  return { skip: Number.isNaN(skip) ? 0 : skip, take };
}
