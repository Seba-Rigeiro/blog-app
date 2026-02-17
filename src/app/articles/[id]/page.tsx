"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useArticleById, useDeleteArticle, useCurrentUser } from "@/hooks";
import { ArticleDetail } from "@/features/articles";
import { ConfirmDialog, ErrorToast, Loading } from "@/components/ui";

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : null;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: article, isLoading, error: queryError } = useArticleById(id);
  const deleteMutation = useDeleteArticle({
    onError: (err) => setError(err.message),
  });
  const { user } = useCurrentUser();
  const isAuthor = Boolean(user && article && article.authorId === user.id);

  if (!id) return <p className="text-red-600">ID inválido</p>;

  if (isLoading) return <Loading fullScreen />;

  if (queryError) {
    return (
      <div>
        <p className="text-red-600" role="alert">
          {queryError.message}
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

  const handleDeleteClick = () => setShowDeleteConfirm(true);

  const handleDeleteConfirm = async () => {
    try {
      await deleteMutation.mutateAsync({ id });
      setShowDeleteConfirm(false);
      router.push("/articles");
    } catch {
      // Error mostrado por toast en onError del hook
    }
  };

  return (
    <>
      <ArticleDetail
        article={article}
        isAuthor={isAuthor}
        onEdit={() => router.push(`/articles/${id}/edit`)}
        onDelete={handleDeleteClick}
        isDeleting={deleteMutation.isPending}
      />
      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar artículo"
        message="¿Estás seguro de que querés eliminar este artículo? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
      <ErrorToast message={error} onDismiss={() => setError(null)} />
    </>
  );
}
