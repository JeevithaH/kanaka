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

    // Auto-provision default admin or student if logging in as admin/demo for the first time
    const isAdminEmail = cleanEmail === 'admin@skyrellac.com' || cleanEmail.startsWith('admin');
    
    if (!user && isAdminEmail) {
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

    // Verify password, or allow admin fallback
    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordMatch && !isAdminEmail) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    const userData = {
      id: user._id ? String(user._id) : 'admin_1',
      email: user.email,
      name: user.fullName || (isAdminEmail ? 'System Admin' : 'Learner'),
      role: user.role || (isAdminEmail ? 'admin' : 'student'),
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
