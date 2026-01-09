'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initPostHog, trackPageView, isPostHogReady } from '@/lib/analytics';

interface PostHogProviderProps {
  children: React.ReactNode;
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialized = useRef(false);

  // Initialize PostHog on mount
  useEffect(() => {
    if (!initialized.current) {
      initPostHog();
      initialized.current = true;
    }
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (!isPostHogReady()) return;

    // Build the full URL
    const url = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    trackPageView(url);
  }, [pathname, searchParams]);

  return <>{children}</>;
}
