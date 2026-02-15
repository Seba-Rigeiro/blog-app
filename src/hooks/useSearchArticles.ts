"use client";

import { trpc } from "@/server/trpc/client";

export function useSearchArticles(input: {
  q: string;
  authorId?: string;
  limit?: number;
  cursor?: string;
}) {
  return trpc.search.articles.useQuery(
    {
      q: input.q,
      authorId: input.authorId,
      limit: input.limit ?? 10,
      cursor: input.cursor,
    },
    { enabled: input.q.length > 0 },
  );
}
