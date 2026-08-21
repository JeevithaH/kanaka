'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { CourseCheckoutModal } from '@/components/payments/CourseCheckoutModal';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  Briefcase,
  Bell,
  ArrowRight,
  Send,
  Search,
  ShieldCheck,
  TrendingUp,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CourseEnrollmentData {
  _id: string;
  courseId: string;
  courseTitle: string;
  category: string;
  image?: string;
  totalLessons: number;
  completedLessonsCount: number;
  remainingLessonsCount: number;
  progressPercentage: number;
  paymentStatus: 'pending' | 'paid';
  certificateStatus: {
    eligible: boolean;
    issued: boolean;
    certificateId?: string;
  };
}

interface InternshipEnrollmentData {
  _id: string;
  internshipId: string;
  title: string;
  organization: string;
  validationStatus: 'pending' | 'paid' | 'validated';
  validationFee: number;
  taskProgress: Array<{
    taskId: string;
    status: string;
  }>;
}

interface TaskData {
  _id: string;
  taskId?: string;
  courseId?: string;
  internshipId?: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'submitted' | 'under-review' | 'approved' | 'rejected';
}

interface NotificationData {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
}

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const tabQuery = searchParams.get('tab');

  const [courseEnrollments, setCourseEnrollments] = useState<CourseEnrollmentData[]>([]);
  const [internshipEnrollments, setInternshipEnrollments] = useState<InternshipEnrollmentData[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'all' | 'courses' | 'tasks' | 'internships'>('all');

  useEffect(() => {
    if (tabQuery === 'courses' || tabQuery === 'tasks' || tabQuery === 'internships') {
      setActiveTab(tabQuery);
    } else {
      setActiveTab('all');
    }
  }, [tabQuery]);

  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const [selectedTaskForSubmission, setSelectedTaskForSubmission] = useState<TaskData | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  const [checkoutCourse, setCheckoutCourse] = useState<{
    courseId: string;
    courseTitle: string;
    originalPrice: number;
  } | null>(null);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      if (data.courseEnrollments) setCourseEnrollments(data.courseEnrollments);
      if (data.internshipEnrollments) setInternshipEnrollments(data.internshipEnrollments);
      if (data.tasks) setTasks(data.tasks);
      if (data.notifications) setNotifications(data.notifications);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  const toggleTask = async (taskId: string) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });
      if (res.ok) fetchDashboardData();
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskForSubmission || !submissionText.trim()) return;
    setIsSubmittingTask(true);
    try {
      const res = await fetch(`/api/tasks/${selectedTaskForSubmission._id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionContent: submissionText }),
      });
      if (res.ok) {
        setSelectedTaskForSubmission(null);
        setSubmissionText('');
        fetchDashboardData();
      }
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const handlePaymentSuccess = () => fetchDashboardData();

  const totalCompletedLessons = courseEnrollments.reduce((acc, c) => acc + c.completedLessonsCount, 0);
  const totalLessonsAllCourses = courseEnrollments.reduce((acc, c) => acc + c.totalLessons, 0);
  const overallCourseProgress = totalLessonsAllCourses > 0 ? Math.round((totalCompletedLessons / totalLessonsAllCourses) * 100) : 0;

  const filteredCourses = useMemo(() => {
    return courseEnrollments.filter((c) =>
      c.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courseEnrollments, searchQuery]);

  const userInitials = user?.name ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : 'ST';
  const weekDays = [
    { day: 'Sun', height: 'h-12', active: false },
    { day: 'Mon', height: 'h-20', active: true },
    { day: 'Tue', height: 'h-28', active: true },
    { day: 'Wed', height: 'h-16', active: true },
    { day: 'Thu', height: 'h-32', active: true },
    { day: 'Fri', height: 'h-24', active: true },
    { day: 'Sat', height: 'h-14', active: false },
  ];

  const currentDateFormatted = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#efebe7] border border-[#ded7d0] p-4 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8a7f76] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your courses, topics, or modules..."
            className="w-full bg-white border border-[#ded7d0] pl-10 pr-4 py-2 text-xs rounded-xl focus:outline-none focus:border-[#80664f] text-[#261e18] placeholder:text-[#8a7f76]"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Overview' },
            { id: 'courses', label: `Courses (${courseEnrollments.length})` },
            { id: 'tasks', label: `Tasks (${tasks.length})` },
            { id: 'internships', label: `Internships (${internshipEnrollments.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-[#80664f] text-white shadow-sm' : 'bg-white text-[#5f554d] hover:bg-[#e4ded8] border border-[#ded7d0]'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#261e18] via-[#3d2f24] to-[#5f4938] text-white p-6 lg:p-8 shadow-md border border-[#4a392c]">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#80664f]/40 border border-[#a38367]/30 text-[11px] font-semibold text-[#efebe7]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d9c8bb]" />
              <span>OFFICIAL STUDENT OPERATIONS CENTER</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white leading-snug">
              Welcome back, {user?.name || 'Learner'}! Build skills the world needs now.
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/courses">
              <button className="bg-white text-[#261e18] hover:bg-[#efebe7] px-5 py-2.5 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2">
                <span>Browse Courses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {(activeTab === 'all' || activeTab === 'courses') && (
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-[#ded7d0] rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#8a7f76] uppercase tracking-wider">Learning Time</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-[#261e18]">18</span>
                    <span className="text-xs text-[#8a7f76]">hours spent</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#f8f6f4] p-4 rounded-2xl border border-[#ded7d0] space-y-2">
                <div className="flex items-end justify-between gap-1 h-32 pt-2 px-1">
                  {weekDays.map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                      <div className={`w-full max-w-[20px] rounded-lg ${item.height} ${item.active ? 'bg-[#80664f]' : 'bg-[#ded7d0]'}`} />
                      <span className="text-[10px] font-semibold text-[#8a7f76]">{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`${activeTab === 'tasks' ? 'lg:col-span-8' : 'lg:col-span-6'} space-y-6`}>
          {/* Activity Progress Header */}
          <div className="bg-white border border-[#ded7d0] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-[#261e18] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#80664f]" />
                <span>Overall Learning Progress</span>
              </h2>
              <div className="flex items-center gap-1 bg-[#efebe7] p-1 rounded-xl border border-[#ded7d0] self-start">
                {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficultyFilter(d)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                      difficultyFilter === d ? 'bg-[#80664f] text-white shadow-sm' : 'text-[#8a7f76] hover:text-[#261e18]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#f8f6f4] p-5 rounded-2xl border border-[#ded7d0] space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-black text-[#261e18]">{overallCourseProgress}%</span>
                  <span className="text-xs text-[#8a7f76] ml-2 font-medium">Activity Completed</span>
                </div>
                <span className="text-xs font-bold text-[#80664f] bg-[#efebe7] px-2.5 py-1 rounded-lg border border-[#ded7d0]">
                  {totalCompletedLessons} / {totalLessonsAllCourses} Lessons
                </span>
              </div>
              <div className="w-full bg-[#ded7d0] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#80664f] h-full rounded-full transition-all duration-500"
                  style={{ width: `${overallCourseProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* MY COURSES SECTION */}
          {(activeTab === 'all' || activeTab === 'courses') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#261e18] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#80664f]" />
                  <span>My Courses</span>
                </h2>
                <Link href="/courses" className="text-xs font-bold text-[#80664f] hover:underline flex items-center gap-1">
                  <span>Catalog</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {isLoading ? (
                <div className="bg-white border border-[#ded7d0] p-8 text-center text-xs text-[#8a7f76] rounded-3xl">
                  Loading courses...
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="bg-white border border-[#ded7d0] p-8 text-center space-y-3 rounded-3xl">
                  <p className="text-xs text-[#5f554d]">No enrolled courses found.</p>
                  <Link href="/courses">
                    <Button variant="glow" size="sm">Explore & Enroll</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredCourses.map((item) => {
                    const isPaid = item.paymentStatus === 'paid';
                    const fallbackImg = item.category.toLowerCase().includes('ai')
                      ? '/images/ai.jpg'
                      : item.category.toLowerCase().includes('data')
                      ? '/images/data_science.jpg'
                      : item.category.toLowerCase().includes('cyber')
                      ? '/images/cyber_security.jpg'
                      : '/images/web.jpg';

                    const imgSrc = item.image || fallbackImg;

                    return (
                      <div
                        key={item._id}
                        className="bg-white border border-[#ded7d0] rounded-2xl overflow-hidden shadow-sm hover:border-[#80664f] transition-all flex flex-col justify-between"
                      >
                        <div className="relative w-full h-32 bg-[#efebe7]">
                          <Image src={imgSrc} alt={item.courseTitle} fill className="object-cover" />
                          <div className="absolute top-2 left-2">
                            <span className="bg-[#261e18]/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                              {item.category}
                            </span>
                          </div>
                          <div className="absolute top-2 right-2">
                            {isPaid ? (
                              <span className="bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
                                Unlocked ✓
                              </span>
                            ) : (
                              <span className="bg-[#80664f] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
                                ₹199
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xs font-bold text-[#261e18] line-clamp-2 leading-snug">
                              {item.courseTitle}
                            </h3>
                            <p className="text-[10px] text-[#8a7f76] mt-1">
                              {item.completedLessonsCount} / {item.totalLessons} completed
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-semibold text-[#5f554d]">
                              <span>Progress</span>
                              <span>{item.progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-[#efebe7] h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#80664f] h-full rounded-full"
                                style={{ width: `${item.progressPercentage}%` }}
                              />
                            </div>
                          </div>

                          <div className="pt-2">
                            {isPaid ? (
                              <Link href={`/learn/${item.courseId}/mod1-lesson1`}>
                                <button className="w-full bg-[#80664f] hover:bg-[#5f4938] text-white text-xs font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                                  <span>Continue</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </Link>
                            ) : (
                              <button
                                onClick={() =>
                                  setCheckoutCourse({
                                    courseId: item.courseId,
                                    courseTitle: item.courseTitle,
                                    originalPrice: 1999,
                                  })
                                }
                                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2 rounded-xl transition-colors shadow-sm"
                              >
                                Unlock (₹199)
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* INTERNSHIP ENROLLMENTS */}
          {(activeTab === 'all' || activeTab === 'internships') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#261e18] flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#80664f]" />
                  <span>Internship Milestones</span>
                </h2>
                <Link href="/internships" className="text-xs font-bold text-[#80664f] hover:underline flex items-center gap-1">
                  <span>Explore</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {internshipEnrollments.length === 0 ? (
                <div className="bg-white border border-[#ded7d0] p-6 text-center space-y-3 rounded-3xl">
                  <p className="text-xs text-[#5f554d]">No active internship enrollments.</p>
                  <Link href="/internships">
                    <button className="bg-[#80664f] text-white text-xs px-4 py-2 rounded-xl font-bold hover:bg-[#5f4938] transition-colors">
                      Browse Internships
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {internshipEnrollments.map((item) => (
                    <div key={item._id} className="bg-white border border-[#ded7d0] p-4 rounded-2xl space-y-2.5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-bold text-[#80664f] bg-[#efebe7] px-2 py-0.5 rounded border border-[#ded7d0]">
                            {item.organization}
                          </span>
                          <h3 className="text-xs font-bold text-[#261e18] mt-1">{item.title}</h3>
                        </div>
                        <Link href={`/internships/${item.internshipId}`}>
                          <button className="bg-[#efebe7] text-[#261e18] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#ded7d0]">
                            View
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Profile, Tasks Checklist & Alerts */}
        <div className={`${activeTab === 'tasks' ? 'lg:col-span-4' : 'lg:col-span-3'} space-y-6`}>
          {/* Profile Card */}
          <div className="bg-white border border-[#ded7d0] rounded-3xl p-5 shadow-sm space-y-3 text-center">
            <div className="flex items-center justify-between text-xs font-bold text-[#8a7f76]">
              <span>My Profile</span>
              <span className="bg-[#efebe7] text-[#80664f] text-[10px] px-2 py-0.5 rounded border border-[#ded7d0]">
                Active
              </span>
            </div>

            <div className="flex flex-col items-center space-y-2 pt-1">
              <div className="w-14 h-14 rounded-full bg-[#80664f] text-white flex items-center justify-center text-base font-black shadow-md border-2 border-white">
                {userInitials}
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#261e18]">{user?.name || 'Preetham H'}</h3>
                <p className="text-[10px] text-[#8a7f76] font-mono">
                  ID: {user?.id?.substring(0, 10) || 'ST-6A85A5'}
                </p>
              </div>
            </div>

            <div className="bg-[#f8f6f4] p-2.5 rounded-2xl border border-[#ded7d0] flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#80664f]" />
                <span className="text-[10px] font-semibold text-[#5f554d]">{currentDateFormatted}</span>
              </div>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Verified
              </span>
            </div>
          </div>

          {/* Assigned Tasks Widget */}
          <div className="bg-white border border-[#ded7d0] rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#261e18] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#80664f]" />
                <span>Assigned Tasks</span>
              </h3>
              <span className="text-[10px] font-bold text-[#80664f] bg-[#efebe7] px-2 py-0.5 rounded-full border border-[#ded7d0]">
                {tasks.length}
              </span>
            </div>

            {tasks.length === 0 ? (
              <p className="text-xs text-[#8a7f76] py-3 text-center">No assigned tasks.</p>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {tasks.map((task) => {
                  const isSubmitted = task.status === 'submitted';
                  const isUnderReview = task.status === 'under-review';
                  const isApproved = task.status === 'approved';
                  const isRejected = task.status === 'rejected';
                  const isCompleted = task.status === 'completed';

                  let statusBadge = 'bg-[#efebe7] text-[#5f554d] border-[#ded7d0]';
                  let statusText = 'Pending';
                  if (isSubmitted) {
                    statusBadge = 'bg-amber-50 text-amber-800 border-amber-200';
                    statusText = 'Submitted';
                  } else if (isUnderReview) {
                    statusBadge = 'bg-amber-100 text-amber-900 border-amber-300';
                    statusText = 'Reviewing';
                  } else if (isApproved || isCompleted) {
                    statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                    statusText = 'Approved ✓';
                  } else if (isRejected) {
                    statusBadge = 'bg-rose-50 text-rose-700 border-rose-200';
                    statusText = 'Rejected ⚠️';
                  }

                  return (
                    <div key={task._id} className="p-3 bg-[#f8f6f4] rounded-2xl border border-[#ded7d0] space-y-2">
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={isCompleted || isSubmitted || isUnderReview || isApproved}
                          onChange={() => toggleTask(task._id)}
                          className="mt-0.5 rounded text-[#80664f] accent-[#80664f] cursor-pointer"
                        />
                        <div className="flex-1 space-y-0.5">
                          <p className={`text-xs font-bold leading-tight ${isCompleted || isApproved ? 'line-through text-[#8a7f76]' : 'text-[#261e18]'}`}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#8a7f76]">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${statusBadge}`}>
                              {statusText}
                            </span>
                          </div>
                        </div>
                      </div>

                      {!isSubmitted && !isUnderReview && !isApproved && !isCompleted ? (
                        <button
                          onClick={() => setSelectedTaskForSubmission(task)}
                          className="w-full text-center py-1.5 text-[11px] font-bold text-white bg-[#80664f] hover:bg-[#5f4938] rounded-xl transition-colors shadow-sm"
                        >
                          Submit Task Work →
                        </button>
                      ) : isRejected ? (
                        <button
                          onClick={() => setSelectedTaskForSubmission(task)}
                          className="w-full text-center py-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-200"
                        >
                          Resubmit Work ⚠️ →
                        </button>
                      ) : (
                        <div className="w-full text-center py-1 text-[10px] font-bold text-[#8a7f76] bg-[#efebe7] rounded-lg border border-[#ded7d0]">
                          Work Locked (In Review)
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notifications & System Alerts */}
          <div className="bg-white border border-[#ded7d0] rounded-3xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-[#261e18] flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-[#80664f]" />
              <span>Recent Alerts</span>
            </h3>

            {notifications.length === 0 ? (
              <p className="text-xs text-[#8a7f76] py-2 text-center">No alerts at this moment.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {notifications.slice(0, 4).map((n) => (
                  <div key={n._id} className="p-2.5 rounded-xl bg-[#f8f6f4] border border-[#ded7d0] space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#261e18]">
                      <span>{n.title}</span>
                      <span className="text-[9px] text-[#8a7f76]">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#5f554d] leading-relaxed line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Submission Modal */}
      {selectedTaskForSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#ded7d0] p-6 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-[#ded7d0]">
              <h3 className="text-sm font-bold text-[#261e18]">Submit Task Work for Review</h3>
              <button
                onClick={() => setSelectedTaskForSubmission(null)}
                className="text-[#8a7f76] hover:text-[#261e18] font-bold text-sm"
              >
                ✕
              </button>
            </div>
            <div>
              <p className="text-xs font-bold text-[#261e18]">{selectedTaskForSubmission.title}</p>
              <p className="text-[11px] text-[#8a7f76] mt-0.5">
                Due: {new Date(selectedTaskForSubmission.dueDate).toLocaleDateString()}
              </p>
            </div>
            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <textarea
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Paste your GitHub repository URL, live project link, or written explanation of your solution..."
                rows={5}
                required
                className="w-full border border-[#ded7d0] rounded-2xl p-3 text-xs focus:outline-none focus:border-[#80664f] text-[#261e18] placeholder:text-[#8a7f76]"
              />
              <button
                type="submit"
                disabled={isSubmittingTask}
                className="w-full bg-[#80664f] hover:bg-[#5f4938] text-white text-xs font-bold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmittingTask ? 'Submitting...' : 'Submit Solution to Mentor'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Course Checkout Modal */}
      {checkoutCourse && (
        <CourseCheckoutModal
          isOpen={!!checkoutCourse}
          onClose={() => setCheckoutCourse(null)}
          courseId={checkoutCourse.courseId}
          courseTitle={checkoutCourse.courseTitle}
          originalPrice={checkoutCourse.originalPrice}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
