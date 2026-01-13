import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedAdminUsers() {

  const hashedPassword = await bcrypt.hash('admin123', 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@alfurqon.com' },
    update: {},
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
        'transactions.read',
        'files.upload',
        'analytics.read'
      ]),
      isActive: true
    }
  });

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@alfurqon.com' },
    update: {},
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
        'transactions.read',
        'files.upload',
        'analytics.read'
      ]),
      isActive: true
    }
  });

  // Create Editor
  const editor = await prisma.user.upsert({
    where: { email: 'editor@alfurqon.com' },
    update: {},
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
        'files.upload'
      ]),
      isActive: true
    }
  });

  return { superAdmin, admin, editor };
}

async function main() {
  try {
    console.log('🌱 Starting admin users seeding...');
    const result = await seedAdminUsers();
    console.log('✅ Admin users created successfully!');
    console.log('🔑 Login credentials:');
    console.log('   Super Admin: superadmin@alfurqon.com / admin123');
    console.log('   Admin: admin@alfurqon.com / admin123');
    console.log('   Editor: editor@alfurqon.com / admin123');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedAdminUsers, main };
