'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import Image from 'next/image';

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Invalid credentials or user does not exist.');
        return;
      }

      refreshUser();
      const targetRedirect = data.user?.role === 'admin' ? '/admin' : (searchParams.get('redirect') || '/dashboard');
      window.location.href = targetRedirect;
    } catch (err) {
      setErrorMessage('Failed to connect to authentication server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Auth Masthead */}
      <header className="h-12 border-b border-[#e0e0e0] bg-white">
        <div className="h-full max-w-[1584px] mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-sm tracking-[0.1em] uppercase text-[#161616] hover:underline">
            Skyrellac
          </Link>
          <span className="text-[#525252] text-xs">Global Education & Learning Platform</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <section className="max-w-[1584px] mx-auto px-4 pt-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left Column Form */}
            <div className="py-8 lg:py-16 lg:pr-16">
              <h1 className="text-[#161616] font-light text-[2rem] lg:text-[2.625rem] leading-tight mb-2">
                Log in to Skyrellac
              </h1>

              {/* Sign up prompt banner */}
              <div className="bg-[#f4f4f4] border border-[#e0e0e0] p-4 mb-8 max-w-sm flex items-center justify-between">
                <div>
                  <p className="text-[#161616] text-xs font-semibold">New to Skyrellac?</p>
                  <p className="text-[#525252] text-xs">Create an account to enroll in courses.</p>
                </div>
                <Link
                  href={`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
                  className="bg-[#80664f] text-white text-xs px-3.5 py-2 font-medium hover:bg-[#5f4938] transition-colors shrink-0"
                >
                  Sign up
                </Link>
              </div>

              {/* Error Box */}
              {errorMessage && (
                <div className="max-w-sm mb-6 p-4 bg-[#fff0f1] border-l-4 border-[#da1e28] text-xs text-[#da1e28] leading-relaxed">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSignIn} className="max-w-sm flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#161616] mb-1.5" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-b border-[#161616] bg-[#f4f4f4] px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#80664f]"
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#161616] mb-1.5" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-b border-[#161616] bg-[#f4f4f4] px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#80664f]"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#80664f] text-white px-4 py-3.5 text-sm mt-4 hover:bg-[#5f4938] transition-colors flex justify-between items-center font-medium disabled:opacity-50"
                >
                  {isLoading ? 'Signing in...' : 'Log In to Dashboard'}
                  {!isLoading && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z" />
                    </svg>
                  )}
                </button>
              </form>

              {/* Quick Sign up hint */}
              <div className="mt-8 max-w-sm pt-4 border-t border-[#e0e0e0] text-xs text-[#525252]">
                Don't have an account yet?{' '}
                <Link href={`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} className="text-[#80664f] font-medium hover:underline">
                  Create one now
                </Link>
              </div>
            </div>

            {/* Right Column Media Panel */}
            <div className="hidden lg:block">
              <div className="relative w-full h-full bg-[#f3f0ed] flex items-center justify-center p-12 border-l border-[#c8c8c8]">
                <div className="relative w-72 h-72 mx-auto">
                  <Image
                    src="/images/login2.png"
                    alt="Login Illustration"
                    fill
                    priority
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <LoginForm />
    </Suspense>
  );
}
