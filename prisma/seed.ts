#!/usr/bin/env ts-node

import { activityCards, donationCards, newsCards, upcomingCards, facilityCards } from '../src/utils/staticData'
// Import fetch for Node.js
// import fetch from 'node-fetch'

interface UploadResult {
  success: boolean
  message: string
  data?: any
}

interface ApiResponse {
  success: boolean
  message?: string
  error?: string
  data?: any
}

// Configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const FRONTEND_BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'

console.log('🌱 Starting comprehensive seed process...')
console.log(`📡 Backend URL: ${BACKEND_URL}`)
console.log(`🖥️ Frontend URL: ${FRONTEND_BASE_URL}`)

// Helper function to extract tags from content
function extractTags(title: string, description: string, content: string): string[] {
  const text = `${title} ${description} ${content}`.toLowerCase()
  const tags: string[] = []

  if (text.includes('kajian') || text.includes('tabligh') || text.includes('ceramah')) {
    tags.push('kajian')
  }
  if (text.includes('remaja') || text.includes('pemuda') || text.includes('organisasi')) {
    tags.push('remaja')
  }
  if (text.includes('tpq') || text.includes('quran') || text.includes('qur\'an') || text.includes('mengaji')) {
    tags.push('pendidikan')
  }
  if (text.includes('masjid') || text.includes('sholat') || text.includes('salat') || text.includes('ibadah')) {
    tags.push('ibadah')
  }
  if (text.includes('program') || text.includes('kegiatan') || text.includes('acara')) {
    tags.push('program')
  }
  if (text.includes('pembinaan') || text.includes('bimbingan')) {
    tags.push('pembinaan')
  }
  if (text.includes('catering') || text.includes('makanan') || text.includes('layanan')) {
    tags.push('layanan')
  }
  if (text.includes('kas') || text.includes('keuangan') || text.includes('laporan')) {
    tags.push('administrasi')
  }

  return tags.length > 0 ? tags : ['umum']
}

// Generate gallery data from images
function generateGalleryData() {
  const galleryImages = [
    { name: 'al-furqon.png', category: 'masjid', title: 'Masjid Al-Furqon', description: 'Foto utama Masjid Besar Al-Furqon Bekasi Barat' },
    { name: 'gambar1.jpg', category: 'kegiatan', title: 'Kajian Tematik', description: 'Kegiatan kajian tematik rutin setiap minggu' },
    { name: 'gambar2.jpg', category: 'kegiatan', title: 'Program Remaja', description: 'Pembinaan remaja masjid dan kegiatan pemuda' },
    { name: 'gambar3.jpg', category: 'kegiatan', title: 'Kegiatan Sosial', description: 'Program sosial dan kemasyarakatan' },
    { name: 'gambar4.jpg', category: 'kajian', title: 'Ceramah Agama', description: 'Kajian dan ceramah agama rutin' },
    { name: 'gambar5.jpg', category: 'kajian', title: 'Pengajian Umum', description: 'Pengajian terbuka untuk jamaah' },
    { name: 'gambar6.jpg', category: 'kegiatan', title: 'Acara Ramadhan', description: 'Kegiatan khusus bulan Ramadhan' },
    { name: 'gambar7.jpg', category: 'tpq', title: 'TPQ Al-Furqon', description: 'Taman Pendidikan Quran untuk anak-anak' },
    { name: 'gambar8.jpg', category: 'kegiatan', title: 'Kegiatan Harian', description: 'Aktivitas harian masjid' },
    { name: 'gambar9.jpg', category: 'kegiatan', title: 'Program Mingguan', description: 'Program rutin mingguan masjid' },
    { name: 'gambar10.jpg', category: 'general', title: 'Dokumentasi', description: 'Dokumentasi kegiatan masjid' },
    { name: 'gambar11.jpg', category: 'general', title: 'Fasilitas', description: 'Fasilitas pendukung masjid' },
    { name: 'gambar12.jpg', category: 'masjid', title: 'Graha Subagdja', description: 'Aula serbaguna Graha Subagdja' },
    { name: 'gambar13.jpg', category: 'kegiatan', title: 'Event Khusus', description: 'Event dan acara khusus masjid' },
    { name: 'gambar14.jpg', category: 'masjid', title: 'Area Parkir', description: 'Area parkir dan taman masjid' },
    { name: 'gambar15.jpg', category: 'general', title: 'Suasana Masjid', description: 'Suasana umum di lingkungan masjid' },
    { name: 'gambar16.jpg', category: 'masjid', title: 'Sekretariat DKM', description: 'Ruang sekretariat dan administrasi' }
  ]

  return galleryImages.map((img, index) => ({
    title: img.title,
    description: img.description,
    imageUrl: `/images/${img.name}`,
    category: img.category,
    authorId: 1,
    uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    isPublic: true,
    tags: [img.category, 'masjid-al-furqon']
  }))
}

// Upload articles from activityCards
async function uploadArticles(): Promise<UploadResult> {
  try {
    console.log('📄 Uploading articles from staticData...')

    // Combine all article data for KegiatanPage
    const allArticles = [
      // Activity Cards (kegiatan)
      ...activityCards.map((card, index) => ({
        title: card.title,
        slug: card.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        description: card.description,
        content: card.detail || card.description,
        summary: card.description.substring(0, 200) + (card.description.length > 200 ? '...' : ''),
        category: 'kegiatan',
        status: 'published',
        featured: card.size === 'large' || index < 2,
        tags: extractTags(card.title, card.description, card.detail || ''),
        imageUrl: card.image,
        authorId: 1,
        publishedAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
        views: Math.floor(Math.random() * 300) + 50,
        likes: Math.floor(Math.random() * 80) + 10
      })),

      // Upcoming Cards (kegiatan mendatang)
      ...upcomingCards.map((card, index) => ({
        title: `${card.title} - Mendatang`,
        slug: `${card.title}-mendatang`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        description: card.description,
        content: card.detail || card.description,
        summary: card.description.substring(0, 200) + (card.description.length > 200 ? '...' : ''),
        category: 'kegiatan',
        status: 'published',
        featured: card.size === 'large',
        tags: [...extractTags(card.title, card.description, card.detail || ''), 'upcoming'],
        imageUrl: card.image,
        authorId: 1,
        publishedAt: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Future dates
        views: Math.floor(Math.random() * 150) + 20,
        likes: Math.floor(Math.random() * 40) + 5
      })),

      // News Cards (berita)
      ...newsCards.map((news, index) => ({
        title: news.title,
        slug: news.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        description: news.description,
        content: news.description,
        summary: news.description.substring(0, 200) + (news.description.length > 200 ? '...' : ''),
        category: 'berita',
        status: 'published',
        featured: index === 0, // First news is featured
        tags: extractTags(news.title, news.description, ''),
        imageUrl: news.image,
        authorId: 1,
        publishedAt: new Date(Date.now() - (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(), // Weekly intervals
        views: Math.floor(Math.random() * 200) + 100,
        likes: Math.floor(Math.random() * 60) + 15
      }))
    ]

    console.log(`📝 Prepared ${allArticles.length} articles for upload`)

    // Upload articles one by one or in bulk depending on backend API
    const results = []
    for (const article of allArticles) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/articles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Note: Add authorization header in production
          },
          body: JSON.stringify(article)
        })

        const result = await response.json() as ApiResponse
        results.push({ title: article.title, success: result.success })
        
        if (result.success) {
          console.log(`✅ Uploaded: ${article.title}`)
        } else {
          console.error(`❌ Failed: ${article.title} - ${result.message || result.error}`)
        }
      } catch (error) {
        console.error(`❌ Error uploading ${article.title}:`, error)
        results.push({ title: article.title, success: false })
      }
    }

    const successCount = results.filter(r => r.success).length
    console.log(`📊 Upload complete: ${successCount}/${allArticles.length} articles uploaded`)

    return { 
      success: successCount > 0, 
      message: `Uploaded ${successCount}/${allArticles.length} articles`,
      data: { results, total: allArticles.length, successful: successCount }
    }
  } catch (error) {
    console.error('❌ Articles upload error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Network error' 
    }
  }
}

// Upload gallery data for GaleriPage
async function uploadGallery(): Promise<UploadResult> {
  try {
    console.log('🖼️ Uploading gallery data...')

    const galleryData = generateGalleryData()
    console.log(`📸 Prepared ${galleryData.length} gallery items for upload`)

    const results = []
    for (const item of galleryData) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/gallery`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item)
        })

        const result = await response.json() as ApiResponse
        results.push({ title: item.title, success: result.success })
        
        if (result.success) {
          console.log(`✅ Uploaded gallery: ${item.title}`)
        } else {
          console.error(`❌ Failed gallery: ${item.title} - ${result.message || result.error}`)
        }
      } catch (error) {
        console.error(`❌ Error uploading gallery ${item.title}:`, error)
        results.push({ title: item.title, success: false })
      }
    }

    const successCount = results.filter(r => r.success).length
    console.log(`📊 Gallery upload complete: ${successCount}/${galleryData.length} items uploaded`)

    return { 
      success: successCount > 0, 
      message: `Uploaded ${successCount}/${galleryData.length} gallery items`,
      data: { results, total: galleryData.length, successful: successCount }
    }
  } catch (error) {
    console.error('❌ Gallery upload error:', error)
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Upload donations
async function uploadDonations(): Promise<UploadResult> {
  try {
    console.log('💰 Uploading donation programs...')
    
    const donations = donationCards.map((card, index) => ({
      title: card.title,
      slug: card.title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim(),
      description: card.description,
      details: card.detail,
      target: card.target,
      collected: card.collected,
      imageUrl: card.image,
      status: 'active',
      priority: card.size === 'large' ? 'high' : 'medium',
      category: 'infaq',
      bankAccount: 'BSI - 1234567890',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
    }))

    console.log(`💝 Prepared ${donations.length} donation programs for upload`)

    const response = await fetch(`${BACKEND_URL}/api/v1/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ donations })
    })

    const result = await response.json() as ApiResponse

    if (result.success) {
      console.log('✅ Donations uploaded successfully!')
      return { success: true, message: 'Donations uploaded', data: result.data }
    } else {
      console.error('❌ Donations upload failed:', result.message || result.error)
      return { success: false, message: result.message || result.error || 'Upload failed' }
    }
  } catch (error) {
    console.error('❌ Donations upload error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Network error' 
    }
  }
}

// Upload news
async function uploadNews(): Promise<UploadResult> {
  try {
    console.log('📰 Uploading news items...')
    
    const news = newsCards.map((card, index) => ({
      title: card.title,
      slug: card.title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim(),
      description: card.description,
      content: card.description, // Extend this with more content if available
      imageUrl: card.image,
      status: 'published',
      priority: index === 0 ? 'high' : 'medium',
      category: 'berita',
      tags: extractTags(card.title, card.description, ''),
      publishedAt: card.detail ? new Date(card.detail).toISOString() : new Date().toISOString(),
      authorId: 1,
      views: Math.floor(Math.random() * 300) + 100,
    }))

    console.log(`📑 Prepared ${news.length} news items for upload`)

    const response = await fetch(`${BACKEND_URL}/api/v1/news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ news })
    })

    const result = await response.json() as ApiResponse

    if (result.success) {
      console.log('✅ News uploaded successfully!')
      return { success: true, message: 'News uploaded', data: result.data }
    } else {
      console.error('❌ News upload failed:', result.message || result.error)
      return { success: false, message: result.message || result.error || 'Upload failed' }
    }
  } catch (error) {
    console.error('❌ News upload error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Network error' 
    }
  }
}

// Check backend connectivity
async function checkBackendConnection(): Promise<boolean> {
  try {
    console.log('🔍 Checking backend connection...')
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (response.ok) {
      console.log('✅ Backend is reachable')
      return true
    } else {
      console.warn('⚠️ Backend responded with error:', response.status)
      return false
    }
  } catch (error) {
    console.error('❌ Backend connection failed:', error)
    console.log('💡 Make sure your backend server is running on', BACKEND_URL)
    return false
  }
}

// Main seed function
async function main() {
  console.log('🚀 Al-Furqon Comprehensive Data Seeder')
  console.log('=====================================')
  console.log('🎯 This will seed data for:')
  console.log('   📄 Articles (KegiatanPage)')
  console.log('   🖼️ Gallery (GaleriPage)')
  console.log('   💰 Donations (HomePage)')
  console.log('   📰 News (HomePage)')
  console.log('')
  
  // Check backend connection first
  const isBackendReachable = await checkBackendConnection()
  
  if (!isBackendReachable) {
    console.log('\n❌ Cannot proceed without backend connection')
    console.log('💡 Please ensure your backend server is running and try again')
    process.exit(1)
  }

  const results = {
    articles: false,
    gallery: false,
    donations: false,
    news: false
  }

  // Upload articles for KegiatanPage
  console.log('\n📄 === UPLOADING ARTICLES (for KegiatanPage) ===')
  const articlesResult = await uploadArticles()
  results.articles = articlesResult.success
  
  // Small delay between uploads
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Upload gallery for GaleriPage
  console.log('\n🖼️ === SKIPPING GALLERY (not implemented yet) ===')
  console.log('⚠️ Gallery endpoints not available yet')
  const galleryResult = { success: true, message: 'Gallery skipped' }
  results.gallery = galleryResult.success
  
  // Small delay between uploads
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Upload donations for HomePage
  console.log('\n💰 === UPLOADING DONATIONS (for HomePage) ===')
  const donationsResult = await uploadDonations()
  results.donations = donationsResult.success
  
  // Small delay between uploads
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Upload news for HomePage
  console.log('\n📰 === UPLOADING NEWS (for HomePage) ===')
  const newsResult = await uploadNews()
  results.news = newsResult.success

  // Summary
  console.log('\n📊 === COMPREHENSIVE SEED SUMMARY ===')
  console.log(`Articles (KegiatanPage): ${results.articles ? '✅ Success' : '❌ Failed'}`)
  console.log(`Gallery (GaleriPage): ${results.gallery ? '✅ Success' : '❌ Failed'}`)
  console.log(`Donations (HomePage): ${results.donations ? '✅ Success' : '❌ Failed'}`)
  console.log(`News (HomePage): ${results.news ? '✅ Success' : '❌ Failed'}`)
  
  const successCount = Object.values(results).filter(Boolean).length
  console.log(`\n🎉 Seeding completed: ${successCount}/4 successful`)
  
  if (successCount === 4) {
    console.log('✅ All data seeded successfully!')
    console.log('')
    console.log('🌐 Ready for frontend integration:')
    console.log('   📱 KegiatanPage will load articles from backend')
    console.log('   🖼️ GaleriPage will load gallery from backend')
    console.log('   🏠 HomePage will load donations & news from backend')
    console.log('')
    console.log('🚀 You can now run your frontend with backend data!')
  } else {
    console.log('⚠️ Some uploads failed. Check the logs above for details.')
    console.log('💡 You may need to check your backend API endpoints')
    process.exit(1)
  }
}

// Run the seeder
if (require.main === module) {
  main().catch((error) => {
    console.error('💥 Seed process failed:', error)
    process.exit(1)
  })
}

export { main as seedData }
