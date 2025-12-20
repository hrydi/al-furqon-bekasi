import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetAdminPassword() {
  try {
    console.log('🔄 Resetting admin password...');
    
    const hashedPassword = await bcrypt.hash('admin123', 12);
    console.log('✅ Password hashed successfully');
    
    // Update admin user
    const admin = await prisma.user.update({
      where: { username: 'admin' },
      data: {
        password: hashedPassword,
      },
    });
    
    console.log('✅ Admin password updated successfully!');
    console.log('📧 Email:', admin.email);
    console.log('👤 Username:', admin.username);
    console.log('🔑 New Password: admin123');
    
    // Test the password
    const testPassword = await bcrypt.compare('admin123', admin.password);
    console.log('🧪 Password verification test:', testPassword ? '✅ PASSED' : '❌ FAILED');
    
  } catch (error) {
    console.error('❌ Error resetting password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();
