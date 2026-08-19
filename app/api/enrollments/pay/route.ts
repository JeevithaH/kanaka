import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Enrollment } from '@/models/Enrollment';
import { Course } from '@/models/Course';

function getUserFromCookie(req: Request) {
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/skyrellac_session=([^;]+)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

const VALID_COUPONS: Record<string, number> = {
  SKY90: 90,
  PROMO90: 90,
  OFF90: 90,
  SKYRELLA90: 90,
  SPECIAL90: 90,
};

export async function POST(req: Request) {
  try {
    const user = getUserFromCookie(req);
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized. Please log in to complete payment.' }, { status: 401 });
    }

    const { courseId, couponCode } = await req.json();
    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required.' }, { status: 400 });
    }

    await connectToDatabase();

    const course = await Course.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
    }

    const originalPrice = course.originalPrice || 1999;
    let finalAmount = originalPrice;
    let appliedCoupon = '';

    const cleanCoupon = (couponCode || '').trim().toUpperCase();
    if (cleanCoupon && VALID_COUPONS[cleanCoupon]) {
      const discountPct = VALID_COUPONS[cleanCoupon];
      finalAmount = Math.round(originalPrice * (1 - discountPct / 100)); // 1999 -> 199
      appliedCoupon = cleanCoupon;
    }

    let enrollment = await Enrollment.findOne({ userId: user.id, courseId });
    if (!enrollment) {
      enrollment = new Enrollment({
        userId: user.id,
        courseId,
        enrollmentDate: new Date(),
        status: 'active',
        progressPercentage: 0,
        completedLessons: [],
        testStatus: [],
        certificateStatus: { eligible: false, issued: false },
      });
    }

    enrollment.paymentStatus = 'paid';
    enrollment.amountPaid = finalAmount;
    enrollment.paymentDate = new Date();
    enrollment.couponUsed = appliedCoupon;
    await enrollment.save();

    return NextResponse.json({
      message: 'Payment completed successfully! Course access unlocked.',
      enrollment,
      amountPaid: finalAmount,
      couponUsed: appliedCoupon,
    });
  } catch (error: any) {
    console.error('Payment processing error:', error);
    return NextResponse.json({ error: error.message || 'Payment processing failed.' }, { status: 500 });
  }
}
