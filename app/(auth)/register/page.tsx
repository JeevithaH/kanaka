'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const { refreshUser } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName || !email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Registration failed. Please try again.');
        return;
      }

      refreshUser();
      window.location.href = redirect;
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
            {/* Left Form Column */}
            <div className="py-8 lg:py-16 lg:pr-16">
              <h1 className="text-[#161616] font-light text-[2rem] lg:text-[2.625rem] leading-tight mb-2">
                Create your Skyrellac account
              </h1>
              <p className="text-[#525252] text-sm mb-8">
                Already registered?{' '}
                <Link href={`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} className="text-[#80664f] font-medium hover:underline">
                  Log in to your account
                </Link>
              </p>

              {/* Error Callout */}
              {errorMessage && (
                <div className="max-w-sm mb-6 p-4 bg-[#fff0f1] border-l-4 border-[#da1e28] text-xs text-[#da1e28] leading-relaxed">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleRegister} className="max-w-sm flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#161616] mb-1.5" htmlFor="fullName">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border-b border-[#161616] bg-[#f4f4f4] px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#80664f]"
                    placeholder="Jane Doe"
                  />
                </div>

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
                    placeholder="jane@example.com"
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
                  <p className="text-[11px] text-[#525252] mt-1">Must be at least 8 characters with 1 uppercase letter & 1 number.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#161616] mb-1.5" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border-b border-[#161616] bg-[#f4f4f4] px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#80664f]"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#80664f] text-white px-4 py-3.5 text-sm mt-4 hover:bg-[#5f4938] transition-colors flex justify-between items-center font-medium disabled:opacity-50"
                >
                  {isLoading ? 'Creating account...' : 'Create Account & Continue'}
                  {!isLoading && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z" />
                    </svg>
                  )}
                </button>
              </form>
            </div>

            {/* Right Decorative Panel */}
            <div className="hidden lg:block">
              <div className="relative w-full h-full bg-[#f3f0ed] flex items-center justify-center p-12 border-l border-[#c8c8c8]">
                <div className="relative w-72 h-72 mx-auto">
                  <Image
                    src="/images/login1.png"
                    alt="Register Illustration"
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
