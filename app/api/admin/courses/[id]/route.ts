import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Course } from '@/models/Course';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    await connectToDatabase();
    const course = await Course.findOne({ $or: [{ courseId: params.id }, { _id: params.id }] });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    return NextResponse.json({ course });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const updates = await req.json();

    await connectToDatabase();
    const course = await Course.findOneAndUpdate(
      { $or: [{ courseId: params.id }, { _id: params.id }] },
      updates,
      { new: true }
    );

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Course updated successfully!', course });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    await connectToDatabase();
    await Course.deleteOne({ $or: [{ courseId: params.id }, { _id: params.id }] });

    return NextResponse.json({ message: 'Course deleted successfully!' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
