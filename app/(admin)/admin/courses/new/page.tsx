'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Save, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminNewCoursePage() {
  const router = useRouter();
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Artificial Intelligence');
  const [difficulty, setDifficulty] = useState<'Foundational' | 'Intermediate' | 'Advanced'>('Foundational');
  const [originalPrice, setOriginalPrice] = useState<number>(1999);
  const [durationMinutes, setDurationMinutes] = useState<number>(240);
  const [instructorName, setInstructorName] = useState('Skyrellac Expert');
  const [instructorTitle, setInstructorTitle] = useState('Senior Tech Lead');

  // Modules & lessons
  const [modules, setModules] = useState([
    {
      id: 'mod-1',
      title: 'Module 1: Foundations & Architecture',
      description: 'Core concepts and foundational principles.',
      lessons: [
        {
          id: 'mod1-lesson1',
          title: 'Introduction & Environment Setup',
          duration: '15 mins',
          contentType: 'video',
          contentText: 'Welcome to the course. Follow the steps below to setup your development environment.',
        },
      ],
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddModule = () => {
    const modNum = modules.length + 1;
    setModules([
      ...modules,
      {
        id: `mod-${modNum}`,
        title: `Module ${modNum}: Advanced Topics`,
        description: 'Deep dive topics.',
        lessons: [
          {
            id: `mod${modNum}-lesson1`,
            title: 'Core Concepts Lecture',
            duration: '20 mins',
            contentType: 'video',
            contentText: 'Lesson content notes.',
          },
        ],
      },
    ]);
  };

  const handleAddLesson = (modIndex: number) => {
    const updated = [...modules];
    const lessonNum = updated[modIndex].lessons.length + 1;
    updated[modIndex].lessons.push({
      id: `mod${modIndex + 1}-lesson${lessonNum}`,
      title: `Lesson ${lessonNum}: Core Practical Topic`,
      duration: '15 mins',
      contentType: 'video',
      contentText: 'Detailed practical notes.',
    });
    setModules(updated);
  };

  const handleRemoveLesson = (modIndex: number, lessonIndex: number) => {
    const updated = [...modules];
    updated[modIndex].lessons.splice(lessonIndex, 1);
    setModules(updated);
  };

  const handleSubmitCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !courseId || !description) {
      alert('Please fill out course title, slug, and description.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: courseId.toLowerCase().trim().replace(/\s+/g, '-'),
          title,
          description,
          category,
          difficulty,
          originalPrice,
          durationMinutes,
          instructor: { name: instructorName, title: instructorTitle },
          modules,
          certificateEligible: true,
          isPublished: true,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Course created and published successfully!');
        router.push('/admin/courses');
      } else {
        alert(data.error || 'Failed to create course');
      }
    } catch {
      alert('Network error while creating course');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl shadow-soft-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin/courses">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Back</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Add New Course to Platform</h1>
            <p className="text-xs text-slate-500">Configurable price, dynamic modules, and lessons saved directly to MongoDB.</p>
          </div>
        </div>

        <Button
          onClick={handleSubmitCourse}
          disabled={isSubmitting}
          variant="glow"
          size="md"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
        >
          <Save className="w-4 h-4 mr-1.5" />
          <span>{isSubmitting ? 'Saving Course...' : 'Publish Course'}</span>
        </Button>
      </div>

      {/* Form Details */}
      <form onSubmit={handleSubmitCourse} className="space-y-8">
        {/* Core Metadata */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-soft-sm">
          <h2 className="text-sm font-bold uppercase text-slate-900 tracking-wider">1. Course Metadata</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Course Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!courseId) setCourseId(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }}
                placeholder="e.g. Generative AI Engineering"
                required
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-purple-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Course Slug / ID</label>
              <input
                type="text"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                placeholder="e.g. generative-ai-engineering"
                required
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-purple-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Configurable Base Price (INR ₹)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                placeholder="1999"
                required
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-purple-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Artificial Intelligence"
                required
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Course Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of what students will learn..."
              rows={4}
              required
              className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:border-purple-600"
            />
          </div>
        </div>

        {/* Modules & Lessons Builder */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-6 shadow-soft-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase text-slate-900 tracking-wider">2. Modules & Lessons Builder</h2>
            <Button type="button" onClick={handleAddModule} variant="secondary" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              <span>Add Module</span>
            </Button>
          </div>

          <div className="space-y-6">
            {modules.map((mod, modIdx) => (
              <div key={mod.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={mod.title}
                    onChange={(e) => {
                      const updated = [...modules];
                      updated[modIdx].title = e.target.value;
                      setModules(updated);
                    }}
                    className="font-bold text-slate-900 text-sm bg-white border border-slate-300 rounded-lg px-3 py-1.5 w-full max-w-md focus:outline-none focus:border-purple-600"
                  />
                  <Button type="button" onClick={() => handleAddLesson(modIdx)} variant="glow" size="sm" className="bg-purple-600 text-white">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    <span>Add Lesson</span>
                  </Button>
                </div>

                <div className="space-y-2">
                  {mod.lessons.map((lesson, lessonIdx) => (
                    <div key={lesson.id} className="bg-white p-3 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) => {
                            const updated = [...modules];
                            updated[modIdx].lessons[lessonIdx].title = e.target.value;
                            setModules(updated);
                          }}
                          placeholder="Lesson Title"
                          className="border border-slate-200 rounded-lg px-2 py-1 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={lesson.duration}
                          onChange={(e) => {
                            const updated = [...modules];
                            updated[modIdx].lessons[lessonIdx].duration = e.target.value;
                            setModules(updated);
                          }}
                          placeholder="Duration (e.g. 15 mins)"
                          className="border border-slate-200 rounded-lg px-2 py-1 focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveLesson(modIdx, lessonIdx)}
                        className="text-rose-600 hover:bg-rose-50 p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} variant="glow" size="lg" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold">
          <span>{isSubmitting ? 'Publishing Course...' : 'Save & Publish Course'}</span>
        </Button>
      </form>
    </div>
  );
}
