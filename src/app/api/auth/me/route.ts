import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const payload = verifyJwt(token);
    if (!payload.userId) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        progress: true,
        unlockedGrades: true,
        completedLessons: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      progress: user.progress,
      unlockedGrades: user.unlockedGrades.map((item) => item.grade),
      completedLessons: user.completedLessons.map((item) => item.lessonId),
    });
  } catch (error) {
    console.error("Me error:", error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
