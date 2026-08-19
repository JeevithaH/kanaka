import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Course } from '@/models/Course';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    await connectToDatabase();
    const courses = await Course.find().sort({ createdAt: -1 });
    return NextResponse.json({ courses });
  } catch (error: any) {
    console.error('Fetch admin courses error:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();

    if (!body.title || !body.courseId || !body.description) {
      return NextResponse.json({ error: 'Title, Course ID, and Description are required.' }, { status: 400 });
    }

    await connectToDatabase();

    const existing = await Course.findOne({ courseId: body.courseId });
    if (existing) {
      return NextResponse.json({ error: 'A course with this Course ID / slug already exists.' }, { status: 409 });
    }

    const course = await Course.create({
      courseId: body.courseId,
      title: body.title,
      description: body.description,
      instructor: body.instructor || { name: 'Skyrellac Expert', title: 'Senior Tech Lead' },
      image: body.image || '',
      originalPrice: body.originalPrice || 1999,
      category: body.category || 'Technology',
      difficulty: body.difficulty || 'Foundational',
      durationMinutes: body.durationMinutes || 240,
      lessonCount: body.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 12,
      certificateEligible: body.certificateEligible !== false,
      isPublished: body.isPublished !== false,
      skills: body.skills || [],
      modules: body.modules || [],
      tests: body.tests || [],
    });

    return NextResponse.json({ message: 'Course created successfully!', course }, { status: 201 });
  } catch (error: any) {
    console.error('Create course error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create course' }, { status: 500 });
  }
}
