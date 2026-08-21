'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate contact form submission
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#f3f0ed] font-sans">
      {/* Header */}
      <section className="bg-[#312a25] text-white border-b border-[#4d433c]">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-14 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#d9c8bb]">GET IN TOUCH</p>
          <h1 className="mt-5 text-4xl lg:text-6xl leading-[1.1] tracking-[-0.04em] font-semibold max-w-3xl">
            We are here to help you move forward.
          </h1>
          <p className="mt-6 text-[#ddd6d0] leading-7 max-w-2xl text-base">
            Have questions about a course, internship evaluations, certificate verification, or university integrations? Send us a message and our team will get back to you shortly.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[800px] mx-auto px-4 py-12 lg:py-16">
        <div className="bg-white border border-[#c8c8c8] p-8 sm:p-10 shadow-soft-sm">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <span className="text-4xl">✉️</span>
              <h2 className="text-2xl font-bold text-[#1f1f1f]">Message Sent Successfully!</h2>
              <p className="text-sm text-[#525252] max-w-md mx-auto">
                Thank you for contacting us. A member of the Skyrellac team will review your message and reach out to you via email shortly.
              </p>
              <button 
                onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
                className="text-sm font-semibold text-[#80664f] hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-xl font-bold text-[#1f1f1f] mb-4">Send a Message</h2>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-[#1f1f1f] uppercase tracking-wider mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full border border-[#c8c8c8] px-4 py-3 text-sm focus:outline-none focus:border-[#80664f]"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-[#1f1f1f] uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full border border-[#c8c8c8] px-4 py-3 text-sm focus:outline-none focus:border-[#80664f]"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs font-bold text-[#1f1f1f] uppercase tracking-wider mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full border border-[#c8c8c8] px-4 py-3 text-sm focus:outline-none focus:border-[#80664f]"
                  placeholder="What is this regarding?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-bold text-[#1f1f1f] uppercase tracking-wider mb-2">Message</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full border border-[#c8c8c8] px-4 py-3 text-sm focus:outline-none focus:border-[#80664f] resize-none"
                  placeholder="Write your message here..."
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full h-12">
                Send Message
              </Button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
