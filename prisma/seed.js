const fetch = require('node-fetch')

// Configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// Static data
const activityCards = [
  {
    id: '1',
    title: 'Kajian Tematik setiap Ahad Pagi minggu ke Lima',
    description: 'Program - 3 Feb 2024',
    detail: 'Pembahasan tema khusus bersama ustadz tamu setiap akhir bulan...',
    image: '/images/gambar1.jpg',
    size: 'large',
  },
  {
    id: '2',
    title: 'Kajian Spesial Akhir Bulan',
    description: 'Program - 24 Feb 2024',
    detail: 'Kajian eksklusif akhir bulan dengan bahasan fiqh kontemporer.',
    image: '/images/gambar2.jpg',
    size: 'small',
  },
  {
    id: '3',
    title: 'Pembinaan Remaja Masjid',
    description: 'Program - 10 Feb 2024',
    detail: 'Program khusus untuk pembinaan akhlak dan organisasi remaja masjid.',
    image: '/images/gambar3.jpg',
    size: 'small',
  },
  {
    id: '4',
    title: 'Kajian Spesial Awal Bulan',
    description: 'Program - 10 Maret 2024',
    detail: 'Mengawali bulan dengan kajian ruhiyah dan muhasabah.',
    image: '/images/gambar1.jpg',
    size: 'large',
  },
  {
    id: '5',
    title: 'Pembinaan Remaja Masjid no 2',
    description: 'Program - 12 Maret 2024',
    detail: 'Lanjutan pembinaan sesi pertama untuk remaja masjid.',
    image: '/images/gambar2.jpg',
    size: 'small',
  },
  {
    id: '6',
    title: 'Pembinaan Remaja Masjid no 3',
    description: 'Program - 15 Maret 2024',
    detail: 'Sesi ketiga pembinaan dengan fokus pada leadership remaja.',
    image: '/images/gambar3.jpg',
    size: 'small',
  }
]

const donationCards = [
  {
    id: 'd1',
    title: 'Infaq Pembangunan TPQ Al Furqon',
    description: 'Berang siapa membangun masjid karena Allah maka Allah akan membangunkan untuknya istana di surga',
    detail: 'Target: 200.000.000',
    target: 200000000,
    collected: 125000000,
    image: '/images/iqro.jpg',
    size: 'large',
  },
  {
    id: 'd2',
    title: 'Infaq & Sedekah',
    description: 'Menginfakkan hartanya di jalan Allah seperti sebutir biji yang menumbuhkan 7 tangkai...',
    detail: 'Target: 50.000.000',
    target: 50000000,
    collected: 32000000,
    image: '/images/infaq.jpg',
    size: 'small',
  },
  {
    id: 'd3',
    title: 'Santunan Anak yatim & Dhuafa',
    description: 'Orang yang memelihara anak yatim di kalangan umat muslim...',
    detail: 'Target: 10.000.000',
    target: 10000000,
    collected: 7500000,
    image: '/images/kids.jpg',
    size: 'small',
  }
]

const newsCards = [
  {
    image: '/images/foods.jpg',
    title: 'Catering',
    description: 'Kami menyediakan vendor catering untuk acara-acara di Masjid Al Furqon.',
    detail: '24 OCT 2024',
  },
  {
    image: '/images/money.jpg',
    title: 'Kas Mingguan',
    description: 'Laporan penerimaan Infaq Sholat Jumat dan pengeluaran rumah tangga Masjid periode 16 s/d 22 Agustus 2024',
    detail: '23 AUG 2024',
  },
  {
    image: '/images/kajian.jpg',
    title: 'Tabligh Akbar',
    description: 'Bersama KH Rachmat Baagil, S.Pd.I sebagai Penceramah yang di selenggarakan kerjasama MT Al Furqon dengan MT. ANNUr yang insyaallah ...',
    detail: '18 AUG 2024',
  }
]

// Helper functions
function extractTags(title, description, content = '') {
  const text = `${title} ${description} ${content}`.toLowerCase()
  const tags = []

  if (text.includes('kajian') || text.includes('tabligh')) tags.push('kajian')
  if (text.includes('remaja') || text.includes('pemuda')) tags.push('remaja')
  if (text.includes('tpq') || text.includes('quran')) tags.push('pendidikan')
  if (text.includes('masjid') || text.includes('sholat')) tags.push('ibadah')
  if (text.includes('program') || text.includes('kegiatan')) tags.push('program')
  if (text.includes('pembinaan')) tags.push('pembinaan')

  return tags.length > 0 ? tags : ['umum']
}

function createSlug(title) {
  return title.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Upload functions
async function uploadArticles() {
  try {    
    const articles = activityCards.map((card, index) => ({
      title: card.title,
      slug: createSlug(card.title),
      description: card.description,
      content: card.detail || card.description,
      summary: card.description.substring(0, 200),
      category: 'kegiatan',
      status: 'published',
      featured: card.size === 'large' || index < 3,
      tags: extractTags(card.title, card.description, card.detail),
      imageUrl: card.image,
      views: Math.floor(Math.random() * 200) + 50,
      likes: Math.floor(Math.random() * 50) + 10,
      authorId: 1
    }))

    for (const article of articles) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/admin/articles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(article)
        })

        const result = await response.json()
        
        if (result.success) {
          console.log(`✅ Article uploaded: ${article.title}`)
        } else {
          console.log(`❌ Failed to upload: ${article.title} - ${result.message}`)
        }
      } catch (error) {
        console.log(`❌ Error uploading: ${article.title} - ${error.message}`)
      }
    }

    return true
  } catch (error) {
    console.error('❌ Articles upload failed:', error.message)
    return false
  }
}

async function uploadDonations() {
  try {
    
    const donations = donationCards.map(card => ({
      title: card.title,
      slug: createSlug(card.title),
      description: card.description,
      details: card.detail,
      target: card.target,
      collected: card.collected,
      imageUrl: card.image,
      status: 'active',
      priority: card.size === 'large' ? 'high' : 'medium',
      category: 'infaq',
      bankAccount: 'BSI - 1234567890'
    }))

    for (const donation of donations) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/admin/donations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(donation)
        })

        const result = await response.json()
        
        if (result.success) {
          console.log(`✅ Donation uploaded: ${donation.title}`)
        } else {
          console.log(`❌ Failed to upload: ${donation.title} - ${result.message}`)
        }
      } catch (error) {
        console.log(`❌ Error uploading: ${donation.title} - ${error.message}`)
      }
    }

    console.log('💰 Donations upload completed')
    return true
  } catch (error) {
    console.error('❌ Donations upload failed:', error.message)
    return false
  }
}

async function uploadNews() {
  try {
    console.log('\n📰 Uploading news...')
    
    const news = newsCards.map((card, index) => ({
      title: card.title,
      slug: createSlug(card.title),
      description: card.description,
      content: card.description,
      imageUrl: card.image,
      status: 'published',
      priority: index === 0 ? 'high' : 'medium',
      category: 'berita',
      tags: extractTags(card.title, card.description),
      publishedAt: new Date().toISOString(),
      authorId: 1,
      views: Math.floor(Math.random() * 300) + 100
    }))

    for (const newsItem of news) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/admin/news`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newsItem)
        })

        const result = await response.json()
        
        if (result.success) {
          console.log(`✅ News uploaded: ${newsItem.title}`)
        } else {
          console.log(`❌ Failed to upload: ${newsItem.title} - ${result.message}`)
        }
      } catch (error) {
        console.log(`❌ Error uploading: ${newsItem.title} - ${error.message}`)
      }
    }

    console.log('📰 News upload completed')
    return true
  } catch (error) {
    console.error('❌ News upload failed:', error.message)
    return false
  }
}

async function checkBackend() {
  try {
    console.log('🔍 Checking backend connection...')
    const response = await fetch(`${BACKEND_URL}/api/health`)
    
    if (response.ok) {
      console.log('✅ Backend is reachable')
      return true
    } else {
      console.log('⚠️ Backend responded with error:', response.status)
      return false
    }
  } catch (error) {
    console.log('❌ Backend connection failed:', error.message)
    console.log('💡 Make sure your backend server is running on', BACKEND_URL)
    return false
  }
}

// Main function
async function main() {
  console.log('🚀 Al-Furqon Data Seeder')
  console.log('========================')
  
  // Check backend
  const isBackendReachable = await checkBackend()
  if (!isBackendReachable) {
    console.log('❌ Cannot proceed without backend connection')
    process.exit(1)
  }

  let successCount = 0

  // Upload data
  if (await uploadArticles()) successCount++
  if (await uploadDonations()) successCount++  
  if (await uploadNews()) successCount++

  // Summary
  console.log('\n📊 SEED SUMMARY')
  console.log('================')
  console.log(`✅ Successful uploads: ${successCount}/3`)
  
  if (successCount === 3) {
    console.log('🎉 All data seeded successfully!')
    console.log('🌐 You can now use the frontend with backend data')
  } else {
    console.log('⚠️ Some uploads failed. Check the logs above.')
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Seed failed:', error)
    process.exit(1)
  })
}
