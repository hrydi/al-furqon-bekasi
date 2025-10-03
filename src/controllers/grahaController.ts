import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { responseHelper } from '../utils/responseHelper';

const prisma = new PrismaClient();

// UMKM Partners
export const getUMKMPartners = async (req: Request, res: Response) => {
  try {
    const partners = await prisma.grahaUMKMPartner.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: 'asc' }
    });

    return responseHelper(res, 200, 'Data mitra UMKM berhasil dimuat', partners);
  } catch (error) {
    console.error('Error fetching UMKM partners:', error);
    return responseHelper(res, 500, 'Gagal memuat mitra UMKM', null, error as Error);
  }
};

export const createUMKMPartner = async (req: Request, res: Response) => {
  try {
    const { name, category, description, services, contact, image, orderIndex } = req.body;

    const partner = await prisma.grahaUMKMPartner.create({
      data: {
        name,
        category,
        description,
        services,
        contact,
        image,
        orderIndex: orderIndex || 0
      }
    });

    return responseHelper(res, 201, 'Mitra UMKM berhasil ditambahkan', partner);
  } catch (error) {
    console.error('Error creating UMKM partner:', error);
    return responseHelper(res, 500, 'Gagal menambahkan mitra UMKM', null, error as Error);
  }
};

export const updateUMKMPartner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, description, services, contact, image, orderIndex } = req.body;

    const partner = await prisma.grahaUMKMPartner.update({
      where: { id },
      data: {
        name,
        category,
        description,
        services,
        contact,
        image,
        orderIndex
      }
    });

    return responseHelper(res, 200, 'Mitra UMKM berhasil diperbarui', partner);
  } catch (error) {
    console.error('Error updating UMKM partner:', error);
    return responseHelper(res, 500, 'Gagal memperbarui mitra UMKM', null, error as Error);
  }
};

export const deleteUMKMPartner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete by setting isActive to false
    const partner = await prisma.grahaUMKMPartner.update({
      where: { id },
      data: { isActive: false }
    });

    return responseHelper(res, 200, 'Mitra UMKM berhasil dihapus', partner);
  } catch (error) {
    console.error('Error deleting UMKM partner:', error);
    return responseHelper(res, 500, 'Gagal menghapus mitra UMKM', null, error as Error);
  }
};

// Gallery
export const getGallery = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    
    const whereClause: any = { isActive: true };
    if (category) {
      whereClause.category = category;
    }

    const gallery = await prisma.grahaGallery.findMany({
      where: whereClause,
      orderBy: { orderIndex: 'asc' }
    });

    return responseHelper(res, 200, 'Data galeri berhasil dimuat', gallery);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return responseHelper(res, 500, 'Gagal memuat galeri', null, error as Error);
  }
};

export const createGalleryItem = async (req: Request, res: Response) => {
  try {
    const { title, image, category, orderIndex } = req.body;

    const item = await prisma.grahaGallery.create({
      data: {
        title,
        image,
        category,
        orderIndex: orderIndex || 0
      }
    });

    return responseHelper(res, 201, 'Item galeri berhasil ditambahkan', item);
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return responseHelper(res, 500, 'Gagal menambahkan item galeri', null, error as Error);
  }
};

export const updateGalleryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, image, category, orderIndex } = req.body;

    const item = await prisma.grahaGallery.update({
      where: { id },
      data: {
        title,
        image,
        category,
        orderIndex
      }
    });

    return responseHelper(res, 200, 'Item galeri berhasil diperbarui', item);
  } catch (error) {
    console.error('Error updating gallery item:', error);
    return responseHelper(res, 500, 'Gagal memperbarui item galeri', null, error as Error);
  }
};

export const deleteGalleryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete by setting isActive to false
    const item = await prisma.grahaGallery.update({
      where: { id },
      data: { isActive: false }
    });

    return responseHelper(res, 200, 'Item galeri berhasil dihapus', item);
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return responseHelper(res, 500, 'Gagal menghapus item galeri', null, error as Error);
  }
};

// FAQ
export const getFAQs = async (req: Request, res: Response) => {
  try {
    const faqs = await prisma.grahaFAQ.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: 'asc' }
    });

    return responseHelper(res, 200, 'Data FAQ berhasil dimuat', faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return responseHelper(res, 500, 'Gagal memuat FAQ', null, error as Error);
  }
};

export const createFAQ = async (req: Request, res: Response) => {
  try {
    const { question, answer, orderIndex } = req.body;

    const faq = await prisma.grahaFAQ.create({
      data: {
        question,
        answer,
        orderIndex: orderIndex || 0
      }
    });

    return responseHelper(res, 201, 'FAQ berhasil ditambahkan', faq);
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return responseHelper(res, 500, 'Gagal menambahkan FAQ', null, error as Error);
  }
};

export const updateFAQ = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { question, answer, orderIndex } = req.body;

    const existingFAQ = await prisma.grahaFAQ.findUnique({
      where: { id }
    });

    if (!existingFAQ) {
      return responseHelper(res, 404, 'FAQ tidak ditemukan', null);
    }

    const updatedFAQ = await prisma.grahaFAQ.update({
      where: { id },
      data: {
        question: question || existingFAQ.question,
        answer: answer || existingFAQ.answer,
        orderIndex: orderIndex !== undefined ? orderIndex : existingFAQ.orderIndex
      }
    });

    return responseHelper(res, 200, 'FAQ berhasil diperbarui', updatedFAQ);
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return responseHelper(res, 500, 'Gagal memperbarui FAQ', null, error as Error);
  }
};

export const deleteFAQ = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingFAQ = await prisma.grahaFAQ.findUnique({
      where: { id }
    });

    if (!existingFAQ) {
      return responseHelper(res, 404, 'FAQ tidak ditemukan', null);
    }

    await prisma.grahaFAQ.delete({
      where: { id }
    });

    return responseHelper(res, 200, 'FAQ berhasil dihapus', null);
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return responseHelper(res, 500, 'Gagal menghapus FAQ', null, error as Error);
  }
};

// Facility Info
export const getFacilityInfo = async (req: Request, res: Response) => {
  try {
    const info = await prisma.grahaFacilityInfo.findFirst({
      where: { isActive: true }
    });

    return responseHelper(res, 200, 'Data informasi fasilitas berhasil dimuat', info);
  } catch (error) {
    console.error('Error fetching facility info:', error);
    return responseHelper(res, 500, 'Gagal memuat informasi fasilitas', null, error as Error);
  }
};

export const updateFacilityInfo = async (req: Request, res: Response) => {
  try {
    const { title, description, capacity, facilities, price, contact } = req.body;

    // Check if facility info exists
    const existingInfo = await prisma.grahaFacilityInfo.findFirst({
      where: { isActive: true }
    });

    let info;
    if (existingInfo) {
      info = await prisma.grahaFacilityInfo.update({
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
      info = await prisma.grahaFacilityInfo.create({
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

    return responseHelper(res, 200, 'Informasi fasilitas berhasil diperbarui', info);
  } catch (error) {
    console.error('Error updating facility info:', error);
    return responseHelper(res, 500, 'Gagal memperbarui informasi fasilitas', null, error as Error);
  }
};