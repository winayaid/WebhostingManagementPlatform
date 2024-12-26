import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";
import { generateToken } from "@/lib/jwt";

// Define the POST handler
export async function POST(req: NextRequest) {
  try {
    const { username, password, subdomain } = await req.json();

    const tenant = await prisma.tenant.findUnique({
      where: { subdomain: subdomain },
      include: { user: true },
    });

    if (!tenant) {
      return NextResponse.json(
        { message: "You don't have access to this web" },
        { status: 404 }
      );
    }

    const user = tenant.user?.username === username ? tenant.user : null;

    // If user doesn't exist or password doesn't match
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = generateToken({ id: user.id, email: user.email });

    // Login successful, return role and success message
    return NextResponse.json(
      {
        message: "Login successful",
        data: {
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            tenantId: user.tenantId,
            isTwoFactorEnabled: user.isTwoFactorEnabled,
          },
          token: token,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred during login: " + error },
      { status: 500 }
    );
  }
}
