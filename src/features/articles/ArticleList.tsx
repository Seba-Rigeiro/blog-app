"use client";

import { Loading, Pagination } from "@/components/ui";
import { ArticleListItem } from "./ArticleListItem";

export type ArticleListItemData = {
  id: string;
  title: string;
  createdAt: Date | string;
  authorName?: string;
};

const PAGE_SIZE_OPTIONS = [5, 10, 20] as const;

type ArticleListProps = {
  items: ArticleListItemData[];
  isLoading?: boolean;
  /** Error con al menos .message (Error o TRPCClientError) */
  error?: { message: string } | null;
  emptyMessage?: string;
  pageSize: number;
  currentCursor: number;
  totalCount?: number;
  nextCursor?: string | null;
  onNextPage?: (cursor: string) => void;
  onPrevPage?: () => void;
  onFirstPage?: () => void;
  onPageSizeChange?: (size: number) => void;
};

export function ArticleList({
  items,
  isLoading,
  error,
  emptyMessage = "No hay artículos.",
  pageSize,
  currentCursor,
  totalCount,
  nextCursor,
  onNextPage,
  onPrevPage,
  onPageSizeChange,
}: ArticleListProps) {
  if (isLoading) return <Loading />;
  if (error) {
    return (
      <p className="text-red-600" role="alert">
        Error al cargar. {error.message}
      </p>
    );
  }
  if (!items.length) return <p className="text-gray-500">{emptyMessage}</p>;

  const currentPage = Math.floor(currentCursor / pageSize) + 1;
  const totalPages =
    totalCount != null ? Math.ceil(totalCount / pageSize) : null;
  const hasPrev = currentCursor > 0;
  const hasNext = nextCursor != null && !!onNextPage;

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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        hasPrev={hasPrev}
        hasNext={hasNext}
        onPrevPage={() => hasPrev && onPrevPage?.()}
        onNextPage={() => nextCursor != null && onNextPage?.(nextCursor)}
        onPageSizeChange={onPageSizeChange}
      />
    </>
  );
}
