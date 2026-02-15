"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateArticle } from "@/hooks";
import {
  createArticleSchema,
  type CreateArticleInput,
} from "@/schemas/articles";

export default function NewArticlePage() {
  const router = useRouter();
  const create = useCreateArticle();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateArticleInput>({
    resolver: zodResolver(createArticleSchema),
    defaultValues: { title: "", content: "", imageUrl: "" },
  });

  const onSubmit = async (data: CreateArticleInput) => {
    try {
      const result = await create.mutateAsync({
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl || undefined,
      });
      router.push(`/articles/${result.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al crear";
      setError("root", { message });
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Nuevo artículo</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && (
          <p className="text-sm text-red-600" role="alert">
            {errors.root.message}
          </p>
        )}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Título
          </label>
          <input
            id="title"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            {...register("title")}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Contenido
          </label>
          <textarea
            id="content"
            rows={8}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            {...register("content")}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">
              {errors.content.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
            URL de imagen (opcional)
          </label>
          <input
            id="imageUrl"
            type="url"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            {...register("imageUrl")}
          />
          {errors.imageUrl && (
            <p className="mt-1 text-sm text-red-600">
              {errors.imageUrl.message}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={create.isPending}
            className="rounded bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {create.isPending ? "Creando…" : "Crear"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
