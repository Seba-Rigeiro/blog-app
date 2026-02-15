"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/schemas/auth";
import { FormField, Input } from "@/components/ui";

type RegisterFormProps = {
  onSubmit: (
    data: RegisterInput,
  ) => Promise<{ error?: { message?: string } } | void>;
  isPending: boolean;
};

export function RegisterForm({ onSubmit, isPending }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const handleFormSubmit = async (data: RegisterInput) => {
    const result = await onSubmit(data);
    if (result?.error) {
      setError("root", {
        message: result.error.message ?? "Error al registrarse",
      });
    }
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      <h1 className="text-center text-2xl font-bold">Registrarse</h1>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {errors.root && (
          <p className="text-sm text-red-600" role="alert">
            {errors.root.message}
          </p>
        )}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            id="firstName"
            label="Nombre"
            error={errors.firstName?.message}
          >
            <Input
              id="firstName"
              type="text"
              autoComplete="given-name"
              {...register("firstName")}
            />
          </FormField>
          <FormField
            id="lastName"
            label="Apellido"
            error={errors.lastName?.message}
          >
            <Input
              id="lastName"
              type="text"
              autoComplete="family-name"
              {...register("lastName")}
            />
          </FormField>
        </div>
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
          label="Contraseña (mín. 8 caracteres)"
          error={errors.password?.message}
        >
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register("password")}
          />
        </FormField>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded bg-gray-900 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isPending ? "Creando cuenta…" : "Crear cuenta"}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="underline">
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}
