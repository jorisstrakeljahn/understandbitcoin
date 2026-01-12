import { ReactNode, CSSProperties } from 'react';
import styles from './Badge.module.css';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  style?: CSSProperties;
}

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  style,
}: BadgeProps) {
  const classNames = [
    styles.badge,
    styles[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={classNames} style={style} data-testid="badge">{children}</span>;
}
