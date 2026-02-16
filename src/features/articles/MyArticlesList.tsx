"use client";

import { useState } from "react";
import { useMyArticles } from "@/hooks";
import { ArticleList } from "./ArticleList";

const DEFAULT_PAGE_SIZE = 10;

export function MyArticlesList() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const { data, isLoading, error } = useMyArticles(pageSize, cursor);

  const currentCursor = cursor ? parseInt(cursor, 10) : 0;
  const handlePrevPage = () => {
    const prevSkip = currentCursor - pageSize;
    setCursor(prevSkip > 0 ? String(prevSkip) : undefined);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCursor(undefined);
  };

  return (
    <ArticleList
      items={data?.items ?? []}
      isLoading={isLoading}
      error={error ? { message: error.message } : null}
      emptyMessage="Aún no tienes artículos. Crea uno desde el menú."
      pageSize={pageSize}
      currentCursor={currentCursor}
      totalCount={data?.totalCount}
      nextCursor={data?.nextCursor ?? null}
      onNextPage={(next) => setCursor(next)}
      onPrevPage={handlePrevPage}
      onFirstPage={cursor ? () => setCursor(undefined) : undefined}
      onPageSizeChange={handlePageSizeChange}
    />
  );
}
