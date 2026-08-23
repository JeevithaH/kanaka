import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Internship } from '@/models/Internship';
import { InternshipEnrollment } from '@/models/InternshipEnrollment';
import { Payment } from '@/models/Payment';
import { Notification } from '@/models/Notification';
import { requireAuth } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    const { paymentMethod } = await req.json();

    await connectToDatabase();

    const internship = await Internship.findOne({
      $or: [{ internshipId: id }, { _id: id }],
    });

    if (!internship) {
      return NextResponse.json({ error: 'Internship program not found' }, { status: 404 });
    }

    let enrollment = await InternshipEnrollment.findOne({
      userId: user!.id,
      internshipId: internship.internshipId,
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'You must enroll in the internship program first before paying for validation.' },
        { status: 400 }
      );
    }

    const validationFee = internship.validationFee || 499;

    enrollment.validationStatus = 'paid';
    enrollment.validationAmountPaid = validationFee;
    enrollment.validationPaymentDate = new Date();
    await enrollment.save();

    // Create Payment audit record
    const transactionId = 'TXN-VAL-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    await Payment.create({
      transactionId,
      userId: user!.id,
      userName: user!.name,
      userEmail: user!.email,
      amount: validationFee,
      currency: 'INR',
      paymentStatus: 'completed',
      paymentMethod: paymentMethod || 'upi',
      serviceType: 'internship-validation',
      serviceId: internship.internshipId,
      serviceName: `${internship.title} Validation & Certificate`,
      gatewayReference: 'SIMULATED-' + Date.now(),
    });

    // Create Notification
    await Notification.create({
      userId: user!.id,
      title: 'Internship Validation Confirmed',
      message: `Your payment of ₹${validationFee} for "${internship.title}" validation & certificate processing was successful.`,
      type: 'payment',
      relatedId: internship.internshipId,
    });

    return NextResponse.json({
      message: 'Validation payment confirmed successfully! Certificate process active.',
      enrollment,
      transactionId,
    });
  } catch (error: any) {
    console.error('Validation payment error:', error);
    return NextResponse.json({ error: error.message || 'Validation payment failed' }, { status: 500 });
  }
}
