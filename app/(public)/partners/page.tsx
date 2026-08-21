'use client';

import React from 'react';
import Link from 'next/link';

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-[#f3f0ed] font-sans">
      {/* Header */}
      <section className="bg-[#312a25] text-white border-b border-[#4d433c]">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-14 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#d9c8bb]">PARTNER DIRECTORY</p>
          <h1 className="mt-5 text-4xl lg:text-6xl leading-[1.1] tracking-[-0.04em] font-semibold max-w-3xl">
            Partner with Skyrellac to train the next workforce.
          </h1>
          <p className="mt-6 text-[#ddd6d0] leading-7 max-w-2xl text-base">
            We collaborate with universities, technology companies, and government organizations to deliver certified educational experiences aligned to industry requirements.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Universities Card */}
          <div className="bg-white border border-[#c8c8c8] p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#80664f] uppercase tracking-wider">Academic Partners</span>
              <h2 className="text-xl font-bold text-[#1f1f1f]">For Universities & Colleges</h2>
              <p className="text-sm leading-relaxed text-[#525252]">
                Integrate practical training and virtual internship tracks into your student's curricula. Help your graduates stand out in competitive job markets with verifiable credentials and project records.
              </p>
            </div>
            <Link href="/contact" className="mt-6 text-sm font-semibold text-[#80664f] hover:underline">
              Integrate with your college →
            </Link>
          </div>

          {/* Employers Card */}
          <div className="bg-white border border-[#c8c8c8] p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#80664f] uppercase tracking-wider">Corporate Partners</span>
              <h2 className="text-xl font-bold text-[#1f1f1f]">For Companies & Teams</h2>
              <p className="text-sm leading-relaxed text-[#525252]">
                Upskill your development, cloud, or cybersecurity teams with our self-paced course tracks. Or collaborate with us to design customized virtual internship programs that qualify potential hires.
              </p>
            </div>
            <Link href="/contact" className="mt-6 text-sm font-semibold text-[#80664f] hover:underline">
              Train your team →
            </Link>
          </div>
        </div>

        {/* MSME Banner */}
        <div className="mt-8 bg-white border border-[#c8c8c8] p-8 text-center space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#80664f]">GOVERNMENT ACCREDITATION</p>
          <h3 className="text-lg font-bold text-[#1f1f1f]">Official MSME Registered Platform</h3>
          <p className="text-sm text-[#595959] max-w-2xl mx-auto leading-relaxed">
            Skyrellac is officially certified under the Ministry of Micro, Small & Medium Enterprises (MSME), Government of India, verifying our commitment to credible enterprise skill growth.
          </p>
        </div>
      </section>
    </main>
  );
}
