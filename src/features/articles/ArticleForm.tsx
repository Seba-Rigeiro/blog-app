"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createArticleSchema,
  type CreateArticleInput,
} from "@/schemas/articles";
import { FormField, Input, Textarea } from "@/components/ui";

export type ArticleFormData = CreateArticleInput;

type ArticleFormProps = {
  mode: "create" | "edit";
  defaultValues?: Partial<ArticleFormData>;
  onSubmit: (data: ArticleFormData) => Promise<void>;
  isPending: boolean;
  /** Callback al cancelar (ej. router.back() o router.push(...)) */
  onCancel?: () => void;
};

export function ArticleForm({
  mode,
  defaultValues,
  onSubmit,
  isPending,
  onCancel,
}: ArticleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(createArticleSchema),
    defaultValues: {
      title: "",
      content: "",
      imageUrl: "",
      ...defaultValues,
    },
  });

  const handleFormSubmit = async (data: ArticleFormData) => {
    try {
      await onSubmit({
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl === "" ? undefined : data.imageUrl,
      });
    } catch {
      // Errores de mutación se muestran en el toast global (onError en hooks)
    }
  };

  const title = mode === "create" ? "Nuevo artículo" : "Editar artículo";
  const submitLabel = mode === "create" ? "Crear" : "Guardar";
  const submitPendingLabel = mode === "create" ? "Creando…" : "Guardando…";
  const imageLabel =
    mode === "create" ? "URL de imagen (opcional)" : "URL de imagen";

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField id="title" label="Título" error={errors.title?.message}>
          <Input id="title" {...register("title")} />
        </FormField>
        <FormField
          id="content"
          label="Contenido"
          error={errors.content?.message}
        >
          <Textarea id="content" rows={8} {...register("content")} />
        </FormField>
        <FormField
          id="imageUrl"
          label={imageLabel}
          error={errors.imageUrl?.message}
        >
          <Input id="imageUrl" type="url" {...register("imageUrl")} />
        </FormField>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {isPending ? submitPendingLabel : submitLabel}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
