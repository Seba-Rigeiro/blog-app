"use client";

import { trpc } from "@/server/trpc/client";

export type ArticleMutationErrorHandler = (err: Error) => void;

const defaultLimit = 10;

/** Cache 2 min para no refetchear al volver del detalle al listado. */
const LIST_STALE_MS = 2 * 60 * 1000;

export function useArticles(limit: number = defaultLimit, cursor?: string) {
  return trpc.article.list.useQuery(
    { limit, cursor },
    {
      staleTime: LIST_STALE_MS,
      refetchOnMount: false, // no refetch al volver del detalle; tras eliminar se hace prefetch en onSuccess
    },
  );
}

/** Cache 2 min para evitar refetch al volver al mismo artículo (Strict Mode + navegación). */
const ARTICLE_DETAIL_STALE_MS = 2 * 60 * 1000;

export function useArticleById(id: string | null) {
  return trpc.article.getById.useQuery(
    { id: id ?? "" },
    {
      enabled: !!id,
      staleTime: ARTICLE_DETAIL_STALE_MS,
      refetchOnMount: false, // usar caché al reabrir el mismo artículo
    },
  );
}

export function useCreateArticle(options?: {
  onError?: ArticleMutationErrorHandler;
}) {
  const utils = trpc.useUtils();
  return trpc.article.create.useMutation({
    onSuccess: async () => {
      await utils.article.list.invalidate();
      await utils.article.list.prefetch({
        limit: defaultLimit,
        cursor: undefined,
      });
      void utils.user.getAuthorsWithArticleCount.invalidate();
    },
    onError: options?.onError,
  });
}

export function useUpdateArticle(options?: {
  onError?: ArticleMutationErrorHandler;
}) {
  const utils = trpc.useUtils();
  return trpc.article.update.useMutation({
    onSuccess: () => {
      void utils.article.list.invalidate();
      void utils.article.getById.invalidate();
      void utils.user.getAuthorsWithArticleCount.invalidate();
    },
    onError: options?.onError,
  });
}

export function useDeleteArticle(options?: {
  onError?: ArticleMutationErrorHandler;
}) {
  const utils = trpc.useUtils();
  return trpc.article.delete.useMutation({
    onSuccess: async () => {
      await utils.article.list.invalidate();
      await utils.article.list.prefetch({
        limit: defaultLimit,
        cursor: undefined,
      });
      void utils.article.listByAuthor.invalidate();
      void utils.user.getAuthorsWithArticleCount.invalidate();
    },
    onError: options?.onError,
  });
}

export function useMyArticles(limit: number = defaultLimit, cursor?: string) {
  return trpc.article.listByAuthor.useQuery({
    limit,
    cursor,
  });
}
