import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Enrollment } from '@/models/Enrollment';
import { InternshipEnrollment } from '@/models/InternshipEnrollment';
import { Task } from '@/models/Task';
import { TaskSubmission } from '@/models/TaskSubmission';
import { Certificate } from '@/models/Certificate';
import { Payment } from '@/models/Payment';
import { TestAttempt } from '@/models/TestAttempt';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    await connectToDatabase();

    const user = await User.findById(params.id).select('-passwordHash');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const [
      courseEnrollments,
      internshipEnrollments,
      tasks,
      taskSubmissions,
      certificates,
      payments,
      testAttempts,
    ] = await Promise.all([
      Enrollment.find({ userId: params.id }),
      InternshipEnrollment.find({ userId: params.id }),
      Task.find({ userId: params.id }),
      TaskSubmission.find({ userId: params.id }),
      Certificate.find({ userId: params.id }),
      Payment.find({ userId: params.id }),
      TestAttempt.find({ userId: params.id }),
    ]);

    return NextResponse.json({
      user,
      courseEnrollments,
      internshipEnrollments,
      tasks,
      taskSubmissions,
      certificates,
      payments,
      testAttempts,
    });
  } catch (error: any) {
    console.error('Fetch single user detail error:', error);
    return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
  }
}
