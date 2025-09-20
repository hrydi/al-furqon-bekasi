import { prisma } from './prisma';
import slugify from 'slugify';

export const DonationModel = {
  findAll: () => {
    return prisma.donation.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  findById: (id: string) => {
    return prisma.donation.findUnique({
      where: { id }
    });
  },

  create: (data: {
    title: string;
    description: string;
    targetAmount: number;
    detail?: string;
    image?: string;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    startDate?: Date;
    endDate?: Date;
  }) => {
    const slug = slugify(data.title, { lower: true, strict: true });
    return prisma.donation.create({
      data: {
        ...data,
        slug
      }
    });
  },

  update: (id: string, data: {
    title?: string;
    description?: string;
    detail?: string;
    targetAmount?: number;
    image?: string;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    startDate?: Date;
    endDate?: Date;
  }) => {
    const updateData: any = { ...data };
    if (data.title) {
      updateData.slug = slugify(data.title, { lower: true, strict: true });
    }
    return prisma.donation.update({
      where: { id },
      data: updateData
    });
  },

  delete: (id: string) => {
    return prisma.donation.delete({
      where: { id }
    });
  }
};
