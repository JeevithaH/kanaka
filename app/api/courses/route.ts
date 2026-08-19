import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Course } from '@/models/Course';
import { seedCoursesIfEmpty } from '@/lib/seedCourses';

export async function GET() {
  try {
    await connectToDatabase();
    await seedCoursesIfEmpty();
    const courses = await Course.find({ isPublished: true })
      .select('-modules -tests -__v')
      .sort({ studentsCount: -1 });
    return NextResponse.json({ courses });
  } catch (error: any) {
    console.error('Courses fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}
