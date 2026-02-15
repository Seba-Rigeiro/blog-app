"use client";

import { useState } from "react";
import { useArticles } from "@/hooks";
import { ArticleList } from "@/features/articles";

export default function ArticlesPage() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const { data, isLoading, error } = useArticles(cursor);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Artículos</h1>
      <ArticleList
        items={data?.items ?? []}
        isLoading={isLoading}
        error={error ? { message: error.message } : null}
        emptyMessage="No hay artículos publicados."
        nextCursor={data?.nextCursor ?? null}
        onNextPage={(next) => setCursor(next)}
        onFirstPage={cursor ? () => setCursor(undefined) : undefined}
      />
    </div>
  );
}
