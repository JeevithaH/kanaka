import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Internship } from '@/models/Internship';
import { InternshipEnrollment } from '@/models/InternshipEnrollment';
import { Task } from '@/models/Task';
import { Notification } from '@/models/Notification';
import { requireAuth } from '@/lib/auth';
import { seedInternshipsIfEmpty } from '@/lib/seedInternships';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    await seedInternshipsIfEmpty();

    const internship = await Internship.findOne({
      $or: [{ internshipId: params.id }, { _id: params.id }],
      isPublished: true,
    });

    if (!internship) {
      return NextResponse.json({ error: 'Internship program not found' }, { status: 404 });
    }

    return NextResponse.json({ internship });
  } catch (error: any) {
    console.error('Fetch internship error:', error);
    return NextResponse.json({ error: 'Failed to fetch internship program' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    await connectToDatabase();
    await seedInternshipsIfEmpty();

    const internship = await Internship.findOne({
      $or: [{ internshipId: params.id }, { _id: params.id }],
    });

    if (!internship) {
      return NextResponse.json({ error: 'Internship not found' }, { status: 404 });
    }

    // Check existing enrollment
    let enrollment = await InternshipEnrollment.findOne({
      userId: user!.id,
      internshipId: internship.internshipId,
    });

    if (enrollment) {
      return NextResponse.json(
        { message: 'Already enrolled in this internship', enrollment },
        { status: 200 }
      );
    }

    // Prepare task progress array
    const initialTaskProgress = (internship.tasks || []).map((t) => ({
      taskId: t.taskId,
      status: 'Not Started' as const,
    }));

    // Free enrollment creation
    enrollment = await InternshipEnrollment.create({
      userId: user!.id,
      internshipId: internship.internshipId,
      enrollmentDate: new Date(),
      status: 'active',
      progressPercentage: 0,
      validationStatus: 'pending',
      validationAmountPaid: 0,
      taskProgress: initialTaskProgress,
      certificateStatus: { eligible: false, issued: false },
    });

    // Create user tasks for each internship task
    const userTasks = (internship.tasks || []).map((t) => ({
      userId: user!.id,
      internshipId: internship.internshipId,
      courseTitle: internship.title,
      title: `${internship.title}: ${t.title}`,
      description: t.description,
      instructions: t.instructions,
      dueDate: new Date(Date.now() + (t.deadlineDays || 7) * 24 * 60 * 60 * 1000),
      status: 'pending',
      submissionRequired: true,
      maxScore: t.maxScore || 100,
    }));

    if (userTasks.length > 0) {
      await Task.insertMany(userTasks);
    }

    // Create notification
    await Notification.create({
      userId: user!.id,
      title: 'Internship Enrolled Successfully',
      message: `You have successfully joined the "${internship.title}" program for free. Assigned tasks are now visible on your dashboard!`,
      type: 'internship',
      relatedId: internship.internshipId,
    });

    return NextResponse.json(
      { message: 'Enrolled in internship program successfully!', enrollment },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Internship enrollment error:', error);
    return NextResponse.json({ error: error.message || 'Failed to enroll in internship' }, { status: 500 });
  }
}
