"use client";

import { useRouter } from "next/navigation";
import { useCreateArticle } from "@/hooks";
import { ArticleForm, type ArticleFormData } from "@/features/articles";

export default function NewArticlePage() {
  const router = useRouter();
  const create = useCreateArticle();

  const onSubmit = async (data: ArticleFormData) => {
    const result = await create.mutateAsync({
      title: data.title,
      content: data.content,
      imageUrl: data.imageUrl ?? undefined,
    });
    router.push(`/articles/${result.id}`);
  };

  return (
    <ArticleForm
      mode="create"
      onSubmit={onSubmit}
      isPending={create.isPending}
      onCancel={() => router.push("/articles")}
    />
  );
}
