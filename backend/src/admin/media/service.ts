import fs from "node:fs";
import path from "node:path";
import { prisma } from "../../lib/prisma.js";
import { UPLOAD_DIR } from "../../lib/upload-dir.js";
import { notFoundError } from "../../types/app-error.js";
import type { ListMediaQuery } from "./schema.js";
import type {
  AdminMediaListItem,
  AdminMediaReferences,
  AdminMediaStats,
  AdminMediaMemoryRef,
  AdminMediaUserRef,
} from "./types.js";

const UPLOAD_URL_PREFIX = "/uploads/";

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

type ReferenceBucket = {
  memories: AdminMediaMemoryRef[];
  users: AdminMediaUserRef[];
};

function parseImages(raw: string): string[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

/** 从 URL 解析上传文件名，拒绝路径穿越 */
export function uploadUrlToFilename(url: string): string | null {
  if (!url.startsWith(UPLOAD_URL_PREFIX)) return null;
  const raw = url.slice(UPLOAD_URL_PREFIX.length);
  let filename: string;
  try {
    filename = decodeURIComponent(raw);
  } catch {
    return null;
  }
  if (
    !filename ||
    filename.includes("..") ||
    filename.includes("/") ||
    filename.includes("\\")
  ) {
    return null;
  }
  return filename;
}

function guessMimeType(filename: string): string | null {
  const ext = path.extname(filename).toLowerCase();
  return MIME_BY_EXT[ext] ?? null;
}

function isSafeFilename(filename: string): boolean {
  return Boolean(filename) && !filename.includes("..") && !filename.includes("/") && !filename.includes("\\");
}

async function listUploadFiles(): Promise<
  Array<{ filename: string; sizeBytes: number; mtime: Date }>
> {
  let entries: fs.Dirent[];
  try {
    entries = await fs.promises.readdir(UPLOAD_DIR, { withFileTypes: true });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw err;
  }

  const files = entries.filter((entry) => entry.isFile());
  const rows = await Promise.all(
    files.map(async (entry) => {
      const absolutePath = path.join(UPLOAD_DIR, entry.name);
      const stat = await fs.promises.stat(absolutePath);
      return {
        filename: entry.name,
        sizeBytes: stat.size,
        mtime: stat.mtime,
      };
    }),
  );

  return rows.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
}

async function buildReferenceIndex(): Promise<Map<string, ReferenceBucket>> {
  const index = new Map<string, ReferenceBucket>();

  const getBucket = (filename: string): ReferenceBucket => {
    let bucket = index.get(filename);
    if (!bucket) {
      bucket = { memories: [], users: [] };
      index.set(filename, bucket);
    }
    return bucket;
  };

  const memories = await prisma.memory.findMany({
    select: {
      id: true,
      title: true,
      images: true,
      deletedAt: true,
      user: { select: { email: true, nickname: true } },
    },
  });

  for (const memory of memories) {
    const seen = new Set<string>();
    for (const url of parseImages(memory.images)) {
      const filename = uploadUrlToFilename(url);
      if (!filename || seen.has(filename)) continue;
      seen.add(filename);
      const bucket = getBucket(filename);
      bucket.memories.push({
        id: memory.id,
        title: memory.title,
        ownerEmail: memory.user.email,
        ownerNickname: memory.user.nickname,
        deletedAt: memory.deletedAt?.toISOString() ?? null,
      });
    }
  }

  const users = await prisma.user.findMany({
    where: { avatarUrl: { not: "" } },
    select: { id: true, email: true, nickname: true, avatarUrl: true },
  });

  for (const user of users) {
    const filename = uploadUrlToFilename(user.avatarUrl);
    if (!filename) continue;
    const bucket = getBucket(filename);
    if (bucket.users.some((item) => item.id === user.id)) continue;
    bucket.users.push({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    });
  }

  return index;
}

function countReferences(bucket: ReferenceBucket | undefined): number {
  if (!bucket) return 0;
  return bucket.memories.length + bucket.users.length;
}

/** 存储统计 */
export async function getMediaStats(): Promise<AdminMediaStats> {
  const files = await listUploadFiles();
  return {
    fileCount: files.length,
    totalBytes: files.reduce((sum, file) => sum + file.sizeBytes, 0),
  };
}

/** 分页列出上传目录中的图片 */
export async function listMedia(query: ListMediaQuery) {
  const [files, referenceIndex] = await Promise.all([
    listUploadFiles(),
    buildReferenceIndex(),
  ]);

  let items: AdminMediaListItem[] = files.map((file) => {
    const bucket = referenceIndex.get(file.filename);
    const referenceCount = countReferences(bucket);
    return {
      filename: file.filename,
      url: `${UPLOAD_URL_PREFIX}${file.filename}`,
      sizeBytes: file.sizeBytes,
      mimeType: guessMimeType(file.filename),
      mtime: file.mtime.toISOString(),
      referenced: referenceCount > 0,
      referenceCount,
    };
  });

  const q = query.q?.trim().toLowerCase();
  if (q) {
    items = items.filter((item) => item.filename.toLowerCase().includes(q));
  }

  if (query.referenced === true) {
    items = items.filter((item) => item.referenced);
  } else if (query.referenced === false) {
    items = items.filter((item) => !item.referenced);
  }

  const total = items.length;
  const skip = (query.page - 1) * query.pageSize;
  const paged = items.slice(skip, skip + query.pageSize);

  return {
    items: paged,
    total,
    page: query.page,
    pageSize: query.pageSize,
  };
}

/** 单文件引用详情 */
export async function getMediaReferences(
  filename: string,
): Promise<AdminMediaReferences> {
  if (!isSafeFilename(filename)) {
    throw notFoundError("文件不存在");
  }

  const absolutePath = path.join(UPLOAD_DIR, filename);
  let stat: fs.Stats;
  try {
    stat = await fs.promises.stat(absolutePath);
  } catch {
    throw notFoundError("文件不存在");
  }
  if (!stat.isFile()) {
    throw notFoundError("文件不存在");
  }

  const referenceIndex = await buildReferenceIndex();
  const bucket = referenceIndex.get(filename) ?? { memories: [], users: [] };

  return {
    filename,
    url: `${UPLOAD_URL_PREFIX}${filename}`,
    sizeBytes: stat.size,
    mimeType: guessMimeType(filename),
    mtime: stat.mtime.toISOString(),
    memories: bucket.memories,
    users: bucket.users,
  };
}
