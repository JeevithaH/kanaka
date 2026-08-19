import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    await connectToDatabase();

    const users = await User.find({ role: 'student' })
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Fetch admin users error:', error);
    return NextResponse.json({ error: 'Failed to fetch users list' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { userId, accountStatus } = await req.json();

    if (!userId || !accountStatus) {
      return NextResponse.json({ error: 'User ID and accountStatus are required.' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findByIdAndUpdate(
      userId,
      { accountStatus, isActive: accountStatus === 'active' },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return NextResponse.json({ error: 'User account not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: `Account status updated to ${accountStatus}`, user });
  } catch (error: any) {
    console.error('Update user status error:', error);
    return NextResponse.json({ error: 'Failed to update user account status' }, { status: 500 });
  }
}
