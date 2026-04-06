import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single quiz with questions
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: { orderBy: { order: 'asc' } },
        lessons: { select: { id: true, title: true, grade: true } },
        _count: { select: { attempts: true } }
      }
    });

    if (!quiz) {
      return NextResponse.json(
        { error: "Шалгалт олдсонгүй" },
        { status: 404 }
      );
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { error: "Шалгалтыг авч чадсангүй" },
      { status: 500 }
    );
  }
}

// PUT update quiz
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title, description, grade, type, totalPoints } = await request.json();

    const quiz = await prisma.quiz.update({
      where: { id },
      data: {
        title,
        description,
        grade: grade ? parseInt(grade) : undefined,
        type,
        totalPoints,
      },
      include: {
        questions: true,
        _count: { select: { questions: true, attempts: true } }
      }
    });

    return NextResponse.json(quiz);
  } catch (error: any) {
    console.error("Error updating quiz:", error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: "Шалгалт олдсонгүй" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Шалгалтыг өөрчлөхөд алдаа гарлаа" },
      { status: 500 }
    );
  }
}

// DELETE quiz
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.quiz.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: "Шалгалт устгалаа" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting quiz:", error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: "Шалгалт олдсонгүй" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Шалгалтыг устгахад алдаа гарлаа" },
      { status: 500 }
    );
  }
}
