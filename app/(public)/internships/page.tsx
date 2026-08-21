'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, MapPin, Search, SlidersHorizontal } from 'lucide-react';

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
  certificateEligible: boolean;
}

const CARD_TONES = ['bg-[#e4d9cf]', 'bg-[#d9dcda]', 'bg-[#e8e0d8]', 'bg-[#d5d4d1]', 'bg-[#e1dbd5]'];

export default function InternshipsPage() {
  const [internships, setInternships] = useState<InternshipData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadInternships() {
      try {
        const response = await fetch('/api/internships');
        const data = await response.json();
        setInternships(data.internships ?? []);
      } catch (error) {
        console.error('Failed to load internships:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadInternships();
  }, []);

  const displayedInternships = internships
    .filter((internship) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = !query || internship.title.toLowerCase().includes(query) || internship.organization.toLowerCase().includes(query) || internship.requiredSkills.some((skill) => skill.toLowerCase().includes(query));
      return matchesSearch && (selectedMode === 'All' || internship.mode === selectedMode);
    })
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-[#efebe7] border-b border-[#c8c8c8]">
        <div className="max-w-[1584px] mx-auto px-4 lg:px-8 pt-12 pb-10 lg:pt-16 lg:pb-12">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#5f4938]">SKYRELLAC CAREER LAUNCHPAD</p>
          <div className="mt-4 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl lg:text-[3.5rem] leading-[1.05] tracking-[-0.03em] font-semibold text-[#161616]">Internships that turn learning into proof</h1>
              <p className="mt-5 max-w-2xl text-[#525252] text-base lg:text-lg leading-7">Explore five guided internship programs. Build practical projects, practise the skills employers ask for, and create work that is yours to show.</p>
            </div>
            <div className="border-l-4 border-[#80664f] pl-4 shrink-0">
              <p className="text-2xl font-semibold text-[#161616]">5 programs</p>
              <p className="mt-1 text-sm text-[#525252]">Remote-friendly · project-based</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1584px] mx-auto px-4 lg:px-8 py-10 lg:py-14">
        <div className="border border-[#c8c8c8] bg-white p-4 flex flex-col md:flex-row md:items-center gap-3 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252]" />
            <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search by internship role or skill" className="w-full h-11 pl-11 pr-4 bg-[#f4f4f4] border border-transparent focus:border-[#80664f] focus:outline-none text-sm text-[#161616] placeholder:text-[#6f6f6f]" />
          </div>
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-4 h-4 text-[#525252]" aria-hidden="true" />
            <label htmlFor="mode" className="text-sm font-medium text-[#393939]">Format</label>
            <select id="mode" value={selectedMode} onChange={(event) => setSelectedMode(event.target.value)} className="h-11 px-3 border border-[#8d8d8d] bg-white text-sm text-[#161616] focus:outline-none focus:border-[#80664f]">
              <option value="All">All formats</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>
        </div>

        <div className="flex items-baseline justify-between gap-4 mb-6">
          <h2 className="text-2xl font-semibold text-[#161616]">Explore internship programs</h2>
          {!isLoading && <p className="text-sm text-[#525252]">{displayedInternships.length} of 5 programs</p>}
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="border border-[#c8c8c8] animate-pulse"><div className="h-32 bg-[#e0e0e0]" /><div className="p-5 space-y-3"><div className="h-3 bg-[#e0e0e0] w-2/5" /><div className="h-6 bg-[#e0e0e0]" /><div className="h-4 bg-[#e0e0e0]" /></div></div>)}</div>
        ) : displayedInternships.length === 0 ? (
          <div className="border border-[#c8c8c8] bg-[#f4f4f4] p-10 text-center"><p className="font-medium text-[#161616]">No internships match this search.</p><button type="button" onClick={() => { setSearchQuery(''); setSelectedMode('All'); }} className="mt-3 text-sm font-semibold text-[#80664f] hover:underline">Clear filters</button></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {displayedInternships.map((internship, index) => (
              <Link key={internship._id} href={`/internships/${internship.internshipId}`} className="group min-h-[380px] flex flex-col bg-white border border-[#c8c8c8] hover:border-[#80664f] hover:shadow-lg transition-all duration-200">
                <div className={`${CARD_TONES[index % CARD_TONES.length]} h-32 p-4 flex items-start justify-between`}>
                  <span className="text-xs font-semibold text-[#393939]">{internship.organization}</span>
                  <span className="bg-white/80 border border-[#8d8d8d] px-2.5 py-1 text-xs font-semibold text-[#5f4938]">{internship.mode}</span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-xs text-[#525252]">{internship.type} internship</p>
                  <h3 className="mt-2 text-lg leading-6 font-semibold text-[#161616] group-hover:text-[#80664f] transition-colors">{internship.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#525252] line-clamp-3">{internship.description}</p>
                  <p className="mt-4 text-xs leading-5 text-[#525252]"><span className="font-semibold text-[#393939]">Skills:</span> {internship.requiredSkills.slice(0, 3).join(' · ')}</p>
                  <div className="mt-auto pt-5 border-t border-[#e0e0e0] space-y-3">
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#525252]"><span className="inline-flex gap-1 items-center"><Clock className="w-3.5 h-3.5" />{internship.durationWeeks} weeks</span><span className="inline-flex gap-1 items-center"><MapPin className="w-3.5 h-3.5" />{internship.location}</span></div>
                    <span className="flex justify-between items-center text-sm font-semibold text-[#80664f]">View program <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
