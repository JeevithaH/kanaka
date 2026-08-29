'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';

interface CourseCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  originalPrice?: number; // 1999
  onPaymentSuccess: (updatedEnrollment: any) => void;
}

export function CourseCheckoutModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  originalPrice = 1999,
  onPaymentSuccess,
}: CourseCheckoutModalProps) {
  const { user } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscountPct, setAppliedDiscountPct] = useState<number>(0);
  const [appliedDiscountAmount, setAppliedDiscountAmount] = useState<number>(0);
  const [appliedCouponName, setAppliedCouponName] = useState<string>('');
  const [couponError, setCouponError] = useState<string>('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Dynamically load Razorpay SDK
  useEffect(() => {
    if (!isOpen) return;
    
    // Check if script already exists
    const existingScript = document.getElementById('razorpay-sdk');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'razorpay-sdk';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApplyCoupon = async () => {
    setCouponError('');
    const clean = couponCode.trim().toUpperCase();
    if (!clean) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    setIsValidatingCoupon(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: clean, originalPrice }),
      });
      const data = await res.json();

      if (!res.ok || !data.valid) {
        setAppliedDiscountPct(0);
        setAppliedDiscountAmount(0);
        setAppliedCouponName('');
        setCouponError(data.error || 'Invalid or expired coupon code.');
      } else {
        setAppliedDiscountPct(data.discountPercentage);
        setAppliedDiscountAmount(data.discountAmount);
        setAppliedCouponName(data.code);
        setCouponError('');
      }
    } catch {
      setCouponError('Network error while validating coupon code.');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const finalAmount = appliedDiscountAmount > 0
    ? Math.max(0, originalPrice - appliedDiscountAmount)
    : originalPrice;

  const handleCompletePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsProcessing(true);

    try {
      // 1. Create Razorpay order
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          couponCode: appliedCouponName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to initialize payment.');
        setIsProcessing(false);
        return;
      }

      // Check if SDK loaded
      if (!(window as any).Razorpay) {
        setErrorMessage('Razorpay SDK failed to load. Check your internet connection.');
        setIsProcessing(false);
        return;
      }

      // 2. Configure and open Razorpay Checkout modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder_key',
        amount: data.amount,
        currency: data.currency,
        name: 'Skyrellac',
        description: `Purchase Course: ${courseTitle}`,
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            setIsProcessing(true);
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                courseId,
                couponCode: appliedCouponName,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
              setErrorMessage(verifyData.error || 'Payment verification failed.');
              setIsProcessing(false);
              return;
            }

            onPaymentSuccess(verifyData.enrollment);
            onClose();
          } catch (err) {
            setErrorMessage('Network error while verifying payment.');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          method: paymentMethod === 'upi' ? 'upi' : paymentMethod === 'card' ? 'card' : 'netbanking',
        },
        theme: {
          color: '#161616',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      setErrorMessage('Network error while processing payment.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white border border-[#e0e0e0] max-w-lg w-full max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#161616] text-white p-6 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#78a9ff] tracking-wider">
              Official Skyrellac Checkout
            </span>
            <h2 className="text-xl font-light mt-0.5">Pay for Course Access</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#a8a8a8] hover:text-white text-xl font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleCompletePayment} className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Course Details */}
          <div className="bg-[#f4f4f4] border border-[#e0e0e0] p-4 rounded-xl space-y-1">
            <span className="text-xs text-[#525252]">Selected Course:</span>
            <h3 className="text-base font-semibold text-[#161616]">{courseTitle}</h3>
            <p className="text-xs text-[#198038] font-medium">✓ Lifetime Access + Final Exam + Certificate</p>
          </div>

          {/* Price breakdown */}
          <div className="space-y-2 border-b border-[#e0e0e0] pb-4">
            <div className="flex justify-between text-sm text-[#161616]">
              <span>Course Base Amount:</span>
              <span className="font-semibold">₹{originalPrice.toLocaleString()}</span>
            </div>

            {appliedDiscountAmount > 0 && (
              <div className="flex justify-between text-sm text-[#198038]">
                <span>Coupon ({appliedCouponName} - {appliedDiscountPct}% OFF):</span>
                <span className="font-semibold">-₹{appliedDiscountAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-lg font-bold text-[#161616] pt-2 border-t border-dashed border-[#e0e0e0]">
              <span>Total Payable:</span>
              <span className="text-[#80664f]">₹{finalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Coupon Code Section */}
          <div className="space-y-2 bg-[#f8fafc] border border-[#cbd5e1] p-4 rounded-xl">
            <label className="block text-xs font-semibold text-[#161616]">
              Have a Promo / Coupon Code?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 border border-[#94a3b8] px-3 py-2 text-sm rounded-lg uppercase focus:outline-none focus:border-[#80664f] bg-white text-[#161616]"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={isValidatingCoupon}
                className="bg-[#161616] text-white px-4 py-2 text-xs font-semibold rounded-lg hover:bg-[#393939] transition-colors shrink-0 disabled:opacity-50"
              >
                {isValidatingCoupon ? 'Validating...' : 'Apply Code'}
              </button>
            </div>

            {couponError && (
              <p className="text-xs text-[#da1e28] mt-1 font-medium">{couponError}</p>
            )}

            {appliedDiscountAmount > 0 && (
              <div className="text-xs text-[#198038] font-bold flex items-center gap-1.5 mt-1 bg-[#defbe6] p-2 rounded-md">
                <span>✓</span>
                <span>Coupon &apos;{appliedCouponName}&apos; applied! You save ₹{appliedDiscountAmount.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#161616]">Select Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 text-xs font-semibold rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-[#80664f] bg-[#80664f]/10 text-[#80664f]'
                    : 'border-[#e0e0e0] bg-white text-[#525252]'
                }`}
              >
                <span>📱 UPI / QR</span>
                <span className="text-[10px] font-normal">GPay / PhonePe</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 text-xs font-semibold rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#80664f] bg-[#80664f]/10 text-[#80664f]'
                    : 'border-[#e0e0e0] bg-white text-[#525252]'
                }`}
              >
                <span>💳 Card</span>
                <span className="text-[10px] font-normal">Credit / Debit</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 text-xs font-semibold rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'border-[#80664f] bg-[#80664f]/10 text-[#80664f]'
                    : 'border-[#e0e0e0] bg-white text-[#525252]'
                }`}
              >
                <span>🏦 NetBanking</span>
                <span className="text-[10px] font-normal">All Indian Banks</span>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-[#fff0f1] border-l-4 border-[#da1e28] text-xs text-[#da1e28]">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-[#198038] text-white py-3.5 text-sm font-semibold rounded-xl hover:bg-[#0e6027] transition-colors disabled:opacity-50 shadow-md flex justify-center items-center gap-2"
          >
            {isProcessing ? (
              <span>Processing Payment...</span>
            ) : (
              <span>Complete Payment of ₹{finalAmount.toLocaleString()} & Unlock Course</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
