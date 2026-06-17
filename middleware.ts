import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PROTECTED = ["/journal", "/timeline", "/calendar", "/aura", "/profile"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p))
  const isAuthRoute = ["/login", "/register", "/start"].includes(pathname)
  const isRoot = pathname === "/"

  if ((isProtected || isRoot) && !user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/journal", request.url))
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
}
