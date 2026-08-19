'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SigninRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const redirect = searchParams.get('redirect');
    router.replace(`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`);
  }, [router, searchParams]);
  return null;
}
