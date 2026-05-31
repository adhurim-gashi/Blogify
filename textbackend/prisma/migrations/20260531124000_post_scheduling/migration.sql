-- AlterTable
ALTER TABLE "Post" ADD COLUMN "scheduledAt" DATETIME;
ALTER TABLE "Post" ADD COLUMN "isScheduled" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Post_status_isScheduled_scheduledAt_idx" ON "Post"("status", "isScheduled", "scheduledAt");
