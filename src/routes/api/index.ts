import express from "express";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import grahaSubagdjaRouter from "./grahaSubagdja";

config();

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use((req, res, next) => {
  next();
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Al-Furqon Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      dashboard: "/api/home/dashboard",
      statistics: "/api/statistics/public",
      articles: "/api/articles",
      donations: "/api/donations",
      news: "/api/news",
      auth: "/api/auth",
      documentation: "/api-docs",
    },
    documentation: "API untuk Content Management System Masjid Al-Furqon",
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Al-Furqon Backend is running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    port: PORT,
  });
});

app.get("/api/home/dashboard", async (req, res) => {
  try {
    const [stats, latestArticles, activeDonations, latestNews] =
      await Promise.all([
        prisma.$transaction([
          prisma.article.count({ where: { status: "published" } }),
          prisma.donation.count({ where: { status: "active" } }),
          prisma.news.count({ where: { publishedAt: { not: null } } }),
          prisma.user.count(),
        ]),
        prisma.article.findMany({
          where: { status: "published" },
          orderBy: { createdAt: "desc" },
          take: 3,
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            image: true,
            category: true,
            publishedAt: true,
            authorName: true,
          },
        }),
        prisma.donation.findMany({
          where: { status: "active" },
          orderBy: { createdAt: "desc" },
          take: 3,
          select: {
            id: true,
            title: true,
            description: true,
            image: true,
            targetAmount: true,
            collectedAmount: true,
            endDate: true,
          },
        }),
        prisma.news.findMany({
          where: { publishedAt: { not: null } },
          orderBy: { publishedAt: "desc" },
          take: 5,
          select: {
            id: true,
            title: true,
            content: true,
            priority: true,
            publishedAt: true,
          },
        }),
      ]);

    res.json({
      success: true,
      data: {
        statistics: {
          totalArticles: stats[0],
          activeDonations: stats[1],
          totalNews: stats[2],
          totalUsers: stats[3],
        },
        latestArticles,
        activeDonations,
        latestNews,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data dashboard",
    });
  }
});

app.get("/api/statistics/public", async (req, res) => {
  try {
    const stats = await prisma.$transaction([
      prisma.article.count({ where: { status: "published" } }),
      prisma.donation.count({ where: { status: "active" } }),
      prisma.donation.aggregate({
        where: { status: "active" },
        _sum: { targetAmount: true, collectedAmount: true },
      }),
      prisma.news.count({ where: { publishedAt: { not: null } } }),
    ]);

    res.json({
      success: true,
      data: {
        totalArticles: stats[0],
        activeDonations: stats[1],
        totalDonationTarget: stats[2]._sum.targetAmount || 0,
        totalDonationCollected: stats[2]._sum.collectedAmount || 0,
        totalNews: stats[3],
        donationProgress: stats[2]._sum.targetAmount
          ? Math.round(
              ((stats[2]._sum.collectedAmount || 0) /
                stats[2]._sum.targetAmount) *
                100
            )
          : 0,
      },
    });
  } catch (error) {
    console.error("Statistics error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil statistik",
    });
  }
});

app.get("/api/articles", async (req, res) => {
  try {
    const { category, limit, page } = req.query;
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where: any = { status: "published" };
    if (category) {
      where.category = category;
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: limitNum,
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          image: true,
          category: true,
          publishedAt: true,
          authorName: true,
          authorAvatar: true,
        },
      }),
      prisma.article.count({ where }),
    ]);

    res.json({
      success: true,
      data: articles,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Articles error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil artikel",
    });
  }
});

app.get("/api/donations", async (req, res) => {
  try {
    const { category, status = "active" } = req.query;

    const where: any = { status };
    if (category) {
      where.category = category;
    }

    const donations = await prisma.donation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        targetAmount: true,
        collectedAmount: true,
        endDate: true,
        createdAt: true,
      },
    });

    const donationsWithProgress = donations.map((donation) => ({
      ...donation,
      progress: Math.round(
        (donation.collectedAmount / donation.targetAmount) * 100
      ),
      remainingAmount: donation.targetAmount - donation.collectedAmount,
    }));

    res.json({
      success: true,
      data: donationsWithProgress,
    });
  } catch (error) {
    console.error("Donations error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil donasi",
    });
  }
});

app.post("/api/donations", async (req, res) => {
  try {
    const {
      title,
      description,
      targetAmount,
      collectedAmount = 0,
      imageUrl,
      endDate,
    } = req.body;

    if (!title || !description || !targetAmount) {
      return res.status(400).json({
        success: false,
        message: "Title, description, dan targetAmount harus diisi",
      });
    }

    const donation = await prisma.donation.create({
      data: {
        title,
        description,
        targetAmount: Number(targetAmount),
        collectedAmount: Number(collectedAmount),
        image: imageUrl,
        status: "active",
        endDate: endDate
          ? new Date(endDate)
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        slug: title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      },
    });

    res.status(201).json({
      success: true,
      message: "Donasi berhasil dibuat",
      data: donation,
    });
  } catch (error) {
    console.error("Create donation error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal membuat donasi",
    });
  }
});

app.get("/api/news", async (req, res) => {
  try {
    const { priority, limit } = req.query;
    const limitNum = parseInt(limit as string) || 10;

    const where: any = { publishedAt: { not: null } };
    if (priority) {
      where.priority = priority;
    }

    const news = await prisma.news.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: limitNum,
      select: {
        id: true,
        title: true,
        content: true,
        priority: true,
        publishedAt: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error("News error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil berita",
    });
  }
});

app.post("/api/articles", async (req, res) => {
  try {
    const { title, content, excerpt, imageUrl, published = false } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title dan content harus diisi",
      });
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        description: excerpt || content.substring(0, 200) + "...",
        image: imageUrl,
        category: "kegiatan",
        status: published ? "published" : "draft",
        slug: title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
        publishedAt: published ? new Date() : null,
      },
    });

    res.status(201).json({
      success: true,
      message: "Artikel berhasil dibuat",
      data: article,
    });
  } catch (error) {
    console.error("Create article error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal membuat artikel",
    });
  }
});

app.post("/api/news", async (req, res) => {
  try {
    const { title, content, excerpt, imageUrl } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title dan content harus diisi",
      });
    }

    const news = await prisma.news.create({
      data: {
        title,
        content,
        description: excerpt || content.substring(0, 200) + "...",
        image: imageUrl,
        priority: "medium",
        publishedAt: new Date(),
        slug: title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      },
    });

    res.status(201).json({
      success: true,
      message: "Berita berhasil dibuat",
      data: news,
    });
  } catch (error) {
    console.error("Create news error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal membuat berita",
    });
  }
});

// Graha Subagdja routes
app.use("/api/v1/graha-subagdja", grahaSubagdjaRouter);

app.use((err: any, req: any, res: any, next: any) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint tidak ditemukan",
    path: req.originalUrl,
  });
});

export default app;
