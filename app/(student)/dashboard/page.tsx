'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';

interface EnrollmentData {
  _id: string;
  courseId: string;
  courseTitle: string;
  category: string;
  progressPercentage: number;
  status: string;
  certificateStatus: {
    eligible: boolean;
    issued: boolean;
    certificateId?: string;
  };
}

interface TaskData {
  _id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'completed';
}

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentData[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'Weekly' | 'Monthly'>('Monthly');

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [enrollRes, taskRes] = await Promise.all([
          fetch('/api/enrollments'),
          fetch('/api/tasks'),
        ]);

        const enrollData = await enrollRes.json();
        const taskData = await taskRes.json();

        if (enrollData.enrollments) setEnrollments(enrollData.enrollments);
        if (taskData.tasks) setTasks(taskData.tasks);
      } catch (err) {
        console.error('Error fetching student dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const toggleTask = async (taskId: string) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });
      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t))
        );
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const completedCount = enrollments.filter((e) => e.progressPercentage === 100).length;
  const inProgressCount = enrollments.length - completedCount;

  // Calculate average overall progress percentage across all courses
  const avgProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((acc, curr) => acc + curr.progressPercentage, 0) / enrollments.length)
    : 45; // default benchmark for display visual

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 lg:p-8 font-sans">
      {/* Welcome Header */}
      <div className="bg-white border border-[#e0e0e0] p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#0f62fe] font-semibold">Student Portal & Analytics</span>
          <h1 className="text-[#161616] font-light text-3xl lg:text-4xl mt-1">
            Welcome back, {user?.name || 'Learner'}
          </h1>
          <p className="text-[#525252] text-sm mt-1">
            Track your real-time learning statistics, course mastery, and verified certificates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/courses"
            className="bg-[#0f62fe] text-white text-xs px-4 py-3 font-semibold rounded-xl hover:bg-[#0043ce] transition-colors"
          >
            + Explore New Courses
          </Link>
        </div>
      </div>

      {/* Overview Metric Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#e0e0e0] p-6 rounded-2xl">
          <p className="text-xs text-[#525252] uppercase tracking-wider font-semibold mb-1">Total Enrolled Courses</p>
          <p className="text-3xl font-light text-[#161616]">{enrollments.length}</p>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-6 rounded-2xl">
          <p className="text-xs text-[#525252] uppercase tracking-wider font-semibold mb-1">Active Learning Paths</p>
          <p className="text-3xl font-light text-[#0f62fe]">{inProgressCount}</p>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-6 rounded-2xl">
          <p className="text-xs text-[#525252] uppercase tracking-wider font-semibold mb-1">Certificates Earned</p>
          <p className="text-3xl font-light text-[#198038]">{completedCount}</p>
        </div>
      </div>

      {/* VISUAL DASHBOARD GRAPH CARDS SECTION */}
      <div className="space-y-4">
        <h2 className="text-[#161616] font-semibold text-xl">Learning Analytics & Skill Forecast</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* TOP LEFT CARD: Dark Study Statistics Bar Chart */}
          <div className="bg-[#161616] text-white p-6 lg:p-8 rounded-3xl flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold tracking-tight text-white">Study statistics</h3>
                <button
                  onClick={() => setTimeframe(timeframe === 'Monthly' ? 'Weekly' : 'Monthly')}
                  className="bg-[#262626] border border-[#393939] text-[#c6c6c6] text-xs px-3 py-1.5 rounded-full hover:text-white transition-colors"
                >
                  {timeframe} ▾
                </button>
              </div>
              <p className="text-xs text-[#8d8d8d] mb-6">Updated 1 hour ago</p>

              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-4xl font-semibold text-white">2,025</span>
                <span className="text-xs bg-[#22c55e]/20 text-[#42be65] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  ✓ mins completed (+18.4%)
                </span>
              </div>
            </div>

            {/* Stacked Bar Chart Graphic */}
            <div className="pt-4 flex items-end justify-between gap-4 h-48 border-t border-[#393939]/50">
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-[#262626] rounded-2xl h-24 relative overflow-hidden flex flex-col justify-end">
                  <div className="bg-[#a78bfa] h-[40%] rounded-b-xl w-full"></div>
                </div>
                <span className="text-[11px] text-[#8d8d8d]">Jul</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-[#262626] rounded-2xl h-32 relative overflow-hidden flex flex-col justify-end">
                  <div className="bg-[#a78bfa] h-[35%] w-full"></div>
                  <div className="bg-[#86efac] h-[45%] rounded-t-xl w-full"></div>
                </div>
                <span className="text-[11px] text-[#8d8d8d]">Aug</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-[#262626] rounded-2xl h-36 relative overflow-hidden flex flex-col justify-end">
                  <div className="bg-[#a78bfa] h-[40%] rounded-b-xl w-full"></div>
                  <div className="bg-[#86efac] h-[55%] rounded-t-xl w-full"></div>
                </div>
                <span className="text-[11px] font-bold text-white">Sep</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-[#262626] rounded-2xl h-28 relative overflow-hidden flex flex-col justify-end">
                  <div className="bg-[#a78bfa] h-[30%] w-full"></div>
                </div>
                <span className="text-[11px] text-[#8d8d8d]">Oct</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-[#262626] rounded-2xl h-44 relative overflow-hidden flex flex-col justify-end">
                  <div className="bg-[#a78bfa] h-[35%] rounded-b-xl w-full"></div>
                  <div className="bg-[#86efac] h-[60%] rounded-t-xl w-full"></div>
                </div>
                <span className="text-[11px] font-bold text-white">Nov</span>
              </div>
            </div>
          </div>

          {/* TOP RIGHT CARD: Recent Study Sessions & Recent Badges */}
          <div className="bg-[#f0f4f8] text-[#161616] p-6 lg:p-8 rounded-3xl flex flex-col justify-between border border-[#e0e0e0]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#161616] text-white flex items-center justify-center font-bold text-xs">
                    ⚡
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#161616]">Recent Study Sessions</h3>
                    <p className="text-xs text-[#525252]">Active learning activity</p>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-[#0f62fe] text-white text-[10px] flex items-center justify-center font-bold">
                    AI
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#198038] text-white text-[10px] flex items-center justify-center font-bold">
                    JS
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#6929c4] text-white text-[10px] flex items-center justify-center font-bold">
                    PY
                  </div>
                </div>
              </div>

              {/* Session Highlight Pill */}
              <div className="bg-white border border-[#e0e0e0] p-4 rounded-2xl mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🎓</span>
                  <div>
                    <p className="text-xs font-semibold text-[#161616]">Artificial Intelligence Basics</p>
                    <p className="text-[11px] text-[#525252]">12.53 hrs logged / 16 lessons</p>
                  </div>
                </div>
                <span className="text-xs bg-[#defbe6] text-[#198038] px-2.5 py-1 rounded-full font-bold">
                  Active
                </span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#e0e0e0]">
              <div className="bg-white p-4 rounded-2xl border border-[#e0e0e0]">
                <span className="text-xs text-[#525252]">Study Streak</span>
                <p className="text-xl font-bold text-[#161616] mt-0.5">🔥 12 Days</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#e0e0e0]">
                <span className="text-xs text-[#525252]">Quiz Accuracy</span>
                <p className="text-xl font-bold text-[#0f62fe] mt-0.5">🎯 94.2%</p>
              </div>
            </div>
          </div>

          {/* BOTTOM LEFT CARD: Overall Skill Mastery Gauge Meter */}
          <div className="bg-[#dcfce7] border border-[#bbf7d0] text-[#161616] p-6 lg:p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#161616]">Overall Skill Mastery</h3>
                <div className="flex items-center gap-2">
                  <button className="w-7 h-7 rounded-full bg-white border border-[#bbf7d0] text-xs font-bold text-[#161616] hover:bg-[#bbf7d0]">
                    ←
                  </button>
                  <button className="w-7 h-7 rounded-full bg-white border border-[#bbf7d0] text-xs font-bold text-[#161616] hover:bg-[#bbf7d0]">
                    →
                  </button>
                </div>
              </div>

              {/* Arc Gauge Meter SVG */}
              <div className="relative flex flex-col items-center justify-center my-4">
                <svg className="w-64 h-36" viewBox="0 0 200 110">
                  {/* Gauge Outer Track */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#161616"
                    strokeWidth="22"
                    strokeLinecap="round"
                  />
                  {/* Gauge Active Progress Fill Arc */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 150 40"
                    fill="none"
                    stroke="#42be65"
                    strokeWidth="22"
                    strokeLinecap="round"
                    strokeDasharray="4 2"
                  />
                  {/* Gauge Pointer Dot */}
                  <circle cx="150" cy="40" r="5" fill="#161616" stroke="#ffffff" strokeWidth="2" />
                </svg>

                {/* Center Value */}
                <div className="text-center mt-[-30px]">
                  <span className="text-3xl font-bold text-[#161616]">{avgProgress}%</span>
                  <p className="text-xs text-[#15803d] font-semibold">Mastery Benchmark Score</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#bbf7d0]">
              <span className="text-xs font-semibold text-[#166534] bg-white px-3 py-1 rounded-full border border-[#bbf7d0]">
                {avgProgress}% avg score (Target: 85%)
              </span>
              <span className="text-xs font-bold text-[#15803d]">On Track 🚀</span>
            </div>
          </div>

          {/* BOTTOM RIGHT CARD: Skill Career Forecast & Timeline */}
          <div className="bg-white border border-[#e0e0e0] p-6 lg:p-8 rounded-3xl flex flex-col justify-between">
            <h3 className="text-lg font-semibold text-[#161616] mb-4">Market forecast</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Timeline list */}
              <div className="space-y-4 text-xs text-[#525252] border-l-2 border-[#e0e0e0] pl-4 my-auto">
                <div className="relative">
                  <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-[#161616]"></div>
                  <p className="font-bold text-[#161616]">2024</p>
                  <p>Explosive growth of Gen AI</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-[#e0e0e0]"></div>
                  <p className="font-bold text-[#161616]">2025</p>
                  <p>Full-Stack Web Architect</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-[#e0e0e0]"></div>
                  <p className="font-bold text-[#161616]">2026</p>
                  <p>Cloud Security Leader</p>
                </div>
              </div>

              {/* Mini forecast cards */}
              <div className="space-y-3">
                {/* Green Card */}
                <div className="bg-[#bbf7d0] p-4 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-[#166534]">
                    <span>Skill score</span>
                    <span>↗</span>
                  </div>
                  <p className="text-2xl font-bold text-[#161616]">21,105 pts</p>
                  <div className="w-full bg-[#86efac] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#15803d] h-full w-[70%]"></div>
                  </div>
                </div>

                {/* Purple Card */}
                <div className="bg-[#f3e8ff] p-4 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-[#6b21a8]">
                    <span>Market cap forecast</span>
                    <span>↗</span>
                  </div>
                  <p className="text-2xl font-bold text-[#161616]">1.3trln$</p>

                  {/* Bezier Line Graph SVG */}
                  <svg className="w-full h-8" viewBox="0 0 100 30">
                    <path
                      d="M 0 25 Q 30 20, 50 15 T 100 5"
                      fill="none"
                      stroke="#9333ea"
                      strokeWidth="2.5"
                    />
                    <circle cx="75" cy="10" r="3" fill="#9333ea" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[#161616] font-semibold text-xl">My Enrolled Courses</h2>
          <Link href="/courses" className="text-[#0f62fe] text-sm hover:underline font-medium">
            Browse catalog
          </Link>
        </div>

        {isLoading ? (
          <div className="bg-white border border-[#e0e0e0] p-8 text-center text-sm text-[#525252] rounded-2xl">
            Loading enrollments...
          </div>
        ) : enrollments.length === 0 ? (
          <div className="bg-white border border-[#e0e0e0] p-8 text-center space-y-3 rounded-2xl">
            <p className="text-sm text-[#525252]">You are not enrolled in any courses yet.</p>
            <Link
              href="/courses"
              className="inline-block bg-[#0f62fe] text-white text-xs px-4 py-2.5 font-semibold hover:bg-[#0043ce] rounded-xl"
            >
              Explore & Enroll for ₹199
            </Link>
          </div>
        ) : (
          <div className="border border-[#e0e0e0] bg-white divide-y divide-[#e0e0e0] rounded-2xl overflow-hidden">
            {enrollments.map((item) => (
              <div key={item._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#0f62fe] uppercase">{item.category}</span>
                    {item.progressPercentage === 100 && (
                      <span className="text-[11px] bg-[#defbe6] text-[#198038] px-2 py-0.5 font-bold rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-[#161616]">{item.courseTitle}</h3>
                </div>

                <div className="flex items-center gap-6 md:w-80">
                  <div className="flex-1">
                    <div className="w-full bg-[#e0e0e0] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.progressPercentage === 100 ? 'bg-[#198038]' : 'bg-[#0f62fe]'}`}
                        style={{ width: `${item.progressPercentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#525252] font-medium mt-1 block text-right">
                      {item.progressPercentage}% Complete
                    </span>
                  </div>

                  {item.certificateStatus?.certificateId ? (
                    <Link
                      href={`/certificate/${item.certificateStatus.certificateId}`}
                      className="bg-[#198038] text-white text-xs px-3.5 py-2 font-medium hover:bg-[#0e6027] shrink-0 rounded-lg"
                    >
                      View Cert
                    </Link>
                  ) : (
                    <Link
                      href={`/learn/${item.courseId}/mod1-lesson1`}
                      className="bg-[#0f62fe] text-white text-xs px-3.5 py-2 font-medium hover:bg-[#0043ce] shrink-0 rounded-lg"
                    >
                      Continue
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Course Tasks Section */}
      <div className="space-y-4">
        <h2 className="text-[#161616] font-semibold text-xl">Assigned Tasks & Checklist</h2>
        {tasks.length === 0 ? (
          <div className="bg-white border border-[#e0e0e0] p-6 text-sm text-[#525252] rounded-2xl">
            No pending tasks. Enroll in a course to get started!
          </div>
        ) : (
          <div className="bg-white border border-[#e0e0e0] divide-y divide-[#e0e0e0] rounded-2xl overflow-hidden">
            {tasks.map((task) => (
              <div key={task._id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => toggleTask(task._id)}
                    className="w-4 h-4 text-[#0f62fe] border-[#e0e0e0] focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <p
                      className={`text-sm ${
                        task.status === 'completed' ? 'line-through text-[#8d8d8d]' : 'text-[#161616] font-medium'
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-xs text-[#525252]">{task.courseTitle}</p>
                  </div>
                </div>
                <span className="text-xs text-[#525252]">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
