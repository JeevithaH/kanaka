'use client';

import Link from 'next/link';
import Image from 'next/image';

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M9.3 3.7 13.1 7.5H1v1h12.1l-3.8 3.8.7.7L15 8l-5-5z" />
    </svg>
  );
}

export function HeroSection() {
  return (
    <section className="bg-[#efebe7] border-b border-[#c6c6c6]">
      <div className="max-w-[1400px] mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-[#5f4938]">
            Skyrellac Online Learning
          </span>
          <h1 className="text-[#1f1f1f] font-bold text-4xl lg:text-6xl tracking-tight leading-[1.1]">
            Learn without limits. Start your future today.
          </h1>
          <p className="text-[#595959] text-base lg:text-lg leading-relaxed max-w-xl">
            Build in-demand skills in Artificial Intelligence, Cybersecurity, Data Science, and Cloud Computing. Learn from world-class industry experts completely free.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link 
              href="/courses" 
              className="bg-[#80664f] hover:bg-[#5f4938] text-white px-8 py-3.5 text-sm font-semibold rounded transition-colors inline-flex items-center gap-2"
            >
              Join for Free
            </Link>
            <Link 
              href="/learning-paths" 
              className="border border-[#1f1f1f] hover:bg-[#161616] hover:text-white text-[#1f1f1f] px-8 py-3.5 text-sm font-semibold rounded transition-colors"
            >
              Explore Career Paths
            </Link>
          </div>
          <div className="pt-8 border-t border-[#e0e0e0] grid grid-cols-3 gap-6 max-w-lg">
            <div>
              <p className="text-2xl lg:text-3xl font-extrabold text-[#1f1f1f]">100%</p>
              <p className="text-xs text-[#595959] mt-1">Online & Self-Paced</p>
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-extrabold text-[#1f1f1f]">500+</p>
              <p className="text-xs text-[#595959] mt-1">Free Courses</p>
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-extrabold text-[#1f1f1f]">Verified</p>
              <p className="text-xs text-[#595959] mt-1">Course Certificates</p>
            </div>
          </div>
        </div>

        {/* Right Visual Image */}
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-[#f5f5f5]">
          <Image
            src="/images/beth-stevenson-NtfFqT8JBI0-unsplash.jpg"
            alt="Students collaborating and learning online"
            fill
            priority
            className="object-cover"
            sizes="(max-w-720px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
