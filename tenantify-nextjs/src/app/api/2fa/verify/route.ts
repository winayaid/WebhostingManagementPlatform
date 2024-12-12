import { NextRequest, NextResponse } from "next/server";
import speakeasy from "speakeasy";

import prisma from "@/lib/db";

// Define the POST handler
export async function POST(req: NextRequest) {
  try {
    const { userId, token } = await req.json();

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.isTwoFactorEnabled) {
      return NextResponse.json(
        { message: "2FA not enabled for this user." },
        { status: 400 }
      );
    }

    const isTokenValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret ? user.twoFactorSecret : "",
      encoding: "base32",
      token,
    });

    if (!isTokenValid) {
      return NextResponse.json(
        { message: "Invalid 2FA token." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "2FA verification successful." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error || "Internal Server Error" },
      { status: 500 }
    );
  }
}
