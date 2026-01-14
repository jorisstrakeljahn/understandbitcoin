'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { trackEntryPointClick, trackPopularArticleClick, trackCTAClick } from '@/lib/analytics';

interface TrackedEntryPointLinkProps {
  href: string;
  entryPointId: string;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}

export function TrackedEntryPointLink({ 
  href, 
  entryPointId, 
  className, 
  style, 
  children 
}: TrackedEntryPointLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      style={style}
      onClick={() => trackEntryPointClick(entryPointId)}
    >
      {children}
    </Link>
  );
}

interface TrackedPopularArticleLinkProps {
  href: string;
  slug: string;
  topic: string;
  position: number;
  className?: string;
  children: ReactNode;
}

export function TrackedPopularArticleLink({ 
  href, 
  slug, 
  topic, 
  position, 
  className, 
  children 
}: TrackedPopularArticleLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackPopularArticleClick(slug, topic, position)}
    >
      {children}
    </Link>
  );
}

interface TrackedCTALinkProps {
  href: string;
  buttonName: string;
  location: string;
  children: ReactNode;
}

export function TrackedCTALink({ 
  href, 
  buttonName, 
  location, 
  children 
}: TrackedCTALinkProps) {
  return (
    <Link
      href={href}
      onClick={() => trackCTAClick(buttonName, location)}
    >
      {children}
    </Link>
  );
}
