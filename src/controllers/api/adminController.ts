import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AdminService } from '../../services/adminService';
import { ApiResponse } from '../../utils/response';
import {
  AdminLoginRequest,
  AdminRefreshTokenRequest,
  AdminLogoutRequest,
  CreateArticleRequest,
  UpdateArticleRequest,
  CreateDonationRequest,
  UpdateDonationRequest,
  CreateNewsRequest,
  UpdateNewsRequest,
  CreateUserRequest,
  UpdateUserRequest,
  AdminFilters
} from '../../types/admin';

export class AdminController {
  // ==================== AUTHENTICATION ====================

  /**
   * POST /api/v1/admin/auth/login
   * Admin login
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password, rememberMe }: AdminLoginRequest = req.body;

      if (!username || !password) {
        return res.status(400).json(
          ApiResponse.error('Username and password are required', 400)
        );
      }

      // Authenticate user
      const user = await AdminService.authenticateAdmin(username, password);
      
      // Generate tokens
      const { accessToken, refreshToken } = AdminService.generateTokens(user);
      
      // Store refresh token
      await AdminService.updateRefreshToken(user.id, refreshToken);

      // Prepare response
      const response = ApiResponse.success({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          permissions: user.permissions || [],
          isActive: user.isActive,
          lastLogin: user.lastLogin?.toISOString() || '',
          loginCount: user.loginCount,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString()
        },
        token: accessToken,
        refreshToken,
        expiresIn: 24 * 60 * 60, // 24 hours in seconds
        permissions: user.permissions || []
      }, 'Login successful');

      res.json(response);
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid credentials') {
        return res.status(401).json(
          ApiResponse.error('Invalid username or password', 401)
        );
      }
      next(error);
    }
  }

  /**
   * POST /api/v1/admin/auth/refresh
   * Refresh access token
   */
  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken }: AdminRefreshTokenRequest = req.body;

      if (!refreshToken) {
        return res.status(400).json(
          ApiResponse.error('Refresh token is required', 400)
        );
      }

      const tokens = await AdminService.refreshToken(refreshToken);
      
      const response = ApiResponse.success({
        token: tokens.accessToken,
        expiresIn: 24 * 60 * 60 // 24 hours in seconds
      }, 'Token refreshed successfully');

      res.json(response);
    } catch (error) {
      return res.status(401).json(
        ApiResponse.error('Invalid refresh token', 401)
      );
    }
  }

  /**
   * POST /api/v1/admin/auth/logout
   * Admin logout
   */
  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.admin?.id;

      if (adminId) {
        await AdminService.logout(adminId);
      }

      const response = ApiResponse.success(null, 'Logout successful');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/auth/me
   * Get current admin user
   */
  static async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.admin?.id;

      if (!adminId) {
        return res.status(401).json(
          ApiResponse.error('User not authenticated', 401)
        );
      }

      const user = await AdminService.getCurrentUser(adminId);
      
      const response = ApiResponse.success(user, 'Current user retrieved successfully');
      res.json(response);
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        return res.status(404).json(
          ApiResponse.error('User not found', 404)
        );
      }
      next(error);
    }
  }

  /**
   * POST /api/v1/admin/auth/refresh-all
   * Refresh all admin tokens (Super Admin only)
   */
  static async refreshAllTokens(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await AdminService.refreshAllAdminTokens();
      
      const response = ApiResponse.success({
        refreshedCount: results.length,
        users: results.map(r => ({
          userId: r.userId,
          username: r.username,
          email: r.email,
          role: r.role
        }))
      }, 'All admin tokens refreshed successfully');
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/admin/auth/logout-all
   * Logout all admin sessions (Super Admin only)
   */
  static async logoutAllSessions(req: Request, res: Response, next: NextFunction) {
    try {
      await AdminService.logoutAllSessions();
      
      const response = ApiResponse.success(null, 'All admin sessions logged out successfully');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/auth/debug
   * Debug endpoint for troubleshooting frontend issues
   */
  static async debugAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.replace('Bearer ', '');
      
      let debugInfo: any = {
        timestamp: new Date().toISOString(),
        hasAuthHeader: !!authHeader,
        hasToken: !!token,
        tokenLength: token?.length || 0,
        adminUser: req.admin || null,
        userAgent: req.headers['user-agent'],
        origin: req.headers.origin,
        headers: {
          authorization: authHeader ? 'Bearer [REDACTED]' : 'NOT_PROVIDED',
          contentType: req.headers['content-type'],
          origin: req.headers.origin,
          referer: req.headers.referer
        }
      };

      if (token) {
        try {
          const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
          const decoded = jwt.verify(token, jwtSecret) as any;
          debugInfo.tokenDecoded = {
            userId: decoded.userId,
            username: decoded.username,
            role: decoded.role,
            iat: decoded.iat,
            exp: decoded.exp,
            isExpired: decoded.exp < Date.now() / 1000
          };
        } catch (jwtError) {
          debugInfo.tokenError = (jwtError as Error).message;
        }
      }

      const response = ApiResponse.success(debugInfo, 'Debug information retrieved');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // ==================== DASHBOARD ====================

  /**
   * GET /api/v1/admin/dashboard
   * Get admin dashboard data
   */
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getDashboardStats();
      
      const response = ApiResponse.success(stats, 'Dashboard data retrieved successfully');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // ==================== ARTICLES MANAGEMENT ====================

  /**
   * GET /api/v1/admin/articles
   * Get articles with pagination and filters
   */
  static async getArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: AdminFilters = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        search: req.query.search as string,
        status: req.query.status as string,
        category: req.query.category as string,
        sortBy: req.query.sortBy as string || 'updatedAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
      };

      const result = await AdminService.getArticles(filters);
      
      const response = ApiResponse.success(result, 'Articles retrieved successfully');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/articles/:id
   * Get single article
   */
  static async getArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const article = await AdminService.getArticleById(id);
      
      if (!article) {
        return res.status(404).json(
          ApiResponse.error('Article not found', 404)
        );
      }

      const response = ApiResponse.success(article, 'Article retrieved successfully');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/admin/articles
   * Create new article
   */
  static async createArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const articleData: CreateArticleRequest = req.body;
      const authorName = req.admin?.username || 'Admin';

      // Validation
      if (!articleData.title || !articleData.content) {
        return res.status(400).json(
          ApiResponse.error('Title and content are required', 400)
        );
      }

      const article = await AdminService.createArticle(articleData, authorName);
      
      const response = ApiResponse.success(article, 'Article created successfully');
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/admin/articles/:id
   * Update article
   */
  static async updateArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData: UpdateArticleRequest = req.body;

      const article = await AdminService.updateArticle(id, updateData);
      
      const response = ApiResponse.success(article, 'Article updated successfully');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/admin/articles/:id
   * Delete article
   */
  static async deleteArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await AdminService.deleteArticle(id);
      
      const response = ApiResponse.success(null, 'Article deleted successfully');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }


  static async toggleFeaturedArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const article = await AdminService.toggleFeaturedArticle(id);
      
      const response = ApiResponse.success(article, 'Article featured status updated successfully');
      res.json(response);
    } catch (error) {
      if (error instanceof Error && error.message === 'Article not found') {
        return res.status(404).json(
          ApiResponse.error('Article not found', 404)
        );
      }
      next(error);
    }
  }

  /**
   * POST /api/v1/admin/articles/bulk-delete
   * Bulk delete articles
   */
  static async bulkDeleteArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids }: { ids: string[] } = req.body;

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json(
          ApiResponse.error('Article IDs array is required', 400)
        );
      }

      const deletedCount = await AdminService.bulkDeleteArticles(ids);
      
      const response = ApiResponse.success({ deletedCount }, `${deletedCount} articles deleted successfully`);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/admin/articles/:id/duplicate
   * Duplicate article
   */
  static async duplicateArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const authorName = req.admin?.username || 'Admin';
      
      const duplicatedArticle = await AdminService.duplicateArticle(id, authorName);
      
      const response = ApiResponse.success(duplicatedArticle, 'Article duplicated successfully');
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof Error && error.message === 'Article not found') {
        return res.status(404).json(
          ApiResponse.error('Article not found', 404)
        );
      }
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/articles/categories
   * Get available article categories
   */
  static async getArticleCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await AdminService.getArticleCategories();
      
      const response = ApiResponse.success(categories, 'Article categories retrieved successfully');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/articles/categories/valid
   * Get all valid category options with aliases
   */
  static async getValidCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = AdminService.getValidCategories();
      
      const response = ApiResponse.success(categories, 'Valid categories retrieved successfully');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/articles/tags
   * Get popular article tags
   */
  static async getArticleTags(req: Request, res: Response, next: NextFunction) {
    try {
      const tags = await AdminService.getPopularTags();
      
      const response = ApiResponse.success(tags, 'Popular tags retrieved successfully');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // ==================== DONATIONS MANAGEMENT ====================

  /**
   * GET /api/v1/admin/donations
   * Get donations with pagination and filters
   */
  static async getDonations(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: AdminFilters = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        search: req.query.search as string,
        status: req.query.status as string,
        sortBy: req.query.sortBy as string || 'updatedAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
      };

      const result = await AdminService.getDonations(filters);
      
      const response = ApiResponse.success(result, 'Donations retrieved successfully');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/donations/:id
   * Get single donation
   */
  static async getDonation(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const donation = await AdminService.getDonationById(id);
      
      if (!donation) {
        return res.status(404).json(
          ApiResponse.error('Donation not found', 404)
        );
      }

      const response = ApiResponse.success(donation, 'Donation retrieved successfully');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/admin/donations
   * Create new donation
   */
  static async createDonation(req: Request, res: Response, next: NextFunction) {
    try {
      const donationData: CreateDonationRequest = req.body;

      // Validation
      if (!donationData.title || !donationData.targetAmount) {
        return res.status(400).json(
          ApiResponse.error('Title and target amount are required', 400)
        );
      }

      const donation = await AdminService.createDonation(donationData);
      
      const response = ApiResponse.success(donation, 'Donation created successfully');
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/admin/donations/:id
   * Update donation
   */
  static async updateDonation(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData: UpdateDonationRequest = req.body;

      const donation = await AdminService.updateDonation(id, updateData);
      
      const response = ApiResponse.success(donation, 'Donation updated successfully');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/admin/donations/:id
   * Delete donation
   */
  static async deleteDonation(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await AdminService.deleteDonation(id);
      
      const response = ApiResponse.success(null, 'Donation deleted successfully');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // ==================== NEWS MANAGEMENT ====================

  /**
   * GET /api/v1/admin/news
   * Get news with pagination and filters
   */
  static async getNews(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: AdminFilters = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        search: req.query.search as string,
        category: req.query.category as string,
        sortBy: req.query.sortBy as string || 'updatedAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
      };

      const result = await AdminService.getNews(filters);
      
      const response = ApiResponse.success(result, 'News retrieved successfully');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/news/:id
   * Get single news
   */
  static async getNewsItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const news = await AdminService.getNewsById(id);
      
      if (!news) {
        return res.status(404).json(
          ApiResponse.error('News not found', 404)
        );
      }

      const response = ApiResponse.success(news, 'News retrieved successfully');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/admin/news
   * Create new news
   */
  static async createNews(req: Request, res: Response, next: NextFunction) {
    try {
      const newsData: CreateNewsRequest = req.body;
      const authorName = req.admin?.username || 'Admin';

      // Validation
      if (!newsData.title || !newsData.content) {
        return res.status(400).json(
          ApiResponse.error('Title and content are required', 400)
        );
      }

      const news = await AdminService.createNews(newsData, authorName);
      
      const response = ApiResponse.success(news, 'News created successfully');
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/admin/news/:id
   * Update news
   */
  static async updateNews(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData: UpdateNewsRequest = req.body;

      const news = await AdminService.updateNews(id, updateData);
      
      const response = ApiResponse.success(news, 'News updated successfully');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/admin/news/:id
   * Delete news
   */
  static async deleteNews(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await AdminService.deleteNews(id);
      
      const response = ApiResponse.success(null, 'News deleted successfully');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // ==================== USER MANAGEMENT ====================

  /**
   * GET /api/v1/admin/users
   * Get users with pagination and filters (Super Admin only)
   */
  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: AdminFilters = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        search: req.query.search as string,
        status: req.query.status as string,
        sortBy: req.query.sortBy as string || 'updatedAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
      };

      const result = await AdminService.getUsers(filters);
      
      const response = ApiResponse.success(result, 'Users retrieved successfully');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/admin/users
   * Create new user (Super Admin only)
   */
  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: CreateUserRequest = req.body;

      // Validation
      if (!userData.username || !userData.email || !userData.password) {
        return res.status(400).json(
          ApiResponse.error('Username, email, and password are required', 400)
        );
      }

      const user = await AdminService.createUser(userData);
      
      const response = ApiResponse.success(user, 'User created successfully');
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/admin/users/:id
   * Update user (Super Admin only)
   */
  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData: UpdateUserRequest = req.body;

      const user = await AdminService.updateUser(id, updateData);
      
      const response = ApiResponse.success(user, 'User updated successfully');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/admin/users/:id
   * Delete user (Super Admin only)
   */
  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Prevent deleting self
      if (id === req.admin?.id) {
        return res.status(400).json(
          ApiResponse.error('Cannot delete your own account', 400)
        );
      }

      await AdminService.deleteUser(id);
      
      const response = ApiResponse.success(null, 'User deleted successfully');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // ==================== TRANSACTIONS ====================

  /**
   * GET /api/v1/admin/transactions
   * Get transactions with pagination and filters
   */
  static async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: AdminFilters = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        search: req.query.search as string,
        status: req.query.status as string,
        dateFrom: req.query.dateFrom as string,
        dateTo: req.query.dateTo as string,
        sortBy: req.query.sortBy as string || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
      };

      const result = await AdminService.getTransactions(filters);
      
      const response = ApiResponse.success(result, 'Transactions retrieved successfully');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // ==================== VIDEOS MANAGEMENT ====================

  /**
   * GET /api/v1/admin/videos
   * Get videos with pagination and filters
   */
  static async getVideos(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: AdminFilters = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        search: req.query.search as string,
        category: req.query.category as string,
        isActive: req.query.isActive ? req.query.isActive === 'true' : undefined,
        sortBy: req.query.sortBy as string || 'orderIndex',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc'
      };

      const result = await AdminService.getVideos(filters);
      
      const response = ApiResponse.success(result, 'Videos retrieved successfully');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/videos/:id
   * Get single video
   */
  static async getVideo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const video = await AdminService.getVideoById(id);
      
      if (!video) {
        return res.status(404).json(
          ApiResponse.error('Video not found', 404)
        );
      }

      const response = ApiResponse.success(video, 'Video retrieved successfully');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/admin/videos
   * Create new video
   */
  static async createVideo(req: Request, res: Response, next: NextFunction) {
    try {
      const videoData = req.body;

      // Basic validation
      if (!videoData.title || !videoData.youtubeUrl) {
        return res.status(400).json(
          ApiResponse.error('Title and YouTube URL are required', 400)
        );
      }

      const video = await AdminService.createVideo(videoData);
      
      const response = ApiResponse.success(video, 'Video created successfully');
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/admin/videos/:id
   * Update video
   */
  static async updateVideo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const video = await AdminService.updateVideo(id, updateData);
      
      if (!video) {
        return res.status(404).json(
          ApiResponse.error('Video not found', 404)
        );
      }

      const response = ApiResponse.success(video, 'Video updated successfully');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/admin/videos/:id
   * Delete video
   */
  static async deleteVideo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await AdminService.deleteVideo(id);
      
      const response = ApiResponse.success(null, 'Video deleted successfully');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // ==================== FILE UPLOAD ====================

  /**
   * POST /api/v1/admin/upload
   * Upload file
   */
  static async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json(
          ApiResponse.error('No file uploaded', 400)
        );
      }

      const fileData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: `/uploads/${req.file.filename}`
      };

      const response = ApiResponse.success(fileData, 'File uploaded successfully');
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
