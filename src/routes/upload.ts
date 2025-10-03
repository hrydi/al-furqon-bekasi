import { Router } from 'express';
import { UploadController } from '../controllers/api/uploadController';
import { adminAuth, requireAnyAdmin } from '../middleware/adminAuth';

const router = Router();

// ==================== UPLOAD ROUTES ====================
// Protected routes - require admin authentication

router.use(adminAuth, requireAnyAdmin);

// Upload article images
router.post('/article/image', UploadController.uploadArticleImages);

// Delete article image
router.delete('/article/image', UploadController.deleteArticleImage);

// Get article gallery
router.get('/article/gallery', UploadController.getArticleGallery);

export default router;