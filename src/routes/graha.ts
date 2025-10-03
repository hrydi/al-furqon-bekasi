import { Router } from 'express';
import { 
  getUMKMPartners, 
  createUMKMPartner,
  updateUMKMPartner,
  deleteUMKMPartner,
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getFacilityInfo,
  updateFacilityInfo
} from '../controllers/grahaController';
import { requireAnyAdmin } from '../middleware/adminAuth';

const router = Router();

// Public routes
router.get('/umkm-partners', getUMKMPartners);
router.get('/gallery', getGallery);
router.get('/faqs', getFAQs);
router.get('/facility-info', getFacilityInfo);

// Admin routes
router.post('/umkm-partners', requireAnyAdmin, createUMKMPartner);
router.put('/umkm-partners/:id', requireAnyAdmin, updateUMKMPartner);
router.delete('/umkm-partners/:id', requireAnyAdmin, deleteUMKMPartner);

router.post('/gallery', requireAnyAdmin, createGalleryItem);
router.put('/gallery/:id', requireAnyAdmin, updateGalleryItem);
router.delete('/gallery/:id', requireAnyAdmin, deleteGalleryItem);

router.post('/faqs', requireAnyAdmin, createFAQ);
router.put('/faqs/:id', requireAnyAdmin, updateFAQ);
router.delete('/faqs/:id', requireAnyAdmin, deleteFAQ);

router.put('/facility-info', requireAnyAdmin, updateFacilityInfo);

export default router;