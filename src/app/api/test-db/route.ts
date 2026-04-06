import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany();

    return NextResponse.json({
      ok: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("DB TEST ERROR:", error);
    return NextResponse.json(
      { ok: false, message: "Database error" },
      { status: 500 },
    );
  }
}
