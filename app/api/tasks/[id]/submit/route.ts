import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Task } from '@/models/Task';
import { TaskSubmission } from '@/models/TaskSubmission';
import { InternshipEnrollment } from '@/models/InternshipEnrollment';
import { Notification } from '@/models/Notification';
import { requireAuth } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    const { submissionType, submissionContent } = await req.json();

    if (!submissionContent || !submissionContent.trim()) {
      return NextResponse.json({ error: 'Submission content or link is required.' }, { status: 400 });
    }

    await connectToDatabase();

    const task = await Task.findOne({ _id: id, userId: user!.id });
    if (!task) {
      return NextResponse.json({ error: 'Assigned task not found.' }, { status: 404 });
    }

    const submissionId = 'SUB-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    const submission = await TaskSubmission.create({
      submissionId,
      taskId: task.title,
      userId: user!.id,
      userName: user!.name,
      courseId: task.courseId || '',
      internshipId: task.internshipId || '',
      submissionType: submissionType || 'text',
      submissionContent,
      submittedAt: new Date(),
      status: 'Submitted',
    });

    task.status = 'submitted';
    await task.save();

    // If internship task, update internship enrollment taskProgress status
    if (task.internshipId) {
      await InternshipEnrollment.updateOne(
        { userId: user!.id, internshipId: task.internshipId, 'taskProgress.taskId': task.title },
        { $set: { 'taskProgress.$.status': 'Submitted', 'taskProgress.$.submissionId': submissionId } }
      );
    }

    // Create Notification
    await Notification.create({
      userId: user!.id,
      title: 'Task Submission Received',
      message: `Your work for task "${task.title}" has been submitted and is currently pending admin review.`,
      type: 'task-assigned',
      relatedId: task._id.toString(),
    });

    return NextResponse.json({ message: 'Task submitted successfully!', submission }, { status: 201 });
  } catch (error: any) {
    console.error('Task submission error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit task work' }, { status: 500 });
  }
}
