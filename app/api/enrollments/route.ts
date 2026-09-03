import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Enrollment } from '@/models/Enrollment';
import { Course } from '@/models/Course';
import { Task } from '@/models/Task';
import { seedCoursesIfEmpty } from '@/lib/seedCourses';

export const dynamic = 'force-dynamic';

function getUserFromCookie(req: Request) {
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/skyrellac_session=([^;]+)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const user = getUserFromCookie(req);
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    try {
      await seedCoursesIfEmpty();
    } catch {}

    const userEmail = (user.email || '').toLowerCase().trim();
    const deterministicId = userEmail ? 'usr_' + Buffer.from(userEmail).toString('hex').substring(0, 16) : '';
    const userIds = Array.from(new Set([user.id, user.email, userEmail, deterministicId].filter(Boolean)));
    const enrollments = await Enrollment.find({ userId: { $in: userIds } }).sort({ createdAt: -1 });

    // Attach course details to each enrollment
    const courseIds = (enrollments || []).map((e: any) => e.courseId).filter(Boolean);
    let courses: any[] = [];
    if (courseIds.length > 0) {
      try {
        courses = await Course.find({ courseId: { $in: courseIds } });
      } catch {}
    }

    const courseMap = new Map();
    (courses || []).forEach((c: any) => courseMap.set(c.courseId, c));

    const enrichedEnrollments = (enrollments || []).map((e: any) => {
      const course = courseMap.get(e.courseId);
      const titleFallback = (e.courseId || '').replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

      return {
        ...(typeof e.toObject === 'function' ? e.toObject() : e),
        courseTitle: course?.title || titleFallback,
        category: course?.category || 'General',
        image: course?.image || '/images/ai.jpg',
        totalLessons: course?.lessonCount || 12,
      };
    });

    return NextResponse.json({ enrollments: enrichedEnrollments });
  } catch (error: any) {
    console.error('Fetch enrollments error:', error);
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = getUserFromCookie(req);
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized. Please log in to enroll.' }, { status: 401 });
    }

    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required.' }, { status: 400 });
    }

    await connectToDatabase();
    try {
      await seedCoursesIfEmpty();
    } catch {}

    // Check course exists
    let course = await Course.findOne({ courseId });
    if (!course) {
      course = {
        courseId,
        title: courseId.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        originalPrice: 1999,
        studentsCount: 100,
      };
    }

    const userIds = Array.from(new Set([user.id, user.email].filter(Boolean)));

    // Check existing enrollment
    const existing = await Enrollment.findOne({ userId: { $in: userIds }, courseId });
    if (existing) {
      return NextResponse.json({ message: 'Already enrolled', enrollment: existing }, { status: 200 });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      userId: user.id,
      courseId,
      enrollmentDate: new Date().toISOString(),
      status: 'active',
      paymentStatus: 'paid',
      progressPercentage: 0,
      completedLessons: [],
      testStatus: [],
      certificateStatus: { eligible: false, issued: false },
    });

    // Create 3 default course tasks
    try {
      await Task.insertMany([
        {
          userId: user.id,
          courseId,
          courseTitle: course.title,
          title: `Complete all lessons in Module 1 for ${course.title}`,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
        },
        {
          userId: user.id,
          courseId,
          courseTitle: course.title,
          title: `Take the final assessment for ${course.title}`,
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
        },
        {
          userId: user.id,
          courseId,
          courseTitle: course.title,
          title: `Submit course feedback for ${course.title}`,
          dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
        },
      ]);
    } catch {}

    return NextResponse.json({ message: 'Enrolled successfully!', enrollment }, { status: 201 });
  } catch (error: any) {
    console.error('Enrollment creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create enrollment' }, { status: 500 });
  }
}
