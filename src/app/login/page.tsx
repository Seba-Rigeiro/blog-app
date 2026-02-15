"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { LoginForm } from "@/features/auth";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, isPending } = useAuth();

  const onSubmit = async (data: { email: string; password: string }) => {
    const result = await signIn(data, "/");
    if (result?.error) return result;
    router.push("/");
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <LoginForm onSubmit={onSubmit} isPending={isPending} />
    </main>
  );
}
