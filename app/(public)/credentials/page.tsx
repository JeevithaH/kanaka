'use client';

import React, { useState } from 'react';
import { Award, CheckCircle, Search, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CredentialsPage() {
  const [searchId, setSearchId] = useState('');
  const [verifiedCred, setVerifiedCred] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setHasSearched(true);
    setIsVerifying(true);
    setErrorMsg('');
    setVerifiedCred(null);

    try {
      const res = await fetch(`/api/certificates/${searchId.trim()}`);
      const data = await res.json();

      if (res.ok && data.certificate) {
        setVerifiedCred(data.certificate);
      } else {
        setErrorMsg(`No certificate found matching ID "${searchId.trim()}". Please verify the ID.`);
      }
    } catch {
      setErrorMsg('Error connecting to certificate verification database.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 bg-white min-h-screen font-sans">
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
          Enter a Skyrellac Certificate ID to authenticate student program completion, test performance, and verified skill achievements.
        </p>
      </div>

      {/* Verification Search Form */}
      <form onSubmit={handleVerify} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-soft-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Award className="w-5 h-5 text-indigo-600 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Enter Certificate ID (e.g. CERT-ABC12345)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 font-mono font-bold"
            required
          />
        </div>
        <Button type="submit" disabled={isVerifying} variant="glow" size="lg" className="shadow-soft-sm">
          <Search className="w-5 h-5" />
          <span>{isVerifying ? 'Verifying...' : 'Verify Credential'}</span>
        </Button>
      </form>

      {/* Result Container */}
      {hasSearched && (
        <div className="space-y-6">
          {verifiedCred ? (
            <div className="rounded-2xl p-8 border-2 border-emerald-500 bg-emerald-50/50 space-y-6 shadow-soft-md relative">
              <div className="flex items-center justify-between pb-6 border-b border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-soft-sm">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Verified Authentic Credential ✓</h3>
                    <span className="text-xs text-emerald-700 font-semibold">Issued by {verifiedCred.authorizedIssuer || 'Skyrellac Academic Board'}</span>
                  </div>
                </div>
                <span className="text-xs font-mono bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-bold">
                  {verifiedCred.certificateId}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Student Name</span>
                  <p className="text-base font-bold text-slate-900 pt-1">{verifiedCred.userName}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Program Title</span>
                  <p className="text-base font-bold text-slate-900 pt-1">{verifiedCred.courseTitle}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Date Issued</span>
                  <p className="text-base font-bold text-slate-900 pt-1">{new Date(verifiedCred.issueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Assessment Score</span>
                  <p className="text-base font-bold text-emerald-700 pt-1">{verifiedCred.testScore} / {verifiedCred.testTotal || 100}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
              <AlertCircle className="w-6 h-6 text-rose-600 mx-auto" />
              <h3 className="text-lg font-bold text-rose-700">Credential Not Found</h3>
              <p className="text-sm text-slate-600">{errorMsg}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
