import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin rotaları koruma
  if (pathname.startsWith("/admin")) {
    // YEREL GÖSTERİM: Veritabanı yapılandırılmadıysa (placeholder ise) admin paneli gösterimini engelleme
    const dbUrl = process.env.DATABASE_URL || "";
    if (dbUrl.includes("ep-xxx") || dbUrl.includes("localhost/placeholder") || dbUrl === "") {
      return NextResponse.next();
    }

    const sessionToken =
      request.cookies.get("better-auth.session_token")?.value ||
      request.cookies.get("__Secure-better-auth.session_token")?.value;

    if (!sessionToken) {
      return NextResponse.redirect(
        new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url)
      );
    }

    // Session'ı Better-Auth API'ye doğrulat
    try {
      const sessionRes = await fetch(
        new URL("/api/auth/get-session", request.url),
        {
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        }
      );

      if (!sessionRes.ok) {
        return NextResponse.redirect(
          new URL(
            `/login?redirect=${encodeURIComponent(pathname)}`,
            request.url
          )
        );
      }

      const session = await sessionRes.json();

      if (!session?.user || session.user.role !== "ADMIN") {
        // Giriş yapmış ama admin değil → ana sayfaya yönlendir
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      return NextResponse.redirect(
        new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url)
      );
    }
  }

  // Müşteri hesap rotaları koruma
  if (pathname.startsWith("/account")) {
    const sessionToken =
      request.cookies.get("better-auth.session_token")?.value ||
      request.cookies.get("__Secure-better-auth.session_token")?.value;

    if (!sessionToken) {
      return NextResponse.redirect(
        new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/account/:path*",
  ],
};
