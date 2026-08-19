import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';

export const metadata: Metadata = {
  title: 'Skyrellac — Learn. Build. Prove. Launch.',
  description: 'Build in-demand skills in AI, cybersecurity, data, and more. Free learning from a global leader in education and technology.',
  keywords: ['Skyrellac', 'Education', 'Skills', 'Courses', 'Internships', 'Certifications'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-[#161616] min-h-screen flex flex-col antialiased font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
