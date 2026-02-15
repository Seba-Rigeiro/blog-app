"use client";

import Link from "next/link";
import { trpc } from "@/server/trpc/client";
import { ArticleListItem, AuthorsSection } from "@/features/articles";

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
        <AuthorsSection authors={authorsData} />
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
              <ArticleListItem
                key={a.id}
                id={a.id}
                title={a.title}
                createdAt={a.createdAt}
              />
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
