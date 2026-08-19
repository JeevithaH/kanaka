'use client';

import React from 'react';
import Link from 'next/link';

const ENROLLED_COURSES = [
  { title: 'Artificial Intelligence Fundamentals', progress: 72, category: 'AI', slug: 'ai-fundamentals' },
  { title: 'Full-Stack Modern Web Engineering', progress: 100, category: 'Web Dev', slug: 'full-stack-web-engineering' },
  { title: 'Applied Data Science & SQL Analytics', progress: 35, category: 'Data', slug: 'data-science-sql-analytics' },
];

export default function StudentDashboardPage() {
  const totalCourses = ENROLLED_COURSES.length;
  const completedCourses = ENROLLED_COURSES.filter(c => c.progress === 100).length;
  const inProgressCourses = totalCourses - completedCourses;

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 lg:p-8">

      {/* Welcome */}
      <div>
        <h1 className="text-[#161616] font-light text-[2rem] leading-tight">Dashboard</h1>
        <p className="text-[#525252] text-sm mt-1">Welcome back. Here is your learning overview.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#e0e0e0] p-6">
          <p className="text-xs text-[#525252] uppercase tracking-wider font-medium mb-2">Enrolled</p>
          <p className="text-3xl font-light text-[#161616]">{totalCourses}</p>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-6">
          <p className="text-xs text-[#525252] uppercase tracking-wider font-medium mb-2">In Progress</p>
          <p className="text-3xl font-light text-[#0f62fe]">{inProgressCourses}</p>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-6">
          <p className="text-xs text-[#525252] uppercase tracking-wider font-medium mb-2">Completed</p>
          <p className="text-3xl font-light text-[#198038]">{completedCourses}</p>
        </div>
      </div>

      {/* My Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#161616] font-semibold text-lg">My Courses</h2>
          <Link href="/courses" className="text-[#0f62fe] text-sm hover:underline">Browse all courses</Link>
        </div>

        <div className="space-y-0 border border-[#e0e0e0] bg-white">
          {ENROLLED_COURSES.map((course, idx) => (
            <div
              key={course.slug}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 ${idx !== ENROLLED_COURSES.length - 1 ? 'border-b border-[#e0e0e0]' : ''}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-[#0f62fe] font-medium">{course.category}</span>
                  {course.progress === 100 && (
                    <span className="text-xs bg-[#defbe6] text-[#198038] px-2 py-0.5 font-medium">Completed</span>
                  )}
                </div>
                <Link href={`/learn/${course.slug}/lesson-1`} className="text-sm font-semibold text-[#161616] hover:text-[#0f62fe] hover:underline">
                  {course.title}
                </Link>
              </div>

              <div className="flex items-center gap-4 sm:w-64">
                <div className="flex-1">
                  <div className="w-full bg-[#e0e0e0] h-1.5">
                    <div
                      className={`h-full ${course.progress === 100 ? 'bg-[#198038]' : 'bg-[#0f62fe]'}`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-[#525252] font-medium w-8 text-right">{course.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/pricing" className="bg-white border border-[#e0e0e0] p-5 hover:bg-[#f4f4f4] transition-colors group">
          <h3 className="text-sm font-semibold text-[#161616] group-hover:text-[#0f62fe] mb-1">Upgrade to Premium</h3>
          <p className="text-xs text-[#525252]">Get access to 500+ premium courses, certifications, and labs.</p>
        </Link>
        <Link href="/courses" className="bg-white border border-[#e0e0e0] p-5 hover:bg-[#f4f4f4] transition-colors group">
          <h3 className="text-sm font-semibold text-[#161616] group-hover:text-[#0f62fe] mb-1">Explore Courses</h3>
          <p className="text-xs text-[#525252]">Browse our catalog of AI, Cloud, Data, and Cybersecurity courses.</p>
        </Link>
      </div>

    </div>
  );
}
