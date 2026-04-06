import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../src/lib/prisma";

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
