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

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 lg:p-8 font-sans">
      {/* Welcome Header */}
      <div className="bg-white border border-[#e0e0e0] p-8">
        <span className="text-xs uppercase tracking-wider text-[#0f62fe] font-semibold">Student Portal</span>
        <h1 className="text-[#161616] font-light text-3xl lg:text-4xl mt-1">
          Welcome back, {user?.name || 'Learner'}
        </h1>
        <p className="text-[#525252] text-sm mt-1">
          Track your real-time course progress, assigned tasks, and verified certificates.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#e0e0e0] p-6">
          <p className="text-xs text-[#525252] uppercase tracking-wider font-semibold mb-2">Total Enrolled</p>
          <p className="text-3xl font-light text-[#161616]">{enrollments.length}</p>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-6">
          <p className="text-xs text-[#525252] uppercase tracking-wider font-semibold mb-2">In Progress</p>
          <p className="text-3xl font-light text-[#0f62fe]">{inProgressCount}</p>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-6">
          <p className="text-xs text-[#525252] uppercase tracking-wider font-semibold mb-2">Certificates Earned</p>
          <p className="text-3xl font-light text-[#198038]">{completedCount}</p>
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
          <div className="bg-white border border-[#e0e0e0] p-8 text-center text-sm text-[#525252]">
            Loading enrollments...
          </div>
        ) : enrollments.length === 0 ? (
          <div className="bg-white border border-[#e0e0e0] p-8 text-center space-y-3">
            <p className="text-sm text-[#525252]">You are not enrolled in any courses yet.</p>
            <Link
              href="/courses"
              className="inline-block bg-[#0f62fe] text-white text-xs px-4 py-2.5 font-semibold hover:bg-[#0043ce]"
            >
              Explore & Enroll for ₹199
            </Link>
          </div>
        ) : (
          <div className="border border-[#e0e0e0] bg-white divide-y divide-[#e0e0e0]">
            {enrollments.map((item) => (
              <div key={item._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#0f62fe] uppercase">{item.category}</span>
                    {item.progressPercentage === 100 && (
                      <span className="text-[11px] bg-[#defbe6] text-[#198038] px-2 py-0.5 font-bold">
                        Completed
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-[#161616]">{item.courseTitle}</h3>
                </div>

                <div className="flex items-center gap-6 md:w-80">
                  <div className="flex-1">
                    <div className="w-full bg-[#e0e0e0] h-2">
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
                      className="bg-[#198038] text-white text-xs px-3.5 py-2 font-medium hover:bg-[#0e6027] shrink-0"
                    >
                      View Cert
                    </Link>
                  ) : (
                    <Link
                      href={`/learn/${item.courseId}/mod1-lesson1`}
                      className="bg-[#0f62fe] text-white text-xs px-3.5 py-2 font-medium hover:bg-[#0043ce] shrink-0"
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
          <div className="bg-white border border-[#e0e0e0] p-6 text-sm text-[#525252]">
            No pending tasks. Enroll in a course to get started!
          </div>
        ) : (
          <div className="bg-white border border-[#e0e0e0] divide-y divide-[#e0e0e0]">
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
