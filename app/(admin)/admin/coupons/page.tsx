'use client';

import React, { useEffect, useState } from 'react';
import { Tag, Plus, Shield, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState<number>(90);
  const [isCreating, setIsCreating] = useState(false);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      if (data.coupons) setCoupons(data.coupons);
    } catch (err) {
      console.error('Failed to load coupons:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      alert('Enter coupon code.');
      return;
    }

    setIsCreating(true);
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          discountPercentage,
          type: 'percentage',
          applicableTo: 'all',
        }),
      });

      if (res.ok) {
        alert('Server-side promo coupon created successfully!');
        setIsAddModalOpen(false);
        setCode('');
        fetchCoupons();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create coupon');
      }
    } catch {
      alert('Error creating coupon');
    } finally {
      setIsCreating(false);
    }
  };

  const toggleCouponStatus = async (couponId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponId, isActive: !currentStatus }),
      });
      if (res.ok) {
        setCoupons((prev) =>
          prev.map((c) => (c._id === couponId ? { ...c, isActive: !currentStatus } : c))
        );
      }
    } catch {
      alert('Failed to update coupon status');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-soft-sm">
        <div>
          <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Server-Side Coupon System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Promo Code Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Codes are validated strictly on the server and are never exposed in client JS files or HTML source.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          variant="glow"
          size="md"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Create Promo Coupon</span>
        </Button>
      </div>

      {/* Coupons List */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          Loading promo coupons from MongoDB...
        </div>
      ) : coupons.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          No coupons created yet.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-soft-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase font-bold text-slate-500 text-[10px]">
                <tr>
                  <th className="p-4">Coupon Code</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Applicable Scope</th>
                  <th className="p-4">Times Redeemed</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-purple-700">{c.code}</td>
                    <td className="p-4 font-bold text-emerald-700">{c.discountPercentage}% OFF</td>
                    <td className="p-4 uppercase text-slate-600 font-semibold">{c.applicableTo || 'All Services'}</td>
                    <td className="p-4 font-bold text-slate-900">{c.currentUses || 0}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${c.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                        {c.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => toggleCouponStatus(c._id, c.isActive)}
                        className={`px-3 py-1 font-bold rounded-lg text-xs transition-colors ${c.isActive ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                      >
                        {c.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateCoupon} className="bg-white border border-slate-200 p-6 rounded-2xl max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Create Server-Validated Coupon</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Coupon Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. SKY90"
                required
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-mono uppercase font-bold focus:outline-none focus:border-purple-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Discount Percentage (%)</label>
              <input
                type="number"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                placeholder="90"
                required
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
              />
            </div>

            <Button type="submit" disabled={isCreating} variant="glow" size="md" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold">
              <span>{isCreating ? 'Creating Coupon...' : 'Save Promo Coupon'}</span>
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
