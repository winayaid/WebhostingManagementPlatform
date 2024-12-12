import { NextResponse } from "next/server";

import prisma from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

// CREATE Tenant
export async function POST(req: Request) {
  // Verify JWT token
  const token = req.headers.get("authorization")?.split(" ")[1]; // Extract Bearer token

  if (!token) {
    return NextResponse.json(
      { message: "Authentication token required" },
      { status: 401 }
    );
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }

  try {
    const requestData = await req.json();

    // Define allowed fields for creation
    const allowedFields = ["name", "domain", "logo", "clientId"];

    // Filter the input data to include only allowed fields
    const filteredData = Object.fromEntries(
      Object.entries(requestData).filter(([key]) => allowedFields.includes(key))
    );

    // Validate required fields
    if (
      typeof filteredData.name !== "string" ||
      typeof filteredData.domain !== "string" ||
      typeof filteredData.logo !== "string"
    ) {
      return NextResponse.json(
        { message: "Name and domain must be valid strings" },
        { status: 400 }
      );
    }

    // Create the tenant
    const createdTenant = await prisma.tenant.create({
      data: {
        name: filteredData.name,
        domain: filteredData.domain,
        logo: filteredData.logo || null,
      },
    });

    // Handle clientId and set the relationship
    if ("clientId" in filteredData) {
      const clientId = filteredData.clientId;

      if (clientId) {
        await prisma.user.update({
          where: { id: Number(clientId) },
          data: { tenantId: createdTenant.id },
        });
      }
    }

    // Retrieve the tenant with user relation for response
    const tenantWithUser = await prisma.tenant.findUnique({
      where: { id: createdTenant.id },
      include: {
        user: true, // Include the related user
      },
    });

    return NextResponse.json(tenantWithUser, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET Tenant
export async function GET(req: Request) {
  try {
    const url = new URL(req.url); // Parse the request URL
    const filter = url.searchParams.get("filter"); // Get the 'filter' parameter
    const userId = url.searchParams.get("userId"); // Get the 'userId' parameter (optional)

    let whereCondition = {};

    // Apply filter conditionally
    if (filter === "tenant_available") {
      whereCondition = userId
        ? {
            OR: [
              {
                user: null, // Tenants with no associated user
              },
              {
                user: {
                  id: parseInt(userId, 10), // Tenants already assigned to the current user
                },
              },
            ],
          }
        : {
            user: null, // Only tenants with no associated user
          };
    }

    const tenants = await prisma.tenant.findMany({
      where: whereCondition,
      include: {
        user: true, // Include the user relation for verification/debugging
      },
    });

    return NextResponse.json(tenants, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
