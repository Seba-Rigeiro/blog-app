import { LinkButton } from "@/components/ui/LinkButton";
import { getAuth } from "@/lib/auth";
import { headers } from "next/headers";
import { MyArticlesList } from "@/features/articles";

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
      <h1 className="text-2xl font-bold">Mis artículos</h1>
      <p className="mt-2 text-gray-600">
        Hola, <strong>{name}</strong>. Aquí puedes ver un listado de todos tus
        artículos.
      </p>
      <section className="mt-6" aria-label="Listado de mis artículos">
        <MyArticlesList />
      </section>
      <p className="mt-6">
        <LinkButton href="/">Volver al inicio</LinkButton>
      </p>
    </main>
  );
}
