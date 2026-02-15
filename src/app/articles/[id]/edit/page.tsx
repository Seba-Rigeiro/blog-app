"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useArticleById, useUpdateArticle, useCurrentUser } from "@/hooks";
import {
  updateArticleSchema,
  type UpdateArticleInput,
} from "@/schemas/articles";
import Link from "next/link";

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : null;
  const { data: article, isLoading, error } = useArticleById(id);
  const update = useUpdateArticle();
  const { user, isPending: userPending } = useCurrentUser();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<UpdateArticleInput>({
    resolver: zodResolver(updateArticleSchema),
  });

  useEffect(() => {
    if (article) {
      reset({
        title: article.title,
        content: article.content,
        imageUrl: article.imageUrl ?? "",
      });
    }
  }, [article, reset]);

  if (!id) return <p className="text-red-600">ID inválido</p>;
  if (isLoading || userPending)
    return <p className="text-gray-500">Cargando…</p>;
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

  const onSubmit = async (data: UpdateArticleInput) => {
    try {
      await update.mutateAsync({
        id,
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl === "" ? undefined : data.imageUrl,
      });
      router.push(`/articles/${id}`);
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Error al guardar";
      setError("root", { message });
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Editar artículo</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        key={article.id}
      >
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
            URL de imagen
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
            disabled={update.isPending}
            className="rounded bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {update.isPending ? "Guardando…" : "Guardar"}
          </button>
          <Link
            href={`/articles/${id}`}
            className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
