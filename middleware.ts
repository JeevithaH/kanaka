import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/admin', '/profile', '/tests'];
const authRoutes = ['/login', '/register', '/signin', '/signup', '/verify-email'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('skyrellac_session');
  const isAuthenticated = !!sessionCookie?.value;

  let user: any = null;
  if (sessionCookie?.value) {
    try {
      user = JSON.parse(decodeURIComponent(sessionCookie.value));
    } catch { /* invalid cookie */ }
  }

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isAuthenticated) {
    const hasRedirect = request.nextUrl.searchParams.get('redirect');
    if (!hasRedirect) {
      const targetUrl = user?.role === 'admin' ? '/admin' : '/dashboard';
      return NextResponse.redirect(new URL(targetUrl, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/profile/:path*', '/tests/:path*', '/login', '/register', '/signin', '/signup', '/verify-email'],
};
