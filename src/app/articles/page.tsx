"use client";

import { useState } from "react";
import { useArticles, useSearchArticles } from "@/hooks";
import { ArticleList } from "@/features/articles";
import { Input, Loading } from "@/components/ui";

const DEFAULT_PAGE_SIZE = 10;

export default function ArticlesPage() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [searchQ, setSearchQ] = useState("");
  const [submittedQ, setSubmittedQ] = useState("");
  const [searchCursor, setSearchCursor] = useState<string | undefined>(
    undefined,
  );
  const [searchPageSize, setSearchPageSize] =
    useState<number>(DEFAULT_PAGE_SIZE);

  const { data, isLoading, error } = useArticles(pageSize, cursor);
  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
  } = useSearchArticles({
    q: submittedQ,
    limit: searchPageSize,
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

  const currentCursor = cursor ? parseInt(cursor, 10) : 0;
  const handlePrevPage = () => {
    const prevSkip = currentCursor - pageSize;
    setCursor(prevSkip > 0 ? String(prevSkip) : undefined);
  };

  const searchCurrentCursor = searchCursor ? parseInt(searchCursor, 10) : 0;
  const handleSearchPrevPage = () => {
    const prevSkip = searchCurrentCursor - searchPageSize;
    setSearchCursor(prevSkip > 0 ? String(prevSkip) : undefined);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCursor(undefined);
  };

  const handleSearchPageSizeChange = (size: number) => {
    setSearchPageSize(size);
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
          {searchLoading && <Loading message="Buscando…" />}
          {searchError && (
            <p className="text-red-600" role="alert">
              {searchError.message}
            </p>
          )}
          {searchData && !searchLoading && (
            <>
              <p className="text-sm text-gray-600">
                {searchData.totalCount ?? searchData.items.length} resultado(s)
                para &quot;{submittedQ}&quot;
              </p>
              <ArticleList
                items={searchData.items}
                isLoading={false}
                error={null}
                emptyMessage="No se encontraron artículos."
                pageSize={searchPageSize}
                currentCursor={searchCurrentCursor}
                totalCount={searchData.totalCount}
                nextCursor={searchData.nextCursor ?? null}
                onNextPage={(next) => setSearchCursor(next)}
                onPrevPage={handleSearchPrevPage}
                onFirstPage={
                  searchCursor ? () => setSearchCursor(undefined) : undefined
                }
                onPageSizeChange={handleSearchPageSizeChange}
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
          pageSize={pageSize}
          currentCursor={currentCursor}
          totalCount={data?.totalCount}
          nextCursor={data?.nextCursor ?? null}
          onNextPage={(next) => setCursor(next)}
          onPrevPage={handlePrevPage}
          onFirstPage={cursor ? () => setCursor(undefined) : undefined}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
}
