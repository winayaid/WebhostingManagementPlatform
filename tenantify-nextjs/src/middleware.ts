import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { NextRequest, NextResponse } from "next/server"

export default withAuth(
  async function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers)
    const token = await getToken({ req: request })
    const role = token?.user?.role.toLowerCase()
    const { pathname } = request.nextUrl

    // Define allowed roles for each path based role
    const roleAccessRoutes = {
      admin: ["/admin"],
      client: ["/user"],
    }

    // Get allowed routes for the user's role
    const userAllowedRoutes =
      roleAccessRoutes[role as keyof typeof roleAccessRoutes] || []

    // If the requested pathname is not in the user's allowed routes, redirect accordingly
    if (role) {
      if (!userAllowedRoutes.some((route) => pathname.startsWith(route))) {
        // Redirect based on role
        if (role === "admin") {
          return NextResponse.redirect(new URL("/admin", request.url))
        } else if (role === "client") {
          return NextResponse.redirect(new URL("/user", request.url))
        } else {
          // Redirect to login if role is not found
          return NextResponse.redirect(new URL("/", request.url))
        }
      }
    }

    // Store current request pathname in a custom header
    requestHeaders.set("x-pathname", request.nextUrl.pathname)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        if (token) {
          return true
        }

        return false
      },
    },
    pages: {
      signIn: "/",
    },
  }
)

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
}
