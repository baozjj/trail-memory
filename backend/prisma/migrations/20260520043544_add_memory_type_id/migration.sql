-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Memory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "typeId" TEXT,
    "coverUrl" TEXT NOT NULL DEFAULT '',
    "heightWeight" REAL NOT NULL DEFAULT 1,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "linkSuffix" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "meta" TEXT NOT NULL DEFAULT '',
    "images" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Memory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Memory" ("content", "coverUrl", "createdAt", "heightWeight", "id", "images", "isPublic", "linkSuffix", "meta", "title", "updatedAt", "userId") SELECT "content", "coverUrl", "createdAt", "heightWeight", "id", "images", "isPublic", "linkSuffix", "meta", "title", "updatedAt", "userId" FROM "Memory";
DROP TABLE "Memory";
ALTER TABLE "new_Memory" RENAME TO "Memory";
CREATE UNIQUE INDEX "Memory_linkSuffix_key" ON "Memory"("linkSuffix");
CREATE INDEX "Memory_userId_idx" ON "Memory"("userId");
CREATE INDEX "Memory_isPublic_idx" ON "Memory"("isPublic");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
