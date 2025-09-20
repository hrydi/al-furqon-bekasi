import { Router } from 'express';
import { HomeController } from '../../controllers/api/homeController'

const router = Router();

/**
 * @swagger
 * /api/v1/home/dashboard:
 *   get:
 *     summary: Dashboard data
 *     tags: [Dashboard]
 *     description: Mengambil data dashboard dengan statistik dan konten terbaru
 *     responses:
 *       200:
 *         description: Data dashboard berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     statistics:
 *                       type: object
 *                       properties:
 *                         totalArticles:
 *                           type: number
 *                           example: 25
 *                         activeDonations:
 *                           type: number
 *                           example: 5
 *                         totalNews:
 *                           type: number
 *                           example: 10
 *                         totalUsers:
 *                           type: number
 *                           example: 150
 *                     latestArticles:
 *                       type: array
 *                       items:
 *                         type: object
 *                     activeDonations:
 *                       type: array
 *                       items:
 *                         type: object
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

// ===== HOME & DASHBOARD ROUTES =====
router.get('/dashboard', HomeController.getHomePageData);

// ===== FEATURED CONTENT ROUTES (must be before CRUD routes) =====
router.get('/articles/featured', HomeController.getFeaturedArticles);
router.get('/donations/active', HomeController.getActiveDonations);
router.get('/news/latest', HomeController.getLatestNews);
router.get('/news/top', HomeController.getTopNews);
router.get('/videos/featured', HomeController.getFeaturedVideos);

// ===== CRUD ROUTES =====
router.get('/articles', HomeController.getAllArticles);
router.get('/articles/:id', HomeController.getArticleById);
router.get('/donations', HomeController.getAllDonations);
router.get('/donations/:id', HomeController.getDonationById);
router.get('/news', HomeController.getAllNews);
router.get('/news/:id', HomeController.getNewsById);
router.get('/videos', HomeController.getAllVideos);
router.get('/videos/:id', HomeController.getVideoById);

// ===== SLUG-BASED ROUTES =====
router.get('/articles/slug/:slug', HomeController.getArticleBySlug);
router.get('/donations/slug/:slug', HomeController.getDonationBySlug);
router.get('/news/slug/:slug', HomeController.getNewsBySlug);

// ===== INTERACTION ROUTES =====
router.post('/articles/:id/view', HomeController.incrementArticleViews);
router.post('/articles/:id/like', HomeController.likeArticle);
router.get('/articles/:id/related', HomeController.getRelatedArticles);
router.patch('/news/:id/views', HomeController.incrementNewsViews);

// ===== DONATION SPECIFIC ROUTES =====
router.post('/donations/submit', HomeController.submitDonation);
router.get('/donations/:transactionId/status', HomeController.getDonationStatus);

// ===== STATISTICS ROUTES =====
router.get('/statistics/public', HomeController.getPublicStats);
router.get('/donations/stats', HomeController.getDonationStats);

// ===== UTILITY ROUTES =====
router.get('/health', HomeController.healthCheck);
router.get('/search', HomeController.search);

// ===== FORM SUBMISSION ROUTES =====
router.post('/newsletter/subscribe', HomeController.subscribeNewsletter);
router.post('/contact/submit', HomeController.submitContact);

// ===== NAVIGATION ROUTES =====
router.get('/menus/navigation', HomeController.getNavigationMenus);

// ===== ANALYTICS ROUTES =====
router.post('/analytics/track', HomeController.trackEvent);
router.get('/analytics/views', HomeController.getPageViews);

// ===== FEEDBACK ROUTES =====
router.post('/feedback', HomeController.submitFeedback);
router.get('/feedback', HomeController.getFeedback);

export default router;
