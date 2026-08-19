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

export async function GET(req: Request) {
  try {
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    await connectToDatabase();

    const userId = user!.id;

    // Fetch all user enrollments and data concurrently
    const [
      courseEnrollments,
      internshipEnrollments,
      tasks,
      taskSubmissions,
      notifications,
      certificates,
      testAttempts,
    ] = await Promise.all([
      Enrollment.find({ userId }).sort({ createdAt: -1 }),
      InternshipEnrollment.find({ userId }).sort({ createdAt: -1 }),
      Task.find({ userId }).sort({ dueDate: 1 }),
      TaskSubmission.find({ userId }).sort({ submittedAt: -1 }),
      Notification.find({ userId }).sort({ createdAt: -1 }).limit(10),
      Certificate.find({ userId }).sort({ issueDate: -1 }),
      TestAttempt.find({ userId }).sort({ createdAt: -1 }),
    ]);

    // Enrich Course Enrollments with course meta
    const courseIds = courseEnrollments.map((e) => e.courseId);
    const courses = await Course.find({ courseId: { $in: courseIds } });
    const courseMap = new Map(courses.map((c) => [c.courseId, c]));

    const enrichedCourseEnrollments = courseEnrollments.map((e) => {
      const course = courseMap.get(e.courseId);
      const totalLessons = course?.lessonCount || 12;
      const completedCount = (e.completedLessons || []).length;
      const remainingCount = Math.max(0, totalLessons - completedCount);
      const calculatedProgress = Math.round((completedCount / totalLessons) * 100);

      return {
        _id: e._id,
        courseId: e.courseId,
        courseTitle: course?.title || e.courseId,
        category: course?.category || 'General',
        image: course?.image || '',
        totalLessons,
        completedLessonsCount: completedCount,
        remainingLessonsCount: remainingCount,
        progressPercentage: Math.max(e.progressPercentage || 0, calculatedProgress),
        paymentStatus: e.paymentStatus || 'pending',
        amountPaid: e.amountPaid || 0,
        testStatus: e.testStatus || [],
        certificateStatus: e.certificateStatus || { eligible: false, issued: false },
      };
    });

    // Enrich Internship Enrollments with internship meta
    const internshipIds = internshipEnrollments.map((ie) => ie.internshipId);
    const internships = await Internship.find({ internshipId: { $in: internshipIds } });
    const internshipMap = new Map(internships.map((i) => [i.internshipId, i]));

    const enrichedInternshipEnrollments = internshipEnrollments.map((ie) => {
      const internship = internshipMap.get(ie.internshipId);
      return {
        _id: ie._id,
        internshipId: ie.internshipId,
        title: internship?.title || ie.internshipId,
        organization: internship?.organization || 'Skyrellac Innovation Labs',
        mode: internship?.mode || 'Remote',
        durationWeeks: internship?.durationWeeks || 8,
        status: ie.status,
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
      tasks,
      taskSubmissions,
      notifications,
      certificates,
      testAttempts,
    });
  } catch (error: any) {
    console.error('Dashboard data aggregation error:', error);
    return NextResponse.json({ error: 'Failed to aggregate dashboard metrics' }, { status: 500 });
  }
}
