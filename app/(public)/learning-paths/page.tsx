import React from 'react';
import Link from 'next/link';
import { MOCK_LEARNING_PATHS } from '@/lib/supabase/mock-data';
import { Compass, Clock, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LearningPathsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-white min-h-screen">
      
      {/* Page Title */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-200">
          Structured Curricula
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Learning Paths
        </h1>
        <p className="text-base text-slate-600 max-w-2xl font-normal">
          Follow curated multi-course journeys designed to take you from foundational concepts to verified professional mastery.
        </p>
      </div>

      {/* Learning Paths List */}
      <div className="space-y-6">
        {MOCK_LEARNING_PATHS.map((path) => (
          <div key={path.id} className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 border border-slate-200 bg-white shadow-soft-sm hover:shadow-soft-xl transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {path.title}
                  </h2>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed pt-1">
                  {path.description}
                </p>
              </div>

              <div className="flex items-center gap-6 text-xs text-slate-500 font-semibold border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Est. {path.estimated_hours} Hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>{path.courses?.length || 0} Included Courses</span>
                </div>
                <Link href={`/learning-paths/${path.slug}`}>
                  <Button variant="glow" size="sm" className="shadow-soft-sm">
                    <span>Start Path</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Included Courses Preview Row */}
            {path.courses && path.courses.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Courses Included in this Path:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {path.courses.map((course, idx) => (
                    <div key={course.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black flex items-center justify-center border border-indigo-200">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-bold text-slate-900 truncate max-w-xs">{course.title}</span>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">{course.difficulty}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
}
