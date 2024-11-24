import { NextResponse } from "next/server";

export function middleware(request) {
  // Check if the request is for an API route
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  return NextResponse.next();
}
