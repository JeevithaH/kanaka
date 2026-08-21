'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, Compass } from 'lucide-react';

interface CourseItem {
  _id: string;
  courseId: string;
  title: string;
  category: string;
  difficulty: string;
}

const PATH_DETAILS = [
  { id: 'path-ai', title: 'AI & Machine Learning', label: 'BUILD INTELLIGENT SYSTEMS', description: 'Move from AI foundations to practical machine learning projects and responsible deployment.', hours: 45, tone: 'bg-[#e4d9cf]' },
  { id: 'path-web', title: 'Full-Stack Development', label: 'CREATE DIGITAL PRODUCTS', description: 'Develop the frontend, backend, and deployment skills needed to build complete web experiences.', hours: 50, tone: 'bg-[#d9dcda]' },
  { id: 'path-data', title: 'Data & Analytics', label: 'TURN DATA INTO DECISIONS', description: 'Learn how to clean data, surface insights, and communicate them through clear analysis.', hours: 35, tone: 'bg-[#e8e0d8]' },
];

export default function LearningPathsPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const response = await fetch('/api/courses');
        const data = await response.json();
        setCourses(data.courses ?? []);
      } catch (error) {
        console.error('Failed to fetch courses for learning paths:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadCourses();
  }, []);

  const getCoursesForPath = (id: string) => {
    const terms = id === 'path-ai' ? ['ai', 'intelligence', 'machine'] : id === 'path-web' ? ['web', 'software', 'development'] : ['data', 'analytics', 'sql'];
    const matched = courses.filter((course) => terms.some((term) => course.category.toLowerCase().includes(term) || course.title.toLowerCase().includes(term)));
    return (matched.length ? matched : courses).slice(0, 3);
  };

  return (
    <main className="min-h-screen bg-[#f3f0ed]">
      <section className="bg-[#312a25] text-white border-b border-[#4d433c]">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-14 lg:py-20 grid lg:grid-cols-[1fr_.55fr] gap-10 items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-[#d9c8bb]">GUIDED LEARNING PATHS</p>
            <h1 className="mt-5 text-4xl lg:text-6xl leading-[1] tracking-[-0.04em] font-semibold">A clearer route from curiosity to capability.</h1>
          </div>
          <p className="text-[#ddd6d0] leading-7">Follow a sequence designed around a real career direction. Each path pairs selected courses with a practical next step.</p>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div><p className="text-xs font-semibold tracking-[0.14em] text-[#5f4938]">CHOOSE A DIRECTION</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-[#161616]">Three ways to start building momentum</h2></div>
          <Link href="/courses" className="text-sm font-semibold text-[#80664f] hover:underline">Browse all courses →</Link>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-5">{PATH_DETAILS.map((path) => <div key={path.id} className="h-[460px] border border-[#c8c8c8] bg-white animate-pulse" />)}</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {PATH_DETAILS.map((path) => {
              const pathCourses = getCoursesForPath(path.id);
              return (
                <article key={path.id} className="flex flex-col border border-[#c8c8c8] bg-white hover:border-[#80664f] hover:shadow-lg transition-all">
                  <div className={`${path.tone} p-6 min-h-[180px] flex flex-col justify-between`}>
                    <Compass className="w-7 h-7 text-[#5f4938]" strokeWidth={1.5} />
                    <div><p className="text-[11px] font-semibold tracking-[0.13em] text-[#5f4938]">{path.label}</p><h2 className="mt-2 text-2xl leading-7 font-semibold text-[#161616]">{path.title}</h2></div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-sm leading-6 text-[#525252]">{path.description}</p>
                    <div className="mt-5 flex gap-4 text-xs text-[#525252]"><span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#80664f]" />{path.hours} hours</span><span className="inline-flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-[#80664f]" />{pathCourses.length} courses</span></div>
                    <ol className="mt-6 border-t border-[#e0e0e0]">
                      {pathCourses.length ? pathCourses.map((course, index) => <li key={course._id} className="py-3 border-b border-[#e0e0e0] grid grid-cols-[24px_1fr] gap-3"><span className="text-xs font-semibold text-[#80664f]">0{index + 1}</span><span className="text-sm text-[#393939] line-clamp-1">{course.title}</span></li>) : <li className="py-4 text-sm text-[#6f6f6f]">Courses will be added to this path soon.</li>}
                    </ol>
                    <Link href="/courses" className="mt-auto pt-6 inline-flex justify-between items-center text-sm font-semibold text-[#80664f] hover:text-[#5f4938]">Explore this path <ArrowRight className="w-4 h-4" /></Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-8 bg-white border-l-4 border-[#80664f] border-y border-r border-[#c8c8c8] px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm leading-6 text-[#393939]"><span className="font-semibold">Every course is ₹1,999.</span> Choose a path for direction, then enroll in the individual courses that suit your goals.</p>
          <Link href="/pricing" className="shrink-0 text-sm font-semibold text-[#80664f] hover:underline">View pricing →</Link>
        </div>
      </section>
    </main>
  );
}
