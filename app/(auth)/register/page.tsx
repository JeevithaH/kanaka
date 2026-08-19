'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [selectedAudience, setSelectedAudience] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sign up and redirect
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Auth Masthead */}
      <header className="h-12 border-b border-[#e0e0e0] bg-white">
        <div className="h-full max-w-[1584px] mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Link href="/" className="font-semibold text-sm tracking-[0.1em] uppercase text-[#161616] hover:underline">
              Skyrellac
            </Link>
          </div>
          <button className="text-[#525252] text-sm flex items-center gap-1 hover:text-[#161616]">
            <span>Language</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 11 3 6 3.7 5.3 8 9.6 12.3 5.3 13 6z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <section className="max-w-[1584px] mx-auto px-4 pt-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left Column - Content */}
            <div className="py-8 lg:py-16 lg:pr-16">
              {!selectedAudience ? (
                <>
                  <h1 className="text-[#161616] font-light text-[2rem] lg:text-[2.625rem] leading-tight mb-4">
                    Sign up to Skyrellac
                  </h1>
                  <p className="text-[#525252] text-sm mb-10">
                    Already have an account with Skyrellac?{' '}
                    <Link href="/login" className="text-[#0f62fe] hover:underline">
                      Log in
                    </Link>
                  </p>

                  <div className="flex flex-col gap-4 max-w-sm">
                    {['College or university', 'Adult learning', 'High school'].map((audience) => (
                      <button
                        key={audience}
                        onClick={() => setSelectedAudience(audience)}
                        className="w-full border border-[#0f62fe] text-[#0f62fe] px-4 py-3.5 text-sm text-left hover:bg-[#0143ce] hover:text-white hover:border-[#0143ce] transition-colors inline-flex items-center justify-between"
                      >
                        {audience}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z"/>
                        </svg>
                      </button>
                    ))}
                  </div>

                  <div className="mt-10">
                    <p className="text-[#525252] text-sm">
                      Looking for{' '}
                      <Link href="#" className="text-[#0f62fe] hover:underline font-medium">
                        college software downloads
                      </Link>
                      ?
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setSelectedAudience(null)}
                    className="text-[#0f62fe] text-sm hover:underline flex items-center gap-1 mb-8"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="rotate-180">
                      <path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z"/>
                    </svg>
                    Back to audience selection
                  </button>

                  <h1 className="text-[#161616] font-light text-[2rem] lg:text-[2.625rem] leading-tight mb-8">
                    Create your account
                  </h1>

                  <div className="max-w-sm flex flex-col gap-4">
                    <button className="w-full bg-[#161616] text-white px-4 py-3.5 text-sm hover:bg-[#393939] transition-colors text-left flex justify-between items-center">
                      Sign up with Skyrellac ID
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z"/>
                      </svg>
                    </button>
                    <button className="w-full border border-[#e0e0e0] text-[#161616] px-4 py-3.5 text-sm hover:bg-[#f4f4f4] transition-colors text-left flex justify-between items-center">
                      Sign up with LinkedIn
                    </button>
                    <button className="w-full border border-[#e0e0e0] text-[#161616] px-4 py-3.5 text-sm hover:bg-[#f4f4f4] transition-colors text-left flex justify-between items-center">
                      Sign up with Google
                    </button>
                  </div>
                  
                  <div className="max-w-sm my-6 flex items-center text-[#8d8d8d] text-sm before:flex-1 before:border-t before:border-[#e0e0e0] before:mr-4 after:flex-1 after:border-t after:border-[#e0e0e0] after:ml-4">
                    or
                  </div>

                  <form onSubmit={handleSignUp} className="max-w-sm flex flex-col gap-4">
                    <div>
                      <label className="block text-sm text-[#161616] mb-2" htmlFor="email">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border-b border-[#161616] bg-[#f4f4f4] px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#0f62fe]" 
                        placeholder="user@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#161616] mb-2" htmlFor="password">Password</label>
                      <input 
                        type="password" 
                        id="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border-b border-[#161616] bg-[#f4f4f4] px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#0f62fe]" 
                        placeholder="••••••••"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-[#0f62fe] text-white px-4 py-3.5 text-sm mt-4 hover:bg-[#0043ce] transition-colors flex justify-between items-center"
                    >
                      Sign up
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z"/>
                      </svg>
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Right Column - Media */}
            <div className="hidden lg:block">
              <div className="relative w-full h-full bg-[#f4f4f4] flex items-center justify-center p-12">
                 <div className="text-center max-w-sm">
                   <h2 className="text-2xl font-light text-[#161616] mb-4">Discover your next career move</h2>
                   <p className="text-[#525252]">Access free learning, support, and resources to build the skills you need for today&apos;s jobs.</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <nav className="mt-8 pt-4 border-t border-[#e0e0e0] flex gap-6">
            <Link href="/terms-of-use" className="text-[#0f62fe] text-xs hover:underline">
              Terms of Use
            </Link>
            <Link href="/privacy" className="text-[#0f62fe] text-xs hover:underline">
              Data Privacy Policy
            </Link>
          </nav>
        </section>
      </main>
    </div>
  );
}
