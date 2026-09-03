'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

const NAV_LINKS = [
  { name: 'Courses', href: '/courses' },
  { name: 'Learning paths', href: '/learning-paths' },
  { name: 'Internships', href: '/internships' },
  { name: 'Credentials', href: '/credentials' },
  { name: 'Pricing', href: '/pricing' },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
  };

  const displayName = user?.name
    ? user.name.includes('@')
      ? user.name.split('@')[0]
      : user.name.split(' ')[0]
    : 'User';

  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-[#e5dfd7] sticky top-0 z-50 font-sans">
      <div className="max-w-[1584px] mx-auto px-3 sm:px-6 h-full flex items-center justify-between">

        {/* ── LEFT SECTION: Hamburger + Crest Logo + Desktop Brand & Nav ── */}
        <div className="flex items-center h-full">

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden mr-2 p-1.5 rounded-lg text-[#161616] hover:bg-[#f4efe9] transition-colors shrink-0 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 mr-4 lg:mr-8"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden shrink-0 border border-[#e5dfd7] bg-white relative shadow-2xs">
              <Image
                src="/images/logo.jpeg"
                alt="Skyrellac EDU"
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Brand text: hidden on mobile phones to guarantee zero text collision, shown on desktop */}
            <div className="hidden md:flex flex-col justify-center leading-none">
              <span className="text-sm font-bold tracking-tight text-[#171717]">
                SKYRELLAC
              </span>
              <span className="mt-0.5 text-[9px] font-bold tracking-[0.2em] text-[#80664f]">
                EDU
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center h-full space-x-1 lg:space-x-4">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs lg:text-sm px-2.5 py-1.5 rounded-md transition-colors ${
                    isActive
                      ? 'text-[#161616] font-bold bg-[#f4efe9]'
                      : 'text-[#544940] hover:text-[#161616] hover:bg-[#faf7f5] font-medium'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ── RIGHT SECTION: User Profile / Auth ── */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {user ? (
            <>
              {/* Mobile Circular Avatar (Takes only 32px on phones, zero overlap possible!) */}
              <Link
                href="/dashboard"
                className="md:hidden w-8 h-8 rounded-full bg-[#80664f] text-white flex items-center justify-center text-xs font-bold shadow-2xs shrink-0"
                title={`Dashboard (${displayName})`}
              >
                {userInitial}
              </Link>

              {/* Desktop Dashboard Text Link */}
              <Link
                href="/dashboard"
                className="hidden md:flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#80664f] hover:text-[#5f4938] px-2.5 py-1.5 rounded-lg hover:bg-[#f4efe9] transition-colors shrink-0"
              >
                <span>Dashboard ({displayName})</span>
              </Link>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                type="button"
                className="bg-[#da1e28] hover:bg-[#b81922] text-white px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs shrink-0"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                href="/login"
                className="text-xs sm:text-sm font-semibold text-[#161616] hover:text-[#80664f] px-2 sm:px-3 py-1.5 transition-colors"
              >
                Log in
              </Link>

              {/* Sign Up */}
              <Link
                href="/register"
                className="bg-[#80664f] hover:bg-[#5f4938] text-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors shadow-2xs shrink-0"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── MOBILE MENU DRAWER (Full navigation on tap) ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-[#e5dfd7]">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-[#e5dfd7] bg-white relative">
                  <Image
                    src="/images/logo.jpeg"
                    alt="Skyrellac"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-xs font-bold text-[#171717] tracking-tight">SKYRELLAC</span>
                  <span className="text-[8px] font-bold text-[#80664f] tracking-widest mt-0.5">EDU PORTAL</span>
                </div>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#161616] p-2 hover:bg-[#f4efe9] rounded-lg cursor-pointer"
                aria-label="Close menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* User Profile in Drawer */}
            {user && (
              <div className="p-4 bg-[#fbfaf8] border-b border-[#e5dfd7] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#80664f] text-white flex items-center justify-center text-xs font-bold shadow-2xs shrink-0">
                  {userInitial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#161616] truncate">{user.name}</p>
                  <p className="text-[10px] text-[#8a7f76] truncate">{user.email}</p>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="flex flex-col py-4 px-3 space-y-1 flex-1 overflow-y-auto">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-[#f4efe9] text-[#80664f] font-bold'
                        : 'text-[#544940] hover:text-[#161616] hover:bg-[#faf7f5] font-medium'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* Auth Actions in Drawer */}
              <div className="pt-4 mt-2 border-t border-[#e5dfd7] flex flex-col space-y-2">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="px-3 py-2.5 rounded-lg text-sm text-[#80664f] font-bold hover:bg-[#f4efe9]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Go to Dashboard
                    </Link>

                    <button
                      onClick={async (e) => {
                        setMobileMenuOpen(false);
                        await handleSignOut(e);
                      }}
                      type="button"
                      className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-[#da1e28] font-bold hover:bg-rose-50 cursor-pointer"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-3 py-2 rounded-lg text-sm text-[#161616] font-semibold hover:bg-[#f4efe9]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>

                    <Link
                      href="/register"
                      className="px-3 py-2.5 rounded-lg text-sm text-white bg-[#80664f] font-bold text-center shadow-2xs"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign up for free
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}