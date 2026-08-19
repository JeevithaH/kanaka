import React from 'react';
import Link from 'next/link';
import { MOCK_COURSES, MOCK_INTERNSHIPS, MOCK_CREDENTIALS } from '@/lib/supabase/mock-data';
import { BookOpen, Award, FileCheck, Briefcase, PlayCircle, ArrowRight, CheckCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function StudentDashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-soft-sm">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, Alex 👋
          </h1>
          <p className="text-sm text-slate-600">
            You have completed <strong className="text-blue-600 font-bold">72%</strong> of your active AI course. Keep going!
          </p>
        </div>
        <Link href="/courses">
          <Button variant="glow" size="sm">
            <BookOpen className="w-4 h-4" />
            <span>Continue Learning</span>
          </Button>
        </Link>
      </div>

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Enrolled Courses</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">3</p>
          <span className="text-xs text-emerald-600 font-semibold">1 In Progress • 2 Completed</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Credentials Earned</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">2</p>
          <span className="text-xs text-emerald-600 font-semibold">Verified Digital Badges</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Assessments Taken</span>
            <FileCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">4</p>
          <span className="text-xs text-blue-600 font-semibold">Avg. Score: 88%</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Applications</span>
            <Briefcase className="w-4 h-4 text-cyan-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">1</p>
          <span className="text-xs text-cyan-600 font-semibold">1 Application Under Review</span>
        </div>
      </div>

      {/* Main Grid: Continue Learning + Upcoming Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Continue Learning Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Continue Learning</h2>
            <Link href="/courses" className="text-xs font-bold text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          {/* Active Learning Progress Card */}
          <div className="p-6 rounded-2xl bg-white border-2 border-blue-600/30 shadow-soft-md space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {MOCK_COURSES[0].category_name}
                </span>
                <h3 className="text-xl font-bold text-slate-900 pt-1">
                  {MOCK_COURSES[0].title}
                </h3>
              </div>
              <span className="text-sm font-bold text-blue-600">72%</span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full w-[72%]" />
              </div>
              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>9 of 12 lessons completed</span>
                <span>Last accessed: Today</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">Next: Lesson 10 — Neural Network Optimization</span>
              <Link href={`/learn/${MOCK_COURSES[0].slug}/lesson-10`}>
                <Button variant="glow" size="sm">
                  <PlayCircle className="w-4 h-4" />
                  <span>Resume Lesson</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Internship Opportunities Preview */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Recommended Internships for Your Skill Profile</h2>
              <Link href="/internships" className="text-xs font-bold text-emerald-600 hover:underline">
                Explore All Opportunities
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_INTERNSHIPS.slice(0, 2).map((item) => (
                <div key={item.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {item.mode}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{item.duration_weeks} weeks</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 truncate">{item.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">{item.organization_name}</p>
                  <Link href={`/internships/${item.slug}`} className="block pt-2">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      View Details & Apply
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar Column (Assessments & Achievements) */}
        <div className="space-y-6">
          
          {/* Upcoming Assessments */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Upcoming Assessments</h3>
            
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600">AI Knowledge Audit</span>
                <span className="text-xs text-slate-400">30 mins</span>
              </div>
              <p className="text-xs text-slate-600">20 questions • Passing score: 70%</p>
              <Link href="/dashboard/tests/ai-audit" className="block">
                <Button variant="glow" size="sm" className="w-full text-xs">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Start Assessment</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Recent Achievements / Credentials */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Recent Achievements</h3>
            
            <div className="space-y-3">
              {MOCK_CREDENTIALS.map((cred) => (
                <div key={cred.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 truncate max-w-[140px]">{cred.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{cred.credential_id}</span>
                    </div>
                  </div>
                  <Link href="/credentials" className="text-xs font-bold text-blue-600 hover:underline">
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
