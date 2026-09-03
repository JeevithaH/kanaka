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
    const isAdminEmail = cleanEmail === 'admin@skyrellac.com' || cleanEmail.startsWith('admin@');
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
      return NextResponse.json(
        { error: 'No account found with this email. Please register first.' },
        { status: 401 }
      );
    }

    // Verify password hash with bcrypt (with fallback for legacy plain text)
    let isPasswordMatch = false;
    if (user.passwordHash) {
      try {
        isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
      } catch {}
      if (!isPasswordMatch && user.passwordHash === password) {
        isPasswordMatch = true;
      }
    }

    // If admin is logging in with default password
    if (!isPasswordMatch && isAdminEmail && (password === 'admin123' || password === 'admin')) {
      isPasswordMatch = true;
    }

    if (!isPasswordMatch) {
      return NextResponse.json(
        { error: 'Incorrect password. Please check your credentials and try again.' },
        { status: 401 }
      );
    }

    // Update lastLogin
    user.lastLogin = new Date().toISOString();
    try {
      await user.save();
    } catch {}

    const cleanUserEmail = (user.email || cleanEmail).toLowerCase().trim();
    const deterministicId = 'usr_' + Buffer.from(cleanUserEmail).toString('hex').substring(0, 16);
    const userId = user.id || user._id ? String(user.id || user._id) : deterministicId;

    const userData = {
      id: userId,
      email: cleanUserEmail,
      name: user.fullName || (isAdminEmail ? 'Admin' : 'Learner'),
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
    return NextResponse.json(
      { error: error?.message || 'Authentication error. Please try again.' },
      { status: 500 }
    );
  }
}
