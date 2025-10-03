import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    console.log('🔧 Creating admin user...')
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    // Create admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@alfurqon.com' },
      update: {
        password: hashedPassword,
        role: 'super_admin',
        isActive: true,
        permissions: ['all']
      },
      create: {
        email: 'admin@alfurqon.com',
        username: 'admin',
        name: 'Administrator',
        password: hashedPassword,
        role: 'super_admin',
        isActive: true,
        permissions: ['all']
      }
    })
    
    console.log('✅ Admin user created successfully:')
    console.log(`📧 Email: ${adminUser.email}`)
    console.log(`👤 Username: ${adminUser.username}`)
    console.log(`🔑 Password: admin123`)
    console.log(`👑 Role: ${adminUser.role}`)
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()