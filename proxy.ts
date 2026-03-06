import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define protected paths
  const isAdminPath = path.startsWith("/admin");
  const isUserPath = path.startsWith("/user");
  const isDashboardPath = path.startsWith("/dashboard");
  const isAuthPath = path.startsWith("/login") || path.startsWith("/register");

  // Admin auth is handled client-side via localStorage, so skip middleware guards.
  if (isAdminPath) {
    return NextResponse.next();
  }

  // Get tokens from cookies
  const authToken = request.cookies.get("auth_token")?.value;
  const sessionData = request.cookies.get("session_data")?.value;

  // Parse session data to check role
  let userRole = null;
  if (sessionData) {
    try {
      const session = JSON.parse(sessionData);
      userRole = session.role;
    } catch (error) {
      console.error("Error parsing session data:", error);
    }
  }

  // Redirect to login if not authenticated and trying to access protected routes
  if ((isUserPath || isDashboardPath) && !authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPath && authToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
