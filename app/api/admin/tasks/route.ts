import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Task } from '@/models/Task';
import { TaskSubmission } from '@/models/TaskSubmission';
import { Notification } from '@/models/Notification';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    await connectToDatabase();

    const [tasks, submissions] = await Promise.all([
      Task.find().sort({ createdAt: -1 }),
      TaskSubmission.find().sort({ submittedAt: -1 }),
    ]);

    return NextResponse.json({ tasks, submissions });
  } catch (error: any) {
    console.error('Fetch admin tasks error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin tasks' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { user, errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { userId, title, description, instructions, priority, dueDate, courseId, internshipId } =
      await req.json();

    if (!userId || !title) {
      return NextResponse.json({ error: 'Target User ID and Task Title are required.' }, { status: 400 });
    }

    await connectToDatabase();

    const task = await Task.create({
      userId,
      title,
      description: description || '',
      instructions: instructions || '',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      assignedBy: user!.name,
      courseId: courseId || '',
      internshipId: internshipId || '',
      status: 'pending',
      submissionRequired: true,
    });

    // Notify target user
    await Notification.create({
      userId,
      title: 'New Personalized Task Assigned',
      message: `Admin assigned a new task: "${title}". Due date: ${new Date(task.dueDate).toLocaleDateString()}`,
      type: 'task-assigned',
      relatedId: task._id.toString(),
    });

    return NextResponse.json({ message: 'Task assigned to user successfully!', task }, { status: 201 });
  } catch (error: any) {
    console.error('Assign task error:', error);
    return NextResponse.json({ error: error.message || 'Failed to assign task' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { user, errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { submissionId, status, score, feedback } = await req.json();

    if (!submissionId || !status) {
      return NextResponse.json({ error: 'Submission ID and status are required.' }, { status: 400 });
    }

    await connectToDatabase();

    const submission = await TaskSubmission.findByIdAndUpdate(
      submissionId,
      {
        status,
        evaluationScore: score,
        evaluationFeedback: feedback || '',
        evaluatedBy: user!.name,
        evaluatedAt: new Date(),
      },
      { new: true }
    );

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // Update corresponding task status
    await Task.updateOne(
      { userId: submission.userId, title: { $regex: submission.taskId, $options: 'i' } },
      { status: status === 'Approved' ? 'approved' : 'rejected' }
    );

    // Create Notification for student
    await Notification.create({
      userId: submission.userId,
      title: `Task Submission ${status}`,
      message: `Your submission for task "${submission.taskId}" was evaluated. Score: ${score}/100. Feedback: ${feedback || 'No comments'}`,
      type: 'feedback',
      relatedId: submission.taskId,
    });

    return NextResponse.json({ message: `Submission evaluated as ${status}`, submission });
  } catch (error: any) {
    console.error('Evaluate task error:', error);
    return NextResponse.json({ error: 'Failed to evaluate task submission' }, { status: 500 });
  }
}
