"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/schemas/auth";
import { FormField, Input } from "@/components/ui";

type LoginFormProps = {
  onSubmit: (
    data: LoginInput,
  ) => Promise<{ error?: { message?: string } } | void>;
  isPending: boolean;
};

export function LoginForm({ onSubmit, isPending }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleFormSubmit = async (data: LoginInput) => {
    const result = await onSubmit(data);
    if (result?.error) {
      setError("root", {
        message: result.error.message ?? "Error al iniciar sesión",
      });
    }
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      <h1 className="text-center text-2xl font-bold">Iniciar sesión</h1>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {errors.root && (
          <p className="text-sm text-red-600" role="alert">
            {errors.root.message}
          </p>
        )}
        <FormField id="email" label="Email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
          />
        </FormField>
        <FormField
          id="password"
          label="Contraseña"
          error={errors.password?.message}
        >
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
          />
        </FormField>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded bg-gray-900 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isPending ? "Entrando…" : "Entrar"}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600">
        ¿Sin cuenta?{" "}
        <Link href="/register" className="underline">
          Registrarse
        </Link>
      </p>
    </div>
  );
}
