'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Compass,
  FileCheck,
  Award,
  Briefcase,
  UserCheck,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Sparkles,
} from 'lucide-react';

export const StudentSidebar: React.FC = () => {
  const pathname = usePathname();

  const sections = [
    {
      title: 'OVERVIEW',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'LEARNING',
      items: [
        { name: 'My Courses', href: '/dashboard/courses', icon: BookOpen },
        { name: 'Learning Paths', href: '/learning-paths', icon: Compass },
        { name: 'Explore Catalog', href: '/courses', icon: Compass },
      ],
    },
    {
      title: 'ASSESSMENT',
      items: [
        { name: 'Tests & Quizzes', href: '/dashboard/tests', icon: FileCheck },
      ],
    },
    {
      title: 'CAREER',
      items: [
        { name: 'Internships', href: '/internships', icon: Briefcase },
        { name: 'Applications', href: '/dashboard/applications', icon: UserCheck },
        { name: 'Credentials', href: '/dashboard/credentials', icon: Award },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { name: 'Skill Profile', href: '/dashboard/profile', icon: User },
      ],
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col justify-between p-4 sticky top-0 shadow-soft-sm">
      <div className="space-y-6">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-2.5 px-2 py-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-soft-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900">SKYRELLAC</span>
        </Link>

        {/* Navigation Sections */}
        <nav className="space-y-5">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <h4 className="px-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {section.title}
              </h4>
              <div className="space-y-0.5 pt-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
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
      <div className="pt-4 border-t border-slate-100 space-y-1">
        <Link
          href="/login"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
};
