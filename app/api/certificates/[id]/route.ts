import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Certificate } from '@/models/Certificate';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const certificate = await Certificate.findOne({ certificateId: id.toUpperCase() });
    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found or invalid ID' }, { status: 404 });
    }
    return NextResponse.json({ certificate });
  } catch (error: any) {
    console.error('Fetch certificate error:', error);
    return NextResponse.json({ error: 'Failed to fetch certificate verification payload' }, { status: 500 });
  }
}
