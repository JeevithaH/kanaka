'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Briefcase,
  CheckSquare,
  Award,
  IndianRupee,
  Tag,
  LogOut,
  Shield,
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
  };

  const sections = [
    {
      title: 'EXECUTIVE OVERVIEW',
      items: [
        { name: 'Executive Console', href: '/admin', icon: LayoutDashboard },
        { name: 'Student Users', href: '/admin/users', icon: Users },
      ],
    },
    {
      title: 'CONTENT MANAGEMENT',
      items: [
        { name: 'Courses CMS', href: '/admin/courses', icon: BookOpen },
        { name: 'Internship Programs', href: '/admin/internships', icon: Briefcase },
        { name: 'Task Assignments', href: '/admin/tasks', icon: CheckSquare },
      ],
    },
    {
      title: 'CREDENTIALS & FINANCE',
      items: [
        { name: 'Issued Certificates', href: '/admin/certificates', icon: Award },
        { name: 'Payments Audit', href: '/admin/payments', icon: IndianRupee },
        { name: 'Promo Coupons', href: '/admin/coupons', icon: Tag },
      ],
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col justify-between p-4 sticky top-0 font-sans shrink-0">
      <div className="space-y-6">
        {/* Brand Admin Header */}
        <Link href="/admin" className="flex items-center gap-2.5 px-2 py-2">
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center shadow-lg">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-white">SKYRELLAC</span>
            <span className="text-[10px] font-bold text-purple-400 tracking-wider uppercase">Executive Admin</span>
          </div>
        </Link>

        {/* Navigation */}
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
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
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
      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={handleSignOut}
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
