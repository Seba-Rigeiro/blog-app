"use client";

import { useState } from "react";
import { useSearchArticles } from "@/hooks";
import { ArticleListItem } from "@/features/articles";
import { Input, Loading } from "@/components/ui";

export function SearchArticles() {
  const [q, setQ] = useState("");
  const [submitted, setSubmitted] = useState("");
  const { data, isLoading, error } = useSearchArticles({
    q: submitted,
    limit: 10,
    cursor: undefined,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(q.trim());
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Buscar artículos</h1>
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Título o texto..."
          aria-label="Texto de búsqueda"
          className="flex-1"
        />
        <button
          type="submit"
          className="rounded bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
        >
          Buscar
        </button>
      </form>

      {submitted && (
        <>
          {isLoading && <Loading message="Buscando…" />}
          {error && (
            <p className="text-red-600" role="alert">
              {error.message}
            </p>
          )}
          {data && !isLoading && (
            <>
              <p className="text-sm text-gray-600">
                {data.items.length} resultado(s) para &quot;{submitted}&quot;
              </p>
              {data.items.length === 0 ? (
                <p className="text-gray-500">No se encontraron artículos.</p>
              ) : (
                <ul className="space-y-3">
                  {data.items.map((a) => (
                    <ArticleListItem
                      key={a.id}
                      id={a.id}
                      title={a.title}
                      createdAt={a.createdAt}
                      author={a.authorName}
                    />
                  ))}
                </ul>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
