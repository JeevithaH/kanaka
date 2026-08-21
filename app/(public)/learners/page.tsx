'use client';

import React from 'react';
import Link from 'next/link';

export default function LearnersPage() {
  return (
    <main className="min-h-screen bg-[#f3f0ed] font-sans">
      {/* Header */}
      <section className="bg-[#312a25] text-white border-b border-[#4d433c]">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-14 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#d9c8bb]">LEARNER RESOURCES</p>
          <h1 className="mt-5 text-4xl lg:text-6xl leading-[1.1] tracking-[-0.04em] font-semibold max-w-3xl">
            Everything you need to advance your career.
          </h1>
          <p className="mt-6 text-[#ddd6d0] leading-7 max-w-2xl text-base">
            Skyrellac offers flexible, self-paced skills training, virtual internships, and verifiable credentials. Explore how you can accelerate your journey.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12 lg:py-16 grid md:grid-cols-2 gap-8">
        {/* Explore Courses */}
        <div className="bg-white border border-[#c8c8c8] p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1f1f1f]">Build Professional Skills</h2>
            <p className="text-sm leading-relaxed text-[#525252]">
              Enroll in self-paced courses curated by industry professionals. Learn AI fundamentals, web development, data analysis, or cloud infrastructure from scratch.
            </p>
          </div>
          <Link href="/courses" className="mt-6 bg-[#80664f] hover:bg-[#5f4938] text-white text-xs font-semibold px-4 py-3 rounded transition-colors text-center">
            Explore Courses
          </Link>
        </div>

        {/* Join Internship */}
        <div className="bg-white border border-[#c8c8c8] p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1f1f1f]">Gain Work Experience</h2>
            <p className="text-sm leading-relaxed text-[#525252]">
              Work on practical tasks inside our virtual internship tracks. Add real portfolio projects to your profile to prove your capabilities to employers.
            </p>
          </div>
          <Link href="/internships" className="mt-6 border border-[#80664f] text-[#80664f] hover:bg-[#80664f] hover:text-white text-xs font-semibold px-4 py-3 rounded transition-colors text-center">
            Explore Internships
          </Link>
        </div>
      </section>
    </main>
  );
}
