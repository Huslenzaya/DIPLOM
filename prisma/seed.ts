import { prisma } from "../src/lib/prisma";

async function main() {
  const user = await prisma.user.upsert({
    where: {
      email: "test@galigtan.mn",
    },
    update: {},
    create: {
      name: "Тест хэрэглэгч",
      email: "test@galigtan.mn",
      passwordHash: "123456",
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
