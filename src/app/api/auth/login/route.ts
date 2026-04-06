import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { createJwt, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "И-мэйл болон нууц үг оруулна уу." },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        progress: true,
        unlockedGrades: true,
        completedLessons: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "И-мэйл эсвэл нууц үг буруу байна." },
        { status: 401 },
      );
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "И-мэйл эсвэл нууц үг буруу байна." },
        { status: 401 },
      );
    }

    const token = createJwt({ userId: user.id });
    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        progress: user.progress,
        unlockedGrades: user.unlockedGrades.map((item) => item.grade),
        completedLessons: user.completedLessons.map((item) => item.lessonId),
      },
      { status: 200 },
    );

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}
