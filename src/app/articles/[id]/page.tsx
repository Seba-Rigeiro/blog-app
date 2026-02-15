"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useArticleById, useDeleteArticle, useCurrentUser } from "@/hooks";
import { ArticleDetail } from "@/features/articles";

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : null;
  const { data: article, isLoading, error } = useArticleById(id);
  const deleteMutation = useDeleteArticle();
  const { user } = useCurrentUser();
  const isAuthor = Boolean(user && article && article.authorId === user.id);

  if (!id) return <p className="text-red-600">ID inválido</p>;

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
    <ArticleDetail
      article={article}
      isAuthor={isAuthor}
      onEdit={() => router.push(`/articles/${id}/edit`)}
      onDelete={handleDelete}
      isDeleting={deleteMutation.isPending}
    />
  );
}
