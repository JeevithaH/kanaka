'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided in the URL.');
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          setMessage(data.message || 'Your email address has been verified successfully!');
        } else {
          setStatus('error');
          setMessage(data.error || 'Failed to verify email address.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('An unexpected error occurred while connecting to the server.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="h-12 border-b border-[#e0e0e0] bg-white">
        <div className="h-full max-w-[1584px] mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-sm tracking-[0.1em] uppercase text-[#161616]">
            Skyrellac
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-[#e0e0e0] p-8 shadow-sm text-center">
          {status === 'loading' && (
            <div className="space-y-4">
              <div className="w-12 h-12 border-4 border-[#0f62fe] border-t-transparent rounded-full animate-spin mx-auto" />
              <h1 className="text-xl font-light text-[#161616]">Verifying Email</h1>
              <p className="text-sm text-[#525252]">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#defbe6] text-[#198038] rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                ✓
              </div>
              <h1 className="text-2xl font-light text-[#161616]">Email Verified!</h1>
              <p className="text-sm text-[#525252]">{message}</p>
              <div className="pt-4">
                <Link
                  href="/signin"
                  className="w-full bg-[#0f62fe] text-white px-4 py-3.5 text-sm font-medium hover:bg-[#0043ce] transition-colors inline-block"
                >
                  Proceed to Sign In
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#fff0f1] text-[#da1e28] rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                ✕
              </div>
              <h1 className="text-2xl font-light text-[#161616]">Verification Failed</h1>
              <p className="text-sm text-[#da1e28]">{message}</p>
              <div className="pt-4 flex flex-col gap-2">
                <Link
                  href="/signup"
                  className="w-full border border-[#0f62fe] text-[#0f62fe] px-4 py-3 text-sm font-medium hover:bg-[#0f62fe] hover:text-white transition-colors inline-block"
                >
                  Back to Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
