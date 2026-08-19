'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Shield, Search, UserCheck, UserX, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface UserData {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  accountStatus: 'active' | 'suspended' | 'deactivated';
  registrationDate: string;
  lastLogin?: string;
  profile?: {
    phone?: string;
    college?: string;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Selected user detail modal
  const [selectedUserDetail, setSelectedUserDetail] = useState<any>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleAccountStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, accountStatus: nextStatus }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, accountStatus: nextStatus } : u))
        );
      }
    } catch {
      alert('Failed to update account status');
    }
  };

  const viewUserFullDetails = async (userId: string) => {
    setIsLoadingDetail(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      const data = await res.json();
      setSelectedUserDetail(data);
    } catch {
      alert('Failed to load user details');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u._id.includes(searchQuery)
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-soft-sm">
        <div>
          <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Admin Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Registered Student Accounts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit user details, monitor enrollments, and toggle account activation status. Passwords are securely hashed.
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or User ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-purple-600"
          />
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          Loading student user accounts from database...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          No student accounts found.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-soft-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase font-bold text-slate-500 text-[10px]">
                <tr>
                  <th className="p-4">User ID & Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Registration Date</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 space-y-0.5">
                      <p className="font-bold text-slate-900">{u.fullName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">ID: {u._id}</p>
                    </td>
                    <td className="p-4 font-semibold">{u.email}</td>
                    <td className="p-4 text-slate-500">
                      {new Date(u.registrationDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          u.accountStatus === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {u.accountStatus || 'active'}
                      </span>
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => viewUserFullDetails(u._id)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => toggleAccountStatus(u._id, u.accountStatus || 'active')}
                        className={`px-3 py-1.5 font-bold rounded-lg transition-colors flex items-center gap-1 ${
                          u.accountStatus === 'active'
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {u.accountStatus === 'active' ? (
                          <>
                            <UserX className="w-3.5 h-3.5" />
                            <span>Suspend</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Activate</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Detail Inspection Modal */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-2xl w-full space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-600">User Audit View</span>
                <h3 className="text-xl font-bold text-slate-900">{selectedUserDetail.user.fullName}</h3>
                <p className="text-xs text-slate-500">{selectedUserDetail.user.email} • ID: {selectedUserDetail.user._id}</p>
              </div>
              <button onClick={() => setSelectedUserDetail(null)} className="text-slate-400 font-bold text-lg">✕</button>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Courses</span>
                <p className="text-lg font-bold text-slate-900">{selectedUserDetail.courseEnrollments?.length || 0}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Internships</span>
                <p className="text-lg font-bold text-slate-900">{selectedUserDetail.internshipEnrollments?.length || 0}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Payments</span>
                <p className="text-lg font-bold text-slate-900">{selectedUserDetail.payments?.length || 0}</p>
              </div>
            </div>

            {/* Detailed Lists */}
            <div className="space-y-4 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Enrolled Courses & Payment Status</h4>
              <div className="space-y-2">
                {selectedUserDetail.courseEnrollments?.map((ce: any) => (
                  <div key={ce._id} className="p-3 bg-slate-50 rounded-xl flex justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{ce.courseId}</p>
                      <p className="text-slate-500">Progress: {ce.progressPercentage}%</p>
                    </div>
                    <span className="font-bold text-emerald-700">{ce.paymentStatus}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={() => setSelectedUserDetail(null)} variant="secondary" size="md" className="w-full">
              Close Audit Window
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
