import { Router } from 'express';
import { HomeController } from '../../controllers/api/homeController';

const router = Router();

/**
 * @swagger
 * /api/statistics/public:
 *   get:
 *     summary: Public statistics
 *     tags: [Statistics]
 *     description: Mengambil statistik public untuk homepage
 *     responses:
 *       200:
 *         description: Statistik berhasil diambil
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
 *                     totalArticles:
 *                       type: number
 *                       example: 25
 *                       description: Total artikel published
 *                     activeDonations:
 *                       type: number
 *                       example: 5
 *                       description: Total donasi aktif
 *                     totalDonationTarget:
 *                       type: number
 *                       example: 50000000
 *                       description: Total target donasi (Rupiah)
 *                     totalDonationCollected:
 *                       type: number
 *                       example: 25000000
 *                       description: Total donasi terkumpul (Rupiah)
 *                     totalNews:
 *                       type: number
 *                       example: 10
 *                       description: Total berita/pengumuman
 *                     donationProgress:
 *                       type: number
 *                       example: 50
 *                       description: Persentase progress donasi keseluruhan
 *       500:
 *         description: Server error
 */
// GET /api/statistics/public  
router.get('/public', HomeController.getPublicStats);

export default router;
