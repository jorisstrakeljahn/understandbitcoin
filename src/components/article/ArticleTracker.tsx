'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  trackScrollDepth, 
  trackTimeOnArticle, 
  trackArticleView, 
  trackRelatedArticleClick 
} from '@/lib/analytics';

interface ArticleTrackerProps {
  slug: string;
  topic: string;
  level: string;
  children: React.ReactNode;
}

/**
 * Client component that tracks article engagement:
 * - Article view on mount
 * - Scroll depth milestones (25%, 50%, 75%, 100%)
 * - Time spent on article
 */
export function ArticleTracker({ slug, topic, level, children }: ArticleTrackerProps) {
  const trackedDepths = useRef<Set<25 | 50 | 75 | 100>>(new Set());
  const startTime = useRef<number>(0);
  const articleRef = useRef<HTMLDivElement>(null);
  const hasTrackedView = useRef(false);

  useEffect(() => {
    // Track article view on mount (only once)
    if (!hasTrackedView.current) {
      hasTrackedView.current = true;
      
      // Determine referrer type from URL or document.referrer
      let referrer: 'search' | 'topic' | 'home' | 'related' | 'direct' | 'sidebar' = 'direct';
      
      if (typeof window !== 'undefined') {
        const searchParams = new URLSearchParams(window.location.search);
        const refParam = searchParams.get('ref');
        
        if (refParam === 'search') referrer = 'search';
        else if (refParam === 'topic') referrer = 'topic';
        else if (refParam === 'home') referrer = 'home';
        else if (refParam === 'related') referrer = 'related';
        else if (refParam === 'sidebar') referrer = 'sidebar';
        else if (document.referrer) {
          // Try to determine from document.referrer
          const refUrl = new URL(document.referrer);
          if (refUrl.pathname.includes('/topics/')) referrer = 'topic';
          else if (refUrl.pathname.endsWith('/en') || refUrl.pathname.endsWith('/de') || refUrl.pathname === '/') referrer = 'home';
          else if (refUrl.pathname.includes('/search')) referrer = 'search';
        }
      }
      
      trackArticleView(slug, topic, level, referrer);
    }

    // Reset scroll tracking on mount
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
  }, [slug, topic, level]);

  return <div ref={articleRef}>{children}</div>;
}

interface RelatedArticle {
  slug: string;
  title: string;
  summary: string;
  level: string;
}

interface TrackedRelatedArticlesProps {
  currentSlug: string;
  articles: RelatedArticle[];
  locale: string;
  levelLabels: Record<string, string>;
  className?: string;
  cardClassName?: string;
  metaClassName?: string;
}

/**
 * Related articles grid with click tracking
 */
export function TrackedRelatedArticles({ 
  currentSlug, 
  articles, 
  locale, 
  levelLabels,
  className,
  cardClassName,
  metaClassName
}: TrackedRelatedArticlesProps) {
  const handleClick = (toSlug: string) => {
    trackRelatedArticleClick(currentSlug, toSlug);
  };

  return (
    <div className={className}>
      {articles.map((related) => (
        <Link
          key={related.slug}
          href={`/${locale}/articles/${related.slug}?ref=related`}
          className={cardClassName}
          onClick={() => handleClick(related.slug)}
        >
          <h3>{related.title}</h3>
          <p>{related.summary}</p>
          <span className={metaClassName}>
            {levelLabels[related.level] || related.level}
          </span>
        </Link>
      ))}
    </div>
  );
}
