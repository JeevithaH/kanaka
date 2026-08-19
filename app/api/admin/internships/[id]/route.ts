import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Internship } from '@/models/Internship';
import { InternshipEnrollment } from '@/models/InternshipEnrollment';
import { TaskSubmission } from '@/models/TaskSubmission';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    await connectToDatabase();
    const internship = await Internship.findOne({
      $or: [{ internshipId: params.id }, { _id: params.id }],
    });

    if (!internship) {
      return NextResponse.json({ error: 'Internship program not found' }, { status: 404 });
    }

    const [participants, submissions] = await Promise.all([
      InternshipEnrollment.find({ internshipId: internship.internshipId }),
      TaskSubmission.find({ internshipId: internship.internshipId }),
    ]);

    return NextResponse.json({ internship, participants, submissions });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch internship program details' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const updates = await req.json();

    await connectToDatabase();
    const internship = await Internship.findOneAndUpdate(
      { $or: [{ internshipId: params.id }, { _id: params.id }] },
      updates,
      { new: true }
    );

    if (!internship) {
      return NextResponse.json({ error: 'Internship not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Internship program updated successfully!', internship });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update internship program' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    await connectToDatabase();
    await Internship.deleteOne({ $or: [{ internshipId: params.id }, { _id: params.id }] });

    return NextResponse.json({ message: 'Internship program deleted successfully!' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete internship program' }, { status: 500 });
  }
}
