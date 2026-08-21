'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  LayoutDashboard,
  BookOpen,
  Compass,
  FileCheck,
  Award,
  Briefcase,
  LogOut,
} from 'lucide-react';

export const StudentSidebar: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'all';
  const { logout } = useAuth();

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
  };

  const sections = [
    {
      title: 'OVERVIEW',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, tab: 'all' },
      ],
    },
    {
      title: 'LEARNING',
      items: [
        { name: 'My Courses', href: '/dashboard?tab=courses', icon: BookOpen, tab: 'courses' },
        { name: 'Learning Paths', href: '/learning-paths', icon: Compass },
        { name: 'Explore Catalog', href: '/courses', icon: Compass },
      ],
    },
    {
      title: 'ASSESSMENT',
      items: [
        { name: 'Tests & Quizzes', href: '/dashboard?tab=tasks', icon: FileCheck, tab: 'tasks' },
      ],
    },
    {
      title: 'CAREER',
      items: [
        { name: 'Internships', href: '/internships', icon: Briefcase },
        { name: 'Credentials', href: '/credentials', icon: Award },
      ],
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#efebe7] border-r border-[#ded7d0] flex flex-col justify-between p-4 sticky top-0 shrink-0 font-sans shadow-sm">
      <div className="space-y-6">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm shrink-0 border border-[#ded7d0] bg-white relative">
            <Image
              src="/images/logo.jpeg"
              alt="Skyrellac Logo"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <span className="text-base font-black tracking-wider text-[#261e18] uppercase">SKYRELLAC</span>
            <p className="text-[10px] text-[#80664f] font-semibold tracking-wider uppercase">Learner Space</p>
          </div>
        </Link>

        {/* Navigation Sections */}
        <nav className="space-y-5">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <h4 className="px-3 text-[10px] font-bold tracking-wider text-[#8a7f76] uppercase">
                {section.title}
              </h4>
              <div className="space-y-1 pt-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.tab
                    ? pathname === '/dashboard' && currentTab === item.tab
                    : pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#80664f] text-white shadow-sm'
                          : 'text-[#5f554d] hover:text-[#261e18] hover:bg-[#e2dbd4]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8a7f76]'}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer / Sign Out */}
      <div className="pt-4 border-t border-[#ded7d0] space-y-1">
        <button
          onClick={handleSignOut}
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#a83232] hover:bg-[#fae8e8] transition-colors text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
