import mongoose from 'mongoose';
import User from './models/User';
import bcrypt from 'bcryptjs';

async function seedAdmin() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skyrellac');
  const existingAdmin = await User.findOne({ email: 'admin@skyrellac.com' });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const admin = new User({
      name: 'Super Admin',
      email: 'admin@skyrellac.com',
      password: hashedPassword,
      role: 'admin',
    });
    await admin.save();
    console.log('Admin user created: admin@skyrellac.com / Admin@123');
  } else {
    console.log('Admin user already exists. Email: admin@skyrellac.com. If you forgot the password, you can manually update it here.');
  }
  process.exit();
}
seedAdmin().catch(console.error);
