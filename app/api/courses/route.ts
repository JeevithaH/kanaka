import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Course } from '@/models/Course';
import { seedCoursesIfEmpty, SEED_COURSES } from '@/lib/seedCourses';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    try {
      await seedCoursesIfEmpty();
    } catch {}

    let courses = await Course.find();
    if (!courses || courses.length === 0) {
      courses = SEED_COURSES;
    }
    return NextResponse.json({ courses });
  } catch (error: any) {
    console.error('Courses fetch error:', error);
    return NextResponse.json({ courses: SEED_COURSES });
  }
}
