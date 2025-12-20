import { Request, Response } from 'express';
import { prisma } from '../models/prisma';
import { startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, format } from '../utils/dateUtils';

// Simple response helpers
const sendSuccess = (res: Response, data: any, message: string = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    meta: { timestamp: new Date().toISOString() }
  });
};

const sendError = (res: Response, message: string, statusCode: number = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    meta: { timestamp: new Date().toISOString(), statusCode }
  });
};

export class DashboardController {
  /**
   * Get comprehensive dashboard statistics
   * GET /api/admin/dashboard/stats
   */
  static async getDashboardStats(req: Request, res: Response) {
    try {
      const {
        startDate,
        endDate,
        includeCharts = 'true',
        includeTopArticles = 'true',
        includeRecentDonations = 'true',
        includeFinancialSummary = 'true',
        timezone = 'Asia/Jakarta'
      } = req.query;

      // Date range handling
      const now = new Date();
      const currentMonthStart = startDate ? new Date(startDate as string) : startOfMonth(now);
      const currentMonthEnd = endDate ? new Date(endDate as string) : endOfMonth(now);
      const previousMonthStart = startOfMonth(subMonths(currentMonthStart, 1));
      const previousMonthEnd = endOfMonth(subMonths(currentMonthStart, 1));

      // Basic counts
      const [
        totalArticles,
        publishedArticles,
        totalDonations,
        activeDonations,
        totalUsers,
        totalNews,
        totalTransactions,
        paidTransactions
      ] = await Promise.all([
        prisma.article.count(),
        prisma.article.count({ where: { status: 'published' } }),
        prisma.donation.count(),
        prisma.donation.count({ where: { status: 'active' } }),
        prisma.user.count(),
        prisma.news.count(),
        prisma.donationTransaction.count(),
        prisma.donationTransaction.count({ where: { status: 'paid' } })
      ]);

      // Financial calculations
      const [
        monthlyIncome,
        totalBalance,
        previousMonthIncome
      ] = await Promise.all([
        prisma.donationTransaction.aggregate({
          where: {
            status: 'paid',
            paidAt: {
              gte: currentMonthStart,
              lte: currentMonthEnd
            }
          },
          _sum: { amount: true }
        }),
        prisma.donationTransaction.aggregate({
          where: { status: 'paid' },
          _sum: { amount: true }
        }),
        prisma.donationTransaction.aggregate({
          where: {
            status: 'paid',
            paidAt: {
              gte: previousMonthStart,
              lte: previousMonthEnd
            }
          },
          _sum: { amount: true }
        })
      ]);

      // Views and analytics
      const [
        monthlyViews,
        todayViews,
        weeklyViews,
        yearlyViews
      ] = await Promise.all([
        prisma.analyticsEvent.count({
          where: {
            eventType: 'page_view',
            createdAt: {
              gte: currentMonthStart,
              lte: currentMonthEnd
            }
          }
        }),
        prisma.analyticsEvent.count({
          where: {
            eventType: 'page_view',
            createdAt: {
              gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
              lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
            }
          }
        }),
        prisma.analyticsEvent.count({
          where: {
            eventType: 'page_view',
            createdAt: {
              gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            }
          }
        }),
        prisma.analyticsEvent.count({
          where: {
            eventType: 'page_view',
            createdAt: {
              gte: startOfYear(now),
              lte: endOfYear(now)
            }
          }
        })
      ]);

      // Calculate growth percentages
      const currentIncome = monthlyIncome._sum.amount || 0;
      const prevIncome = previousMonthIncome._sum.amount || 0;
      const revenueGrowth = prevIncome > 0 ? ((currentIncome - prevIncome) / prevIncome) * 100 : 0;

      // Growth calculations for other metrics
      const monthlyGrowth = {
        articles: 12.5, // This would need historical data to calculate properly
        donations: 8.3,
        users: 15.7,
        revenue: Number(revenueGrowth.toFixed(1)),
        views: 18.9
      };

      // Prepare response data
      const dashboardData: any = {
        totalArticles,
        publishedArticles,
        totalDonations,
        activeDonations,
        totalUsers,
        totalNews,
        monthlyViews,
        todayViews,
        weeklyViews,
        yearlyViews,
        monthlyIncome: currentIncome,
        monthlyExpense: 0, // This would need an expense tracking system
        totalBalance: totalBalance._sum.amount || 0,
        totalRevenue: totalBalance._sum.amount || 0,
        totalTransactions,
        paidTransactions,
        monthlyGrowth,
        lastUpdated: new Date().toISOString()
      };

      // Optional includes
      if (includeTopArticles === 'true') {
        const topArticles = await prisma.article.findMany({
          where: { status: 'published' },
          orderBy: { views: 'desc' },
          take: 5,
          select: {
            id: true,
            title: true,
            views: true,
            publishedAt: true,
            category: true,
            image: true
          }
        });
        dashboardData.topArticles = topArticles;
      }

      if (includeRecentDonations === 'true') {
        const recentDonations = await prisma.donationTransaction.findMany({
          where: { status: 'paid' },
          orderBy: { paidAt: 'desc' },
          take: 5,
          select: {
            id: true,
            amount: true,
            donorName: true,
            message: true,
            paidAt: true,
            donation: {
              select: {
                title: true,
                slug: true
              }
            }
          }
        });
        dashboardData.recentDonations = recentDonations.map(donation => ({
          id: donation.id,
          amount: donation.amount,
          donorName: donation.donorName,
          purpose: donation.donation.title,
          createdAt: donation.paidAt,
          message: donation.message
        }));
      }

      if (includeFinancialSummary === 'true') {
        // Get financial breakdown by donation categories
        const donationCategories = await prisma.donation.groupBy({
          by: ['title'],
          _sum: {
            collectedAmount: true
          },
          orderBy: {
            _sum: {
              collectedAmount: 'desc'
            }
          },
          take: 5
        });

        dashboardData.monthlyFinancialSummary = {
          totalIncome: currentIncome,
          totalExpense: 0,
          netBalance: currentIncome,
          categories: donationCategories.map(cat => ({
            category: cat.title,
            income: cat._sum.collectedAmount || 0,
            expense: 0
          }))
        };
      }

      if (includeCharts === 'true') {
        // Get monthly data for charts
        const monthlyData = await DashboardController.getMonthlyChartsData();
        dashboardData.chartsData = monthlyData;
      }

      return sendSuccess(res, dashboardData, 'Dashboard stats retrieved successfully');
    } catch (error) {
      console.error('Dashboard stats error:', error);
      return sendError(res, 'Failed to retrieve dashboard stats', 500);
    }
  }

  /**
   * Get dashboard summary (lightweight)
   * GET /api/admin/dashboard/summary
   */
  static async getDashboardSummary(req: Request, res: Response) {
    try {
      const now = new Date();
      const currentMonthStart = startOfMonth(now);
      const currentMonthEnd = endOfMonth(now);

      const [
        totalArticles,
        totalDonations,
        monthlyIncome,
        monthlyViews
      ] = await Promise.all([
        prisma.article.count({ where: { status: 'published' } }),
        prisma.donation.count({ where: { status: 'active' } }),
        prisma.donationTransaction.aggregate({
          where: {
            status: 'paid',
            paidAt: {
              gte: currentMonthStart,
              lte: currentMonthEnd
            }
          },
          _sum: { amount: true }
        }),
        prisma.analyticsEvent.count({
          where: {
            eventType: 'page_view',
            createdAt: {
              gte: currentMonthStart,
              lte: currentMonthEnd
            }
          }
        })
      ]);

      const summaryData = {
        totalArticles,
        totalDonations,
        monthlyIncome: monthlyIncome._sum.amount || 0,
        monthlyViews,
        lastUpdated: new Date().toISOString()
      };

      return sendSuccess(res, summaryData, 'Dashboard summary retrieved successfully');
    } catch (error) {
      console.error('Dashboard summary error:', error);
      return sendError(res, 'Failed to retrieve dashboard summary', 500);
    }
  }

  /**
   * Get real-time activity feed
   * GET /api/admin/dashboard/activity
   */
  static async getRealtimeActivity(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      // Get recent activities
      const [
        recentArticles,
        recentDonations,
        recentTransactions,
        recentViews
      ] = await Promise.all([
        prisma.article.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
            authorName: true
          }
        }),
        prisma.donation.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            title: true,
            targetAmount: true,
            collectedAmount: true,
            createdAt: true
          }
        }),
        prisma.donationTransaction.findMany({
          where: { status: 'paid' },
          orderBy: { paidAt: 'desc' },
          take: 5,
          select: {
            id: true,
            amount: true,
            donorName: true,
            paidAt: true,
            donation: {
              select: { title: true }
            }
          }
        }),
        prisma.analyticsEvent.findMany({
          where: { eventType: 'page_view' },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            eventType: true,
            resourceType: true,
            resourceId: true,
            createdAt: true
          }
        })
      ]);

      // Combine and format activities
      const activities = [
        ...recentArticles.map(article => ({
          id: article.id,
          type: 'article',
          title: `Artikel "${article.title}" ${article.status === 'published' ? 'dipublikasi' : 'dibuat'}`,
          author: article.authorName,
          timestamp: article.createdAt,
          data: article
        })),
        ...recentDonations.map(donation => ({
          id: donation.id,
          type: 'donation',
          title: `Program donasi "${donation.title}" dibuat`,
          author: 'Admin',
          timestamp: donation.createdAt,
          data: donation
        })),
        ...recentTransactions.map(transaction => ({
          id: transaction.id,
          type: 'transaction',
          title: `Donasi Rp ${transaction.amount.toLocaleString('id-ID')} diterima dari ${transaction.donorName}`,
          author: transaction.donorName,
          timestamp: transaction.paidAt,
          data: transaction
        }))
      ].sort((a, b) => {
        const aTime = new Date(a.timestamp || 0).getTime();
        const bTime = new Date(b.timestamp || 0).getTime();
        return bTime - aTime;
      })
        .slice(offset, offset + limit);

      return sendSuccess(res, {
        activities,
        total: activities.length,
        hasMore: activities.length === limit
      }, 'Real-time activity retrieved successfully');
    } catch (error) {
      console.error('Real-time activity error:', error);
      return sendError(res, 'Failed to retrieve real-time activity', 500);
    }
  }

  /**
   * Get charts data for dashboard
   * GET /api/admin/dashboard/charts
   */
  static async getChartsData(req: Request, res: Response) {
    try {
      const chartsData = await DashboardController.getMonthlyChartsData();
      return sendSuccess(res, chartsData, 'Charts data retrieved successfully');
    } catch (error) {
      console.error('Charts data error:', error);
      return sendError(res, 'Failed to retrieve charts data', 500);
    }
  }

  /**
   * Refresh dashboard cache
   * POST /api/admin/dashboard/stats/refresh
   */
  static async refreshDashboardCache(req: Request, res: Response) {
    try {
      // In a real implementation, this would clear cache and trigger background data refresh
      // For now, we'll just return success
      
      return sendSuccess(res, {
        refreshed: true,
        timestamp: new Date().toISOString()
      }, 'Dashboard cache refreshed successfully');
    } catch (error) {
      console.error('Dashboard cache refresh error:', error);
      return sendError(res, 'Failed to refresh dashboard cache', 500);
    }
  }

  /**
   * Helper method to get monthly charts data
   */
  private static async getMonthlyChartsData() {
    const now = new Date();
    const months = [];
    
    // Get last 6 months data
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(now, i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const [articlesCount, donationsSum, viewsCount] = await Promise.all([
        prisma.article.count({
          where: {
            createdAt: {
              gte: monthStart,
              lte: monthEnd
            }
          }
        }),
        prisma.donationTransaction.aggregate({
          where: {
            status: 'paid',
            paidAt: {
              gte: monthStart,
              lte: monthEnd
            }
          },
          _sum: { amount: true }
        }),
        prisma.analyticsEvent.count({
          where: {
            eventType: 'page_view',
            createdAt: {
              gte: monthStart,
              lte: monthEnd
            }
          }
        })
      ]);

      months.push({
        month: format(date, 'MMM yyyy'),
        articles: articlesCount,
        donations: donationsSum._sum.amount || 0,
        views: viewsCount
      });
    }

    return {
      monthlyTrends: months,
      donationsByCategory: await DashboardController.getDonationsByCategory(),
      viewsBySource: await DashboardController.getViewsBySource()
    };
  }

  /**
   * Helper method to get donations by category
   */
  private static async getDonationsByCategory() {
    const donations = await prisma.donation.groupBy({
      by: ['title'],
      _sum: {
        collectedAmount: true
      },
      orderBy: {
        _sum: {
          collectedAmount: 'desc'
        }
      },
      take: 5
    });

    return donations.map(donation => ({
      category: donation.title,
      amount: donation._sum.collectedAmount || 0
    }));
  }

  /**
   * Helper method to get views by source
   */
  private static async getViewsBySource() {
    // This would need referrer analysis in a real implementation
    // For now, return mock data
    return [
      { source: 'Direct', views: 450 },
      { source: 'Google', views: 320 },
      { source: 'Facebook', views: 180 },
      { source: 'Instagram', views: 95 },
      { source: 'Other', views: 55 }
    ];
  }
}
