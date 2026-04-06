import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all quizzes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const grade = searchParams.get("grade");
    const type = searchParams.get("type");

    const where: any = {};
    if (grade) where.grade = parseInt(grade);
    if (type) where.type = type;

    const quizzes = await prisma.quiz.findMany({
      where,
      include: {
        questions: {
          select: { id: true, question: true, points: true, order: true },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { questions: true, attempts: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "Шалгалтуудыг авч чадсангүй" },
      { status: 500 }
    );
  }
}

// POST new quiz
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, grade, type, totalPoints } = body;

    if (!title || !grade) {
      return NextResponse.json(
        { error: "Нэр ба анги оруулна уу" },
        { status: 400 }
      );
    }

    // Check if title already exists
    const existing = await prisma.quiz.findUnique({ where: { title } });
    if (existing) {
      return NextResponse.json(
        { error: "Энэ нэрсийн шалгалт аль хэдийн байна" },
        { status: 400 }
      );
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description: description || null,
        grade: parseInt(grade),
        type: type || "assignment",
        totalPoints: totalPoints || 100,
      },
      include: {
        questions: true,
        _count: { select: { questions: true, attempts: true } }
      }
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json(
      { error: "Шалгалт үүсгэхэд алдаа гарлаа" },
      { status: 500 }
    );
  }
}
