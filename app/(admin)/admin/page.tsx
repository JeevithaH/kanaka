'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, BookOpen, Briefcase, Award, TrendingUp, Plus, Shield, IndianRupee, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalInternships: number;
  internshipParticipants: number;
  pendingSubmissions: number;
  certificatesIssued: number;
  totalRevenue: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        if (data.stats) {
          setStats(data.stats);
          setRecentUsers(data.recentUsers || []);
          setRecentPayments(data.recentPayments || []);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAdminData();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-purple-200 shadow-soft-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Skyrellac Executive Control Panel
            </h1>
          </div>
          <p className="text-sm text-slate-600">
            Real-time management of courses, internships, task evaluations, coupons, and student credentials.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/courses/new">
            <Button variant="glow" size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-1" />
              <span>Add Course</span>
            </Button>
          </Link>
          <Link href="/admin/internships/new">
            <Button variant="secondary" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              <span>Post Internship</span>
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button variant="secondary" size="sm">
              <Users className="w-4 h-4 mr-1" />
              <span>Users Management</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Database Platform Metrics */}
      {isLoading || !stats ? (
        <div className="p-8 bg-white border border-slate-200 text-center text-sm text-slate-500 rounded-2xl">
          Calculating real-time database metrics...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Registered Students</span>
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-3xl font-black text-slate-900">{stats.totalUsers}</p>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {stats.activeUsers} Active Accounts
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Published Courses</span>
              <BookOpen className="w-4 h-4 text-stone-600" />
            </div>
            <p className="text-3xl font-black text-slate-900">{stats.totalCourses}</p>
            <span className="text-xs text-stone-600 font-semibold">{stats.totalEnrollments} Total Enrollments</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Internships & Review</span>
              <Briefcase className="w-4 h-4 text-stone-600" />
            </div>
            <p className="text-3xl font-black text-slate-900">{stats.internshipParticipants}</p>
            <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {stats.pendingSubmissions} Submissions Pending Review
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Platform Revenue</span>
              <IndianRupee className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-slate-900">₹{stats.totalRevenue.toLocaleString()}</p>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <Award className="w-3 h-3" />
              {stats.certificatesIssued} Certificates Issued
            </span>
          </div>
        </div>
      )}

      {/* Recent Registrations & Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Registrations */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Recent User Registrations</h2>
            <Link href="/admin/users" className="text-xs text-purple-600 font-bold hover:underline">
              Manage All Users
            </Link>
          </div>

          <div className="space-y-3">
            {recentUsers.length === 0 ? (
              <p className="text-xs text-slate-500">No user registrations yet.</p>
            ) : (
              recentUsers.map((u) => (
                <div key={u._id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-slate-900">{u.fullName}</h3>
                    <p className="text-xs text-slate-500">{u.email} • ID: {u._id}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded border ${u.accountStatus === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                    {u.accountStatus || 'active'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Recent Payments Audit</h2>
            <Link href="/admin/payments" className="text-xs text-purple-600 font-bold hover:underline">
              View All Payments
            </Link>
          </div>

          <div className="space-y-3">
            {recentPayments.length === 0 ? (
              <p className="text-xs text-slate-500">No transactions recorded yet.</p>
            ) : (
              recentPayments.map((p) => (
                <div key={p._id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-slate-900">{p.serviceName || p.serviceId}</h3>
                    <p className="text-xs text-slate-500">{p.userName || p.userId} • TXN: {p.transactionId}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900 block">₹{p.amount}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">Completed ✓</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
