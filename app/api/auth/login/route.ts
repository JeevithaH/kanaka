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
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email. Please sign up first.' }, { status: 401 });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordMatch) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    const userData = {
      id: user._id.toString(),
      email: user.email,
      name: user.fullName,
      role: user.role,
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
    return NextResponse.json({ error: 'Internal Server Error. Make sure MongoDB is running.' }, { status: 500 });
  }
}
