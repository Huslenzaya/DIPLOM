import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT update question
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; questionId: string }> }
) {
  try {
    const { id, questionId } = await params;
    const { question, type, options, answer, points, order } = await request.json();

    // Verify question belongs to quiz
    const existingQuestion = await prisma.quizQuestion.findUnique({
      where: { id: questionId }
    });

    if (!existingQuestion || existingQuestion.quizId !== id) {
      return NextResponse.json(
        { error: "Асуулт олдсонгүй" },
        { status: 404 }
      );
    }

    const updatedQuestion = await prisma.quizQuestion.update({
      where: { id: questionId },
      data: {
        question,
        type,
        options,
        answer,
        points,
        order
      }
    });

    return NextResponse.json(updatedQuestion);
  } catch (error: any) {
    console.error("Error updating question:", error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: "Асуулт олдсонгүй" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Асуултыг өөрчлөхөд алдаа гарлаа" },
      { status: 500 }
    );
  }
}

// DELETE question
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; questionId: string }> }
) {
  try {
    const { id, questionId } = await params;

    // Verify question belongs to quiz
    const existingQuestion = await prisma.quizQuestion.findUnique({
      where: { id: questionId }
    });

    if (!existingQuestion || existingQuestion.quizId !== id) {
      return NextResponse.json(
        { error: "Асуулт олдсонгүй" },
        { status: 404 }
      );
    }

    await prisma.quizQuestion.delete({
      where: { id: questionId }
    });

    return NextResponse.json(
      { message: "Асуулт устгалаа" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting question:", error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: "Асуулт олдсонгүй" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Асуултыг устгахад алдаа гарлаа" },
      { status: 500 }
    );
  }
}
