-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('super_admin', 'admin', 'editor', 'user');

-- CreateEnum
CREATE TYPE "public"."Category" AS ENUM ('kegiatan', 'berita', 'sumbangan', 'fasilitas', 'profil', 'kajian');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('published', 'draft', 'archived');

-- CreateEnum
CREATE TYPE "public"."DonationStatus" AS ENUM ('active', 'completed', 'suspended');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('bank_transfer', 'qris', 'ewallet', 'cash');

-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('pending', 'paid', 'failed', 'cancelled');

-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('high', 'medium', 'low');

-- CreateEnum
CREATE TYPE "public"."EventType" AS ENUM ('page_view', 'article_view', 'donation_view', 'download', 'share', 'user_registration', 'admin_login', 'donation_payment');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'user',
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "avatar" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "loginCount" INTEGER NOT NULL DEFAULT 0,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "image" TEXT,
    "category" "public"."Category" NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'draft',
    "authorId" TEXT,
    "authorName" TEXT,
    "authorAvatar" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "tags" JSONB,
    "metaData" JSONB,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."donations" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "detail" TEXT,
    "image" TEXT,
    "targetAmount" DOUBLE PRECISION NOT NULL,
    "collectedAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "status" "public"."DonationStatus" NOT NULL DEFAULT 'active',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "bankName" TEXT,
    "accountNumber" TEXT,
    "accountName" TEXT,
    "qrisCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "totalDonors" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."donation_transactions" (
    "id" TEXT NOT NULL,
    "donationId" TEXT NOT NULL,
    "donorName" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "message" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "paymentMethod" "public"."PaymentMethod" NOT NULL,
    "status" "public"."TransactionStatus" NOT NULL DEFAULT 'pending',
    "transactionId" TEXT,
    "paymentUrl" TEXT,
    "expiresAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donation_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."news" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "image" TEXT,
    "category" TEXT NOT NULL DEFAULT 'umum',
    "priority" "public"."Priority" NOT NULL DEFAULT 'medium',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT,
    "authorName" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "summary" TEXT,
    "metaData" JSONB,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."menus" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "parentId" TEXT,
    "description" TEXT,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."site_statistics" (
    "id" TEXT NOT NULL,
    "metricName" TEXT NOT NULL,
    "metricValue" BIGINT NOT NULL DEFAULT 0,
    "metricDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."analytics_events" (
    "id" TEXT NOT NULL,
    "eventType" "public"."EventType" NOT NULL,
    "resourceId" TEXT,
    "resourceType" TEXT,
    "sessionId" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."dashboard_cache" (
    "id" TEXT NOT NULL,
    "cacheKey" TEXT NOT NULL,
    "cacheData" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dashboard_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."system_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'string',
    "category" TEXT NOT NULL DEFAULT 'general',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."activity_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "userEmail" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT,
    "resourceId" TEXT,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."visitor_tracking" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "referrerUrl" TEXT,
    "landingPage" TEXT NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "sessionStart" TIMESTAMP(3) NOT NULL,
    "sessionEnd" TIMESTAMP(3),
    "sessionDuration" INTEGER,
    "pageViews" INTEGER NOT NULL DEFAULT 1,
    "isUnique" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visitor_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."daily_stats" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalVisitors" INTEGER NOT NULL DEFAULT 0,
    "uniqueVisitors" INTEGER NOT NULL DEFAULT 0,
    "totalPageViews" INTEGER NOT NULL DEFAULT 0,
    "totalArticleViews" INTEGER NOT NULL DEFAULT 0,
    "totalDonations" INTEGER NOT NULL DEFAULT 0,
    "totalDonationAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalNewsViews" INTEGER NOT NULL DEFAULT 0,
    "totalUsers" INTEGER NOT NULL DEFAULT 0,
    "newUsers" INTEGER NOT NULL DEFAULT 0,
    "bounceRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgSessionDuration" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."monthly_stats" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "totalVisitors" INTEGER NOT NULL DEFAULT 0,
    "uniqueVisitors" INTEGER NOT NULL DEFAULT 0,
    "totalPageViews" INTEGER NOT NULL DEFAULT 0,
    "totalArticleViews" INTEGER NOT NULL DEFAULT 0,
    "totalDonations" INTEGER NOT NULL DEFAULT 0,
    "totalDonationAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalNewsViews" INTEGER NOT NULL DEFAULT 0,
    "totalUsers" INTEGER NOT NULL DEFAULT 0,
    "newUsers" INTEGER NOT NULL DEFAULT 0,
    "bounceRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgSessionDuration" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monthly_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "loginAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logoutAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "public"."articles"("slug");

-- CreateIndex
CREATE INDEX "articles_category_idx" ON "public"."articles"("category");

-- CreateIndex
CREATE INDEX "articles_status_idx" ON "public"."articles"("status");

-- CreateIndex
CREATE INDEX "articles_featured_idx" ON "public"."articles"("featured");

-- CreateIndex
CREATE INDEX "articles_publishedAt_idx" ON "public"."articles"("publishedAt");

-- CreateIndex
CREATE INDEX "articles_category_status_featured_idx" ON "public"."articles"("category", "status", "featured");

-- CreateIndex
CREATE UNIQUE INDEX "donations_slug_key" ON "public"."donations"("slug");

-- CreateIndex
CREATE INDEX "donations_status_idx" ON "public"."donations"("status");

-- CreateIndex
CREATE INDEX "donations_targetAmount_idx" ON "public"."donations"("targetAmount");

-- CreateIndex
CREATE INDEX "donations_collectedAmount_idx" ON "public"."donations"("collectedAmount");

-- CreateIndex
CREATE INDEX "donations_status_createdAt_idx" ON "public"."donations"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "donation_transactions_transactionId_key" ON "public"."donation_transactions"("transactionId");

-- CreateIndex
CREATE INDEX "donation_transactions_donationId_idx" ON "public"."donation_transactions"("donationId");

-- CreateIndex
CREATE INDEX "donation_transactions_status_idx" ON "public"."donation_transactions"("status");

-- CreateIndex
CREATE INDEX "donation_transactions_createdAt_idx" ON "public"."donation_transactions"("createdAt");

-- CreateIndex
CREATE INDEX "donation_transactions_transactionId_idx" ON "public"."donation_transactions"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "news_slug_key" ON "public"."news"("slug");

-- CreateIndex
CREATE INDEX "news_category_idx" ON "public"."news"("category");

-- CreateIndex
CREATE INDEX "news_priority_idx" ON "public"."news"("priority");

-- CreateIndex
CREATE INDEX "news_publishedAt_idx" ON "public"."news"("publishedAt");

-- CreateIndex
CREATE INDEX "news_priority_publishedAt_idx" ON "public"."news"("priority", "publishedAt");

-- CreateIndex
CREATE INDEX "menus_orderIndex_idx" ON "public"."menus"("orderIndex");

-- CreateIndex
CREATE INDEX "menus_isActive_idx" ON "public"."menus"("isActive");

-- CreateIndex
CREATE INDEX "menus_parentId_idx" ON "public"."menus"("parentId");

-- CreateIndex
CREATE INDEX "site_statistics_metricName_idx" ON "public"."site_statistics"("metricName");

-- CreateIndex
CREATE INDEX "site_statistics_metricDate_idx" ON "public"."site_statistics"("metricDate");

-- CreateIndex
CREATE UNIQUE INDEX "site_statistics_metricName_metricDate_key" ON "public"."site_statistics"("metricName", "metricDate");

-- CreateIndex
CREATE INDEX "analytics_events_eventType_idx" ON "public"."analytics_events"("eventType");

-- CreateIndex
CREATE INDEX "analytics_events_resourceId_idx" ON "public"."analytics_events"("resourceId");

-- CreateIndex
CREATE INDEX "analytics_events_createdAt_idx" ON "public"."analytics_events"("createdAt");

-- CreateIndex
CREATE INDEX "analytics_events_resourceType_resourceId_idx" ON "public"."analytics_events"("resourceType", "resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "dashboard_cache_cacheKey_key" ON "public"."dashboard_cache"("cacheKey");

-- CreateIndex
CREATE INDEX "dashboard_cache_cacheKey_idx" ON "public"."dashboard_cache"("cacheKey");

-- CreateIndex
CREATE INDEX "dashboard_cache_expiresAt_idx" ON "public"."dashboard_cache"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "public"."system_settings"("key");

-- CreateIndex
CREATE INDEX "system_settings_category_idx" ON "public"."system_settings"("category");

-- CreateIndex
CREATE INDEX "system_settings_isActive_idx" ON "public"."system_settings"("isActive");

-- CreateIndex
CREATE INDEX "activity_logs_userId_idx" ON "public"."activity_logs"("userId");

-- CreateIndex
CREATE INDEX "activity_logs_action_idx" ON "public"."activity_logs"("action");

-- CreateIndex
CREATE INDEX "activity_logs_resource_idx" ON "public"."activity_logs"("resource");

-- CreateIndex
CREATE INDEX "activity_logs_createdAt_idx" ON "public"."activity_logs"("createdAt");

-- CreateIndex
CREATE INDEX "activity_logs_userId_action_idx" ON "public"."activity_logs"("userId", "action");

-- CreateIndex
CREATE INDEX "visitor_tracking_visitorId_idx" ON "public"."visitor_tracking"("visitorId");

-- CreateIndex
CREATE INDEX "visitor_tracking_sessionStart_idx" ON "public"."visitor_tracking"("sessionStart");

-- CreateIndex
CREATE INDEX "visitor_tracking_ipAddress_idx" ON "public"."visitor_tracking"("ipAddress");

-- CreateIndex
CREATE INDEX "visitor_tracking_isUnique_idx" ON "public"."visitor_tracking"("isUnique");

-- CreateIndex
CREATE INDEX "visitor_tracking_country_idx" ON "public"."visitor_tracking"("country");

-- CreateIndex
CREATE UNIQUE INDEX "daily_stats_date_key" ON "public"."daily_stats"("date");

-- CreateIndex
CREATE INDEX "daily_stats_date_idx" ON "public"."daily_stats"("date");

-- CreateIndex
CREATE INDEX "monthly_stats_year_idx" ON "public"."monthly_stats"("year");

-- CreateIndex
CREATE INDEX "monthly_stats_month_idx" ON "public"."monthly_stats"("month");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_stats_year_month_key" ON "public"."monthly_stats"("year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_sessionId_key" ON "public"."user_sessions"("sessionId");

-- CreateIndex
CREATE INDEX "user_sessions_userId_idx" ON "public"."user_sessions"("userId");

-- CreateIndex
CREATE INDEX "user_sessions_sessionId_idx" ON "public"."user_sessions"("sessionId");

-- CreateIndex
CREATE INDEX "user_sessions_isActive_idx" ON "public"."user_sessions"("isActive");

-- CreateIndex
CREATE INDEX "user_sessions_expiresAt_idx" ON "public"."user_sessions"("expiresAt");

-- AddForeignKey
ALTER TABLE "public"."donation_transactions" ADD CONSTRAINT "donation_transactions_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "public"."donations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menus" ADD CONSTRAINT "menus_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."menus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
