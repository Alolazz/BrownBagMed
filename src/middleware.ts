import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Protect /alola and subpages except /alola/login and /alola/api
  if (
    pathname.startsWith("/alola") &&
    !pathname.startsWith("/alola/login") &&
    !pathname.startsWith("/api/")
  ) {
    const cookie = req.cookies.get("alola_auth");
    if (!cookie || cookie.value !== "true") {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/alola/login";
      loginUrl.search = "";
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/alola/:path*"],
};
