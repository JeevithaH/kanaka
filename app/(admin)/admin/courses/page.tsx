'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Plus, Edit, Trash2, Shield, Search, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CourseData {
  _id: string;
  courseId: string;
  title: string;
  category: string;
  originalPrice: number;
  studentsCount: number;
  isPublished: boolean;
  lessonCount: number;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/admin/courses');
      const data = await res.json();
      if (data.courses) setCourses(data.courses);
    } catch (err) {
      console.error('Failed to load admin courses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course from the database?')) return;
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, { method: 'DELETE' });
      if (res.ok) {
        setCourses((prev) => prev.filter((c) => c.courseId !== courseId && c._id !== courseId));
      }
    } catch {
      alert('Failed to delete course');
    }
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.courseId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-soft-sm">
        <div>
          <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Course CMS Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Global Learning Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Add unlimited courses, configure pricing, manage modules/lessons, and set certification requirements without code changes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-purple-600"
            />
          </div>

          <Link href="/admin/courses/new">
            <Button variant="glow" size="md" className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Add New Course</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Courses List Table */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          Loading course catalog from database...
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200 space-y-3">
          <p>No courses found in database.</p>
          <Link href="/admin/courses/new">
            <Button variant="glow" size="sm">Create First Course</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-soft-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase font-bold text-slate-500 text-[10px]">
                <tr>
                  <th className="p-4">Course Info</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Configured Price</th>
                  <th className="p-4">Enrolled Students</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredCourses.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 space-y-0.5">
                      <p className="font-bold text-slate-900">{c.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Slug: {c.courseId} • {c.lessonCount || 12} Lessons</p>
                    </td>
                    <td className="p-4 font-semibold text-purple-700">{c.category}</td>
                    <td className="p-4 font-bold text-slate-900">₹{c.originalPrice || 1999}</td>
                    <td className="p-4 text-slate-600 font-bold">{c.studentsCount || 0}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${c.isPublished ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {c.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <Link href={`/courses`}>
                        <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDeleteCourse(c.courseId)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
