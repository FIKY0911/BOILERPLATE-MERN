import { prisma } from '../config/db.js';
import bcrypt from 'bcryptjs';

export const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@admin.com';
    const adminExists = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.user.create({
        data: {
          name: 'Admin',
          email: adminEmail,
          password: hashedPassword,
          role: 'admin',
        },
      });
      console.log('✅ Default Admin seeded successfully!');
    }
  } catch (error) {
    console.error(`❌ Error seeding Admin: ${error.message}`);
  }
};
