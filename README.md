# 🕌 Al-Furqon Backend API 

**Content Management System untuk Masjid Al-Furqon** - Backend API yang powerful dan mudah diintegrasikan dengan frontend framework apapun.

## 📋 Quick Navigation

| **For** | **File** | **Description** |
|---------|----------|-----------------|
| 🚀 **Quick Start** | [QUICK_SETUP.md](QUICK_SETUP.md) | Setup backend dalam 5 menit |
| � **PostgreSQL Migration** | [POSTGRESQL_MIGRATION.md](POSTGRESQL_MIGRATION.md) | SQLite ke PostgreSQL guide |
| �📖 **API Reference** | [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | Complete API documentation |
| 🔗 **Frontend Integration** | [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md) | Frontend integration guide |
| 🎨 **Framework Examples** | [FRAMEWORK_EXAMPLES.md](FRAMEWORK_EXAMPLES.md) | Next.js, React, Vue examples |
| ⚙️ **Environment Config** | [ENVIRONMENT_CONFIG.md](ENVIRONMENT_CONFIG.md) | Environment templates |
| 📋 **Changelog** | [CHANGELOG.md](CHANGELOG.md) | Recent updates & breaking changes |

## 🎯 Overview

Modern backend API untuk Content Management System Masjid Al-Furqon dengan fitur lengkap:

### 🛠️ Tech Stack
- **Runtime**: Node.js 18+ + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (SQLite untuk development)
- **ORM**: Prisma
- **Authentication**: JWT
- **Documentation**: Swagger UI
- **Upload**: Multer + File validation
- **Security**: Helmet, CORS, Rate limiting

### 🌐 Base URLs
- **Development**: `http://localhost:5000`
- **API Docs**: `http://localhost:5000/api-docs`
- **Health Check**: `http://localhost:5000/health`

### ✨ Recent Updates (June 29, 2025)
- 🔥 **Enhanced Donation API** with pagination, filtering & validation
- 🎯 **Improved TypeScript** configuration and error handling  
- 📚 **Updated Documentation** with latest API changes
- 🔧 **Better Frontend Integration** examples

## 🚀 5-Minute Quick Start

Ingin langsung coba? Ikuti [QUICK_SETUP.md](QUICK_SETUP.md) untuk setup backend dalam 5 menit!

```bash
# 1. Clone & install
git clone <repo-url> && cd BE_Al-Furqon && npm install

# 2. Setup environment
cp .env.example .env

# 3. Setup PostgreSQL database (recommended)
npm run setup

# Or manual setup:
npm run db:up
npm run prisma:migrate
npm run prisma:seed

# 4. Start server
npm run dev
```

**✅ Backend running at** `http://localhost:5000`

## 🐘 PostgreSQL Migration

**Update Terbaru**: Proyek ini telah dimigrasikan dari SQLite ke PostgreSQL untuk production readiness.

- ✅ **Zero Breaking Changes** - Semua API tetap sama
- ✅ **Same Database Schema** - Struktur database identik 
- ✅ **Auto Setup** - Docker Compose untuk development
- ✅ **Production Ready** - Siap deploy ke Railway, Vercel, Heroku

**Panduan lengkap**: [POSTGRESQL_MIGRATION.md](POSTGRESQL_MIGRATION.md)

## 🎯 Key Features

### 📊 **Enhanced Donation Management**
- ✅ Pagination & filtering support
- ✅ Title-based search (case-insensitive)
- ✅ Complete CRUD with validation
- ✅ Transaction tracking
- ✅ Progress calculation
- ✅ SEO-friendly slugs

### 🔐 **Robust Security**
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Rate limiting
- ✅ Input validation
- ✅ File upload security

### 🌐 **Developer-Friendly API**
- ✅ RESTful endpoints
- ✅ Consistent response format
- ✅ Comprehensive error handling
- ✅ Swagger documentation
- ✅ TypeScript support

### 🎨 **Multi-Framework Ready**
- ✅ Next.js integration examples
- ✅ React (Vite) examples  
- ✅ Vue 3 examples
- ✅ Vanilla JS examples
- ✅ React Native examples

## Keamanan

API ini hanya bisa diakses dari localhost untuk alasan keamanan. Beberapa pembatasan yang diterapkan:

- CORS dibatasi hanya untuk origin localhost
- Server hanya listen pada 127.0.0.1
- Rate limiting untuk mencegah brute force
- Validasi input yang ketat
- JWT untuk autentikasi

## 🔗 API Endpoints Summary

> **📖 Full Documentation:** [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

### 🏠 **Core Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Welcome message with endpoints list |
| `GET` | `/health` | Health check status |
| `GET` | `/api/v1/home/dashboard` | Homepage dashboard data |
| `GET` | `/api/v1/statistics/public` | Public statistics |

### 📰 **Articles Management**
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/v1/articles` | Get articles (with pagination) | ❌ |
| `GET` | `/api/v1/articles/:id` | Get article by ID | ❌ |
| `POST` | `/api/v1/articles` | Create new article | ✅ |
| `PUT` | `/api/v1/articles/:id` | Update article | ✅ |
| `DELETE` | `/api/v1/articles/:id` | Delete article | ✅ |

### 💰 **Donations Management** (✨ **Enhanced**)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/v1/donations` | Get donations (pagination + search) | ❌ |
| `GET` | `/api/v1/donations/:id` | Get donation + transactions | ❌ |
| `POST` | `/api/v1/donations` | Create donation (with image) | ✅ |
| `PUT` | `/api/v1/donations/:id` | Update donation | ✅ |
| `DELETE` | `/api/v1/donations/:id` | Delete donation | ✅ |

**New Donation Features:**
- 🔍 **Title Search**: `GET /api/v1/donations?title=renovasi`
- 📄 **Pagination**: `GET /api/v1/donations?page=2&limit=5`
- 💼 **Enhanced Data**: Includes `slug`, `detail`, `totalDonors`, `transactions`

### 📢 **News Management**
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/v1/news` | Get news (with pagination) | ❌ |
| `GET` | `/api/v1/news/:id` | Get news by ID | ❌ |
| `POST` | `/api/v1/news` | Create news | ✅ |
| `PUT` | `/api/v1/news/:id` | Update news | ✅ |
| `DELETE` | `/api/v1/news/:id` | Delete news | ✅ |

### 🔐 **Authentication**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/login` | User login |
| `POST` | `/api/v1/auth/register` | Register new user (protected) |
| `GET` | `/api/v1/auth/me` | Get current user |

### 📁 **File Upload**
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/v1/upload` | Upload image files | ✅ |

**Supported formats:** JPG, JPEG, PNG, WEBP (max 10MB)
{
  "success": true,
  "data": {
    "statistics": {
      "totalArticles": 25,
      "activeDonations": 5,
      "totalNews": 10,
      "totalUsers": 150
    },
    "latestArticles": [
      {
        "id": "cuid_article_1",
        "title": "Kegiatan Bakti Sosial",
        "slug": "kegiatan-bakti-sosial",
        "description": "Deskripsi kegiatan bakti sosial...",
        "image": "/uploads/article1.jpg",
        "category": "kegiatan",
        "publishedAt": "2025-06-28T10:00:00.000Z",
        "authorName": "Admin Masjid"
      }
    ],
    "activeDonations": [
      {
        "id": "cuid_donation_1",
        "title": "Pembangunan Masjid",
        "description": "Dana pembangunan masjid tahap 2",
        "image": "/uploads/donation1.jpg",
        "targetAmount": 50000000,
        "collectedAmount": 25000000,
        "endDate": "2025-12-31T23:59:59.000Z"
      }
    ],
    "latestNews": [
      {
        "id": "cuid_news_1",
        "title": "Pengumuman Sholat Jumat",
        "content": "Sholat Jumat dimulai pukul 12:00 WIB",
        "priority": "high",
        "publishedAt": "2025-06-29T04:00:00.000Z"
      }
    ]
  }
}
```

### 📊 Statistics Endpoints

#### Get Public Statistics
```
GET /api/v1/statistics/public
```
**Description:** Mengambil statistik public untuk ditampilkan di homepage

**Response:**
```json
{
  "success": true,
  "data": {
    "totalArticles": 25,
    "activeDonations": 5,
    "totalDonationTarget": 50000000,
    "totalDonationCollected": 25000000,
    "totalNews": 10,
    "donationProgress": 50
  }
}
```

### 📰 Articles Endpoints

#### Get Articles List
```
GET /api/v1/articles
```
**Query Parameters:**
- `category` (optional): Filter by category (`kegiatan`, `berita`, `sumbangan`, `fasilitas`, `profil`)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 50)

**Example:**
```
GET /api/v1/articles?category=kegiatan&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cuid_article_1",
      "title": "Kegiatan Bakti Sosial",
      "slug": "kegiatan-bakti-sosial",
      "description": "Deskripsi kegiatan bakti sosial...",
      "image": "/uploads/article1.jpg",
      "category": "kegiatan",
      "publishedAt": "2025-06-28T10:00:00.000Z",
      "authorName": "Admin Masjid",
      "authorAvatar": "/uploads/avatar1.jpg"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### 💰 Donations Endpoints

#### Get Donations List
```
GET /api/v1/donations
```
**Query Parameters:**
- `status` (optional): Filter by status (`active`, `completed`, `suspended`) - default: `active`

**Example:**
```
GET /api/v1/donations?status=active
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cuid_donation_1",
      "title": "Pembangunan Masjid",
      "description": "Dana pembangunan masjid tahap 2",
      "image": "/uploads/donation1.jpg",
      "targetAmount": 50000000,
      "collectedAmount": 25000000,
      "endDate": "2025-12-31T23:59:59.000Z",
      "createdAt": "2025-06-01T00:00:00.000Z",
      "progress": 50,
      "remainingAmount": 25000000
    }
  ]
}
```

### 📢 News Endpoints

#### Get News List
```
GET /api/v1/news
```
**Query Parameters:**
- `priority` (optional): Filter by priority (`high`, `medium`, `low`)
- `limit` (optional): Number of items to return (default: 10, max: 50)

**Example:**
```
GET /api/v1/news?priority=high&limit=5
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cuid_news_1",
      "title": "Pengumuman Sholat Jumat",
      "content": "Sholat Jumat dimulai pukul 12:00 WIB",
      "priority": "high",
      "publishedAt": "2025-06-29T04:00:00.000Z",
      "createdAt": "2025-06-29T03:00:00.000Z"
    }
  ]
}
```

## 🗄️ Database Schema

### User Model
```typescript
{
  id: string          // CUID
  email: string       // Unique
  password: string    // Hashed with bcryptjs
  name: string
  role: 'admin' | 'editor' | 'user'
  avatar?: string
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}
```

### Article Model
```typescript
{
  id: string
  title: string
  slug: string        // Unique
  description?: string
  content?: string
  image?: string
  category: 'kegiatan' | 'berita' | 'sumbangan' | 'fasilitas' | 'profil'
  status: 'published' | 'draft' | 'archived'
  authorId?: string
  authorName?: string
  authorAvatar?: string
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
  views: number
  likes: number
  featured: boolean
  tags?: JSON
  metaData?: JSON
}
```

### Donation Model
```typescript
{
  id: string
  title: string
  slug: string        // Unique
  description: string
  detail?: string
  image?: string
  targetAmount: number
  collectedAmount: number
  status: 'active' | 'completed' | 'suspended'
  startDate?: Date
  endDate?: Date
  bankName?: string
  accountNumber?: string
  accountName?: string
  qrisCode?: string
  createdAt: Date
  updatedAt: Date
  totalDonors: number
}
```

### News Model
```typescript
{
  id: string
  title: string
  slug: string        // Unique
  description?: string
  content?: string
  image?: string
  category: string
  priority: 'high' | 'medium' | 'low'
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
  authorId?: string
  authorName?: string
  views: number
  summary?: string
  metaData?: JSON
}
```

## 🔐 Authentication

### Login
```
POST /api/v1/auth/login
```
**Request Body:**
```json
{
  "email": "admin@alfurqon.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cuid_user_1",
      "email": "admin@alfurqon.com",
      "name": "Admin User",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

### Protected Routes
Gunakan Bearer Token di header:
```
Authorization: Bearer your-jwt-token
```

## ❌ Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "Error message here",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## 🔗 Frontend Integration Guide

### 1. Base Configuration
```typescript
// frontend/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};
```

### 2. API Helper Functions
```typescript
// frontend/lib/apiClient.ts
class ApiClient {
  private baseURL: string;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async get(endpoint: string) {
    const response = await fetch(`${this.baseURL}${endpoint}`);
    return response.json();
  }

  async post(endpoint: string, data: any) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
```

### 3. Data Fetching Examples

#### Homepage Data
```typescript
// frontend/hooks/useHomepage.ts
export async function getHomepageData() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/home/dashboard`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    throw error;
  }
}
```

#### Articles with Pagination
```typescript
// frontend/hooks/useArticles.ts
export async function getArticles(params: {
  category?: string;
  page?: number;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  
  if (params.category) searchParams.set('category', params.category);
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  
  const url = `${API_BASE_URL}/api/v1/articles?${searchParams}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return {
      articles: data.data,
      pagination: data.pagination
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
}
```

#### Statistics for Counters
```typescript
// frontend/hooks/useStatistics.ts
export async function getPublicStatistics() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/statistics/public`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
}
```

### 4. React Components Examples

#### Homepage Statistics Component
```tsx
// frontend/components/StatisticsSection.tsx
import { useEffect, useState } from 'react';
import { getPublicStatistics } from '@/hooks/useStatistics';

export function StatisticsSection() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getPublicStatistics();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!stats) return <div>Failed to load statistics</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="stat-card">
        <h3>Total Artikel</h3>
        <p>{stats.totalArticles}</p>
      </div>
      <div className="stat-card">
        <h3>Donasi Aktif</h3>
        <p>{stats.activeDonations}</p>
      </div>
      <div className="stat-card">
        <h3>Total Donasi</h3>
        <p>Rp {stats.totalDonationCollected.toLocaleString()}</p>
      </div>
      <div className="stat-card">
        <h3>Progress</h3>
        <p>{stats.donationProgress}%</p>
      </div>
    </div>
  );
}
```

### 5. Environment Setup

#### Frontend .env.local
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_UPLOAD_URL=http://localhost:5000/uploads
```

#### CORS Configuration
Backend sudah dikonfigurasi untuk menerima request dari:
- `http://localhost:3000` (Next.js default)
- `http://localhost:3001` (Alternative port)

### 6. Image Handling
Semua gambar dari backend bisa diakses dengan:
```
http://localhost:5000/uploads/filename.jpg
```

Contoh penggunaan di frontend:
```tsx
<img 
  src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}${article.image}`}
  alt={article.title}
/>
```

### 7. Error Handling di Frontend
```typescript
// frontend/utils/errorHandler.ts
export function handleApiError(error: any) {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || 'Server error';
    throw new Error(message);
  } else if (error.request) {
    // Network error
    throw new Error('Network error. Please check your connection.');
  } else {
    // Other error
    throw new Error(error.message || 'An unexpected error occurred');
  }
}
```

## 🛠️ Development Tools

### Available Scripts
```bash
# Development
yarn dev              # Start development server
yarn build           # Build for production
yarn start           # Start production server

# Database
yarn prisma:generate # Generate Prisma client
yarn prisma:migrate  # Run database migrations
yarn prisma:studio   # Open Prisma Studio
yarn prisma:seed     # Seed database with initial data

# Testing
yarn test            # Run tests
yarn test:watch      # Run tests in watch mode

# Code Quality
yarn lint            # Run ESLint
yarn lint:fix        # Fix ESLint errors
```

### Default Admin Account
```
Email: admin@alfurqon.com
Password: admin123
```

## 📱 Testing the API

### Using Swagger UI
1. Start the development server: `yarn dev`
2. Open browser and go to: `http://localhost:5000/api-docs`
3. Test all endpoints interactively

### Using cURL
```bash
# Test health check
curl http://localhost:5000/health

# Test dashboard data
curl http://localhost:5000/api/v1/home/dashboard

# Test articles with pagination
curl "http://localhost:5000/api/v1/articles?page=1&limit=5"

# Test donations
curl http://localhost:5000/api/v1/donations

# Test news with priority filter
curl "http://localhost:5000/api/v1/news?priority=high&limit=3"

# Test statistics
curl http://localhost:5000/api/v1/statistics/public
```

### Using Browser
Semua GET endpoints bisa ditest langsung di browser:
- `http://localhost:5000/` - Root information
- `http://localhost:5000/health` - Health check
- `http://localhost:5000/api/v1/home/dashboard` - Dashboard data
- `http://localhost:5000/api/v1/statistics/public` - Public statistics
- `http://localhost:5000/api/v1/articles` - Articles list
- `http://localhost:5000/api/v1/donations` - Donations list
- `http://localhost:5000/api/v1/news` - News list

---

**🚀 Backend API Al-Furqon siap digunakan! Silakan integrasikan dengan frontend sesuai dokumentasi di atas.**

## 📞 Support

Jika ada pertanyaan atau masalah dengan integrasi, silakan buat issue atau hubungi tim development.

## 📚 Complete Documentation

### 📋 Documentation Files

Repository ini menyediakan dokumentasi lengkap dalam file terpisah:

1. **[QUICK_SETUP.md](./QUICK_SETUP.md)** - Setup backend dalam 5 menit
   - Installation guide
   - Environment configuration
   - Database setup
   - Testing commands
   - Troubleshooting

2. **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Dokumentasi API lengkap
   - Semua endpoint dengan contoh request/response
   - Authentication flow
   - Error handling
   - Data types dan interfaces
   - Testing examples dengan cURL dan JavaScript

3. **[FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)** - Panduan integrasi frontend
   - API client setup (Fetch, Axios, SWR)
   - Authentication context
   - Custom hooks
   - Component examples
   - Error handling patterns
   - Performance optimization

4. **[FRAMEWORK_EXAMPLES.md](./FRAMEWORK_EXAMPLES.md)** - Contoh integrasi framework
   - Next.js (App Router & Pages Router)
   - React with Vite
   - Vue 3 Composition API
   - Vanilla JavaScript
   - React Native
   - Testing utilities

5. **[ENVIRONMENT_CONFIG.md](./ENVIRONMENT_CONFIG.md)** - Template konfigurasi environment
   - Development, Production, Testing environment
   - Frontend environment variables
   - Docker configuration
   - Cloud deployment (Vercel, Railway, Heroku, AWS)
   - CI/CD pipeline
   - Security checklist

6. **[CHANGELOG.md](./CHANGELOG.md)** - Daftar perubahan dan pembaruan
   - Ringkasan perubahan terbaru
   - Panduan migrasi untuk breaking changes

### 🚀 Quick Links

| **Task** | **Documentation** | **Description** |
|----------|-------------------|-----------------|
| **Setup Backend** | [QUICK_SETUP.md](./QUICK_SETUP.md) | Install dan jalankan backend dalam 5 menit |
| **Test API** | `http://localhost:5000/api-docs` | Swagger UI untuk testing |
| **Integrate Frontend** | [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md) | Panduan lengkap integrasi |
| **Framework Examples** | [FRAMEWORK_EXAMPLES.md](./FRAMEWORK_EXAMPLES.md) | Copy-paste code untuk berbagai framework |
| **Environment Setup** | [ENVIRONMENT_CONFIG.md](./ENVIRONMENT_CONFIG.md) | Template .env dan deployment |
| **API Reference** | [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | Dokumentasi lengkap semua endpoint |
| **Changelog** | [CHANGELOG.md](./CHANGELOG.md) | Daftar perubahan dan pembaruan |

### 📱 Framework Support

Backend Al-Furqon telah diuji dan didokumentasikan untuk:

- ✅ **Next.js** 13+ (App Router & Pages Router)
- ✅ **React** 18+ (Vite, CRA)
- ✅ **Vue.js** 3+ (Composition API)
- ✅ **Vanilla JavaScript** (ES6+)
- ✅ **React Native** (Expo & CLI)
- ✅ **TypeScript** (Full type support)

### 🧪 Testing

```bash
# Test API endpoints
curl http://localhost:5000/health
curl http://localhost:5000/api/v1/home/dashboard

# Test with browser
open http://localhost:5000
open http://localhost:5000/api-docs

# Load test data
yarn prisma:seed
yarn prisma:studio
```

### 🆘 Support & Troubleshooting

1. **Backend tidak bisa diakses?**
   - Check apakah backend berjalan di port 5000
   - Lihat [QUICK_SETUP.md](./QUICK_SETUP.md) section troubleshooting

2. **CORS error dari frontend?**
   - Pastikan ALLOWED_ORIGINS di .env include URL frontend
   - Default: `http://localhost:3000,http://localhost:3001`

3. **Database error?**
   - Jalankan `yarn prisma:reset` untuk reset database
   - Jalankan `yarn prisma:migrate` dan `yarn prisma:seed`

4. **Authentication tidak bekerja?**
   - Check JWT_SECRET di .env
   - Lihat contoh authentication di [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)

5. **Upload file error?**
   - Pastikan folder `uploads/` ada dan writable
   - Check MAX_FILE_SIZE di .env

### 🔗 Useful Links

- **Swagger UI**: http://localhost:5000/api-docs
- **Prisma Studio**: `yarn prisma:studio` → http://localhost:5555
- **Health Check**: http://localhost:5000/health
- **Dashboard API**: http://localhost:5000/api/v1/home/dashboard

---

**Backend Al-Furqon siap digunakan!** 🚀

Pilih dokumentasi yang sesuai dengan kebutuhan Anda dan mulai development. Semua dokumentasi telah disesuaikan untuk memudahkan integrasi dengan frontend.
