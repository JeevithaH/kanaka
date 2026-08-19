import React from 'react';
import { CheckoutButton } from '@/components/payments/CheckoutButton';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {/* Page Header */}
      <div className="bg-[#161616] py-16 lg:py-24 text-white">
        <div className="max-w-[1584px] mx-auto px-4">
          <h1 className="text-3xl lg:text-5xl font-light mb-6">Invest in your career</h1>
          <p className="text-[#c6c6c6] text-lg max-w-2xl">
            Choose the plan that fits your goals. Start with our free basic courses or upgrade for full access to premium content, certifications, and industry labs.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-[1584px] mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white border border-[#e0e0e0] flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
            <div className="p-8 border-b border-[#e0e0e0] flex-1">
              <h2 className="text-2xl font-semibold text-[#161616] mb-2">Basic</h2>
              <p className="text-[#525252] text-sm mb-6">Perfect for getting started.</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-light text-[#161616]">$0</span>
                <span className="text-[#525252] text-sm">/month</span>
              </div>
              <ul className="space-y-4 text-sm text-[#161616]">
                <li className="flex items-start gap-3">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#0f62fe" className="mt-0.5 shrink-0">
                    <path d="M6.5 11.5L2 7l1.4-1.4L6.5 8.7l6.1-6.1L14 4l-7.5 7.5z"/>
                  </svg>
                  Access to 100+ foundational courses
                </li>
                <li className="flex items-start gap-3">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#0f62fe" className="mt-0.5 shrink-0">
                    <path d="M6.5 11.5L2 7l1.4-1.4L6.5 8.7l6.1-6.1L14 4l-7.5 7.5z"/>
                  </svg>
                  Community support forums
                </li>
                <li className="flex items-start gap-3">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#0f62fe" className="mt-0.5 shrink-0">
                    <path d="M6.5 11.5L2 7l1.4-1.4L6.5 8.7l6.1-6.1L14 4l-7.5 7.5z"/>
                  </svg>
                  Basic progress tracking
                </li>
              </ul>
            </div>
            <div className="p-8 bg-[#f4f4f4] mt-auto">
              <Link
                href="/register"
                className="w-full border border-[#0f62fe] text-[#0f62fe] px-4 py-3.5 text-sm hover:bg-[#0f62fe] hover:text-white transition-colors inline-flex justify-center items-center"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Premium Tier */}
          <div className="bg-white border-2 border-[#0f62fe] flex flex-col h-full relative shadow-md">
            <div className="absolute top-0 right-0 bg-[#0f62fe] text-white text-xs font-semibold px-3 py-1 uppercase tracking-wide">
              Recommended
            </div>
            <div className="p-8 border-b border-[#e0e0e0] flex-1">
              <h2 className="text-2xl font-semibold text-[#161616] mb-2">Premium</h2>
              <p className="text-[#525252] text-sm mb-6">For serious career switchers.</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-light text-[#161616]">$29</span>
                <span className="text-[#525252] text-sm">/month</span>
              </div>
              <ul className="space-y-4 text-sm text-[#161616]">
                <li className="flex items-start gap-3">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#0f62fe" className="mt-0.5 shrink-0">
                    <path d="M6.5 11.5L2 7l1.4-1.4L6.5 8.7l6.1-6.1L14 4l-7.5 7.5z"/>
                  </svg>
                  <strong>Everything in Basic, plus:</strong>
                </li>
                <li className="flex items-start gap-3">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#0f62fe" className="mt-0.5 shrink-0">
                    <path d="M6.5 11.5L2 7l1.4-1.4L6.5 8.7l6.1-6.1L14 4l-7.5 7.5z"/>
                  </svg>
                  Access to 500+ premium industry courses
                </li>
                <li className="flex items-start gap-3">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#0f62fe" className="mt-0.5 shrink-0">
                    <path d="M6.5 11.5L2 7l1.4-1.4L6.5 8.7l6.1-6.1L14 4l-7.5 7.5z"/>
                  </svg>
                  Verified digital credentials & certificates
                </li>
                <li className="flex items-start gap-3">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#0f62fe" className="mt-0.5 shrink-0">
                    <path d="M6.5 11.5L2 7l1.4-1.4L6.5 8.7l6.1-6.1L14 4l-7.5 7.5z"/>
                  </svg>
                  Hands-on cloud and AI lab environments
                </li>
              </ul>
            </div>
            <div className="p-8 bg-[#f4f4f4] mt-auto">
              <CheckoutButton priceId="price_placeholder_123" planName="Premium" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
