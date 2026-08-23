'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  contentType: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface CourseDetail {
  courseId: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  rating: number;
  studentsCount: number;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  instructor: {
    name: string;
    title: string;
    avatarUrl?: string;
  };
  skills: string[];
  modules: Module[];
  tests: any[];
}

export default function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = React.use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/courses/${unwrappedParams.slug}`);
        const data = await res.json();
        if (data.course) {
          setCourse(data.course);
        }

        if (user) {
          const enrollRes = await fetch('/api/enrollments');
          const enrollData = await enrollRes.json();
          if (enrollData.enrollments) {
            const match = enrollData.enrollments.some((e: any) => e.courseId === unwrappedParams.slug);
            setIsEnrolled(match);
          }
        }
      } catch (err) {
        console.error('Error loading course details:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [unwrappedParams.slug, user]);

  const handleEnroll = async () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/courses/${unwrappedParams.slug}`)}`);
      return;
    }

    try {
      setIsEnrolling(true);
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: unwrappedParams.slug }),
      });

      if (res.ok) {
        router.push(`/learn/${unwrappedParams.slug}/mod1-lesson1`);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to enroll');
      }
    } catch (err) {
      alert('Error connecting to server.');
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-16 flex items-center justify-center">
        <div className="text-sm font-semibold text-[#525252]">Loading course specifications...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#161616]">Course Not Found</h1>
        <Link href="/courses" className="text-[#80664f] text-sm hover:underline">
          Return to course catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Banner */}
      <section className="bg-[#161616] text-white py-12 lg:py-16">
        <div className="max-w-[1584px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold bg-[#393939] text-[#78a9ff] px-2.5 py-1 uppercase tracking-wider">
                {course.category}
              </span>
              <span className="text-xs bg-[#262626] text-[#c6c6c6] px-2.5 py-1">
                {course.difficulty}
              </span>
            </div>

            <h1 className="text-3xl lg:text-5xl font-light tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-[#c6c6c6] text-base lg:text-lg leading-relaxed max-w-3xl">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-[#a8a8a8]">
              <div>Instructor: <strong className="text-white">{course.instructor.name}</strong> ({course.instructor.title})</div>
              <div>Rating: <strong className="text-white">★ {course.rating}</strong></div>
              <div>Learners: <strong className="text-white">{course.studentsCount.toLocaleString()}</strong></div>
            </div>
          </div>

          {/* Pricing & CTA Box */}
          <div className="bg-white text-[#161616] border border-[#e0e0e0] p-8 flex flex-col justify-between self-start shadow-lg">
            <div className="space-y-4">
              <div className="text-xs uppercase tracking-wider text-[#525252] font-semibold">Special Offer Price</div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-[#161616]">₹{course.discountedPrice || 199}</span>
                <span className="text-sm text-[#8d8d8d] line-through">₹{course.originalPrice || 1999}</span>
                <span className="bg-[#198038] text-white text-xs font-bold px-2 py-0.5 uppercase">
                  {course.discountPercentage || 90}% OFF
                </span>
              </div>
              <p className="text-xs text-[#525252]">Includes lifetime access, interactive assessments & digital certificate.</p>
            </div>

            <div className="pt-8 space-y-3">
              {isEnrolled ? (
                <Link
                  href={`/learn/${course.courseId}/mod1-lesson1`}
                  className="block text-center w-full bg-[#198038] text-white py-3.5 text-sm font-semibold hover:bg-[#0e6027] transition-colors"
                >
                  Continue Learning
                </Link>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="w-full bg-[#80664f] text-white py-3.5 text-sm font-semibold hover:bg-[#5f4938] transition-colors disabled:opacity-50"
                >
                  {isEnrolling ? 'Enrolling...' : 'Enroll Now for ₹199'}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1584px] mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Curriculum Column */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h2 className="text-2xl font-semibold text-[#161616] mb-6">Course Curriculum</h2>
            <div className="border border-[#e0e0e0] divide-y divide-[#e0e0e0]">
              {course.modules?.map((mod, idx) => (
                <div key={mod.id} className="p-6 bg-white">
                  <h3 className="text-lg font-semibold text-[#161616] mb-2">{mod.title}</h3>
                  <p className="text-xs text-[#525252] mb-4">{mod.description}</p>
                  <ul className="space-y-2">
                    {mod.lessons.map((lesson) => (
                      <li key={lesson.id} className="flex items-center justify-between text-sm p-3 bg-[#f4f4f4]">
                        <span className="font-medium text-[#161616]">{lesson.title}</span>
                        <span className="text-xs text-[#525252]">{lesson.duration}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Assessment Section */}
          {course.tests?.length > 0 && (
            <div className="border border-[#e0e0e0] p-6 bg-[#f4f4f4]">
              <h3 className="text-lg font-semibold text-[#161616] mb-2">Final Certificate Assessment</h3>
              <p className="text-xs text-[#525252] mb-4">
                Complete all lessons and pass the final 5-question test with at least 70% to claim your verifiable digital certificate.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          {/* Skills Acquired */}
          <div className="border border-[#e0e0e0] p-6 bg-white">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#161616] mb-4">Skills You Will Build</h3>
            <div className="flex flex-wrap gap-2">
              {course.skills?.map((skill) => (
                <span key={skill} className="text-xs bg-[#f4f4f4] border border-[#e0e0e0] text-[#161616] px-3 py-1 font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
