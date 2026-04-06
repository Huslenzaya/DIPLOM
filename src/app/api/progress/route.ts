import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const TEST_EMAIL = "test@galigtan.mn";

export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: TEST_EMAIL },
      include: {
        progress: true,
        unlockedGrades: true,
        completedLessons: true,
      },
    });

    if (!user || !user.progress) {
      return NextResponse.json(
        { ok: false, message: "User progress not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      progress: {
        selectedGrade: user.progress.selectedGrade,
        xp: user.progress.xp,
        streak: user.progress.streak,
        lives: user.progress.lives,
        placementLevel: user.progress.placementLevel,
        unlockedGrades: user.unlockedGrades
          .map((g) => g.grade)
          .sort((a, b) => a - b),
        completedLessons: user.completedLessons.map((l) => l.lessonId),
      },
    });
  } catch (error) {
    console.error("PROGRESS GET ERROR:", error);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 },
    );
  }
}
