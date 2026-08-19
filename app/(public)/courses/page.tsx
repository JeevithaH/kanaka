'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { CourseCard } from '@/components/course/CourseCard';
import { Search } from 'lucide-react';
import { CourseCheckoutModal } from '@/components/payments/CourseCheckoutModal';

interface CourseData {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  category: string;
  originalPrice: number;
  rating: number;
  studentsCount: number;
  durationMinutes: number;
  lessonCount: number;
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced';
  instructor: {
    name: string;
    title: string;
  };
}

export default function CoursesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Selected checkout
  const [checkoutCourse, setCheckoutCourse] = useState<CourseData | null>(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (data.courses) setCourses(data.courses);
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCourses();
  }, []);

  const categories = ['All', ...Array.from(new Set(courses.map((c) => c.category)))];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleEnrollClick = async (course: CourseData) => {
    if (!user) {
      router.push(`/login?redirect=/courses`);
      return;
    }

    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.courseId }),
      });
      if (res.ok) {
        // Prompt for payment or open checkout modal
        setCheckoutCourse(course);
      }
    } catch {
      alert('Error enrolling in course');
    }
  };

  const handlePaymentSuccess = () => {
    router.push('/dashboard');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-white min-h-screen font-sans">
      {/* Page Title */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200">
          Global Learning Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          In-Demand Professional Courses
        </h1>
        <p className="text-base text-slate-600 max-w-2xl font-normal">
          Build technical skills with structured modules, hands-on lessons, certification exams, and industry-backed credentials.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row gap-4 justify-between items-center shadow-soft-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses by topic, title, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 shadow-soft-sm transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course Cards Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-sm text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
          Loading courses from database...
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="p-12 text-center text-sm text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
          No courses found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((c) => (
            <div
              key={c._id}
              className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-soft-sm hover:border-blue-400 hover:shadow-soft-xl transition-all"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    {c.category}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    ₹{c.originalPrice || 1999}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors">
                  {c.title}
                </h2>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {c.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex justify-between text-xs text-slate-500 font-semibold">
                  <span>Instructor: {c.instructor?.name || 'Skyrellac Expert'}</span>
                  <span>{c.lessonCount || 12} Lessons</span>
                </div>

                <button
                  onClick={() => handleEnrollClick(c)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition-colors shadow-sm"
                >
                  Enroll & Pay ₹{c.originalPrice || 1999} (Promo Coupons Available)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutCourse && (
        <CourseCheckoutModal
          isOpen={!!checkoutCourse}
          onClose={() => setCheckoutCourse(null)}
          courseId={checkoutCourse.courseId}
          courseTitle={checkoutCourse.title}
          originalPrice={checkoutCourse.originalPrice || 1999}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
