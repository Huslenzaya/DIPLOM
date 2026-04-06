import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all questions for a quiz
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const questions = await prisma.quizQuestion.findMany({
      where: { quizId: id },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Асуултуудыг авч чадсангүй" },
      { status: 500 }
    );
  }
}

// POST new question to quiz
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { question, type, options, answer, points, order } = await request.json();

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Асуулт ба хариу оруулна уу" },
        { status: 400 }
      );
    }

    // Verify quiz exists
    const quiz = await prisma.quiz.findUnique({ where: { id } });
    if (!quiz) {
      return NextResponse.json(
        { error: "Шалгалт олдсонгүй" },
        { status: 404 }
      );
    }

    // Get next order
    const lastQuestion = await prisma.quizQuestion.findFirst({
      where: { quizId: id },
      orderBy: { order: 'desc' }
    });

    const newQuestion = await prisma.quizQuestion.create({
      data: {
        quizId: id,
        question,
        type: type || "multiple",
        options: options || [],
        answer,
        points: points || 10,
        order: order !== undefined ? order : (lastQuestion?.order || 0) + 1
      }
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Асуулт үүсгэхэд алдаа гарлаа" },
      { status: 500 }
    );
  }
}
