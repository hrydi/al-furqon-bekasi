import { Prisma } from '@prisma/client';
import { prisma } from '../models/prisma';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import {
  AdminUser,
  AdminStats,
  AdminFilters,
  PaginatedResponse,
  AdminArticle,
  AdminDonation,
  AdminNews,
  AdminTransaction,
  CreateArticleRequest,
  UpdateArticleRequest,
  CreateDonationRequest,
  UpdateDonationRequest,
  CreateNewsRequest,
  UpdateNewsRequest,
  CreateUserRequest,
  UpdateUserRequest,
  RecentActivity,
  ChartData,
} from '../types/admin';

export class AdminService {
  static async authenticateAdmin(username: string, password: string) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { username: username },
            { email: username }
          ],
          role: {
            in: ['super_admin', 'admin', 'editor']
          },
          isActive: true
        }
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLogin: new Date(),
          loginCount: { increment: 1 }
        }
      });

      return user;
    } catch (error) {
      console.error('Error authenticating admin:', error);
      throw error;
    }
  }

  static generateTokens(user: any) {
    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      permissions: user.permissions || []
    };

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

    const accessToken = jwt.sign(payload, jwtSecret, { expiresIn } as SignOptions);
    const refreshToken = jwt.sign({ userId: user.id }, jwtRefreshSecret, { expiresIn: '7d' } as SignOptions);

    return { accessToken, refreshToken };
  }

  static async refreshToken(refreshToken: string) {
    try {
      const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
      
      const decoded = jwt.verify(refreshToken, jwtRefreshSecret) as { userId: string };

      const user = await prisma.user.findUnique({
        where: { 
          id: decoded.userId,
          isActive: true
        }
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      const tokens = this.generateTokens(user);
      
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: tokens.refreshToken }
      });

      return tokens;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new Error('Invalid refresh token');
    }
  }
  static async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null }
    });
  }

  static async logoutAllSessions() {
    await prisma.user.updateMany({
      where: {
        role: {
          in: ['super_admin', 'admin', 'editor']
        }
      },
      data: { refreshToken: null }
    });
  }

  static async refreshAllAdminTokens() {
    const adminUsers = await prisma.user.findMany({
      where: {
        role: {
          in: ['super_admin', 'admin', 'editor']
        },
        isActive: true
      }
    });

    const refreshResults = [];

    for (const user of adminUsers) {
      const tokens = this.generateTokens(user);
      
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          refreshToken: tokens.refreshToken,
          lastLogin: new Date()
        }
      });

      refreshResults.push({
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        newTokens: tokens
      });
    }

    return refreshResults;
  }

  static async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { 
        id: userId,
        isActive: true
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        permissions: true,
        isActive: true,
        lastLogin: true,
        loginCount: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      ...user,
      permissions: user.permissions ? JSON.parse(user.permissions as string) : [],
      lastLogin: user.lastLogin?.toISOString() || '',
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  }

  static async getDashboardStats(): Promise<AdminStats> {
    const [
      totalUsers,
      totalArticles,
      totalDonations,
      totalNews,
      totalTransactions,
      totalRevenue,
      recentActivity
    ] = await Promise.all([
      prisma.user.count(),
      prisma.article.count(),
      prisma.donation.count(),
      prisma.news.count(),
      prisma.donationTransaction.count(),
      prisma.donationTransaction.aggregate({
        where: { status: 'paid' },
        _sum: { amount: true }
      }),
      this.getRecentActivity()
    ]);

    const chartData = await this.getChartData();

    return {
      totalUsers,
      totalArticles,
      totalDonations,
      totalNews,
      totalTransactions,
      totalRevenue: totalRevenue._sum.amount || 0,
      recentActivity,
      chartData
    };
  }

  static async getRecentActivity(): Promise<RecentActivity[]> {
    const [articles, donations, news] = await Promise.all([
      prisma.article.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          title: true,
          authorName: true,
          updatedAt: true,
          status: true
        }
      }),
      prisma.donation.findMany({
        take: 3,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          title: true,
          updatedAt: true,
          status: true
        }
      }),
      prisma.news.findMany({
        take: 2,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          title: true,
          authorName: true,
          updatedAt: true
        }
      })
    ]);

    const activities: RecentActivity[] = [];

    articles.forEach(article => {
      activities.push({
        id: article.id,
        type: 'article',
        action: article.status === 'published' ? 'published' : 'updated',
        title: article.title,
        user: article.authorName || 'System',
        timestamp: article.updatedAt
      });
    });

    donations.forEach(donation => {
      activities.push({
        id: donation.id,
        type: 'donation',
        action: 'updated',
        title: donation.title,
        user: 'Admin',
        timestamp: donation.updatedAt
      });
    });

    news.forEach(newsItem => {
      activities.push({
        id: newsItem.id,
        type: 'news',
        action: 'updated',
        title: newsItem.title,
        user: newsItem.authorName || 'Admin',
        timestamp: newsItem.updatedAt
      });
    });

    activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return activities.slice(0, 10);
  }

  static async getChartData(): Promise<ChartData> {
    const currentDate = new Date();

    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push({
        start: date,
        end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
        name: date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
      });
    }

    const chartData: ChartData = {
      donations: [],
      articles: [],
      users: [],
      revenue: []
    };

    for (const month of months) {
      const [donationCount, articleCount, userCount, revenue] = await Promise.all([
        prisma.donation.count({
          where: {
            createdAt: {
              gte: month.start,
              lte: month.end
            }
          }
        }),
        prisma.article.count({
          where: {
            createdAt: {
              gte: month.start,
              lte: month.end
            }
          }
        }),
        prisma.user.count({
          where: {
            createdAt: {
              gte: month.start,
              lte: month.end
            }
          }
        }),
        prisma.donationTransaction.aggregate({
          where: {
            status: 'paid',
            paidAt: {
              gte: month.start,
              lte: month.end
            }
          },
          _sum: { amount: true }
        })
      ]);

      chartData.donations.push({ month: month.name, value: donationCount });
      chartData.articles.push({ month: month.name, value: articleCount });
      chartData.users.push({ month: month.name, value: userCount });
      chartData.revenue.push({ month: month.name, value: revenue._sum.amount || 0 });
    }

    return chartData;
  }

  static async getArticles(filters: AdminFilters): Promise<PaginatedResponse<AdminArticle>> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      category,
      sortBy = 'updatedAt',
      sortOrder = 'desc'
    } = filters;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ];
    }

    if (status) where.status = status;
    if (category) where.category = category;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          content: true,
          image: true,
          status: true,
          category: true,
          authorName: true,
          publishedAt: true,
          views: true,
          likes: true,
          featured: true,
          tags: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.article.count({ where })
    ]);

    const transformedArticles = articles.map(article => ({
      ...article,
      tags: Array.isArray(article.tags) ? article.tags : [],
      allowComments: true 
    }));

    return {
      data: transformedArticles as AdminArticle[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  static validateCategory(category: string): string {
    const validCategories = ['kegiatan', 'berita', 'sumbangan', 'fasilitas', 'profil', 'kajian'];
    const categoryLower = category.toLowerCase();
    
    const categoryMap: Record<string, string> = {
      'pengumuman': 'berita',
      'announcement': 'berita',
      'umum': 'berita',
      'general': 'berita',
      'aktivitas': 'kegiatan',
      'activity': 'kegiatan',
      'event': 'kegiatan',
      'acara': 'kegiatan',
      'donasi': 'sumbangan',
      'donation': 'sumbangan',
      'infaq': 'sumbangan',
      'zakat': 'sumbangan',
      'about': 'profil',
      'tentang': 'profil',
      'profile': 'profil',
      'facility': 'fasilitas',
      'study': 'kajian',
      'pembelajaran': 'kajian',
      'pengajian': 'kajian'
    };

    if (validCategories.includes(categoryLower)) {
      return categoryLower;
    }

    if (categoryMap[categoryLower]) {
      return categoryMap[categoryLower];
    }

    console.warn(`Unknown category "${category}", defaulting to "berita"`);
    return 'berita';
  }

  static async createArticle(data: CreateArticleRequest, authorName: string) {
    const slug = data.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|^$/g, '');

      const validCategory = this.validateCategory(data.category);

    return await prisma.article.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        content: data.content,
        image: data.image,
        category: validCategory as any,
        status: data.status as any,
        featured: data.featured || false,
        tags: data.tags && data.tags.length > 0 ? data.tags : Prisma.DbNull,
        authorName,
        publishedAt: data.status === 'published' ? new Date() : null
      }
    });
  }

  static async updateArticle(id: string, data: UpdateArticleRequest) {
    const updateData: any = { ...data };
    
    delete updateData.allowComments;
    
    if (data.title) {
      updateData.slug = data.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|^$/g, '');
    }

    if (data.category) {
      updateData.category = this.validateCategory(data.category);
    }

    if (data.tags) {
      updateData.tags = data.tags.length > 0 ? data.tags : Prisma.DbNull;
    }

    if (data.status === 'published' && !updateData.publishedAt) {
      updateData.publishedAt = new Date();
    }

    return await prisma.article.update({
      where: { id },
      data: updateData
    });
  }

  static async deleteArticle(id: string) {
    return await prisma.article.delete({
      where: { id }
    });
  }

  static async toggleFeaturedArticle(id: string) {
    const article = await prisma.article.findUnique({
      where: { id }
    });

    if (!article) {
      throw new Error('Article not found');
    }

    return await prisma.article.update({
      where: { id },
      data: {
        featured: !article.featured
      }
    });
  }

  
  static async bulkDeleteArticles(ids: string[]): Promise<number> {
    const result = await prisma.article.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    return result.count;
  }

  static async duplicateArticle(id: string, authorName: string) {
    const article = await prisma.article.findUnique({
      where: { id }
    });

    if (!article) {
      throw new Error('Article not found');
    }

    const baseSlug = article.slug + '-copy';
    const existingSlugs = await prisma.article.findMany({
      where: {
        slug: {
          startsWith: baseSlug
        }
      },
      select: { slug: true }
    });

    let newSlug = baseSlug;
    let counter = 1;
    while (existingSlugs.some(item => item.slug === newSlug)) {
      newSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    return await prisma.article.create({
      data: {
        title: `${article.title} (Copy)`,
        slug: newSlug,
        description: article.description,
        content: article.content,
        image: article.image,
        category: article.category,
        status: 'draft', 
        featured: false,
        tags: article.tags || Prisma.DbNull,
        authorName,
        publishedAt: null
      }
    });
  }

  static async updateRefreshToken(userId: string, refreshToken: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken }
    });
  }

  static async getArticleById(id: string) {
    const article = await prisma.article.findUnique({
      where: { id }
    });

    if (!article) {
      return null;
    }

    return {
      ...article,
      tags: Array.isArray(article.tags) ? article.tags : [],
      allowComments: true 
    };
  }

  static async getArticleCategories() {
    const categories = await prisma.article.groupBy({
      by: ['category'],
      _count: {
        category: true
      }
    });

    const categoryInfo = {
      kegiatan: { label: 'Kegiatan', description: 'Kegiatan masjid dan komunitas' },
      berita: { label: 'Berita', description: 'Berita dan pengumuman' },
      sumbangan: { label: 'Sumbangan', description: 'Program donasi dan infaq' },
      fasilitas: { label: 'Fasilitas', description: 'Fasilitas masjid' },
      profil: { label: 'Profil', description: 'Profil dan sejarah masjid' },
      kajian: { label: 'Kajian', description: 'Kajian dan pembelajaran' }
    };

    return categories.map(cat => ({
      value: cat.category,
      label: categoryInfo[cat.category as keyof typeof categoryInfo]?.label || cat.category,
      description: categoryInfo[cat.category as keyof typeof categoryInfo]?.description || '',
      count: cat._count.category
    }));
  }


  static getValidCategories() {
    return {
      categories: [
        {
          value: 'kegiatan',
          label: 'Kegiatan',
          aliases: ['aktivitas', 'activity', 'event', 'acara']
        },
        {
          value: 'berita',
          label: 'Berita',
          aliases: ['pengumuman', 'announcement', 'umum', 'general']
        },
        {
          value: 'sumbangan',
          label: 'Sumbangan',
          aliases: ['donasi', 'donation', 'infaq', 'zakat']
        },
        {
          value: 'fasilitas',
          label: 'Fasilitas',
          aliases: ['facility']
        },
        {
          value: 'profil',
          label: 'Profil',
          aliases: ['about', 'tentang', 'profile']
        },
        {
          value: 'kajian',
          label: 'Kajian',
          aliases: ['study', 'pembelajaran', 'pengajian']
        }
      ]
    };
  }


  static async getPopularTags() {
    const articles = await prisma.article.findMany({
      select: {
        tags: true
      }
    });

    const tagCounts: Record<string, number> = {};

    articles.forEach(article => {
      if (article.tags && Array.isArray(article.tags)) {
        (article.tags as string[]).forEach(tag => {
          if (typeof tag === 'string') {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          }
        });
      }
    });

    return Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20) 
      .map(([tag, count]) => ({ name: tag, count }));
  }

  static async getDonations(filters: AdminFilters): Promise<PaginatedResponse<AdminDonation>> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sortBy = 'updatedAt',
      sortOrder = 'desc'
    } = filters;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ];
    }

    if (status) where.status = status;

    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          targetAmount: true,
          collectedAmount: true,
          totalDonors: true,
          endDate: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.donation.count({ where })
    ]);

    const donationsWithProgress = donations.map(donation => ({
      ...donation,
      progress: Math.min((donation.collectedAmount / donation.targetAmount) * 100, 100)
    }));

    return {
      data: donationsWithProgress as AdminDonation[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  static async createDonation(data: CreateDonationRequest) {
    const slug = data.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|^$/g, '');

    return await prisma.donation.create({
      data: {
        ...data,
        slug,
        status: 'active'
      }
    });
  }

  static async updateDonation(id: string, data: UpdateDonationRequest) {
    const updateData: any = { ...data };
    
    if (data.title) {
      updateData.slug = data.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|^$/g, '');
    }

    return await prisma.donation.update({
      where: { id },
      data: updateData
    });
  }

  static async deleteDonation(id: string) {
    return await prisma.donation.delete({
      where: { id }
    });
  }

  static async getDonationById(id: string) {
    const donation = await prisma.donation.findUnique({
      where: { id },
      include: {
        transactions: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (donation) {
      return {
        ...donation,
        progress: Math.min((donation.collectedAmount / donation.targetAmount) * 100, 100)
      };
    }

    return null;
  }
  static async getNews(filters: AdminFilters): Promise<PaginatedResponse<AdminNews>> {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      sortBy = 'updatedAt',
      sortOrder = 'desc'
    } = filters;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ];
    }

    if (category) where.category = category;

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          priority: true,
          publishedAt: true,
          authorName: true,
          views: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.news.count({ where })
    ]);

    return {
      data: news as AdminNews[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  static async createNews(data: CreateNewsRequest, authorName: string) {
    const slug = data.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|^$/g, '');

    return await prisma.news.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        content: data.content,
        image: data.image,
        category: data.category as any,    
        priority: data.priority as any,
        publishedAt: data.publishedAt,
        authorName
      }
    });
  }

  static async updateNews(id: string, data: UpdateNewsRequest) {
    const updateData: any = { ...data };
    
    if (data.title) {
      updateData.slug = data.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|^$/g, '');
    }

    return await prisma.news.update({
      where: { id },
      data: updateData
    });
  }

  static async deleteNews(id: string) {
    return await prisma.news.delete({
      where: { id }
    });
  }

  static async getNewsById(id: string) {
    return await prisma.news.findUnique({
      where: { id }
    });
  }

  static async getUsers(filters: AdminFilters): Promise<PaginatedResponse<AdminUser>> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sortBy = 'updatedAt',
      sortOrder = 'desc'
    } = filters;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { username: { contains: search } }
      ];
    }

    if (status) where.isActive = status === 'active';

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
          role: true,
          permissions: true,
          isActive: true,
          lastLogin: true,
          loginCount: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.user.count({ where })
    ]);

    return {
      data: users.map(user => ({
        ...user,
        permissions: user.permissions as string[],
        lastLogin: user.lastLogin?.toISOString() || '',
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      })) as AdminUser[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  static async createUser(data: CreateUserRequest) {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    
    return await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        permissions: JSON.stringify(data.permissions)
      }
    });
  }

  static async updateUser(id: string, data: UpdateUserRequest) {
    const updateData: any = { ...data };
    
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 12);
    }

    if (data.permissions) {
      updateData.permissions = JSON.stringify(data.permissions);
    }

    return await prisma.user.update({
      where: { id },
      data: updateData
    });
  }

  static async deleteUser(id: string) {
    return await prisma.user.delete({
      where: { id }
    });
  }

  static async getTransactions(filters: AdminFilters): Promise<PaginatedResponse<AdminTransaction>> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { donorName: { contains: search } },
        { donation: { title: { contains: search } } }
      ];
    }

    if (status) where.status = status;

    const [transactions, total] = await Promise.all([
      prisma.donationTransaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          donation: {
            select: {
              title: true
            }
          }
        }
      }),
      prisma.donationTransaction.count({ where })
    ]);

    return {
      data: transactions.map(transaction => ({
        id: transaction.id,
        donationId: transaction.donationId,
        donationTitle: transaction.donation.title,
        donorName: transaction.donorName,
        amount: transaction.amount,
        status: transaction.status as 'pending' | 'paid' | 'failed' | 'cancelled',
        paymentMethod: transaction.paymentMethod,
        createdAt: transaction.createdAt,
        paidAt: transaction.paidAt
      })) as AdminTransaction[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  // ==================== VIDEO MANAGEMENT ====================

  static async getVideos(filters: AdminFilters): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 10, search, category, sortBy = 'orderIndex', sortOrder = 'asc', isActive } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category) {
      where.category = category;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [videos, total] = await Promise.all([
  (prisma as any).video.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit
      }),
  (prisma as any).video.count({ where })
    ]);

    return {
      data: videos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  static async getVideoById(id: string) {
    return await (prisma as any).video.findUnique({
      where: { id }
    });
  }

  static async createVideo(data: any) {
    // Extract YouTube video ID from URL
    const youtubeId = this.extractYouTubeId(data.youtubeUrl);
    const thumbnailUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null;

    return await (prisma as any).video.create({
      data: {
        title: data.title,
        description: data.description,
        youtubeUrl: data.youtubeUrl,
        thumbnailUrl,
        duration: data.duration,
        category: data.category || 'general',
        orderIndex: data.orderIndex || 0,
        isActive: data.isActive !== undefined ? data.isActive : true
      }
    });
  }

  static async updateVideo(id: string, data: any) {
    const updateData: any = { ...data };

    // Extract YouTube video ID from URL if URL is being updated
    if (data.youtubeUrl) {
      const youtubeId = this.extractYouTubeId(data.youtubeUrl);
      updateData.thumbnailUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null;
    }

    return await (prisma as any).video.update({
      where: { id },
      data: updateData
    });
  }

  static async deleteVideo(id: string) {
    return await (prisma as any).video.delete({
      where: { id }
    });
  }

  // Helper method to extract YouTube video ID from URL
  private static extractYouTubeId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  static async updateUserStatus(id: string, status: 'active' | 'inactive') {
    const isActive = status === 'active';

    const user = await prisma.user.update({
      where: { id },
      data: { 
        isActive,
        updatedAt: new Date()
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        permissions: true,
        isActive: true,
        lastLogin: true,
        loginCount: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return user;
  }
}
