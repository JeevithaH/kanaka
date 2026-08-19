const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Must match the exact model schema to work via node
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  accountStatus: { type: String, enum: ['active', 'suspended', 'deactivated'], default: 'active' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function fixAdmin() {
  await mongoose.connect('mongodb://127.0.0.1:27017/skyrellac');
  
  // Clean up any old invalid admin entries first to avoid unique index issues
  await mongoose.connection.collection('users').deleteMany({ email: 'admin@skyrellac.com' });

  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  const admin = new User({
    fullName: 'Super Admin',
    email: 'admin@skyrellac.com',
    passwordHash: hashedPassword,
    role: 'admin',
    accountStatus: 'active'
  });
  
  await admin.save();
  console.log('Fixed Admin user created: admin@skyrellac.com / Admin@123');
  
  process.exit();
}
fixAdmin().catch(console.error);
