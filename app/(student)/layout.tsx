'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { useAuth } from '@/components/auth/AuthProvider';
import { Menu, X, LogOut, Home, BookOpen, Compass, FileCheck2, Briefcase, Award } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const handleSignOut = async () => {
    setMobileMenuOpen(false);
    await logout();
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'In Progress Courses', href: '/dashboard?tab=courses', icon: BookOpen },
    { name: 'Learning paths', href: '/learning-paths', icon: Compass },
    { name: 'Assignments & Tests', href: '/dashboard?tab=tasks', icon: FileCheck2 },
    { name: 'Internships', href: '/internships', icon: Briefcase },
    { name: 'Credentials', href: '/credentials', icon: Award },
    { name: 'Courses Catalog', href: '/courses', icon: Compass },
  ];

  return (
    <div className="min-h-screen bg-[#f7f5f3] text-[#241e1a] font-sans flex flex-col lg:flex-row">
      {/* ── MOBILE STUDENT TOPBAR (visible only on mobile) ──────────────── */}
      <div className="lg:hidden h-16 bg-white border-b border-[#e8e2db] px-4 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg text-[#161616] hover:bg-[#f4efe9] transition-colors cursor-pointer"
            aria-label="Open student navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-[#e8e2db] bg-white relative">
              <Image src="/images/logo.jpeg" alt="Skyrellac" fill className="object-cover" />
            </div>
            <span className="text-xs font-black tracking-wider text-[#241e1a]">SKYRELLAC EDU</span>
          </Link>
        </div>

        <button
          onClick={handleSignOut}
          className="text-xs font-bold text-white bg-[#da1e28] hover:bg-[#b81922] px-3 py-1.5 rounded-lg shadow-2xs cursor-pointer"
        >
          Sign out
        </button>
      </div>

      {/* ── MOBILE SLIDE-OUT DRAWER ─────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-16 px-4 border-b border-[#e8e2db] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-[#e8e2db] bg-white relative">
                  <Image src="/images/logo.jpeg" alt="Skyrellac" fill className="object-cover" />
                </div>
                <div className="leading-tight">
                  <p className="text-xs font-bold text-[#241e1a]">SKYRELLAC</p>
                  <p className="text-[9px] font-bold text-[#80664f]">STUDENT PORTAL</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#8a7f76] hover:text-[#241e1a] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {user && (
              <div className="p-4 bg-[#fbfaf8] border-b border-[#e8e2db]">
                <p className="text-xs font-bold text-[#241e1a] truncate">{user.name}</p>
                <p className="text-[10px] text-[#8a7f76] truncate">{user.email}</p>
              </div>
            )}

            <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (pathname === '/dashboard' && item.href.startsWith('/dashboard'));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-[#80664f] text-white shadow-xs'
                        : 'text-[#544940] hover:text-[#241e1a] hover:bg-[#f4efe9]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8a7f76]'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-[#e8e2db]">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#da1e28] rounded-xl shadow-2xs cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DESKTOP SIDEBAR (hidden on mobile, visible on desktop) ──────── */}
      <div className="hidden lg:block shrink-0">
        <StudentSidebar />
      </div>

      {/* ── MAIN CONTENT (100% width on mobile, nicely padded) ─────────── */}
      <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto max-w-[1600px] w-full min-w-0">
        {children}
      </main>
    </div>
  );
}
