'use client';
import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SigninRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const redirect = searchParams.get('redirect');
    router.replace(`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`);
  }, [router, searchParams]);
  return null;
}

export default function SigninRedirect() {
  return (
    <Suspense fallback={null}>
      <SigninRedirectContent />
    </Suspense>
  );
}
