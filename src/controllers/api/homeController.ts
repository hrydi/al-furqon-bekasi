import { Request, Response, NextFunction } from 'express';
import { HomeService } from '../../services/homeService';
import { ApiResponse } from '../../utils/response';
import { PrismaClient } from '@prisma/client';
import { prisma } from '../../models/prisma';

/**
 * Home Controller - untuk endpoints homepage
 */
export class HomeController {
  /**
   * GET /api/v1/home/dashboard
   * Get complete homepage data
   */
  static async getHomePageData(req: Request, res: Response, next: NextFunction) {
    try {
      const homeData = await HomeService.getHomePageData();
      
      const response = ApiResponse.success(
        homeData,
        'Data homepage berhasil dimuat'
      );
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/statistics/public
   * Get public website statistics
   */
  static async getPublicStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await HomeService.getPublicStatistics();
      
      const response = ApiResponse.success(
        stats,
        'Statistik publik berhasil dimuat'
      );
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/articles/featured
   * Get featured articles
   */
  static async getFeaturedArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 6;
      const articles = await HomeService.getFeaturedArticles(limit);
      
      const response = ApiResponse.success(
        articles,
        'Artikel featured berhasil dimuat'
      );
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/donations/active
   * Get active donations
   */
  static async getActiveDonations(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 3;
      const donations = await HomeService.getActiveDonations(limit);
      
      const response = ApiResponse.success(
        donations,
        'Donasi aktif berhasil dimuat'
      );
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/news/latest
   * Get latest news
   */
  static async getLatestNews(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 3;
      const news = await HomeService.getLatestNews(limit);
      
      const response = ApiResponse.success(
        news,
        'Berita terbaru berhasil dimuat'
      );
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/news/top
   * Get top news (alias for latest)
   */
  static async getTopNews(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 3;
      const news = await HomeService.getLatestNews(limit);
      
      const response = ApiResponse.success(
        news,
        'Berita top berhasil dimuat'
      );
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/health (Health check endpoint)
   */
  static async healthCheck(req: Request, res: Response, next: NextFunction) {
    try {
      const healthData = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
        database: 'connected'
      };
      
      const response = ApiResponse.success(
        healthData,
        'Al-Furqon Backend is running'
      );
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/newsletter/subscribe
   * Newsletter subscription
   */
  static async subscribeNewsletter(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, name } = req.body;
      
      if (!email) {
        return res.status(400).json(
          ApiResponse.error('Email is required', 400)
        );
      }

      // TODO: Add newsletter subscription logic here
      // For now, just return success
      
      const response = ApiResponse.success(
        { subscribed: true },
        'Berhasil berlangganan newsletter'
      );
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/contact/submit
   * Contact form submission
   */
  static async submitContact(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, subject, message } = req.body;
      
      if (!name || !email || !message) {
        return res.status(400).json(
          ApiResponse.error('Name, email, and message are required', 400)
        );
      }

      // TODO: Add contact form logic here (save to DB, send email, etc.)
      // For now, just return success
      
      const response = ApiResponse.success(
        { submitted: true },
        'Pesan berhasil dikirim'
      );
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/search
   * Global search
   */
  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, type = 'all' } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json(
          ApiResponse.error('Search query is required', 400)
        );
      }

      // TODO: Implement proper search logic
      // For now, return empty results
      
      const searchResults = {
        articles: [],
        donations: [],
        news: [],
        total: 0
      };
      
      const response = ApiResponse.success(
        searchResults,
        'Pencarian berhasil'
      );
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/donations/stats
   * Get donation statistics
   */
  static async getDonationStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await HomeService.getPublicStatistics();
      
      // Transform stats for donations specific format
      const donationStats = {
        totalAmount: stats.totalAmount || 0,
        totalPrograms: stats.totalDonations || 0,
        totalDonors: stats.totalDonors || 0,
        thisMonthAmount: stats.totalAmount || 0 // TODO: Calculate actual monthly amount
      };
      
      const response = ApiResponse.success(
        donationStats,
        'Statistik donasi berhasil dimuat'
      );
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/menus/navigation
   * Get navigation menus
   */
  static async getNavigationMenus(req: Request, res: Response, next: NextFunction) {
    try {
      // TODO: Implement menu system
      // For now, return default navigation
      
      const defaultMenus = [
        { id: '1', title: 'Beranda', url: '/', order: 1, active: true },
        { id: '2', title: 'Tentang', url: '/about', order: 2, active: true },
        { id: '3', title: 'Kegiatan', url: '/articles', order: 3, active: true },
        { id: '4', title: 'Donasi', url: '/donations', order: 4, active: true },
        { id: '5', title: 'Berita', url: '/news', order: 5, active: true },
        { id: '6', title: 'Kontak', url: '/contact', order: 6, active: true }
      ];
      
      const response = ApiResponse.success(
        defaultMenus,
        'Menu navigasi berhasil dimuat'
      );
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/articles/slug/:slug
   * Get article by slug
   */
  static async getArticleBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const article = await HomeService.getArticleBySlug(slug);
      
      if (!article) {
        return res.status(404).json(
          ApiResponse.error('Article not found', 404)
        );
      }
      
      const response = ApiResponse.success(
        article,
        'Artikel berhasil dimuat'
      );
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/donations/slug/:slug
   * Get donation by slug
   */
  static async getDonationBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const donation = await HomeService.getDonationBySlug(slug);
      
      if (!donation) {
        return res.status(404).json(
          ApiResponse.error('Donation not found', 404)
        );
      }
      
      const response = ApiResponse.success(
        donation,
        'Donasi berhasil dimuat'
      );
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/news/slug/:slug
   * Get news by slug
   */
  static async getNewsBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const news = await HomeService.getNewsBySlug(slug);
      
      if (!news) {
        return res.status(404).json(
          ApiResponse.error('News not found', 404)
        );
      }
      
      const response = ApiResponse.success(
        news,
        'Berita berhasil dimuat'
      );
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/articles/:id/view
   * Increment article views
   */
  static async incrementArticleViews(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await HomeService.incrementArticleViews(id);
      
      const response = ApiResponse.success(
        result,
        'Views updated'
      );
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/articles/:id/like
   * Like an article (increment likes)
   */
  static async likeArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      // TODO: Implement proper like system with user tracking
      // For now, just increment likes count
      const article = await prisma.article.update({
        where: { id },
        data: { likes: { increment: 1 } },
        select: { likes: true }
      });
      
      const response = ApiResponse.success(
        article,
        'Article liked'
      );
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/news/:id/views
   * Increment news views
   */
  static async incrementNewsViews(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await HomeService.incrementNewsViews(id);
      
      const response = ApiResponse.success(
        result,
        'Views updated'
      );
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/articles/:id/related
   * Get related articles
   */
  static async getRelatedArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const limit = parseInt(req.query.limit as string) || 3;
      
      // Get current article to find category
      const currentArticle = await prisma.article.findUnique({
        where: { id },
        select: { category: true }
      });
      
      if (!currentArticle) {
        return res.status(404).json(
          ApiResponse.error('Article not found', 404)
        );
      }
      
      // Find related articles in same category
      const relatedArticles = await prisma.article.findMany({
        where: {
          category: currentArticle.category,
          status: 'published',
          id: { not: id }
        },
        take: limit,
        orderBy: { publishedAt: 'desc' },
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
          likes: true
        }
      });
      
      const response = ApiResponse.success(
        relatedArticles,
        'Related articles loaded'
      );
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/donations/:transactionId/status
   * Get donation transaction status
   */
  static async getDonationStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { transactionId } = req.params;
      
      // TODO: Implement proper transaction status checking
      // For now, return mock status
      
      const status = {
        status: 'pending',
        amount: 0
      };
      
      const response = ApiResponse.success(
        status,
        'Transaction status retrieved'
      );
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/donations/submit
   * Submit a donation
   */
  static async submitDonation(req: Request, res: Response, next: NextFunction) {
    try {
      const donationData = req.body;
      
      // TODO: Implement proper donation submission logic
      // For now, return success
      
      const result = {
        transactionId: `TXN${Date.now()}`,
        paymentUrl: undefined
      };
      
      const response = ApiResponse.success(
        result,
        'Donation submitted successfully'
      );
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/analytics/track
   * Track analytics event
   */
  static async trackEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const eventData = req.body;
      
      // TODO: Implement proper analytics tracking
      // For now, just return success
      
      const response = ApiResponse.success(
        { tracked: true },
        'Event tracked'
      );
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/analytics/views
   * Get page views
   */
  static async getPageViews(req: Request, res: Response, next: NextFunction) {
    try {
      const { resourceId } = req.query;
      
      // TODO: Implement proper analytics
      // For now, return mock data
      
      const views = {
        views: Math.floor(Math.random() * 1000) + 100
      };
      
      const response = ApiResponse.success(
        views,
        'Page views retrieved'
      );
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/feedback
   * Submit feedback
   */
  static async submitFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const feedbackData = req.body;
      
      // TODO: Implement proper feedback system
      // For now, return success
      
      const response = ApiResponse.success(
        { message: 'Feedback submitted successfully' },
        'Feedback received'
      );
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/feedback
   * Get feedback
   */
  static async getFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const { resourceType, resourceId } = req.query;
      
      // TODO: Implement proper feedback retrieval
      // For now, return mock data
      
      const feedback = {
        averageRating: 4.5,
        totalComments: 10,
        feedback: []
      };
      
      const response = ApiResponse.success(
        feedback,
        'Feedback retrieved'
      );
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/articles
   * Get all articles with pagination and filtering
   */
  static async getAllArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const category = req.query.category as string;
      const published = req.query.published as string;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};
      if (category) where.category = category;
      if (published !== undefined) {
        where.status = published === 'true' ? 'published' : 'draft';
      }

      const [articles, totalCount] = await Promise.all([
        prisma.article.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
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
            updatedAt: true
          }
        }),
        prisma.article.count({ where })
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      const response = ApiResponse.success(
        {
          data: articles,
          pagination: {
            page,
            limit,
            totalItems: totalCount,
            totalPages
          }
        },
        'Articles loaded successfully'
      );

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/articles/:id
   * Get article by ID
   */
  static async getArticleById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const article = await prisma.article.findUnique({
        where: { id },
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
          updatedAt: true
        }
      });

      if (!article) {
        return res.status(404).json(
          ApiResponse.error('Article not found', 404)
        );
      }

      const response = ApiResponse.success(
        article,
        'Article loaded successfully'
      );

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/donations
   * Get all donations with pagination and filtering
   */
  static async getAllDonations(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const title = req.query.title as string;
      const status = req.query.status as string;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};
      if (title) {
        where.title = { contains: title, mode: 'insensitive' };
      }
      if (status) where.status = status;

      const [donations, totalCount] = await Promise.all([
        prisma.donation.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
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
            updatedAt: true
          }
        }),
        prisma.donation.count({ where })
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      // Add progress calculation
      const donationsWithProgress = donations.map(donation => ({
        ...donation,
        progress: Math.min((donation.collectedAmount / donation.targetAmount) * 100, 100)
      }));

      const response = ApiResponse.success(
        {
          data: donationsWithProgress,
          pagination: {
            page,
            limit,
            totalItems: totalCount,
            totalPages
          }
        },
        'Donations loaded successfully'
      );

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/donations/:id
   * Get donation by ID
   */
  static async getDonationById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const donation = await prisma.donation.findUnique({
        where: { id },
        include: {
          transactions: {
            where: { status: 'paid' },
            select: {
              id: true,
              donorName: true,
              amount: true,
              message: true,
              isAnonymous: true,
              paidAt: true
            },
            orderBy: { paidAt: 'desc' }
          }
        }
      });

      if (!donation) {
        return res.status(404).json(
          ApiResponse.error('Donation not found', 404)
        );
      }

      // Add progress calculation
      const donationWithProgress = {
        ...donation,
        progress: Math.min((donation.collectedAmount / donation.targetAmount) * 100, 100)
      };

      const response = ApiResponse.success(
        donationWithProgress,
        'Donation loaded successfully'
      );

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/news
   * Get all news with pagination and filtering
   */
  static async getAllNews(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const priority = req.query.priority as string;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = { publishedAt: { not: null } };
      if (priority) where.priority = priority;

      const [news, totalCount] = await Promise.all([
        prisma.news.findMany({
          where,
          orderBy: { publishedAt: 'desc' },
          skip,
          take: limit,
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
            updatedAt: true
          }
        }),
        prisma.news.count({ where })
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      const response = ApiResponse.success(
        {
          data: news,
          pagination: {
            page,
            limit,
            totalItems: totalCount,
            totalPages
          }
        },
        'News loaded successfully'
      );

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/news/:id
   * Get news by ID
   */
  static async getNewsById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const news = await prisma.news.findUnique({
        where: { id },
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
          updatedAt: true
        }
      });

      if (!news) {
        return res.status(404).json(
          ApiResponse.error('News not found', 404)
        );
      }

      const response = ApiResponse.success(
        news,
        'News loaded successfully'
      );

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // ==================== VIDEOS ====================

  /**
   * GET /api/v1/videos
   * Get all videos with pagination and filtering
   */
  static async getAllVideos(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const category = req.query.category as string;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = { isActive: true };
      if (category) where.category = category;

      const [videos, totalCount] = await Promise.all([
  (prisma as any).video.findMany({
          where,
          orderBy: { orderIndex: 'asc' },
          skip,
          take: limit,
          select: {
            id: true,
            title: true,
            description: true,
            youtubeUrl: true,
            thumbnailUrl: true,
            duration: true,
            category: true,
            viewCount: true,
            orderIndex: true,
            createdAt: true,
            updatedAt: true
          }
        }),
  (prisma as any).video.count({ where })
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      const response = ApiResponse.success(
        {
          data: videos,
          pagination: {
            page,
            limit,
            totalItems: totalCount,
            totalPages
          }
        },
        'Videos loaded successfully'
      );

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/videos/:id
   * Get video by ID
   */
  static async getVideoById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
  const video = await (prisma as any).video.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          description: true,
          youtubeUrl: true,
          thumbnailUrl: true,
          duration: true,
          category: true,
          viewCount: true,
          orderIndex: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!video || !video.isActive) {
        return res.status(404).json(
          ApiResponse.error('Video not found', 404)
        );
      }

      // Increment view count
      await (prisma as any).video.update({
        where: { id },
        data: { viewCount: { increment: 1 } }
      });

      const response = ApiResponse.success(
        video,
        'Video loaded successfully'
      );

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/videos/featured
   * Get featured videos (first 6 active videos ordered by orderIndex)
   */
  static async getFeaturedVideos(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 6;
      
  const videos = await (prisma as any).video.findMany({
        where: { isActive: true },
        orderBy: { orderIndex: 'asc' },
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          youtubeUrl: true,
          thumbnailUrl: true,
          duration: true,
          category: true,
          viewCount: true,
          createdAt: true
        }
      });

      const response = ApiResponse.success(
        videos,
        'Featured videos loaded successfully'
      );

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
