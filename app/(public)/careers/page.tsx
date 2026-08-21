'use client';

import React from 'react';
import Link from 'next/link';

const JOBS = [
  { title: 'Tech Lead / Curriculum Designer', team: 'Education', type: 'Full-time', location: 'Remote (India)' },
  { title: 'Full Stack Engineer', team: 'Engineering', type: 'Full-time', location: 'Remote (India)' },
  { title: 'Student Success Coordinator', team: 'Support', type: 'Part-time / Remote', location: 'Bengaluru, India' },
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[#f3f0ed] font-sans">
      {/* Header */}
      <section className="bg-[#312a25] text-white border-b border-[#4d433c]">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-14 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#d9c8bb]">WORK WITH US</p>
          <h1 className="mt-5 text-4xl lg:text-6xl leading-[1.1] tracking-[-0.04em] font-semibold max-w-3xl">
            Help us build the education platform of tomorrow.
          </h1>
          <p className="mt-6 text-[#ddd6d0] leading-7 max-w-2xl text-base">
            Join a remote-first team dedicated to opening job paths for millions of learners through practical courses and virtual internships.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#1f1f1f] border-b border-[#c8c8c8] pb-3">Open Positions</h2>
          
          <div className="divide-y divide-[#c8c8c8] border border-[#c8c8c8] bg-white">
            {JOBS.map((job) => (
              <div key={job.title} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-[#fcfbf9] transition-colors">
                <div>
                  <h3 className="text-base font-bold text-[#1f1f1f] hover:text-[#80664f] transition-colors">{job.title}</h3>
                  <div className="flex gap-3 text-xs text-[#525252] mt-1">
                    <span>{job.team}</span>
                    <span>·</span>
                    <span>{job.type}</span>
                    <span>·</span>
                    <span>{job.location}</span>
                  </div>
                </div>
                <Link href="/contact" className="bg-[#80664f] hover:bg-[#5f4938] text-white text-xs font-semibold px-4 py-2 rounded transition-colors text-center shrink-0">
                  Apply Now
                </Link>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="pt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#c8c8c8] p-6 space-y-2">
              <h3 className="text-sm font-bold text-[#80664f]">Remote First</h3>
              <p className="text-xs leading-relaxed text-[#525252]">Work from anywhere in India. We support flexible schedules that let you do your best work.</p>
            </div>
            <div className="bg-white border border-[#c8c8c8] p-6 space-y-2">
              <h3 className="text-sm font-bold text-[#80664f]">Learning Budget</h3>
              <p className="text-xs leading-relaxed text-[#525252]">We pay for books, online courses, and credentials to help you keep building your own skills.</p>
            </div>
            <div className="bg-white border border-[#c8c8c8] p-6 space-y-2">
              <h3 className="text-sm font-bold text-[#80664f]">Direct Impact</h3>
              <p className="text-xs leading-relaxed text-[#525252]">Every feature you build and course you design directly helps thousands of students land roles.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
