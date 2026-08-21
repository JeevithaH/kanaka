'use client';
import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SignupRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const redirect = searchParams.get('redirect');
    router.replace(`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`);
  }, [router, searchParams]);
  return null;
}

export default function SignupRedirect() {
  return (
    <Suspense fallback={null}>
      <SignupRedirectContent />
    </Suspense>
  );
}
