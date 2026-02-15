"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks";
import { registerSchema, type RegisterInput } from "@/schemas/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, isPending } = useAuth();

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

  const onSubmit = async (data: RegisterInput) => {
    const result = await signUp(data, "/");
    if (result?.error) {
      setError("root", {
        message: result.error.message ?? "Error al registrarse",
      });
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center">Registrarse</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errors.root && (
            <p className="text-sm text-red-600" role="alert">
              {errors.root?.message}
            </p>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium mb-1"
              >
                Nombre
              </label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium mb-1"
              >
                Apellido
              </label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Contraseña (mín. 8 caracteres)
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded bg-gray-900 text-white py-2 text-sm font-medium disabled:opacity-50"
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
    </main>
  );
}
