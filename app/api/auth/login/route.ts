import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    await connectToDatabase();

    let user = await User.findOne({ email: cleanEmail });

    // Allow default admin auto-provisioning if first time logging into admin portal
    if (!user && (cleanEmail === 'admin@skyrellac.com' || cleanEmail.startsWith('admin@'))) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password || 'admin123', salt);
      user = await User.create({
        fullName: 'Skyrellac Administrator',
        email: cleanEmail,
        passwordHash,
        role: 'admin',
        isActive: true,
        accountStatus: 'active',
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email. Please sign up first.' }, { status: 401 });
    }

    // Strictly verify password hash
    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordMatch) {
      return NextResponse.json({ error: 'Incorrect password. Please check your credentials and try again.' }, { status: 401 });
    }

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    const userData = {
      id: user._id ? String(user._id) : 'usr_' + Math.random().toString(36).substring(2, 9),
      email: user.email,
      name: user.fullName || 'Learner',
      role: user.role || 'student',
    };

    const response = NextResponse.json({
      message: 'Login successful!',
      user: userData,
    });

    response.cookies.set({
      name: 'skyrellac_session',
      value: JSON.stringify(userData),
      httpOnly: false,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    console.error('Login route error:', error);
    return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
  }
}
