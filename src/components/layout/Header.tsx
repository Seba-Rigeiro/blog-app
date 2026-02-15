"use client";

import Link from "next/link";
import { useCurrentUser } from "@/hooks";
import { authClient } from "@/lib/auth-client";

export function Header() {
  const { user, isPending } = useCurrentUser();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-gray-900">
          Blog CMS
        </Link>
        <nav
          className="flex items-center gap-4"
          aria-label="Navegación principal"
        >
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            Inicio
          </Link>
          <Link
            href="/articles"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Artículos
          </Link>
          {isPending ? (
            <span className="text-sm text-gray-400">...</span>
          ) : user ? (
            <>
              <Link
                href="/articles/new"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Nuevo artículo
              </Link>
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await authClient.signOut();
                  window.location.href = "/";
                }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="text-sm rounded bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-800"
              >
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
