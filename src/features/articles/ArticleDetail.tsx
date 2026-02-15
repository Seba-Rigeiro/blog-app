"use client";

import Link from "next/link";

export type ArticleDetailData = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  authorId: string;
};

type ArticleDetailProps = {
  article: ArticleDetailData;
  isAuthor: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
};

export function ArticleDetail({
  article,
  isAuthor,
  onEdit,
  onDelete,
  isDeleting,
}: ArticleDetailProps) {
  const created = new Date(article.createdAt);
  const updated = new Date(article.updatedAt);
  const wasUpdated = updated.getTime() !== created.getTime();

  return (
    <article className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold">{article.title}</h1>
        {isAuthor && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onEdit}
              className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={isDeleting}
              className="rounded border border-red-200 bg-white px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              {isDeleting ? "Eliminando…" : "Eliminar"}
            </button>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-500">
        {created.toLocaleDateString("es")}
        {wasUpdated && (
          <span> · Actualizado {updated.toLocaleDateString("es")}</span>
        )}
      </p>
      {article.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.imageUrl}
          alt=""
          className="max-h-64 w-full rounded object-cover"
        />
      )}
      <div className="prose max-w-none whitespace-pre-wrap">
        {article.content}
      </div>
      <p>
        <Link href="/articles" className="text-blue-600 hover:underline">
          ← Volver al listado
        </Link>
      </p>
    </article>
  );
}
