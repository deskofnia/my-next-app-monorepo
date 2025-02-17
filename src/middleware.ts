import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "./lib/token";
import { BEFORE_LOGIN_ROUTES } from "./constants/commonConstants";
import { createErrorResponse } from "./lib/utils";

interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string;
  };
}

console.log("Inside middleware");

let redirectToLogin = false;
export async function middleware(req: NextRequest) {
  let token: string | undefined;

  // Token Extraction
  if (req.cookies.has("token")) {
    token = req.cookies.get("token")?.value;
  } else if (req.headers.get("Authorization")?.startsWith("Bearer ")) {
    token = req.headers.get("Authorization")?.substring(7);
  }

  // Login Page Handling
  if (req.nextUrl.pathname.startsWith("/login") && (!token || redirectToLogin))
    return;

  // Unauthorized API Access
  if (
    !token &&
    (req.nextUrl.pathname.startsWith("/api/users") ||
      req.nextUrl.pathname.startsWith("/api/todos"))
  ) {
    return createErrorResponse(
      "You are not logged in. Please provide a token to gain access.",
      401
    );
  }

  const response = NextResponse.next();

  // JWT Verification
  try {
    if (token) {
      const { sub } = await verifyJWT<{ sub: string }>(token);
      response.headers.set("X-USER-ID", sub);
      (req as AuthenticatedRequest).user = { id: sub };
    }
  } catch (error) {
    redirectToLogin = true;
    if (req.nextUrl.pathname.startsWith("/api")) {
      return createErrorResponse(
        "Token is invalid or user doesn't exists",
        401
      );
    }

    return NextResponse.redirect(
      new URL(`/login?${new URLSearchParams({ error: "badauth" })}`, req.url)
    );
  }

  const authUser = (req as AuthenticatedRequest).user;

  // Handle Page Routing
  if (!authUser && !BEFORE_LOGIN_ROUTES.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (authUser && BEFORE_LOGIN_ROUTES.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/login",
    "/todo",
    "/profile",
    "/register",
    "/api/users/:path*",
    "/api/todos/:path*",
  ],
};
