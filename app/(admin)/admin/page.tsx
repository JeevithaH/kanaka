import React from 'react';
import Link from 'next/link';
import { Users, BookOpen, FileCheck, Briefcase, Award, TrendingUp, Plus, Shield, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MOCK_COURSES, MOCK_INTERNSHIPS } from '@/lib/supabase/mock-data';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-purple-200 shadow-soft-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Skyrellac Executive Admin Console
            </h1>
          </div>
          <p className="text-sm text-slate-600">
            Manage global learning content, assessments, credentials, and internship applications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/courses/new">
            <Button variant="glow" size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4" />
              <span>Create Course</span>
            </Button>
          </Link>
          <Link href="/admin/internships/new">
            <Button variant="secondary" size="sm">
              <Plus className="w-4 h-4" />
              <span>Post Internship</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Database Platform Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Registered Students</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">1,248</p>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +18% this month
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Published Courses</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{MOCK_COURSES.length}</p>
          <span className="text-xs text-blue-600 font-semibold">100% Published & Ready</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Internship Applications</span>
            <Briefcase className="w-4 h-4 text-cyan-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">342</p>
          <span className="text-xs text-cyan-600 font-semibold">12 Pending Review</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Credentials Issued</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">890</p>
          <span className="text-xs text-emerald-600 font-semibold">100% Verified</span>
        </div>
      </div>

      {/* Admin Content Management Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Managed Courses List */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Managed Courses (CMS)</h2>
            <Link href="/admin/courses" className="text-xs text-purple-600 font-bold hover:underline">
              Manage All
            </Link>
          </div>

          <div className="space-y-3">
            {MOCK_COURSES.slice(0, 3).map((course) => (
              <div key={course.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">{course.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>Level: {course.difficulty}</span>
                    <span>•</span>
                    <span>{course.lesson_count} Lessons</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  Published
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Managed Internships */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Active Internships</h2>
            <Link href="/admin/internships" className="text-xs text-purple-600 font-bold hover:underline">
              Manage All
            </Link>
          </div>

          <div className="space-y-3">
            {MOCK_INTERNSHIPS.slice(0, 3).map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500">{item.organization_name} • {item.mode}</p>
                </div>
                <Link href={`/admin/applications?internship=${item.id}`} className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1">
                  <span>Review Applications</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
