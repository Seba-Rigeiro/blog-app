"use client";

import Link from "next/link";
import { trpc } from "@/server/trpc/client";

export default function HomePage() {
  const {
    data: listData,
    isLoading,
    error,
  } = trpc.article.list.useQuery({ limit: 5 });
  const { data: authorsData } = trpc.user.getAuthorsWithArticleCount.useQuery();

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold">Blog CMS</h1>
        <p className="mt-1 text-gray-600">
          Inicio — últimos artículos y autores
        </p>
      </section>

      {authorsData && authorsData.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold">Autores</h2>
          <ul className="mt-2 flex flex-wrap gap-3">
            {authorsData.map((a) => (
              <li
                key={a.authorId}
                className="rounded bg-white px-3 py-2 shadow-sm border border-gray-200"
              >
                <span className="font-medium">{a.authorName}</span>
                <span className="ml-2 text-gray-500">
                  {a.articleCount}{" "}
                  {a.articleCount === 1 ? "artículo" : "artículos"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold">Últimos artículos</h2>
        {isLoading && <p className="mt-2 text-gray-500">Cargando…</p>}
        {error && (
          <p className="mt-2 text-red-600" role="alert">
            Error al cargar artículos. Revisá la conexión.
          </p>
        )}
        {listData?.items && listData.items.length === 0 && (
          <p className="mt-2 text-gray-500">Aún no hay artículos.</p>
        )}
        {listData?.items && listData.items.length > 0 && (
          <ul className="mt-2 space-y-3">
            {listData.items.map((a) => (
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
        {listData?.nextCursor != null && (
          <Link
            href="/articles"
            className="mt-3 inline-block text-sm text-blue-600 hover:underline"
          >
            Ver todos los artículos →
          </Link>
        )}
      </section>
    </div>
  );
}
