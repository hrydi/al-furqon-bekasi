import { PrismaClient } from "@prisma/client";
import cacheService from "./cacheService";

const prisma = new PrismaClient();

/**
 * Home Service - untuk data homepage
 */
export class HomeService {
  /**
   * Get complete homepage data
   */
  static async getHomePageData() {
    const cacheKey = "homepage:data";

    // Try get from cache first
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch data from database
    const [featuredArticles, activeDonations, latestNews, publicStats] =
      await Promise.all([
        this.getFeaturedArticles(6),
        this.getActiveDonations(3),
        this.getLatestNews(3),
        this.getPublicStatistics(),
      ]);

    const homeData = {
      articles: featuredArticles,
      donations: activeDonations,
      news: latestNews,
      statistics: publicStats,
    };

    // Cache for 30 minutes
    await cacheService.set(cacheKey, homeData, 1800);

    return homeData;
  }

  /**
   * Get featured articles
   */
  static async getFeaturedArticles(limit: number = 6) {
    const cacheKey = `articles:featured:${limit}`;

    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const articles = await prisma.article.findMany({
      where: {
        status: "published",
        featured: true,
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        image: true,
        category: true,
        publishedAt: true,
        authorName: true,
        views: true,
        likes: true,
      },
    });

    await cacheService.set(cacheKey, articles, 900); // Cache 15 minutes
    return articles;
  }

  /**
   * Get active donations
   */
  static async getActiveDonations(limit: number = 3) {
    const cacheKey = `donations:active:${limit}`;

    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const donations = await prisma.donation.findMany({
      where: { status: "active" },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        image: true,
        targetAmount: true,
        collectedAmount: true,
        totalDonors: true,
        endDate: true,
      },
    });

    const donationsWithProgress = donations.map((donation) => ({
      ...donation,
      progress: Math.min(
        (donation.collectedAmount / donation.targetAmount) * 100,
        100
      ),
    }));

    await cacheService.set(cacheKey, donationsWithProgress, 300);
    return donationsWithProgress;
  }

  /**
   * Get latest news
   */
  static async getLatestNews(limit: number = 3) {
    const cacheKey = `news:latest:${limit}`;

    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const news = await prisma.news.findMany({
      where: { publishedAt: { not: null } },
      orderBy: { publishedAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        image: true,
        category: true,
        priority: true,
        publishedAt: true,
        authorName: true,
        views: true,
      },
    });

    await cacheService.set(cacheKey, news, 600);
    return news;
  }

  /**
   * Get public statistics
   */
  static async getPublicStatistics() {
    const cacheKey = "stats:public";

    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const [totalDonations, totalArticles, totalDonors, totalAmount] =
      await Promise.all([
        prisma.donation.count({ where: { status: { not: "suspended" } } }),
        prisma.article.count({ where: { status: "published" } }),
        prisma.donationTransaction.count({ where: { status: "paid" } }),
        prisma.donationTransaction.aggregate({
          where: { status: "paid" },
          _sum: { amount: true },
        }),
      ]);

    const stats = {
      totalDonations,
      totalArticles,
      totalDonors,
      totalAmount: totalAmount._sum.amount || 0,
      lastUpdated: new Date().toISOString(),
    };

    await cacheService.set(cacheKey, stats, 3600);
    return stats;
  }

  /**
   * Get article by slug or ID
   */
  static async getArticleBySlug(slug: string) {
    let article = await prisma.article.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        content: true,
        image: true,
        category: true,
        status: true,
        publishedAt: true,
        authorName: true,
        authorAvatar: true,
        views: true,
        likes: true,
        tags: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // If not found by slug, try to find by ID
    if (!article) {
      article = await prisma.article.findUnique({
        where: { id: slug },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          content: true,
          image: true,
          category: true,
          status: true,
          publishedAt: true,
          authorName: true,
          authorAvatar: true,
          views: true,
          likes: true,
          tags: true,
          featured: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    return article;
  }

  /**
   * Get related articles by category
   */
  static async getRelatedArticles(
    category: string,
    excludeId: string,
    limit: number = 3
  ) {
    const cacheKey = `articles:related:${category}:${excludeId}:${limit}`;

    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const articles = await prisma.article.findMany({
      where: {
        status: "published",
        category: category as any,
        id: { not: excludeId },
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        image: true,
        category: true,
        publishedAt: true,
        authorName: true,
        views: true,
        likes: true,
      },
    });

    await cacheService.set(cacheKey, articles, 900); // Cache 15 minutes
    return articles;
  }

  /**
   * Get all articles with pagination
   */
  static async getAllArticles(
    page: number = 1,
    limit: number = 12,
    category?: string
  ) {
    const skip = (page - 1) * limit;

    const where: any = { status: "published" };
    if (category && category !== "all") {
      where.category = category as any;
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          image: true,
          category: true,
          publishedAt: true,
          authorName: true,
          views: true,
          likes: true,
          featured: true,
        },
      }),
      prisma.article.count({ where }),
    ]);

    return {
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }

  /**
   * Get donation by slug or ID
   */
  static async getDonationBySlug(slug: string) {
    // Try to find by slug first
    let donation = await prisma.donation.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        detail: true,
        image: true,
        targetAmount: true,
        collectedAmount: true,
        status: true,
        totalDonors: true,
        startDate: true,
        endDate: true,
        bankName: true,
        accountNumber: true,
        accountName: true,
        qrisCode: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // If not found by slug, try to find by ID
    if (!donation) {
      donation = await prisma.donation.findUnique({
        where: { id: slug },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          detail: true,
          image: true,
          targetAmount: true,
          collectedAmount: true,
          status: true,
          totalDonors: true,
          startDate: true,
          endDate: true,
          bankName: true,
          accountNumber: true,
          accountName: true,
          qrisCode: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    if (donation) {
      return {
        ...donation,
        progress: Math.min(
          (donation.collectedAmount / donation.targetAmount) * 100,
          100
        ),
      };
    }

    return null;
  }

  /**
   * Get all donations with pagination
   */
  static async getAllDonations(
    page: number = 1,
    limit: number = 12,
    status?: string
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status && status !== "all") {
      where.status = status as any;
    }

    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          image: true,
          targetAmount: true,
          collectedAmount: true,
          status: true,
          totalDonors: true,
          endDate: true,
        },
      }),
      prisma.donation.count({ where }),
    ]);

    // Calculate progress for each donation
    const donationsWithProgress = donations.map((donation) => ({
      ...donation,
      progress: Math.min(
        (donation.collectedAmount / donation.targetAmount) * 100,
        100
      ),
    }));

    return {
      donations: donationsWithProgress,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }

  /**
   * Get news by slug or ID
   */
  static async getNewsBySlug(slug: string) {
    // Try to find by slug first
    let news = await prisma.news.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        content: true,
        image: true,
        category: true,
        priority: true,
        publishedAt: true,
        authorName: true,
        views: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // If not found by slug, try to find by ID
    if (!news) {
      news = await prisma.news.findUnique({
        where: { id: slug },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          content: true,
          image: true,
          category: true,
          priority: true,
          publishedAt: true,
          authorName: true,
          views: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    return news;
  }

  /**
   * Get all news with pagination
   */
  static async getAllNews(
    page: number = 1,
    limit: number = 12,
    category?: string
  ) {
    const skip = (page - 1) * limit;

    const where: any = { publishedAt: { not: null } };
    if (category && category !== "all") {
      where.category = category;
    }

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          image: true,
          category: true,
          priority: true,
          publishedAt: true,
          authorName: true,
          views: true,
        },
      }),
      prisma.news.count({ where }),
    ]);

    return {
      news,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }

  /**
   * Increment article views
   */
  static async incrementArticleViews(id: string) {
    const article = await prisma.article.update({
      where: { id },
      data: { views: { increment: 1 } },
      select: { views: true },
    });

    return article;
  }

  static async incrementNewsViews(id: string) {
    const news = await prisma.news.update({
      where: { id },
      data: { views: { increment: 1 } },
      select: { views: true },
    });

    return news;
  }
}
