import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Course } from '@/models/Course';
import { seedCoursesIfEmpty } from '@/lib/seedCourses';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    await connectToDatabase();
    await seedCoursesIfEmpty();
    const course = await Course.findOne({ courseId: slug, isPublished: true }).select('-__v');
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    return NextResponse.json({ course });
  } catch (error: any) {
    console.error('Course fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch course details' }, { status: 500 });
  }
}
