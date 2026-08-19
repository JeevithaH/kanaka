import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Course } from '@/models/Course';
import { Enrollment } from '@/models/Enrollment';
import { Internship } from '@/models/Internship';
import { InternshipEnrollment } from '@/models/InternshipEnrollment';
import { TaskSubmission } from '@/models/TaskSubmission';
import { Certificate } from '@/models/Certificate';
import { Payment } from '@/models/Payment';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    await connectToDatabase();

    const [
      totalUsers,
      activeUsers,
      totalCourses,
      totalEnrollments,
      totalInternships,
      internshipParticipants,
      pendingSubmissions,
      certificatesIssued,
      payments,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'student', accountStatus: 'active' }),
      Course.countDocuments(),
      Enrollment.countDocuments(),
      Internship.countDocuments(),
      InternshipEnrollment.countDocuments(),
      TaskSubmission.countDocuments({ status: { $in: ['Submitted', 'Under Review'] } }),
      Certificate.countDocuments(),
      Payment.find({ paymentStatus: 'completed' }),
      User.find({ role: 'student' }).sort({ createdAt: -1 }).limit(5).select('-passwordHash'),
    ]);

    const totalRevenue = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

    return NextResponse.json({
      stats: {
        totalUsers,
        activeUsers,
        totalCourses,
        totalEnrollments,
        totalInternships,
        internshipParticipants,
        pendingSubmissions,
        certificatesIssued,
        totalRevenue,
      },
      recentUsers,
      recentPayments: payments.slice(-5).reverse(),
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
