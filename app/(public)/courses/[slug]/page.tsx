'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MOCK_COURSES } from '@/lib/supabase/mock-data';
import { Clock, BookOpen, Award, CheckCircle, ChevronDown, ChevronUp, PlayCircle, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDuration } from '@/lib/utils';

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = MOCK_COURSES.find((c) => c.slug === params.slug) || MOCK_COURSES[0];
  const [openModule, setOpenModule] = useState<number | null>(0);

  const modules = [
    {
      title: 'Module 1: Foundations & Core Concepts',
      description: 'Introduction to foundational terminology, mathematical principles, and practical workspace setup.',
      lessons: [
        { title: '1.1 Platform Introduction & Environment Setup', type: 'video', duration: '15 mins' },
        { title: '1.2 Core Theoretical Principles & Architecture', type: 'text', duration: '20 mins' },
        { title: '1.3 Hands-on Workspace Lab & Code Practice', type: 'project', duration: '30 mins' },
        { title: '1.4 Module 1 Knowledge Check Quiz', type: 'quiz', duration: '15 mins' },
      ],
    },
    {
      title: 'Module 2: Intermediate Implementation & Modeling',
      description: 'Deep dive into practical algorithms, API pipelines, and domain modeling execution.',
      lessons: [
        { title: '2.1 Algorithm Implementation & Data Flow', type: 'video', duration: '25 mins' },
        { title: '2.2 Advanced Configuration & Error Handling', type: 'text', duration: '20 mins' },
        { title: '2.3 Domain Practical Activity: Guided Exercise', type: 'project', duration: '40 mins' },
      ],
    },
    {
      title: 'Module 3: Production Deployment & Final Assessment',
      description: 'Preparing your practical project for evaluation and completing the official credential assessment.',
      lessons: [
        { title: '3.1 Best Practices & Performance Optimization', type: 'video', duration: '20 mins' },
        { title: '3.2 Capstone Project Submission', type: 'project', duration: '60 mins' },
        { title: '3.3 Authoritative Final Assessment', type: 'quiz', duration: '35 mins' },
      ],
    },
  ];

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* Course Hero Banner Header */}
      <div className="bg-slate-900 text-white py-14 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Link href="/courses" className="hover:text-white">Courses</Link>
            <span>/</span>
            <span className="text-blue-400">{course.category_name}</span>
            <span>/</span>
            <span className="text-slate-300 truncate max-w-xs">{course.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                {course.category_name}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {course.title}
              </h1>
              <p className="text-base text-slate-300 leading-relaxed">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>{formatDuration(course.duration_minutes)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span>{course.lesson_count} Lessons</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant="intermediate">{course.difficulty}</Badge>
                </div>
                {course.credential_available && (
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <Award className="w-4 h-4" />
                    <span>Includes Skyrellac Credential</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Box */}
            <div className="glass-card p-6 rounded-2xl border border-slate-700 bg-slate-800/90 text-white space-y-5 shadow-soft-xl">
              <div className="space-y-1">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Course Enrollment Fee</span>
                <p className="text-3xl font-black text-white">₹{course.price_inr ?? 200}</p>
              </div>

              <Link href={`/signup?redirect=${encodeURIComponent(`/courses/${course.slug}`)}`}>
                <Button variant="glow" size="lg" className="w-full text-center font-bold">
                  <span>Enroll Now & Start</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <div className="pt-3 border-t border-slate-700 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Self-paced learning modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Verified digital certificate upon completion</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Direct link to internship application eligibility</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Course Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Learning Objectives & Modules */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* What you'll learn */}
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">What You&apos;ll Learn</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span>Master fundamental concepts and domain architecture.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span>Write production-grade code and build clean project pipelines.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span>Pass official timed assessments evaluated on server systems.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span>Earn digital credentials to attach to internship applications.</span>
              </div>
            </div>
          </div>

          {/* Course Syllabus Accordion */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Course Syllabus</h2>
            <div className="space-y-3">
              {modules.map((mod, idx) => {
                const isOpen = openModule === idx;
                return (
                  <div key={idx} className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-soft-sm">
                    <button
                      onClick={() => setOpenModule(isOpen ? null : idx)}
                      className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-900">{mod.title}</h3>
                        <p className="text-xs text-slate-500">{mod.description}</p>
                      </div>
                      {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-2">
                        {mod.lessons.map((lesson, lIdx) => (
                          <div key={lIdx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 transition-colors text-xs">
                            <div className="flex items-center gap-3 font-medium text-slate-800">
                              {lesson.type === 'video' && <PlayCircle className="w-4 h-4 text-blue-600" />}
                              {lesson.type === 'text' && <FileText className="w-4 h-4 text-indigo-600" />}
                              {lesson.type === 'quiz' && <Award className="w-4 h-4 text-emerald-600" />}
                              {lesson.type === 'project' && <BookOpen className="w-4 h-4 text-amber-600" />}
                              <span>{lesson.title}</span>
                            </div>
                            <span className="text-slate-400 font-mono">{lesson.duration}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Skills & Credential Info */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-soft-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Skills You&apos;ll Gain</h3>
            <div className="flex flex-wrap gap-2">
              {course.skills?.map((skill, idx) => (
                <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-200 font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Verified Credential</h4>
                <span className="text-xs text-indigo-700 font-medium">Included upon completion</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Earn a verifiable digital certificate backed by Skyrellac. Credential IDs can be verified publicly by recruiters and universities.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
