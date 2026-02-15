"use client";

import { useState } from "react";
import { useArticles, useSearchArticles } from "@/hooks";
import { ArticleList } from "@/features/articles";
import { Input } from "@/components/ui";

export default function ArticlesPage() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [searchQ, setSearchQ] = useState("");
  const [submittedQ, setSubmittedQ] = useState("");
  const [searchCursor, setSearchCursor] = useState<string | undefined>(
    undefined,
  );

  const { data, isLoading, error } = useArticles(cursor);
  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
  } = useSearchArticles({
    q: submittedQ,
    limit: 10,
    cursor: searchCursor,
  });

  const isSearchMode = submittedQ.length > 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQ.trim();
    setSubmittedQ(q);
    setSearchCursor(undefined);
  };

  const clearSearch = () => {
    setSubmittedQ("");
    setSearchQ("");
    setSearchCursor(undefined);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Artículos</h1>

      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="search"
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
          placeholder="Buscar por título o texto..."
          aria-label="Texto de búsqueda"
          className="flex-1"
        />
        <button
          type="submit"
          className="rounded bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
        >
          Buscar
        </button>
        {isSearchMode && (
          <button
            type="button"
            onClick={clearSearch}
            className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
          >
            Ver todos
          </button>
        )}
      </form>

      {isSearchMode ? (
        <>
          {searchLoading && <p className="text-gray-500">Buscando…</p>}
          {searchError && (
            <p className="text-red-600" role="alert">
              {searchError.message}
            </p>
          )}
          {searchData && !searchLoading && (
            <>
              <p className="text-sm text-gray-600">
                {searchData.items.length} resultado(s) para &quot;{submittedQ}
                &quot;
              </p>
              <ArticleList
                items={searchData.items}
                isLoading={false}
                error={null}
                emptyMessage="No se encontraron artículos."
                nextCursor={searchData.nextCursor ?? null}
                onNextPage={(next) => setSearchCursor(next)}
                onFirstPage={
                  searchCursor ? () => setSearchCursor(undefined) : undefined
                }
              />
            </>
          )}
        </>
      ) : (
        <ArticleList
          items={data?.items ?? []}
          isLoading={isLoading}
          error={error ? { message: error.message } : null}
          emptyMessage="No hay artículos publicados."
          nextCursor={data?.nextCursor ?? null}
          onNextPage={(next) => setCursor(next)}
          onFirstPage={cursor ? () => setCursor(undefined) : undefined}
        />
      )}
    </div>
  );
}
