'use client';

import React from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Auth Masthead - minimal header like SkillsBuild signup */}
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
              <h1 className="text-[#161616] font-light text-[2rem] lg:text-[2.625rem] leading-tight mb-4">
                Sign up to Skyrellac
              </h1>
              <p className="text-[#525252] text-sm mb-10">
                Already have an account with Skyrellac?{' '}
                <Link href="/login" className="text-[#0f62fe] hover:underline">
                  Log in
                </Link>
              </p>

              {/* Button Group - Tertiary style (outline) like SkillsBuild signup */}
              <div className="flex flex-col gap-4 max-w-sm">
                <Link
                  href="/dashboard"
                  className="w-full border border-[#0f62fe] text-[#0f62fe] px-4 py-3.5 text-sm text-left hover:bg-[#0143ce] hover:text-white hover:border-[#0143ce] transition-colors inline-flex items-center justify-between"
                >
                  College or university
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z"/>
                  </svg>
                </Link>
                <Link
                  href="/dashboard"
                  className="w-full border border-[#0f62fe] text-[#0f62fe] px-4 py-3.5 text-sm text-left hover:bg-[#0143ce] hover:text-white hover:border-[#0143ce] transition-colors inline-flex items-center justify-between"
                >
                  Adult learning
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z"/>
                  </svg>
                </Link>
                <Link
                  href="/dashboard"
                  className="w-full border border-[#0f62fe] text-[#0f62fe] px-4 py-3.5 text-sm text-left hover:bg-[#0143ce] hover:text-white hover:border-[#0143ce] transition-colors inline-flex items-center justify-between"
                >
                  High school
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z"/>
                  </svg>
                </Link>
              </div>

              {/* Additional */}
              <div className="mt-10">
                <p className="text-[#525252] text-sm">
                  Looking for{' '}
                  <Link href="#" className="text-[#0f62fe] hover:underline font-medium">
                    college software downloads
                  </Link>
                  ?
                </p>
              </div>
            </div>

            {/* Right Column - Media */}
            <div className="hidden lg:block">
              <div className="relative w-full aspect-square bg-[#e0e0e0]">
                {/* Empty image placeholder */}
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
