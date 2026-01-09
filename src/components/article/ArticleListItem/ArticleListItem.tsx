import Link from 'next/link';
import { FileText } from '@/components/icons';
import styles from './ArticleListItem.module.css';

export interface ArticleListItemProps {
  slug: string;
  title: string;
  summary?: string;
  locale: string;
  /** Compact mode hides the summary */
  variant?: 'default' | 'compact';
  className?: string;
}

/**
 * A reusable article list item used in topic pages and sidebars.
 * Provides consistent styling and behavior for article links.
 */
export function ArticleListItem({ 
  slug, 
  title, 
  summary, 
  locale,
  variant = 'default',
  className = '',
}: ArticleListItemProps) {
  const isCompact = variant === 'compact';
  
  return (
    <Link 
      href={`/${locale}/articles/${slug}`}
      className={`${styles.item} ${isCompact ? styles.compact : ''} ${className}`}
    >
      <FileText size={isCompact ? 12 : 14} className={styles.icon} />
      <div className={styles.content}>
        <span className={styles.title}>{title}</span>
        {!isCompact && summary && (
          <span className={styles.summary}>{summary}</span>
        )}
      </div>
    </Link>
  );
}
