"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useArticleById, useUpdateArticle, useCurrentUser } from "@/hooks";
import { ArticleForm, type ArticleFormData } from "@/features/articles";
import { Loading } from "@/components/ui";

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : null;
  const { data: article, isLoading, error } = useArticleById(id);
  const update = useUpdateArticle();
  const { user, isPending: userPending } = useCurrentUser();

  if (!id) return <p className="text-red-600">ID inválido</p>;
  if (isLoading || userPending) return <Loading fullScreen />;
  if (error) {
    return (
      <div>
        <p className="text-red-600">{error.message}</p>
        <Link
          href="/articles"
          className="mt-2 inline-block text-blue-600 underline"
        >
          Volver
        </Link>
      </div>
    );
  }
  if (!article) return null;

  const isAuthor = user && article.authorId === user.id;
  if (!isAuthor) {
    return (
      <div className="space-y-4">
        <p className="text-red-600">
          No tenés permiso para editar este artículo.
        </p>
        <Link
          href={`/articles/${id}`}
          className="inline-block text-blue-600 underline"
        >
          Volver al artículo
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: ArticleFormData) => {
    await update.mutateAsync({
      id,
      title: data.title,
      content: data.content,
      imageUrl: data.imageUrl === "" ? undefined : data.imageUrl,
    });
    router.push(`/articles/${id}`);
  };

  return (
    <ArticleForm
      key={article.id}
      mode="edit"
      defaultValues={{
        title: article.title,
        content: article.content,
        imageUrl: article.imageUrl ?? "",
      }}
      onSubmit={onSubmit}
      isPending={update.isPending}
      onCancel={() => router.push(`/articles/${id}`)}
    />
  );
}
