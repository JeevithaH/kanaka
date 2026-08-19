'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface InternshipData {
  _id: string;
  internshipId: string;
  title: string;
  description: string;
  organization: string;
  mode: 'Remote' | 'Hybrid' | 'On-site';
  location: string;
  durationWeeks: number;
  type: string;
  requiredSkills: string[];
  validationFee: number;
  certificateEligible: boolean;
}

export default function InternshipsPage() {
  const [internships, setInternships] = useState<InternshipData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadInternships() {
      try {
        const res = await fetch('/api/internships');
        const data = await res.json();
        if (data.internships) {
          setInternships(data.internships);
        }
      } catch (err) {
        console.error('Failed to load internships:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadInternships();
  }, []);

  const filteredInternships = internships.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.requiredSkills?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMode = selectedMode === 'All' || item.mode === selectedMode;

    return matchesSearch && matchesMode;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-white min-h-screen font-sans">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
          Skyrellac Career Launchpad
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Verified Internship Programs
        </h1>
        <p className="text-base text-slate-600 max-w-2xl font-normal">
          Join free industry-aligned internships. Complete assigned practical tasks, gain real experience, and optional paid validation for official credentials.
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
      {isLoading ? (
        <div className="p-12 text-center text-sm text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
          Loading active internship opportunities...
        </div>
      ) : filteredInternships.length === 0 ? (
        <div className="p-12 text-center space-y-2 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-base font-semibold text-slate-800">No internship programs found matching your search.</p>
          <p className="text-xs text-slate-500">Try adjusting your search terms or filters.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredInternships.map((internship) => (
            <div
              key={internship._id}
              className="glass-card rounded-2xl p-6 space-y-5 border border-slate-200 bg-white shadow-soft-sm hover:border-emerald-400 hover:shadow-soft-xl transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {internship.mode}
                    </span>
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                      Free Enrollment
                    </span>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      {internship.durationWeeks} Weeks Duration
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {internship.title}
                  </h2>

                  <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold">
                    <span className="text-slate-900">{internship.organization}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {internship.location}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Link href={`/internships/${internship.internshipId}`}>
                    <Button variant="glow" size="md" className="w-full sm:w-auto">
                      <span>View & Join Internship</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                {internship.description}
              </p>

              {/* Required Skills & Fee pill */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                {internship.requiredSkills && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-400 font-semibold mr-1">Skills:</span>
                    {internship.requiredSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-200 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Validation Fee: <strong>₹{internship.validationFee || 499}</strong> (Optional)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
