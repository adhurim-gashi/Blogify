-- AlterTable
ALTER TABLE "Media" ADD COLUMN "originalFilepath" TEXT;
ALTER TABLE "Media" ADD COLUMN "optimizedFilepath" TEXT;
ALTER TABLE "Media" ADD COLUMN "webpFilepath" TEXT;
ALTER TABLE "Media" ADD COLUMN "optimizedSize" INTEGER;
