import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'skyrellac_jwt_secret_key_2026';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Verification token is required' }, { status: 400 });
    }

    // Verify JWT token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token. Please request a new one.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find user and update verification status
    const user = await User.findOne({ email: decoded.email.toLowerCase() });

    if (!user) {
      return NextResponse.json({ error: 'User account not found' }, { status: 440 });
    }

    if (user.isEmailVerified) {
      return NextResponse.json({ message: 'Email address is already verified.' }, { status: 200 });
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return NextResponse.json({
      message: 'Email address verified successfully! You can now log in.',
      email: user.email,
    });
  } catch (error: any) {
    console.error('Email verification error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
