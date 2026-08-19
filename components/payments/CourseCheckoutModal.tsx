'use client';

import React, { useState } from 'react';

interface CourseCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  originalPrice?: number; // 1999
  onPaymentSuccess: (updatedEnrollment: any) => void;
}

const VALID_COUPONS: Record<string, { pct: number; label: string }> = {
  SKY90: { pct: 90, label: '90% OFF Special Launch Discount' },
  PROMO90: { pct: 90, label: '90% OFF Promotional Offer' },
  OFF90: { pct: 90, label: '90% Instant Discount' },
  SKYRELLA90: { pct: 90, label: '90% OFF Skyrellac Pass' },
  SPECIAL90: { pct: 90, label: '90% OFF Exclusive Student Offer' },
};

export function CourseCheckoutModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  originalPrice = 1999,
  onPaymentSuccess,
}: CourseCheckoutModalProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [appliedCouponName, setAppliedCouponName] = useState<string>('');
  const [couponError, setCouponError] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleApplyCoupon = () => {
    setCouponError('');
    const clean = couponCode.trim().toUpperCase();
    if (!clean) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    if (VALID_COUPONS[clean]) {
      setAppliedDiscount(VALID_COUPONS[clean].pct);
      setAppliedCouponName(clean);
      setCouponError('');
    } else {
      setAppliedDiscount(0);
      setAppliedCouponName('');
      setCouponError('Invalid coupon code. Original price ₹1,999 applies.');
    }
  };

  const finalAmount = appliedDiscount > 0
    ? Math.round(originalPrice * (1 - appliedDiscount / 100)) // 199
    : originalPrice; // 1999

  const handleCompletePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsProcessing(true);

    try {
      const res = await fetch('/api/enrollments/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          couponCode: appliedCouponName,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Payment failed. Please try again.');
        return;
      }

      onPaymentSuccess(data.enrollment);
      onClose();
    } catch (err) {
      setErrorMessage('Network error while processing payment.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white border border-[#e0e0e0] max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#161616] text-white p-6 flex items-center justify-between">
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

          {/* Price breakdown before coupon */}
          <div className="space-y-2 border-b border-[#e0e0e0] pb-4">
            <div className="flex justify-between text-sm text-[#161616]">
              <span>Course Base Amount:</span>
              <span className="font-semibold">₹{originalPrice.toLocaleString()}</span>
            </div>

            {appliedDiscount > 0 && (
              <div className="flex justify-between text-sm text-[#198038]">
                <span>Coupon ({appliedCouponName} - {appliedDiscount}% OFF):</span>
                <span className="font-semibold">-₹{(originalPrice - finalAmount).toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-lg font-bold text-[#161616] pt-2 border-t border-dashed border-[#e0e0e0]">
              <span>Total Payable:</span>
              <span className="text-[#0f62fe]">₹{finalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Coupon Code Section */}
          <div className="space-y-2 bg-[#f8fafc] border border-[#cbd5e1] p-4 rounded-xl">
            <label className="block text-xs font-semibold text-[#161616]">
              Have a Coupon Code? (Try <span className="text-[#0f62fe] underline">SKY90</span> for 90% OFF)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code (e.g. SKY90)"
                className="flex-1 border border-[#94a3b8] px-3 py-2 text-sm rounded-lg uppercase focus:outline-none focus:border-[#0f62fe] bg-white text-[#161616]"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="bg-[#161616] text-white px-4 py-2 text-xs font-semibold rounded-lg hover:bg-[#393939] transition-colors shrink-0"
              >
                Apply Code
              </button>
            </div>

            {couponError && (
              <p className="text-xs text-[#da1e28] mt-1 font-medium">{couponError}</p>
            )}

            {appliedDiscount > 0 && (
              <div className="text-xs text-[#198038] font-bold flex items-center gap-1.5 mt-1 bg-[#defbe6] p-2 rounded-md">
                <span>✓</span>
                <span>Coupon &apos;{appliedCouponName}&apos; applied! You save ₹{(originalPrice - finalAmount).toLocaleString()}</span>
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
                    ? 'border-[#0f62fe] bg-[#0f62fe]/10 text-[#0f62fe]'
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
                    ? 'border-[#0f62fe] bg-[#0f62fe]/10 text-[#0f62fe]'
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
                    ? 'border-[#0f62fe] bg-[#0f62fe]/10 text-[#0f62fe]'
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

          {/* Submit Button */}
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
