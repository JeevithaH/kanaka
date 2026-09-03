import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Enrollment } from '@/models/Enrollment';
import { InternshipEnrollment } from '@/models/InternshipEnrollment';
import { Course } from '@/models/Course';
import { Internship } from '@/models/Internship';
import { Task } from '@/models/Task';
import { TaskSubmission } from '@/models/TaskSubmission';
import { Notification } from '@/models/Notification';
import { Certificate } from '@/models/Certificate';
import { TestAttempt } from '@/models/TestAttempt';
import { requireAuth } from '@/lib/auth';
import { seedCoursesIfEmpty } from '@/lib/seedCourses';

export const dynamic = 'force-dynamic';

const DEFAULT_COURSE_METAS: Record<string, { title: string; category: string; image: string; lessons: number }> = {
  'ai-fundamentals': {
    title: 'Artificial Intelligence Fundamentals',
    category: 'Artificial Intelligence',
    image: '/images/ai.jpg',
    lessons: 16,
  },
  'full-stack-web-engineering': {
    title: 'Full-Stack Modern Web Engineering',
    category: 'Web Development',
    image: '/images/web.jpg',
    lessons: 20,
  },
  'data-science-sql-analytics': {
    title: 'Applied Data Science & SQL Analytics',
    category: 'Data Science',
    image: '/images/data_science.jpg',
    lessons: 14,
  },
  'cybersecurity-principles': {
    title: 'Cybersecurity Principles & Practice',
    category: 'Cybersecurity',
    image: '/images/cyber_security.jpg',
    lessons: 12,
  },
};

export async function GET(req: Request) {
  try {
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    await connectToDatabase();
    try {
      await seedCoursesIfEmpty();
    } catch {}

    const userEmail = (user!.email || '').toLowerCase().trim();
    const deterministicId = userEmail ? 'usr_' + Buffer.from(userEmail).toString('hex').substring(0, 16) : '';
    const userIds = Array.from(new Set([user!.id, user!.email, userEmail, deterministicId].filter(Boolean)));

    // Fetch all user enrollments and data concurrently across both user.id and user.email
    const [
      courseEnrollments,
      internshipEnrollments,
      tasks,
      taskSubmissions,
      notifications,
      certificates,
      testAttempts,
    ] = await Promise.all([
      Enrollment.find({ userId: { $in: userIds } }).sort({ createdAt: -1 }),
      InternshipEnrollment.find({ userId: { $in: userIds } }).sort({ createdAt: -1 }),
      Task.find({ userId: { $in: userIds } }).sort({ dueDate: 1 }),
      TaskSubmission.find({ userId: { $in: userIds } }).sort({ submittedAt: -1 }),
      Notification.find({ userId: { $in: userIds } }).sort({ createdAt: -1 }).limit(10),
      Certificate.find({ userId: { $in: userIds } }).sort({ issueDate: -1 }),
      TestAttempt.find({ userId: { $in: userIds } }).sort({ createdAt: -1 }),
    ]);

    // Enrich Course Enrollments with course meta
    const courseIds = (courseEnrollments || []).map((e: any) => e.courseId).filter(Boolean);
    let courses: any[] = [];
    if (courseIds.length > 0) {
      try {
        courses = await Course.find({ courseId: { $in: courseIds } });
      } catch {}
    }
    const courseMap = new Map<string, any>((courses || []).map((c: any) => [c.courseId, c]));

    const enrichedCourseEnrollments = (courseEnrollments || []).map((e: any) => {
      const course = courseMap.get(e.courseId);
      const defaultMeta = DEFAULT_COURSE_METAS[e.courseId] || {
        title: e.courseId.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        category: 'Technology',
        image: '/images/ai.jpg',
        lessons: 12,
      };

      const totalLessons = course?.lessonCount || defaultMeta.lessons;
      const completedCount = (e.completedLessons || []).length;
      const remainingCount = Math.max(0, totalLessons - completedCount);
      const calculatedProgress = Math.round((completedCount / totalLessons) * 100);

      return {
        _id: e._id || e.id,
        courseId: e.courseId,
        courseTitle: course?.title || defaultMeta.title,
        category: course?.category || defaultMeta.category,
        image: course?.image || defaultMeta.image,
        totalLessons,
        completedLessonsCount: completedCount,
        remainingLessonsCount: remainingCount,
        progressPercentage: Math.max(e.progressPercentage || 0, calculatedProgress),
        paymentStatus: e.paymentStatus || 'paid',
        amountPaid: e.amountPaid || 199,
        testStatus: e.testStatus || [],
        certificateStatus: e.certificateStatus || { eligible: false, issued: false },
      };
    });

    // Enrich Internship Enrollments with internship meta
    const internshipIds = (internshipEnrollments || []).map((ie: any) => ie.internshipId).filter(Boolean);
    let internships: any[] = [];
    if (internshipIds.length > 0) {
      try {
        internships = await Internship.find({ internshipId: { $in: internshipIds } });
      } catch {}
    }
    const internshipMap = new Map<string, any>((internships || []).map((i: any) => [i.internshipId, i]));

    const enrichedInternshipEnrollments = (internshipEnrollments || []).map((ie: any) => {
      const internship = internshipMap.get(ie.internshipId);
      return {
        _id: ie._id || ie.id,
        internshipId: ie.internshipId,
        title: internship?.title || ie.internshipId,
        organization: internship?.organization || 'Skyrellac Innovation Labs',
        mode: internship?.mode || 'Remote',
        durationWeeks: internship?.durationWeeks || 8,
        status: ie.status || 'active',
        progressPercentage: ie.progressPercentage || 0,
        validationStatus: ie.validationStatus || 'pending',
        validationFee: internship?.validationFee || 499,
        taskProgress: ie.taskProgress || [],
        certificateStatus: ie.certificateStatus || { eligible: false, issued: false },
      };
    });

    return NextResponse.json({
      user,
      courseEnrollments: enrichedCourseEnrollments,
      internshipEnrollments: enrichedInternshipEnrollments,
      tasks: tasks || [],
      taskSubmissions: taskSubmissions || [],
      notifications: notifications || [],
      certificates: certificates || [],
      testAttempts: testAttempts || [],
    });
  } catch (error: any) {
    console.error('Dashboard data aggregation error:', error);
    return NextResponse.json({ error: 'Failed to aggregate dashboard metrics' }, { status: 500 });
  }
}
