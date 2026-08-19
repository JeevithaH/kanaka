import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Enrollment } from '@/models/Enrollment';
import { Course } from '@/models/Course';

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

export async function POST(req: Request) {
  try {
    const user = getUserFromCookie(req);
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, lessonId } = await req.json();
    if (!courseId || !lessonId) {
      return NextResponse.json({ error: 'Course ID and Lesson ID are required.' }, { status: 400 });
    }

    await connectToDatabase();

    const enrollment = await Enrollment.findOne({ userId: user.id, courseId });
    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment record not found.' }, { status: 404 });
    }

    const course = await Course.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
    }

    // Add lesson if not already completed
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    // Total lessons count
    let totalLessonsCount = 0;
    course.modules.forEach((mod) => {
      totalLessonsCount += mod.lessons.length;
    });
    if (totalLessonsCount === 0) totalLessonsCount = course.lessonCount || 1;

    // Recalculate percentage
    const progress = Math.min(100, Math.round((enrollment.completedLessons.length / totalLessonsCount) * 100));
    enrollment.progressPercentage = progress;

    if (progress === 100) {
      enrollment.status = 'completed';
      enrollment.certificateStatus.eligible = true;
    }

    await enrollment.save();

    return NextResponse.json({
      message: 'Progress updated successfully',
      progressPercentage: progress,
      completedLessons: enrollment.completedLessons,
    });
  } catch (error: any) {
    console.error('Progress update error:', error);
    return NextResponse.json({ error: 'Failed to update lesson progress' }, { status: 500 });
  }
}
