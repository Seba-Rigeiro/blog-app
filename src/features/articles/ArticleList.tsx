"use client";

import { ArticleListItem } from "./ArticleListItem";

export type ArticleListItemData = {
  id: string;
  title: string;
  createdAt: Date | string;
  authorName?: string;
};

type ArticleListProps = {
  items: ArticleListItemData[];
  isLoading?: boolean;
  /** Error con al menos .message (Error o TRPCClientError) */
  error?: { message: string } | null;
  emptyMessage?: string;
  nextCursor?: string | null;
  onNextPage?: (cursor: string) => void;
  onFirstPage?: () => void;
};

export function ArticleList({
  items,
  isLoading,
  error,
  emptyMessage = "No hay artículos.",
  nextCursor,
  onNextPage,
  onFirstPage,
}: ArticleListProps) {
  if (isLoading) return <p className="text-gray-500">Cargando…</p>;
  if (error) {
    return (
      <p className="text-red-600" role="alert">
        Error al cargar. {error.message}
      </p>
    );
  }
  if (!items.length) return <p className="text-gray-500">{emptyMessage}</p>;

  return (
    <>
      <ul className="space-y-3">
        {items.map((a) => (
          <ArticleListItem
            key={a.id}
            id={a.id}
            title={a.title}
            createdAt={a.createdAt}
            author={a.authorName}
          />
        ))}
      </ul>
      {(nextCursor != null || onFirstPage) && (
        <div className="flex gap-2">
          {onFirstPage && (
            <button
              type="button"
              onClick={onFirstPage}
              className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Primera página
            </button>
          )}
          {nextCursor != null && onNextPage && (
            <button
              type="button"
              onClick={() => onNextPage(nextCursor)}
              className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Siguiente
            </button>
          )}
        </div>
      )}
    </>
  );
}
