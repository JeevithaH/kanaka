import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Internship } from '@/models/Internship';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    await connectToDatabase();
    const internships = await Internship.find().sort({ createdAt: -1 });
    return NextResponse.json({ internships });
  } catch (error: any) {
    console.error('Fetch admin internships error:', error);
    return NextResponse.json({ error: 'Failed to fetch internships' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();

    if (!body.title || !body.internshipId || !body.description) {
      return NextResponse.json({ error: 'Title, Internship ID, and Description are required.' }, { status: 400 });
    }

    await connectToDatabase();

    const existing = await Internship.findOne({ internshipId: body.internshipId });
    if (existing) {
      return NextResponse.json({ error: 'An internship with this ID already exists.' }, { status: 409 });
    }

    const internship = await Internship.create({
      internshipId: body.internshipId,
      title: body.title,
      description: body.description,
      organization: body.organization || 'Skyrellac Innovation Labs',
      mode: body.mode || 'Remote',
      location: body.location || 'Global / Remote',
      durationWeeks: body.durationWeeks || 8,
      type: body.type || 'Project-based',
      requiredSkills: body.requiredSkills || [],
      validationFee: body.validationFee || 499,
      tasks: body.tasks || [],
      certificateEligible: body.certificateEligible !== false,
      isPublished: body.isPublished !== false,
    });

    return NextResponse.json({ message: 'Internship program created successfully!', internship }, { status: 201 });
  } catch (error: any) {
    console.error('Create internship error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create internship' }, { status: 500 });
  }
}
