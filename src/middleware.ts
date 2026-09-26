import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_NAME, verifyAuthToken, isOwnerUser } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const user = token ? await verifyAuthToken(token) : null;

  // Protect Calculator route - require sign in as requested
  if (pathname.startsWith("/calculator")) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect Owner routes - require admin/owner role
  if (pathname.startsWith("/owner")) {
    if (!user || !isOwnerUser(user)) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/owner/:path*", "/calculator"],
};