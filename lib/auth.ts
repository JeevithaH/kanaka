import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
}

export function getUserFromCookie(req: Request): AuthUser | null {
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/skyrellac_session=([^;]+)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

export async function requireAuth(req: Request): Promise<{ user: AuthUser | null; errorResponse?: NextResponse }> {
  const user = getUserFromCookie(req);
  if (!user || !user.id) {
    return {
      user: null,
      errorResponse: NextResponse.json({ error: 'Unauthorized. Session expired or missing.' }, { status: 401 }),
    };
  }

  // Check if account is active in database
  try {
    await connectToDatabase();
    const dbUser = await User.findById(user.id);
    if (dbUser && dbUser.accountStatus === 'suspended') {
      return {
        user: null,
        errorResponse: NextResponse.json({ error: 'Account suspended. Please contact platform admin.' }, { status: 403 }),
      };
    }
  } catch {
    /* database check fallback */
  }

  return { user };
}

export async function requireAdmin(req: Request): Promise<{ user: AuthUser | null; errorResponse?: NextResponse }> {
  const { user, errorResponse } = await requireAuth(req);
  if (errorResponse) return { user: null, errorResponse };

  if (user?.role !== 'admin') {
    return {
      user: null,
      errorResponse: NextResponse.json({ error: 'Forbidden. Admin privileges required.' }, { status: 403 }),
    };
  }

  return { user };
}
