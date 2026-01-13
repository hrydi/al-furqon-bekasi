import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ============================================
// SEED CONFIGURATION
// ============================================
const SEED_CONFIG = {
  password: 'admin123',
  hashRounds: 12,
  verbose: true
};

// ============================================
// HELPER FUNCTIONS  
// ============================================
function log(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
  if (!SEED_CONFIG.verbose) return;
  
  const icons = {
    info: '📌',
    success: '✅',
    error: '❌',
    warning: '⚠️'
  };
  
  console.log(`${icons[type]} ${message}`);
}

// ============================================
// 1. SEED ADMIN USERS
// ============================================
async function seedAdminUsers() {
  log('Seeding admin users...', 'info');
  
  const hashedPassword = await bcrypt.hash(SEED_CONFIG.password, SEED_CONFIG.hashRounds);

  // Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@alfurqon.com' },
    update: {
      password: hashedPassword,
      isActive: true
    },
    create: {
      username: 'superadmin',
      email: 'superadmin@alfurqon.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'super_admin',
      permissions: JSON.stringify([
        'users.create',
        'users.read',
        'users.update',
        'users.delete',
        'articles.create',
        'articles.read',
        'articles.update',
        'articles.delete',
        'donations.create',
        'donations.read',
        'donations.update',
        'donations.delete',
        'news.create',
        'news.read',
        'news.update',
        'news.delete',
        'videos.create',
        'videos.read',
        'videos.update',
        'videos.delete',
        'gallery.create',
        'gallery.read',
        'gallery.update',
        'gallery.delete',
        'transactions.read',
        'transactions.create',
        'transactions.update',
        'transactions.delete',
        'files.upload',
        'files.delete',
        'analytics.read',
        'settings.read',
        'settings.update'
      ]),
      isActive: true
    }
  });

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@alfurqon.com' },
    update: {
      password: hashedPassword,
      isActive: true
    },
    create: {
      username: 'admin',
      email: 'admin@alfurqon.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
      permissions: JSON.stringify([
        'articles.create',
        'articles.read',
        'articles.update',
        'articles.delete',
        'donations.create',
        'donations.read',
        'donations.update',
        'donations.delete',
        'news.create',
        'news.read',
        'news.update',
        'news.delete',
        'videos.create',
        'videos.read',
        'videos.update',
        'videos.delete',
        'gallery.create',
        'gallery.read',
        'gallery.update',
        'gallery.delete',
        'transactions.read',
        'transactions.create',
        'files.upload',
        'analytics.read'
      ]),
      isActive: true
    }
  });

  // Editor
  const editor = await prisma.user.upsert({
    where: { email: 'editor@alfurqon.com' },
    update: {
      password: hashedPassword,
      isActive: true
    },
    create: {
      username: 'editor',
      email: 'editor@alfurqon.com',
      name: 'Editor User',
      password: hashedPassword,
      role: 'editor',
      permissions: JSON.stringify([
        'articles.create',
        'articles.read',
        'articles.update',
        'news.create',
        'news.read',
        'news.update',
        'videos.create',
        'videos.read',
        'videos.update',
        'gallery.create',
        'gallery.read',
        'gallery.update',
        'files.upload'
      ]),
      isActive: true
    }
  });

  log(`Created Super Admin: ${superAdmin.email}`, 'success');
  log(`Created Admin: ${admin.email}`, 'success');
  log(`Created Editor: ${editor.email}`, 'success');

  return { superAdmin, admin, editor };
}

// ============================================
// 2. SEED SAMPLE ARTICLES
// ============================================
async function seedArticles() {
  log('Seeding sample articles...', 'info');

  const admin = await prisma.user.findUnique({
    where: { email: 'admin@alfurqon.com' }
  });

  if (!admin) {
    log('Admin user not found, skipping articles', 'warning');
    return [];
  }

  const articles = [
    {
      title: 'Kegiatan Kajian Rutin Masjid Al-Furqon',
      slug: 'kegiatan-kajian-rutin-masjid-al-furqon',
      description: 'Kajian rutin setiap Jumat malam bersama Ustadz terbaik membahas Al-Quran dan Hadits',
      content: `Alhamdulillah, Masjid Al-Furqon mengadakan kegiatan kajian rutin setiap Jumat malam setelah sholat Isya. 

Kajian ini membahas berbagai tema Islam meliputi:
- Tafsir Al-Quran
- Hadits dan Sunnah Nabi
- Fiqih kehidupan sehari-hari
- Akhlak dan adab Islami

Kajian dipandu oleh Ustadz yang berpengalaman dan membuka sesi tanya jawab untuk jamaah.

Mari hadiri kajian rutin kita untuk menambah ilmu agama dan mempererat ukhuwah Islamiyah.`,
      image: '/images/kajian.jpg',
      category: 'kegiatan' as const,
      status: 'published' as const,
      featured: true,
      authorId: admin.id,
      authorName: admin.name,
      tags: JSON.stringify(['kajian', 'rutin', 'masjid', 'islam']),
      publishedAt: new Date()
    },
    {
      title: 'Program Tahfidz Anak-Anak Al-Furqon',
      slug: 'program-tahfidz-anak-anak-al-furqon',
      description: 'Program menghafal Al-Quran untuk anak-anak usia 7-15 tahun dengan metode fun learning',
      content: `Program Tahfidz Al-Furqon dirancang khusus untuk anak-anak dengan metode yang menyenangkan.

Fasilitas Program:
- Pengajar hafidz/hafidzah berpengalaman
- Metode menghafal yang efektif
- Kelompok belajar sesuai usia
- Sertifikat setiap selesai juz
- Muroja'ah rutin

Waktu: Senin-Jumat pukul 15.00-17.00 WIB
Biaya: Gratis untuk jamaah Al-Furqon

Info pendaftaran: 0812-3456-7890`,
      image: '/images/iqro.jpg',
      category: 'berita' as const,
      status: 'published' as const,
      featured: true,
      authorId: admin.id,
      authorName: admin.name,
      tags: JSON.stringify(['tahfidz', 'anak', 'quran', 'pendidikan']),
      publishedAt: new Date()
    },
    {
      title: 'Santunan Anak Yatim Ramadhan 2024',
      slug: 'santunan-anak-yatim-ramadhan-2024',
      description: 'Program santunan untuk 100 anak yatim di wilayah sekitar masjid',
      content: `Dalam rangka menyambut bulan Ramadhan, Masjid Al-Furqon mengadakan program santunan anak yatim.

Target:
- 100 anak yatim dan dhuafa
- Santunan uang tunai
- Paket sembako
- Baju baru

Mari ikut berpartisipasi dalam program mulia ini. Infaq dapat disalurkan melalui rekening masjid.

Jazakumullahu khairan atas kepedulian Anda.`,
      image: '/images/kids.jpg',
      category: 'sumbangan' as const,
      status: 'published' as const,
      featured: false,
      authorId: admin.id,
      authorName: admin.name,
      tags: JSON.stringify(['santunan', 'yatim', 'ramadhan', 'sosial']),
      publishedAt: new Date()
    }
  ];

  const createdArticles: any[] = [];
  for (const article of articles) {
    const created = await prisma.article.upsert({
      where: { slug: article.slug },
      update: article,
      create: article
    });
    createdArticles.push(created);
    log(`Created article: ${created.title}`, 'success');
  }

  return createdArticles;
}

// ============================================
// 3. SEED SAMPLE DONATIONS
// ============================================
async function seedDonations() {
  log('Seeding sample donations...', 'info');

  const admin = await prisma.user.findUnique({
    where: { email: 'admin@alfurqon.com' }
  });

  if (!admin) {
    log('Admin user not found, skipping donations', 'warning');
    return [];
  }

  const donations = [
    {
      title: 'Renovasi Masjid Al-Furqon',
      slug: 'renovasi-masjid-al-furqon',
      description: 'Program renovasi dan pengembangan fasilitas Masjid Al-Furqon',
      detail: `Program renovasi meliputi:
- Pengecatan ulang masjid
- Perbaikan sound system
- Renovasi tempat wudhu
- Penambahan kipas angin
- Perbaikan karpet

Target dana: Rp 50.000.000
Mari berdonasi untuk kemaslahatan jamaah`,
      image: '/images/money.jpg',
      targetAmount: 50000000,
      collectedAmount: 15000000,
      status: 'active' as const,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      bankName: 'Bank Syariah Indonesia',
      accountNumber: '1234567890',
      accountName: 'Masjid Al-Furqon'
    },
    {
      title: 'Santunan Guru Ngaji',
      slug: 'santunan-guru-ngaji',
      description: 'Program santunan rutin untuk para guru ngaji dan tahfidz',
      detail: `Program ini bertujuan memberikan santunan kepada guru-guru ngaji yang mengajar dengan ikhlas.

Penerima manfaat:
- 10 guru tahfidz
- 5 guru TPA
- 3 guru kajian rutin

Santunan per bulan: Rp 500.000/guru
Target per bulan: Rp 9.000.000`,
      image: '/images/iqro.jpg',
      targetAmount: 9000000,
      collectedAmount: 6500000,
      status: 'active' as const,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      bankName: 'Bank Syariah Indonesia',
      accountNumber: '1234567890',
      accountName: 'Masjid Al-Furqon'
    },
    {
      title: 'Program Berbagi Makanan',
      slug: 'program-berbagi-makanan',
      description: 'Program berbagi makanan untuk fakir miskin setiap hari Jumat',
      detail: `Program sosial berbagi makanan untuk:
- Fakir miskin di sekitar masjid
- Pekerja harian yang kurang mampu
- Anak yatim

Setiap Jumat setelah sholat Jumat
Target: 100 paket makanan per minggu
Biaya per paket: Rp 15.000`,
      image: '/images/foods.jpg',
      targetAmount: 6000000,
      collectedAmount: 4200000,
      status: 'active' as const,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      bankName: 'Bank Syariah Indonesia',
      accountNumber: '1234567890',
      accountName: 'Masjid Al-Furqon'
    }
  ];

  const createdDonations: any[] = [];
  for (const donation of donations) {
    const created = await prisma.donation.upsert({
      where: { slug: donation.slug },
      update: donation,
      create: donation
    });
    createdDonations.push(created);
    log(`Created donation: ${created.title}`, 'success');
  }

  return createdDonations;
}

// ============================================
// 4. SEED SAMPLE VIDEOS
// ============================================
async function seedVideos() {
  log('Seeding sample videos...', 'info');

  const admin = await prisma.user.findUnique({
    where: { email: 'admin@alfurqon.com' }
  });

  if (!admin) {
    log('Admin user not found, skipping videos', 'warning');
    return [];
  }

  const videos = [
    {
      title: 'Kajian Tafsir Surah Al-Baqarah',
      description: 'Kajian mendalam tentang makna dan kandungan Surah Al-Baqarah',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      category: 'kajian',
      tags: 'kajian,tafsir,al-baqarah,quran',
      isActive: true,
      isFeatured: true,
      viewCount: 1250
    },
    {
      title: 'Ceramah: Pentingnya Sholat Berjamaah',
      description: 'Penjelasan tentang keutamaan dan hikmah sholat berjamaah di masjid',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      category: 'ceramah',
      tags: 'ceramah,sholat,jamaah,ibadah',
      isActive: true,
      isFeatured: true,
      viewCount: 890
    },
    {
      title: 'Dokumentasi Peringatan Isra Miraj',
      description: 'Dokumentasi acara peringatan Isra Miraj di Masjid Al-Furqon',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      category: 'event',
      tags: 'event,isra-miraj,peringatan,masjid',
      isActive: true,
      isFeatured: false,
      viewCount: 456
    },
    {
      title: 'Tutorial Wudhu yang Benar',
      description: 'Panduan lengkap tata cara wudhu sesuai sunnah',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      category: 'tutorial',
      tags: 'tutorial,wudhu,thaharah,fiqih',
      isActive: true,
      isFeatured: false,
      viewCount: 2100
    },
    {
      title: 'Kegiatan Tahfidz Anak-Anak',
      description: 'Kegiatan rutin program tahfidz untuk anak-anak Al-Furqon',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      category: 'kegiatan',
      tags: 'kegiatan,tahfidz,anak,pendidikan',
      isActive: true,
      isFeatured: false,
      viewCount: 678
    }
  ];

  const createdVideos: any[] = [];
  for (const video of videos) {
    const created = await prisma.video.create({
      data: video
    });
    createdVideos.push(created);
    log(`Created video: ${created.title}`, 'success');
  }

  return createdVideos;
}

// ============================================
// 5. SEED SAMPLE NEWS
// ============================================
async function seedNews() {
  log('Seeding sample news...', 'info');

  const admin = await prisma.user.findUnique({
    where: { email: 'admin@alfurqon.com' }
  });

  if (!admin) {
    log('Admin user not found, skipping news', 'warning');
    return [];
  }

  const newsList = [
    {
      title: 'Pengumuman Libur Sekolah Tahfidz',
      slug: 'pengumuman-libur-sekolah-tahfidz',
      description: 'Sekolah Tahfidz Al-Furqon akan libur dari tanggal 20-27 Desember 2024',
      content: `Assalamu\'alaikum warahmatullahi wabarakatuh,

Kepada seluruh orang tua santri dan santri Tahfidz Al-Furqon,

Disampaikan bahwa kegiatan Tahfidz akan LIBUR pada:
📅 Tanggal: 20-27 Desember 2024
⏰ Mulai aktif kembali: 28 Desember 2024

Kegiatan yang libur:
- Tahfidz pagi
- Tahfidz sore
- Muroja'ah rutin

Terima kasih atas perhatiannya.
Wassalamu'alaikum warahmatullahi wabarakatuh`,
      image: '/images/announcement.jpg',
      category: 'pengumuman',
      priority: 'high' as const,
      publishedAt: new Date(),
      authorId: admin.id,
      authorName: admin.name,
      views: 450
    },
    {
      title: 'Jadwal Kajian Ramadhan 1446 H',
      slug: 'jadwal-kajian-ramadhan-1446h',
      description: 'Jadwal lengkap kajian dan kegiatan selama bulan Ramadhan',
      content: `Alhamdulillah, menyambut bulan suci Ramadhan 1446 H, Masjid Al-Furqon menyiapkan berbagai kajian:

🕌 KAJIAN TAFSIR
- Setiap Senin & Kamis ba'da Maghrib
- Tema: Tafsir Juz 30
- Pengisi: Ustadz Ahmad Hidayat

📖 KAJIAN HADITS
- Setiap Selasa & Jumat ba'da Subuh
- Tema: Shahih Bukhari
- Pengisi: Ustadz Muhammad Ismail

🤲 KULTUM BA'DA TARAWIH
- Setiap malam Ramadhan
- Tema: Akhlak Mulia
- Pengisi: Ustadz tamu

Mari ramaikan masjid di bulan penuh berkah ini.`,
      image: '/images/ramadhan.jpg',
      category: 'kajian',
      priority: 'high' as const,
      publishedAt: new Date(),
      authorId: admin.id,
      authorName: admin.name,
      views: 890
    },
    {
      title: 'Laporan Kegiatan Bakti Sosial',
      slug: 'laporan-kegiatan-bakti-sosial',
      description: 'Kegiatan bakti sosial pembagian sembako berhasil dilaksanakan',
      content: `Alhamdulillah, pada hari Sabtu, 15 Desember 2024, Masjid Al-Furqon berhasil melaksanakan kegiatan bakti sosial.

📊 HASIL KEGIATAN:
✅ 150 paket sembako dibagikan
✅ 50 anak yatim menerima santunan
✅ 30 keluarga dhuafa terbantu
✅ Total dana tersalurkan: Rp 25.000.000

👥 PENERIMA MANFAAT:
- Warga sekitar masjid
- Keluarga tidak mampu
- Anak yatim
- Lansia dhuafa

Terima kasih kepada seluruh donatur dan relawan yang telah berpartisipasi.

Jazakumullahu khairan katsira.`,
      image: '/images/charity.jpg',
      category: 'kegiatan',
      priority: 'medium' as const,
      publishedAt: new Date(),
      authorId: admin.id,
      authorName: admin.name,
      views: 320
    },
    {
      title: 'Penerimaan Santri Baru Tahfidz 2025',
      slug: 'penerimaan-santri-baru-tahfidz-2025',
      description: 'Dibuka pendaftaran santri baru program Tahfidz Al-Quran',
      content: `Bismillahirrahmanirrahim,

Program Tahfidz Al-Furqon membuka pendaftaran santri baru periode 2025:

📋 PERSYARATAN:
- Usia 7-15 tahun
- Sudah bisa membaca Al-Quran
- Sehat jasmani dan rohani
- Mendapat izin orang tua

📅 JADWAL PENDAFTARAN:
- Mulai: 1 Januari 2025
- Berakhir: 28 Februari 2025

📝 CARA PENDAFTAR:
1. Datang ke sekretariat masjid
2. Isi formulir pendaftaran
3. Fotokopi KK dan Akta Lahir
4. Pas foto 3x4 (2 lembar)

🎓 FASILITAS:
- Pembelajaran metode tilawati
- Bimbingan tahfidz intensif
- Sertifikat setiap juz
- Gratis untuk jamaah Al-Furqon

Info: 0812-3456-7890 (Ustadz Fulan)`,
      image: '/images/registration.jpg',
      category: 'pendidikan',
      priority: 'high' as const,
      publishedAt: new Date(),
      authorId: admin.id,
      authorName: admin.name,
      views: 650
    }
  ];

  const createdNews: any[] = [];
  for (const news of newsList) {
    const created = await prisma.news.upsert({
      where: { slug: news.slug },
      update: news,
      create: news
    });
    createdNews.push(created);
    log(`Created news: ${created.title}`, 'success');
  }

  return createdNews;
}

// ============================================
// 6. SEED MENUS (NAVIGATION)
// ============================================
async function seedMenus() {
  log('Seeding navigation menus...', 'info');

  const menus = [
    {
      title: 'Beranda',
      slug: 'beranda',
      url: '/',
      icon: 'FaHome',
      orderIndex: 1,
      isActive: true
    },
    {
      title: 'Profil',
      slug: 'profil',
      url: '/profil',
      icon: 'FaInfoCircle',
      orderIndex: 2,
      isActive: true,
      description: 'Profil Masjid Al-Furqon'
    },
    {
      title: 'Artikel',
      slug: 'artikel',
      url: '/artikel',
      icon: 'FaNewspaper',
      orderIndex: 3,
      isActive: true,
      description: 'Artikel dan kegiatan masjid'
    },
    {
      title: 'Video',
      slug: 'video',
      url: '/video',
      icon: 'FaVideo',
      orderIndex: 4,
      isActive: true,
      description: 'Video kajian dan kegiatan'
    },
    {
      title: 'Donasi',
      slug: 'donasi',
      url: '/donasi',
      icon: 'FaHandHoldingHeart',
      orderIndex: 5,
      isActive: true,
      description: 'Program donasi masjid'
    },
    {
      title: 'Kontak',
      slug: 'kontak',
      url: '/kontak',
      icon: 'FaEnvelope',
      orderIndex: 6,
      isActive: true,
      description: 'Hubungi kami'
    }
  ];

  const createdMenus: any[] = [];
  for (const menu of menus) {
    // Check if menu exists first
    const existing = await prisma.menu.findFirst({
      where: { slug: menu.slug }
    });

    let created;
    if (existing) {
      created = await prisma.menu.update({
        where: { id: existing.id },
        data: menu
      });
    } else {
      created = await prisma.menu.create({
        data: menu
      });
    }
    
    createdMenus.push(created);
    log(`Created menu: ${created.title}`, 'success');
  }

  return createdMenus;
}

// ============================================
// 7. SEED SYSTEM SETTINGS
// ============================================
async function seedSystemSettings() {
  log('Seeding system settings...', 'info');

  const settings = [
    {
      key: 'site_name',
      value: 'Masjid Al-Furqon',
      type: 'string',
      category: 'general',
      isActive: true
    },
    {
      key: 'site_description',
      value: 'Website resmi Masjid Al-Furqon - Pusat kegiatan dakwah dan pendidikan Islam',
      type: 'string',
      category: 'general',
      isActive: true
    },
    {
      key: 'site_email',
      value: 'info@alfurqon.com',
      type: 'string',
      category: 'contact',
      isActive: true
    },
    {
      key: 'site_phone',
      value: '0812-3456-7890',
      type: 'string',
      category: 'contact',
      isActive: true
    },
    {
      key: 'site_address',
      value: 'Jl. Raya Al-Furqon No. 123, Jakarta',
      type: 'string',
      category: 'contact',
      isActive: true
    },
    {
      key: 'enable_donations',
      value: 'true',
      type: 'boolean',
      category: 'features',
      isActive: true
    },
    {
      key: 'enable_videos',
      value: 'true',
      type: 'boolean',
      category: 'features',
      isActive: true
    },
    {
      key: 'items_per_page',
      value: '12',
      type: 'number',
      category: 'display',
      isActive: true
    },
    {
      key: 'facebook_url',
      value: 'https://facebook.com/alfurqon',
      type: 'string',
      category: 'social',
      isActive: true
    },
    {
      key: 'instagram_url',
      value: 'https://instagram.com/alfurqon',
      type: 'string',
      category: 'social',
      isActive: true
    },
    {
      key: 'youtube_url',
      value: 'https://youtube.com/@alfurqon',
      type: 'string',
      category: 'social',
      isActive: true
    }
  ];

  const createdSettings: any[] = [];
  for (const setting of settings) {
    const created = await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting
    });
    createdSettings.push(created);
    log(`Created setting: ${created.key}`, 'success');
  }

  return createdSettings;
}

// ============================================
// 8. SEED GRAHA DATA
// ============================================
async function seedGrahaData() {
  log('Seeding Graha Subagdja data...', 'info');

  // 1. Seed UMKM Partners
  const umkmPartners = [
    {
      name: 'Catering Bu Sari',
      category: 'Kuliner',
      description: 'Menyediakan layanan catering untuk berbagai acara dengan menu tradisional dan modern',
      services: ['Catering Pernikahan', 'Catering Acara Kantor', 'Nasi Box', 'Snack Box'],
      contact: {
        phone: '08123456789',
        whatsapp: '08123456789',
        instagram: '@catering_busari'
      },
      image: '/images/umkm/catering-busari.jpg',
      orderIndex: 1
    },
    {
      name: 'Florist Melati',
      category: 'Dekorasi',
      description: 'Spesialis dekorasi bunga untuk pernikahan dan acara khusus',
      services: ['Dekorasi Pelaminan', 'Hand Bouquet', 'Bunga Meja', 'Dekorasi Venue'],
      contact: {
        phone: '08123456790',
        whatsapp: '08123456790',
        instagram: '@florist_melati'
      },
      image: '/images/umkm/florist-melati.jpg',
      orderIndex: 2
    },
    {
      name: 'Sound System Pro',
      category: 'Audio Visual',
      description: 'Penyewaan sound system profesional untuk berbagai acara',
      services: ['Sound System', 'Lighting', 'LED Screen', 'Teknisi'],
      contact: {
        phone: '08123456791',
        whatsapp: '08123456791',
        instagram: '@soundsystem_pro'
      },
      image: '/images/umkm/soundsystem-pro.jpg',
      orderIndex: 3
    },
    {
      name: 'Photo Studio Cahaya',
      category: 'Fotografi',
      description: 'Jasa foto dan video untuk dokumentasi acara pernikahan',
      services: ['Foto Pernikahan', 'Video Cinematic', 'Pre Wedding', 'Editing'],
      contact: {
        phone: '08123456792',
        whatsapp: '08123456792',
        instagram: '@photostudio_cahaya'
      },
      image: '/images/umkm/photo-cahaya.jpg',
      orderIndex: 4
    },
    {
      name: 'Wedding Organizer Elegan',
      category: 'Wedding Organizer',
      description: 'Jasa wedding organizer profesional untuk pernikahan impian Anda',
      services: ['Full Wedding Package', 'Day Coordinator', 'Konsultasi', 'Vendor Management'],
      contact: {
        phone: '08123456793',
        whatsapp: '08123456793',
        instagram: '@wo_elegan'
      },
      image: '/images/umkm/wo-elegan.jpg',
      orderIndex: 5
    }
  ];

  const createdUMKM: any[] = [];
  for (const partner of umkmPartners) {
    const created = await prisma.grahaUMKMPartner.create({
      data: partner
    });
    createdUMKM.push(created);
    log(`Created UMKM Partner: ${created.name}`, 'success');
  }

  // 2. Seed Gallery
  const galleryItems = [
    {
      title: 'Ruang Utama Graha',
      image: '/images/gallery/ruang-utama.jpg',
      category: 'facility' as const,
      orderIndex: 1
    },
    {
      title: 'Area Parkir Luas',
      image: '/images/gallery/parking.jpg',
      category: 'facility' as const,
      orderIndex: 2
    },
    {
      title: 'Panggung Utama',
      image: '/images/gallery/stage.jpg',
      category: 'facility' as const,
      orderIndex: 3
    },
    {
      title: 'Pernikahan Adat Jawa',
      image: '/images/gallery/wedding-1.jpg',
      category: 'ceremony' as const,
      orderIndex: 4
    },
    {
      title: 'Resepsi Modern',
      image: '/images/gallery/wedding-2.jpg',
      category: 'ceremony' as const,
      orderIndex: 5
    },
    {
      title: 'Acara Khitanan',
      image: '/images/gallery/khitanan.jpg',
      category: 'ceremony' as const,
      orderIndex: 6
    },
    {
      title: 'Dekorasi Interior Mewah',
      image: '/images/gallery/interior-1.jpg',
      category: 'interior' as const,
      orderIndex: 7
    },
    {
      title: 'Lampu Hias Kristal',
      image: '/images/gallery/interior-2.jpg',
      category: 'interior' as const,
      orderIndex: 8
    },
    {
      title: 'Tampak Depan Graha',
      image: '/images/gallery/exterior-1.jpg',
      category: 'exterior' as const,
      orderIndex: 9
    },
    {
      title: 'Taman Belakang',
      image: '/images/gallery/exterior-2.jpg',
      category: 'exterior' as const,
      orderIndex: 10
    },
    {
      title: 'Seminar Kesehatan',
      image: '/images/gallery/seminar.jpg',
      category: 'event' as const,
      orderIndex: 11
    },
    {
      title: 'Workshop Kewirausahaan',
      image: '/images/gallery/workshop.jpg',
      category: 'event' as const,
      orderIndex: 12
    }
  ];

  const createdGallery: any[] = [];
  for (const item of galleryItems) {
    const created = await prisma.grahaGallery.create({
      data: item
    });
    createdGallery.push(created);
    log(`Created Gallery: ${created.title}`, 'success');
  }

  // 3. Seed FAQ
  const faqItems = [
    {
      question: 'Berapa kapasitas maksimal Graha Subagdja?',
      answer: 'Graha Subagdja dapat menampung hingga 500 tamu untuk acara duduk dan 800 tamu untuk acara berdiri.',
      orderIndex: 1
    },
    {
      question: 'Apakah tersedia fasilitas parkir?',
      answer: 'Ya, kami menyediakan area parkir yang luas untuk mobil dan motor dengan kapasitas hingga 200 kendaraan.',
      orderIndex: 2
    },
    {
      question: 'Bagaimana sistem pembayaran sewa?',
      answer: 'Pembayaran dapat dilakukan dengan DP 50% saat booking dan pelunasan H-7 sebelum acara. Kami menerima transfer bank dan tunai.',
      orderIndex: 3
    },
    {
      question: 'Apakah bisa booking untuk hari yang sama?',
      answer: 'Untuk booking hari yang sama, silakan hubungi kami terlebih dahulu untuk mengecek ketersediaan dan persiapan teknis.',
      orderIndex: 4
    },
    {
      question: 'Apa saja fasilitas yang disediakan?',
      answer: 'Fasilitas meliputi AC, sound system, lighting, panggung, kursi, meja, toilet, mushola, dan dapur persiapan.',
      orderIndex: 5
    },
    {
      question: 'Apakah ada paket dekorasi?',
      answer: 'Kami bekerja sama dengan mitra dekorator. Anda bisa memilih dekorator sendiri atau menggunakan rekomendasi dari kami.',
      orderIndex: 6
    },
    {
      question: 'Berapa lama durasi sewa?',
      answer: 'Durasi sewa standar adalah 12 jam (06.00-18.00 atau 12.00-24.00). Untuk perpanjangan dikenakan biaya tambahan per jam.',
      orderIndex: 7
    },
    {
      question: 'Apakah ada discount untuk acara keagamaan?',
      answer: 'Ya, kami memberikan harga khusus untuk acara keagamaan dan sosial. Silakan konsultasi untuk mendapatkan penawaran terbaik.',
      orderIndex: 8
    }
  ];

  const createdFAQ: any[] = [];
  for (const faq of faqItems) {
    const created = await prisma.grahaFAQ.create({
      data: faq
    });
    createdFAQ.push(created);
    log(`Created FAQ: ${created.question.substring(0, 50)}...`, 'success');
  }

  // 4. Seed Facility Info
  const facilityInfo = await prisma.grahaFacilityInfo.create({
    data: {
      title: 'Graha Subagdja - Gedung Serbaguna Modern',
      description: 'Graha Subagdja adalah gedung serbaguna modern yang berlokasi strategis di pusat kota. Dengan desain arsitektur yang elegan dan fasilitas lengkap, gedung ini sangat cocok untuk berbagai acara seperti pernikahan, resepsi, seminar, workshop, dan acara korporat lainnya.',
      capacity: '500 tamu (duduk) / 800 tamu (berdiri)',
      facilities: [
        'Ruang utama ber-AC dengan kapasitas besar',
        'Panggung permanen dengan backdrop LED',
        'Sound system profesional',
        'Lighting system lengkap',
        'Area parkir untuk 200 kendaraan',
        'Toilet pria dan wanita terpisah',
        'Mushola dengan tempat wudhu',
        'Dapur persiapan untuk catering',
        'Ruang ganti pengantin',
        'CCTV keamanan 24 jam',
        'Akses WiFi gratis',
        'Generator backup'
      ],
      price: 'Mulai dari Rp 8.000.000/hari (12 jam)',
      contact: '0821-3456-7890 (WhatsApp) | graha.subagdja@gmail.com'
    }
  });
  log(`Created Facility Info: ${facilityInfo.title}`, 'success');

  return {
    umkmPartners: createdUMKM,
    gallery: createdGallery,
    faq: createdFAQ,
    facilityInfo
  };
}

// ============================================
// 9. SEED SAMPLE TRANSACTIONS (FOR DONATIONS)
// ============================================
async function seedTransactions() {
  log('Seeding sample donation transactions...', 'info');

  const donations = await prisma.donation.findMany({
    take: 3
  });

  if (donations.length === 0) {
    log('No donations found, skipping transactions', 'warning');
    return [];
  }

  const transactions = [
    {
      donationId: donations[0]?.id,
      donorName: 'Ahmad Santoso',
      email: 'ahmad@example.com',
      phone: '081234567890',
      amount: 500000,
      message: 'Semoga bermanfaat untuk renovasi masjid',
      paymentMethod: 'bank_transfer' as const,
      status: 'paid' as const,
      isAnonymous: false
    },
    {
      donationId: donations[0]?.id,
      donorName: 'Hamba Allah',
      amount: 1000000,
      message: 'Lillahi taala',
      paymentMethod: 'bank_transfer' as const,
      status: 'paid' as const,
      isAnonymous: true
    },
    {
      donationId: donations[1]?.id,
      donorName: 'Fatimah Azzahra',
      email: 'fatimah@example.com',
      phone: '081234567891',
      amount: 300000,
      message: 'Untuk para guru ngaji tercinta',
      paymentMethod: 'ewallet' as const,
      status: 'paid' as const,
      isAnonymous: false
    },
    {
      donationId: donations[2]?.id,
      donorName: 'Muhammad Ibrahim',
      email: 'ibrahim@example.com',
      amount: 200000,
      message: 'Semoga berkah untuk berbagi makanan',
      paymentMethod: 'cash' as const,
      status: 'paid' as const,
      isAnonymous: false
    }
  ];

  const createdTransactions: any[] = [];
  for (const transaction of transactions) {
    if (transaction.donationId) {
      const created = await prisma.donationTransaction.create({
        data: transaction
      });
      createdTransactions.push(created);
      log(`Created transaction: ${transaction.donorName} - Rp ${transaction.amount.toLocaleString()}`, 'success');
    }
  }

  return createdTransactions;
}

// ============================================
// MAIN SEED FUNCTION
// ============================================
async function main() {
  try {
    console.log('\n🌱 ================================');
    console.log('🌱 AL-FURQON DATABASE SEEDING');
    console.log('🌱 ================================\n');

    // 1. Seed Users
    log('STEP 1: Seeding Admin Users', 'info');
    const users = await seedAdminUsers();
    console.log('');

    // 2. Seed Articles
    log('STEP 2: Seeding Sample Articles', 'info');
    const articles = await seedArticles();
    console.log('');

    // 3. Seed Donations
    log('STEP 3: Seeding Sample Donations', 'info');
    const donations = await seedDonations();
    console.log('');

    // 4. Seed Videos
    log('STEP 4: Seeding Sample Videos', 'info');
    const videos = await seedVideos();
    console.log('');

    // 5. Seed News
    log('STEP 5: Seeding Sample News', 'info');
    const news = await seedNews();
    console.log('');

    // 6. Seed Menus
    log('STEP 6: Seeding Navigation Menus', 'info');
    const menus = await seedMenus();
    console.log('');

    // 7. Seed System Settings
    log('STEP 7: Seeding System Settings', 'info');
    const settings = await seedSystemSettings();
    console.log('');

    // 8. Seed Graha Data
    log('STEP 8: Seeding Graha Subagdja Data', 'info');
    const grahaData = await seedGrahaData();
    console.log('');

    // 9. Seed Transactions
    log('STEP 9: Seeding Sample Transactions', 'info');
    const transactions = await seedTransactions();
    console.log('');

    // Summary
    console.log('🎉 ================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('🎉 ================================\n');

    console.log('📊 SUMMARY:');
    console.log(`   👥 Users: ${Object.keys(users).length}`);
    console.log(`   📝 Articles: ${articles.length}`);
    console.log(`   💰 Donations: ${donations.length}`);
    console.log(`   🎬 Videos: ${videos.length}`);
    console.log(`   📰 News: ${news.length}`);
    console.log(`   🧭 Menus: ${menus.length}`);
    console.log(`   ⚙️  Settings: ${settings.length}`);
    console.log(`   🏛️  Graha UMKM: ${grahaData.umkmPartners.length}`);
    console.log(`   🖼️  Graha Gallery: ${grahaData.gallery.length}`);
    console.log(`   ❓ Graha FAQ: ${grahaData.faq.length}`);
    console.log(`   💳 Transactions: ${transactions.length}`);
    console.log('');

    console.log('🔑 LOGIN CREDENTIALS:');
    console.log('   ┌─────────────────────────────────────────────┐');
    console.log('   │ Super Admin                                  │');
    console.log('   │ Email: superadmin@alfurqon.com              │');
    console.log('   │ Password: admin123                           │');
    console.log('   ├─────────────────────────────────────────────┤');
    console.log('   │ Admin                                        │');
    console.log('   │ Email: admin@alfurqon.com                   │');
    console.log('   │ Password: admin123                           │');
    console.log('   ├─────────────────────────────────────────────┤');
    console.log('   │ Editor                                       │');
    console.log('   │ Email: editor@alfurqon.com                  │');
    console.log('   │ Password: admin123                           │');
    console.log('   └─────────────────────────────────────────────┘');
    console.log('');

    console.log('🚀 NEXT STEPS:');
    console.log('   1. Start backend: npm run dev');
    console.log('   2. Start frontend: npm run dev (in frontend folder)');
    console.log('   3. Access admin panel: http://localhost:3000/admin');
    console.log('   4. Login with credentials above');
    console.log('');

  } catch (error) {
    console.error('\n❌ ================================');
    console.error('❌ SEEDING FAILED!');
    console.error('❌ ================================\n');
    console.error('Error details:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute if run directly
if (require.main === module) {
  main()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { 
  main, 
  seedAdminUsers, 
  seedArticles, 
  seedDonations, 
  seedVideos, 
  seedNews,
  seedMenus,
  seedSystemSettings,
  seedGrahaData,
  seedTransactions 
};
