export interface AdminLoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AdminRefreshTokenRequest {
  refreshToken: string;
}

export interface AdminLogoutRequest {
  token: string;
}

export interface AdminLoginResponse {
  user: AdminUser;
  token: string;
  refreshToken: string;
  expiresIn: number;
  permissions: string[];
}

export interface AdminRefreshTokenResponse {
  token: string;
  expiresIn: number;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'editor';
  permissions: string[];
  isActive: boolean;
  lastLogin: string;
  loginCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalArticles: number;
  totalDonations: number;
  totalNews: number;
  totalTransactions: number;
  totalRevenue: number;
  recentActivity: RecentActivity[];
  chartData: ChartData;
}

export interface RecentActivity {
  id: string;
  type: 'article' | 'donation' | 'news' | 'user' | 'transaction';
  action: 'created' | 'updated' | 'deleted' | 'published';
  title: string;
  user: string;
  timestamp: Date;
}

export interface ChartData {
  donations: MonthlyData[];
  articles: MonthlyData[];
  users: MonthlyData[];
  revenue: MonthlyData[];
}

export interface MonthlyData {
  month: string;
  value: number;
}

export interface AdminArticle {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image?: string;
  status: 'draft' | 'published' | 'archived';
  category: string;
  authorName: string;
  publishedAt?: Date;
  views: number;
  likes: number;
  featured: boolean;
  tags: string[];
  allowComments?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminDonation {
  id: string;
  title: string;
  slug: string;
  status: 'active' | 'inactive' | 'completed' | 'suspended';
  targetAmount: number;
  collectedAmount: number;
  totalDonors: number;
  progress: number;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminNews {
  id: string;
  title: string;
  slug: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  publishedAt?: Date;
  authorName: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminTransaction {
  id: string;
  donationId: string;
  donationTitle: string;
  donorName: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  paymentMethod: string;
  createdAt: Date;
  paidAt?: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface AdminFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isActive?: boolean;
}

export interface CreateArticleRequest {
  title: string;
  content: string;
  description?: string;
  category: string;
  status: 'draft' | 'published';
  featured?: boolean;
  tags?: string[];
  image?: string;
}

export interface UpdateArticleRequest extends Partial<CreateArticleRequest> {
  id: string;
}

export interface CreateDonationRequest {
  title: string;
  description: string;
  detail: string;
  targetAmount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  startDate: Date;
  endDate?: Date;
  image?: string;
}

export interface UpdateDonationRequest extends Partial<CreateDonationRequest> {
  id: string;
}

export interface CreateNewsRequest {
  title: string;
  content: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  publishedAt?: Date;
  image?: string;
}

export interface UpdateNewsRequest extends Partial<CreateNewsRequest> {
  id: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  name: string;
  password: string;
  role: 'super_admin' | 'admin' | 'editor';
  permissions: string[];
  isActive: boolean;
}

export interface UpdateUserRequest extends Partial<Omit<CreateUserRequest, 'password'>> {
  id: string;
  password?: string;
}

export interface FileUploadResponse {
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  url: string;
}
