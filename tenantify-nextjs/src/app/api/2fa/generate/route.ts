import { NextRequest, NextResponse } from "next/server"
import QRCode from "qrcode"
import speakeasy from "speakeasy"

import prisma from "@/lib/db"

// Define the POST handler
export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

    // Generate a secret for the user
    const secret = speakeasy.generateSecret({
      name: `WHCMS (${userId})`,
    })

    // Check if otpauth_url is defined
    if (!secret.otpauth_url) {
      throw new Error("Failed to generate OTP Auth URL")
    }

    // Generate a QR code URL
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url)

    // Save the secret temporarily
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret.base32,
        qrCode: qrCodeUrl,
        isTwoFactorEnabled: true,
      },
    })

    return NextResponse.json(
      {
        qrCodeUrl: qrCodeUrl,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: error || "Internal Server Error" },
      { status: 500 }
    )
  }
}
