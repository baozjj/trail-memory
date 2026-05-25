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

  const imprintTypes = [
    { id: "xihu-biaoyi", label: "西湖标毅线", coverPath: "/imprint-types/西湖标毅线.png", sortOrder: 0 },
    { id: "wugongshan", label: "武功山", coverPath: "/imprint-types/武功山.png", sortOrder: 1 },
    { id: "xihu-aixin", label: "西湖爱心线", coverPath: "/imprint-types/西湖爱心线.png", sortOrder: 2 },
    { id: "wutongshan", label: "梧桐山", coverPath: "/imprint-types/梧桐山.png", sortOrder: 3 },
  ];

  for (const item of imprintTypes) {
    await prisma.imprintType.upsert({
      where: { id: item.id },
      update: {
        label: item.label,
        coverPath: item.coverPath,
        sortOrder: item.sortOrder,
        enabled: true,
      },
      create: { ...item, enabled: true },
    });
  }

  console.log(`[seed] ImprintType ready: ${imprintTypes.length} items`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
