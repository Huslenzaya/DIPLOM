import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all lessons
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const grade = searchParams.get("grade");
    const kind = searchParams.get("kind");

    const where: any = {};
    if (grade) where.grade = parseInt(grade);
    if (kind) where.kind = kind;

    const lessons = await prisma.lesson.findMany({
      where,
      include: {
        quiz: {
          select: { id: true, title: true, type: true, totalPoints: true }
        }
      },
      orderBy: [{ grade: "asc" }, { order: "asc" }],
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json(
      { error: "Хичээлүүдийг авч чадсангүй" },
      { status: 500 }
    );
  }
}

// POST new lesson
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { grade, kind, title, shortDesc, htmlContent, quizId, order } =
      body;

    if (!grade || !kind || !title) {
      return NextResponse.json(
        { error: "Анги, төрөл, нэр оруулна уу" },
        { status: 400 }
      );
    }

    // If quizId provided, verify quiz exists
    if (quizId) {
      const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
      if (!quiz) {
        return NextResponse.json(
          { error: "Шалгалт олдсонгүй" },
          { status: 400 }
        );
      }
    }

    const lesson = await prisma.lesson.create({
      data: {
        grade: parseInt(grade),
        kind,
        title,
        shortDesc: shortDesc || null,
        htmlContent: htmlContent || null,
        quizId: quizId || null,
        order: order || 0,
      },
      include: { quiz: true }
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error("Error creating lesson:", error);
    return NextResponse.json(
      { error: "Хичээл үүсгэхэд алдаа гарлаа" },
      { status: 500 }
    );
  }
}
