import express from 'express';
import homeRoutes from './api/home';
import statisticsRoutes from './api/statistics';
import mainRoutes from './api/main';
import adminRoutes from './api/admin';
import authRoutes from './auth';
import uploadRoutes from './upload';
import grahaRoutes from './graha';

const router = express.Router();

// ===== CORE ROUTES - Specific routes BEFORE general routes =====

// 1. Auth routes (login, register, etc.)
router.use('/auth', authRoutes);

// 2. Upload routes
router.use('/upload', uploadRoutes);

// 3. Graha routes
router.use('/graha', grahaRoutes);

// 4. Admin routes (protected dashboard, user management, etc.)
router.use('/admin', adminRoutes);

// 5. Statistics routes
router.use('/statistics', statisticsRoutes);

// 6. Home/Public API routes (health check, featured content, etc.)
router.use('/home', homeRoutes);

// 7. Main routes (articles, donations, news CRUD - must be last as catch-all)
router.use('/', mainRoutes);

export default router;
