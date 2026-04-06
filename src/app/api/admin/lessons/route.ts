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
    const { grade, kind, title, shortDesc, htmlContent, quizKey, order } =
      body;

    if (!grade || !kind || !title) {
      return NextResponse.json(
        { error: "Анги, төрөл, нэр оруулна уу" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lesson.create({
      data: {
        grade: parseInt(grade),
        kind,
        title,
        shortDesc: shortDesc || null,
        htmlContent: htmlContent || null,
        quizKey: quizKey || null,
        order: order || 0,
      },
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
