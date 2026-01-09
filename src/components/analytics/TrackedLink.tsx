'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface TrackedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * A Link component that calls a tracking function before navigating
 */
export function TrackedLink({ 
  href, 
  children, 
  className, 
  style,
  onClick 
}: TrackedLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      style={style}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
