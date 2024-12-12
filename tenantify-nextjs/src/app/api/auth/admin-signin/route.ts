import bcrypt from "bcrypt"
import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/db"
import { generateToken } from "@/lib/jwt"

// Define the POST handler
export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    // Check if user exists in the database
    const user = await prisma.user.findUnique({
      where: {
        username: username, // Assuming 'username' is unique
      },
    })

    // If user doesn't exist or password doesn't match
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Generate JWT
    const token = generateToken({ id: user.id, email: user.email })

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
          },
          token: token,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "An error occurred during login: " + error },
      { status: 500 }
    )
  }
}
