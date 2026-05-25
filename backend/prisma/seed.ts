import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = 10;

/** 开发环境种子：超级管理员 */
async function main() {
  const email = "admin@trail.local";
  const passwordHash = await bcrypt.hash("admin", BCRYPT_ROUNDS);

  await prisma.adminUser.upsert({
    where: { email },
    update: {
      passwordHash,
      displayName: "超级管理员",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
    create: {
      email,
      passwordHash,
      displayName: "超级管理员",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
  });

  console.log(`[seed] AdminUser ready: ${email} / admin`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
