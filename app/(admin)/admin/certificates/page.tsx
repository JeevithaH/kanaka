'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Award, Plus, Shield, ExternalLink, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Issue Certificate Modal state
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [targetUserId, setTargetUserId] = useState('');
  const [programTitle, setProgramTitle] = useState('');
  const [testScore, setTestScore] = useState<number>(92);
  const [authorizedIssuer, setAuthorizedIssuer] = useState('Skyrellac Academic Certification Board');
  const [isIssuing, setIsIssuing] = useState(false);

  const fetchCertificates = async () => {
    try {
      const [certRes, userRes] = await Promise.all([
        fetch('/api/admin/certificates'),
        fetch('/api/admin/users'),
      ]);
      const certData = await certRes.json();
      const userData = await userRes.json();

      if (certData.certificates) setCertificates(certData.certificates);
      if (userData.users) {
        setUsers(userData.users);
        if (userData.users[0]) setTargetUserId(userData.users[0]._id);
      }
    } catch (err) {
      console.error('Failed to load certificates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId || !programTitle) {
      alert('Select a student and enter the program title.');
      return;
    }

    setIsIssuing(true);
    try {
      const res = await fetch('/api/admin/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: targetUserId,
          courseTitle: programTitle,
          testScore,
          authorizedIssuer,
        }),
      });

      if (res.ok) {
        alert('Official certificate issued successfully!');
        setIsIssueModalOpen(false);
        setProgramTitle('');
        fetchCertificates();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to issue certificate');
      }
    } catch {
      alert('Network error while issuing certificate');
    } finally {
      setIsIssuing(false);
    }
  };

  const filteredCerts = certificates.filter(
    (c) =>
      c.certificateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-soft-sm">
        <div>
          <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Credentials Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Issued Official Certificates
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Issue verified digital credentials to students upon course or internship completion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-purple-600"
            />
          </div>

          <Button
            onClick={() => setIsIssueModalOpen(true)}
            variant="glow"
            size="md"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Issue Certificate</span>
          </Button>
        </div>
      </div>

      {/* Certificates Table */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          Loading certificate registry from database...
        </div>
      ) : filteredCerts.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          No certificates issued yet.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-soft-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase font-bold text-slate-500 text-[10px]">
                <tr>
                  <th className="p-4">Certificate ID</th>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Program / Course Title</th>
                  <th className="p-4">Issue Date</th>
                  <th className="p-4">Score</th>
                  <th className="p-4 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredCerts.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-purple-700">{c.certificateId}</td>
                    <td className="p-4 font-bold text-slate-900">{c.userName}</td>
                    <td className="p-4 text-slate-800 font-semibold">{c.courseTitle}</td>
                    <td className="p-4 text-slate-500">{new Date(c.issueDate).toLocaleDateString()}</td>
                    <td className="p-4 font-bold text-emerald-700">{c.testScore} / {c.testTotal || 100}</td>
                    <td className="p-4 text-right">
                      <Link href={`/certificate/${c.certificateId}`} target="_blank">
                        <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors inline-flex items-center gap-1">
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Verify</span>
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Issue Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleIssueCertificate} className="bg-white border border-slate-200 p-6 rounded-2xl max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Issue Official Certificate</h3>
              <button type="button" onClick={() => setIsIssueModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Select Student User</label>
              <select
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-purple-600 bg-white"
              >
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.fullName} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Program / Course Title</label>
              <input
                type="text"
                value={programTitle}
                onChange={(e) => setProgramTitle(e.target.value)}
                placeholder="e.g. Artificial Intelligence Fundamentals"
                required
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-purple-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Authorized Issuer</label>
              <input
                type="text"
                value={authorizedIssuer}
                onChange={(e) => setAuthorizedIssuer(e.target.value)}
                placeholder="Skyrellac Academic Certification Board"
                required
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-purple-600"
              />
            </div>

            <Button type="submit" disabled={isIssuing} variant="glow" size="md" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold">
              <span>{isIssuing ? 'Issuing Certificate...' : 'Issue Verified Credential'}</span>
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
