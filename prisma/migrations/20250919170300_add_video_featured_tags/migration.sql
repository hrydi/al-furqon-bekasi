-- AlterTable
ALTER TABLE "public"."videos" ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tags" TEXT;

-- CreateIndex
CREATE INDEX "videos_isFeatured_idx" ON "public"."videos"("isFeatured");
