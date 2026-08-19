'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SignupRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const redirect = searchParams.get('redirect');
    router.replace(`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`);
  }, [router, searchParams]);
  return null;
}
