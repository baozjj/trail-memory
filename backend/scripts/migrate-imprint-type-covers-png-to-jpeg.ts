/**
 * 将 frontend/public/imprint-types/ 下的类型封面从 PNG 转为 JPEG（mozjpeg），
 * 并同步更新 Prisma：ImprintType.coverPath、Memory.coverUrl 中带 /imprint-types/*.png 的引用。
 *
 * 用法：
 *   npm run imprint-covers:migrate-jpeg --prefix backend
 *   npm run imprint-covers:migrate-jpeg --prefix backend -- --dry-run
 */
import fs from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import sharp from "sharp";
import { PrismaClient } from "@prisma/client";
import { IMPRINT_TYPES_DIR } from "../src/lib/imprint-types-dir.js";

const prisma = new PrismaClient();

const JPEG_QUALITY = 82;

async function convertFile(pngPath: string, jpgPath: string): Promise<void> {
  await sharp(pngPath)
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(jpgPath);
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: { "dry-run": { type: "boolean", default: false } },
    strict: true,
  });
  const dryRun = values["dry-run"] === true;

  const entries = await fs.readdir(IMPRINT_TYPES_DIR, { withFileTypes: true });
  const pngFiles = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".png"))
    .map((e) => e.name);

  if (pngFiles.length === 0) {
    console.log("[imprint-covers] 未发现 .png 封面，无需转换。");
    return;
  }

  console.log(`[imprint-covers] 目录: ${IMPRINT_TYPES_DIR}`);
  console.log(`[imprint-covers] 待处理 PNG: ${pngFiles.join(", ")}`);

  for (const name of pngFiles) {
    const pngPath = path.join(IMPRINT_TYPES_DIR, name);
    const jpgName = name.replace(/\.png$/i, ".jpg");
    const jpgPath = path.join(IMPRINT_TYPES_DIR, jpgName);
    const publicPath = `/imprint-types/${name}`;
    const newPublicPath = `/imprint-types/${jpgName}`;

    if (dryRun) {
      console.log(`[dry-run] 将转换: ${publicPath} -> ${newPublicPath}`);
      continue;
    }

    const beforeStat = await fs.stat(pngPath);
    await convertFile(pngPath, jpgPath);
    const afterStat = await fs.stat(jpgPath);
    await fs.unlink(pngPath);

    console.log(
      `[+] ${name} -> ${jpgName} (${beforeStat.size} B -> ${afterStat.size} B)`,
    );

    const typeUpdates = await prisma.imprintType.updateMany({
      where: { coverPath: publicPath },
      data: { coverPath: newPublicPath },
    });
    if (typeUpdates.count > 0) {
      console.log(`    ImprintType.coverPath 更新 ${typeUpdates.count} 条`);
    }

    const memories = await prisma.memory.findMany({
      where: { coverUrl: publicPath },
      select: { id: true },
    });
    for (const m of memories) {
      await prisma.memory.update({
        where: { id: m.id },
        data: { coverUrl: newPublicPath },
      });
    }
    if (memories.length > 0) {
      console.log(`    Memory.coverUrl 更新 ${memories.length} 条`);
    }
  }

  const remainingPngInDb = await prisma.imprintType.count({
    where: { coverPath: { endsWith: ".png" } },
  });
  if (remainingPngInDb > 0) {
    console.warn(
      `[!] 仍有 ${remainingPngInDb} 条 ImprintType.coverPath 以 .png 结尾，请检查路径是否与文件名一致。`,
    );
  }

  if (dryRun) {
    console.log("[imprint-covers] dry-run 结束，未写入文件或数据库。");
  } else {
    console.log("[imprint-covers] 完成。");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
