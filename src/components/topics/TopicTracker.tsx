'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { trackTopicView, trackTopicSelect } from '@/lib/analytics';

interface TopicTrackerProps {
  topic: string;
  children: React.ReactNode;
}

/**
 * Tracks topic page view on mount
 */
export function TopicTracker({ topic, children }: TopicTrackerProps) {
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (!hasTrackedView.current) {
      hasTrackedView.current = true;
      trackTopicView(topic);
    }
  }, [topic]);

  return <>{children}</>;
}

interface TrackedTopicLinkProps {
  href: string;
  topic: string;
  source: 'home' | 'sidebar' | 'header';
  className?: string;
  children: React.ReactNode;
  'data-testid'?: string;
}

/**
 * Link that tracks topic selection
 */
export function TrackedTopicLink({ 
  href, 
  topic, 
  source, 
  className, 
  children,
  'data-testid': testId
}: TrackedTopicLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      data-testid={testId}
      onClick={() => trackTopicSelect(topic, source)}
    >
      {children}
    </Link>
  );
}
