-- CreateTable
CREATE TABLE "public"."videos" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "youtubeUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "duration" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT NOT NULL DEFAULT 'general',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "videos_isActive_idx" ON "public"."videos"("isActive");

-- CreateIndex
CREATE INDEX "videos_orderIndex_idx" ON "public"."videos"("orderIndex");

-- CreateIndex
CREATE INDEX "videos_category_idx" ON "public"."videos"("category");

-- CreateIndex
CREATE INDEX "videos_createdAt_idx" ON "public"."videos"("createdAt");
