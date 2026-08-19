import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { sendVerificationEmail } from '@/lib/email';

// Zod Validation Schema for Registration
const SignUpSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
});

const JWT_SECRET = process.env.JWT_SECRET || 'skyrellac_jwt_secret_key_2026';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Zod Validation
    const validationResult = SignUpSchema.safeParse(body);
    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map(issue => issue.message);
      return NextResponse.json({ error: errorMessages.join('. ') }, { status: 400 });
    }

    const { fullName, email, password } = validationResult.data;

    // 2. Connect to MongoDB
    await connectToDatabase();

    // 3. Check existing user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists.' },
        { status: 409 }
      );
    }

    // 4. Hash Password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 5. Generate Verification Token
    const verificationToken = jwt.sign(
      { email: email.toLowerCase(), fullName },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 6. Save to MongoDB
    const newUser = await User.create({
      fullName,
      email: email.toLowerCase(),
      passwordHash,
      role: 'student',
      isEmailVerified: false,
      verificationToken,
    });

    // 7. Send Verification Email
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const verificationLink = `${protocol}://${host}/verify-email?token=${verificationToken}`;

    await sendVerificationEmail(newUser.email, newUser.fullName, verificationLink);

    return NextResponse.json(
      {
        message: 'Account created successfully! Please check your email to verify your account.',
        userId: newUser._id,
        email: newUser.email,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
