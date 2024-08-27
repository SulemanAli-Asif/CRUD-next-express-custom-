import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token =
    req.cookies.get("next-auth.session-token") ||
    req.headers.get("Authorization");
  if (token) {
    return NextResponse.next();
  } else {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/update/:path*",
    "/add",
    "/api/items/:path*",
    "/api/delete/:path*",
  ],
};
