'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { CourseCheckoutModal } from '@/components/payments/CourseCheckoutModal';

interface CourseData {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  originalPrice: number;
  rating: number;
  studentsCount: number;
  durationMinutes: number;
  lessonCount: number;
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced';
  skills?: string[];
  instructor: { name: string; title: string };
}

const SUBJECTS = [
  'Computer Science', 'Data Science', 'Artificial Intelligence',
  'Business', 'Cybersecurity', 'Cloud Computing', 'Web Development',
];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const DURATIONS = ['1-4 Weeks', '1-3 Months', '3-6 Months', '6+ Months'];
const TYPES = ['Course', 'Specialization', 'Professional Certificate'];

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'text-[#f5a623]' : 'text-[#d6d6d6]'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </span>
  );
}

function CourseCard({ course, onEnroll }: { course: CourseData; onEnroll: () => void }) {
  const type = course.difficulty === 'Foundational' ? 'Course'
    : course.difficulty === 'Intermediate' ? 'Specialization'
    : 'Professional Certificate';

  const durationMonths = Math.max(1, Math.round((course.durationMinutes || 240) / 60 / 24 / 30));

  return (
    <div className="bg-white border border-[#c8c8c8] overflow-hidden hover:border-[#80664f] hover:shadow-lg transition-all duration-200 flex flex-col group cursor-pointer" onClick={onEnroll}>
      {/* Thumbnail */}
      <div className="relative w-full aspect-video bg-[#e4d9cf] overflow-hidden">
        <Image
          src={course.image || '/images/logo.jpeg'}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Provider */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 relative overflow-hidden shrink-0">
            <Image src="/images/logo.jpeg" alt="Skyrellac" fill className="object-cover" />
          </div>
          <span className="text-xs text-[#595959] font-medium truncate">{course.instructor?.name || 'Skyrellac'}</span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-[#1f1f1f] mb-1 line-clamp-2 group-hover:text-[#80664f] transition-colors leading-snug">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-[#595959] line-clamp-2 mb-3 leading-relaxed">
          {course.description}
        </p>

        {/* Type badge */}
        <div className="mb-2">
          <span className="inline-block text-[10px] font-bold text-[#80664f] border border-[#80664f] px-1.5 py-0.5">
            {type}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-xs font-bold text-[#1f1f1f]">{(course.rating || 4.8).toFixed(1)}</span>
          <StarRating rating={course.rating || 4.8} />
          <span className="text-xs text-[#595959]">({(course.studentsCount || 1240).toLocaleString()})</span>
        </div>

        {/* Level + Duration */}
        <div className="flex items-center gap-1 text-xs text-[#595959] mb-3">
          <span>{course.difficulty || 'Beginner'}</span>
          <span className="text-[#bbb]">·</span>
          <span>{durationMonths === 1 ? '1-4 Weeks' : `${durationMonths} months`}</span>
        </div>

        {/* Skills */}
        {course.skills && course.skills.length > 0 && (
          <p className="text-[11px] text-[#595959] mb-3 line-clamp-1">
            <span className="font-semibold">Skills:</span> {course.skills.slice(0,3).join(', ')}
          </p>
        )}

        {/* Price + enroll */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs font-bold text-[#161616]">₹1,999</span>
          <button
            onClick={(e) => { e.stopPropagation(); onEnroll(); }}
            className="bg-[#80664f] hover:bg-[#5f4938] text-white text-xs font-bold px-4 py-2 transition-colors"
          >
            Enroll for ₹1,999
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutCourse, setCheckoutCourse] = useState<CourseData | null>(null);

  // Filters
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (data.courses) setCourses(data.courses);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCourses();
  }, []);

  const handleEnrollClick = async (course: CourseData) => {
    if (!user) { router.push('/login?redirect=/courses'); return; }
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.courseId }),
      });
      if (res.ok) setCheckoutCourse(course);
    } catch { alert('Error enrolling'); }
  };

  const toggleFilter = (val: string, arr: string[], setter: (a: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const filteredCourses = courses.filter((c) => {
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !c.description?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !c.category.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedSubjects.length && !selectedSubjects.some(s => c.category.toLowerCase().includes(s.toLowerCase()))) return false;
    if (selectedLevels.length && !selectedLevels.some(l => (c.difficulty || '').toLowerCase().includes(l.toLowerCase()))) return false;
    return true;
  });

  const activeChips = [
    ...selectedSubjects,
    ...selectedLevels,
    ...selectedDurations,
    ...selectedTypes,
  ];

  const clearAll = () => {
    setSelectedSubjects([]); setSelectedLevels([]);
    setSelectedDurations([]); setSelectedTypes([]);
  };

  return (
    <div className="min-h-screen bg-[#f3f0ed] font-sans">

      {/* ── TOP SEARCH BAR ──────────────────────────────────────────────── */}
      <div className="bg-[#312a25] text-white border-b border-[#4d433c] py-10 lg:py-14">
        <div className="max-w-[1400px] mx-auto px-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#d9c8bb] mb-3">SKYRELLAC COURSE CATALOG</p>
          <div className="flex flex-col lg:flex-row lg:items-end gap-7">
            <div className="lg:w-1/2"><h1 className="text-4xl lg:text-5xl leading-none tracking-[-0.04em] font-semibold">Find the skill that moves you forward.</h1><p className="mt-4 text-sm leading-6 text-[#ddd6d0] max-w-xl">Every course is ₹1,999 and built around practical learning you can use.</p></div>
            <div className="flex gap-3 w-full lg:flex-1">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#595959]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                placeholder="What do you want to learn?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-[#c8c8c8] bg-white text-[#161616] pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#80664f]"
              />
            </div>
            <button className="bg-[#80664f] hover:bg-[#5f4938] text-white px-8 py-3 text-sm font-semibold transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8 flex gap-8">

        {/* ── LEFT SIDEBAR FILTERS ────────────────────────────────────────── */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="bg-white border border-[#c8c8c8] p-5 space-y-6 sticky top-20">

            {/* Subject */}
            <div>
              <h3 className="text-sm font-bold text-[#1f1f1f] mb-3">Subject</h3>
              <div className="space-y-2">
                {SUBJECTS.map((s) => (
                  <label key={s} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(s)}
                      onChange={() => toggleFilter(s, selectedSubjects, setSelectedSubjects)}
                      className="w-4 h-4 accent-[#80664f] rounded"
                    />
                    <span className="text-xs text-[#1f1f1f] group-hover:text-[#80664f] transition-colors">{s}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-[#e0e0e0]" />

            {/* Level */}
            <div>
              <h3 className="text-sm font-bold text-[#1f1f1f] mb-3">Level</h3>
              <div className="space-y-2">
                {LEVELS.map((l) => (
                  <label key={l} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedLevels.includes(l)}
                      onChange={() => toggleFilter(l, selectedLevels, setSelectedLevels)}
                      className="w-4 h-4 accent-[#80664f] rounded"
                    />
                    <span className="text-xs text-[#1f1f1f] group-hover:text-[#80664f] transition-colors">{l}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-[#e0e0e0]" />

            {/* Duration */}
            <div>
              <h3 className="text-sm font-bold text-[#1f1f1f] mb-3">Duration</h3>
              <div className="space-y-2">
                {DURATIONS.map((d) => (
                  <label key={d} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedDurations.includes(d)}
                      onChange={() => toggleFilter(d, selectedDurations, setSelectedDurations)}
                      className="w-4 h-4 accent-[#80664f] rounded"
                    />
                    <span className="text-xs text-[#1f1f1f] group-hover:text-[#80664f] transition-colors">{d}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-[#e0e0e0]" />

            {/* Learning Product */}
            <div>
              <h3 className="text-sm font-bold text-[#1f1f1f] mb-3">Learning Product</h3>
              <div className="space-y-2">
                {TYPES.map((t) => (
                  <label key={t} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(t)}
                      onChange={() => toggleFilter(t, selectedTypes, setSelectedTypes)}
                      className="w-4 h-4 accent-[#80664f] rounded"
                    />
                    <span className="text-xs text-[#1f1f1f] group-hover:text-[#80664f] transition-colors">{t}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-[#e0e0e0]" />

            <div className="border-l-2 border-[#80664f] pl-3 text-xs leading-5 text-[#525252]"><span className="font-semibold text-[#161616]">Simple pricing:</span> each course is ₹1,999.</div>

          </div>
        </aside>

        {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0">

          {/* Active filter chips + result count */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {activeChips.map((chip) => (
              <span key={chip} className="inline-flex items-center gap-1.5 bg-[#e8e0d8] text-[#80664f] text-xs font-semibold px-3 py-1.5">
                {chip}
                <button onClick={clearAll} className="hover:text-[#5f4938]">×</button>
              </span>
            ))}
            {activeChips.length > 0 && (
              <button onClick={clearAll} className="text-xs text-[#80664f] hover:underline font-semibold ml-1">
                Clear all
              </button>
            )}
          </div>

          {/* Sort + result count */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-[#595959] font-medium">
              {isLoading ? 'Loading...' : `${filteredCourses.length} results`}
            </p>
            <select className="border border-[#8d8d8d] bg-white text-xs text-[#1f1f1f] px-3 py-2 focus:outline-none focus:border-[#80664f]">
              <option>Best Match</option>
              <option>Highest Rated</option>
              <option>Most Enrolled</option>
              <option>Newest</option>
            </select>
          </div>

          {/* Course Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#80664f]" />
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#595959] text-sm">No courses found. Try adjusting your filters.</p>
              <button onClick={clearAll} className="mt-3 text-[#80664f] text-sm hover:underline font-semibold">Clear all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredCourses.map((c) => (
                <CourseCard key={c._id} course={c} onEnroll={() => handleEnrollClick(c)} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Checkout Modal */}
      {checkoutCourse && (
        <CourseCheckoutModal
          isOpen={!!checkoutCourse}
          onClose={() => setCheckoutCourse(null)}
          courseId={checkoutCourse.courseId}
          courseTitle={checkoutCourse.title}
          originalPrice={1999}
          onPaymentSuccess={() => router.push('/dashboard')}
        />
      )}
    </div>
  );
}
