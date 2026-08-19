'use client';

import React, { useEffect, useState } from 'react';
import { Shield, IndianRupee, Search, CreditCard } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPayments() {
      try {
        const res = await fetch('/api/admin/payments');
        const data = await res.json();
        if (data.payments) setPayments(data.payments);
        if (data.totalRevenue !== undefined) setTotalRevenue(data.totalRevenue);
      } catch (err) {
        console.error('Failed to load payments:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPayments();
  }, []);

  const filteredPayments = payments.filter(
    (p) =>
      p.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.serviceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.userId.includes(searchQuery)
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-soft-sm">
        <div>
          <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Financial Audit Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Platform Transactions & Revenue
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time ledger of completed course payments and internship validation service transactions.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
          <IndianRupee className="w-6 h-6 text-emerald-600" />
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-700">Total Net Revenue</span>
            <p className="text-2xl font-black text-slate-900">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Transaction ID, student name, or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-purple-600"
          />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          Loading transaction logs from MongoDB...
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          No transactions recorded yet.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-soft-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase font-bold text-slate-500 text-[10px]">
                <tr>
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Student</th>
                  <th className="p-4">Service Description</th>
                  <th className="p-4">Coupon Applied</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredPayments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">{p.transactionId}</td>
                    <td className="p-4 space-y-0.5">
                      <p className="font-bold text-slate-900">{p.userName || 'Student'}</p>
                      <p className="text-[10px] text-slate-400 font-mono">ID: {p.userId}</p>
                    </td>
                    <td className="p-4 text-slate-800 font-semibold">{p.serviceName || p.serviceId}</td>
                    <td className="p-4 font-bold text-purple-700">{p.couponUsed || '—'}</td>
                    <td className="p-4 font-bold text-slate-900">₹{p.amount}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {p.paymentStatus} ✓
                      </span>
                    </td>
                    <td className="p-4 text-right text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
