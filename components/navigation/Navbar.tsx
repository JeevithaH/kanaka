'use client';

import { useState } from 'react';
import Link from 'next/link';
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

  return (
    <header className="h-12 bg-white border-b border-[#e0e0e0] sticky top-0 z-50 font-sans">
      <div className="max-w-[1584px] mx-auto px-4 h-full flex items-center justify-between">
        {/* Left section: Logo and Desktop Links */}
        <div className="flex items-center h-full">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden mr-4 flex flex-col justify-center items-center w-6 h-6 space-y-1"
            aria-label="Open menu"
          >
            <span className="block w-5 h-[2px] bg-[#161616]"></span>
            <span className="block w-5 h-[2px] bg-[#161616]"></span>
            <span className="block w-5 h-[2px] bg-[#161616]"></span>
          </button>

          {/* Logo */}
          <Link href="/" className="font-semibold text-sm tracking-[0.1em] uppercase text-[#161616] mr-8">
            Skyrellac
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center h-full space-x-6">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm h-full flex items-center border-b-[2px] transition-colors ${
                    isActive
                      ? 'text-[#161616] border-[#0f62fe]'
                      : 'text-[#525252] hover:text-[#161616] border-transparent font-normal'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right section: Auth buttons / User Profile */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-[#0f62fe] hover:underline"
              >
                Dashboard ({user.name.split(' ')[0]})
              </Link>
              <button
                onClick={handleSignOut}
                type="button"
                className="bg-[#da1e28] text-white px-3.5 py-1.5 text-xs font-semibold hover:bg-[#b81922] transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-[#161616] hover:text-[#0f62fe] transition-colors hidden md:block">
                Log in
              </Link>
              <Link
                href="/register"
                className="bg-[#0f62fe] text-white px-4 py-2 text-sm hover:bg-[#0043ce] transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between h-12 px-4 border-b border-[#e0e0e0]">
              <Link href="/" className="font-semibold text-sm tracking-[0.1em] uppercase text-[#161616]" onClick={() => setMobileMenuOpen(false)}>
                Skyrellac
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#161616] p-2"
                aria-label="Close menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="flex flex-col py-4 px-4 space-y-4">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm ${
                      isActive ? 'text-[#161616] font-medium' : 'text-[#525252] font-normal'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-4 mt-2 border-t border-[#e0e0e0] flex flex-col space-y-3">
                {user ? (
                  <>
                    <Link href="/dashboard" className="text-sm text-[#0f62fe] font-semibold" onClick={() => setMobileMenuOpen(false)}>
                      Go to Dashboard
                    </Link>
                    <button
                      onClick={async (e) => {
                        setMobileMenuOpen(false);
                        await handleSignOut(e);
                      }}
                      type="button"
                      className="text-sm text-[#da1e28] text-left font-semibold cursor-pointer"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-sm text-[#161616]" onClick={() => setMobileMenuOpen(false)}>
                      Log in
                    </Link>
                    <Link href="/register" className="text-sm text-[#0f62fe] font-semibold" onClick={() => setMobileMenuOpen(false)}>
                      Sign up
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
