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
  Compass,
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

  // Tabs: 'in-progress' | 'completed' | 'tasks' | 'internships'
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

  // Coursera-style habit days
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
    <div className="space-y-8 font-sans max-w-[1400px] mx-auto text-[#241e1a]">
      {/* ── TOP SEARCH & EXPLORE BAR ────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#e8e2db] px-6 py-4 rounded-xl shadow-xs">
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-[#8c8075] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your courses, topics, or modules..."
            className="w-full bg-[#fbfaf8] border border-[#e8e2db] pl-10 pr-4 py-2 text-xs rounded-lg focus:outline-none focus:border-[#80664f] focus:bg-white text-[#241e1a] placeholder:text-[#8c8075] transition-colors"
          />
        </div>
        <div className="flex items-center gap-3">
          <Link href="/courses">
            <button className="bg-[#80664f] hover:bg-[#5f4938] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Browse Courses</span>
            </button>
          </Link>
        </div>
      </div>

      {/* ── HERO BANNER MATCHING SCREENSHOT EXACT STYLE ─────────────────── */}
      <div className="bg-[#2e2722] text-white border border-[#453b34] rounded-2xl p-7 lg:p-10 shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="text-[11px] font-bold tracking-[0.15em] text-[#c5b8ac] uppercase">
              GUIDED LEARNING SPACE
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              A clearer route from curiosity to capability.
            </h1>
            <p className="text-xs text-[#ded7d0] font-medium">
              Welcome back, <span className="text-white font-bold">{user?.name || 'Learner'}</span>! Pick up right where you left off.
            </p>
          </div>

          <div className="max-w-md lg:text-right space-y-4">
            <p className="text-xs text-[#ded7d0] leading-relaxed">
              Follow a sequence designed around a real career direction. Each path pairs structured courses with practical projects and verified credentials.
            </p>
            <div className="flex lg:justify-end items-center gap-6 pt-2 border-t border-[#453b34]">
              <div>
                <p className="text-xl font-bold text-white">{courseEnrollments.length}</p>
                <p className="text-[10px] text-[#c5b8ac] uppercase font-semibold">Enrolled</p>
              </div>
              <div className="w-px h-6 bg-[#453b34]" />
              <div>
                <p className="text-xl font-bold text-[#e6d9cc]">{completedCourses.length}</p>
                <p className="text-[10px] text-[#c5b8ac] uppercase font-semibold">Completed</p>
              </div>
              <div className="w-px h-6 bg-[#453b34]" />
              <div>
                <p className="text-xl font-bold text-[#80664f] bg-white px-2 py-0.5 rounded text-center">
                  {courseEnrollments.filter((c) => c.certificateStatus?.issued).length}
                </p>
                <p className="text-[10px] text-[#c5b8ac] uppercase font-semibold">Credentials</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── COURSERA NAVIGATION TABS ────────────────────────────── */}
      <div className="border-b border-[#e8e2db]">
        <div className="flex items-center gap-8 overflow-x-auto">
          {[
            { id: 'in-progress', label: `Courses in Progress (${inProgressCourses.length})` },
            { id: 'completed', label: `Completed (${completedCourses.length})` },
            { id: 'tasks', label: `Assignments & Quizzes (${tasks.length})` },
            { id: 'internships', label: `Internship Milestones (${internshipEnrollments.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-sm font-bold transition-colors relative whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'text-[#80664f] border-b-2 border-[#80664f]'
                  : 'text-[#8c8075] hover:text-[#241e1a]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT GRID ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Courses Feed or Assignments */}
        <div className="lg:col-span-8 space-y-6">
          {/* TAB: IN PROGRESS or COMPLETED */}
          {(activeTab === 'in-progress' || activeTab === 'completed') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-[#8c8075] uppercase">
                    CHOOSE A DIRECTION
                  </span>
                  <h2 className="text-lg font-bold text-[#241e1a]">
                    {activeTab === 'in-progress'
                      ? 'Courses Currently in Progress'
                      : 'Completed Programs & Certifications'}
                  </h2>
                </div>
                <Link
                  href="/courses"
                  className="text-xs font-bold text-[#80664f] hover:underline flex items-center gap-1"
                >
                  <span>Browse all courses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {isLoading ? (
                <div className="bg-white border border-[#e8e2db] p-12 text-center text-xs text-[#8c8075] rounded-xl">
                  Loading courses...
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="bg-white border border-[#e8e2db] rounded-2xl p-10 text-center space-y-4 shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-[#f4efe9] text-[#80664f] flex items-center justify-center mx-auto">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#241e1a]">
                      {activeTab === 'in-progress'
                        ? 'No courses currently in progress'
                        : 'No completed courses yet'}
                    </h3>
                    <p className="text-xs text-[#8c8075] max-w-md mx-auto leading-relaxed">
                      {activeTab === 'in-progress'
                        ? 'Pick a career track to start building momentum. Practical courses with verified certifications.'
                        : 'Complete all course lessons and final assessments to view your earned credentials.'}
                    </p>
                  </div>
                  <Link href="/courses">
                    <button className="bg-[#80664f] hover:bg-[#5f4938] text-white text-xs font-bold px-6 py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer">
                      Explore All Courses
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
                        className="bg-white border border-[#e8e2db] rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#80664f] transition-all flex flex-col sm:flex-row items-stretch"
                      >
                        {/* Course Thumbnail */}
                        <div className="relative w-full sm:w-56 h-40 sm:h-auto shrink-0 bg-[#f4efe9]">
                          <Image
                            src={imgSrc}
                            alt={item.courseTitle}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2.5 left-2.5">
                            <span className="bg-[#241e1a]/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        {/* Course Body (Coursera Layout with Brand Colors) */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold tracking-wider text-[#8c8075] uppercase">
                              Skyrellac Professional Track
                            </span>
                            <h3 className="text-base font-bold text-[#241e1a] leading-snug hover:text-[#80664f] transition-colors">
                              {item.courseTitle}
                            </h3>
                            <p className="text-xs text-[#8c8075]">
                              {item.completedLessonsCount || 0} of {item.totalLessons || 10} modules finished
                            </p>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-[#544940]">Track Progress</span>
                              <span className="text-[#80664f]">{progress}%</span>
                            </div>
                            <div className="w-full bg-[#ede7e1] h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-[#80664f] h-full rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="flex items-center justify-between pt-2 border-t border-[#f4efe9]">
                            <div className="flex items-center gap-1.5 text-xs text-[#8c8075]">
                              <Clock className="w-3.5 h-3.5 text-[#80664f]" />
                              <span>Self-paced • Lifetime access</span>
                            </div>

                            {isPaid ? (
                              <Link href={`/learn/${item.courseId}/mod1-lesson1`}>
                                <button className="bg-[#80664f] hover:bg-[#5f4938] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer">
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
                                className="bg-[#198038] hover:bg-[#0e6027] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
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
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-[#8c8075] uppercase">
                    ACADEMIC TASKS
                  </span>
                  <h2 className="text-lg font-bold text-[#241e1a]">Upcoming Assignments & Assessments</h2>
                </div>
                <span className="text-xs font-bold text-[#80664f] bg-[#ede7e1] px-2.5 py-1 rounded">
                  {tasks.length} total tasks
                </span>
              </div>

              {tasks.length === 0 ? (
                <div className="bg-white border border-[#e8e2db] rounded-2xl p-10 text-center space-y-3 shadow-xs">
                  <p className="text-xs text-[#8c8075]">No active assignments or quizzes pending.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => {
                    const isSubmitted = task.status === 'submitted';
                    const isUnderReview = task.status === 'under-review';
                    const isApproved = task.status === 'approved';
                    const isRejected = task.status === 'rejected';
                    const isCompleted = task.status === 'completed';

                    let statusBadge = 'bg-[#f4efe9] text-[#544940] border-[#e8e2db]';
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
                        className="bg-white border border-[#e8e2db] p-4 rounded-xl shadow-xs space-y-3"
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isCompleted || isSubmitted || isUnderReview || isApproved}
                            onChange={() => toggleTask(task._id)}
                            className="mt-1 h-4 w-4 rounded text-[#80664f] accent-[#80664f] cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <h4
                              className={`text-xs font-bold ${
                                isCompleted || isApproved ? 'line-through text-[#8c8075]' : 'text-[#241e1a]'
                              }`}
                            >
                              {task.title}
                            </h4>
                            <div className="flex items-center gap-3 mt-1 text-[11px] text-[#8c8075]">
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
                            className="w-full text-center py-2 text-xs font-bold text-white bg-[#80664f] hover:bg-[#5f4938] rounded-lg transition-colors cursor-pointer"
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
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-[#8c8075] uppercase">
                    CAREER EXPERIENCE
                  </span>
                  <h2 className="text-lg font-bold text-[#241e1a]">Enrolled Internship Programs</h2>
                </div>
                <Link href="/internships" className="text-xs font-bold text-[#80664f] hover:underline flex items-center gap-1">
                  <span>Browse Internships</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {internshipEnrollments.length === 0 ? (
                <div className="bg-white border border-[#e8e2db] rounded-2xl p-10 text-center space-y-3 shadow-xs">
                  <p className="text-xs text-[#8c8075]">No active internship enrollments.</p>
                  <Link href="/internships">
                    <button className="bg-[#80664f] hover:bg-[#5f4938] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                      Explore Internships
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {internshipEnrollments.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white border border-[#e8e2db] p-5 rounded-xl shadow-xs flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#80664f] bg-[#ede7e1] px-2 py-0.5 rounded">
                          {item.organization}
                        </span>
                        <h3 className="text-sm font-bold text-[#241e1a]">{item.title}</h3>
                        <p className="text-xs text-[#8c8075]">Industry Mentored Capstone Program</p>
                      </div>
                      <Link href={`/internships/${item.internshipId}`}>
                        <button className="bg-[#f4efe9] hover:bg-[#ede7e1] text-[#241e1a] text-xs font-bold px-4 py-2 rounded-lg transition-colors">
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

        {/* ── RIGHT COLUMN: WEEKLY GOAL & CREDENTIALS ──────────── */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coursera-style Weekly Learning Habit Widget in Brand Colors */}
          <div className="bg-white border border-[#e8e2db] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#80664f]" />
                <h3 className="text-xs font-bold text-[#241e1a] uppercase tracking-wider">
                  Weekly Habit Tracker
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#80664f] bg-[#ede7e1] px-2 py-0.5 rounded">
                4 / 7 Days Active
              </span>
            </div>

            <p className="text-xs text-[#8c8075] leading-relaxed">
              Steady daily momentum helps master core concepts and complete career-ready credentials.
            </p>

            <div className="flex items-center justify-between pt-1">
              {daysOfWeek.map((d, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      d.completed
                        ? 'bg-[#80664f] text-white shadow-xs'
                        : 'bg-[#ede7e1] text-[#8c8075]'
                    }`}
                  >
                    {d.completed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : d.day}
                  </div>
                  <span className="text-[10px] text-[#8c8075] font-semibold">{d.full}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Progress Widget */}
          <div className="bg-white border border-[#e8e2db] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#241e1a] uppercase tracking-wider">
                Curriculum Progress
              </h3>
              <span className="text-xs font-bold text-[#80664f]">{overallCourseProgress}%</span>
            </div>
            <div className="w-full bg-[#ede7e1] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#80664f] h-full rounded-full transition-all duration-500"
                style={{ width: `${overallCourseProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-[#8c8075] pt-1 font-medium">
              <span>{totalCompletedLessons} modules finished</span>
              <span>{totalLessonsAllCourses} total</span>
            </div>
          </div>

          {/* Verifiable Credentials Box */}
          <div className="bg-white border border-[#e8e2db] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#80664f]" />
              <h3 className="text-xs font-bold text-[#241e1a] uppercase tracking-wider">
                Verifiable Credentials
              </h3>
            </div>
            <p className="text-xs text-[#8c8075] leading-relaxed">
              Earn an authenticated digital certificate upon passing each program assessment.
            </p>
            <Link href="/credentials">
              <button className="w-full bg-[#fbfaf8] hover:bg-[#f4efe9] text-[#241e1a] border border-[#e8e2db] text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1 mt-1 cursor-pointer">
                <span>View My Certificates</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>

          {/* Notifications / Updates */}
          <div className="bg-white border border-[#e8e2db] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#80664f]" />
              <h3 className="text-xs font-bold text-[#241e1a] uppercase tracking-wider">
                Recent Updates
              </h3>
            </div>
            {notifications.length === 0 ? (
              <p className="text-xs text-[#8c8075] py-2 text-center">No new notifications.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {notifications.slice(0, 3).map((n) => (
                  <div key={n._id} className="p-2.5 rounded-lg bg-[#fbfaf8] border border-[#e8e2db] space-y-0.5">
                    <p className="text-xs font-bold text-[#241e1a]">{n.title}</p>
                    <p className="text-[11px] text-[#8c8075] leading-snug line-clamp-2">{n.message}</p>
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
          <div className="bg-white border border-[#e8e2db] p-6 rounded-2xl max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center pb-2 border-b border-[#e8e2db]">
              <h3 className="text-sm font-bold text-[#241e1a]">Submit Assignment Work</h3>
              <button
                onClick={() => setSelectedTaskForSubmission(null)}
                className="text-[#8c8075] hover:text-[#241e1a] font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div>
              <p className="text-xs font-bold text-[#241e1a]">{selectedTaskForSubmission.title}</p>
              <p className="text-[11px] text-[#8c8075] mt-0.5">
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
                className="w-full border border-[#e8e2db] rounded-xl p-3 text-xs focus:outline-none focus:border-[#80664f] text-[#241e1a] placeholder:text-[#8c8075]"
              />
              <button
                type="submit"
                disabled={isSubmittingTask}
                className="w-full bg-[#80664f] hover:bg-[#5f4938] text-white text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
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
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#8c8075]">Loading dashboard...</div>}>
      <StudentDashboardContent />
    </Suspense>
  );
}
