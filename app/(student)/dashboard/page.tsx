'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { CourseCheckoutModal } from '@/components/payments/CourseCheckoutModal';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  Briefcase,
  AlertCircle,
  Bell,
  ArrowRight,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CourseEnrollmentData {
  _id: string;
  courseId: string;
  courseTitle: string;
  category: string;
  totalLessons: number;
  completedLessonsCount: number;
  remainingLessonsCount: number;
  progressPercentage: number;
  paymentStatus: 'pending' | 'paid';
  amountPaid: number;
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
  mode: string;
  durationWeeks: number;
  status: string;
  progressPercentage: number;
  validationStatus: 'pending' | 'paid' | 'validated';
  validationFee: number;
  taskProgress: Array<{
    taskId: string;
    status: string;
    score?: number;
    feedback?: string;
  }>;
}

interface TaskData {
  _id: string;
  taskId?: string;
  courseId?: string;
  internshipId?: string;
  courseTitle?: string;
  title: string;
  description?: string;
  instructions?: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'submitted' | 'under-review' | 'approved' | 'rejected';
}

interface NotificationData {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [courseEnrollments, setCourseEnrollments] = useState<CourseEnrollmentData[]>([]);
  const [internshipEnrollments, setInternshipEnrollments] = useState<InternshipEnrollmentData[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selected task submission modal
  const [selectedTaskForSubmission, setSelectedTaskForSubmission] = useState<TaskData | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  // Course Checkout modal
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
      console.error('Error fetching student dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
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

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskForSubmission || !submissionText.trim()) return;

    setIsSubmittingTask(true);
    try {
      const res = await fetch(`/api/tasks/${selectedTaskForSubmission._id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionType: 'text',
          submissionContent: submissionText,
        }),
      });

      if (res.ok) {
        alert('Task submitted successfully for review!');
        setSelectedTaskForSubmission(null);
        setSubmissionText('');
        fetchDashboardData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to submit task');
      }
    } catch {
      alert('Network error while submitting task');
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const handlePaymentSuccess = () => {
    fetchDashboardData();
  };

  const totalCompletedLessons = courseEnrollments.reduce((acc, c) => acc + c.completedLessonsCount, 0);
  const totalLessonsAllCourses = courseEnrollments.reduce((acc, c) => acc + c.totalLessons, 0);
  const overallCourseProgress = totalLessonsAllCourses > 0
    ? Math.round((totalCompletedLessons / totalLessonsAllCourses) * 100)
    : 0;

  const paidCoursesCount = courseEnrollments.filter((c) => c.paymentStatus === 'paid').length;
  const issuedCertsCount = courseEnrollments.filter((c) => c.certificateStatus?.issued).length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 lg:p-8 font-sans">
      {/* Real-Time Personalized User Header */}
      <div className="bg-white border border-slate-200 p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-soft-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full font-bold border border-blue-200">
              Student ID: {user?.id || 'N/A'}
            </span>
            <span className="text-xs uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-bold border border-emerald-200">
              Account Active
            </span>
          </div>
          <h1 className="text-slate-900 font-black text-3xl lg:text-4xl pt-1">
            Welcome back, {user?.name || 'Learner'}
          </h1>
          <p className="text-slate-500 text-sm">
            {user?.email} • Real-Time Personalized Student Operations Center
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/courses">
            <Button variant="glow" size="md">
              + Browse Catalog
            </Button>
          </Link>
          <Link href="/internships">
            <Button variant="secondary" size="md">
              Explore Internships
            </Button>
          </Link>
        </div>
      </div>

      {/* Dynamic Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-soft-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Enrolled Courses</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{courseEnrollments.length}</p>
          <p className="text-xs text-slate-500 font-medium">
            {paidCoursesCount} Paid & Unlocked
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-soft-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Lesson Progress</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{overallCourseProgress}%</p>
          <p className="text-xs text-slate-500 font-medium">
            {totalCompletedLessons} / {totalLessonsAllCourses} Lessons Completed
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-soft-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Active Internships</span>
            <Briefcase className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{internshipEnrollments.length}</p>
          <p className="text-xs text-slate-500 font-medium">
            {internshipEnrollments.filter((i) => i.validationStatus === 'paid').length} Validated Services
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-soft-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Certificates Issued</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{issuedCertsCount}</p>
          <p className="text-xs text-slate-500 font-medium">
            Verified Digital Credentials
          </p>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Courses & Internships */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Enrolled Courses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-slate-900 font-bold text-xl flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Enrolled Courses & Progress</span>
              </h2>
              <Link href="/courses" className="text-blue-600 text-xs font-bold hover:underline">
                View Catalog →
              </Link>
            </div>

            {isLoading ? (
              <div className="bg-white border border-slate-200 p-8 text-center text-sm text-slate-500 rounded-2xl">
                Loading courses from database...
              </div>
            ) : courseEnrollments.length === 0 ? (
              <div className="bg-white border border-slate-200 p-8 text-center space-y-3 rounded-2xl">
                <p className="text-sm text-slate-600">You are not enrolled in any courses yet.</p>
                <Link href="/courses">
                  <Button variant="glow" size="sm">Explore & Enroll</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {courseEnrollments.map((item) => {
                  const isPaid = item.paymentStatus === 'paid';
                  return (
                    <div
                      key={item._id}
                      className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-soft-sm hover:border-slate-300 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                              {item.category}
                            </span>
                            {isPaid ? (
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 font-bold rounded border border-emerald-200">
                                Paid & Unlocked ✓
                              </span>
                            ) : (
                              <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 font-bold rounded border border-rose-200">
                                Payment Pending (₹1,999)
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-bold text-slate-900 mt-1">{item.courseTitle}</h3>
                        </div>

                        {/* Action buttons */}
                        <div>
                          {isPaid ? (
                            <Link href={`/learn/${item.courseId}/mod1-lesson1`}>
                              <Button variant="glow" size="sm">
                                <span>Continue Learning</span>
                                <ArrowRight className="w-3.5 h-3.5 ml-1" />
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              onClick={() =>
                                setCheckoutCourse({
                                  courseId: item.courseId,
                                  courseTitle: item.courseTitle,
                                  originalPrice: 1999,
                                })
                              }
                              variant="glow"
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                            >
                              💳 Pay ₹1,999 to Unlock (Coupon Code)
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Course Breakdown Metrics */}
                      <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
                        <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                          <span>Progress: {item.progressPercentage}%</span>
                          <span>Completed: {item.completedLessonsCount} / {item.totalLessons} lessons ({item.remainingLessonsCount} remaining)</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full transition-all duration-300"
                            style={{ width: `${item.progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Internship Enrollments & Tasks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-slate-900 font-bold text-xl flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <span>Internship Programs & Task Submissions</span>
              </h2>
              <Link href="/internships" className="text-purple-600 text-xs font-bold hover:underline">
                View Opportunities →
              </Link>
            </div>

            {internshipEnrollments.length === 0 ? (
              <div className="bg-white border border-slate-200 p-8 text-center space-y-3 rounded-2xl">
                <p className="text-sm text-slate-600">You are not participating in any internship programs.</p>
                <Link href="/internships">
                  <Button variant="secondary" size="sm">Explore Free Internships</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {internshipEnrollments.map((item) => (
                  <div key={item._id} className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-soft-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                            {item.organization}
                          </span>
                          {item.validationStatus === 'paid' ? (
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 font-bold rounded border border-emerald-200">
                              Validation Active ✓
                            </span>
                          ) : (
                            <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 font-bold rounded border border-amber-200">
                              Validation Pending (₹{item.validationFee})
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mt-1">{item.title}</h3>
                      </div>

                      <Link href={`/internships/${item.internshipId}`}>
                        <Button variant="secondary" size="sm">Program Details</Button>
                      </Link>
                    </div>

                    {/* Task list for this internship */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-500 uppercase">Assigned Tasks</h4>
                      {item.taskProgress?.length === 0 ? (
                        <p className="text-xs text-slate-400">No tasks assigned yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {item.taskProgress?.map((tp) => (
                            <div key={tp.taskId} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between text-xs">
                              <div className="font-semibold text-slate-800">Task ID: {tp.taskId}</div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-700 bg-white px-2 py-1 rounded border border-slate-200">
                                  Status: {tp.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right 1 Column: Task Checklist & System Notifications */}
        <div className="space-y-8">
          
          {/* Tasks & Assignments Checklist */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-soft-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Assigned Tasks Checklist</span>
            </h3>

            {tasks.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No pending tasks or deadlines.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {tasks.map((task) => (
                  <div key={task._id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed' || task.status === 'submitted'}
                        onChange={() => toggleTask(task._id)}
                        className="mt-0.5 rounded text-blue-600 cursor-pointer"
                      />
                      <div className="flex-1 space-y-1">
                        <p className={`text-xs font-bold ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {task.title}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedTaskForSubmission(task)}
                      className="w-full text-center py-1 text-[11px] font-bold text-blue-600 hover:bg-blue-50 rounded transition-colors border border-blue-200"
                    >
                      Submit Task Work →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Real-Time Notifications */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-soft-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <span>Notifications & Alerts</span>
            </h3>

            {notifications.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No system notifications yet.</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n._id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-slate-600">{n.message}</p>
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
          <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Submit Work for Task</h3>
              <button onClick={() => setSelectedTaskForSubmission(null)} className="text-slate-400 font-bold">✕</button>
            </div>
            <p className="text-xs text-slate-600 font-semibold">{selectedTaskForSubmission.title}</p>
            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <textarea
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Paste your GitHub repository link, live demo URL, or summary of completed work..."
                rows={5}
                required
                className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-600"
              />
              <Button type="submit" disabled={isSubmittingTask} variant="glow" size="md" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                <span>{isSubmittingTask ? 'Submitting Work...' : 'Submit Task for Review'}</span>
              </Button>
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
