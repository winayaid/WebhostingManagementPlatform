import { NextResponse } from "next/server";

import prisma from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

// READ Tenant Detail
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
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
    const { id } = params;
    const tenant = await prisma.tenant.findUnique({
      where: { id: Number(id) },
      include: { user: true }, // Include related user (one-to-one relation)
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    return NextResponse.json(tenant, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// UPDATE Tenant
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  // verify JWT token
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
    const { id } = params;
    const requestData = await req.json();

    // Define allowed fields for update
    const allowedFields = ["name", "domain", "logo", "clientId"];

    // Filter the input data to include only allowed fields
    const filteredData = Object.fromEntries(
      Object.entries(requestData).filter(([key]) => allowedFields.includes(key))
    );

    // Check if there's any data to update
    if (Object.keys(filteredData).length === 0) {
      return NextResponse.json(
        { message: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Handle clientId updates and maintain relationships
    if ("clientId" in requestData) {
      const clientId = requestData.clientId;

      // Unlink all users currently linked to this tenant
      await prisma.user.updateMany({
        where: { tenantId: Number(id) },
        data: { tenantId: null },
      });

      // If clientId is provided, link the user to the tenant
      if (clientId) {
        await prisma.user.update({
          where: { id: Number(clientId) },
          data: { tenantId: Number(id) },
        });
      }
    }

    // Update other tenant details
    const updatedTenant = await prisma.tenant.update({
      where: { id: Number(id) },
      data: filteredData,
      include: {
        user: true, // Include updated user relation
      },
    });

    return NextResponse.json(updatedTenant, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE Tenant
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  // verify JWT token
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
    const { id } = params;
    await prisma.tenant.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Tenant deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
