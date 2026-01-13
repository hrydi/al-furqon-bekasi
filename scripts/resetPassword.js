const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetPassword() {
  try {
    console.log('Starting password reset...');
    
    const hashedPassword = await bcrypt.hash('admin123', 12);
    console.log('Password hashed');
    
    const result = await prisma.user.updateMany({
      where: {
        username: 'admin'
      },
      data: {
        password: hashedPassword
      }
    });
    
    console.log('Updated users:', result.count);
    
    // Verify
    const user = await prisma.user.findUnique({
      where: { username: 'admin' }
    });
    
    if (user) {
      const isValid = await bcrypt.compare('admin123', user.password);
      console.log('Password verification:', isValid ? 'SUCCESS' : 'FAILED');
      console.log('Username:', user.username);
      console.log('Email:', user.email);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();
