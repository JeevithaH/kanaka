'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Search, Award, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CertificateVerificationPage() {
  const [certId, setCertId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;

    setError('');
    setResult(null);
    setIsSearching(true);

    try {
      const res = await fetch(`/api/certificates/${certId.trim()}`);
      const data = await res.json();

      if (!res.ok || !data.certificate) {
        setError('No verified certificate found matching this Certificate ID. Please double check the ID.');
      } else {
        setResult(data.certificate);
      }
    } catch {
      setError('Network error while searching certificate records.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      {/* Header Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-black tracking-tight text-lg uppercase flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Skyrellac Credentials Registry</span>
          </Link>
          <Link href="/login" className="text-xs font-semibold text-slate-300 hover:text-white">
            Student Portal Login
          </Link>
        </div>
      </header>

      {/* Main Verification Container */}
      <main className="max-w-3xl mx-auto px-4 py-16 w-full space-y-8">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Certificate Verification Registry</h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Enter the unique Certificate ID printed on the physical or digital credential to verify its authenticity on the Skyrellac blockchain-backed registry.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleVerify} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-soft-sm flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              placeholder="Enter Certificate ID (e.g. CERT-ABC12345)"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-xs font-mono font-bold focus:outline-none focus:border-emerald-600"
            />
          </div>
          <Button type="submit" disabled={isSearching} variant="glow" size="md" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shrink-0">
            <span>{isSearching ? 'Verifying...' : 'Verify Credential'}</span>
          </Button>
        </form>

        {/* Verification Result */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-center space-y-2">
            <AlertCircle className="w-6 h-6 text-rose-600 mx-auto" />
            <p className="text-xs font-bold text-rose-700">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-white border-2 border-emerald-500 p-8 rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
            <div className="bg-emerald-500 text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest absolute top-0 right-0 rounded-bl-xl">
              ✓ Verified Authentic
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-700 uppercase">Official Credential Verification</span>
              <h2 className="text-2xl font-black text-slate-900">{result.courseTitle}</h2>
              <p className="text-xs text-slate-500 font-mono">Certificate ID: {result.certificateId}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl text-xs border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Issued To</span>
                <span className="font-bold text-slate-900 text-sm">{result.userName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Issue Date</span>
                <span className="font-bold text-slate-900 text-sm">{new Date(result.issueDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Assessment Score</span>
                <span className="font-bold text-emerald-700 text-sm">{result.testScore} / {result.testTotal || 100} ({Math.round(((result.testScore || 90) / (result.testTotal || 100)) * 100)}%)</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Authorized Issuer</span>
                <span className="font-bold text-slate-900 text-sm">{result.authorizedIssuer || 'Skyrellac Academic Certification Board'}</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        © Skyrellac Academic Certification Board. All Rights Reserved.
      </footer>
    </div>
  );
}
