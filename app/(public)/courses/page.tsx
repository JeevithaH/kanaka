'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

interface CourseItem {
  _id: string;
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
  };
  skills: string[];
}

export default function CoursesCatalogPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [enrollingSlug, setEnrollingSlug] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (data.courses) {
          setCourses(data.courses);
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const handleEnroll = async (slug: string) => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/courses/${slug}`)}`);
      return;
    }

    try {
      setEnrollingSlug(slug);
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: slug }),
      });

      if (res.ok) {
        router.push(`/learn/${slug}/mod1-lesson1`);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to enroll');
      }
    } catch (err) {
      alert('Error connecting to server.');
    } finally {
      setEnrollingSlug(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] py-10 font-sans">
      <div className="max-w-[1584px] mx-auto px-4">
        {/* Header */}
        <div className="mb-10 bg-white border border-[#e0e0e0] p-8">
          <div className="inline-block bg-[#0f62fe] text-white text-xs px-2.5 py-1 font-semibold uppercase mb-3">
            Commercial Course Catalog
          </div>
          <h1 className="text-3xl lg:text-4xl font-light text-[#161616] tracking-tight">
            Explore Professional Learning Paths
          </h1>
          <p className="text-[#525252] text-base mt-2 max-w-3xl">
            Build production skills in AI, Web Engineering, Data Analytics, and Cybersecurity with verified certificates upon completion.
          </p>
        </div>

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-[#e0e0e0] h-96 animate-pulse p-6">
                <div className="h-6 bg-[#e0e0e0] w-2/3 mb-4"></div>
                <div className="h-4 bg-[#e0e0e0] w-full mb-2"></div>
                <div className="h-4 bg-[#e0e0e0] w-4/5 mb-8"></div>
                <div className="h-10 bg-[#e0e0e0] w-full mt-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.courseId}
                className="bg-white border border-[#e0e0e0] flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Top Tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold text-[#0f62fe] uppercase tracking-wider">
                      {course.category}
                    </span>
                    <span className="text-[11px] bg-[#e0e0e0] text-[#161616] px-2 py-0.5 font-medium">
                      {course.difficulty}
                    </span>
                  </div>

                  {/* Title */}
                  <Link
                    href={`/courses/${course.courseId}`}
                    className="block text-xl font-semibold text-[#161616] hover:text-[#0f62fe] transition-colors leading-snug mb-3"
                  >
                    {course.title}
                  </Link>

                  {/* Description */}
                  <p className="text-[#525252] text-sm line-clamp-3 mb-6 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Instructor & Stats */}
                  <div className="border-t border-[#e0e0e0] pt-4 mb-4 space-y-2 text-xs text-[#525252]">
                    <div className="flex justify-between">
                      <span>Instructor:</span>
                      <span className="font-semibold text-[#161616]">{course.instructor.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rating & Enrolled:</span>
                      <span className="font-medium text-[#161616]">
                        ★ {course.rating} ({course.studentsCount.toLocaleString()} learners)
                      </span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {course.skills?.slice(0, 4).map((skill) => (
                      <span key={skill} className="text-[11px] bg-[#f4f4f4] text-[#525252] border border-[#e0e0e0] px-2 py-0.5">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing & Footer Callout */}
                <div className="bg-[#f4f4f4] border-t border-[#e0e0e0] p-6 flex flex-col gap-4">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-[#161616]">
                        ₹{course.discountedPrice || 199}
                      </span>
                      <span className="text-xs text-[#8d8d8d] line-through">
                        ₹{course.originalPrice || 1999}
                      </span>
                    </div>
                    <span className="bg-[#198038] text-white text-xs font-bold px-2 py-0.5 uppercase tracking-wide">
                      {course.discountPercentage || 90}% OFF
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/courses/${course.courseId}`}
                      className="flex-1 text-center border border-[#161616] text-[#161616] py-2.5 text-xs font-medium hover:bg-[#161616] hover:text-white transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleEnroll(course.courseId)}
                      disabled={enrollingSlug === course.courseId}
                      className="flex-1 bg-[#0f62fe] text-white py-2.5 text-xs font-semibold hover:bg-[#0043ce] transition-colors disabled:opacity-50"
                    >
                      {enrollingSlug === course.courseId ? 'Enrolling...' : 'Enroll Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
