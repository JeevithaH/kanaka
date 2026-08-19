import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Payment } from '@/models/Payment';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    await connectToDatabase();

    const payments = await Payment.find().sort({ createdAt: -1 });
    const totalRevenue = payments.reduce((acc, p) => acc + (p.paymentStatus === 'completed' ? p.amount : 0), 0);

    return NextResponse.json({ payments, totalRevenue });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch payment records' }, { status: 500 });
  }
}
