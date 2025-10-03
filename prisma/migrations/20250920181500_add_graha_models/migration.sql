-- CreateEnum
CREATE TYPE "public"."GrahaGalleryCategory" AS ENUM ('facility', 'event', 'ceremony', 'interior', 'exterior');

-- CreateTable
CREATE TABLE "public"."graha_umkm_partners" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "services" JSONB NOT NULL,
    "contact" JSONB NOT NULL,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "graha_umkm_partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."graha_gallery" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "category" "public"."GrahaGalleryCategory" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "graha_gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."graha_faq" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "graha_faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."graha_facility_info" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "facilities" JSONB NOT NULL,
    "price" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "graha_facility_info_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "graha_umkm_partners_isActive_idx" ON "public"."graha_umkm_partners"("isActive");

-- CreateIndex
CREATE INDEX "graha_umkm_partners_category_idx" ON "public"."graha_umkm_partners"("category");

-- CreateIndex
CREATE INDEX "graha_umkm_partners_orderIndex_idx" ON "public"."graha_umkm_partners"("orderIndex");

-- CreateIndex
CREATE INDEX "graha_gallery_isActive_idx" ON "public"."graha_gallery"("isActive");

-- CreateIndex
CREATE INDEX "graha_gallery_category_idx" ON "public"."graha_gallery"("category");

-- CreateIndex
CREATE INDEX "graha_gallery_orderIndex_idx" ON "public"."graha_gallery"("orderIndex");

-- CreateIndex
CREATE INDEX "graha_faq_isActive_idx" ON "public"."graha_faq"("isActive");

-- CreateIndex
CREATE INDEX "graha_faq_orderIndex_idx" ON "public"."graha_faq"("orderIndex");

-- CreateIndex
CREATE INDEX "graha_facility_info_isActive_idx" ON "public"."graha_facility_info"("isActive");
