import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/mongodb';
import { Enrollment } from '@/models/Enrollment';
import { Course } from '@/models/Course';
import { Coupon } from '@/models/Coupon';
import { Payment } from '@/models/Payment';
import { Notification } from '@/models/Notification';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      courseId,
      couponCode,
    } = await req.json();

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !courseId) {
      return NextResponse.json({ error: 'Missing required payment details.' }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: 'Razorpay configuration key secret is missing.' }, { status: 500 });
    }

    // Verify signature
    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Payment signature verification failed. Invalid transaction.' }, { status: 400 });
    }

    await connectToDatabase();

    const course = await Course.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
    }

    const originalPrice = course.originalPrice || 1999;
    let finalAmount = originalPrice;
    let appliedCoupon = '';
    let discountAmount = 0;

    const cleanCoupon = (couponCode || '').trim().toUpperCase();
    if (cleanCoupon) {
      const dbCoupon = await Coupon.findOne({ code: cleanCoupon, isActive: true });
      if (dbCoupon) {
        if (dbCoupon.type === 'percentage') {
          discountAmount = Math.round(originalPrice * (dbCoupon.discountPercentage / 100));
          finalAmount = Math.max(0, originalPrice - discountAmount);
        } else if (dbCoupon.type === 'fixed') {
          discountAmount = dbCoupon.discountAmount || 0;
          finalAmount = Math.max(0, originalPrice - discountAmount);
        }
        appliedCoupon = cleanCoupon;
        dbCoupon.currentUses += 1;
        await dbCoupon.save();
      }
    }

    // Find or create enrollment
    let enrollment = await Enrollment.findOne({ userId: user!.id, courseId });
    if (!enrollment) {
      enrollment = new Enrollment({
        userId: user!.id,
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

    // Create audit Payment record
    const transactionId = 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    await Payment.create({
      transactionId,
      userId: user!.id,
      userName: user!.name,
      userEmail: user!.email,
      amount: finalAmount,
      currency: 'INR',
      paymentStatus: 'completed',
      paymentMethod: 'razorpay',
      serviceType: 'course',
      serviceId: courseId,
      serviceName: course.title,
      couponUsed: appliedCoupon,
      discountAmount,
      gatewayReference: razorpay_payment_id,
    });

    // Create Notification
    await Notification.create({
      userId: user!.id,
      title: 'Payment Confirmed & Course Unlocked',
      message: `Your payment of ₹${finalAmount} for "${course.title}" was successful. Full course access unlocked!`,
      type: 'payment',
      relatedId: courseId,
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified and enrollment activated successfully!',
      enrollment,
    });
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed.' },
      { status: 500 }
    );
  }
}
