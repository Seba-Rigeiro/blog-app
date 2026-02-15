import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "better-auth.session_token";

const protectedPaths = ["/dashboard", "/articles/new"];

function isProtectedPath(pathname: string): boolean {
  if (
    protectedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))
  )
    return true;
  const match = pathname.match(/^\/articles\/([^/]+)\/edit\/?$/);
  return Boolean(match);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!isProtectedPath(pathname)) return NextResponse.next();

  const sessionCookie = request.cookies.get(SESSION_COOKIE);
  if (!sessionCookie?.value) {
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
