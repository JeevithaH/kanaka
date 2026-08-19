'use client';

import React from 'react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="bg-white py-12 lg:py-20">
      <div className="max-w-[1584px] mx-auto px-4 flex flex-col lg:flex-row gap-12 items-center">
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-[#161616] font-semibold text-[2.625rem] lg:text-[3.375rem] leading-tight">
            Unlock your future with the AI and tech skills the world needs now
          </h1>
          <p className="text-[#525252] text-base lg:text-lg">
            Build in-demand skills in AI, cybersecurity, data, and more. Whether you’re starting your career or pivoting to something new, Skyrellac offers 100% free learning from a global leader in technology and innovation.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link href="/courses" className="bg-[#0f62fe] text-white px-4 py-3.5 text-sm inline-flex items-center gap-2 hover:bg-[#0043ce] transition-colors">
              Explore courses
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z"/>
              </svg>
            </Link>
            <Link href="/signup" className="border border-[#0f62fe] text-[#0f62fe] px-4 py-3.5 text-sm hover:bg-[#0f62fe]/5 transition-colors">
              Sign up
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 w-full">
          <div className="bg-[#e0e0e0] w-full min-h-[300px] lg:min-h-[480px]"></div>
        </div>
      </div>
    </section>
  );
}
