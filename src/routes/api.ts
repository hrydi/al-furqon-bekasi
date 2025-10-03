import express from 'express';
import homeRoutes from './api/home';
import statisticsRoutes from './api/statistics';
import mainRoutes from './api/main';
import adminRoutes from './api/admin';
import authRoutes from './auth';
import uploadRoutes from './upload';
import grahaRoutes from './graha';

const router = express.Router();

router.get('/health', (req, res, next) => {
  req.url = '/health';
  homeRoutes(req, res, next);
});

// Featured content endpoints (specific routes first)
router.get('/articles/featured', (req, res, next) => {
  req.url = '/articles/featured';
  homeRoutes(req, res, next);
});

router.get('/donations/active', (req, res, next) => {
  req.url = '/donations/active';
  homeRoutes(req, res, next);
});

router.get('/donations/stats', (req, res, next) => {
  req.url = '/donations/stats';
  homeRoutes(req, res, next);
});

router.get('/news/latest', (req, res, next) => {
  req.url = '/news/latest';
  homeRoutes(req, res, next);
});

router.get('/news/top', (req, res, next) => {
  req.url = '/news/top';
  homeRoutes(req, res, next);
});

// Video endpoints
router.get('/videos/featured', (req, res, next) => {
  req.url = '/videos/featured';
  homeRoutes(req, res, next);
});

router.get('/videos', (req, res, next) => {
  req.url = '/videos';
  homeRoutes(req, res, next);
});

router.get('/videos/:id', (req, res, next) => {
  req.url = `/videos/${req.params.id}`;
  homeRoutes(req, res, next);
});

// CRUD endpoints for main resources
router.get('/articles', (req, res, next) => {
  req.url = '/articles';
  homeRoutes(req, res, next);
});

router.get('/articles/:id', (req, res, next) => {
  req.url = `/articles/${req.params.id}`;
  homeRoutes(req, res, next);
});

router.get('/donations', (req, res, next) => {
  req.url = '/donations';
  homeRoutes(req, res, next);
});

router.get('/donations/:id', (req, res, next) => {
  req.url = `/donations/${req.params.id}`;
  homeRoutes(req, res, next);
});

router.get('/news', (req, res, next) => {
  req.url = '/news';
  homeRoutes(req, res, next);
});

router.get('/news/:id', (req, res, next) => {
  req.url = `/news/${req.params.id}`;
  homeRoutes(req, res, next);
});

// Slug-based endpoints
router.get('/articles/slug/:slug', (req, res, next) => {
  req.url = `/articles/slug/${req.params.slug}`;
  homeRoutes(req, res, next);
});

router.get('/donations/slug/:slug', (req, res, next) => {
  req.url = `/donations/slug/${req.params.slug}`;
  homeRoutes(req, res, next);
});

router.get('/news/slug/:slug', (req, res, next) => {
  req.url = `/news/slug/${req.params.slug}`;
  homeRoutes(req, res, next);
});

// Form submission endpoints
router.post('/newsletter/subscribe', (req, res, next) => {
  req.url = '/newsletter/subscribe';
  homeRoutes(req, res, next);
});

router.post('/contact/submit', (req, res, next) => {
  req.url = '/contact/submit';
  homeRoutes(req, res, next);
});

router.post('/donations/submit', (req, res, next) => {
  req.url = '/donations/submit';
  homeRoutes(req, res, next);
});

// Search endpoint
router.get('/search', (req, res, next) => {
  req.url = '/search';
  homeRoutes(req, res, next);
});

// Navigation menus
router.get('/menus/navigation', (req, res, next) => {
  req.url = '/menus/navigation';
  homeRoutes(req, res, next);
});

// Analytics endpoints
router.post('/analytics/track', (req, res, next) => {
  req.url = '/analytics/track';
  homeRoutes(req, res, next);
});

router.get('/analytics/views', (req, res, next) => {
  req.url = '/analytics/views';
  homeRoutes(req, res, next);
});

// Feedback endpoints
router.post('/feedback', (req, res, next) => {
  req.url = '/feedback';
  homeRoutes(req, res, next);
});

router.get('/feedback', (req, res, next) => {
  req.url = '/feedback';
  homeRoutes(req, res, next);
});

// ===== ORIGINAL ROUTES =====
router.use('/auth', authRoutes);
router.use('/upload', uploadRoutes);
router.use('/graha', grahaRoutes);
router.use('/home', homeRoutes);
router.use('/statistics', statisticsRoutes);
router.use('/admin', adminRoutes);

// Import routes utama (articles, donations, news CRUD) - must be last
router.use('/', mainRoutes);

export default router;
