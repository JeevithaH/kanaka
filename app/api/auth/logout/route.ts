import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out successfully.' });
  response.cookies.set({
    name: 'skyrellac_session',
    value: '',
    httpOnly: false,
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
  });
  return response;
}
