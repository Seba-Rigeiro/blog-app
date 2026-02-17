"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateArticle } from "@/hooks";
import { ArticleForm, type ArticleFormData } from "@/features/articles";
import { ErrorToast } from "@/components/ui";

export default function NewArticlePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const create = useCreateArticle({
    onError: (err) => setError(err.message),
  });

  const onSubmit = async (data: ArticleFormData) => {
    const result = await create.mutateAsync({
      title: data.title,
      content: data.content,
      imageUrl: data.imageUrl ?? undefined,
    });
    router.push(`/articles/${result.id}`);
  };

  return (
    <>
      <ArticleForm
        mode="create"
        onSubmit={onSubmit}
        isPending={create.isPending}
        onCancel={() => router.push("/articles")}
      />
      <ErrorToast message={error} onDismiss={() => setError(null)} />
    </>
  );
}
