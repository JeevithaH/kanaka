'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { CourseCheckoutModal } from '@/components/payments/CourseCheckoutModal';
import { Filter, X, ChevronDown, Search } from 'lucide-react';

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
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'text-[#f5a623]' : 'text-[#d6d6d6]'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function CourseCard({ course, onEnroll }: { course: CourseData; onEnroll: () => void }) {
  const type =
    course.difficulty === 'Foundational'
      ? 'Course'
      : course.difficulty === 'Intermediate'
      ? 'Specialization'
      : 'Professional Certificate';

  const durationMonths = Math.max(1, Math.round((course.durationMinutes || 240) / 60 / 24 / 30));

  return (
    <div
      className="bg-white border border-[#e0d8cf] rounded-xl overflow-hidden hover:border-[#80664f] hover:shadow-md transition-all duration-200 flex flex-col group cursor-pointer w-full"
      onClick={onEnroll}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video bg-[#f0ebe5] overflow-hidden">
        <Image
          src={course.image || '/images/logo.jpeg'}
          alt={course.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2.5 left-2.5">
          <span className="bg-[#161616]/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
            {course.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between space-y-3">
        <div>
          {/* Provider */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 relative overflow-hidden rounded shrink-0 border border-[#e5dfd7]">
              <Image src="/images/logo.jpeg" alt="Skyrellac" fill className="object-cover" />
            </div>
            <span className="text-xs text-[#595959] font-semibold truncate">
              {course.instructor?.name || 'Skyrellac'}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-[#1f1f1f] mb-1.5 line-clamp-2 group-hover:text-[#80664f] transition-colors leading-snug">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-[#595959] line-clamp-2 mb-3 leading-relaxed">
            {course.description}
          </p>

          {/* Type badge */}
          <div className="mb-2.5">
            <span className="inline-block text-[10px] font-bold text-[#80664f] bg-[#f0ebe5] border border-[#d8cfc6] px-2 py-0.5 rounded">
              {type}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs font-bold text-[#1f1f1f]">{(course.rating || 4.8).toFixed(1)}</span>
            <StarRating rating={course.rating || 4.8} />
            <span className="text-[11px] text-[#595959]">({(course.studentsCount || 1240).toLocaleString()})</span>
          </div>

          {/* Level + Duration */}
          <div className="flex items-center gap-1.5 text-xs text-[#595959] mb-3">
            <span className="font-medium">{course.difficulty || 'Beginner'}</span>
            <span className="text-[#bbb]">·</span>
            <span>{durationMonths === 1 ? '1-4 Weeks' : `${durationMonths} months`}</span>
          </div>

          {/* Skills */}
          {course.skills && course.skills.length > 0 && (
            <p className="text-[11px] text-[#595959] line-clamp-1 mb-2">
              <span className="font-semibold text-[#1f1f1f]">Skills:</span> {course.skills.slice(0, 3).join(', ')}
            </p>
          )}
        </div>

        {/* Price + enroll */}
        <div className="pt-3 border-t border-[#f0ebe5] flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#8a7f76] uppercase font-bold">Standard Tuition</span>
            <span className="text-sm font-bold text-[#161616]">₹1,999</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEnroll();
            }}
            className="bg-[#80664f] hover:bg-[#5f4938] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors shadow-2xs shrink-0 cursor-pointer"
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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

  const handleEnrollClick = (course: CourseData) => {
    if (!user) {
      router.push('/login?redirect=/courses');
      return;
    }
    setCheckoutCourse(course);
  };

  const toggleFilter = (val: string, arr: string[], setter: (a: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const filteredCourses = courses.filter((c) => {
    if (
      searchQuery &&
      !c.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.description?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    if (selectedSubjects.length && !selectedSubjects.some((s) => c.category.toLowerCase().includes(s.toLowerCase())))
      return false;
    if (selectedLevels.length && !selectedLevels.some((l) => (c.difficulty || '').toLowerCase().includes(l.toLowerCase())))
      return false;
    return true;
  });

  const activeChips = [
    ...selectedSubjects,
    ...selectedLevels,
    ...selectedDurations,
    ...selectedTypes,
  ];

  const clearAll = () => {
    setSelectedSubjects([]);
    setSelectedLevels([]);
    setSelectedDurations([]);
    setSelectedTypes([]);
  };

  const FiltersContent = (
    <div className="space-y-6">
      {/* Subject */}
      <div>
        <h3 className="text-xs sm:text-sm font-bold text-[#1f1f1f] mb-3">Subject</h3>
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
        <h3 className="text-xs sm:text-sm font-bold text-[#1f1f1f] mb-3">Level</h3>
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
        <h3 className="text-xs sm:text-sm font-bold text-[#1f1f1f] mb-3">Duration</h3>
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
        <h3 className="text-xs sm:text-sm font-bold text-[#1f1f1f] mb-3">Learning Product</h3>
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

      <div className="border-l-2 border-[#80664f] pl-3 text-xs leading-5 text-[#525252]">
        <span className="font-semibold text-[#161616]">Standard pricing:</span> each course is ₹1,999 with lifetime access.
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f5f3] font-sans">
      {/* ── RESPONSIVE TOP HERO & SEARCH ──────────────────────────────── */}
      <div className="bg-[#2e2722] text-white border-b border-[#453b34] py-8 sm:py-12 lg:py-14">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <p className="text-[11px] font-bold tracking-[0.15em] text-[#c5b8ac] mb-2 sm:mb-3 uppercase">
            SKYRELLAC COURSE CATALOG
          </p>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
            <div className="lg:w-1/2 space-y-2 sm:space-y-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Find the skill that moves you forward.
              </h1>
              <p className="text-xs sm:text-sm leading-relaxed text-[#ded7d0] max-w-xl">
                Every course is built around practical learning, mentor evaluations, and industry credentials you can prove.
              </p>
            </div>

            {/* Search Input and Button */}
            <div className="w-full lg:w-1/2 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a7f76]" />
                <input
                  type="text"
                  placeholder="What do you want to learn?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-[#544940] bg-white text-[#161616] pl-10 pr-4 py-3 text-xs sm:text-sm rounded-lg focus:outline-none focus:border-[#80664f] placeholder:text-[#8a7f76]"
                />
              </div>
              <button
                type="button"
                className="bg-[#80664f] hover:bg-[#5f4938] text-white px-6 sm:px-8 py-3 text-xs sm:text-sm font-bold rounded-lg transition-colors shrink-0 shadow-2xs cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 sm:gap-8">
        {/* ── DESKTOP LEFT SIDEBAR FILTERS ────────────────────────────────── */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="bg-white border border-[#e0d8cf] p-5 rounded-xl sticky top-20 shadow-xs">
            {FiltersContent}
          </div>
        </aside>

        {/* ── MOBILE FILTER BUTTON (TOGGLE) ────────────────────────────────── */}
        <div className="lg:hidden flex items-center justify-between bg-white border border-[#e0d8cf] p-3.5 rounded-xl shadow-xs">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center gap-2 text-xs font-bold text-[#1f1f1f]"
          >
            <Filter className="w-4 h-4 text-[#80664f]" />
            <span>Filter Courses ({activeChips.length} active)</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
          </button>

          {activeChips.length > 0 && (
            <button onClick={clearAll} className="text-xs font-bold text-[#80664f] hover:underline">
              Clear all
            </button>
          )}
        </div>

        {/* Mobile Collapsible Filter Drawer */}
        {mobileFiltersOpen && (
          <div className="lg:hidden bg-white border border-[#e0d8cf] p-5 rounded-xl shadow-xs">
            {FiltersContent}
          </div>
        )}

        {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0">
          {/* Active filter chips + result count */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {activeChips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1.5 bg-[#ede7e1] text-[#80664f] text-xs font-bold px-3 py-1.5 rounded-lg"
                >
                  {chip}
                  <button onClick={() => {
                    setSelectedSubjects(selectedSubjects.filter(x => x !== chip));
                    setSelectedLevels(selectedLevels.filter(x => x !== chip));
                    setSelectedDurations(selectedDurations.filter(x => x !== chip));
                    setSelectedTypes(selectedTypes.filter(x => x !== chip));
                  }} className="hover:text-[#5f4938] text-sm">×</button>
                </span>
              ))}
              <button onClick={clearAll} className="text-xs text-[#80664f] hover:underline font-bold ml-1">
                Clear all
              </button>
            </div>
          )}

          {/* Sort + result count (No overlap on mobile) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-white sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-[#e0d8cf]">
            <p className="text-xs sm:text-sm text-[#595959] font-bold shrink-0">
              {isLoading ? 'Loading courses...' : `Showing ${filteredCourses.length} courses`}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8a7f76] hidden sm:inline font-medium">Sort by:</span>
              <select className="border border-[#d8cfc6] bg-white text-xs font-semibold text-[#1f1f1f] px-3 py-2 rounded-lg focus:outline-none focus:border-[#80664f]">
                <option>Best Match</option>
                <option>Highest Rated</option>
                <option>Most Enrolled</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {/* Course Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#80664f]" />
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-16 bg-white border border-[#e0d8cf] rounded-2xl p-8">
              <p className="text-[#595959] text-sm font-medium">No courses found matching your criteria.</p>
              <button
                onClick={clearAll}
                className="mt-3 text-[#80664f] text-sm hover:underline font-bold"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
