'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface CertData {
  certificateId: string;
  userName: string;
  courseTitle: string;
  issueDate: string;
  testScore: number;
  testTotal: number;
}

export default function CertificateVerificationPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const [cert, setCert] = useState<CertData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function verifyCert() {
      try {
        const res = await fetch(`/api/certificates/${unwrappedParams.id}`);
        const data = await res.json();
        if (res.ok && data.certificate) {
          setCert(data.certificate);
        } else {
          setError(data.error || 'Certificate record not found.');
        }
      } catch (err) {
        setError('Verification service unavailable.');
      } finally {
        setIsLoading(false);
      }
    }
    verifyCert();
  }, [unwrappedParams.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center p-6">
        <div className="text-sm font-semibold text-[#525252]">Verifying Certificate Security Record...</div>
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center p-6">
        <div className="bg-white border border-[#e0e0e0] p-8 max-w-md text-center space-y-4">
          <div className="text-[#da1e28] text-2xl font-bold">⚠️ Unverified Certificate</div>
          <p className="text-sm text-[#525252]">{error || 'This certificate ID could not be validated.'}</p>
          <Link href="/courses" className="inline-block bg-[#80664f] text-white text-xs px-4 py-2.5 font-semibold">
            Browse Valid Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4] py-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Verification Status Badge */}
        <div className="bg-[#defbe6] border border-[#198038] p-4 flex items-center justify-between text-[#198038]">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span>✓ Verified Digital Certificate</span>
          </div>
          <span className="text-xs font-mono font-bold">{cert.certificateId}</span>
        </div>

        {/* Certificate Card */}
        <div className="bg-white border-8 border-[#161616] p-8 lg:p-14 text-center space-y-8 shadow-xl relative">
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-[#80664f]">
            Skyrellac Global Education Network
          </div>

          <h1 className="text-3xl lg:text-5xl font-serif text-[#161616]">Certificate of Achievement</h1>

          <p className="text-sm text-[#525252] uppercase tracking-widest font-semibold">This certifies that</p>

          <div className="text-2xl lg:text-4xl font-bold text-[#161616] border-b-2 border-[#161616] pb-2 inline-block px-8">
            {cert.userName}
          </div>

          <p className="text-sm text-[#525252] leading-relaxed max-w-xl mx-auto">
            has successfully completed all required curriculum modules and passed the comprehensive examination for
          </p>

          <div className="text-xl lg:text-2xl font-semibold text-[#80664f]">
            {cert.courseTitle}
          </div>

          <div className="pt-8 border-t border-[#e0e0e0] grid grid-cols-2 gap-4 text-xs text-[#525252]">
            <div>
              <p className="font-semibold text-[#161616]">Date of Issuance</p>
              <p>{new Date(cert.issueDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-semibold text-[#161616]">Examination Score</p>
              <p>{cert.testScore}% / 100%</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/dashboard" className="text-xs text-[#80664f] font-semibold hover:underline">
            ← Back to Student Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
