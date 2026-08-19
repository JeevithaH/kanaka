import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#262626] text-[#c6c6c6] border-t border-[#393939] pt-12">
      <div className="max-w-[1584px] mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand */}
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-[0.1em] uppercase text-white mb-4">
              Skyrellac
            </span>
            <p className="text-sm text-[#c6c6c6] max-w-xs">
              Empowering learners with professional education, cutting-edge skills, and industry-recognized credentials.
            </p>
          </div>

          {/* Column 2: Platform links */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-sm font-semibold text-white mb-1">Platform</h3>
            <Link href="/learners" className="text-sm text-[#c6c6c6] hover:text-white transition-colors">
              Learners
            </Link>
            <Link href="/courses" className="text-sm text-[#c6c6c6] hover:text-white transition-colors">
              Courses
            </Link>
            <Link href="/paths" className="text-sm text-[#c6c6c6] hover:text-white transition-colors">
              Learning paths
            </Link>
          </div>

          {/* Column 3: Solutions links */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-sm font-semibold text-white mb-1">Solutions</h3>
            <Link href="/internships" className="text-sm text-[#c6c6c6] hover:text-white transition-colors">
              Internships
            </Link>
            <Link href="/credentials" className="text-sm text-[#c6c6c6] hover:text-white transition-colors">
              Credentials
            </Link>
            <Link href="/partners" className="text-sm text-[#c6c6c6] hover:text-white transition-colors">
              Partners
            </Link>
          </div>

          {/* Column 4: Company links */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-sm font-semibold text-white mb-1">Company</h3>
            <Link href="/about" className="text-sm text-[#c6c6c6] hover:text-white transition-colors">
              About us
            </Link>
            <Link href="/careers" className="text-sm text-[#c6c6c6] hover:text-white transition-colors">
              Careers
            </Link>
            <Link href="/contact" className="text-sm text-[#c6c6c6] hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#393939] py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#6f6f6f] text-xs mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Skyrellac. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-xs text-[#6f6f6f] hover:text-[#c6c6c6] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-[#6f6f6f] hover:text-[#c6c6c6] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
