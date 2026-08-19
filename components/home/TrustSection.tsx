import React from 'react';
import Link from 'next/link';

export function TrustSection() {
  return (
    <section className="bg-white border-b border-[#e0e0e0] py-12 lg:py-20">
      <div className="max-w-[1584px] mx-auto px-4 flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/3">
          <h2 className="text-[#161616] font-semibold text-2xl">
            Free AI and tech learning in 20+ languages
          </h2>
        </div>
        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="flex flex-col">
            <div className="aspect-[3/2] bg-[#e0e0e0] w-full mb-4"></div>
            <Link href="#" className="text-[#0f62fe] text-base hover:underline inline-flex items-center gap-1 group font-medium">
              Adult learners
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="group-hover:translate-x-1 transition-transform">
                <path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z"/>
              </svg>
            </Link>
            <p className="text-[#525252] text-sm mt-2">
              Build practical skills that support career growth, career changes, and lifelong learning.
            </p>
          </div>
          {/* Card 2 */}
          <div className="flex flex-col">
            <div className="aspect-[3/2] bg-[#e0e0e0] w-full mb-4"></div>
            <Link href="#" className="text-[#0f62fe] text-base hover:underline inline-flex items-center gap-1 group font-medium">
              University
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="group-hover:translate-x-1 transition-transform">
                <path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z"/>
              </svg>
            </Link>
            <p className="text-[#525252] text-sm mt-2">
              Build on any post-secondary program with the skills that employers are looking for.
            </p>
          </div>
          {/* Card 3 */}
          <div className="flex flex-col">
            <div className="aspect-[3/2] bg-[#e0e0e0] w-full mb-4"></div>
            <Link href="#" className="text-[#0f62fe] text-base hover:underline inline-flex items-center gap-1 group font-medium">
              High school
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="group-hover:translate-x-1 transition-transform">
                <path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z"/>
              </svg>
            </Link>
            <p className="text-[#525252] text-sm mt-2">
              Help students lay a foundation for career success with future-focused skills.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
