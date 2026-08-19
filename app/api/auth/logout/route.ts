import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = cookies();
    cookieStore.delete('skyrellac_session');
  } catch (err) {
    console.error('Error deleting cookie via cookieStore:', err);
  }

  const response = NextResponse.json({ message: 'Logged out successfully.' });

  // Set past expiration date and Max-Age=0 to force browser cookie deletion
  response.cookies.set({
    name: 'skyrellac_session',
    value: '',
    httpOnly: false,
    path: '/',
    expires: new Date(0),
    maxAge: 0,
    sameSite: 'lax',
  });

  return response;
}
