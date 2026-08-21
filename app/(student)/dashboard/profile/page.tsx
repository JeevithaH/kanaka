'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Award, GraduationCap, MapPin, CheckCircle2, Shield } from 'lucide-react';
import Link from 'next/link';

export default function StudentProfilePage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfileData() {
      try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();
        if (data.certificates) setCertificates(data.certificates);
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : 'ST';

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans">
      {/* Profile Header Box */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-soft-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-stone-600 text-white flex items-center justify-center text-3xl font-black shadow-soft-md shrink-0">
            {initials}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">{user?.name || 'Student Learner'}</h1>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                Verified Account
              </span>
            </div>
            <p className="text-sm font-semibold text-stone-600">{user?.email}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 font-medium">
              <span className="flex items-center gap-1 font-mono">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                Student User ID: {user?.id}
              </span>
            </div>
          </div>
        </div>

        <Link href="/dashboard">
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs px-4 py-2.5 font-bold rounded-xl transition-colors">
            Return to Dashboard
          </button>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Account Metadata */}
        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-soft-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Account Specifications</h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-semibold">User Role:</span>
              <span className="font-bold text-slate-900 uppercase">{user?.role || 'student'}</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-semibold">Security Authentication:</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Password Hashed (bcrypt)
              </span>
            </div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-semibold">Session Status:</span>
              <span className="font-bold text-stone-600">Active HTTP Session Cookie</span>
            </div>
          </div>
        </div>

        {/* Credentials Column */}
        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-soft-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Earned Credentials</h2>

          {isLoading ? (
            <p className="text-xs text-slate-500 py-4">Loading credentials...</p>
          ) : certificates.length === 0 ? (
            <p className="text-xs text-slate-500 py-4">No certificates earned yet. Complete courses and pass assessments to earn credentials!</p>
          ) : (
            <div className="space-y-3">
              {certificates.map((cred) => (
                <div key={cred._id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900">{cred.courseTitle}</h3>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Verified ✓</span>
                  </div>
                  <p className="text-[11px] font-mono text-purple-700">{cred.certificateId}</p>
                  <p className="text-[10px] text-slate-500">Issued: {new Date(cred.issueDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
