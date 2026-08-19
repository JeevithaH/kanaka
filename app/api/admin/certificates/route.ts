import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Certificate } from '@/models/Certificate';
import { User } from '@/models/User';
import { Notification } from '@/models/Notification';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    await connectToDatabase();
    const certificates = await Certificate.find().sort({ issueDate: -1 });
    return NextResponse.json({ certificates });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { user: adminUser, errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { userId, courseTitle, courseId, internshipId, testScore, testTotal, authorizedIssuer } = await req.json();

    if (!userId || !courseTitle) {
      return NextResponse.json({ error: 'User ID and Program Title are required.' }, { status: 400 });
    }

    await connectToDatabase();

    const student = await User.findById(userId);
    if (!student) {
      return NextResponse.json({ error: 'Student user not found' }, { status: 404 });
    }

    const certPrefix = internshipId ? 'SKY-INT-' : 'SKY-CERT-';
    const certificateId = certPrefix + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString().slice(-4);

    const certificate = await Certificate.create({
      certificateId,
      userId,
      userName: student.fullName,
      courseId: courseId || '',
      internshipId: internshipId || '',
      courseTitle,
      issueDate: new Date(),
      completionDate: new Date(),
      testScore: testScore || 90,
      testTotal: testTotal || 100,
      authorizedIssuer: authorizedIssuer || 'Skyrellac Academic Certification Board',
      verificationUrl: `/certificate/${certificateId}`,
      issuedBy: adminUser!.name,
    });

    // Notify user
    await Notification.create({
      userId,
      title: 'Official Certificate Issued! 🏆',
      message: `Congratulations! Your verified certificate for "${courseTitle}" has been issued. Certificate ID: ${certificateId}`,
      type: 'certificate',
      relatedId: certificateId,
    });

    return NextResponse.json({ message: 'Certificate issued successfully!', certificate }, { status: 201 });
  } catch (error: any) {
    console.error('Issue certificate error:', error);
    return NextResponse.json({ error: error.message || 'Failed to issue certificate' }, { status: 500 });
  }
}
