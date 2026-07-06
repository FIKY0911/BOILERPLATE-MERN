import User from '../models/User.js';

export const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@admin.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: 'admin123',
        role: 'admin',
      });
      console.log('✅ Default Admin seeded successfully!');
    }
  } catch (error) {
    console.error(`❌ Error seeding Admin: ${error.message}`);
  }
};
