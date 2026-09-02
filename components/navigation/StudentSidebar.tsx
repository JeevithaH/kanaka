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
        { name: 'Dashboard', href: '/dashboard', icon: Home, tab: 'all' },
        { name: 'In Progress Courses', href: '/dashboard?tab=courses', icon: BookOpen, tab: 'courses' },
        { name: 'Learning paths', href: '/learning-paths', icon: Compass },
      ],
    },
    {
      title: 'ACADEMICS & CAREER',
      items: [
        { name: 'Assignments & Tests', href: '/dashboard?tab=tasks', icon: FileCheck2, tab: 'tasks' },
        { name: 'Internships', href: '/internships', icon: Briefcase },
        { name: 'Credentials', href: '/credentials', icon: Award },
      ],
    },
    {
      title: 'EXPLORE',
      items: [
        { name: 'Courses Catalog', href: '/courses', icon: ExternalLink },
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
    <aside className="w-64 min-h-screen bg-white border-r border-[#e8e2db] flex flex-col justify-between p-4 sticky top-0 shrink-0 font-sans shadow-xs">
      <div className="space-y-6">
        {/* Brand Header matching screenshot */}
        <Link href="/" className="flex items-center gap-3 px-2 py-2">
          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-[#e8e2db] bg-white relative shadow-xs">
            <Image
              src="/images/logo.jpeg"
              alt="Skyrellac Logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-wider text-[#241e1a] uppercase">SKYRELLAC</span>
            <span className="text-[10px] font-bold text-[#80664f] tracking-widest uppercase">EDU • LEARNER</span>
          </div>
        </Link>

        {/* Navigation Sections */}
        <nav className="space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              <h4 className="px-3 text-[10px] font-bold tracking-wider text-[#8c8075] uppercase">
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
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#80664f] text-white shadow-xs'
                          : 'text-[#544940] hover:text-[#241e1a] hover:bg-[#f4efe9]'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-white' : 'text-[#8c8075]'
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

      {/* User profile snippet & Red Sign Out Button matching screenshot */}
      <div className="pt-4 border-t border-[#e8e2db] space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-[#80664f] text-white flex items-center justify-center text-xs font-bold shadow-xs">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#241e1a] truncate">{user?.name || 'Preetham H'}</p>
            <p className="text-[10px] text-[#8c8075] truncate">{user?.email || ''}</p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          type="button"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-white bg-[#da1e28] hover:bg-[#b81922] transition-colors cursor-pointer shadow-xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}

export const StudentSidebar: React.FC = () => {
  return (
    <Suspense fallback={<aside className="w-64 min-h-screen bg-white border-r border-[#e8e2db]" />}>
      <StudentSidebarContent />
    </Suspense>
  );
};
