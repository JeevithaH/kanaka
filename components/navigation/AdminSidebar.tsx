'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  FileText,
  Compass,
  Tags,
  FileCheck,
  HelpCircle,
  Briefcase,
  UserCheck,
  Users,
  ShieldAlert,
  Award,
  BarChart3,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const sections = [
    {
      title: 'OVERVIEW',
      items: [
        { name: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      title: 'CONTENT',
      items: [
        { name: 'Courses', href: '/admin/courses', icon: BookOpen },
        { name: 'Modules & Lessons', href: '/admin/modules', icon: FolderTree },
        { name: 'Learning Paths', href: '/admin/learning-paths', icon: Compass },
        { name: 'Categories & Skills', href: '/admin/categories', icon: Tags },
      ],
    },
    {
      title: 'ASSESSMENT',
      items: [
        { name: 'Test Builder', href: '/admin/tests', icon: FileCheck },
        { name: 'Questions Bank', href: '/admin/questions', icon: FileText },
        { name: 'Student Results', href: '/admin/results', icon: BarChart3 },
      ],
    },
    {
      title: 'CAREER',
      items: [
        { name: 'Internships', href: '/admin/internships', icon: Briefcase },
        { name: 'Applications Review', href: '/admin/applications', icon: UserCheck },
      ],
    },
    {
      title: 'USERS & CREDENTIALS',
      items: [
        { name: 'Students', href: '/admin/students', icon: Users },
        { name: 'Credentials Issued', href: '/admin/credentials', icon: Award },
      ],
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-surface border-r border-border/80 flex flex-col justify-between p-4 sticky top-0">
      <div className="space-y-6">
        {/* Brand Admin Header */}
        <Link href="/admin" className="flex items-center gap-2.5 px-2 py-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-glow-indigo">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white">SKYRELLAC</span>
            <span className="text-[10px] font-bold text-purple-400 tracking-wider uppercase">Admin Control</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="space-y-5">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <h4 className="px-2 text-[10px] font-bold tracking-wider text-text-muted uppercase">
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
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-purple-600/15 text-purple-400 border border-purple-500/20'
                          : 'text-text-secondary hover:text-white hover:bg-surface-hover'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-text-muted'}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Sign Out */}
      <div className="pt-4 border-t border-border/60">
        <Link
          href="/login"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Admin</span>
        </Link>
      </div>
    </aside>
  );
};
