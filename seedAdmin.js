const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Must match the exact model schema to work via node
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  accountStatus: { type: String, enum: ['active', 'suspended'], default: 'active' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function seedAdmin() {
  await mongoose.connect('mongodb://127.0.0.1:27017/skyrellac');
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
    console.log('Admin user already exists. Email: admin@skyrellac.com / Admin@123');
  }
  process.exit();
}
seedAdmin().catch(console.error);
