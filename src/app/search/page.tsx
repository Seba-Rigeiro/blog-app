"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchArticles } from "@/hooks";

export default function SearchPage() {
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
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Título o texto..."
          className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
          aria-label="Texto de búsqueda"
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
          {isLoading && <p className="text-gray-500">Buscando…</p>}
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
                    <li key={a.id}>
                      <Link
                        href={`/articles/${a.id}`}
                        className="block rounded border border-gray-200 bg-white p-4 shadow-sm hover:border-gray-300"
                      >
                        <span className="font-medium">{a.title}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          {new Date(a.createdAt).toLocaleDateString("es")}
                        </span>
                      </Link>
                    </li>
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
