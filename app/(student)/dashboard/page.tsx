'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
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
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  Check,
  Target,
  GraduationCap,
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

function StudentDashboardContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const tabQuery = searchParams.get('tab');

  const [courseEnrollments, setCourseEnrollments] = useState<CourseEnrollmentData[]>([]);
  const [internshipEnrollments, setInternshipEnrollments] = useState<InternshipEnrollmentData[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Coursera tabs: 'in-progress' | 'completed' | 'tasks' | 'internships'
  const [activeTab, setActiveTab] = useState<'in-progress' | 'completed' | 'tasks' | 'internships'>('in-progress');

  useEffect(() => {
    if (tabQuery === 'tasks') {
      setActiveTab('tasks');
    } else if (tabQuery === 'internships') {
      setActiveTab('internships');
    } else if (tabQuery === 'completed') {
      setActiveTab('completed');
    } else {
      setActiveTab('in-progress');
    }
  }, [tabQuery]);

  const [searchQuery, setSearchQuery] = useState('');

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

  // In-progress vs completed courses
  const inProgressCourses = useMemo(() => {
    return courseEnrollments.filter((c) => (c.progressPercentage || 0) < 100);
  }, [courseEnrollments]);

  const completedCourses = useMemo(() => {
    return courseEnrollments.filter((c) => (c.progressPercentage || 0) >= 100);
  }, [courseEnrollments]);

  const displayedCourses = activeTab === 'completed' ? completedCourses : inProgressCourses;

  const filteredCourses = useMemo(() => {
    return displayedCourses.filter(
      (c) =>
        c.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [displayedCourses, searchQuery]);

  const totalCompletedLessons = courseEnrollments.reduce((acc, c) => acc + (c.completedLessonsCount || 0), 0);
  const totalLessonsAllCourses = courseEnrollments.reduce((acc, c) => acc + (c.totalLessons || 0), 0);
  const overallCourseProgress = totalLessonsAllCourses > 0 ? Math.round((totalCompletedLessons / totalLessonsAllCourses) * 100) : 0;

  // Coursera Weekly habit days
  const daysOfWeek = [
    { day: 'M', full: 'Mon', completed: true },
    { day: 'T', full: 'Tue', completed: true },
    { day: 'W', full: 'Wed', completed: true },
    { day: 'T', full: 'Thu', completed: true },
    { day: 'F', full: 'Fri', completed: false },
    { day: 'S', full: 'Sat', completed: false },
    { day: 'S', full: 'Sun', completed: false },
  ];

  return (
    <div className="space-y-8 font-sans max-w-[1400px] mx-auto">
      {/* ── COURSERA HEADER / SEARCH BAR ────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 px-6 py-4 rounded-xl shadow-xs">
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your courses, assignments, or skills..."
            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 text-xs rounded-lg focus:outline-none focus:border-[#0056D2] focus:bg-white text-slate-900 placeholder:text-slate-400 transition-colors"
          />
        </div>
        <div className="flex items-center gap-3">
          <Link href="/courses">
            <button className="bg-[#0056D2] hover:bg-[#0041B2] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Explore Catalog</span>
            </button>
          </Link>
        </div>
      </div>

      {/* ── COURSERA WELCOME BANNER ─────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0056D2] bg-blue-50 px-2.5 py-0.5 rounded uppercase tracking-wide">
                My Learning
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Skyrellac Learner Portal</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
              Welcome back, {user?.name || 'Learner'} 👋
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              Pick up right where you left off, stay on schedule, and earn verified industry credentials.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-6 border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-8 shrink-0">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">{courseEnrollments.length}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Enrolled</p>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-[#0056D2]">{completedCourses.length}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Completed</p>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">
                {courseEnrollments.filter((c) => c.certificateStatus?.issued).length}
              </p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Certificates</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── COURSERA NAVIGATION TABS ────────────────────────────── */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-8 overflow-x-auto">
          {[
            { id: 'in-progress', label: `In Progress (${inProgressCourses.length})` },
            { id: 'completed', label: `Completed (${completedCourses.length})` },
            { id: 'tasks', label: `Assignments (${tasks.length})` },
            { id: 'internships', label: `Internships (${internshipEnrollments.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'text-[#0056D2] border-b-2 border-[#0056D2]'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT GRID ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left / Center Column: Course Feed or Assignments */}
        <div className="lg:col-span-8 space-y-6">
          {/* TAB: IN PROGRESS or COMPLETED */}
          {(activeTab === 'in-progress' || activeTab === 'completed') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">
                  {activeTab === 'in-progress' ? 'Courses in Progress' : 'Completed Courses'}
                </h2>
                <Link
                  href="/courses"
                  className="text-xs font-semibold text-[#0056D2] hover:underline flex items-center gap-1"
                >
                  <span>Browse all courses</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {isLoading ? (
                <div className="bg-white border border-slate-200 p-12 text-center text-xs text-slate-500 rounded-xl">
                  Loading courses...
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-4 shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0056D2] flex items-center justify-center mx-auto">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">
                      {activeTab === 'in-progress'
                        ? 'No courses in progress'
                        : 'No completed courses yet'}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                      {activeTab === 'in-progress'
                        ? 'Explore top-rated technology courses on Skyrellac and start your learning journey today.'
                        : 'Complete all modules and pass the final exam in any course to see your achievements here.'}
                    </p>
                  </div>
                  <Link href="/courses">
                    <button className="bg-[#0056D2] hover:bg-[#0041B2] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors shadow-xs">
                      Explore Courses Catalog
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
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
                    const progress = item.progressPercentage || 0;

                    return (
                      <div
                        key={item._id}
                        className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col sm:flex-row items-stretch"
                      >
                        {/* Course Thumbnail */}
                        <div className="relative w-full sm:w-56 h-40 sm:h-auto shrink-0 bg-slate-100">
                          <Image
                            src={imgSrc}
                            alt={item.courseTitle}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2.5 left-2.5">
                            <span className="bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        {/* Course Body (Coursera Layout) */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                              Skyrellac Professional Program
                            </span>
                            <h3 className="text-base font-bold text-slate-900 leading-snug hover:text-[#0056D2] transition-colors">
                              {item.courseTitle}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {item.completedLessonsCount || 0} of {item.totalLessons || 10} modules completed
                            </p>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-slate-600">Course Progress</span>
                              <span className="text-[#0056D2]">{progress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-[#0056D2] h-full rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>Self-paced • Lifetime access</span>
                            </div>

                            {isPaid ? (
                              <Link href={`/learn/${item.courseId}/mod1-lesson1`}>
                                <button className="bg-[#0056D2] hover:bg-[#0041B2] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer">
                                  <span>{progress > 0 ? 'Resume Course' : 'Go to Course'}</span>
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
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
                              >
                                Unlock Full Access (₹199)
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

          {/* TAB: TASKS & ASSIGNMENTS */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Upcoming Assignments & Quizzes</h2>
                <span className="text-xs text-slate-500">{tasks.length} total tasks</span>
              </div>

              {tasks.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3 shadow-xs">
                  <p className="text-xs text-slate-500">No active assignments or quizzes pending.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => {
                    const isSubmitted = task.status === 'submitted';
                    const isUnderReview = task.status === 'under-review';
                    const isApproved = task.status === 'approved';
                    const isRejected = task.status === 'rejected';
                    const isCompleted = task.status === 'completed';

                    let statusBadge = 'bg-slate-100 text-slate-600 border-slate-200';
                    let statusText = 'Pending';
                    if (isSubmitted) {
                      statusBadge = 'bg-amber-50 text-amber-800 border-amber-200';
                      statusText = 'Submitted';
                    } else if (isUnderReview) {
                      statusBadge = 'bg-blue-50 text-blue-800 border-blue-200';
                      statusText = 'In Review';
                    } else if (isApproved || isCompleted) {
                      statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                      statusText = 'Completed ✓';
                    } else if (isRejected) {
                      statusBadge = 'bg-rose-50 text-rose-700 border-rose-200';
                      statusText = 'Needs Revision';
                    }

                    return (
                      <div
                        key={task._id}
                        className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-3"
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isCompleted || isSubmitted || isUnderReview || isApproved}
                            onChange={() => toggleTask(task._id)}
                            className="mt-1 h-4 w-4 rounded text-[#0056D2] accent-[#0056D2] cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <h4
                              className={`text-xs font-bold ${
                                isCompleted || isApproved ? 'line-through text-slate-400' : 'text-slate-900'
                              }`}
                            >
                              {task.title}
                            </h4>
                            <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${statusBadge}`}>
                                {statusText}
                              </span>
                            </div>
                          </div>
                        </div>

                        {!isSubmitted && !isUnderReview && !isApproved && !isCompleted && (
                          <button
                            onClick={() => setSelectedTaskForSubmission(task)}
                            className="w-full text-center py-2 text-xs font-semibold text-white bg-[#0056D2] hover:bg-[#0041B2] rounded-lg transition-colors cursor-pointer"
                          >
                            Submit Assignment →
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: INTERNSHIPS */}
          {activeTab === 'internships' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Enrolled Internship Programs</h2>
                <Link href="/internships" className="text-xs font-semibold text-[#0056D2] hover:underline">
                  Browse Internships →
                </Link>
              </div>

              {internshipEnrollments.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3 shadow-xs">
                  <p className="text-xs text-slate-500">No active internship enrollments.</p>
                  <Link href="/internships">
                    <button className="bg-[#0056D2] hover:bg-[#0041B2] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                      Explore Internships
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {internshipEnrollments.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#0056D2] bg-blue-50 px-2 py-0.5 rounded">
                          {item.organization}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                        <p className="text-xs text-slate-500">Verified Professional Experience</p>
                      </div>
                      <Link href={`/internships/${item.internshipId}`}>
                        <button className="bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                          View Program
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN: COURSERA WEEKLY GOAL & STATS ──────────── */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coursera Weekly Learning Goal Widget */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#0056D2]" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Weekly Learning Habit
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#0056D2] bg-blue-50 px-2 py-0.5 rounded">
                4 / 7 Days
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Learning a little every day helps build momentum toward your career credentials.
            </p>

            <div className="flex items-center justify-between pt-1">
              {daysOfWeek.map((d, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      d.completed
                        ? 'bg-[#0056D2] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {d.completed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : d.day}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{d.full}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Progress Widget */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Overall Progress
              </h3>
              <span className="text-xs font-bold text-slate-900">{overallCourseProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#0056D2] h-full rounded-full transition-all duration-500"
                style={{ width: `${overallCourseProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 pt-1">
              <span>{totalCompletedLessons} lessons finished</span>
              <span>{totalLessonsAllCourses} total</span>
            </div>
          </div>

          {/* Verifiable Credentials Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Verified Credentials
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Earn an accredited certificate upon passing the final assessment of each course.
            </p>
            <Link href="/credentials">
              <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1 mt-1">
                <span>View My Certificates</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>

          {/* Notifications / Updates */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-slate-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recent Updates
              </h3>
            </div>
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400 py-2 text-center">No new notifications.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {notifications.slice(0, 3).map((n) => (
                  <div key={n._id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                    <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                    <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Submission Modal */}
      {selectedTaskForSubmission && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Submit Assignment Work</h3>
              <button
                onClick={() => setSelectedTaskForSubmission(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{selectedTaskForSubmission.title}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Due date: {new Date(selectedTaskForSubmission.dueDate).toLocaleDateString()}
              </p>
            </div>
            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <textarea
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Paste your GitHub URL, live project link, or solution notes here..."
                rows={5}
                required
                className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-[#0056D2] text-slate-900 placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={isSubmittingTask}
                className="w-full bg-[#0056D2] hover:bg-[#0041B2] text-white text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmittingTask ? 'Submitting...' : 'Submit to Mentor for Grading'}</span>
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

export default function StudentDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading dashboard...</div>}>
      <StudentDashboardContent />
    </Suspense>
  );
}
