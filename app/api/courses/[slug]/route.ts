import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Course } from '@/models/Course';
import { seedCoursesIfEmpty, SEED_COURSES } from '@/lib/seedCourses';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    await connectToDatabase();
    try {
      await seedCoursesIfEmpty();
    } catch {}

    let course = await Course.findOne({ courseId: slug });
    if (!course) {
      course = SEED_COURSES.find((c: any) => c.courseId === slug);
    }

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    return NextResponse.json({ course });
  } catch (error: any) {
    console.error('Course fetch error:', error);
    const { slug } = await params;
    const fallback = SEED_COURSES.find((c: any) => c.courseId === slug);
    if (fallback) {
      return NextResponse.json({ course: fallback });
    }
    return NextResponse.json({ error: 'Failed to fetch course details' }, { status: 500 });
  }
}
