'use client';

import React, { useState } from 'react';
import { MOCK_CREDENTIALS } from '@/lib/supabase/mock-data';
import { Award, CheckCircle, Search, ShieldCheck, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CredentialsPage() {
  const [searchId, setSearchId] = useState('');
  const [verifiedCred, setVerifiedCred] = useState<typeof MOCK_CREDENTIALS[0] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const found = MOCK_CREDENTIALS.find(
      (c) => c.credential_id.toLowerCase() === searchId.trim().toLowerCase()
    );
    setVerifiedCred(found || null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 bg-white min-h-screen">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
          <ShieldCheck className="w-4 h-4" />
          <span>Skyrellac Official Credential Verification System</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Verify Student Credentials
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-normal">
          Enter a Skyrellac Credential ID (e.g. <code className="text-blue-600 bg-slate-100 px-2 py-0.5 rounded font-mono border border-slate-200">SKY-AI-2026-00123</code>) to authenticate student course completion and skill proficiency.
        </p>
      </div>

      {/* Verification Search Form */}
      <form onSubmit={handleVerify} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-soft-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Award className="w-5 h-5 text-indigo-600 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Enter Credential ID (e.g. SKY-AI-2026-00123)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 font-medium"
            required
          />
        </div>
        <Button type="submit" variant="glow" size="lg" className="shadow-soft-sm">
          <Search className="w-5 h-5" />
          <span>Verify Credential</span>
        </Button>
      </form>

      {/* Result Container */}
      {hasSearched && (
        <div className="space-y-6">
          {verifiedCred ? (
            <div className="rounded-2xl p-8 border-2 border-emerald-500 bg-emerald-50/50 space-y-6 shadow-soft-md">
              <div className="flex items-center justify-between pb-6 border-b border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-soft-sm">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Verified Authentic Credential ✓</h3>
                    <span className="text-xs text-emerald-700 font-semibold">Issued by Skyrellac Education Engine</span>
                  </div>
                </div>
                <span className="text-xs font-mono bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-bold">
                  {verifiedCred.credential_id}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Student Name</span>
                  <p className="text-base font-bold text-slate-900 pt-1">{verifiedCred.user_name}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Course Title</span>
                  <p className="text-base font-bold text-slate-900 pt-1">{verifiedCred.title}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Date Issued</span>
                  <p className="text-base font-bold text-slate-900 pt-1">{verifiedCred.issue_date}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Status</span>
                  <p className="text-base font-bold text-emerald-700 pt-1">Active & Valid</p>
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-200 space-y-2">
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Verified Skills Demonstrated</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {verifiedCred.skills_list.map((skill, idx) => (
                    <span key={idx} className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300 font-bold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
              <h3 className="text-lg font-bold text-rose-700">Credential Not Found</h3>
              <p className="text-sm text-slate-600">
                No credential matches ID &ldquo;{searchId}&rdquo;. Please verify the exact ID on the certificate.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Default Sample Credential Quick Links */}
      <div className="pt-6 border-t border-slate-100 space-y-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
          Try verifying sample credentials:
        </h4>
        <div className="flex flex-wrap justify-center gap-3">
          {MOCK_CREDENTIALS.map((c) => (
            <button
              key={c.credential_id}
              onClick={() => {
                setSearchId(c.credential_id);
                setVerifiedCred(c);
                setHasSearched(true);
              }}
              className="text-xs bg-slate-50 hover:bg-blue-50 text-indigo-700 px-3.5 py-2 rounded-xl border border-slate-200 flex items-center gap-2 font-semibold transition-colors shadow-soft-sm"
            >
              <span>{c.credential_id} ({c.title})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
