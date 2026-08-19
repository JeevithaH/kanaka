import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { TrustSection } from '@/components/home/TrustSection';
import { HowItWorks } from '@/components/home/HowItWorks';
import { FeaturedCoursesSection } from '@/components/home/FeaturedCoursesSection';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <TrustSection />
      <HowItWorks />
      <FeaturedCoursesSection />
      {/* CTA Banner */}
      <section className="bg-[#0f62fe] py-12 lg:py-20">
        <div className="max-w-[1584px] mx-auto px-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-white font-semibold text-2xl">Ready to build your skill profile?</h2>
            <p className="text-blue-100 text-base">Join thousands of learners building career-ready skills, earning verified credentials, and launching their careers.</p>
          </div>
          <Link href="/register" className="bg-white text-[#0f62fe] px-6 py-3.5 text-sm hover:bg-[#f4f4f4] transition-colors inline-flex items-center gap-2 shrink-0">
            Create free account
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z"/></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
