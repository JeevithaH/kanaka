'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f3f0ed] font-sans">
      {/* Header */}
      <section className="bg-[#312a25] text-white border-b border-[#4d433c]">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-14 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#d9c8bb]">ABOUT SKYRELLAC</p>
          <h1 className="mt-5 text-4xl lg:text-6xl leading-[1.1] tracking-[-0.04em] font-semibold max-w-3xl">
            We are here to make career-ready education accessible.
          </h1>
          <p className="mt-6 text-[#ddd6d0] leading-7 max-w-2xl text-base">
            Skyrellac bridges the gap between academic theory and real-world employment. We provide students, job switchers, and lifelong learners with practical, self-paced skills and virtual internships.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="bg-white border border-[#c8c8c8] p-8 space-y-6">
            <h2 className="text-2xl font-bold text-[#1f1f1f]">Our Core Mission</h2>
            <p className="text-sm leading-relaxed text-[#525252]">
              In today's fast-moving economy, traditional education systems struggle to keep pace with industry demands. Skyrellac empowers learners to master practical skills in AI, data, cloud computing, and developer tracks at a fraction of the cost, complete with industry-ready internship tasks.
            </p>
            <p className="text-sm leading-relaxed text-[#525252]">
              Our platforms are registered under the Ministry of Micro, Small & Medium Enterprises (MSME), Government of India, certifying our standard of education and commitment to professional growth.
            </p>
          </div>

          <div className="bg-white border border-[#c8c8c8] p-8 space-y-6">
            <h2 className="text-2xl font-bold text-[#1f1f1f]">What We Believe</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#80664f]">01. Practical over Theory</h3>
                <p className="text-xs text-[#525252] mt-1">Learning is most effective when applied. Our courses are paired with actual tasks and projects.</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#80664f]">02. Access for Everyone</h3>
                <p className="text-xs text-[#525252] mt-1">Quality training shouldn't lock you in a lifelong debt. We keep our programs budget-friendly and free to start.</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#80664f]">03. Industry Credibility</h3>
                <p className="text-xs text-[#525252] mt-1">We provide verified registries for all certificates, so employers can verify your skills instantly.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 bg-white border-l-4 border-[#80664f] border-y border-r border-[#c8c8c8] px-6 py-8 flex flex-col sm:flex-row gap-6 justify-between sm:items-center">
          <div>
            <h3 className="text-lg font-bold text-[#1f1f1f]">Ready to start your learning journey?</h3>
            <p className="text-sm text-[#595959] mt-1">Choose from our catalog of courses, guided paths, and hands-on internship tracks.</p>
          </div>
          <Link href="/courses" className="bg-[#80664f] hover:bg-[#5f4938] text-white px-6 py-3 text-sm font-semibold rounded transition-colors shrink-0 text-center">
            Explore Courses
          </Link>
        </div>
      </section>
    </main>
  );
}
