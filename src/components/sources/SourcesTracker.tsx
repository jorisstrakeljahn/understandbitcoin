'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { trackSourcesPageView, trackSourceTabChange } from '@/lib/analytics';

interface SourcesTrackerProps {
  activeTab: string;
  children: React.ReactNode;
}

/**
 * Tracks sources page view on mount
 */
export function SourcesTracker({ activeTab, children }: SourcesTrackerProps) {
  const hasTrackedView = useRef(false);
  const previousTab = useRef(activeTab);

  useEffect(() => {
    if (!hasTrackedView.current) {
      hasTrackedView.current = true;
      trackSourcesPageView(activeTab);
    }
  }, [activeTab]);

  // Track tab changes
  useEffect(() => {
    if (hasTrackedView.current && previousTab.current !== activeTab) {
      trackSourceTabChange(previousTab.current, activeTab);
      previousTab.current = activeTab;
    }
  }, [activeTab]);

  return <>{children}</>;
}

interface TrackedFilterLinkProps {
  href: string;
  fromTab: string;
  toTab: string;
  className?: string;
  children: React.ReactNode;
  'data-testid'?: string;
}

/**
 * Link that tracks filter/tab changes
 */
export function TrackedFilterLink({ 
  href, 
  fromTab, 
  toTab, 
  className, 
  children,
  'data-testid': testId
}: TrackedFilterLinkProps) {
  const handleClick = () => {
    if (fromTab !== toTab) {
      trackSourceTabChange(fromTab, toTab);
    }
  };

  return (
    <Link
      href={href}
      className={className}
      data-testid={testId}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
