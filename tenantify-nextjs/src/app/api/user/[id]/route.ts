import { NextResponse } from "next/server";

import prisma from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

// READ User Detail
export async function GET(
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
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { tenant: true }, // Include related tenant data
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// UPDATE User
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
    const allowedFields = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "companyName",
      "dateOfBirth",
      "address1",
      "address2",
      "city",
      "state",
      "zipCode",
      "country",
      "tenantId",
    ];

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

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: filteredData,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE User
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
    await prisma.user.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
