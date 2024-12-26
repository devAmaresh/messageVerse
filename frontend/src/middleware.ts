import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  console.log("Token:", token);
  const { pathname } = request.nextUrl;

  // If the user is logged in, prevent access to login and register pages
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/chat", request.url)); // Redirect to home or dashboard if logged in
  }

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
