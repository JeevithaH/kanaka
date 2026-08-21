import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { PartnerLogos } from '@/components/home/PartnerLogos';
import { TrustSection } from '@/components/home/TrustSection';
import { HowItWorks } from '@/components/home/HowItWorks';
import { InternshipSection } from '@/components/home/InternshipSection';
import { FeaturedCoursesSection } from '@/components/home/FeaturedCoursesSection';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <PartnerLogos />
      <TrustSection />
      <HowItWorks />
      <InternshipSection />
      <FeaturedCoursesSection />
      
      {/* CTA Banner */}
      <section className="bg-[#80664f] py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-white font-bold text-3xl">Ready to build your skill profile?</h2>
            <p className="text-[#efebe7] text-base leading-relaxed">
              Join thousands of learners building career-ready skills, earning verified credentials, and launching their careers.
            </p>
          </div>
          <Link 
            href="/register" 
            className="bg-white text-[#80664f] hover:bg-[#efebe7] px-8 py-3.5 text-sm font-semibold rounded transition-colors inline-flex items-center gap-2 shrink-0 shadow-md"
          >
            Create free account
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z"/>
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
