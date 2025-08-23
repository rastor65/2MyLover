import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // No proteger login ni rutas de auth
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/login")) {
    return NextResponse.next()
  }

  // Solo proteger /admin/**
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  const token = await getToken({ req, secret: process.env.AUTH_SECRET })
  const role = (token as any)?.role

  if (role === "admin" || role === "superadmin") return NextResponse.next()

  // si no, manda a login con callback
  const url = req.nextUrl.clone()
  url.pathname = "/login"
  url.searchParams.set("callbackUrl", pathname)
  return NextResponse.redirect(url)
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] }
