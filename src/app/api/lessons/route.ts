import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
