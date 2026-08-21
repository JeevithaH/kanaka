import React from 'react';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f5f2ef] text-[#1e1814]">
      <StudentSidebar />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-[1600px]">
        {children}
      </main>
    </div>
  );
}
