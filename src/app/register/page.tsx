"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { RegisterForm } from "@/features/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, isPending } = useAuth();

  const onSubmit = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    const result = await signUp(data, "/");
    if (result?.error) return result;
    router.push("/");
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <RegisterForm onSubmit={onSubmit} isPending={isPending} />
    </main>
  );
}
