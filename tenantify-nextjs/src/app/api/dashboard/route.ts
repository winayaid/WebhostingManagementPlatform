import { NextResponse } from "next/server";

import prisma from "@/lib/db";

export async function GET(_req: Request) {
  try {
    const totalClients = await prisma.user.count({
      where: {
        role: "CLIENT",
      },
    });

    const totalTenants = await prisma.tenant.count();

    const data = {
      totalClients: totalClients,
      totalTenants: totalTenants,
    };

    return NextResponse.json(data, {
      status: 200,
      headers: { "Cache-Control": "no-cache" },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
