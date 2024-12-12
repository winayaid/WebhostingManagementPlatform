import { NextResponse } from "next/server"

import prisma from "@/lib/db"

// READ Tenant Detail
export async function GET(
  _req: Request,
  { params }: { params: { domain: string } }
) {
  try {
    const { domain } = params
    const tenant = await prisma.tenant.findUnique({
      where: { domain: String(domain) },
    })

    if (!tenant) {
      return NextResponse.json({ error: "Invalid Domain" }, { status: 404 })
    }

    const response = NextResponse.json({ logo: tenant?.logo }, { status: 200 })

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", `*`)
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS")
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    )

    return response
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred"
    const errorResponse = NextResponse.json({ error: message }, { status: 500 })

    // Add CORS headers for error responses
    errorResponse.headers.set("Access-Control-Allow-Origin", `*`)
    errorResponse.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS")
    errorResponse.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    )

    return errorResponse
  }
}

// Handle OPTIONS preflight request
export async function OPTIONS() {
  const response = NextResponse.json(null, { status: 204 })
  response.headers.set("Access-Control-Allow-Origin", `*`)
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS")
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  )

  return response
}
