import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { AdminController } from '../../controllers/api/adminController';
import { DashboardController } from '../../controllers/dashboardController';
import { adminAuth, requireSuperAdmin, requireAdmin, requireAnyAdmin } from '../../middleware/adminAuth';

const router = Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// ==================== AUTHENTICATION ROUTES ====================
// These routes don't require authentication

router.post('/auth/login', AdminController.login);
// debug GET to help frontend devs see the correct endpoint without changing login behavior
router.get('/auth/login', (req, res) => {
  res.json({
    ok: true,
    message: 'This endpoint expects POST /api/v1/admin/auth/login with { username, password }.',
    method: 'POST',
    path: '/api/v1/admin/auth/login'
  });
});
router.post('/auth/refresh', AdminController.refreshToken);
router.get('/auth/debug', AdminController.debugAuth);

// ==================== PROTECTED ROUTES ====================
// All routes below require authentication

router.use(adminAuth);

router.post('/auth/logout', AdminController.logout);
router.get('/auth/me', adminAuth, AdminController.getCurrentUser);
router.post('/auth/refresh-all', requireSuperAdmin, AdminController.refreshAllTokens);
router.post('/auth/logout-all', requireSuperAdmin, AdminController.logoutAllSessions);

// ==================== DASHBOARD ====================

router.get('/dashboard', requireAnyAdmin, AdminController.getDashboard);
router.get('/dashboard/stats', requireAnyAdmin, DashboardController.getDashboardStats);
router.get('/dashboard/summary', requireAnyAdmin, DashboardController.getDashboardSummary);
router.get('/dashboard/activity', requireAnyAdmin, DashboardController.getRealtimeActivity);
router.get('/dashboard/charts', requireAnyAdmin, DashboardController.getChartsData);
router.post('/dashboard/stats/refresh', requireAnyAdmin, DashboardController.refreshDashboardCache);

// ==================== ARTICLES MANAGEMENT ====================

router.get('/articles', requireAnyAdmin, AdminController.getArticles);
router.get('/articles/categories', requireAnyAdmin, AdminController.getArticleCategories);
router.get('/articles/categories/valid', requireAnyAdmin, AdminController.getValidCategories);
router.get('/articles/tags', requireAnyAdmin, AdminController.getArticleTags);
router.get('/articles/:id', requireAnyAdmin, AdminController.getArticle);
router.post('/articles', requireAnyAdmin, upload.single('image'), AdminController.createArticle);
router.put('/articles/:id', requireAnyAdmin, upload.single('image'), AdminController.updateArticle);
router.delete('/articles/:id', requireAnyAdmin, AdminController.deleteArticle);

// Additional article endpoints for frontend integration
router.post('/articles/:id/featured', requireAnyAdmin, AdminController.toggleFeaturedArticle);
router.post('/articles/bulk-delete', requireAnyAdmin, AdminController.bulkDeleteArticles);
router.post('/articles/:id/duplicate', requireAnyAdmin, AdminController.duplicateArticle);

// ==================== DONATIONS MANAGEMENT ====================

router.get('/donations', requireAnyAdmin, AdminController.getDonations);
router.get('/donations/:id', requireAnyAdmin, AdminController.getDonation);
router.post('/donations', requireAnyAdmin, upload.single('image'), AdminController.createDonation);
router.put('/donations/:id', requireAnyAdmin, upload.single('image'), AdminController.updateDonation);
router.delete('/donations/:id', requireAnyAdmin, AdminController.deleteDonation);

// ==================== NEWS MANAGEMENT ====================

router.get('/news', requireAnyAdmin, AdminController.getNews);
router.get('/news/:id', requireAnyAdmin, AdminController.getNewsItem);
router.post('/news', requireAnyAdmin, upload.single('image'), AdminController.createNews);
router.put('/news/:id', requireAnyAdmin, upload.single('image'), AdminController.updateNews);
router.delete('/news/:id', requireAnyAdmin, AdminController.deleteNews);

// ==================== USER MANAGEMENT ====================

router.get('/users', requireAdmin, AdminController.getUsers);
router.post('/users', requireAdmin, AdminController.createUser);
router.put('/users/:id', requireAdmin, AdminController.updateUser);
router.delete('/users/:id', requireAdmin, AdminController.deleteUser);
router.patch('/users/:id/status', requireAdmin, AdminController.updateUserStatus);

// ==================== FILE UPLOAD ====================

router.get('/transactions', requireAnyAdmin, AdminController.getTransactions);

// ==================== VIDEOS MANAGEMENT ====================

router.get('/videos', requireAnyAdmin, AdminController.getVideos);
router.get('/videos/:id', requireAnyAdmin, AdminController.getVideo);
router.post('/videos', requireAnyAdmin, AdminController.createVideo);
router.put('/videos/:id', requireAnyAdmin, AdminController.updateVideo);
router.delete('/videos/:id', requireAnyAdmin, AdminController.deleteVideo);

// ==================== GRAHA SUBAGDJA MANAGEMENT ====================

import { 
  createUMKMPartner,
  updateUMKMPartner,
  deleteUMKMPartner,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  updateFacilityInfo
} from '../../controllers/grahaController';

// UMKM Partners
router.post('/graha/umkm-partners', requireAnyAdmin, createUMKMPartner);
router.put('/graha/umkm-partners/:id', requireAnyAdmin, updateUMKMPartner);
router.delete('/graha/umkm-partners/:id', requireAnyAdmin, deleteUMKMPartner);

// Gallery
router.post('/graha/gallery', requireAnyAdmin, createGalleryItem);
router.put('/graha/gallery/:id', requireAnyAdmin, updateGalleryItem);
router.delete('/graha/gallery/:id', requireAnyAdmin, deleteGalleryItem);

// FAQ
router.post('/graha/faqs', requireAnyAdmin, createFAQ);
router.put('/graha/faqs/:id', requireAnyAdmin, updateFAQ);
router.delete('/graha/faqs/:id', requireAnyAdmin, deleteFAQ);

// Facility Info
router.put('/graha/facility-info', requireAnyAdmin, updateFacilityInfo);

// ==================== FILE UPLOAD ====================

router.post('/upload', requireAnyAdmin, upload.single('file'), AdminController.uploadFile);

export default router;
