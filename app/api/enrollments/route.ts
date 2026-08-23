import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Enrollment } from '@/models/Enrollment';
import { Course } from '@/models/Course';
import { Task } from '@/models/Task';

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
    const enrollments = await Enrollment.find({ userId: user.id }).sort({ createdAt: -1 });

    // Attach course details to each enrollment
    const courseIds = enrollments.map((e: any) => e.courseId);
    const courses = await Course.find({ courseId: { $in: courseIds } }).select('courseId title category image lessonCount');

    const courseMap = new Map();
    (courses as any[]).forEach((c: any) => courseMap.set(c.courseId, c));

    const enrichedEnrollments = enrollments.map((e: any) => {
      const course = courseMap.get(e.courseId);
      return {
        ...e.toObject(),
        courseTitle: course?.title || e.courseId,
        category: course?.category || 'General',
        image: course?.image || '',
        totalLessons: course?.lessonCount || 0,
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

    // Check course exists
    const course = await Course.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
    }

    // Check existing enrollment
    const existing = await Enrollment.findOne({ userId: user.id, courseId });
    if (existing) {
      return NextResponse.json({ message: 'Already enrolled', enrollment: existing }, { status: 200 });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      userId: user.id,
      courseId,
      enrollmentDate: new Date(),
      status: 'active',
      progressPercentage: 0,
      completedLessons: [],
      testStatus: [],
      certificateStatus: { eligible: false, issued: false },
    });

    // Create 3 default course tasks
    await Task.create([
      {
        userId: user.id,
        courseId,
        courseTitle: course.title,
        title: `Complete all lessons in Module 1 for ${course.title}`,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'pending',
      },
      {
        userId: user.id,
        courseId,
        courseTitle: course.title,
        title: `Take the final assessment for ${course.title}`,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'pending',
      },
      {
        userId: user.id,
        courseId,
        courseTitle: course.title,
        title: `Submit course feedback for ${course.title}`,
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        status: 'pending',
      },
    ]);

    // Increment course studentsCount
    course.studentsCount += 1;
    await course.save();

    return NextResponse.json({ message: 'Enrolled successfully!', enrollment }, { status: 201 });
  } catch (error: any) {
    console.error('Enrollment creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create enrollment' }, { status: 500 });
  }
}
