'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  Home,
  BookOpen,
  Compass,
  FileCheck2,
  Award,
  Briefcase,
  LogOut,
  ExternalLink,
} from 'lucide-react';

function StudentSidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'all';
  const { logout, user } = useAuth();

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
  };

  const sections = [
    {
      title: 'MY LEARNING',
      items: [
        { name: 'Home', href: '/dashboard', icon: Home, tab: 'all' },
        { name: 'In Progress Courses', href: '/dashboard?tab=courses', icon: BookOpen, tab: 'courses' },
        { name: 'Learning Paths', href: '/learning-paths', icon: Compass },
      ],
    },
    {
      title: 'ACADEMICS & CAREER',
      items: [
        { name: 'Assignments & Tests', href: '/dashboard?tab=tasks', icon: FileCheck2, tab: 'tasks' },
        { name: 'Internships', href: '/internships', icon: Briefcase },
        { name: 'Accomplishments', href: '/credentials', icon: Award },
      ],
    },
    {
      title: 'EXPLORE',
      items: [
        { name: 'Course Catalog', href: '/courses', icon: ExternalLink },
      ],
    },
  ];

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'ST';

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col justify-between p-4 sticky top-0 shrink-0 font-sans">
      <div className="space-y-6">
        {/* Coursera-style Brand Header */}
        <Link href="/dashboard" className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-lg overflow-hidden shadow-sm shrink-0 border border-slate-200 bg-white relative">
            <Image
              src="/images/logo.jpeg"
              alt="Skyrellac"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-slate-900">Skyrellac</span>
            </div>
            <span className="text-[11px] font-semibold text-[#0056D2]">Learner Portal</span>
          </div>
        </Link>

        {/* Navigation Sections */}
        <nav className="space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              <h4 className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                {section.title}
              </h4>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.tab
                    ? pathname === '/dashboard' && currentTab === item.tab
                    : pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-all ${
                        isActive
                          ? 'bg-blue-50 text-[#0056D2] font-bold border-l-4 border-[#0056D2] shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-[#0056D2]' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* User profile snippet & Sign Out */}
      <div className="pt-4 border-t border-slate-200 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-[#0056D2] text-white flex items-center justify-center text-xs font-bold">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">{user?.name || 'Learner'}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email || ''}</p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}

export const StudentSidebar: React.FC = () => {
  return (
    <Suspense fallback={<aside className="w-64 min-h-screen bg-white border-r border-slate-200" />}>
      <StudentSidebarContent />
    </Suspense>
  );
};
