import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

// CREATE User
export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Hash the password before saving to the database
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10); // Salt rounds = 10
      data.password = hashedPassword;
    } else {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // Create user with hashed password
    const user = await prisma.user.create({ data });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url); // Parse the request URL
    const filter = url.searchParams.get("filter"); // Get the 'filter' parameter
    const tenantId = url.searchParams.get("tenantId"); // Get the 'tenantId' parameter (optional)

    let whereCondition: Prisma.UserWhereInput = {
      role: {
        not: "ADMIN", // Exclude users with the role "ADMIN"
      },
    };

    // Apply filter conditionally for "user_available"
    if (filter === "user_available") {
      whereCondition = tenantId
        ? {
            OR: [
              { tenantId: null }, // Users without a tenant
              { tenantId: parseInt(tenantId, 10) }, // Users linked to the specified tenant
            ],
            role: {
              not: "ADMIN", // Exclude users with the role "ADMIN"
            },
          }
        : {
            tenantId: null, // Only users without a tenant
            role: {
              not: "ADMIN", // Exclude users with the role "ADMIN"
            },
          };
    }

    const users = await prisma.user.findMany({
      where: whereCondition,
      include: {
        tenant: true, // Include tenant relation for debugging
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
