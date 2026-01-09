'use client';

import { useEffect, useRef } from 'react';
import { trackScrollDepth, trackTimeOnArticle } from '@/lib/analytics';

interface ScrollDepthTrackerProps {
  slug: string;
  children: React.ReactNode;
}

/**
 * Tracks scroll depth and time spent on an article
 */
export function ScrollDepthTracker({ slug, children }: ScrollDepthTrackerProps) {
  const trackedDepths = useRef<Set<25 | 50 | 75 | 100>>(new Set());
  const startTime = useRef<number>(0);
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset on mount and initialize time
    trackedDepths.current = new Set();
    startTime.current = Date.now();

    const handleScroll = () => {
      if (!articleRef.current) return;

      const element = articleRef.current;
      const windowHeight = window.innerHeight;
      const documentHeight = element.scrollHeight;
      const scrollTop = window.scrollY - element.offsetTop;
      
      // Calculate scroll percentage
      const scrollableHeight = documentHeight - windowHeight;
      if (scrollableHeight <= 0) return;
      
      const scrollPercentage = Math.min(100, Math.max(0, (scrollTop / scrollableHeight) * 100));

      // Track depth milestones
      const depths: (25 | 50 | 75 | 100)[] = [25, 50, 75, 100];
      for (const depth of depths) {
        if (scrollPercentage >= depth && !trackedDepths.current.has(depth)) {
          trackedDepths.current.add(depth);
          trackScrollDepth(slug, depth);
        }
      }
    };

    // Track time on article when leaving
    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
      trackTimeOnArticle(slug, timeSpent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Track time when component unmounts (navigation)
      const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
      if (timeSpent > 0) {
        trackTimeOnArticle(slug, timeSpent);
      }
    };
  }, [slug]);

  return <div ref={articleRef}>{children}</div>;
}
