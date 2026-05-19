import { auth } from "@/lib/auth.config";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn   = !!req.auth;
  const isAuthPage   = pathname.startsWith("/login");
  const isApiAuth    = pathname.startsWith("/api/auth");

  if (isApiAuth)                    return NextResponse.next();
  if (isLoggedIn  && isAuthPage)    return NextResponse.redirect(new URL("/pos",   req.url));
  if (!isLoggedIn && !isAuthPage)   return NextResponse.redirect(new URL("/login", req.url));

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|manifest.json).*)"],
};