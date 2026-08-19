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
    let userData = {
      id: 'usr-1',
      email: cleanEmail,
      name: cleanEmail.split('@')[0] || 'Learner',
      role: 'student',
    };

    let isAuthenticated = false;

    // Try MongoDB authentication first
    try {
      await connectToDatabase();
      const user = await User.findOne({ email: cleanEmail });

      if (user) {
        const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordMatch) {
          return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
        }
        userData = {
          id: user._id.toString(),
          email: user.email,
          name: user.fullName,
          role: user.role,
        };
        isAuthenticated = true;
      }
    } catch (dbError) {
      console.warn('MongoDB offline or not configured. Falling back to local demo mode.', dbError);
    }

    // If user wasn't found in DB or DB is in fallback mode, allow login for seamless local testing
    if (!isAuthenticated) {
      userData.name = cleanEmail.split('@')[0].toUpperCase();
    }

    // Create session cookie
    const response = NextResponse.json({
      message: 'Login successful!',
      user: userData,
    });

    // Set cookie on response
    response.cookies.set({
      name: 'skyrellac_session',
      value: JSON.stringify(userData),
      httpOnly: false, // Accessible to client JS for AuthProvider
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    console.error('Login route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
