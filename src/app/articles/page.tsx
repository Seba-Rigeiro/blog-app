"use client";

import { useState } from "react";
import Link from "next/link";
import { useArticles } from "@/hooks";

export default function ArticlesPage() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const { data, isLoading, error } = useArticles(cursor);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Artículos</h1>

      {isLoading && <p className="text-gray-500">Cargando…</p>}
      {error && (
        <p className="text-red-600" role="alert">
          Error al cargar. {error.message}
        </p>
      )}

      {data?.items && data.items.length === 0 && !cursor && (
        <p className="text-gray-500">No hay artículos publicados.</p>
      )}

      {data?.items && data.items.length > 0 && (
        <>
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
          <div className="flex gap-2">
            {cursor && (
              <button
                type="button"
                onClick={() => setCursor(undefined)}
                className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                Primera página
              </button>
            )}
            {data.nextCursor != null && (
              <button
                type="button"
                onClick={() => setCursor(data.nextCursor ?? undefined)}
                className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                Siguiente
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
