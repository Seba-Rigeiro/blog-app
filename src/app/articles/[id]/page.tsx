"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useArticleById, useDeleteArticle, useCurrentUser } from "@/hooks";

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : null;
  const { data: article, isLoading, error } = useArticleById(id);
  const deleteMutation = useDeleteArticle();
  const { user } = useCurrentUser();
  const isAuthor = user && article && article.authorId === user.id;

  if (!id) {
    return <p className="text-red-600">ID inválido</p>;
  }

  if (isLoading) return <p className="text-gray-500">Cargando…</p>;
  if (error) {
    return (
      <div>
        <p className="text-red-600" role="alert">
          {error.message}
        </p>
        <Link
          href="/articles"
          className="mt-2 inline-block text-blue-600 underline"
        >
          Volver al listado
        </Link>
      </div>
    );
  }
  if (!article) return null;

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este artículo?")) return;
    try {
      await deleteMutation.mutateAsync({ id });
      router.push("/articles");
    } catch {
      // Error ya mostrado por mutation
    }
  };

  return (
    <article className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold">{article.title}</h1>
        {isAuthor && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => router.push(`/articles/${id}/edit`)}
              className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="rounded border border-red-200 bg-white px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              {deleteMutation.isPending ? "Eliminando…" : "Eliminar"}
            </button>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-500">
        {new Date(article.createdAt).toLocaleDateString("es")}
        {new Date(article.updatedAt).getTime() !==
          new Date(article.createdAt).getTime() && (
          <span>
            {" "}
            · Actualizado {new Date(article.updatedAt).toLocaleDateString("es")}
          </span>
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
