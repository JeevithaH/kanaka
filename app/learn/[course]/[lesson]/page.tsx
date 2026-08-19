'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, CheckCircle2, Circle, PlayCircle, FileText, ArrowLeft, ArrowRight, Download, Menu, X, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MOCK_COURSES } from '@/lib/supabase/mock-data';

export default function LearningPlayerPage({ params }: { params: { course: string; lesson: string } }) {
  const course = MOCK_COURSES.find((c) => c.slug === params.course) || MOCK_COURSES[0];
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'notes'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<number[]>([1, 2]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(2); // 0-indexed lesson 3

  const lessonList = [
    { id: 1, title: '1. Course Overview & Setup', duration: '12m', completed: true },
    { id: 2, title: '2. Core Principles & Architecture', duration: '18m', completed: true },
    { id: 3, title: '3. Hands-on Interactive Practice', duration: '25m', active: true },
    { id: 4, title: '4. Module 1 Knowledge Quiz', duration: '15m' },
    { id: 5, title: '5. Intermediate Algorithms', duration: '30m' },
    { id: 6, title: '6. Final Credential Assessment', duration: '40m' },
  ];

  const toggleComplete = (id: number) => {
    if (completedLessons.includes(id)) {
      setCompletedLessons(completedLessons.filter((l) => l !== id));
    } else {
      setCompletedLessons([...completedLessons, id]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      
      {/* Top Learning Header Bar */}
      <header className="h-16 bg-slate-950 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black">S</div>
            <span className="text-sm font-bold text-white hidden sm:inline">{course.title}</span>
          </div>
        </div>

        {/* Progress Bar Indicator */}
        <div className="hidden md:flex items-center gap-3 text-xs text-slate-400">
          <span>Course Progress: 72%</span>
          <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[72%]" />
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-2 text-xs font-semibold"
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span className="hidden sm:inline">Course Content</span>
        </button>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Main Lesson Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-slate-900">
          
          {/* Simulated Video Frame Player Container */}
          <div className="w-full bg-black aspect-video max-h-[520px] flex items-center justify-center relative border-b border-slate-800">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center mx-auto shadow-glow-primary cursor-pointer hover:scale-105 transition-transform">
                <PlayCircle className="w-10 h-10" />
              </div>
              <p className="text-sm font-semibold text-slate-300">Video Lesson Preview Stream</p>
              <span className="text-xs text-slate-500 font-mono">1080p HD • Interactive Player</span>
            </div>
          </div>

          {/* Lesson Metadata & Control Bar */}
          <div className="p-6 lg:p-8 space-y-6 max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                  Lesson {currentLessonIndex + 1}
                </span>
                <h1 className="text-2xl font-bold text-white pt-2">
                  {lessonList[currentLessonIndex]?.title}
                </h1>
              </div>

              <button
                onClick={() => toggleComplete(lessonList[currentLessonIndex].id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  completedLessons.includes(lessonList[currentLessonIndex].id)
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-blue-600 text-white hover:bg-blue-500'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {completedLessons.includes(lessonList[currentLessonIndex].id)
                    ? 'Completed ✓'
                    : 'Mark as Complete'}
                </span>
              </button>
            </div>

            {/* Tab Controls */}
            <div className="flex items-center gap-4 border-b border-slate-800 text-sm font-semibold">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'overview' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Lesson Overview
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'resources' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Resources & Downloads
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                <p>
                  In this lesson, we build real-world skills by applying core architecture patterns directly inside hands-on code examples.
                </p>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Key Objectives:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                    <li>Understand data structures and practical algorithms.</li>
                    <li>Analyze error telemetry and performance benchmarks.</li>
                    <li>Prepare for official Skyrellac credential evaluation.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    <div>
                      <p className="font-bold text-white">Lesson Handout Guide (PDF)</p>
                      <span className="text-slate-500">2.4 MB</span>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Footer Pagination Controls */}
            <div className="pt-8 border-t border-slate-800 flex items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentLessonIndex === 0}
                onClick={() => setCurrentLessonIndex(Math.max(0, currentLessonIndex - 1))}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Lesson</span>
              </Button>

              <Button
                variant="glow"
                size="sm"
                disabled={currentLessonIndex === lessonList.length - 1}
                onClick={() => setCurrentLessonIndex(Math.min(lessonList.length - 1, currentLessonIndex + 1))}
              >
                <span>Next Lesson</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

          </div>

        </div>

        {/* Collapsible Course Content Sidebar */}
        {sidebarOpen && (
          <aside className="w-full lg:w-80 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col p-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">Course Modules</h3>

            <div className="space-y-1 overflow-y-auto">
              {lessonList.map((item, idx) => {
                const isCompleted = completedLessons.includes(item.id);
                const isActive = currentLessonIndex === idx;

                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentLessonIndex(idx)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold text-left transition-all ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isActive ? (
                        <ArrowRight className="w-4 h-4 text-blue-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                      <span className="truncate max-w-[180px]">{item.title}</span>
                    </div>
                    <span className="text-slate-500 font-mono">{item.duration}</span>
                  </button>
                );
              })}
            </div>
          </aside>
        )}

      </div>

    </div>
  );
}
