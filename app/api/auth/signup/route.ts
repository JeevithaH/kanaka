import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

const SignUpSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validationResult = SignUpSchema.safeParse(body);
    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map(issue => issue.message);
      return NextResponse.json({ error: errorMessages.join('. ') }, { status: 400 });
    }

    const { fullName, email, password } = validationResult.data;

    await connectToDatabase();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please log in.' },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const cleanEmail = email.toLowerCase().trim();
    const deterministicId = 'usr_' + Buffer.from(cleanEmail).toString('hex').substring(0, 16);

    const savedUser = await User.create({
      id: deterministicId,
      fullName,
      email: cleanEmail,
      passwordHash,
      role: 'student',
    });

    const userData = {
      id: deterministicId,
      email: savedUser.email || cleanEmail,
      name: savedUser.fullName || fullName,
      role: savedUser.role || 'student',
    };

    const response = NextResponse.json(
      {
        message: 'Account created successfully!',
        user: userData,
      },
      { status: 201 }
    );

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
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error. Make sure MongoDB is running.' },
      { status: 500 }
    );
  }
}
