-- CreateEnum equivalent for SQLite (stored as TEXT)
-- AlterTable
ALTER TABLE "User" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Memory" ADD COLUMN "deletedAt" DATETIME;

-- CreateIndex
CREATE INDEX "Memory_deletedAt_idx" ON "Memory"("deletedAt");
