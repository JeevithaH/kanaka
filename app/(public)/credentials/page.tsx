'use client';

import { useState } from 'react';
import { Award, CheckCircle2, ChevronRight, FileCheck2, Search, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

type Certificate = {
  certificateId: string;
  userName: string;
  courseTitle: string;
  issueDate: string;
  testScore?: number;
  testTotal?: number;
  authorizedIssuer?: string;
};

export default function CredentialsPage() {
  const [searchId, setSearchId] = useState('');
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchId.trim()) return;

    setIsVerifying(true);
    setCertificate(null);
    setErrorMessage('');

    try {
      const response = await fetch(`/api/certificates/${searchId.trim()}`);
      const data = await response.json();
      if (response.ok && data.certificate) setCertificate(data.certificate);
      else setErrorMessage('We could not find a credential with that ID. Check the ID and try again.');
    } catch {
      setErrorMessage('We could not connect to the credential registry. Please try again shortly.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f3f0ed] py-10 lg:py-16">
      <div className="max-w-[1180px] mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-[1.2fr_.8fr] border border-[#c8c8c8] bg-white">
          <section className="p-7 sm:p-10 lg:p-14">
            <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.14em] text-[#5f4938]">
              <span className="w-8 h-px bg-[#80664f]" /> CREDENTIAL REGISTRY
            </div>
            <h1 className="mt-7 max-w-2xl text-[2.7rem] sm:text-6xl leading-[.98] tracking-[-0.045em] font-semibold text-[#161616]">Verify a credential with confidence.</h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-[#525252]">Confirm a learner&apos;s achievement directly against the Skyrellac registry. Each verified record includes the course, learner, date of issue, and assessment result.</p>

            <form onSubmit={handleVerify} className="mt-10 max-w-2xl">
              <label htmlFor="certificate-id" className="block text-sm font-semibold text-[#161616] mb-2">Credential ID</label>
              <div className="border border-[#8d8d8d] bg-white p-2 flex flex-col sm:flex-row gap-2 focus-within:border-[#80664f] focus-within:ring-1 focus-within:ring-[#80664f]">
                <div className="relative flex-1">
                  <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#80664f]" aria-hidden="true" />
                  <input id="certificate-id" value={searchId} onChange={(event) => setSearchId(event.target.value)} required placeholder="e.g. CERT-ABC12345" className="w-full h-12 pl-12 pr-4 text-sm font-mono text-[#161616] placeholder:text-[#8d8d8d] outline-none" />
                </div>
                <Button type="submit" disabled={isVerifying} variant="primary" size="md" className="h-12 px-5 gap-2 shrink-0">
                  <Search className="w-4 h-4" /> {isVerifying ? 'Checking registry...' : 'Verify credential'}
                </Button>
              </div>
              <p className="mt-3 text-xs leading-5 text-[#6f6f6f]">Use the exact ID printed on the learner&apos;s digital certificate.</p>
            </form>
          </section>

          <aside className="bg-[#312a25] text-white p-7 sm:p-10 lg:p-12 flex flex-col justify-between min-h-[350px]">
            <div>
              <ShieldCheck className="w-8 h-8 text-[#d9c8bb]" strokeWidth={1.5} />
              <p className="mt-10 text-xs font-semibold tracking-[0.14em] text-[#d9c8bb]">A TRUSTED RECORD</p>
              <h2 className="mt-4 text-2xl leading-8 font-medium">Built for employers, educators, and learners.</h2>
            </div>
            <div className="mt-10 border-t border-white/20 divide-y divide-white/20">
              {['Authenticated directly from our registry', 'Clear completion and assessment details', 'Available whenever a credential needs checking'].map((item) => <div key={item} className="py-4 flex gap-3 text-sm leading-5 text-[#e4dfda]"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#d9c8bb]" />{item}</div>)}
            </div>
          </aside>
        </div>

        <section className="mt-6 grid md:grid-cols-3 border border-[#c8c8c8] bg-white">
          {[
            ['1', 'Find the ID', 'Locate the certificate ID on the credential.'],
            ['2', 'Check the record', 'Enter it above to search the registry.'],
            ['3', 'Confirm the details', 'Review the verified learner and program data.'],
          ].map(([number, title, description]) => <div key={number} className="p-6 border-b last:border-b-0 md:border-b-0 md:border-r last:border-r-0 border-[#c8c8c8]"><span className="text-xs font-semibold text-[#80664f]">0{number}</span><h3 className="mt-4 font-semibold text-[#161616]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#525252]">{description}</p></div>)}
        </section>

        {errorMessage && <section role="alert" className="mt-6 border-l-4 border-[#a33a32] bg-white px-6 py-5"><p className="font-medium text-[#161616]">Credential not verified</p><p className="mt-1 text-sm text-[#525252]">{errorMessage}</p></section>}

        {certificate && (
          <section className="mt-6 bg-white border border-[#80664f] shadow-[0_18px_50px_rgba(49,42,37,0.12)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-[#c8c8c8] bg-[#f7f3ef]">
              <div className="flex items-center gap-3"><span className="w-10 h-10 flex items-center justify-center bg-[#80664f] text-white"><FileCheck2 className="w-5 h-5" /></span><div><p className="text-sm font-semibold text-[#161616]">Verified credential</p><p className="text-xs text-[#525252]">This record is authenticated by Skyrellac.</p></div></div>
              <span className="font-mono text-xs text-[#5f4938] border border-[#b8a899] bg-white px-3 py-2">{certificate.certificateId}</span>
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-xs font-semibold tracking-[0.12em] text-[#80664f]">PROGRAM COMPLETION</p>
              <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[#161616]">{certificate.courseTitle}</h2>
              <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#c8c8c8]">
                {[
                  ['Issued to', certificate.userName],
                  ['Issue date', new Date(certificate.issueDate).toLocaleDateString()],
                  ['Assessment score', `${certificate.testScore ?? '—'} / ${certificate.testTotal ?? 100}`],
                  ['Authorized issuer', certificate.authorizedIssuer || 'Skyrellac Academic Board'],
                ].map(([label, value]) => <div key={label} className="border-r border-b border-[#c8c8c8] p-4"><p className="text-[11px] tracking-[0.1em] uppercase text-[#6f6f6f]">{label}</p><p className="mt-2 text-sm font-semibold leading-5 text-[#161616]">{value}</p></div>)}
              </div>
            </div>
          </section>
        )}

        <p className="mt-8 text-center text-xs text-[#6f6f6f]">Need help verifying a record? Contact the Skyrellac credentials team <ChevronRight className="inline w-3 h-3" aria-hidden="true" /> </p>
      </div>
    </main>
  );
}
