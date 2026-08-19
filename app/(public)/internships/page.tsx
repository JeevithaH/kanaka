'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_INTERNSHIPS } from '@/lib/supabase/mock-data';
import { Search, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function InternshipsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState('All');

  const filteredInternships = MOCK_INTERNSHIPS.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.organization_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.required_skills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesMode = selectedMode === 'All' || item.mode === selectedMode;

    return matchesSearch && matchesMode;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-white min-h-screen">
      
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
          Skyrellac Career Launchpad
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Verified Internship Opportunities
        </h1>
        <p className="text-base text-slate-600 max-w-2xl font-normal">
          Apply to industry-verified internships. Skyrellac credentials automatically validate your skill profile during application review.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row gap-4 justify-between items-center shadow-soft-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search internships by role, company, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 shadow-soft-sm transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="bg-white border border-slate-200 text-sm font-semibold text-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-600 shadow-soft-sm"
          >
            <option value="All">Mode: All Modes</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>
        </div>
      </div>

      {/* Internships List */}
      <div className="space-y-6">
        {filteredInternships.map((internship) => (
          <div key={internship.id} className="glass-card rounded-2xl p-6 space-y-5 border border-slate-200 bg-white shadow-soft-sm hover:border-emerald-400 hover:shadow-soft-xl transition-all group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {internship.mode}
                  </span>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    {internship.duration_weeks} Weeks Duration
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {internship.title}
                </h2>
                <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold">
                  <span className="text-slate-900">{internship.organization_name}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {internship.location}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link href={`/internships/${internship.slug}`}>
                  <Button variant="glow" size="md">
                    <span>View Opportunity</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

            </div>

            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {internship.description}
            </p>

            {/* Required Skills */}
            {internship.required_skills && (
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold mr-2">Required Skills:</span>
                {internship.required_skills.map((skill, idx) => (
                  <span key={idx} className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-200 font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
