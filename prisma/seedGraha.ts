import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedGrahaData() {
  console.log('🌱 Seeding Graha Subagdja data...');

  try {
    // 1. Seed UMKM Partners
    console.log('Creating UMKM Partners...');
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

    for (const partner of umkmPartners) {
      await prisma.grahaUMKMPartner.create({
        data: partner
      });
    }

    // 2. Seed Gallery
    console.log('Creating Gallery items...');
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

    for (const item of galleryItems) {
      await prisma.grahaGallery.create({
        data: item
      });
    }

    // 3. Seed FAQ
    console.log('Creating FAQ items...');
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

    for (const faq of faqItems) {
      await prisma.grahaFAQ.create({
        data: faq
      });
    }

    // 4. Seed Facility Info
    console.log('Creating Facility Info...');
    await prisma.grahaFacilityInfo.create({
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

    console.log('✅ Graha Subagdja data seeded successfully!');
    console.log('📊 Data created:');
    console.log(`   - ${umkmPartners.length} UMKM Partners`);
    console.log(`   - ${galleryItems.length} Gallery Items`);
    console.log(`   - ${faqItems.length} FAQ Items`);
    console.log(`   - 1 Facility Info`);

  } catch (error) {
    console.error('❌ Error seeding Graha data:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedGrahaData();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { seedGrahaData };