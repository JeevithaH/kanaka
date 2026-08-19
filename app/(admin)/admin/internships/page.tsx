'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, Plus, Trash2, Shield, Search, Eye, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface InternshipData {
  _id: string;
  internshipId: string;
  title: string;
  organization: string;
  mode: string;
  durationWeeks: number;
  validationFee: number;
  isPublished: boolean;
}

export default function AdminInternshipsPage() {
  const [internships, setInternships] = useState<InternshipData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchInternships = async () => {
    try {
      const res = await fetch('/api/admin/internships');
      const data = await res.json();
      if (data.internships) setInternships(data.internships);
    } catch (err) {
      console.error('Failed to load admin internships:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleDeleteInternship = async (id: string) => {
    if (!confirm('Are you sure you want to delete this internship program?')) return;
    try {
      const res = await fetch(`/api/admin/internships/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInternships((prev) => prev.filter((i) => i.internshipId !== id && i._id !== id));
      }
    } catch {
      alert('Failed to delete internship');
    }
  };

  const filteredInternships = internships.filter(
    (i) =>
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.internshipId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-soft-sm">
        <div>
          <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Internship Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Global Internship Programs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create internship programs, assign tasks, review student submissions, manage validation fees, and issue credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search internships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-purple-600"
            />
          </div>

          <Link href="/admin/internships/new">
            <Button variant="glow" size="md" className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Post New Internship</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Internships Table */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          Loading internship programs from database...
        </div>
      ) : filteredInternships.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200 space-y-3">
          <p>No internship programs found.</p>
          <Link href="/admin/internships/new">
            <Button variant="glow" size="sm">Create First Internship</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-soft-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase font-bold text-slate-500 text-[10px]">
                <tr>
                  <th className="p-4">Program Title</th>
                  <th className="p-4">Organization</th>
                  <th className="p-4">Mode / Duration</th>
                  <th className="p-4">Validation Fee</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredInternships.map((i) => (
                  <tr key={i._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 space-y-0.5">
                      <p className="font-bold text-slate-900">{i.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono">ID: {i.internshipId}</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-800">{i.organization}</td>
                    <td className="p-4 text-slate-600">{i.mode} • {i.durationWeeks} Weeks</td>
                    <td className="p-4 font-bold text-emerald-700">₹{i.validationFee || 499}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${i.isPublished ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {i.isPublished ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <Link href={`/admin/internships/${i.internshipId}`}>
                        <button className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold rounded-lg transition-colors flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>Review Submissions</span>
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDeleteInternship(i.internshipId)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
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
