import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl;

  // Allow static files (like CSS, images, etc.) and public routes (e.g., login, register)
  if (
    pathname.startsWith("/_next/") || // For Next.js internal assets
    pathname.startsWith("/static/") || // For static assets
    pathname === "/" ||
    pathname === "/register" ||
    pathname === "/login"
  ) {
    return NextResponse.next(); // Allow access to these pages and assets
  }

  // If token is not present, redirect to login page
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next(); // If token exists, allow access
}
