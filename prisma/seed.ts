import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("123456", 10);

  const user = await prisma.user.upsert({
    where: {
      email: "test@galigtan.mn",
    },
    update: {
      passwordHash: hashedPassword,
    },
    create: {
      name: "Тест хэрэглэгч",
      email: "test@galigtan.mn",
      passwordHash: hashedPassword,
    },
  });

  await prisma.userProgress.upsert({
    where: {
      userId: user.id,
    },
    update: {},
    create: {
      userId: user.id,
      selectedGrade: 6,
      xp: 0,
      streak: 0,
      lives: 5,
      placementLevel: 1,
    },
  });

  await prisma.unlockedGrade.upsert({
    where: {
      userId_grade: {
        userId: user.id,
        grade: 6,
      },
    },
    update: {},
    create: {
      userId: user.id,
      grade: 6,
    },
  });

  // Seed lessons for each grade
  const grades = [6, 7, 8, 9, 10, 11, 12];
  const kinds = ["lesson", "rule", "practice"];

  for (const grade of grades) {
    for (const kind of kinds) {
      for (let i = 1; i <= 3; i++) {
        await prisma.lesson.upsert({
          where: {
            id: `grade_${grade}_${kind}_${i}`,
          },
          update: {},
          create: {
            id: `grade_${grade}_${kind}_${i}`,
            grade,
            kind,
            title: `${grade} анги - ${kind} ${i}`,
            shortDesc: `Энэ нь ${grade} ангийн ${kind} хичээл юм`,
            htmlContent: `<h2>${grade} анги - ${kind} ${i}</h2><p>Энэ хичээлийн агуулга байна</p>`,

            order: i,
          },
        });
      }
    }
  }

  console.log("Seed done:", user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
