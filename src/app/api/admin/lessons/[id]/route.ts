import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single lesson
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
      include: {
        completedBy: {
          select: { userId: true, completedAt: true },
        },
        quiz: {
          select: { id: true, title: true, type: true, totalPoints: true, questions: { select: { id: true } } }
        }
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Хичээл олдсонгүй" },
        { status: 404 }
      );
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return NextResponse.json(
      { error: "Хичээлийг авч чадсангүй" },
      { status: 500 }
    );
  }
}

// PUT - Update lesson
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { grade, kind, title, shortDesc, htmlContent, quizId, order } =
      body;

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

    const lesson = await prisma.lesson.update({
      where: { id: params.id },
      data: {
        ...(grade !== undefined && { grade: parseInt(grade) }),
        ...(kind && { kind }),
        ...(title && { title }),
        ...(shortDesc !== undefined && { shortDesc }),
        ...(htmlContent !== undefined && { htmlContent }),
        ...(quizId !== undefined && { quizId: quizId || null }),
        ...(order !== undefined && { order }),
      },
      include: { quiz: true }
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Error updating lesson:", error);
    return NextResponse.json(
      { error: "Хичээлийг шинэчлэхэд алдаа гарлаа" },
      { status: 500 }
    );
  }
}

// DELETE lesson
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.lesson.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Хичээл устгалаа" });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return NextResponse.json(
      { error: "Хичээлийг устгахэд алдаа гарлаа" },
      { status: 500 }
    );
  }
}
