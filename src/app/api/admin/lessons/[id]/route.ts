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
    const { grade, kind, title, shortDesc, htmlContent, quizKey, order } =
      body;

    const lesson = await prisma.lesson.update({
      where: { id: params.id },
      data: {
        ...(grade !== undefined && { grade: parseInt(grade) }),
        ...(kind && { kind }),
        ...(title && { title }),
        ...(shortDesc !== undefined && { shortDesc }),
        ...(htmlContent !== undefined && { htmlContent }),
        ...(quizKey !== undefined && { quizKey }),
        ...(order !== undefined && { order }),
      },
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
