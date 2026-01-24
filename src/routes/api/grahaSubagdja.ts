import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// --- UMKM Partners ---
router.get('/partners', async (req: Request, res: Response) => {
  try {
    const partners = await prisma.uMKMPartner.findMany({
      orderBy: { id: 'asc' }
    });
    
    // Transform data untuk frontend - convert dari field terpisah ke contact object
    const transformedPartners = partners.map(partner => ({
      id: partner.id,
      name: partner.name,
      category: partner.category,
      description: partner.description,
      services: partner.services,
      contact: {
        phone: partner.contactPhone,
        whatsapp: partner.contactWhatsapp,
        instagram: partner.contactInstagram
      },
      image: partner.image
    }));
    
    res.json(transformedPartners);
  } catch (error) {
    console.error('Get partners error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data UMKM Partner' });
  }
});

router.post('/partners', async (req: Request, res: Response) => {
  try {
    const { name, category, description, services, contact, image } = req.body;
    
    const partner = await prisma.uMKMPartner.create({
      data: {
        name,
        category,
        description,
        services,
        contactPhone: contact.phone,
        contactWhatsapp: contact.whatsapp,
        contactInstagram: contact.instagram,
        image
      }
    });
    
    // Transform response untuk frontend
    const transformedPartner = {
      id: partner.id,
      name: partner.name,
      category: partner.category,
      description: partner.description,
      services: partner.services,
      contact: {
        phone: partner.contactPhone,
        whatsapp: partner.contactWhatsapp,
        instagram: partner.contactInstagram
      },
      image: partner.image
    };
    
    res.status(201).json(transformedPartner);
  } catch (error) {
    console.error('Create partner error:', error);
    res.status(500).json({ success: false, message: 'Gagal menambah UMKM Partner' });
  }
});

router.put('/partners/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, description, services, contact, image } = req.body;
    
    const partner = await prisma.uMKMPartner.update({
      where: { id: Number(id) },
      data: {
        name,
        category,
        description,
        services,
        contactPhone: contact.phone,
        contactWhatsapp: contact.whatsapp,
        contactInstagram: contact.instagram,
        image
      }
    });
    
    // Transform response untuk frontend
    const transformedPartner = {
      id: partner.id,
      name: partner.name,
      category: partner.category,
      description: partner.description,
      services: partner.services,
      contact: {
        phone: partner.contactPhone,
        whatsapp: partner.contactWhatsapp,
        instagram: partner.contactInstagram
      },
      image: partner.image
    };
    
    res.json(transformedPartner);
  } catch (error) {
    console.error('Update partner error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengedit UMKM Partner' });
  }
});

router.delete('/partners/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.uMKMPartner.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: 'UMKM Partner berhasil dihapus' });
  } catch (error) {
    console.error('Delete partner error:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus UMKM Partner' });
  }
});

// --- Gallery ---
router.get('/gallery', async (req: Request, res: Response) => {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { id: 'asc' }
    });
    
    // Transform data untuk frontend (image -> src)
    const transformedImages = images.map(img => ({
      id: img.id,
      title: img.title,
      image: img.image, // Keep as 'image' for consistency with backend
      src: img.image,   // Also provide as 'src' for frontend compatibility
      alt: img.title,
      category: img.category
    }));
    
    res.json(transformedImages);
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data gallery' });
  }
});

router.post('/gallery', async (req: Request, res: Response) => {
  try {
    const { title, image, category } = req.body;
    
    const galleryImage = await prisma.galleryImage.create({
      data: {
        title,
        image,
        category
      }
    });
    
    res.status(201).json(galleryImage);
  } catch (error) {
    console.error('Create gallery error:', error);
    res.status(500).json({ success: false, message: 'Gagal menambah gallery image' });
  }
});

router.put('/gallery/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, image, category } = req.body;
    
    const galleryImage = await prisma.galleryImage.update({
      where: { id: Number(id) },
      data: {
        title,
        image,
        category
      }
    });
    
    res.json(galleryImage);
  } catch (error) {
    console.error('Update gallery error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengedit gallery image' });
  }
});

router.delete('/gallery/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.galleryImage.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: 'Gallery image berhasil dihapus' });
  } catch (error) {
    console.error('Delete gallery error:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus gallery image' });
  }
});

// --- FAQ ---
router.get('/faq', async (req: Request, res: Response) => {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(faqs);
  } catch (error) {
    console.error('Get FAQ error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil FAQ' });
  }
});

router.post('/faq', async (req: Request, res: Response) => {
  try {
    const { question, answer } = req.body;
    
    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer
      }
    });
    
    res.status(201).json(faq);
  } catch (error) {
    console.error('Create FAQ error:', error);
    res.status(500).json({ success: false, message: 'Gagal menambah FAQ' });
  }
});

router.put('/faq/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;
    
    const faq = await prisma.fAQ.update({
      where: { id: Number(id) },
      data: {
        question,
        answer
      }
    });
    
    res.json(faq);
  } catch (error) {
    console.error('Update FAQ error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengedit FAQ' });
  }
});

router.delete('/faq/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.fAQ.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: 'FAQ berhasil dihapus' });
  } catch (error) {
    console.error('Delete FAQ error:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus FAQ' });
  }
});

// --- Facility Info ---
router.get('/facility', async (req: Request, res: Response) => {
  try {
    const info = await prisma.facilityInfo.findFirst();
    if (!info) {
      return res.status(404).json({ success: false, message: 'Facility info tidak ditemukan' });
    }
    res.json(info);
  } catch (error) {
    console.error('Get facility error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil Facility Info' });
  }
});

router.put('/facility', async (req: Request, res: Response) => {
  try {
    const { title, description, capacity, facilities, price, contact } = req.body;
    
    // Jika belum ada facility info, buat baru
    const existingInfo = await prisma.facilityInfo.findFirst();
    
    let info;
    if (existingInfo) {
      info = await prisma.facilityInfo.update({
        where: { id: existingInfo.id },
        data: {
          title,
          description,
          capacity,
          facilities,
          price,
          contact
        }
      });
    } else {
      info = await prisma.facilityInfo.create({
        data: {
          title,
          description,
          capacity,
          facilities,
          price,
          contact
        }
      });
    }
    
    res.json(info);
  } catch (error) {
    console.error('Update facility error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengedit Facility Info' });
  }
});

export default router;