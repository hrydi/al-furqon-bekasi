const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🗑️  Deleting all users...');
    await prisma.user.deleteMany({});
    console.log('✅ Users deleted');
    
    console.log('🔨 Creating new admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const admin = await prisma.user.create({
      data: {
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
          'transactions.read',
          'files.upload',
          'analytics.read',
          'videos.create',
          'videos.read',
          'videos.update',
          'videos.delete'
        ]),
        isActive: true
      }
    });
    
    console.log('\n✅ Admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('👤 Username:', admin.username);
    console.log('🔑 Password: admin123');
    
    // Test password immediately
    const isValid = await bcrypt.compare('admin123', admin.password);
    console.log('🧪 Password verification:', isValid ? '✅ PASSED' : '❌ FAILED');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
