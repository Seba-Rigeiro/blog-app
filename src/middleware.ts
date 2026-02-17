import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Nombre sin prefijo (localhost/HTTP). Better Auth en prod usa prefijo __Secure- */
const SESSION_COOKIE = "better-auth.session_token";
const SESSION_COOKIE_SECURE = "__Secure-better-auth.session_token";

const protectedPaths = ["/dashboard", "/articles/new"];

function isProtectedPath(pathname: string): boolean {
  if (
    protectedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))
  )
    return true;
  const match = pathname.match(/^\/articles\/([^/]+)\/edit\/?$/);
  return Boolean(match);
}

function hasSessionCookie(request: NextRequest): boolean {
  const token =
    request.cookies.get(SESSION_COOKIE)?.value ??
    request.cookies.get(SESSION_COOKIE_SECURE)?.value;
  return Boolean(token);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!isProtectedPath(pathname)) return NextResponse.next();

  if (!hasSessionCookie(request)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/articles/new",
    "/articles/:path*",
  ],
};
