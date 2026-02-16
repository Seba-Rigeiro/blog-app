"use client";

import { useState } from "react";
import { useMyArticles } from "@/hooks";
import { ArticleList } from "./ArticleList";

export function MyArticlesList() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const { data, isLoading, error } = useMyArticles(cursor);

  return (
    <ArticleList
      items={data?.items ?? []}
      isLoading={isLoading}
      error={error ? { message: error.message } : null}
      emptyMessage="Aún no tienes artículos. Crea uno desde el menú."
      nextCursor={data?.nextCursor ?? null}
      onNextPage={(next) => setCursor(next)}
      onFirstPage={cursor ? () => setCursor(undefined) : undefined}
    />
  );
}
