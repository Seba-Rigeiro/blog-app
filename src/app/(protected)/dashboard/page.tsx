import Link from "next/link";
import { getAuth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return null;
  }

  const user = session.user;
  const name = user.name ?? user.email;

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Hola, <strong>{name}</strong> ({user.email})
      </p>
      <p className="mt-4">
        <Link href="/" className="text-blue-600 underline">
          Volver al inicio
        </Link>
      </p>
    </main>
  );
}
