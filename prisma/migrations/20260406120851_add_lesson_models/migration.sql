-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'lesson',
    "title" TEXT NOT NULL,
    "shortDesc" TEXT,
    "htmlContent" TEXT,
    "quizKey" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lesson_grade_idx" ON "Lesson"("grade");

-- CreateIndex
CREATE INDEX "Lesson_kind_idx" ON "Lesson"("kind");

-- CreateIndex
CREATE INDEX "CompletedLesson_lessonId_idx" ON "CompletedLesson"("lessonId");

-- AddForeignKey
ALTER TABLE "CompletedLesson" ADD CONSTRAINT "CompletedLesson_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
