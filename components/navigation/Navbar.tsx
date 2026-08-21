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

  return (
    <header className="h-16 bg-white border-b border-[#e0e0e0] sticky top-0 z-50 font-sans">
      <div className="max-w-[1584px] mx-auto px-4 h-full flex items-center justify-between">

        {/* LEFT SECTION */}
        <div className="flex items-center h-full">

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden mr-4 flex flex-col justify-center items-center w-6 h-6 space-y-1"
            aria-label="Open menu"
          >
            <span className="block w-5 h-[2px] bg-[#161616]" />
            <span className="block w-5 h-[2px] bg-[#161616]" />
            <span className="block w-5 h-[2px] bg-[#161616]" />
          </button>

          {/* OVAL LOGO */}
        <Link
  href="/"
  className="mr-10 flex items-center gap-3 shrink-0"
>
  <Image
    src="/images/logo.jpeg"
    alt="Skyrellac EDU"
    width={70}
    height={70}
    priority
    className="h-[120px] w-[120px] object-contain"
  />

  <div className="flex flex-col justify-center leading-none">
    <span className="text-[14px] font-bold tracking-tight text-[#171717]">
      SKYRELLAC
    </span>

    <span className="mt-1 text-[9px] font-semibold tracking-[0.28em] text-[#8B623F]">
      EDU
    </span>
  </div>
</Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center h-full space-x-6">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm h-full flex items-center border-b-[2px] transition-colors ${
                    isActive
                      ? 'text-[#161616] border-[#80664f]'
                      : 'text-[#525252] hover:text-[#161616] border-transparent font-normal'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center space-x-4">

          {user ? (
            <>
              {/* Dashboard */}
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-[#80664f] hover:underline"
              >
                Dashboard ({user.name.split(' ')[0]})
              </Link>

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                type="button"
                className="bg-[#da1e28] text-white px-3.5 py-2 text-xs font-semibold hover:bg-[#b81922] transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                href="/login"
                className="text-sm text-[#161616] hover:text-[#80664f] transition-colors hidden md:block"
              >
                Log in
              </Link>

              {/* Sign Up */}
              <Link
                href="/register"
                className="bg-[#80664f] text-white px-4 py-2.5 text-sm hover:bg-[#5f4938] transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-72 bg-white shadow-lg flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MOBILE HEADER */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-[#e0e0e0]">

              {/* OVAL MOBILE LOGO */}
              <Link
                href="/"
                className="flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Image
                  src="/images/logo.jpeg"
                  alt="Skyrellac Logo"
                  width={160}
                  height={42}
                  priority
                  className="h-10 w-[160px] rounded-[50%] object-cover"
                />
              </Link>

              {/* Close Button */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#161616] p-2"
                aria-label="Close menu"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* MOBILE NAVIGATION */}
            <div className="flex flex-col py-5 px-5 space-y-5">

              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm ${
                      isActive
                        ? 'text-[#161616] font-semibold'
                        : 'text-[#525252] font-normal'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* MOBILE AUTH */}
              <div className="pt-5 mt-2 border-t border-[#e0e0e0] flex flex-col space-y-4">

                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-sm text-[#80664f] font-semibold"
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
                      className="text-sm text-[#da1e28] text-left font-semibold cursor-pointer"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-sm text-[#161616]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>

                    <Link
                      href="/register"
                      className="text-sm text-[#80664f] font-semibold"
                      onClick={() => setMobileMenuOpen(false)}
                    >
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