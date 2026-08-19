import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Internship } from '@/models/Internship';
import { seedInternshipsIfEmpty } from '@/lib/seedInternships';

export async function GET() {
  try {
    await connectToDatabase();
    await seedInternshipsIfEmpty();

    const internships = await Internship.find({ isPublished: true }).sort({ createdAt: -1 });
    return NextResponse.json({ internships });
  } catch (error: any) {
    console.error('Fetch internships error:', error);
    return NextResponse.json({ error: 'Failed to fetch internships' }, { status: 500 });
  }
}
